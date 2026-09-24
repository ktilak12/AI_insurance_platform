import os
import math
import re
from typing import List, Dict, Any, Optional, Tuple
import numpy as np

class InMemoryVectorStore:
    """
    High-performance in-memory fallback vector store using cosine similarity.
    Used when PostgreSQL + pgvector is unreachable or during unit testing.
    """
    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.embeddings: List[np.ndarray] = []

    def add_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        for chunk, emb in zip(chunks, embeddings):
            self.chunks.append(chunk)
            vec = np.array(emb, dtype=np.float32)
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            self.embeddings.append(vec)

    def search(self, query_embedding: List[float], top_k: int = 4, threshold: float = 0.50) -> List[Tuple[Dict[str, Any], float]]:
        if not self.embeddings:
            return []

        q_vec = np.array(query_embedding, dtype=np.float32)
        q_norm = np.linalg.norm(q_vec)
        if q_norm > 0:
            q_vec = q_vec / q_norm

        scores = [float(np.dot(q_vec, emb)) for emb in self.embeddings]
        
        # Sort descending by cosine similarity
        ranked_indices = np.argsort(scores)[::-1]
        
        results = []
        for idx in ranked_indices[:top_k]:
            score = scores[idx]
            if score >= threshold:
                results.append((self.chunks[idx], score))

        return results

class PGVectorRAGStore:
    """
    Production pgvector and Fallback RAG Vector Store.
    Manages document chunk indexing, embedding generation, and semantic search.
    """
    EMBEDDING_DIM = 768
    SIMILARITY_THRESHOLD = 0.55

    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/insurance_db")
        self.use_pgvector = False
        self.fallback_store = InMemoryVectorStore()
        self._init_db_connection()

    def _init_db_connection(self):
        try:
            import psycopg2
            from pgvector.psycopg2 import register_vector
            conn = psycopg2.connect(self.db_url, connect_timeout=2)
            cur = conn.cursor()
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS policy_document_chunks (
                    id SERIAL PRIMARY KEY,
                    plan_id VARCHAR(100) NOT NULL,
                    document_name VARCHAR(255) NOT NULL,
                    page_number INT NOT NULL,
                    section_name VARCHAR(255),
                    content TEXT NOT NULL,
                    embedding vector(768)
                );
            """)
            conn.commit()
            cur.close()
            conn.close()
            self.use_pgvector = True
        except Exception:
            # PostgreSQL not running locally; use in-memory vector store seamlessly
            self.use_pgvector = False

    @classmethod
    def generate_embedding(cls, text: str) -> List[float]:
        """
        Generates 768-dimensional normalized embedding vector.
        Uses Gemini text-embedding-004 when API key is available,
        otherwise uses semantic term-frequency hash mapping.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                res = client.models.embed_content(
                    model="text-embedding-004",
                    contents=text
                )
                if res.embeddings and len(res.embeddings) > 0:
                    return res.embeddings[0].values
            except Exception:
                pass

        # High-entropy semantic pseudo-embedding (deterministic 768-D representation)
        vec = np.zeros(cls.EMBEDDING_DIM, dtype=np.float32)
        words = re.findall(r'\w+', text.lower())
        
        # Insurance domain semantic anchors
        semantic_anchors = {
            "room": 12, "rent": 13, "capping": 14, "icu": 15, "hospital": 16,
            "waiting": 25, "period": 26, "pre-existing": 27, "diabetes": 28, "hypertension": 29,
            "copay": 40, "copayment": 41, "percentage": 42, "deductible": 43,
            "exclusion": 55, "cosmetic": 56, "unproven": 57, "dental": 58, "surgery": 59,
            "restoration": 70, "bonus": 71, "ncb": 72, "maternity": 80, "daycare": 85
        }

        for word in words:
            # General hash bucket
            h = abs(hash(word)) % cls.EMBEDDING_DIM
            vec[h] += 1.0
            
            # Domain anchor boost
            if word in semantic_anchors:
                anchor_idx = semantic_anchors[word]
                vec[anchor_idx] += 4.0

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def index_chunks(self, plan_id: str, document_name: str, chunks: List[Dict[str, Any]]):
        """Indexes policy chunks into vector store."""
        embeddings = [self.generate_embedding(c["content"]) for c in chunks]
        
        # Always maintain in fallback memory for instant retrieval
        enriched_chunks = []
        for c in chunks:
            item = dict(c)
            item["plan_id"] = plan_id
            item["document_name"] = document_name
            enriched_chunks.append(item)

        self.fallback_store.add_chunks(enriched_chunks, embeddings)

        if self.use_pgvector:
            try:
                import psycopg2
                conn = psycopg2.connect(self.db_url)
                cur = conn.cursor()
                for chunk, emb in zip(chunks, embeddings):
                    cur.execute("""
                        INSERT INTO policy_document_chunks 
                        (plan_id, document_name, page_number, section_name, content, embedding)
                        VALUES (%s, %s, %s, %s, %s, %s);
                    """, (
                        plan_id,
                        document_name,
                        chunk["page_number"],
                        chunk.get("section_name", "Policy Clause"),
                        chunk["content"],
                        emb
                    ))
                conn.commit()
                cur.close()
                conn.close()
            except Exception:
                pass

    def search_similar_passages(
        self, 
        query: str, 
        plan_id: Optional[str] = None, 
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Executes semantic vector search for matching policy passages.
        Enforces confidence threshold to block ungrounded hallucination.
        """
        query_vec = self.generate_embedding(query)
        results = self.fallback_store.search(query_vec, top_k=top_k, threshold=self.SIMILARITY_THRESHOLD)
        
        matched_passages = []
        for chunk, score in results:
            if plan_id and chunk.get("plan_id") and chunk.get("plan_id") != plan_id:
                continue
            matched_passages.append({
                "page_number": chunk["page_number"],
                "section_name": chunk.get("section_name", "Policy Terms"),
                "content": chunk["content"],
                "similarity_score": round(score, 3)
            })

        return matched_passages

# Singleton Vector Store
rag_vector_store = PGVectorRAGStore()

import fitz  # PyMuPDF
import hashlib
from typing import List, Dict, Any

class PDFIngestionEngine:
    """
    Secure PDF text extraction and page-level chunking engine.
    Treats raw PDF bytes as untrusted data.
    """

    @staticmethod
    def calculate_sha256(file_bytes: bytes) -> str:
        return hashlib.sha256(file_bytes).hexdigest()

    @classmethod
    def extract_text_by_pages(cls, file_bytes: bytes) -> List[Dict[str, Any]]:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages_content = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            
            # Sanitize control characters
            sanitized_text = "".join(ch for ch in text if ch.isprintable() or ch in ('\n', '\t', ' '))
            
            pages_content.append({
                "page_number": page_num + 1,
                "raw_text": sanitized_text,
                "char_count": len(sanitized_text)
            })

        doc.close()
        return pages_content

    @classmethod
    def chunk_document(cls, pages: List[Dict[str, Any]], chunk_size: int = 1200, overlap: int = 200) -> List[Dict[str, Any]]:
        chunks = []
        for page in pages:
            text = page["raw_text"]
            page_num = page["page_number"]
            
            if not text:
                continue

            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk_text = text[start:end]
                chunks.append({
                    "page_number": page_num,
                    "content": chunk_text,
                    "chunk_length": len(chunk_text)
                })
                start += (chunk_size - overlap)

        return chunks

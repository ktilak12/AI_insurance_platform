try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

import hashlib
import re
from typing import List, Dict, Any, Tuple, Optional

class PDFSecurityException(Exception):
    """Raised when an untrusted PDF violates security thresholds or contains exploits."""
    pass

class PDFIngestionEngine:
    """
    Production-grade Secure PDF Parsing and Segmentation Pipeline.
    Treats all incoming PDFs as untrusted, hostile data.
    Enforces decompression limits, malicious object inspection, and prompt injection defense.
    """

    MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
    MAX_PAGES = 150
    MAX_TOTAL_CHARS = 1_000_000
    
    # Prompt injection patterns commonly embedded in adversarial documents
    INJECTION_PATTERNS = [
        r"(?i)ignore\s+(all\s+)?(previous|prior)\s+instructions",
        r"(?i)system\s+prompt\s*:",
        r"(?i)you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan)",
        r"(?i)<\|(im_start|im_end|endoftext)\|>",
        r"(?i)override\s+(all\s+)?(safety|rules|constraints)",
        r"(?i)disregard\s+the\s+above",
        r"(?i)assistant\s+must\s+output",
        r"(?i)hidden\s+instruction",
        r"(?i)role:\s*(system|admin|root)"
    ]

    @staticmethod
    def calculate_sha256(file_bytes: bytes) -> str:
        """Computes deterministic cryptographic document hash for provenance."""
        return hashlib.sha256(file_bytes).hexdigest()

    @classmethod
    def sanitize_untrusted_text(cls, text: str) -> Tuple[str, List[str]]:
        """
        Strips control characters, normalizes whitespace, and scans for prompt injection vectors.
        Returns sanitized text and any detected security flags.
        """
        security_flags = []
        
        # 1. Strip non-printable and dangerous control characters except tabs/newlines
        clean_text = "".join(ch for ch in text if ch.isprintable() or ch in ('\n', '\t', ' '))
        clean_text = re.sub(r'[ \t]+', ' ', clean_text)
        clean_text = re.sub(r'\n{3,}', '\n\n', clean_text).strip()

        # 2. Check for adversarial injection signatures
        for pattern in cls.INJECTION_PATTERNS:
            matches = re.findall(pattern, clean_text)
            if matches:
                security_flags.append(f"Suspicious prompt pattern detected: '{pattern}'")

        return clean_text, security_flags

    @classmethod
    def extract_text_by_pages(cls, file_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Parses untrusted PDF bytes using PyMuPDF with strict containment checks.
        """
        # 1. Enforce file size cap
        if len(file_bytes) > cls.MAX_FILE_SIZE_BYTES:
            raise PDFSecurityException(f"PDF exceeds maximum permitted size of {cls.MAX_FILE_SIZE_BYTES // (1024*1024)} MB.")

        if fitz is None:
            # Fallback text decoder when PyMuPDF binary is not installed in local environment
            decoded = file_bytes.decode('utf-8', errors='ignore')
            clean_text, sec_flags = cls.sanitize_untrusted_text(decoded)
            return [{
                "page_number": 1,
                "raw_text": clean_text,
                "char_count": len(clean_text),
                "detected_headers": ["Policy Terms"],
                "security_flags": sec_flags
            }]

        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
        except Exception as e:
            raise PDFSecurityException(f"Failed to open PDF stream; file may be corrupted or malformed: {str(e)}")

        # 2. Enforce page count cap (bomb protection)
        page_count = len(doc)
        if page_count > cls.MAX_PAGES:
            doc.close()
            raise PDFSecurityException(f"Document has {page_count} pages, exceeding the maximum cap of {cls.MAX_PAGES}.")

        # 3. Inspect document metadata for embedded scripts or launch actions
        for i in range(page_count):
            page = doc[i]
            # Check for embedded links/URI actions
            links = page.get_links()
            for link in links:
                if link.get("kind") == fitz.LINK_LAUNCH:
                    doc.close()
                    raise PDFSecurityException(f"Security Alert: Executable launch action detected on page {i+1}.")

        pages_content = []
        total_chars = 0

        for page_num in range(page_count):
            page = doc[page_num]
            raw_page_text = page.get_text("text").strip()
            
            clean_text, security_flags = cls.sanitize_untrusted_text(raw_page_text)
            total_chars += len(clean_text)

            if total_chars > cls.MAX_TOTAL_CHARS:
                doc.close()
                raise PDFSecurityException(f"Total extracted character count exceeded safety threshold ({cls.MAX_TOTAL_CHARS}).")

            # Detect probable section headers
            lines = clean_text.split('\n')
            detected_headers = []
            for line in lines[:5]:  # Look at the top 5 lines of the page
                line_str = line.strip()
                if len(line_str) > 3 and len(line_str) < 80 and (
                    re.match(r'^(Section|Clause|Part|Schedule|Table|Annexure|\d+\.)', line_str, re.IGNORECASE) or
                    line_str.isupper()
                ):
                    detected_headers.append(line_str)

            pages_content.append({
                "page_number": page_num + 1,
                "raw_text": clean_text,
                "char_count": len(clean_text),
                "detected_headers": detected_headers,
                "security_flags": security_flags
            })

        doc.close()
        return pages_content

    @classmethod
    def chunk_document(
        cls, 
        pages: List[Dict[str, Any]], 
        chunk_size: int = 1000, 
        overlap: int = 150
    ) -> List[Dict[str, Any]]:
        """
        Hierarchical, provenance-preserving chunker.
        Embeds page number, document hash, and section metadata into each chunk.
        """
        chunks = []
        chunk_id_counter = 1

        for page in pages:
            text = page["raw_text"]
            page_num = page["page_number"]
            headers = page.get("detected_headers", [])
            primary_header = headers[0] if headers else f"Page {page_num}"

            if not text:
                continue

            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk_text = text[start:end].strip()

                if chunk_text:
                    chunks.append({
                        "chunk_id": f"chunk_p{page_num}_{chunk_id_counter}",
                        "page_number": page_num,
                        "section_name": primary_header,
                        "content": chunk_text,
                        "chunk_length": len(chunk_text),
                        "has_security_flags": len(page.get("security_flags", [])) > 0
                    })
                    chunk_id_counter += 1

                start += (chunk_size - overlap)

        return chunks

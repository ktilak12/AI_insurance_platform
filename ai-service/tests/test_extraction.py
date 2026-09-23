import pytest
from app.extraction.pdf_parser import PDFIngestionEngine
from app.rag.qa_engine import PolicyQAService

def test_sha256_calculation():
    test_bytes = b"Sample Insurance Policy Content"
    file_hash = PDFIngestionEngine.calculate_sha256(test_bytes)
    assert isinstance(file_hash, str)
    assert len(file_hash) == 64

def test_grounded_qa_with_empty_passages():
    response = PolicyQAService.generate_grounded_answer("Does it cover dental?", [])
    assert response.is_grounded is False
    assert "couldn't verify" in response.answer.lower()
    assert len(response.citations) == 0

def test_grounded_qa_with_evidence():
    passages = [
        {
            "page_number": 24,
            "section_name": "Exclusions",
            "content": "Dental treatment is excluded unless necessitated by accidental bodily injury."
        }
    ]
    response = PolicyQAService.generate_grounded_answer("Is dental covered?", passages)
    assert response.is_grounded is True
    assert len(response.citations) == 1
    assert response.citations[0].page_number == 24

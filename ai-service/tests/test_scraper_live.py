import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.extraction.web_scraper import DocumentWebScraper, ScrapingSecurityException

class TestLiveAndUnitWebScraper(unittest.TestCase):
    def test_ssrf_blocking(self):
        blocked_urls = [
            "http://127.0.0.1/secret",
            "http://localhost:8080/admin",
            "http://169.254.169.254/latest/meta-data/",
            "http://192.168.1.100/router",
            "http://10.0.0.1/db",
            "ftp://example.com/file.pdf",
            "file:///etc/passwd"
        ]
        for url in blocked_urls:
            with self.assertRaises(ScrapingSecurityException, msg=f"Should have blocked SSRF for {url}"):
                DocumentWebScraper.validate_url_safety(url)
        print("SSRF Protection Tests Passed: All 7 malicious / private URLs blocked.")

    def test_html_cleaning(self):
        sample_html = b"<html><head><title>HDFC Ergo Optima Secure</title><script>alert('xss')</script><style>.body{color:red}</style></head><body><h1>HDFC Ergo Optima Secure Policy</h1><p>Sum Insured: Rs. 10 Lakhs. No room rent capping. 24 months waiting period for pre-existing diseases.</p></body></html>"
        
        # Test cleaning logic
        text, content_type = DocumentWebScraper.scrape_policy_text_from_bytes(sample_html, "text/html")
        self.assertIn("HDFC Ergo Optima Secure Policy", text)
        self.assertIn("Sum Insured: Rs. 10 Lakhs", text)
        self.assertNotIn("alert('xss')", text)
        self.assertNotIn(".body{color:red}", text)
        print("HTML Cleaning Test Passed: Scripts and styles sanitized cleanly.")

    def test_pdf_parsing_from_bytes(self):
        import pymupdf
        doc = pymupdf.open()
        page = doc.new_page()
        page.insert_text((50, 72), "Care Supreme Health Insurance Policy Wording Document. Section 4: Restoration benefit 100% unlimited.")
        pdf_bytes = doc.tobytes()
        doc.close()

        text, content_type = DocumentWebScraper.scrape_policy_text_from_bytes(pdf_bytes, "application/pdf")
        self.assertEqual(content_type, "application/pdf")
        self.assertIn("Care Supreme Health Insurance", text)
        self.assertIn("Restoration benefit", text)
        print("PDF Ingestion & Text Extraction Test Passed.")

if __name__ == '__main__':
    unittest.main()

from pathlib import Path 
from pypdf import PdfReader

class ParserService:
    async def extract_text(
        self,
        file_path:str,
    )-> str :
        path=Path(file_path)
        
        suffix=path.suffix.lower()
        
        if suffix == ".pdf":
            return await self._parse_pdf(path)
        
        if suffix == ".txt":
            return await self._parse_text(path)
        
        if suffix == ".md":
            return await self._parse_markdown(path)
        
        raise ValueError("Unsupported file type.")
    
    async def _parse_pdf(
        self,
        path: Path,
    ) -> str:
        reader = PdfReader(path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text
    
    async def _parse_text(
        self,
        path: Path,
    ) -> str:
        return path.read_text(
            encoding="utf-8",
        )
    
    async def _parse_markdown(
        self,
        path: Path,
    ) -> str:
        text = path.read_text(
            encoding="utf-8",
        )

        return text
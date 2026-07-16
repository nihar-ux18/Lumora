class ChunkingService:
    def chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
    ) -> list[str]:
        chunks = []

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunks.append(text[start:end])

            start = end

        return chunks
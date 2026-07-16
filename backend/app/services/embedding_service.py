from sentence_transformers import SentenceTransformer


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2",
        )

    def generate_embedding(
        self,
        text: str,
    ) -> list[float]:
        embedding = self.model.encode(
            text,
            convert_to_numpy=True,
        )

        return embedding.tolist()

    def generate_embeddings(
        self,
        chunks: list[str],
    ) -> list[list[float]]:
        embeddings = self.model.encode(
            chunks,
            convert_to_numpy=True,
        )

        return embeddings.tolist()
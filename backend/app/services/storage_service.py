from pathlib import Path
from tempfile import NamedTemporaryFile
from uuid import uuid4

from fastapi import UploadFile
from supabase import create_client

from app.config.settings import settings
from app.core.exceptions import ConflictError

RESOURCE_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".md",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
}

class StorageService:
    def __init__(self) -> None:
        self.client = create_client(
            settings.supabase_url,
            settings.supabase_secret_key,
        )
        self.bucket = settings.supabase_storage_bucket

    async def upload_resource(
        self,
        file: UploadFile,
    ) -> str:
        extension = Path(file.filename or "").suffix.lower()

        if extension not in RESOURCE_EXTENSIONS:
            raise ConflictError("Unsupported file type.")

        filename = f"{uuid4()}{extension}"
        storage_path = f"resources/{filename}"

        file_data = await file.read()

        self.client.storage.from_(self.bucket).upload(
            storage_path,
            file_data,
            {
                "content-type": (
                    file.content_type
                    or "application/octet-stream"
                ),
            },
        )

        return storage_path

    def download_resource(
        self,
        storage_path: str,
        suffix: str,
    ) -> str:
        file_data = (
            self.client.storage
            .from_(self.bucket)
            .download(storage_path)
        )

        with NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temp_file:
            temp_file.write(file_data)
            return temp_file.name

    def delete_resource(
        self,
        storage_path: str,
    ) -> None:
        self.client.storage.from_(self.bucket).remove(
            [storage_path],
        )
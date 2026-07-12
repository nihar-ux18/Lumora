from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

UPLOAD_FOLDER = Path("uploads/avatars")

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

MAX_SIZE = 5 * 1024 * 1024  # 5 MB


async def save_avatar(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG and WEBP images are allowed.",
        )

    content = await file.read()

    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size must be less than 5 MB.",
        )

    extension = Path(file.filename).suffix.lower()

    filename = f"{uuid4()}{extension}"

    filepath = UPLOAD_FOLDER / filename

    with open(filepath, "wb") as f:
        f.write(content)

    return f"/uploads/avatars/{filename}"
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.exceptions import ConflictError


AVATAR_DIR = Path("uploads/avatars")
RESOURCE_DIR = Path("uploads/resources")

IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
}

RESOURCE_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
}


async def save_avatar(
    file: UploadFile,
) -> str:
    extension = Path(file.filename).suffix.lower()

    if extension not in IMAGE_EXTENSIONS:
        raise ConflictError(
            "Unsupported avatar image type."
        )

    AVATAR_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = f"{uuid4()}{extension}"

    file_path = AVATAR_DIR / filename

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    return str(file_path)


async def save_resource_file(
    file: UploadFile,
) -> str:
    extension = Path(file.filename).suffix.lower()

    if extension not in RESOURCE_EXTENSIONS:
        raise ConflictError(
            "Unsupported file type."
        )

    RESOURCE_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = f"{uuid4()}{extension}"

    file_path = RESOURCE_DIR / filename

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    return str(file_path)
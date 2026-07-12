from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import LumoraException


async def lumora_exception_handler(
    request: Request,
    exc: LumoraException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.message,
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(
        LumoraException,
        lumora_exception_handler,
    )
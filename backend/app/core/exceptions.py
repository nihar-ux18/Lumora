from fastapi import status


class LumoraException(Exception):
    """Base exception for Lumora."""

    status_code = status.HTTP_400_BAD_REQUEST

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class ResourceNotFoundError(LumoraException):
    status_code = status.HTTP_404_NOT_FOUND


class ConflictError(LumoraException):
    status_code = status.HTTP_409_CONFLICT


class UnauthorizedError(LumoraException):
    status_code = status.HTTP_401_UNAUTHORIZED


class ForbiddenError(LumoraException):
    status_code = status.HTTP_403_FORBIDDEN
class LumoraException(Exception):
    """Base exception for Lumora."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class ResourceNotFoundError(LumoraException):
    """Raised when a resource does not exist."""


class ConflictError(LumoraException):
    """Raised when a resource already exists."""


class UnauthorizedError(LumoraException):
    """Raised when authentication fails."""
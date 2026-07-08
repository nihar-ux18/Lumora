import logging
import sys
import structlog

def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(message)s",
        stream=sys.stdout,
    )
    
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.dev.ConsoleRenderer(),
        ],
        wrapper_class = structlog.make_filtering_bound_logger(logging.INFO),
        logger_factory = structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )
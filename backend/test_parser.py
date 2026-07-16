import asyncio

from app.services.parser_service import ParserService


async def main():
    parser = ParserService()

    text = await parser.extract_text(
        "test_files/notes.txt",
    )

    print(text)


asyncio.run(main())
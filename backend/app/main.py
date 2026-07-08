from fastapi import FastAPI

app = FastAPI(
    title="Lumora API",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "name": "Lumora API",
        "status": "running",
        "version": "0.1.0",
    }
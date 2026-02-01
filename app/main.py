import logging
from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.extraction_worker import ExtractionWorker
from app.core.settings import settings

worker = ExtractionWorker()

logging.basicConfig(
    level=getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API server for Heirloom project",
    version=settings.VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def start_extraction_worker() -> None:
    worker.start()


@app.on_event("shutdown")
def stop_extraction_worker() -> None:
    worker.stop()

@app.get("/api/v1/worker/status")
def worker_status() -> dict:
    """Get the current status of the extraction worker."""
    return worker.status()


@app.post("/api/v1/worker/start")
def worker_start() -> dict:
    """Start the extraction worker."""
    worker.start()
    return worker.status()


@app.post("/api/v1/worker/stop")
def worker_stop() -> dict:
    """Stop the extraction worker."""
    worker.stop()
    return worker.status()

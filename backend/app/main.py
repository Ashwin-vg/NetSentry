from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.network import router as network_router
from app.routes.scanner import router as scanner_router
from app.routes.history import router as history_router
from app.routes.findings import router as findings_router
from app.routes.auth import router as auth_router


app = FastAPI(
    title="NetSentry",
    description="Network Security Monitoring & Threat Detection Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(network_router)
app.include_router(scanner_router)
app.include_router(history_router)
app.include_router(findings_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "project": "NetSentry",
        "message": "Network Security Engine Active"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
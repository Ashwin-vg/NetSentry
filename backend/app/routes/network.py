from fastapi import APIRouter, Depends

from app.services.network_scanner import discover_network
from app.security.auth import get_current_user


router = APIRouter(
    prefix="/network",
    tags=["Network"]
)


@router.get("/discover")
def network_discovery(
    current_user=Depends(get_current_user)
):
    devices = discover_network()

    return {
        "devices_found": len(devices),
        "devices": devices
    }
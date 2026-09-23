from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database import scans_collection
from app.security.auth import get_current_user


router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/scans")
def scan_history(
    current_user=Depends(get_current_user)
):

    scans = list(
        scans_collection
        .find()
        .sort("timestamp", -1)
        .limit(50)
    )

    for scan in scans:
        scan["_id"] = str(scan["_id"])

    return {
        "count": len(scans),
        "scans": scans
    }


@router.get("/scans/{scan_id}")
def get_scan_by_id(
    scan_id: str,
    current_user=Depends(get_current_user)
):

    try:
        object_id = ObjectId(scan_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid scan ID"
        )

    scan = scans_collection.find_one({
        "_id": object_id
    })

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    scan["_id"] = str(scan["_id"])

    return scan
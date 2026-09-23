import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.database import scans_collection
from app.services.port_scanner import scan_ports
from app.services.risk_analyzer import (
    analyze_ports,
    calculate_risk_score,
)
from app.security.auth import get_current_user


router = APIRouter(
    prefix="/scanner",
    tags=["Scanner"]
)


@router.get("/ports")
def port_scan(
    target: str,
    current_user=Depends(get_current_user)
):

    # -----------------------------------------------------
    # Start scan timer
    # -----------------------------------------------------

    start_time = time.perf_counter()

    result = scan_ports(target)

    scan_duration = round(
        time.perf_counter() - start_time,
        2
    )

    # -----------------------------------------------------
    # Analyze results
    # -----------------------------------------------------

    findings = analyze_ports(
        result["ports"]
    )

    risk = calculate_risk_score(
        findings
    )

    # -----------------------------------------------------
    # Store scan
    # -----------------------------------------------------

    scan_document = {
        "target": target,

        "ports": result["ports"],

        "findings": findings,

        "findings_count": len(findings),

        "risk_score": risk["score"],

        "risk_level": risk["level"],

        "scanner": "Nmap",

        "scan_duration_seconds": scan_duration,

        "timestamp": datetime.now(
            timezone.utc
        ),

        "username": current_user["username"],
    }

    inserted = scans_collection.insert_one(
        scan_document
    )

    # -----------------------------------------------------
    # API response
    # -----------------------------------------------------

    return {
        "scan_id": str(
            inserted.inserted_id
        ),

        "target": target,

        "ports": result["ports"],

        "findings": findings,

        "findings_count": len(findings),

        "risk_score": risk["score"],

        "risk_level": risk["level"],

        "scanner": "Nmap",

        "scan_duration_seconds": scan_duration,
    }
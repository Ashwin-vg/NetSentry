from fastapi import APIRouter
from app.database import scans_collection

router = APIRouter(
    prefix="/findings",
    tags=["Findings"]
)


@router.get("/")
def get_findings():
    scans = list(
        scans_collection
        .find()
        .sort("timestamp", -1)
        .limit(100)
    )

    findings = []

    for scan in scans:
        for finding in scan.get("findings", []):
            findings.append({
                "target": scan["target"],
                "timestamp": scan["timestamp"],
                "port": finding["port"],
                "category": finding.get(
                    "category",
                    "Unknown"
                ),
                "severity": finding["severity"],
                "title": finding["title"],
                "description": finding["description"],
                "recommendation": finding.get(
                    "recommendation",
                    "No recommendation available."
                ),
                "confidence": finding.get(
                    "confidence",
                    "unknown"
                )
            })

    return {
        "count": len(findings),
        "findings": findings
    }
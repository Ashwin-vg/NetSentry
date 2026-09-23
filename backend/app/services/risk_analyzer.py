# =========================================================
# NetSentry - Risk Analyzer v2
# =========================================================

RULES = {
    21: {
        "category": "Network Exposure",
        "severity": "medium",
        "title": "FTP service detected",
        "description": (
            "FTP is an unencrypted file transfer protocol "
            "and may expose credentials and transferred data."
        ),
        "recommendation": (
            "Prefer SFTP or FTPS and restrict access "
            "to trusted hosts."
        ),
    },

    22: {
        "category": "Remote Access",
        "severity": "low",
        "title": "SSH service detected",
        "description": (
            "SSH provides remote administration access "
            "and should be restricted to trusted users "
            "and networks."
        ),
        "recommendation": (
            "Use key-based authentication and restrict "
            "SSH access to trusted networks."
        ),
    },

    23: {
        "category": "Insecure Remote Access",
        "severity": "high",
        "title": "Telnet service detected",
        "description": (
            "Telnet provides remote administration without "
            "transport encryption."
        ),
        "recommendation": (
            "Disable Telnet and use SSH for secure "
            "remote administration."
        ),
    },

    80: {
        "category": "Web Exposure",
        "severity": "low",
        "title": "HTTP service detected",
        "description": (
            "An HTTP service is exposed and may provide "
            "access to a web application."
        ),
        "recommendation": (
            "Verify that the service is intentionally exposed "
            "and apply appropriate web security controls."
        ),
    },

    443: {
        "category": "Web Exposure",
        "severity": "low",
        "title": "HTTPS service detected",
        "description": (
            "An HTTPS web service is exposed."
        ),
        "recommendation": (
            "Verify TLS configuration, certificate validity, "
            "and application access controls."
        ),
    },

    445: {
        "category": "Network Exposure",
        "severity": "medium",
        "title": "SMB service detected",
        "description": (
            "SMB exposure should normally be restricted "
            "to trusted networks."
        ),
        "recommendation": (
            "Restrict SMB access with firewall rules and "
            "avoid unnecessary exposure."
        ),
    },

    3389: {
        "category": "Remote Access",
        "severity": "high",
        "title": "RDP service detected",
        "description": (
            "Remote Desktop Protocol provides remote access "
            "to the system and can increase attack surface."
        ),
        "recommendation": (
            "Restrict RDP to trusted networks or VPN access "
            "and enforce strong authentication."
        ),
    },

    3306: {
        "category": "Database Exposure",
        "severity": "medium",
        "title": "MySQL service detected",
        "description": (
            "A MySQL database service is exposed."
        ),
        "recommendation": (
            "Restrict MySQL access to trusted application "
            "hosts and networks."
        ),
    },

    5432: {
        "category": "Database Exposure",
        "severity": "medium",
        "title": "PostgreSQL service detected",
        "description": (
            "A PostgreSQL database service is exposed."
        ),
        "recommendation": (
            "Restrict PostgreSQL access to trusted "
            "application hosts and networks."
        ),
    },

    6379: {
        "category": "Database Exposure",
        "severity": "medium",
        "title": "Redis service detected",
        "description": (
            "A Redis service is exposed and may provide "
            "access to application data or session information."
        ),
        "recommendation": (
            "Restrict Redis access to trusted application "
            "hosts and enable authentication where appropriate."
        ),
    },

    27017: {
        "category": "Database Exposure",
        "severity": "medium",
        "title": "MongoDB service detected",
        "description": (
            "A MongoDB database service is exposed."
        ),
        "recommendation": (
            "Restrict MongoDB access to trusted hosts and "
            "ensure authentication is enabled."
        ),
    },

    9200: {
        "category": "Application Exposure",
        "severity": "medium",
        "title": "Elasticsearch service detected",
        "description": (
            "An Elasticsearch service is exposed and may "
            "provide access to indexed application data."
        ),
        "recommendation": (
            "Restrict Elasticsearch access and enforce "
            "authentication and network controls."
        ),
    },

    8080: {
        "category": "Web Exposure",
        "severity": "low",
        "title": "Alternative HTTP service detected",
        "description": (
            "A web service is exposed on an alternative "
            "HTTP port."
        ),
        "recommendation": (
            "Verify that the service is intentionally exposed "
            "and apply appropriate access controls."
        ),
    },

    8000: {
        "category": "Application Exposure",
        "severity": "low",
        "title": "Application service detected",
        "description": (
            "An application or development web service is "
            "exposed on port 8000."
        ),
        "recommendation": (
            "Verify that the service is intended to be "
            "accessible and restrict development interfaces "
            "when unnecessary."
        ),
    },
}


SEVERITY_WEIGHTS = {
    "low": 10,
    "medium": 25,
    "high": 40,
    "critical": 60,
}


def normalize_service(service):
    """
    Normalize an Nmap service name.
    """

    return (
        str(service or "")
        .strip()
        .lower()
        .replace("?", "")
    )


def determine_confidence(port_data):
    """
    Determine confidence from Nmap service information.
    """

    service = str(
        port_data.get("service", "")
    ).strip().lower()

    version = str(
        port_data.get("version", "")
    ).strip().lower()

    if not service:
        return "low"

    if "?" in service:
        return "medium"

    if version and version != "unknown":
        return "high"

    return "medium"


def enrich_finding(port_data, rule):
    """
    Add service-aware context to a finding.
    """

    service = normalize_service(
        port_data.get("service")
    )

    version = str(
        port_data.get("version", "")
    ).strip()

    finding = {
        "port": port_data.get("port"),
        "service": port_data.get(
            "service",
            "unknown"
        ),
        "version": version or "unknown",
        "category": rule["category"],
        "severity": rule["severity"],
        "title": rule["title"],
        "description": rule["description"],
        "recommendation": rule["recommendation"],
        "confidence": determine_confidence(
            port_data
        ),
    }

    # -----------------------------------------------------
    # Service-specific enrichment
    # -----------------------------------------------------

    if service == "http" and version:
        finding["title"] = (
            f"HTTP application service detected ({version})"
        )

        finding["description"] = (
            f"An HTTP service identified as {version} "
            "is exposed on the target."
        )

    elif service in {
        "mysql",
        "mariadb",
    }:
        if version and version != "unknown":
            finding["title"] = (
                f"Database service detected ({version})"
            )
        else:
            finding["title"] = (
                "MySQL database service detected"
            )

    elif service in {
        "microsoft-ds",
        "smb",
    }:
        finding["title"] = "SMB service detected"

    elif service == "ssh":
        finding["title"] = (
            "SSH remote access detected"
        )

    elif service == "telnet":
        finding["title"] = (
            "Telnet remote access detected"
        )

    return finding


def analyze_ports(ports):
    """
    Analyze Nmap port results.

    Only ports with an explicit rule are converted
    into security findings.
    """

    findings = []

    seen = set()

    for port_data in ports:

        port = port_data.get("port")

        rule = RULES.get(port)

        if not rule:
            continue

        service = normalize_service(
            port_data.get("service")
        )

        finding_key = (
            port,
            service
        )

        if finding_key in seen:
            continue

        seen.add(finding_key)

        finding = enrich_finding(
            port_data,
            rule
        )

        findings.append(finding)

    return findings


def calculate_risk_score(findings):
    """
    Calculate an exposure-based risk score.

    This score represents detected service exposure,
    not confirmed exploitation or vulnerability.
    """

    score = 0

    for finding in findings:

        severity = str(
            finding.get(
                "severity",
                "low"
            )
        ).lower()

        score += SEVERITY_WEIGHTS.get(
            severity,
            0
        )

    score = min(
        score,
        100
    )

    if score >= 80:
        level = "critical"

    elif score >= 60:
        level = "high"

    elif score >= 30:
        level = "medium"

    elif score > 0:
        level = "low"

    else:
        level = "none"

    return {
        "score": score,
        "level": level,
    }
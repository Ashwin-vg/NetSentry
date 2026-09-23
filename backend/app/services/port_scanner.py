import subprocess
import re


def scan_ports(target: str):
    result = subprocess.run(
        [
            "nmap",
            "-sV",
            "--open",
            "-T3",
            target
        ],
        capture_output=True,
        text=True,
        timeout=120
    )

    ports = []

    pattern = re.compile(
        r"^(\d+)/tcp\s+open\s+(\S+)(?:\s+(.*))?$"
    )

    for line in result.stdout.splitlines():
        match = pattern.match(line.strip())

        if match:
            ports.append({
                "port": int(match.group(1)),
                "protocol": "tcp",
                "service": match.group(2),
                "version": match.group(3) or "unknown"
            })

    return {
        "target": target,
        "ports": ports
    }
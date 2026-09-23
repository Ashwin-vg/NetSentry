import ipaddress
import re
import subprocess


def discover_network():
    result = subprocess.run(
        ["arp", "-a"],
        capture_output=True,
        text=True,
        timeout=15,
    )

    devices = []

    pattern = re.compile(
        r"\(([\d.]+)\) at ([0-9a-fA-F:]+) on (\S+)"
    )

    for line in result.stdout.splitlines():

        match = pattern.search(line)

        if not match:
            continue

        ip = match.group(1)
        mac = match.group(2)
        interface = match.group(3)

        try:
            address = ipaddress.ip_address(ip)
        except ValueError:
            continue

        # Ignore non-routable / non-host addresses
        if (
            address.is_loopback
            or address.is_multicast
            or address.is_unspecified
            or address.is_link_local
        ):
            continue

        # Ignore obvious network/broadcast addresses
        last_octet = int(ip.split(".")[-1])

        if last_octet in (0, 255):
            continue

        # Normalize escaped MAC addresses
        mac = mac.replace("\\", "").lower()

        devices.append(
            {
                "ip": ip,
                "mac": mac,
                "interface": interface,
            }
        )

    # Remove duplicate IP/MAC combinations
    unique_devices = {}

    for device in devices:
        key = (device["ip"], device["mac"])
        unique_devices[key] = device

    return list(unique_devices.values())
const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";


function getAuthHeaders() {
    const token = localStorage.getItem(
        "netsentry_token"
    );

    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
}


async function handleResponse(
    response,
    errorMessage
) {
    if (response.status === 401) {
        localStorage.removeItem(
            "netsentry_token"
        );

        window.location.href = "/login";

        throw new Error(
            "Authentication required"
        );
    }

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return response.json();
}


// AUTH
export async function loginUser(username, password) {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Invalid username or password"
        );
    }

    return response.json();
}


export async function registerUser(username, password) {
    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Registration failed"
        );
    }

    return response.json();
}


// HISTORY
export async function getScanHistory() {
    const response = await fetch(
        `${API_URL}/history/scans`,
        {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    return handleResponse(
        response,
        "Failed to fetch scan history"
    );
}


export async function getScanById(scanId) {
    const response = await fetch(
        `${API_URL}/history/scans/${scanId}`,
        {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    return handleResponse(
        response,
        "Failed to fetch scan details"
    );
}


// NETWORK
export async function getNetworkDevices() {
    const response = await fetch(
        `${API_URL}/network/discover`,
        {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    return handleResponse(
        response,
        "Failed to discover network devices"
    );
}


// SCANNER
export async function scanPorts(target) {
    const response = await fetch(
        `${API_URL}/scanner/ports?target=${encodeURIComponent(target)}`,
        {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    return handleResponse(
        response,
        "Port scan failed"
    );
}


// FINDINGS
export async function getFindings() {
    const response = await fetch(
        `${API_URL}/findings/`,
        {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    return handleResponse(
        response,
        "Failed to fetch findings"
    );
}
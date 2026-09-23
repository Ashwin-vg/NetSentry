import { useState } from "react";
import {
    Search,
    Server,
    ShieldAlert,
    Activity,
} from "lucide-react";

import { scanPorts } from "../services/api";

function Scanner() {
    const [target, setTarget] = useState("127.0.0.1");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function isValidTarget(value) {
        const targetValue = value.trim();

        if (!targetValue) {
            return false;
        }

        const ipv4Regex =
            /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

        const hostnameRegex =
            /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

        return (
            ipv4Regex.test(targetValue) ||
            hostnameRegex.test(targetValue)
        );
    }

    async function handleScan() {
        const trimmedTarget = target.trim();

        setError("");

        if (!isValidTarget(trimmedTarget)) {
            setResult(null);
            setError("Enter a valid IP address or hostname.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const data = await scanPorts(trimmedTarget);
            setResult(data);
        } catch (err) {
            console.error(err);

            setError(
                "Scan failed. Make sure the backend is running and the target is reachable."
            );
        } finally {
            setLoading(false);
        }
    }

    const ports = result?.ports || [];
    const findings = result?.findings || [];

    return (
        <main className="dashboard">

            <header className="dashboard-header">

                <div>
                    <p className="eyebrow">
                        SECURITY OPERATIONS
                    </p>

                    <h1>
                        Network Scanner
                    </h1>

                    <p className="subtitle">
                        Discover exposed services and analyze security risks
                    </p>
                </div>

                <div className="system-status">
                    <span>●</span>
                    {loading ? "SCANNING" : "SCANNER READY"}
                </div>

            </header>

            <section className="panel">

                <div className="panel-header">

                    <div>
                        <p className="eyebrow">
                            SECURITY TOOL
                        </p>

                        <h2>
                            Scan Console
                        </h2>
                    </div>

                </div>

                <div className="scanner-console">

                    <label className="eyebrow">
                        TARGET
                    </label>

                    <div className="scanner-input-row">

                        <input
                            type="text"
                            value={target}
                            onChange={(e) =>
                                setTarget(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleScan();
                                }
                            }}
                            placeholder="Enter IP address or hostname"
                            disabled={loading}
                        />

                        <button
                            type="button"
                            className="scan-button"
                            onClick={handleScan}
                            disabled={loading}
                        >
                            <Search
                                size={16}
                                className={
                                    loading ? "spin" : ""
                                }
                            />

                            {loading
                                ? "SCANNING"
                                : "SCAN"}
                        </button>

                    </div>

                    <p className="scanner-hint">
                        Scan only systems you own or are authorized to test.
                    </p>

                    {error && (
                        <div className="scanner-error">
                            {error}
                        </div>
                    )}

                </div>

            </section>

            {result && (

                <>

                    {/* =================================================
                        SCAN STATISTICS
                    ================================================= */}

                    <section className="stats">

                        <div className="stat-card">

                            <Server size={22} />

                            <span>
                                TARGET
                            </span>

                            <strong>
                                {result.target}
                            </strong>

                        </div>

                        <div className="stat-card">

                            <Activity size={22} />

                            <span>
                                OPEN PORTS
                            </span>

                            <strong>
                                {ports.length}
                            </strong>

                        </div>

                        <div className="stat-card">

                            <ShieldAlert size={22} />

                            <span>
                                FINDINGS
                            </span>

                            <strong>
                                {findings.length}
                            </strong>

                        </div>

                        <div className="stat-card">

                            <ShieldAlert size={22} />

                            <span>
                                RISK SCORE
                            </span>

                            <strong>
                                {result.risk_score ?? 0}/100
                            </strong>

                        </div>

                    </section>


                    {/* =================================================
                        RISK ASSESSMENT
                    ================================================= */}

                    <section className="scanner-risk-card">

                        <div className="scanner-risk-info">

                            <div>

                                <p className="eyebrow">
                                    SECURITY ASSESSMENT
                                </p>

                                <h2>
                                    Overall Risk
                                </h2>

                                <p>
                                    Risk calculated from detected
                                    network exposures.
                                </p>

                            </div>

                            <div className="scanner-risk-score">

                                <strong>
                                    {result.risk_score ?? 0}
                                </strong>

                                <span>
                                    / 100
                                </span>

                            </div>

                        </div>

                        <div className="scanner-risk-level">

                            <span>
                                RISK LEVEL
                            </span>

                            <strong
                                className={`risk-level ${
                                    result.risk_level || "none"
                                }`}
                            >
                                {(result.risk_level || "none").toUpperCase()}
                            </strong>

                        </div>

                    </section>


                    {/* =================================================
                        OPEN PORTS
                    ================================================= */}

                    <section className="panel">

                        <div className="panel-header">

                            <div>

                                <p className="eyebrow">
                                    SCAN RESULTS
                                </p>

                                <h2>
                                    Open Ports
                                </h2>

                                <p className="subtitle">
                                    {result.target}
                                </p>

                            </div>

                        </div>

                        {ports.length === 0 ? (

                            <div className="network-empty">
                                No open ports detected.
                            </div>

                        ) : (

                            <div className="scan-results-list">

                                {ports.map((port) => (

                                    <div
                                        className="scan-result-row"
                                        key={`${port.port}-${port.protocol}`}
                                    >

                                        <div className="scan-port">
                                            {port.port}
                                        </div>

                                        <div className="scan-service">

                                            <strong>
                                                {port.service}
                                            </strong>

                                            <small>
                                                {port.protocol.toUpperCase()}
                                            </small>

                                        </div>

                                        <div className="scan-version">
                                            {port.version || "unknown"}
                                        </div>

                                        <div className="scan-status">
                                            OPEN
                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        SECURITY FINDINGS
                    ================================================= */}

                    <section className="panel">

                        <div className="panel-header">

                            <div>

                                <p className="eyebrow">
                                    THREAT ANALYSIS
                                </p>

                                <h2>
                                    Security Findings
                                </h2>

                            </div>

                        </div>

                        {findings.length === 0 ? (

                            <div className="network-empty">
                                No security findings detected.
                            </div>

                        ) : (

                            <div className="findings-page-list">

                                {findings.map(
                                    (finding, index) => (

                                        <div
                                            className="finding-page-row"
                                            key={`${finding.port}-${index}`}
                                        >

                                            <div className="finding-page-icon">

                                                <ShieldAlert
                                                    size={17}
                                                />

                                            </div>

                                            <div className="finding-page-content">

                                                <div className="finding-page-title">

                                                    <strong>
                                                        {finding.title}
                                                    </strong>

                                                    <span
                                                        className={`severity ${finding.severity}`}
                                                    >
                                                        {finding.severity.toUpperCase()}
                                                    </span>

                                                </div>

                                                <div className="finding-category">
                                                    {finding.category}
                                                </div>

                                                <p>
                                                    {finding.description}
                                                </p>

                                                <div className="recommendation">

                                                    <span>
                                                        RECOMMENDATION
                                                    </span>

                                                    <p>
                                                        {finding.recommendation ||
                                                            "No recommendation available."}
                                                    </p>

                                                </div>

                                                <div className="finding-meta">

                                                    <span>
                                                        TARGET:{" "}
                                                        {result.target}
                                                    </span>

                                                    <span>
                                                        PORT:{" "}
                                                        {finding.port}
                                                    </span>

                                                    <span>
                                                        CONFIDENCE:{" "}
                                                        {(
                                                            finding.confidence ||
                                                            "unknown"
                                                        ).toUpperCase()}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </>

            )}

        </main>
    );
}

export default Scanner;
import { useEffect, useState } from "react";
import {
    Activity,
    ArrowLeft,
    CheckCircle,
    Clock,
    Server,
    ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getScanById } from "../services/api";


function ScanDetails() {

    const { scanId } = useParams();
    const navigate = useNavigate();

    const [scan, setScan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        let cancelled = false;

        async function loadScan() {

            try {

                const data = await getScanById(
                    scanId
                );

                if (!cancelled) {
                    setScan(data);
                    setError("");
                }

            } catch (err) {

                console.error(err);

                if (!cancelled) {
                    setError(
                        "Failed to load scan details."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        }

        loadScan();

        return () => {
            cancelled = true;
        };

    }, [scanId]);


    if (loading) {

        return (
            <main className="dashboard">

                <div className="network-empty">
                    Loading scan details...
                </div>

            </main>
        );
    }


    if (error || !scan) {

        return (
            <main className="dashboard">

                <div className="network-empty">
                    {error || "Scan not found."}
                </div>

            </main>
        );
    }


    const ports = scan.ports || [];
    const findings = scan.findings || [];

    const riskScore = scan.risk_score ?? 0;
    const riskLevel = scan.risk_level || "none";

    const scanDuration =
        scan.scan_duration_seconds ?? "Unknown";

    const scanner =
        scan.scanner || "Unknown";

    const operator =
        scan.username || "Unknown";


    return (
        <main className="dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dashboard-header">

                <div>

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        <ArrowLeft size={16} />
                        BACK TO HISTORY
                    </button>

                    <p className="eyebrow">
                        SECURITY OPERATIONS
                    </p>

                    <h1>
                        Scan Details
                    </h1>

                    <p className="subtitle">
                        Historical security scan analysis
                    </p>

                </div>


                <div className="system-status">
                    <span>●</span>
                    SCAN COMPLETE
                </div>

            </header>


            {/* =================================================
                SUMMARY STATS
            ================================================= */}

            <section className="stats">

                <div className="stat-card">

                    <Server size={22} />

                    <span>
                        TARGET
                    </span>

                    <strong>
                        {scan.target}
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
                        {riskScore}/100
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
                            {riskScore}
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
                        className={`risk-level ${riskLevel}`}
                    >
                        {riskLevel.toUpperCase()}
                    </strong>

                </div>

            </section>


            {/* =================================================
                SCAN METADATA
            ================================================= */}

            <section className="panel">

                <div className="panel-header">

                    <div>

                        <p className="eyebrow">
                            SCAN INFORMATION
                        </p>

                        <h2>
                            Metadata
                        </h2>

                    </div>

                </div>


                <div className="scan-details-meta">

                    <div>

                        <span>
                            TARGET
                        </span>

                        <strong>
                            {scan.target}
                        </strong>

                    </div>


                    <div>

                        <span>
                            SCAN ID
                        </span>

                        <strong>
                            {scan._id}
                        </strong>

                    </div>


                    <div>

                        <span>
                            SCANNER
                        </span>

                        <strong>
                            {scanner}
                        </strong>

                    </div>


                    <div>

                        <span>
                            OPERATOR
                        </span>

                        <strong>
                            {operator}
                        </strong>

                    </div>


                    <div>

                        <span>
                            DURATION
                        </span>

                        <strong>
                            {scanDuration === "Unknown"
                                ? "Unknown"
                                : `${scanDuration}s`}
                        </strong>

                    </div>


                    <div>

                        <span>
                            TIMESTAMP
                        </span>

                        <strong>
                            {scan.timestamp
                                ? new Date(
                                    scan.timestamp
                                ).toLocaleString()
                                : "Unknown"}
                        </strong>

                    </div>

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

                    </div>

                </div>


                {ports.length === 0 ? (

                    <div className="network-empty">
                        No open ports detected.
                    </div>

                ) : (

                    <div className="network-table scan-details-ports">

                        <div className="network-table-header">

                            <span>
                                PORT
                            </span>

                            <span>
                                SERVICE
                            </span>

                            <span>
                                VERSION
                            </span>

                            <span>
                                STATUS
                            </span>

                        </div>


                        {ports.map((port) => (

                            <div
                                className="network-table-row"
                                key={`${port.port}-${port.protocol}`}
                            >

                                <div className="network-ip">
                                    {port.port}
                                </div>

                                <div className="network-mac">
                                    {port.service}
                                </div>

                                <div className="network-interface">
                                    {port.version || "unknown"}
                                </div>

                                <div className="port-status">
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

                        <CheckCircle size={18} />

                        No security findings detected.

                    </div>

                ) : (

                    <div className="findings-page-list">

                        {findings.map(
                            (finding, index) => {

                                const evidence =
                                    finding.evidence || {};

                                return (

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
                                                    {(
                                                        finding.severity ||
                                                        "unknown"
                                                    ).toUpperCase()}
                                                </span>

                                            </div>


                                            <div className="finding-category">
                                                {finding.category}
                                            </div>


                                            <p>
                                                {finding.description}
                                            </p>


                                            {/* =================================================
                                                EVIDENCE
                                            ================================================= */}

                                            <div className="finding-evidence">

                                                <span>
                                                    EVIDENCE
                                                </span>

                                                <div className="finding-evidence-grid">

                                                    <div>
                                                        <small>
                                                            PORT
                                                        </small>

                                                        <strong>
                                                            {evidence.port ??
                                                                finding.port ??
                                                                "Unknown"}
                                                        </strong>
                                                    </div>


                                                    <div>
                                                        <small>
                                                            PROTOCOL
                                                        </small>

                                                        <strong>
                                                            {(
                                                                evidence.protocol ||
                                                                "tcp"
                                                            ).toUpperCase()}
                                                        </strong>
                                                    </div>


                                                    <div>
                                                        <small>
                                                            SERVICE
                                                        </small>

                                                        <strong>
                                                            {evidence.service ||
                                                                finding.service ||
                                                                "Unknown"}
                                                        </strong>
                                                    </div>


                                                    <div>
                                                        <small>
                                                            VERSION
                                                        </small>

                                                        <strong>
                                                            {evidence.version ||
                                                                finding.version ||
                                                                "Unknown"}
                                                        </strong>
                                                    </div>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                RECOMMENDATION
                                            ================================================= */}

                                            <div className="recommendation">

                                                <span>
                                                    RECOMMENDATION
                                                </span>

                                                <p>
                                                    {finding.recommendation ||
                                                        "No recommendation available."}
                                                </p>

                                            </div>


                                            {/* =================================================
                                                FINDING META
                                            ================================================= */}

                                            <div className="finding-meta">

                                                <span>
                                                    TARGET:{" "}
                                                    {scan.target}
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

                                );
                            }
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                SCAN TIMESTAMP
            ================================================= */}

            <div className="scan-details-footer">

                <Clock size={15} />

                <span>
                    SCAN RECORDED{" "}
                    {scan.timestamp
                        ? new Date(
                            scan.timestamp
                        ).toLocaleString()
                        : "UNKNOWN"}
                </span>

            </div>

        </main>
    );
}


export default ScanDetails;
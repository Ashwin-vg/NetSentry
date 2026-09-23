import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Server,
    ShieldAlert,
    RefreshCw,
} from "lucide-react";

import {
    getScanHistory,
    getNetworkDevices,
    getFindings,
} from "../services/api";

function Dashboard() {
    const [devices, setDevices] = useState([]);
    const [scans, setScans] = useState([]);
    const [findings, setFindings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function loadDashboard() {
        const [
            networkData,
            scanData,
            findingData,
        ] = await Promise.all([
            getNetworkDevices(),
            getScanHistory(),
            getFindings(),
        ]);

        setDevices(networkData.devices || []);
        setScans(scanData.scans || []);
        setFindings(findingData.findings || []);
    }

    useEffect(() => {
        let cancelled = false;

        async function fetchDashboard() {
            try {
                const [
                    networkData,
                    scanData,
                    findingData,
                ] = await Promise.all([
                    getNetworkDevices(),
                    getScanHistory(),
                    getFindings(),
                ]);

                if (cancelled) return;

                setDevices(networkData.devices || []);
                setScans(scanData.scans || []);
                setFindings(findingData.findings || []);
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Failed to load dashboard data:",
                        error
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleRefresh() {
        setRefreshing(true);

        try {
            await loadDashboard();
        } catch (error) {
            console.error(
                "Failed to refresh dashboard:",
                error
            );
        } finally {
            setRefreshing(false);
        }
    }

    const totalFindings = findings.length;

    const latestScan = scans.length > 0
        ? scans[0]
        : null;

    const riskScore = latestScan?.risk_score ?? 0;

    const riskLevel = latestScan?.risk_level || "none";

    const severityCounts = useMemo(() => {
        return findings.reduce(
            (counts, finding) => {
                const severity = (
                    finding.severity || "unknown"
                ).toLowerCase();

                if (severity === "high") {
                    counts.high += 1;
                } else if (severity === "medium") {
                    counts.medium += 1;
                } else if (severity === "low") {
                    counts.low += 1;
                }

                return counts;
            },
            {
                high: 0,
                medium: 0,
                low: 0,
            }
        );
    }, [findings]);

    return (
        <main className="dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dashboard-header">

                <div>

                    <p className="eyebrow">
                        SECURITY OPERATIONS
                    </p>

                    <h1>
                        NetSentry
                    </h1>

                    <p className="subtitle">
                        Network Security Monitoring & Threat Detection
                    </p>

                </div>

                <div className="dashboard-actions">

                    <div className="system-status">
                        <span>●</span>
                        SYSTEM ONLINE
                    </div>

                    <button
                        type="button"
                        className="scan-button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "REFRESHING"
                            : "REFRESH"}
                    </button>

                </div>

            </header>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats">

                <div className="stat-card">

                    <Server size={22} />

                    <span>
                        DEVICES
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : devices.length}
                    </strong>

                </div>

                <div className="stat-card">

                    <Activity size={22} />

                    <span>
                        SCANS
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : scans.length}
                    </strong>

                </div>

                <div className="stat-card">

                    <AlertTriangle size={22} />

                    <span>
                        FINDINGS
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : totalFindings}
                    </strong>

                </div>

                <div className="stat-card">

                    <ShieldAlert size={22} />

                    <span>
                        RISK SCORE
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : `${riskScore}/100`}
                    </strong>

                </div>

            </section>


            {/* =================================================
                SECURITY POSTURE
            ================================================= */}

            <section className="scanner-risk-card">

                <div className="scanner-risk-info">

                    <div>

                        <p className="eyebrow">
                            SECURITY POSTURE
                        </p>

                        <h2>
                            Current Risk
                        </h2>

                        <p>
                            Based on the most recent security scan.
                        </p>

                    </div>

                    <div className="scanner-risk-score">

                        <strong>
                            {loading ? "—" : riskScore}
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
                FINDING BREAKDOWN
            ================================================= */}

            <section className="panel">

                <div className="panel-header">

                    <div>

                        <p className="eyebrow">
                            THREAT OVERVIEW
                        </p>

                        <h2>
                            Finding Breakdown
                        </h2>

                    </div>

                </div>

                <div className="dashboard-console">

                    <div className="console-status">
                        <span className="status-dot"></span>
                        SECURITY ENGINE ACTIVE
                    </div>

                    <div className="dashboard-severity-grid">

                        <div className="dashboard-severity-item">

                            <span>
                                HIGH
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : severityCounts.high}
                            </strong>

                        </div>

                        <div className="dashboard-severity-item">

                            <span>
                                MEDIUM
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : severityCounts.medium}
                            </strong>

                        </div>

                        <div className="dashboard-severity-item">

                            <span>
                                LOW
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : severityCounts.low}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                RECENT SCANS
            ================================================= */}

            <section className="panel">

                <div className="panel-header">

                    <div>

                        <p className="eyebrow">
                            ACTIVITY
                        </p>

                        <h2>
                            Recent Scans
                        </h2>

                    </div>

                </div>

                {loading ? (

                    <div className="network-empty">
                        Loading scan history...
                    </div>

                ) : scans.length === 0 ? (

                    <div className="network-empty">
                        No scans recorded.
                    </div>

                ) : (

                    <div className="scan-list">

                        {scans
                            .slice(0, 5)
                            .map((scan, index) => (

                                <div
                                    className="scan-row"
                                    key={
                                        scan._id ||
                                        `${scan.target}-${scan.timestamp}-${index}`
                                    }
                                >

                                    <div>

                                        <strong>
                                            {scan.target}
                                        </strong>

                                        <small>
                                            {scan.timestamp
                                                ? new Date(
                                                    scan.timestamp
                                                ).toLocaleString()
                                                : "Unknown"}
                                        </small>

                                    </div>

                                    <div>
                                        {scan.ports?.length || 0} ports
                                    </div>

                                    <div>
                                        {scan.findings_count || 0} findings
                                    </div>

                                    <div>
                                        <strong>
                                            {scan.risk_score ?? 0}/100
                                        </strong>

                                        <small
                                            className={`risk-level ${
                                                scan.risk_level || "none"
                                            }`}
                                        >
                                            {(
                                                scan.risk_level || "none"
                                            ).toUpperCase()}
                                        </small>
                                    </div>

                                </div>

                            ))}

                    </div>

                )}

            </section>


            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

            <section className="panel">

                <div className="panel-header">

                    <div>

                        <p className="eyebrow">
                            SYSTEM
                        </p>

                        <h2>
                            Security Engine
                        </h2>

                    </div>

                </div>

                <div className="dashboard-console">

                    <div className="console-status">

                        <span className="status-dot"></span>

                        NETSENTRY ENGINE OPERATIONAL

                    </div>

                    <p>
                        Network discovery, service detection,
                        threat analysis and risk scoring are active.
                    </p>

                </div>

            </section>

        </main>
    );
}

export default Dashboard;
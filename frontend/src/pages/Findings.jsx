import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ShieldAlert,
    Search,
    RefreshCw,
} from "lucide-react";

import { getFindings } from "../services/api";

function Findings() {
    const [findings, setFindings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [severity, setSeverity] = useState("all");

    async function loadFindings() {
        const data = await getFindings();
        setFindings(data.findings || []);
    }

    useEffect(() => {
        let cancelled = false;

        async function fetchFindings() {
            try {
                const data = await getFindings();

                if (!cancelled) {
                    setFindings(data.findings || []);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Failed to load findings:",
                        error
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchFindings();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleRefresh() {
        setRefreshing(true);

        try {
            await loadFindings();
        } catch (error) {
            console.error(
                "Failed to refresh findings:",
                error
            );
        } finally {
            setRefreshing(false);
        }
    }

    const highCount = findings.filter(
        (finding) => finding.severity === "high"
    ).length;

    const mediumCount = findings.filter(
        (finding) => finding.severity === "medium"
    ).length;

    
    const affectedTargets = new Set(
        findings
            .map((finding) => finding.target)
            .filter(Boolean)
    ).size;

    const filteredFindings = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return findings.filter((finding) => {
            const title = String(
                finding.title || ""
            ).toLowerCase();

            const category = String(
                finding.category || ""
            ).toLowerCase();

            const target = String(
                finding.target || ""
            ).toLowerCase();

            const service = String(
                finding.service || ""
            ).toLowerCase();

            const port = String(
                finding.port || ""
            );

            const matchesSearch =
                !searchTerm ||
                title.includes(searchTerm) ||
                category.includes(searchTerm) ||
                target.includes(searchTerm) ||
                service.includes(searchTerm) ||
                port.includes(searchTerm);

            const matchesSeverity =
                severity === "all" ||
                finding.severity === severity;

            return (
                matchesSearch &&
                matchesSeverity
            );
        });
    }, [findings, search, severity]);

    return (
        <main className="dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dashboard-header">

                <div>

                    <p className="eyebrow">
                        THREAT INTELLIGENCE
                    </p>

                    <h1>
                        Security Findings
                    </h1>

                    <p className="subtitle">
                        Detected security exposures from network scans
                    </p>

                </div>

                <button
                    type="button"
                    className="refresh-button"
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

            </header>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="stats">

                <div className="stat-card">

                    <AlertTriangle size={22} />

                    <span>
                        TOTAL FINDINGS
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : findings.length}
                    </strong>

                </div>

                <div className="stat-card">

                    <ShieldAlert size={22} />

                    <span>
                        HIGH
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : highCount}
                    </strong>

                </div>

                <div className="stat-card">

                    <ShieldAlert size={22} />

                    <span>
                        MEDIUM
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : mediumCount}
                    </strong>

                </div>

                <div className="stat-card">

                    <Search size={22} />

                    <span>
                        AFFECTED TARGETS
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : affectedTargets}
                    </strong>

                </div>

            </section>


            {/* =================================================
                FINDINGS PANEL
            ================================================= */}

            <section className="panel">

                <div className="panel-header findings-toolbar">

                    <div>

                        <p className="eyebrow">
                            THREAT LOG
                        </p>

                        <h2>
                            Detected Findings
                        </h2>

                        <p className="subtitle">
                            {filteredFindings.length} of{" "}
                            {findings.length} findings displayed
                        </p>

                    </div>


                    <div className="finding-filters">

                        <div className="history-search">

                            <Search size={16} />

                            <input
                                type="text"
                                placeholder="Search findings..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <select
                            value={severity}
                            onChange={(event) =>
                                setSeverity(
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                ALL SEVERITY
                            </option>

                            <option value="high">
                                HIGH
                            </option>

                            <option value="medium">
                                MEDIUM
                            </option>

                            <option value="low">
                                LOW
                            </option>

                        </select>

                    </div>

                </div>


                {/* =================================================
                    STATES
                ================================================= */}

                {loading ? (

                    <div className="network-empty">
                        Loading findings...
                    </div>

                ) : findings.length === 0 ? (

                    <div className="network-empty">
                        No security findings detected.
                    </div>

                ) : filteredFindings.length === 0 ? (

                    <div className="network-empty">
                        No findings match your filters.
                    </div>

                ) : (

                    <div className="findings-page-list">

                        {filteredFindings.map(
                            (finding, index) => {

                                const findingSeverity =
                                    finding.severity ||
                                    "unknown";

                                const confidence =
                                    finding.confidence ||
                                    "unknown";

                                return (

                                    <div
                                        className="finding-page-row"
                                        key={`${finding.timestamp}-${finding.port}-${index}`}
                                    >

                                        {/* ICON */}

                                        <div className="finding-page-icon">

                                            <AlertTriangle
                                                size={17}
                                            />

                                        </div>


                                        {/* CONTENT */}

                                        <div className="finding-page-content">

                                            {/* TITLE */}

                                            <div className="finding-page-title">

                                                <strong>
                                                    {finding.title ||
                                                        "Security finding"}
                                                </strong>

                                                <span
                                                    className={`severity ${findingSeverity}`}
                                                >
                                                    {findingSeverity.toUpperCase()}
                                                </span>

                                            </div>


                                            {/* CATEGORY */}

                                            <div className="finding-category">

                                                {finding.category ||
                                                    "Unknown category"}

                                            </div>


                                            {/* DESCRIPTION */}

                                            <p>
                                                {finding.description ||
                                                    "No description available."}
                                            </p>


                                            {/* RECOMMENDATION */}

                                            <div className="recommendation">

                                                <span>
                                                    RECOMMENDATION
                                                </span>

                                                <p>
                                                    {finding.recommendation ||
                                                        "No recommendation available."}
                                                </p>

                                            </div>


                                            {/* META */}

                                            <div className="finding-meta">

                                                <span>
                                                    TARGET:{" "}
                                                    {finding.target ||
                                                        "UNKNOWN"}
                                                </span>

                                                <span>
                                                    PORT:{" "}
                                                    {finding.port ||
                                                        "UNKNOWN"}
                                                </span>

                                                <span>
                                                    SERVICE:{" "}
                                                    {finding.service ||
                                                        "UNKNOWN"}
                                                </span>

                                                <span>
                                                    CONFIDENCE:{" "}
                                                    {confidence.toUpperCase()}
                                                </span>

                                                <span>
                                                    {finding.timestamp
                                                        ? new Date(
                                                            finding.timestamp
                                                        ).toLocaleString()
                                                        : "UNKNOWN"}
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

        </main>
    );
}

export default Findings;
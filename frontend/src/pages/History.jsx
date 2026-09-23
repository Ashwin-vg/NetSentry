import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    Clock,
    RefreshCw,
    Search,
    Server,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getScanHistory } from "../services/api";

function History() {
    const navigate = useNavigate();

    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchHistory() {
            try {
                const data = await getScanHistory();

                if (!cancelled) {
                    setScans(data.scans || []);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "Failed to load scan history:",
                        error
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchHistory();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleRefresh() {
        setRefreshing(true);

        try {
            const data = await getScanHistory();
            setScans(data.scans || []);
        } catch (error) {
            console.error(
                "Failed to refresh scan history:",
                error
            );
        } finally {
            setRefreshing(false);
        }
    }

    const filteredScans = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return scans;
        }

        return scans.filter((scan) =>
            scan.target?.toLowerCase().includes(query)
        );
    }, [scans, search]);

    const totalFindings = scans.reduce(
        (total, scan) =>
            total + (scan.findings_count || 0),
        0
    );

    const uniqueTargets = new Set(
        scans.map((scan) => scan.target)
    ).size;

    return (
        <main className="dashboard">

            {/* HEADER */}
            <header className="dashboard-header">

                <div>
                    <p className="eyebrow">
                        SECURITY OPERATIONS
                    </p>

                    <h1>
                        Scan History
                    </h1>

                    <p className="subtitle">
                        Historical network security scans
                    </p>
                </div>

                <button
                    className="refresh-button"
                    type="button"
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

            {/* STATS */}
            <section className="stats">

                <div className="stat-card">

                    <Activity size={22} />

                    <span>
                        TOTAL SCANS
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : scans.length}
                    </strong>

                </div>

                <div className="stat-card">

                    <Server size={22} />

                    <span>
                        TARGETS
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : uniqueTargets}
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

            </section>

            {/* HISTORY PANEL */}
            <section className="panel">

                <div className="panel-header">

                    <div>
                        <p className="eyebrow">
                            ACTIVITY LOG
                        </p>

                        <h2>
                            Scan Records
                        </h2>
                    </div>

                    <div className="history-search">

                        <Search size={16} />

                        <input
                            type="text"
                            placeholder="Search target..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {loading ? (

                    <div className="network-empty">
                        Loading scan history...
                    </div>

                ) : filteredScans.length === 0 ? (

                    <div className="network-empty">
                        No scan records found.
                    </div>

                ) : (

                    <div className="history-list">

                        {filteredScans.map((scan) => (

                            <div
                                className="history-row"
                                key={scan._id}
                                onClick={() =>
                                    navigate(
                                        `/history/${scan._id}`
                                    )
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        navigate(
                                            `/history/${scan._id}`
                                        );
                                    }
                                }}
                            >

                                {/* TARGET */}
                                <div className="history-target">

                                    <div className="history-icon">
                                        <Server size={17} />
                                    </div>

                                    <div>

                                        <strong>
                                            {scan.target}
                                        </strong>

                                        <small>
                                            SCAN ID
                                        </small>

                                        <span>
                                            {scan._id}
                                        </span>

                                    </div>

                                </div>

                                {/* PORTS */}
                                <div className="history-stat">

                                    <span>
                                        OPEN PORTS
                                    </span>

                                    <strong>
                                        {scan.ports?.length || 0}
                                    </strong>

                                </div>

                                {/* FINDINGS */}
                                <div className="history-stat">

                                    <span>
                                        FINDINGS
                                    </span>

                                    <strong>
                                        {scan.findings_count || 0}
                                    </strong>

                                </div>

                                {/* TIME */}
                                <div className="history-time">

                                    <Clock size={16} />

                                    <span>
                                        {scan.timestamp
                                            ? new Date(
                                                scan.timestamp
                                            ).toLocaleString()
                                            : "Unknown"}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default History;
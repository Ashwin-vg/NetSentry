import { useState } from "react";
import {
    Search,
    Loader2,
    AlertTriangle,
    ShieldAlert,
} from "lucide-react";

import { scanPorts } from "../services/api";

function ScanConsole({ onScanComplete }) {
    const [target, setTarget] = useState("127.0.0.1");
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function handleScan() {
        if (!target.trim()) {
            setError("Enter a target.");
            return;
        }

        setScanning(true);
        setError("");
        setResult(null);

        try {
            const data = await scanPorts(target.trim());
            setResult(data);
            if (onScanComplete) {
    onScanComplete();
}
        } catch (err) {
            console.error(err);
            setError("Scan failed. Check the backend.");
        } finally {
            setScanning(false);
        }
    }

    return (
        <section className="scan-console panel">

            <div className="panel-header">
                <div>
                    <p className="eyebrow">SECURITY TOOL</p>
                    <h2>Scan Console</h2>
                </div>
            </div>

            <div className="scan-form">

                <div className="target-input">
                    <label>TARGET</label>

                    <input
                        type="text"
                        value={target}
                        onChange={(event) =>
                            setTarget(event.target.value)
                        }
                        placeholder="127.0.0.1"
                    />
                </div>

                <button
                    className="scan-button"
                    onClick={handleScan}
                    disabled={scanning}
                >
                    {scanning ? (
                        <>
                            <Loader2
                                size={16}
                                className="spin"
                            />
                            SCANNING
                        </>
                    ) : (
                        <>
                            <Search size={16} />
                            SCAN
                        </>
                    )}
                </button>

            </div>

            <p className="scan-hint">
                Scan only systems you own or are authorized to test.
            </p>

            {error && (
                <div className="scan-error">
                    {error}
                </div>
            )}

            {result && (
                <div className="scan-result">

                    <div className="result-header">
                        <div>
                            <span>SCAN COMPLETE</span>
                            <strong>{result.target}</strong>
                        </div>

                        <div className="result-summary">
                            <span>
                                {result.ports?.length || 0} OPEN PORTS
                            </span>

                            <span>
                                {result.findings_count || 0} FINDINGS
                            </span>
                        </div>
                    </div>

                    <div className="result-section">

                        <div className="result-section-title">
                            <ShieldAlert size={15} />
                            OPEN PORTS
                        </div>

                        {result.ports?.length ? (
                            <div className="ports-list">

                                {result.ports.map((port) => (
                                    <div
                                        className="port-row"
                                        key={`${port.port}-${port.protocol}`}
                                    >
                                        <div className="port-number">
                                            {port.port}
                                        </div>

                                        <div className="port-service">
                                            <strong>
                                                {port.service}
                                            </strong>

                                            <small>
                                                {port.protocol.toUpperCase()}
                                            </small>
                                        </div>

                                        <div className="port-version">
                                            {port.version}
                                        </div>

                                        <div className="port-status">
                                            OPEN
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <p className="empty-result">
                                No open ports detected.
                            </p>
                        )}

                    </div>

                    <div className="result-section">

                        <div className="result-section-title">
                            <AlertTriangle size={15} />
                            SECURITY FINDINGS
                        </div>

                        {result.findings?.length ? (
                            <div className="findings-list">

                                {result.findings.map((finding) => (
                                    <div
                                        className="finding-row"
                                        key={`${finding.port}-${finding.title}`}
                                    >
                                        <div className="finding-icon">
                                            <AlertTriangle size={16} />
                                        </div>

                                        <div className="finding-content">
                                            <strong>
                                                {finding.title}
                                            </strong>

                                            <p>
                                                {finding.description}
                                            </p>
                                        </div>

                                        <div
                                            className={`severity ${finding.severity}`}
                                        >
                                            {finding.severity.toUpperCase()}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div className="no-findings">
                                <span>✓</span>
                                No security findings detected.
                            </div>
                        )}

                    </div>

                </div>
            )}

        </section>
    );
}

export default ScanConsole;
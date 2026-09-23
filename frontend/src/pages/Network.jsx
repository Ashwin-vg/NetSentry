import { useEffect, useState } from "react";
import {
    Server,
    Network as NetworkIcon,
    RefreshCw,
} from "lucide-react";

import { getNetworkDevices } from "../services/api";

function Network() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDevices() {
        setLoading(true);
        setError("");

        try {
            const data = await getNetworkDevices();
            setDevices(data.devices || []);
        } catch (err) {
            console.error(err);
            setError("Failed to discover network devices.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function fetchDevices() {
            try {
                const data = await getNetworkDevices();

                if (!cancelled) {
                    setDevices(data.devices || []);
                    setError("");
                }
            } catch (err) {
                console.error(err);

                if (!cancelled) {
                    setError("Failed to discover network devices.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchDevices();

        return () => {
            cancelled = true;
        };
    }, []);

    const interfaceName =
        devices.length > 0
            ? devices[0].interface
            : "en0";

    return (
        <main className="dashboard">

            <header className="dashboard-header">

                <div>
                    <p className="eyebrow">
                        NETWORK INTELLIGENCE
                    </p>

                    <h1>
                        Network Discovery
                    </h1>

                    <p className="subtitle">
                        Local ARP-based host inventory
                    </p>
                </div>

                <button
                    className="refresh-button"
                    type="button"
                    onClick={loadDevices}
                    disabled={loading}
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "spin" : ""}
                    />

                    {loading ? "REFRESHING" : "REFRESH"}
                </button>

            </header>

            <section className="stats">

                <div className="stat-card">

                    <Server size={22} />

                    <span>
                        DISCOVERED HOSTS
                    </span>

                    <strong>
                        {loading ? "—" : devices.length}
                    </strong>

                </div>

                <div className="stat-card">

                    <NetworkIcon size={22} />

                    <span>
                        INTERFACE
                    </span>

                    <strong>
                        {interfaceName}
                    </strong>

                </div>

            </section>

            <section className="panel">

                <div className="panel-header">

                    <div>
                        <p className="eyebrow">
                            HOST INVENTORY
                        </p>

                        <h2>
                            Discovered Hosts
                        </h2>
                    </div>

                </div>

                {error ? (

                    <div className="network-empty">
                        {error}
                    </div>

                ) : loading ? (

                    <div className="network-empty">
                        Discovering hosts...
                    </div>

                ) : devices.length === 0 ? (

                    <div className="network-empty">
                        No hosts discovered.
                    </div>

                ) : (

                    <div className="network-table">

                        <div className="network-table-header">

                            <span>
                                IP ADDRESS
                            </span>

                            <span>
                                MAC ADDRESS
                            </span>

                            <span>
                                INTERFACE
                            </span>

                        </div>

                        {devices.map((device) => (

                            <div
                                className="network-table-row"
                                key={`${device.ip}-${device.mac}`}
                            >

                                <div className="network-ip">
                                    <span className="host-dot" />
                                    {device.ip}
                                </div>

                                <div className="network-mac">
                                    {device.mac}
                                </div>

                                <div className="network-interface">
                                    {device.interface}
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default Network;
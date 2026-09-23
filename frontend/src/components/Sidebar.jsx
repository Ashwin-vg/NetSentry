import {
    LayoutDashboard,
    Network,
    ScanLine,
    History,
    Shield,
    ShieldAlert,
    LogOut,
} from "lucide-react";
import {
    NavLink,
    useNavigate,
} from "react-router-dom";


function Sidebar() {

    const navigate = useNavigate();

    const links = [
        {
            name: "Dashboard",
            path: "/",
            icon: LayoutDashboard,
        },
        {
            name: "Network",
            path: "/network",
            icon: Network,
        },
        {
            name: "Scanner",
            path: "/scanner",
            icon: ScanLine,
        },
        {
            name: "Findings",
            path: "/findings",
            icon: ShieldAlert,
        },
        {
            name: "History",
            path: "/history",
            icon: History,
        },
    ];


    function handleLogout() {

        localStorage.removeItem(
            "netsentry_token"
        );

        navigate(
            "/login",
            { replace: true }
        );
    }


    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <Shield size={20} />
                <span>NETSENTRY</span>
            </div>


            <div className="sidebar-section">

                <span className="sidebar-label">
                    OPERATIONS
                </span>

                <nav>

                    {links.map((link) => {

                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >
                                <Icon size={17} />
                                <span>
                                    {link.name}
                                </span>
                            </NavLink>
                        );

                    })}

                </nav>

            </div>


            <div className="sidebar-footer">

                <div className="sidebar-status">

                    <span className="status-dot" />

                    <div>
                        <strong>
                            SYSTEM ONLINE
                        </strong>

                        <small>
                            NetSentry v1.0
                        </small>
                    </div>

                </div>


                <button
                    type="button"
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />

                    <span>
                        LOGOUT
                    </span>
                </button>

            </div>

        </aside>
    );
}


export default Sidebar;
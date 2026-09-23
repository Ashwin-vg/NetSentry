import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScanDetails from "./pages/ScanDetails";
import Sidebar from "./components/Sidebar";
import Findings from "./pages/Findings";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";
import Scanner from "./pages/Scanner";
import History from "./pages/History";
import Login from "./pages/Login";


function ProtectedLayout() {

    const token = localStorage.getItem(
        "netsentry_token"
    );

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-content">

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/network"
                        element={<Network />}
                    />

                    <Route
                        path="/scanner"
                        element={<Scanner />}
                    />

                    <Route
                        path="/findings"
                        element={<Findings />}
                    />

                    <Route
                        path="/history"
                        element={<History />}
                    />

                    <Route
                        path="/history/:scanId"
                        element={<ScanDetails />}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>

            </div>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/*"
                    element={<ProtectedLayout />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;
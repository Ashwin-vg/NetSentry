import { useState } from "react";
import { Shield, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event) {
        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Username and password are required.");
            return;
        }

        setLoading(true);

        try {
            const data = await loginUser(
                username.trim(),
                password
            );

            localStorage.setItem(
                "netsentry_token",
                data.access_token
            );

            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">

            <div className="login-card">

                <div className="login-brand">
                    <div className="login-logo">
                        <Shield size={28} />
                    </div>

                    <div>
                        <span className="login-brand-name">
                            NETSENTRY
                        </span>

                        <span className="login-brand-subtitle">
                            SECURITY OPERATIONS
                        </span>
                    </div>
                </div>

                <div className="login-heading">
                    <p className="eyebrow">
                        AUTHENTICATION REQUIRED
                    </p>

                    <h1>
                        Access Control
                    </h1>

                    <p>
                        Sign in to access the NetSentry
                        security console.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <div className="login-field">
                        <label htmlFor="username">
                            USERNAME
                        </label>

                        <div className="login-input">
                            <User size={17} />

                            <input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">
                            PASSWORD
                        </label>

                        <div className="login-input">
                            <Lock size={17} />

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            "AUTHENTICATING..."
                        ) : (
                            <>
                                AUTHENTICATE
                                <ArrowRight size={17} />
                            </>
                        )}
                    </button>

                </form>

                <div className="login-footer">
                    <span>NETSENTRY</span>
                    <span>•</span>
                    <span>SECURE SESSION</span>
                </div>

            </div>

        </main>
    );
}

export default Login;
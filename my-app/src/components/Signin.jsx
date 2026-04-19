import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
    const { session } = useAuth();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    if (session) {
        navigate("/dashboard");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage("Check your email for a confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-logo">📊</span>
                    <h1 className="auth-title">Paper Like a Boss</h1>
                    <p className="auth-subtitle">Track your sales. Own your numbers.</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${!isSignUp ? "active" : ""}`}
                        onClick={() => { setIsSignUp(false); setError(null); setMessage(null); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`auth-tab ${isSignUp ? "active" : ""}`}
                        onClick={() => { setIsSignUp(true); setError(null); setMessage(null); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">⚠️ {error}</div>}
                    {message && <div className="auth-success">✅ {message}</div>}

                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder={isSignUp ? "Min. 6 characters" : "Your password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength={isSignUp ? 6 : undefined}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading
                            ? (isSignUp ? "Creating account..." : "Signing in...")
                            : (isSignUp ? "Create Account" : "Sign In")}
                    </button>
                </form>

                <p className="auth-switch">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        className="auth-switch-btn"
                        onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signin;
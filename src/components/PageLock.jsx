import React, { useState } from "react";

const PageLock = ({ onUnlock, sheetName, requiredPassword }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Verify against the specific password for this sheet
        setTimeout(() => {
            if (password === requiredPassword) {
                onUnlock();
            } else {
                setError("Access Denied. Incorrect Password.");
                setIsSubmitting(false);
            }
        }, 600);
    };

    return (
        <div style={styles.container}>
            <div style={styles.lockCard}>
                <div style={styles.iconWrapper}>
                    <span style={styles.lockIcon}>🔒</span>
                </div>

                <h2 style={styles.title}>Protected Module</h2>
                <p style={styles.subtitle}>
                    Enter password to access <strong>{sheetName}</strong>
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            autoFocus
                        />
                        <div style={styles.glow} />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            ...styles.button,
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? "Verifying..." : "Unlock Dashboard"}
                    </button>
                </form>

                <p style={styles.footer}>Identity Verification Required</p>
            </div>

            <style>{`
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0 % { box- shadow: 0 0 0 0 rgba(109, 189, 138, 0.4); } 70 % { box- shadow: 0 0 0 10px rgba(109, 189, 138, 0); } 100 % { box- shadow: 0 0 0 0 rgba(109, 189, 138, 0); } }
`}</style>
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0ede8",
        fontFamily: "'DM Sans', sans-serif",
        animation: "fadeIn 0.5s ease-out",
        padding: "20px",
    },
    lockCard: {
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        padding: "48px 40px",
        borderRadius: "24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)",
        border: "1px solid rgba(0,0,0,0.03)",
        textAlign: "center",
    },
    iconWrapper: {
        width: "64px",
        height: "64px",
        background: "rgba(109, 189, 138, 0.1)",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
    },
    lockIcon: {
        fontSize: "28px",
    },
    title: {
        fontSize: "22px",
        fontWeight: 600,
        color: "#1a1a1a",
        margin: "0 0 8px",
        fontFamily: "'Playfair Display', serif",
    },
    subtitle: {
        fontSize: "14px",
        color: "#888",
        margin: "0 0 32px",
        lineHeight: "1.6",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    inputGroup: {
        position: "relative",
    },
    input: {
        width: "100%",
        padding: "14px 20px",
        borderRadius: "12px",
        border: "2px solid #f0f0f0",
        fontSize: "16px",
        textAlign: "center",
        letterSpacing: "0.2em",
        transition: "all 0.3s ease",
        background: "#fafafa",
        outline: "none",
    },
    button: {
        padding: "14px",
        borderRadius: "12px",
        border: "none",
        background: "#1c1c1e",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: "8px",
    },
    error: {
        fontSize: "12px",
        color: "#e74c3c",
        margin: "-8px 0 0",
        fontWeight: 500,
    },
    footer: {
        fontSize: "11px",
        color: "#bbb",
        marginTop: "32px",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontWeight: 600,
    },
};

export default PageLock;

import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

const Dashboard = ({ sheetUrlMap, isLoggedIn }) => {
    console.log(sheetUrlMap, "sheet")
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        const results = [];

        const dashboardSheets = [
            { id: "0", name: "Daily Tasks", url: sheetUrlMap[0] },
            { id: "1", name: "Stand For", url: sheetUrlMap[1] },
            { id: "2", name: "Laravel", url: sheetUrlMap[2] },
            { id: "3", name: "Social Media", url: sheetUrlMap[3] },
            { id: "4", name: "Information Tools", url: sheetUrlMap[4] },
            { id: "5", name: "Project Timeline", url: sheetUrlMap[5] },
            { id: "6", name: "Ajwa Tasks", url: sheetUrlMap[6] },
            { id: "7", name: "Hadi Tasks", url: sheetUrlMap[7] },
            { id: "8", name: "Aliza Work Daily", url: sheetUrlMap[8] },
        ];

        try {
            for (const sheet of dashboardSheets) {
                if (!sheet.url) continue;
                const resp = await fetch(sheet.url);
                const csv = await resp.text();
                Papa.parse(csv, {
                    header: true,
                    complete: (r) => {
                        const count = r.data.filter((row) => Object.values(row).some((v) => !!v)).length;
                        results.push({ ...sheet, count });
                        if (results.length === dashboardSheets.filter(s => s.url).length) {
                            setStats(results);
                            setLoading(false);
                        }
                    },
                });
            }
        } catch (e) {
            console.error("Dashboard fetch error:", e);
            setLoading(false);
        }
    }, [sheetUrlMap]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchStats();
        }
    }, [isLoggedIn, fetchStats]);

    return (
        <main style={styles.main}>
            <header style={styles.header}>
                <h1 style={styles.title}>Dashboard Overview</h1>
                <p style={styles.subtitle}>Summary of all active workspaces and data points.</p>
            </header>

            {loading ? (
                <div style={styles.loadingBox}>
                    <div style={styles.spinner} />
                    <p>Compiling workspace statistics...</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {stats.map((stat) => (
                        <div key={stat.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardIcon}>{getIcon(stat.id)}</span>
                                <h3 style={styles.cardTitle}>{stat.name}</h3>
                            </div>
                            <div style={styles.cardBody}>
                                <span style={styles.count}>{stat.count}</span>
                                <span style={styles.countLabel}>Records</span>
                            </div>
                            <div style={styles.cardFooter}>
                                <div style={styles.progressBar}>
                                    <div style={{ ...styles.progressFill, width: `${Math.min(stat.count * 2, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <section style={styles.recentSection}>
                <h2 style={styles.sectionTitle}>System Status</h2>
                <div style={styles.statusGrid}>
                    <div style={styles.statusItem}>
                        <span style={styles.statusDot} />
                        <div>
                            <p style={styles.statusLabel}>Google Sheets API</p>
                            <p style={styles.statusValue}>Connected</p>
                        </div>
                    </div>
                    <div style={styles.statusItem}>
                        <span style={styles.statusDot} />
                        <div>
                            <p style={styles.statusLabel}>Sync Engine</p>
                            <p style={styles.statusValue}>Operational</p>
                        </div>
                    </div>
                    <div style={styles.statusItem}>
                        <span style={styles.statusDot} />
                        <div>
                            <p style={styles.statusLabel}>Authentication</p>
                            <p style={styles.statusValue}>Verified</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

const getIcon = (id) => {
    const icons = {
        0: "📋",
        1: "🎯",
        2: "⚙️",
        3: "📱",
        4: "📦",
        5: "📅",
        6: "🌸",
        7: "👨‍💻",
        8: "👩‍🏫",
    };
    return icons[id] || "📊";
};

const styles = {
    main: {
        flex: 1,
        padding: "40px",
        background: "#fdfcf9",
        minHeight: "100vh",
        overflowY: "auto",
        fontFamily: "'DM Sans', sans-serif",
    },
    header: {
        marginBottom: "40px",
    },
    title: {
        fontSize: "32px",
        fontWeight: 600,
        color: "#1a1a1a",
        fontFamily: "'Playfair Display', serif",
        margin: 0,
    },
    subtitle: {
        fontSize: "14px",
        color: "#888",
        marginTop: "8px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "48px",
    },
    card: {
        background: "#fff",
        borderRadius: "24px",
        padding: "24px",
        border: "1.5px solid #f0ede8",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
    },
    cardIcon: {
        fontSize: "20px",
        background: "#f8f6f2",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
    },
    cardTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: "#3d3d3d",
        margin: 0,
    },
    cardBody: {
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
        marginBottom: "16px",
    },
    count: {
        fontSize: "36px",
        fontWeight: 700,
        color: "#1a1a1a",
    },
    countLabel: {
        fontSize: "14px",
        color: "#aaa",
        fontWeight: 500,
    },
    progressBar: {
        height: "6px",
        background: "#f0ede8",
        borderRadius: "3px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        background: "#6dbd8a",
        borderRadius: "3px",
    },
    loadingBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 0",
        color: "#aaa",
        fontSize: "14px",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "3px solid #f0ede8",
        borderTopColor: "#6dbd8a",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "16px",
    },
    recentSection: {
        background: "#fff",
        borderRadius: "24px",
        padding: "32px",
        border: "1.5px solid #f0ede8",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#1a1a1a",
        marginBottom: "24px",
        margin: "0 0 24px 0",
    },
    statusGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "32px",
    },
    statusItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    statusDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#6dbd8a",
        boxShadow: "0 0 0 4px rgba(109,189,138,0.15)",
    },
    statusLabel: {
        fontSize: "12px",
        color: "#aaa",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        margin: 0,
    },
    statusValue: {
        fontSize: "14px",
        color: "#3d3d3d",
        fontWeight: 500,
        margin: "2px 0 0 0",
    },
};

export default Dashboard;

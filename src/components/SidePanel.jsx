import React from "react";

const sheetIcons = {
  0: "📋",
  1: "🎯",
  2: "⚙️",
};

const SidePanel = ({ sheets, activeSheet, onSheetChange }) => {
  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
                .sp-nav-btn:hover { background: rgba(255,255,255,0.06) !important; transform: translateX(3px); }
            `}</style>

      <aside style={styles.sidebar}>
        <div style={styles.header}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>SheetSync</span>
        </div>

        <nav style={styles.nav}>
          <p style={styles.sectionLabel}>Workspaces</p>
          {sheets.map((sheet) => {
            const isActive = activeSheet.id === sheet.id;
            return (
              <button
                key={sheet.id}
                className="sp-nav-btn"
                onClick={() => onSheetChange(sheet)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
              >
                <span style={styles.navIcon}>{sheetIcons[sheet.id]}</span>
                <span
                  style={{
                    ...styles.navLabel,
                    ...(isActive ? styles.navLabelActive : {}),
                  }}
                >
                  {sheet.name}
                </span>
                {isActive && <span style={styles.activeDot} />}
              </button>
            );
          })}
        </nav>

        <div style={styles.footer}>
          <span style={styles.footerText}>v2.0.0</span>
        </div>
      </aside>
    </>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    minHeight: "100vh",
    background: "#1c1c1e",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "24px 16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    cursor: "default",
  },
  logoIcon: { fontSize: "22px", color: "#6dbd8a", flexShrink: 0 },
  logoText: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#fff",
    fontFamily: "'Playfair Display', serif",
    whiteSpace: "nowrap",
  },
  nav: {
    flex: 1,
    padding: "16px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.25)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "8px",
    paddingLeft: "12px",
    margin: "0 0 8px 0",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.45)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 400,
    transition: "all 0.15s ease",
    textAlign: "left",
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
  },
  navItemActive: {
    background: "rgba(109,189,138,0.15)",
    color: "#6dbd8a",
    fontWeight: 600,
  },
  navIcon: {
    fontSize: "15px",
    flexShrink: 0,
    width: "20px",
    textAlign: "center",
  },
  navLabel: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "rgba(255,255,255,0.45)",
    transition: "color 0.15s",
  },
  navLabelActive: {
    color: "#6dbd8a",
  },
  activeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#6dbd8a",
    flexShrink: 0,
  },
  footer: {
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  footerText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.2)",
  },
};

export default SidePanel;

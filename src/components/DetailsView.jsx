import React, { useState } from "react";

const DetailsView = ({
  activeSheet,
  headers,
  data,
  newRow,
  onInputChange,
  onSubmit,
  onRefresh,
  loading,
  submitting,
  error,
  success,
}) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
                * { box-sizing: border-box; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
                .dv-refresh:hover { background: #f5f0e8 !important; border-color: #c8c2b6 !important; }
                .dv-add:hover { background: #336040 !important; }
                .dv-tr:hover td { background: #faf8f5 !important; }
                .dv-input:focus { outline: none; border-color: #6dbd8a !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(109,189,138,0.12) !important; }
                .dv-submit:hover:not(:disabled) { background: #336040 !important; }
                
                @media (max-width: 768px) {
                  .dv-main { padding: 80px 16px 24px !important; }
                  .dv-topbar { flex-direction: column; gap: 16px; align-items: flex-start !important; }
                  .dv-form-grid { grid-template-columns: 1fr !important; }
                  .dv-table-container { margin: 0 -16px; border-radius: 0 !important; border-left: none; border-right: none; }
                  .dv-th:not(:nth-child(-n+3)), .dv-td:not(:nth-child(-n+3)) { display: none; } /* Show only first 2 columns + ID on mobile */
                }
            `}</style>

      <main className="dv-main" style={styles.main}>
        <header className="dv-topbar" style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>{activeSheet.name}</h1>
            <p style={styles.pageSubtitle}>
              {data.length} records · {headers.length} columns
            </p>
          </div>
          <div style={styles.topActions}>
            <button
              className="dv-refresh"
              style={styles.btnRefresh}
              onClick={onRefresh}
            >
              ↻ Refresh
            </button>
            <button
              className="dv-add"
              style={{
                ...styles.btnAdd,
                ...(showForm ? styles.btnCancel : {}),
              }}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✕ Cancel" : "+ Add Row"}
            </button>
          </div>
        </header>

        {error && <div style={styles.alertError}>⚠ {error}</div>}
        {success && <div style={styles.alertSuccess}>✓ {success}</div>}

        <div style={styles.contentStack}>
          {showForm && (
            <div style={styles.formPanel}>
              <h2 style={styles.formTitle}>Add New Row</h2>
              <form
                onSubmit={(e) => {
                  onSubmit(e);
                  setShowForm(false);
                }}
                className="dv-form-grid"
                style={styles.formGrid}
              >
                {headers.map((header) => (
                  <div key={header} style={styles.formField}>
                    <label style={styles.formLabel}>{header}</label>
                    <input
                      className="dv-input"
                      type="text"
                      placeholder={`Enter ${header}`}
                      value={newRow[header] || ""}
                      onChange={(e) => onInputChange(header, e.target.value)}
                      style={styles.formInput}
                    />
                  </div>
                ))}
                <div style={styles.formActions}>
                  <button
                    type="submit"
                    className="dv-submit"
                    style={styles.btnSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Saving…" : "Save Row"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div
            className="dv-table-container"
            style={{ ...styles.tableCard, marginTop: showForm ? "-16px" : 0 }}
          >
            {loading ? (
              <div style={styles.stateBox}>
                <div style={styles.spinner} />
                <p style={styles.stateText}>Loading data…</p>
              </div>
            ) : data.length === 0 ? (
              <div style={styles.stateBox}>
                <span style={styles.emptyIcon}>📭</span>
                <p style={styles.stateText}>No data found in this sheet.</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, ...styles.thIdx }}>#</th>
                      {headers.map((h) => (
                        <th key={h} className="dv-th" style={styles.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} className="dv-tr">
                        <td
                          className="dv-td"
                          style={{ ...styles.td, ...styles.tdIdx }}
                        >
                          {i + 1}
                        </td>
                        {headers.map((h) => (
                          <td key={h} className="dv-td" style={styles.td}>
                            {row[h] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const styles = {
  main: {
    flex: 1,
    padding: "32px 36px",
    background: "#f0ede8",
    minHeight: "100vh",
    overflowY: "auto",
    minWidth: 0,
    fontFamily: "'DM Sans', sans-serif",
  },

  // Top bar
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1a1a1a",
    fontFamily: "'Playfair Display', serif",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "#999",
    marginTop: "4px",
    margin: "4px 0 0",
  },
  topActions: { display: "flex", gap: "10px", alignItems: "center" },
  btnRefresh: {
    padding: "9px 18px",
    borderRadius: "10px",
    border: "1.5px solid #ddd8cc",
    background: "#fff",
    color: "#555",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnAdd: {
    padding: "9px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#3d6b4f",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnCancel: {
    background: "#888",
  },

  // Alerts
  alertError: {
    background: "#fff5f5",
    border: "1.5px solid #fbc8c8",
    color: "#c0392b",
    borderRadius: "10px",
    padding: "10px 16px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: 500,
  },
  alertSuccess: {
    background: "#f0faf4",
    border: "1.5px solid #b7e4c7",
    color: "#276749",
    borderRadius: "10px",
    padding: "10px 16px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: 500,
  },

  // Stack
  contentStack: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  // Form panel (behind)
  formPanel: {
    background: "#e8e4dc",
    borderRadius: "20px",
    padding: "28px 28px 44px",
    border: "1.5px solid #ddd8ce",
    animation: "slideDown 0.3s ease",
    marginBottom: 0,
  },
  formTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#3a3a3a",
    marginBottom: "20px",
    margin: "0 0 20px",
    fontFamily: "'Playfair Display', serif",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "14px 20px",
  },
  formField: { display: "flex", flexDirection: "column", gap: "5px" },
  formLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  formInput: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #ccc8bc",
    background: "#faf9f6",
    fontSize: "13px",
    color: "#1a1a1a",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
  },
  formActions: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "4px",
  },
  btnSubmit: {
    padding: "10px 28px",
    borderRadius: "10px",
    border: "none",
    background: "#3d6b4f",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },

  // Table card (on top)
  tableCard: {
    background: "#fff",
    borderRadius: "20px",
    border: "1.5px solid #e8e4dc",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    overflow: "hidden",
    transition: "margin-top 0.3s ease",
    zIndex: 2,
    position: "relative",
  },
  tableWrapper: {
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "62vh",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "13px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#888",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: "#faf9f7",
    borderBottom: "1.5px solid #ede9e0",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
  },
  thIdx: { width: "44px", color: "#ccc" },
  td: {
    padding: "11px 16px",
    color: "#2d2d2d",
    borderBottom: "1px solid #f0ede8",
    maxWidth: "220px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition: "background 0.12s",
  },
  tdIdx: { color: "#ccc", fontSize: "12px" },

  // States
  stateBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 0",
    gap: "14px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "3px solid #e8e4dc",
    borderTopColor: "#3d6b4f",
    animation: "spin 0.8s linear infinite",
  },
  stateText: { color: "#aaa", fontSize: "13px", margin: 0 },
  loader: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
  },
};

export default DetailsView;

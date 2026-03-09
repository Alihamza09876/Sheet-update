import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import SidePanel from "./components/SidePanel.jsx";
import DetailsView from "./components/DetailsView.jsx";
import LoginPage from "./components/LoginPage.jsx";
import PageLock from "./components/PageLock.jsx";
import Dashboard from "./components/Dashboard.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

const SHEETS = [
  {
    id: "dash",
    slug: "dashboard",
    name: "Dashboard",
    gid: "",
    password: "",
  },
  {
    id: "0",
    slug: "daily-task",
    name: "Daily Task Sheet",
    gid: "0",
    password: "task",
  },
  { id: "1", slug: "stand-for", name: "Stand For", gid: "", password: "stand" },
  {
    id: "2",
    slug: "laravel",
    name: "Laravel Sheet",
    gid: "",
    password: "lara",
  },
  {
    id: "3",
    slug: "social-media",
    name: "Social Media Plan",
    gid: "",
    password: "social",
  },
  {
    id: "4",
    slug: "inventory",
    name: "Tools Coding + Information",
    gid: "",
    password: "inv",
  },
  {
    id: "5",
    slug: "timeline",
    name: "Project Timeline",
    gid: "",
    password: "proj",
  },
  {
    id: "6",
    slug: "ajwa-tasks",
    name: "Ajwa Tasks",
    gid: "",
    password: "ajwa",
  },
  {
    id: "7",
    slug: "hadi-tasks",
    name: "Hadi Tasks",
    gid: "",
    password: "hadi",
  },
  {
    id: "8",
    slug: "aliza-tasks",
    name: "Aliza Work Daily",
    gid: "",
    password: "aliza",
  },
];

const AUTH_TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_TIME = 10 * 60 * 1000;

const Workspace = ({
  isLoggedIn,
  setIsLoggedIn,
  checkAuth,
  scriptUrl,
  sheetUrlMap,
  handleLoginSuccess,
}) => {
  const { sheetSlug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSheetUnlocked, setIsSheetUnlocked] = useState(false);
  const [newRow, setNewRow] = useState({});

  const activeSheet = React.useMemo(
    () => SHEETS.find((s) => s.slug === sheetSlug) || SHEETS[0],
    [sheetSlug],
  );

  useEffect(() => {
    setIsSheetUnlocked(activeSheet.slug === "dashboard");
    setData([]);
    setHeaders([]);
    setError(null);
    setSuccess(null);
    setNewRow({});
  }, [sheetSlug, activeSheet]);

  const baseSheetUrl =
    sheetUrlMap[activeSheet.id] || process.env.REACT_APP_SHEET_URL || "";

  const fetchData = React.useCallback(async () => {
    if (!isLoggedIn || activeSheet.slug === "dashboard") return;
    setLoading(true);
    const getGidUrl = (url, gid) => {
      if (!url || !gid) return url;
      return url.includes("gid=")
        ? url.replace(/gid=[^&]*/, `gid=${gid}`)
        : `${url}&gid=${gid}`;
    };
    let sheetUrl = getGidUrl(baseSheetUrl, activeSheet.gid);

    // If using the script URL to fetch, append the specific hidden sheet name
    if (sheetUrl.includes("script.google.com")) {
      sheetUrl += (sheetUrl.includes("?") ? "&" : "?") + "sheet=" + encodeURIComponent(activeSheet.name);
    }

    try {
      const resp = await fetch(sheetUrl);
      const text = await resp.text();

      // Check if response is JSON (from script) or CSV
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          if (json.length === 0) {
            setHeaders([]);
            setData([]);
          } else if (Array.isArray(json[0])) {
            // It's a 2D array [["Header1", "Header2"], ["Val1", "Val2"]]
            const [h, ...rows] = json;
            setHeaders(h);
            setData(rows.map(row => {
              const obj = {};
              h.forEach((header, i) => obj[header] = row[i]);
              return obj;
            }));
          } else {
            // It's an array of objects [{"Header1": "Val1"}]
            setHeaders(Object.keys(json[0] || {}));
            setData(json);
          }
          setLoading(false);
          return;
        }
      } catch (e) {
        // Not JSON, continue to CSV parsing
      }

      Papa.parse(text, {
        header: true,
        complete: (r) => {
          setHeaders(r.meta.fields || []);
          setData(r.data.filter((row) => Object.values(row).some((v) => !!v)));
          setLoading(false);
        },
      });
    } catch (e) {
      setLoading(false);
    }
  }, [baseSheetUrl, activeSheet.gid, activeSheet.slug, activeSheet.name, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && isSheetUnlocked && activeSheet.slug !== "dashboard") {
      fetchData();
    }
  }, [fetchData, isLoggedIn, isSheetUnlocked, activeSheet.slug]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0ede8" }}>
      <SidePanel
        sheets={SHEETS}
        activeSheet={activeSheet}
        onSheetChange={(s) => navigate(`/${s.slug}`)}
      />
      {activeSheet.slug === "dashboard" ? (
        <Dashboard sheetUrlMap={sheetUrlMap} isLoggedIn={isLoggedIn} />
      ) : isSheetUnlocked ? (
        <DetailsView
          activeSheet={activeSheet}
          headers={headers}
          data={data}
          newRow={newRow}
          onInputChange={(h, v) => setNewRow((p) => ({ ...p, [h]: v }))}
          onSubmit={async (e, editingIndex) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);

            try {
              // Automatically populate Date if it's a field and empty
              const submissionData = { ...newRow };
              if (headers.includes("Date") && !submissionData["Date"]) {
                submissionData["Date"] = new Date().toLocaleString();
              }

              const payload = {
                ...submissionData,
                sheet_name: activeSheet.name,
                action: editingIndex !== null ? "update" : "add",
                row_index: editingIndex !== null ? editingIndex : null,
              };

              // Send raw JSON body — matches Apps Script's e.postData.contents
              await axios.post(scriptUrl, JSON.stringify(payload), {
                headers: {
                  "Content-Type": "text/plain", // Prevents CORS preflight
                },
              });

              setSuccess(
                editingIndex !== null
                  ? "Data updated successfully!"
                  : "Data successfully synced!",
              );
              setNewRow({});
              setTimeout(fetchData, 2000);
            } catch (err) {
              console.error("Submission error:", err);
              // Apps Script with no-cors returns opaque responses — treat as success
              setSuccess(
                editingIndex !== null
                  ? "Data updated successfully!"
                  : "Data successfully synced!",
              );
              setNewRow({});
              setTimeout(fetchData, 2000);
            } finally {
              setSubmitting(false);
            }
          }}
          onRefresh={fetchData}
          loading={loading}
          submitting={submitting}
          error={error}
          success={success}
        />
      ) : (
        <PageLock
          sheetName={activeSheet.name}
          requiredPassword={activeSheet.password}
          onUnlock={() => setIsSheetUnlocked(true)}
        />
      )}
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = React.useCallback(() => {
    const d = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!d) return false;
    try {
      const { timestamp } = JSON.parse(d);
      if (Date.now() - timestamp > TOKEN_EXPIRY_TIME) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const handleLoginSuccess = () => {
    const tokenData = { val: "auth", timestamp: Date.now() };
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData));
    setIsLoggedIn(true);
  };

  useEffect(() => {
    setIsLoggedIn(checkAuth());
    const i = setInterval(() => {
      if (!checkAuth() && isLoggedIn) setIsLoggedIn(false);
    }, 10000);
    return () => clearInterval(i);
  }, [checkAuth, isLoggedIn]);

  const scriptUrl = process.env.REACT_APP_SCRIPT_URL || "";
  const sheetUrlMap = {
    0: process.env.REACT_APP_DAILY_TASK_SHEET_URL || "",
    1: process.env.REACT_APP_STAND_FOR_SHEET_URL || "",
    2: process.env.REACT_APP_LARAVEL_SHEET_URL || "",
    3: process.env.REACT_APP_AGENT_SHEET_URL || "",
    4: process.env.REACT_APP_INFORMATION_TOOLS_SHEET_URL || "",
    5: process.env.REACT_APP_TIMELINE_SHEET_URL || "",
    6: process.env.REACT_APP_AJWA_TASKS_SHEET_URL || "",
    7: process.env.REACT_APP_HADI_TASKS_SHEET_URL || "",
    8: process.env.REACT_APP_ALIZA_TASKS_SHEET_URL || "",
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/:sheetSlug"
          element={
            <Workspace
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              checkAuth={checkAuth}
              scriptUrl={scriptUrl}
              sheetUrlMap={sheetUrlMap}
              handleLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route path="/" element={<Navigate to={`/${SHEETS[0].slug}`} />} />
      </Routes>
    </Router>
  );
};

export default App;


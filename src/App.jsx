import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import SidePanel from "./components/SidePanel.jsx";
import DetailsView from "./components/DetailsView.jsx";
import LoginPage from "./components/LoginPage.jsx";
import PageLock from "./components/PageLock.jsx";
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
    id: "0",
    slug: "daily-task",
    name: "Daily Task Sheet",
    gid: "0",
    password: "task",
  },
  { id: "1", slug: "stand-for", name: "Stand For", gid: "", password: "stand" },
  { id: "2", slug: "laravel", name: "Laravel Sheet", gid: "", password: "lara" },
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
    name: "Inventory Tracker",
    gid: "",
    password: "inv",
  },
  { id: "5", slug: "timeline", name: "Project Timeline", gid: "", password: "proj" },
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
    setIsSheetUnlocked(false);
    setData([]);
    setHeaders([]);
    setError(null);
    setSuccess(null);
    setNewRow({});
  }, [sheetSlug]);

  const baseSheetUrl =
    sheetUrlMap[activeSheet.id] || process.env.REACT_APP_SHEET_URL || "";

  const fetchData = React.useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    const getGidUrl = (url, gid) => {
      if (!url || !gid) return url;
      return url.includes("gid=")
        ? url.replace(/gid=[^&]*/, `gid=${gid}`)
        : `${url}&gid=${gid}`;
    };
    const sheetUrl = getGidUrl(baseSheetUrl, activeSheet.gid);
    try {
      const resp = await fetch(sheetUrl);
      const csv = await resp.text();
      Papa.parse(csv, {
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
  }, [baseSheetUrl, activeSheet.gid, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && isSheetUnlocked) {
      fetchData();
    }
  }, [fetchData, isLoggedIn, isSheetUnlocked]);

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
      {isSheetUnlocked ? (
        <DetailsView
          activeSheet={activeSheet}
          headers={headers}
          data={data}
          newRow={newRow}
          onInputChange={(h, v) => setNewRow((p) => ({ ...p, [h]: v }))}
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            try {
              await fetch(scriptUrl, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({
                  ...newRow,
                  sheet_name: activeSheet.name,
                }),
              });
              setSuccess("Data successfully synced!");
              setNewRow({});
              setTimeout(fetchData, 1500);
            } catch (e) {
              setError("Failed to submit");
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

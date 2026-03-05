import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import SidePanel from './components/SidePanel';
import DetailsView from './components/DetailsView';
import LoginPage from './components/LoginPage';

interface Sheet {
  id: string;
  name: string;
  gid: string;
}

/**
 * Main dashboard using environment variables and multi-sheet support.
 * Rebuilt with Tailwind CSS and TypeScript (TSX).
 */
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (_email: string) => {
    setIsLoggedIn(true);
  };

  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Environment Config (URLs stored in .env)
  const scriptUrl = process.env.REACT_APP_SCRIPT_URL || '';

  // Multiple Sheet Support – each sheet has its own published CSV URL from .env
  const SHEETS: Sheet[] = [
    { id: '0', name: 'Daily Task Sheet', gid: '0' },
    { id: '1', name: 'Stand For', gid: '1251648043' },
    { id: '2', name: 'Laravel Sheet', gid: '459201948' },
  ];

  // Per-sheet URL map
  const sheetUrlMap: Record<string, string> = {
    '0': process.env.REACT_APP_DAILY_TASK_SHEET_URL || process.env.REACT_APP_SHEET_URL || '',
    '1': process.env.REACT_APP_STAND_FOR_SHEET_URL || process.env.REACT_APP_SHEET_URL || '',
    '2': process.env.REACT_APP_LARAVEL_SHEET_URL || process.env.REACT_APP_SHEET_URL || '',
  };

  const [activeSheet, setActiveSheet] = useState<Sheet>(SHEETS[0]);
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  // Derives the correct CSV URL for the active sheet
  const baseSheetUrl = sheetUrlMap[activeSheet.id] || process.env.REACT_APP_SHEET_URL || '';

  /**
   * Constructs the URL specifically for a given Sheet (gid).
   */
  const getGidUrl = (url: string, gid: string): string => {
    if (!url.includes('gid=')) {
      return `${url}&gid=${gid}`;
    }
    return url.replace(/gid=[^&]*/, `gid=${gid}`);
  };

  /**
   * READ: Fetches and parses the CSV data from the provided Google Sheet URL.
   */
  const fetchData = React.useCallback(async (sheet: Sheet) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const sheetUrl = getGidUrl(baseSheetUrl, sheet.gid);

    try {
      const response = await fetch(sheetUrl, {
        method: 'GET',
        redirect: 'follow', // Handles 307 Redirects
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (results.meta && results.meta.fields) {
            setHeaders(results.meta.fields);
          } else if (results.data && results.data.length > 0) {
            setHeaders(Object.keys(results.data[0] as object));
          }

          if (results.data) {
            // Remove empty rows that papaparse might catch
            const sanitizedData = results.data.filter((row: any) =>
              Object.values(row).some(v => v !== null && v !== "" && v !== undefined)
            );
            setData(sanitizedData);
          }

          setLoading(false);
        },
        error: (err: any) => {
          console.error("Parsing error:", err);
          setError("Data was fetched but could not be parsed as CSV.");
          setLoading(false);
        }
      });

    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(`Read Error: ${err.message}. Ensure sheet is published.`);
      setLoading(false);
    }
  }, [baseSheetUrl]);

  /**
   * WRITE: Sends new row data to the Google Apps Script Web App.
   */
  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptUrl) {
      setError("Script URL not configured in .env (REACT_APP_SCRIPT_URL)");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Add sheet target info to the payload
    const payload = {
      ...newRow,
      sheet_name: activeSheet.name,
      sheet_gid: activeSheet.gid
    };

    try {
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSuccess(`Data successfully synced to ${activeSheet.name}!`);
      setNewRow({});

      // Re-fetch data after a small delay to allow GAS to finish appending
      setTimeout(() => {
        fetchData(activeSheet);
      }, 2000);

    } catch (err: any) {
      console.error("Submit Error:", err);
      setError("Failed to submit data. Ensure your Script URL is correct.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData(activeSheet);
  }, [activeSheet, fetchData]);

  const handleInputChange = (header: string, value: string) => {
    setNewRow({
      ...newRow,
      [header]: value
    });
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex dashboard-root">
      <SidePanel
        sheets={SHEETS}
        activeSheet={activeSheet}
        onSheetChange={setActiveSheet}
      />

      <DetailsView
        activeSheet={activeSheet}
        headers={headers}
        data={data}
        newRow={newRow}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitData}
        loading={loading}
        submitting={submitting}
        error={error}
        success={success}
      />
    </div>
  );
};

export default App;

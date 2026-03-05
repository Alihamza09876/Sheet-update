import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import SidePanel from './components/SidePanel.jsx';
import DetailsView from './components/DetailsView.jsx';
import LoginPage from './components/LoginPage.jsx';

const SHEETS = [
  { id: '0', name: 'Daily Task Sheet', gid: '0' },
  { id: '1', name: 'Stand For', gid: '1251648043' },
  { id: '2', name: 'Laravel Sheet', gid: '459201948' },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSheet, setActiveSheet] = useState(SHEETS[0]);
  const [newRow, setNewRow] = useState({});

  const scriptUrl = process.env.REACT_APP_SCRIPT_URL || '';

  const sheetUrlMap = {
    '0': process.env.REACT_APP_DAILY_TASK_SHEET_URL || process.env.REACT_APP_SHEET_URL || '',
    '1': process.env.REACT_APP_STAND_FOR_SHEET_URL || process.env.REACT_APP_SHEET_URL || '',
    '2': process.env.REACT_APP_LARAVEL_SHEET_URL || process.env.REACT_APP_SHEET_URL || '',
  };

  const baseSheetUrl = sheetUrlMap[activeSheet.id] || process.env.REACT_APP_SHEET_URL || '';

  const getGidUrl = (url, gid) =>
    url.includes('gid=') ? url.replace(/gid=[^&]*/, `gid=${gid}`) : `${url}&gid=${gid}`;

  const fetchData = React.useCallback(async (sheet) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const sheetUrl = getGidUrl(baseSheetUrl, sheet.gid);
    try {
      const response = await fetch(sheetUrl, { method: 'GET', redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (results.meta?.fields) setHeaders(results.meta.fields);
          else if (results.data?.length > 0) setHeaders(Object.keys(results.data[0]));
          if (results.data) {
            setData(results.data.filter(row =>
              Object.values(row).some(v => v !== null && v !== '' && v !== undefined)
            ));
          }
          setLoading(false);
        },
        error: () => { setError('Data was fetched but could not be parsed as CSV.'); setLoading(false); },
      });
    } catch (err) {
      setError(`Read Error: ${err.message}. Ensure sheet is published.`);
      setLoading(false);
    }
  }, [baseSheetUrl]);

  const handleSubmitData = async (e) => {
    e.preventDefault();
    if (!scriptUrl) { setError('Script URL not configured in .env (REACT_APP_SCRIPT_URL)'); return; }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const payload = { ...newRow, sheet_name: activeSheet.name, sheet_gid: activeSheet.gid };
    try {
      await fetch(scriptUrl, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSuccess(`Data successfully synced to ${activeSheet.name}!`);
      setNewRow({});
      setTimeout(() => fetchData(activeSheet), 2000);
    } catch (err) {
      setError('Failed to submit data. Ensure your Script URL is correct.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSheetChange = (sheet) => {
    setActiveSheet(sheet);
    setData([]);
    setHeaders([]);
    setError(null);
    setSuccess(null);
    setNewRow({});
  };

  useEffect(() => { fetchData(activeSheet); }, [activeSheet, fetchData]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0ede8' }}>
      <SidePanel
        sheets={SHEETS}
        activeSheet={activeSheet}
        onSheetChange={handleSheetChange}
      />
      <DetailsView
        activeSheet={activeSheet}
        headers={headers}
        data={data}
        newRow={newRow}
        onInputChange={(header, value) => setNewRow(prev => ({ ...prev, [header]: value }))}
        onSubmit={handleSubmitData}
        onRefresh={() => fetchData(activeSheet)}
        loading={loading}
        submitting={submitting}
        error={error}
        success={success}
      />
    </div>
  );
};

export default App;
import React from 'react';

interface Sheet {
    id: string;
    name: string;
    gid: string;
}

interface DetailsViewProps {
    activeSheet: Sheet;
    headers: string[];
    data: any[];
    newRow: Record<string, string>;
    onInputChange: (header: string, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    submitting: boolean;
    error: string | null;
    success: string | null;
}

const DetailsView: React.FC<DetailsViewProps> = ({
    activeSheet,
    headers,
    data,
    newRow,
    onInputChange,
    onSubmit,
    loading,
    submitting,
    error,
    success
}) => {
    return (
        <div className="flex-1 ml-80 min-h-screen bg-slate-50 text-slate-800 p-8 lg:p-14 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header Section */}
                <header className="flex items-center justify-between gap-6 pb-6 border-b border-slate-200">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
                            {activeSheet.name}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                Integration Active
                            </span>
                            <span className="text-slate-300">/</span>
                            <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-lg border border-primary-100 uppercase tracking-tighter">
                                Secure ENV
                            </span>
                        </div>
                    </div>
                    {loading && (
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase animate-pulse">
                            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            Syncing...
                        </div>
                    )}
                </header>

                {/* Status Alerts */}
                <div className="space-y-4">
                    {error && (
                        <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-2xl animate-shake">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">⚠️</span>
                                <p className="text-sm font-bold text-rose-800 leading-relaxed uppercase tracking-tight">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-2xl animate-bounce-subtle">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">✅</span>
                                <p className="text-sm font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                                    {success}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Data Form */}
                <div className="bg-white rounded-[2.5rem] p-4 lg:p-14 shadow-2xl shadow-indigo-900/10 border border-slate-100 transition-all hover:border-slate-200/60 ring-1 ring-slate-900/5 group">
                    <div className="mb-8 flex items-center gap-2">
                        <span className="text-xl">📝</span>
                        <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Add Record</h3>
                    </div>
                    {!loading && headers.length > 0 ? (
                        <form onSubmit={onSubmit} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                                {headers.map((header) => (
                                    <div key={header} className="space-y-2 group/input transition-all duration-300">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within/input:text-primary-600">
                                            {header}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Enter your ${header}...`}
                                            value={newRow[header] || ''}
                                            onChange={(e) => onInputChange(header, e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-800 font-semibold placeholder-slate-400 focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-600/5 outline-none transition-all duration-300 shadow-sm"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full md:w-[320px] group relative overflow-hidden px-8 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 ${submitting
                                        ? 'bg-slate-800 text-slate-400 shadow-none ring-2 ring-slate-800/10 cursor-not-allowed'
                                        : 'bg-primary-600 text-white shadow-2xl shadow-primary-900/40 hover:bg-primary-700 hover:shadow-primary-900/60 ring-2 ring-primary-500/20'
                                        }`}
                                >
                                    <span className={`transition-all duration-300 whitespace-nowrap ${submitting ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
                                        Push Data to Cloud
                                    </span>

                                    {submitting ? (
                                        <div className="absolute inset-0 flex items-center justify-center gap-3 animate-pulse">
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            <span className="text-[10px] font-black opacity-60">Syncing...</span>
                                        </div>
                                    ) : (
                                        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                                    )}

                                    {/* Glass Shimmer Overlay */}
                                    {!submitting && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-shimmer duration-1000"></div>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : headers.length === 0 && !loading && !error ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="text-5xl animate-bounce">📭</div>
                            <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm max-w-[280px]">
                                Please verify your sheet configuration. No columns found.
                            </p>
                        </div>
                    ) : null}
                </div>

                {/* Display Sheet Data */}
                <div className="bg-white rounded-[2.5rem] p-4 lg:p-10 shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
                    <div className="mb-6 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📊</span>
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Sheet Explorer</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            Showing {data.length} Records
                        </span>
                    </div>

                    <div className="overflow-x-auto rounded-[1.5rem] border border-slate-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    {headers.map((header) => (
                                        <th key={header} className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.length > 0 ? (
                                    data.map((row, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                                            {headers.map((header) => (
                                                <td key={header} className="px-6 py-5 text-sm font-semibold text-slate-600 transition-colors group-hover:text-slate-900">
                                                    {row[header] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                            {loading ? 'Crunching data...' : 'No records found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Hint */}
                <div className="flex items-center justify-center gap-3 text-slate-300 font-black text-[9px] uppercase tracking-[0.3em] pb-10">
                    <span className="w-8 h-[1px] bg-slate-200"></span>
                    Managed Via Google Apps Script
                    <span className="w-8 h-[1px] bg-slate-200"></span>
                </div>
            </div>
        </div>
    );
};

export default DetailsView;

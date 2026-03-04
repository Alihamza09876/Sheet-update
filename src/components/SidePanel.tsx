import React from 'react';

interface Sheet {
    id: string;
    name: string;
    gid: string;
}

interface SidePanelProps {
    sheets: Sheet[];
    activeSheet: Sheet;
    onSheetChange: (sheet: Sheet) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ sheets, activeSheet, onSheetChange }) => {
    return (
        <div className="w-80 h-screen bg-slate-900 text-white flex flex-col p-8 fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-800">
                <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary-900/40">
                    🚀
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Sheet Portal
                </h1>
            </div>

            <div className="flex-1 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 mb-4 block">
                    Workspaces
                </span>
                {sheets.map((sheet) => (
                    <button
                        key={sheet.id}
                        onClick={() => onSheetChange(sheet)}
                        className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${activeSheet.id === sheet.id
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/20'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                    >
                        <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${activeSheet.id === sheet.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                            📂
                        </span>
                        <span className="truncate">{sheet.name}</span>
                        {activeSheet.id === sheet.id && (
                            <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800/50">
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                        Status
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        v3.0 Cloud Ready
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;

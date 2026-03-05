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


const icons: Record<string, React.ReactElement> = {
    '0': (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
        </svg>
    ),
    '1': (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
        </svg>
    ),
    '2': (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
    ),
};

const SidePanel: React.FC<SidePanelProps> = ({ sheets, activeSheet, onSheetChange }) => {
    return (
        <aside style={styles.sidebar}>
            {/* Decorative blobs */}
            <div style={styles.blobTop} />
            <div style={styles.blobBottom} />

            {/* Logo / Header */}
            <div style={styles.header}>
                <div style={styles.logoWrap}>
                    <span style={styles.logoIcon}>⚡</span>
                </div>
                <div>
                    <p style={styles.logoLabel}>Sheet Portal</p>
                    <p style={styles.logoSub}>Data Dashboard</p>
                </div>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>
                <p style={styles.sectionLabel}>Workspaces</p>
                {sheets.map((sheet) => {
                    const isActive = activeSheet.id === sheet.id;
                    return (
                        <button
                            key={sheet.id}
                            onClick={() => onSheetChange(sheet)}
                            style={{
                                ...styles.navBtn,
                                ...(isActive ? styles.navBtnActive : {}),
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(4px)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)';
                                }
                            }}
                        >
                            {/* Active indicator bar */}
                            {isActive && <div style={styles.activeBar} />}

                            {/* Icon */}
                            <span style={{
                                ...styles.iconWrap,
                                ...(isActive ? styles.iconWrapActive : {}),
                            }}>
                                {icons[sheet.id]}
                            </span>

                            {/* Label */}
                            <span style={{
                                ...styles.navLabel,
                                ...(isActive ? styles.navLabelActive : {}),
                            }}>
                                {sheet.name}
                            </span>

                            {/* Dot badge */}
                            {isActive && <span style={styles.activeDot} />}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.statusCard}>
                    <div style={styles.statusRow}>
                        <span style={styles.pulse} />
                        <span style={styles.statusLabel}>Live</span>
                    </div>
                    <p style={styles.statusVersion}>v3.0 · Cloud Ready</p>
                </div>
            </div>
        </aside>
    );
};

/* ─── Inline styles ────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
    sidebar: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(160deg, #0f0c29, #1a1040, #0f0c29)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 20px',
        zIndex: 50,
        boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
    },
    blobTop: {
        position: 'absolute',
        top: '-80px',
        left: '-60px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blobBottom: {
        position: 'absolute',
        bottom: '-80px',
        right: '-60px',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '36px',
        paddingBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
    },
    logoWrap: {
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(124,58,237,0.45)',
        flexShrink: 0,
    },
    logoIcon: {
        fontSize: '22px',
        lineHeight: 1,
    },
    logoLabel: {
        fontSize: '15px',
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '-0.3px',
        margin: 0,
        lineHeight: 1.2,
    },
    logoSub: {
        fontSize: '11px',
        color: 'rgba(255,255,255,0.38)',
        margin: 0,
        marginTop: '2px',
        fontWeight: 500,
        letterSpacing: '0.4px',
    },
    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    sectionLabel: {
        fontSize: '10px',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        marginBottom: '10px',
        paddingLeft: '14px',
    },
    navBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '12px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.22s ease',
        textAlign: 'left',
        overflow: 'hidden',
    },
    navBtnActive: {
        background: 'linear-gradient(120deg, rgba(124,58,237,0.35), rgba(79,70,229,0.22))',
        boxShadow: 'inset 0 0 0 1px rgba(139,92,246,0.25)',
    },
    activeBar: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '60%',
        borderRadius: '0 4px 4px 0',
        background: 'linear-gradient(#a78bfa, #6366f1)',
        boxShadow: '0 0 12px rgba(167,139,250,0.7)',
    },
    iconWrap: {
        width: '34px',
        height: '34px',
        borderRadius: '9px',
        background: 'rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.45)',
        flexShrink: 0,
        transition: 'all 0.22s ease',
    },
    iconWrapActive: {
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        color: '#ffffff',
        boxShadow: '0 4px 14px rgba(124,58,237,0.5)',
    },
    navLabel: {
        fontSize: '13.5px',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.45)',
        flex: 1,
        transition: 'color 0.22s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    navLabelActive: {
        color: '#ffffff',
        fontWeight: 600,
    },
    activeDot: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: 'linear-gradient(#a78bfa, #818cf8)',
        boxShadow: '0 0 8px rgba(167,139,250,0.8)',
        flexShrink: 0,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    statusCard: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '12px 14px',
        border: '1px solid rgba(255,255,255,0.07)',
    },
    statusRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        marginBottom: '4px',
    },
    pulse: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#34d399',
        boxShadow: '0 0 0 3px rgba(52,211,153,0.25)',
        animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        display: 'inline-block',
    },
    statusLabel: {
        fontSize: '12px',
        fontWeight: 700,
        color: '#34d399',
        letterSpacing: '0.3px',
    },
    statusVersion: {
        fontSize: '11px',
        color: 'rgba(255,255,255,0.3)',
        margin: 0,
        fontWeight: 400,
    },
};

export default SidePanel;

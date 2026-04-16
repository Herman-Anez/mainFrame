import { useState } from 'react';

export function Header({ themeMode, setThemeMode, onOpenMapModal }) {
    return (
        <div className="top-bar">
            <button onClick={onOpenMapModal} className="top-btn" title="Ver Mapa de Variables CSS">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                Mapa CSS
            </button>
            <div className="theme-selector select-group">
                <button onClick={() => setThemeMode('light')} className={`mode-btn ${themeMode === 'light' ? 'active' : ''}`}>☀️ Claro</button>
                <button onClick={() => setThemeMode('dark')} className={`mode-btn ${themeMode === 'dark' ? 'active' : ''}`}>🌙 Oscuro</button>
                <button onClick={() => setThemeMode('free')} className={`mode-btn ${themeMode === 'free' ? 'active' : ''}`}>🎨 Libre</button>
            </div>
        </div>
    );
}

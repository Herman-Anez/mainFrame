import { useState } from 'react';

export function CssMapModal({ isOpen, onClose }) {
    const [highlightVar, setHighlightVar] = useState('');

    if (!isOpen) return null;

    const highlight = (variable) => setHighlightVar(variable);
    const unhighlight = () => setHighlightVar('');

    const getWireframeClass = (targets) => {
        if (!highlightVar) return 'wf-element';
        const targetList = targets.split(' ');
        if (targetList.includes(highlightVar)) {
            return `wf-element highlight-${highlightVar}`;
        }
        return 'wf-element wf-faded'; // faded class for opacity: 0.3
    };

    return (
        <div id="cssMapModal" className="modal-overlay visible" onClick={(e) => {
            if(e.target.id === 'cssMapModal') onClose();
        }}>
            <div className="modal-content glass-panel">
                <button className="close-modal" aria-label="Cerrar modal" onClick={onClose}>&times;</button>
                
                <div className="map-controls">
                    <h3>Variables CSS</h3>
                    <p className="subtitle">Explora cómo las variables afectan la UI</p>
                    
                    <button className="map-var-btn" onMouseOver={() => highlight('primary')} onMouseOut={unhighlight}>--primary <span>[N1] ✨ Identidad Principal</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('background')} onMouseOut={unhighlight}>--background <span>[N2] 🔲 Fondo Base</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('surface')} onMouseOut={unhighlight}>--surface <span>[N2] 📦 Tarjetas / Paneles</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('foreground')} onMouseOut={unhighlight}>--foreground <span>[N2] 📝 Textos Principales</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('secondary')} onMouseOut={unhighlight}>--secondary <span>[N3] 🔘 Base Secundaria</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('muted')} onMouseOut={unhighlight}>--muted <span>[N3] ⌨️ Fondos Secundarios</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('border')} onMouseOut={unhighlight}>--border <span>[N3] 📏 Bordes</span></button>
                    <button className="map-var-btn" onMouseOver={() => highlight('surface-sunken')} onMouseOut={unhighlight}>--surface-sunken <span>[N2] 👾 Canvas/Hundido</span></button>
                </div>
                
                <div className={`map-wireframe ${getWireframeClass('background')}`}>
                    <div className={`wf-panel ${getWireframeClass('surface border')}`}>
                        <strong className={getWireframeClass('foreground')}>Panel Principal</strong>
                        <div className={`wf-canvas ${getWireframeClass('surface-sunken border')}`}></div>
                        <div className={`wf-input ${getWireframeClass('muted border foreground')}`}>Caja de entrada</div>
                        <div className="wf-btn-row">
                            <div className={`wf-btn ${getWireframeClass('secondary border secondary-foreground')}`}>Botón</div>
                            <div className={`wf-btn ${getWireframeClass('secondary border secondary-foreground')}`}>Botón</div>
                        </div>
                        <div className={`wf-accent ${getWireframeClass('primary primary-foreground')}`}>Botón Acción Principal</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useRef, useCallback, useEffect } from 'react';
import { hslToHex } from '../utils/colorUtils';
import { PalettePreview } from './PalettePreview';

export function ControlsPanel({ 
    nodes, 
    currentMode, 
    setMode, 
    globalRotation, 
    setGlobalRotation, 
    addNode, 
    removeNode, 
    updateNode 
}) {

    return (
        <aside className="controls glass-panel">
            {/* Harmony Mode Selector */}
            <div className="control-group">
                <label>Modo de Armonía</label>
                <div className="modes-selector select-group">
                    <button onClick={() => setMode('manual')} className={`mode-btn ${currentMode === 'manual' ? 'active' : ''}`}>Libre</button>
                    <button onClick={() => setMode('complementary')} className={`mode-btn ${currentMode === 'complementary' ? 'active' : ''}`}>Complementario</button>
                    <button onClick={() => setMode('triad')} className={`mode-btn ${currentMode === 'triad' ? 'active' : ''}`}>Tríada</button>
                    <button onClick={() => setMode('tetrad')} className={`mode-btn ${currentMode === 'tetrad' ? 'active' : ''}`}>Tetráda</button>
                </div>
            </div>

            {/* Global Rotation */}
            <div className="control-group">
                <label htmlFor="globalRotation">Desplazamiento / Rotación:</label>
                <input 
                    type="range" 
                    id="globalRotation" 
                    className="custom-range" 
                    min="0" 
                    max="360" 
                    value={globalRotation}
                    onChange={(e) => setGlobalRotation(parseInt(e.target.value))}
                />
            </div>

            {/* Add Node Button */}
            {currentMode === 'manual' && (
                <button onClick={addNode} className="btn btn-dashed icon-btn">+ Añadir Color Libre</button>
            )}
            
            {/* Node List */}
            <div id="nodeList" className="node-list">
                {nodes.map((node, index) => {
                    let role = 'Extra';
                    if (index === 0) role = 'Identidad Primaria';
                    else if (index === 1) role = 'Fondo / Superficie';
                    else if (index === 2) role = 'Secundario / Borde';

                    const hex = hslToHex((node.baseAngle + globalRotation) % 360, node.s, node.l);
                    const lightPercent = Math.round(node.l * 100);

                    return (
                        <div key={node.id} className="node-item">
                            <div style={{ lineHeight: 1.2 }}>
                                <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--foreground)', opacity: 0.9 }}>
                                    N{index + 1}
                                </span><br />
                                <span style={{ fontSize: '10px', opacity: 0.6 }}>{role}</span>
                            </div>
                            
                            <input 
                                type="color" 
                                value={hex} 
                                readOnly // For display mostly since Hue logic implies updating angle
                            />
                            
                            <input 
                                type="text" 
                                value={hex.toUpperCase()} 
                                readOnly
                                maxLength="7" 
                            />
                            
                            <div className="lightness-control">
                                <input 
                                    type="range" 
                                    className="lightness-range" 
                                    min="0" 
                                    max="100" 
                                    value={lightPercent} 
                                    onChange={(e) => updateNode(node.id, { l: parseInt(e.target.value) / 100 })}
                                    title={`Claridad: ${lightPercent}%`} 
                                />
                                <span className="lightness-label">{lightPercent}%</span>
                            </div>
                            
                            {currentMode === 'manual' && (
                                <button className="btn btn-dashed" style={{ padding: '6px', fontSize: '0.8rem' }} onClick={() => removeNode(node.id)}>
                                    Del
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <PalettePreview nodes={nodes} globalRotation={globalRotation} />
        </aside>
    );
}

import { useState, useMemo } from 'react';
import { hslToHex } from '../utils/colorUtils';

export function PalettePreview({ nodes, globalRotation }) {
    const [copiedContent, setCopiedContent] = useState('');

    const cssContent = useMemo(() => {
        let text = `/* ===== RAW SCALES (ESCALAS BRUTAS DEL 100 AL 900) ===== */\n:root {\n`;
        const lightnessSteps = [0.9, 0.7, 0.5, 0.3, 0.1];
        
        nodes.forEach((node, index) => {
            const currentHue = (node.baseAngle + globalRotation) % 360;
            let label = index === 0 ? 'primary' : index === 1 ? 'base' : index === 2 ? 'secondary' : `extra-${index + 1}`;
            
            lightnessSteps.forEach((l, stepIndex) => {
                const weight = (stepIndex * 2 + 1) * 100;
                const hex = hslToHex(currentHue, node.s, l);
                text += `  --color-${label}-${weight}: ${hex};\n`;
            });
        });
        text += '}\n';
        return text;
    }, [nodes, globalRotation]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssContent);
        setCopiedContent('copied');
        setTimeout(() => setCopiedContent(''), 2500);
    };

    return (
        <>
            <hr className="divider" />
            
            <div className="control-group">
                <label>Paleta Generada <span className="badge">Clic para copiar</span></label>
                <div id="palettePreview" className="palette-preview">
                    {nodes.map((node, index) => {
                        const currentHue = (node.baseAngle + globalRotation) % 360;
                        const lightnessSteps = [0.9, 0.7, 0.5, 0.3, 0.1];
                        let label = index === 0 ? 'primary' : index === 1 ? 'base' : index === 2 ? 'secondary' : `extra-${index + 1}`;

                        return (
                            <div key={node.id} className="color-column">
                                <span style={{ fontSize: '10px', opacity: 0.6, display: 'block', marginBottom: '8px' }}>
                                    {label.toUpperCase()}
                                </span>
                                {lightnessSteps.map((l, stepIndex) => {
                                    const hex = hslToHex(currentHue, node.s, l);
                                    return (
                                        <div 
                                            key={stepIndex} 
                                            className="color-swatch"
                                            style={{ backgroundColor: hex }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(hex);
                                            }}
                                            title="Click para copiar HEX"
                                        >
                                            {hex}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button id="exportBtn" className="btn btn-primary btn-large icon-btn" onClick={copyToClipboard}>
                {copiedContent === 'copied' ? '✨ ¡Tokens Copiados!' : (
                    <>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                        Copiar código CSS
                    </>
                )}
            </button>
        </>
    );
}

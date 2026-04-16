import { useLayoutEffect } from 'react';
import { hslToHex, getTextColorForBackground } from '../utils/colorUtils';

/**
 * HOOK PRINCIPAL DEL MOTOR GRÁFICO CSS (useDynamicTheme)
 * 
 * Se encarga de traducir los datos lógicos de los nodos (H, S, L y Rotación) 
 * a la paleta de colores final que conforma la interfaz (Glassmorphism dinámico).
 * 
 * ¿Por qué usamos `useLayoutEffect` en lugar de `useEffect`?
 *   - `useEffect` se ejecuta DESPUÉS de que el navegador ha pintado la pantalla = Flash visual de estilos.
 *   - `useLayoutEffect` se dispara bloqueando el pintado repintando el CSS justo ANTES 
 *     de que el usuario vea el cuadro. Previene tirones visuales a 60FPS.
 * 
 * Mecánica de Especificidad CSS:
 *   Las variables se inyectan como estilos inline en `document.body` (`body.style...`), 
 *   lo cual otorga máxima prioridad (Specificity: 1,0,0,0) sobrecargando las clases :root y .dark-mode.
 * 
 * @param {Array}  nodes - Lista de nodos de color activos { baseAngle, s, l }.
 * @param {number} globalRotation - Offset de grados a sumar a los ángulos base (0-360).
 * @param {string} themeMode - Selector estricto de control de jerarquía de temas ('light', 'dark', 'free').
 */
export function useDynamicTheme(nodes, globalRotation, themeMode) {
    useLayoutEffect(() => {
        const body = document.body;
        
        // Limpiar inline styles
        body.style.cssText = '';
        body.classList.remove('dark-mode');

        if (themeMode === 'light') {
            // Root wins
        } else if (themeMode === 'dark') {
            body.classList.add('dark-mode');
        } else if (themeMode === 'free') {
            // --- Lógica del Theming Continuo Exactamente Portada ---
            const offset = parseInt(globalRotation) || 0;
            const node1 = nodes[0] || { baseAngle: 0, s: 0, l: 1 };
            const node2 = nodes[1] || node1;                             
            const node3 = nodes[2] || node2;

            const hue1 = (node1.baseAngle + offset) % 360;
            const hue2 = (node2.baseAngle + offset) % 360;
            const hue3 = (node3.baseAngle + offset) % 360;

            const backgroundHex = hslToHex(hue2, node2.s, node2.l);
            const surfaceHex = hslToHex(hue2, node2.s, Math.max(0, Math.min(1, node2.l + (0.5 - node2.l) * 0.15)));
            const surfaceSunkenHex = hslToHex(hue2, node2.s, Math.max(0, Math.min(1, node2.l - (0.5 - node2.l) * 0.1)));
            const foregroundHex = getTextColorForBackground(hue2, node2.s, node2.l);

            const secondaryHex = hslToHex(hue3, node3.s, node3.l);
            const mutedHex = hslToHex(hue3, node3.s, Math.max(0, Math.min(1, node3.l + (0.5 - node3.l) * 0.1)));
            const borderHex = hslToHex(hue3, node3.s, Math.max(0, Math.min(1, node3.l + (0.5 - node3.l) * 0.25)));
            const secondaryForegroundHex = getTextColorForBackground(hue3, node3.s, node3.l);

            const primaryHex = hslToHex(hue1, node1.s, node1.l);
            const primaryForegroundHex = getTextColorForBackground(hue1, node1.s, node1.l);

            // Transiciones Alphas
            const alphaSurface = Math.round(170 + (238 - 170) * node2.l).toString(16).padStart(2, '0');
            const alphaMuted   = Math.round(153 + (238 - 153) * node2.l).toString(16).padStart(2, '0');
            const alphaSec     = Math.round(153 + (204 - 153) * node2.l).toString(16).padStart(2, '0');

            body.style.setProperty('--background', backgroundHex);
            body.style.setProperty('--surface', `${surfaceHex}${alphaSurface}`); 
            body.style.setProperty('--muted', `${mutedHex}${alphaMuted}`);
            body.style.setProperty('--border', `${borderHex}aa`);
            body.style.setProperty('--secondary', `${secondaryHex}${alphaSec}`);
            body.style.setProperty('--secondary-hover', borderHex);
            
            body.style.setProperty('--foreground', foregroundHex);
            body.style.setProperty('--secondary-foreground', secondaryForegroundHex);
            body.style.setProperty('--primary', primaryHex);
            body.style.setProperty('--primary-foreground', primaryForegroundHex);
            body.style.setProperty('--surface-sunken', surfaceSunkenHex);

            body.style.setProperty('--color-primary', primaryHex);
            body.style.setProperty('--color-secondary', secondaryHex);
            body.style.setProperty('--color-text', foregroundHex);
            body.style.setProperty('--color-background', backgroundHex);

            const shadowOpacity = 0.5 - (node2.l * 0.3); 
            body.style.setProperty('--shadow-color', `rgba(0, 0, 0, ${shadowOpacity})`);
            body.style.setProperty('--canvas-shadow', `rgba(0, 0, 0, ${shadowOpacity + 0.2})`);
            
            const panelBorderOp = 0.05 + (node2.l * 0.45); 
            body.style.setProperty('--panel-border', `rgba(255, 255, 255, ${panelBorderOp})`);
        }
    }, [nodes, globalRotation, themeMode]);
}

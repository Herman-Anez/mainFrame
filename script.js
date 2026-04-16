/**
 * ============================================================================
 * CÍRCULO CROMÁTICO + JUEGO DE LA VIDA — LÓGICA PRINCIPAL
 * ============================================================================
 * 
 * ARQUITECTURA GENERAL:
 * Este script controla 3 sistemas interconectados:
 * 
 *   1. SISTEMA DE TEMAS (Design Tokens)
 *      Gestiona 3 modos de tema independientes: Claro, Oscuro, Libre.
 *      En modo "Libre", los nodos del círculo cromático controlan
 *      dinámicamente TODAS las variables CSS de la página.
 * 
 *   2. CÍRCULO CROMÁTICO (Color Wheel)
 *      Canvas interactivo donde el usuario posiciona nodos de color
 *      mediante drag & drop. Soporta modos de armonía cromática
 *      (libre, complementario, tríada, tétrada).
 * 
 *   3. AUTÓMATA CELULAR (Juego de la Vida de Conway)
 *      Simulación donde las células heredan los colores de los nodos.
 *      El usuario puede pintar células y ejecutar la simulación.
 * 
 * MODELO DE DATOS DE UN NODO:
 *   {
 *     id: number,         // Identificador único (timestamp)  
 *     baseAngle: number,  // Ángulo base en grados (0-360) = Matiz (Hue)
 *     s: number,          // Saturación (0-1), también = distancia al centro
 *     l: number           // Claridad/Lightness (0-1)
 *   }
 * 
 * FLUJO DE DATOS:
 *   Nodo → HSL → Hex → { Canvas (visual), CSS Variables (tema), Paleta (export) }
 * 
 * ROLES DE NODOS (en modo Libre):
 *   N1 (nodes[0]) → Identidad Primaria:  --primary, --primary-foreground
 *   N2 (nodes[1]) → Fondo/Superficie:    --background, --surface, --foreground
 *   N3 (nodes[2]) → Secundario/Borde:    --muted, --secondary, --border
 */


// ============================================================================
// 1. GESTIÓN DE TEMA (CLARO / OSCURO / LIBRE)
// ============================================================================
// 
// Los 3 modos son COMPLETAMENTE INDEPENDIENTES:
// 
//   ☀️ CLARO:  Usa las variables CSS de :root (estáticas).
//              Los nodos solo afectan la rueda, la paleta y el autómata.
//              body NO tiene clase dark-mode ni inline styles.
// 
//   🌙 OSCURO: Usa las variables CSS de body.dark-mode (estáticas).
//              Los nodos solo afectan la rueda, la paleta y el autómata.
//              body tiene clase dark-mode pero NO inline styles.
// 
//   🎨 LIBRE:  Los nodos controlan TODA la interfaz en tiempo real.
//              applyDynamicTheme() inyecta variables CSS como inline styles
//              en el body, que tienen MÁXIMA PRIORIDAD en la cascada CSS.
//              La claridad del N2 determina si el tema generado es claro u oscuro.
// 
// CONCEPTO CSS CLAVE:
//   body.style.setProperty('--var', valor)  →  Inline style (máxima prioridad)
//   body.dark-mode { --var: valor }         →  Stylesheet class (media prioridad)
//   :root { --var: valor }                  →  Stylesheet root (baja prioridad)
// 
//   Al hacer body.style.cssText = '', se eliminan los inline styles y
//   el navegador vuelve a usar los valores del stylesheet (dark-mode o :root).
// ============================================================================

/** Modo de tema actual. Puede ser 'light', 'dark' o 'free'. */
let currentThemeMode = 'dark';

/**
 * Cambia el modo de tema de la aplicación.
 * Esta función es llamada desde los botones del HTML (onclick).
 * 
 * @param {'light'|'dark'|'free'} mode - El modo de tema a activar.
 * 
 * FLUJO DE EJECUCIÓN:
 *   1. Actualiza el estado interno (currentThemeMode)
 *   2. Actualiza la UI de los botones (.active)
 *   3. LIMPIA las variables inline del body (salir de modo "libre")
 *   4. Aplica la clase CSS correspondiente
 *   5. Si es modo libre, ejecuta applyDynamicTheme()
 *   6. Redibuja el autómata y regenera la paleta
 */
window.setThemeMode = function(mode) {
    currentThemeMode = mode;
    
    // Actualizar estado visual de los botones del selector
    document.querySelectorAll('.theme-selector button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-theme-' + mode).classList.add('active');
    
    // PASO CRÍTICO: Limpiar SIEMPRE las variables dinámicas inyectadas por "libre".
    // Esto permite que el CSS del stylesheet (dark-mode o :root) vuelva a tomar control.
    document.body.style.cssText = '';
    
    // Gestionar la clase dark-mode según el modo seleccionado
    if (mode === 'light') {
        // Modo Claro: Sin dark-mode, sin inline styles → :root gana
        document.body.classList.remove('dark-mode');
    } else if (mode === 'dark') {
        // Modo Oscuro: Con dark-mode, sin inline styles → body.dark-mode gana
        document.body.classList.add('dark-mode');
    } else if (mode === 'free') {
        // Modo Libre: applyDynamicTheme() decide dark/light basándose en N2
        // y luego inyecta inline styles que tienen máxima prioridad
        applyDynamicTheme();
    }
    
    drawGame();
    updateVariations();
};

/**
 * Guarda: ¿Debería ejecutarse applyDynamicTheme() ahora?
 * Solo retorna true en modo "libre". En modos claro/oscuro,
 * las variables CSS son estáticas y no deben ser sobreescritas.
 * 
 * Se usa como guardia en todos los event handlers (drag, input, rotation)
 * para evitar que la UI estática se vea afectada por los nodos.
 */
function shouldApplyDynamic() {
    return currentThemeMode === 'free';
}


// ============================================================================
// 2. UTILIDADES DE CONVERSIÓN DE COLOR
// ============================================================================
// 
// El sistema usa internamente HSL (Hue, Saturation, Lightness) porque
// es intuitivo para manipulación cromática:
//   - Hue (Matiz): Ángulo en la rueda de color (0-360°)
//   - Saturation: Intensidad del color (0 = gris, 1 = puro)
//   - Lightness: Claridad (0 = negro, 0.5 = puro, 1 = blanco)
// 
// Pero el DOM y CSS usan Hex (#RRGGBB), así que necesitamos convertidores.
// ============================================================================

/**
 * Convierte un color hexadecimal (#RRGGBB) a HSL.
 * 
 * @param {string} hex - Color en formato "#RRGGBB"
 * @returns {{ h: number, s: number, l: number }} - HSL (h: 0-360, s: 0-1, l: 0-1)
 * 
 * ALGORITMO:
 *   1. Descomponer hex en R, G, B normalizados (0-1)
 *   2. Encontrar max y min de los canales
 *   3. Calcular L = promedio de max y min
 *   4. Calcular S según si L > 0.5 o no
 *   5. Calcular H según qué canal es el máximo
 */
function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } 
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) { 
            case r: h = (g - b) / d + (g < b ? 6 : 0); break; 
            case g: h = (b - r) / d + 2; break; 
            case b: h = (r - g) / d + 4; break; 
        }
        h /= 6;
    }
    return { h: h * 360, s: s, l: l };
}

/**
 * Convierte un color HSL a hexadecimal (#RRGGBB).
 * 
 * @param {number} h - Matiz (Hue) en grados, 0-360
 * @param {number} s - Saturación, 0-1
 * @param {number} l - Claridad (Lightness), 0-1
 * @returns {string} Color en formato "#RRGGBB" (mayúsculas)
 */
function hslToHex(h, s, l) {
    h = (h % 360 + 360) % 360;                    // Normalizar ángulo negativo
    let r, g, b; 
    h /= 360;
    if (s === 0) { r = g = b = l; }                // Gris (sin saturación)
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; 
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s; 
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3); 
        g = hue2rgb(p, q, h); 
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Calcula la luminancia relativa de un color HSL.
 * Usa la fórmula WCAG (ponderación perceptual: R×0.2126 + G×0.7152 + B×0.0722).
 * Se usa para decidir si el texto sobre un fondo debe ser claro u oscuro.
 */
function getLuminance(h, s, l) {
    let rgb = hslToHex(h, s, l);
    let r = parseInt(rgb.slice(1, 3), 16) / 255;
    let g = parseInt(rgb.slice(3, 5), 16) / 255;
    let b = parseInt(rgb.slice(5, 7), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Determina el color de texto ideal para un fondo dado.
 * Si el fondo es luminoso (>0.5), retorna texto oscuro; si es oscuro, texto blanco.
 * Garantiza legibilidad automática del texto sobre cualquier color.
 */
function getTextColorForBackground(h, s, l) {
    const lum = getLuminance(h, s, l);
    return lum > 0.5 ? '#0f172a' : '#ffffff';
}


// ============================================================================
// 3. SISTEMA DE TEMAS DINÁMICOS (MODO LIBRE)
// ============================================================================
// 
// applyDynamicTheme() es el corazón del modo "Libre".
// Lee las posiciones de los 3 nodos del círculo cromático y genera
// un sistema completo de Design Tokens que inyecta como inline styles.
// 
// DISTRIBUCIÓN DE ROLES:
// 
//   NODO 1 (N1) → IDENTIDAD PRIMARIA
//     Genera: --primary, --primary-foreground
//     Uso:    Botones de acción, enlaces, acentos de marca
//     Lógica: Color puro del nodo (hue + saturación + claridad sin modificar)
// 
//   NODO 2 (N2) → FONDOS Y SUPERFICIES
//     Genera: --background, --surface, --surface-sunken, --foreground
//     Uso:    Color de fondo de la página, paneles, canvas
//     Lógica: Se toma el matiz (hue) del nodo pero se reduce la saturación
//             y se ajusta la luminosidad para crear fondos sutiles.
//     CLAVE:  La claridad del N2 (node2.l) determina si el tema es
//             CLARO (l ≥ 0.5) u OSCURO (l < 0.5).
// 
//   NODO 3 (N3) → SECUNDARIOS, MUDOS Y BORDES
//     Genera: --muted, --secondary, --border, --secondary-foreground
//     Uso:    Botones secundarios, inputs, divisores, bordes
//     Lógica: Similar a N2 pero con diferente matiz para contraste visual.
// 
// MULTIPLICADORES DE SATURACIÓN:
//   Los valores como `node2.s * 0.35` reducen la saturación del nodo
//   para que los fondos no sean demasiado vibrantes. Un fondo rojo puro
//   sería agresivo; al multiplicar la saturación por 0.35, se obtiene
//   un rojo rosado sutil que es elegante y funcional.
// ============================================================================

/**
 * Calcula y aplica todas las variables CSS del tema dinámico.
 * Solo debe ejecutarse en modo "Libre" (verificar con shouldApplyDynamic).
 * 
 * EFECTO COLATERAL: Modifica directamente body.style (inline CSS).
 * EFECTO COLATERAL: Puede añadir/quitar la clase dark-mode del body.
 */
window.applyDynamicTheme = function() {
    const offset = parseInt(globalRotInput.value) || 0;
    
    // Obtener los 3 nodos principales (con fallback si faltan)
    const node1 = nodes[0] || { baseAngle: 0, s: 0, l: 1 };   // N1: Identidad
    const node2 = nodes[1] || node1;                             // N2: Fondos
    const node3 = nodes[2] || node2;                             // N3: Secundarios
    
    // Calcular matiz (hue) final de cada nodo = base + rotación global
    const hue1 = (node1.baseAngle + offset) % 360;
    const hue2 = (node2.baseAngle + offset) % 360;
    const hue3 = (node3.baseAngle + offset) % 360;

    // Variables que se calcularán según isDark
    let backgroundHex, surfaceHex, mutedHex, borderHex, secondaryHex, primaryHex, surfaceSunkenHex;
    let foregroundHex, secondaryForegroundHex, primaryForegroundHex;

    // ── NODO 2: CÁLCULO DE FONDOS ──
    // El fondo principal tomará el color EXACTO del Nodo 2 sin excepciones.
    // Esto asegura que en el Modo Libre, la interfaz siga al 100% el esquema de color 
    // del usuario, actuando como un lienzo puro sin conversiones forzadas a temas oscuros o claros.
    backgroundHex = hslToHex(hue2, node2.s, node2.l);
    
    // Para las superficies de los paneles (Glassmorphism), usamos una interpolación matemática continua 
    // en lugar de usar condicionales ('if') para evitar cualquier salto brusco en la iluminación.
    // La fórmula "node2.l + (0.5 - node2.l) * 0.15" funciona como un "amortiguador de contraste":
    // - Si el fondo es negro oscuro (l = 0), la superficie se aclara muy levemente (+0.075) para no desaparecer.
    // - Si el fondo es blanco puro (l = 1), la superficie se oscurece muy levemente (-0.075).
    // - Si el fondo está al 50% de luz, la superficie se mantiene exactamente igual (+0).
    surfaceHex       = hslToHex(hue2, node2.s, Math.max(0, Math.min(1, node2.l + (0.5 - node2.l) * 0.15)));
    
    // Para elementos hundidos (como el canvas del autómata celular), invertimos ligeramente el amortiguador
    // para que parezcan tener profundidad física y estar "enterrados" debajo del fondo principal.
    surfaceSunkenHex = hslToHex(hue2, node2.s, Math.max(0, Math.min(1, node2.l - (0.5 - node2.l) * 0.1)));
    
    // El color principal del texto sigue requiriendo un salto lógico tajante por motivos 
    // de accesibilidad UX extrema: o es blanco (si el fondo oscurece) o es negro (si el fondo brilla).
    foregroundHex = getTextColorForBackground(hue2, node2.s, node2.l);

    // ── NODO 3: CÁLCULO DE SECUNDARIOS ──
    // Usamos el color exacto para componentes secundarios (badges interactivos, resaltados).
    secondaryHex   = hslToHex(hue3, node3.s, node3.l);
    
    // Aplicamos la matemática continua de "amortiguador de contraste" a los campos inactivos (inputs)
    // y a los bordes, asegurando que tengan un rebote de luz para que no se mimeticen con el fondo base.
    mutedHex       = hslToHex(hue3, node3.s, Math.max(0, Math.min(1, node3.l + (0.5 - node3.l) * 0.1)));
    borderHex      = hslToHex(hue3, node3.s, Math.max(0, Math.min(1, node3.l + (0.5 - node3.l) * 0.25)));
    
    // Texto automático para las superficies que usen el color Secundario de base
    secondaryForegroundHex = getTextColorForBackground(hue3, node3.s, node3.l);

    // ── NODO 1: IDENTIDAD PRIMARIA ──
    // El Nodo 1 dicta la identidad estelar de la UI (botones primarios, sliders, acentos importantes).
    // Jamás se altera matemáticamente, manteniendo la pureza visual absoluta escogida en la rueda.
    primaryHex = hslToHex(hue1, node1.s, node1.l);
    primaryForegroundHex = getTextColorForBackground(hue1, node1.s, node1.l);

    // ── INYECCIÓN DINÁMICA CONTINUA DE VARIABLES CSS ──
    // Aquí implementamos el "Morfismo de Cristal Perceptual (Glassmorphism)".
    // Antes la opacidad brincaba de golpe. Ahora la interpolamos linealmente basada en la luminosidad de N2.
    // La fórmula es: valorTransicion = Min + (Max - Min) * nivelLuz
    // Esto asegura que la escarcha del "cristal ahumado" se engrose o disminuya de manera fluida y armónica.
    
    // Para paneles (surface), la luz va desde 'aa' (170, opacidad ~67% en modo oscuro puro) 
    // hasta 'ee' (238, opacidad ~93% en modo ultra luminoso blanco).
    const alphaSurface = Math.round(170 + (238 - 170) * node2.l).toString(16).padStart(2, '0');
    
    // Para campos mudos (inputs), va desde '99' (153) a 'ee' (238) para mantenerse desapercibido
    const alphaMuted   = Math.round(153 + (238 - 153) * node2.l).toString(16).padStart(2, '0');
    
    // Para zonas secundarias interactivas, va de '99' (153) a 'cc' (204)
    const alphaSec     = Math.round(153 + (204 - 153) * node2.l).toString(16).padStart(2, '0');

    // Aplicación estricta y final sobre las variables inline (Inline Styles de document.body)
    const target = document.body;
    
    // Variables del sistema nativo Glassmorphism
    target.style.setProperty('--background', backgroundHex);
    target.style.setProperty('--surface', `${surfaceHex}${alphaSurface}`); 
    target.style.setProperty('--muted', `${mutedHex}${alphaMuted}`);
    target.style.setProperty('--border', `${borderHex}aa`);
    target.style.setProperty('--secondary', `${secondaryHex}${alphaSec}`);
    target.style.setProperty('--secondary-hover', borderHex);
    target.style.setProperty('--foreground', foregroundHex);
    target.style.setProperty('--secondary-foreground', secondaryForegroundHex);
    target.style.setProperty('--primary', primaryHex);
    target.style.setProperty('--primary-foreground', primaryForegroundHex);
    target.style.setProperty('--surface-sunken', surfaceSunkenHex);
    
    // Variables CSS universales solicitadas para diferenciaciones de elementos adicionales
    target.style.setProperty('--color-primary', primaryHex);
    target.style.setProperty('--color-secondary', secondaryHex);
    target.style.setProperty('--color-text', foregroundHex);
    target.style.setProperty('--color-background', backgroundHex);
    
    // ── SOMBRAS Y LUMINISCENCIAS DINÁMICAS (PHYSICAL DEPTH) ──
    // Las sombras externas mantienen la jerarquía física 3D en pantalla.
    // Transición suave de Drop Shadows: En fondos oscuros la sombra debe ser negra intensa (0.5), 
    // en interfaces clarísimas la sombra se suaviza drásticamente (0.2) para que el layout no parezca "sucio".
    const shadowOpacity = 0.5 - (node2.l * 0.3); 
    target.style.setProperty('--shadow-color', `rgba(0, 0, 0, ${shadowOpacity})`);
    target.style.setProperty('--canvas-shadow', `rgba(0, 0, 0, ${shadowOpacity + 0.2})`);
    
    // Luz de contorno perimetral interno (Inset Highlights):
    // Dibuja un hilo microscópico brillante en el borde superior del cristal para dar efecto especular.
    // En tonos ultra oscuros es un susurro al 5% (0.05). En temas vibrantes impactados por mucha luz, 
    // el rebote de la luz    // Transición suave de brillos (más notorios en fondos blancos)
    const panelBorderOp = 0.05 + (node2.l * 0.45); 
    target.style.setProperty('--panel-border', `rgba(255, 255, 255, ${panelBorderOp})`);
    
    // (Nota: se eliminó el drawGame() síncrono aquí para evitar que 1225 rectángulos
    // destruyan el CPU a 60fps durante los eventos de arrastre. El color de las 
    // células se actualiza en el mouseup o en un Game Tick nativo).
}


// ============================================================================
// 4. MODAL DEL MAPA CSS Y PALETA EXPORTABLE
// ============================================================================

const modal = document.getElementById('cssMapModal');

/** Abre el modal del mapa de variables CSS */
window.openMapModal = () => modal.classList.add('visible');

/** Cierra el modal del mapa de variables CSS */
window.closeMapModal = () => modal.classList.remove('visible');

// Cerrar modal al clicar fuera del contenido
modal.addEventListener('click', (e) => { 
    if(e.target === modal) closeMapModal(); 
});

/**
 * Resalta en el wireframe los elementos que usan la variable CSS indicada.
 * Los elementos no relevantes se atenúan (opacity: 0.3).
 * Funciona leyendo el atributo data-target de cada .wf-element.
 * 
 * @param {string} targetVar - Nombre de la variable sin "--" (ej: 'primary')
 */
window.highlight = function(targetVar) {
    document.querySelectorAll('.wf-element').forEach(el => {
        if(el.dataset.target && el.dataset.target.includes(targetVar)) {
            el.classList.add(`highlight-${targetVar}`);
        } else {
            el.style.opacity = '0.3';
        }
    });
}

/**
 * Elimina el resaltado del wireframe, restaurando todos los elementos.
 * @param {string} targetVar - Nombre de la variable a des-resaltar
 */
window.unhighlight = function(targetVar) {
    document.querySelectorAll('.wf-element').forEach(el => {
        el.classList.remove(`highlight-${targetVar}`);
        el.style.opacity = '1';
    });
}

/**
 * Regenera la paleta visual y el bloque CSS exportable.
 * 
 * LA PALETA TIENE 2 SECCIONES:
 * 
 *   1. DESIGN TOKENS SEMÁNTICOS: Variables listas para producción
 *      (--background, --primary, etc.) con los valores activos actuales.
 * 
 *   2. ESCALAS RAW (100-900): 5 variaciones de luminosidad para cada nodo.
 *      Útiles para sistemas de diseño tipo Tailwind (red-100, red-500, etc.).
 * 
 * Los valores se leen de: body.style (inline, si hay tema libre) 
 * ó getComputedStyle (del CSS del tema estático).
 */
function updateVariations() {
    previewDiv.innerHTML = ''; 
    const offset = parseInt(globalRotInput.value) || 0;
    const isDark = document.body.classList.contains('dark-mode');
    const computedBody = getComputedStyle(document.body);
    
    // Helper: Lee una variable CSS priorizando inline styles del body
    // sobre los valores computados del stylesheet
    const getVar = (name) => document.body.style.getPropertyValue(name).trim() || computedBody.getPropertyValue(name).trim();
    
    // Leer todos los Design Tokens activos
    const bg = getVar('--background');
    const surface = getVar('--surface');
    const foreground = getVar('--foreground');
    const primary = getVar('--primary');
    const primaryFore = getVar('--primary-foreground');
    const muted = getVar('--muted');
    const border = getVar('--border');
    const secondary = getVar('--secondary');
    const secondaryFore = getVar('--secondary-foreground');
    
    // Construir el bloque CSS exportable (tokens semánticos)
    generatedCSS = `/* ===== DESIGN TOKENS (SISTEMA SEMÁNTICO) ===== */
:root {
  --background: ${bg};
  --foreground: ${foreground};
  --surface: ${surface};
  --muted: ${muted};
  --border: ${border};
  --primary: ${primary};
  --primary-foreground: ${primaryFore};
  --secondary: ${secondary};
  --secondary-foreground: ${secondaryFore};
}

/* ===== RAW SCALES (ESCALAS BRUTAS DEL 100 AL 900) ===== */
:root {
`;

    // Generar escalas de luminosidad para cada nodo
    const lightnessSteps = [0.9, 0.7, 0.5, 0.3, 0.1]; // 100=claro → 900=oscuro

    nodes.forEach((node, index) => {
        const currentHue = (node.baseAngle + offset) % 360;
        const colDiv = document.createElement('div'); 
        colDiv.className = 'color-column';
        
        // Etiqueta para el CSS exportado
        let label = 'primary';
        if (index === 1) label = 'base';
        else if (index === 2) label = 'secondary';
        else if (index > 2) label = `extra-${index+1}`;

        lightnessSteps.forEach((l, stepIndex) => {
            const weight = (stepIndex * 2 + 1) * 100; // 100, 300, 500, 700, 900
            const hex = hslToHex(currentHue, node.s, l);
            
            // Crear muestra visual (swatch)
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch'; 
            swatch.style.backgroundColor = hex; 
            swatch.textContent = hex;
            
            // Clic para copiar al portapapeles
            swatch.onclick = () => { 
                navigator.clipboard.writeText(hex); 
                const original = swatch.textContent; 
                swatch.textContent = 'Copied'; 
                setTimeout(() => swatch.textContent = original, 1000); 
            };
            colDiv.appendChild(swatch);
            
            // Añadir al CSS exportable
            generatedCSS += `  --color-${label}-${weight}: ${hex};\n`;
        });
        previewDiv.appendChild(colDiv);
    });
    generatedCSS += '}\n';
}

/**
 * Copia el CSS generado (tokens + escalas) al portapapeles.
 * Cambia temporalmente el texto del botón para confirmar la acción.
 */
window.exportCSS = () => { 
    navigator.clipboard.writeText(generatedCSS); 
    const btn = document.getElementById('exportBtn'); 
    const originalText = btn.innerHTML;
    btn.innerHTML = '✨ ¡Tokens Copiados!'; 
    setTimeout(() => btn.innerHTML = originalText, 2500); 
};


// ============================================================================
// 5. CÍRCULO CROMÁTICO (CANVAS DE 350x350)
// ============================================================================
// 
// ESTRUCTURA:
//   - bgCanvas: Canvas offscreen donde se dibuja la rueda de color UNA vez.
//               Se reutiliza como imagen para evitar redibujar 360 sectores
//               en cada frame (optimización de rendimiento).
//   - canvas (wheel): Canvas visible donde se dibuja la rueda + nodos.
// 
// SISTEMA DE COORDENADAS:
//   - El centro del canvas es (175, 175)
//   - El radio máximo de la rueda es 150px
//   - Cada nodo tiene una posición polar: (ángulo, saturación)
//     donde saturación (0-1) se mapea a distancia del centro (0-150px)
// ============================================================================

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const nodeListDiv = document.getElementById('nodeList');
const globalRotInput = document.getElementById('globalRotation');
const previewDiv = document.getElementById('palettePreview');

/** Canvas offscreen para cachear la rueda de color (se dibuja solo una vez) */
const bgCanvas = document.createElement('canvas');
bgCanvas.width = 350; bgCanvas.height = 350;
const bgCtx = bgCanvas.getContext('2d');
let bgDrawn = false;

/** Array de nodos de color. Se inicializa con un nodo rojo en ángulo 0° */
let nodes = [{ id: Date.now(), baseAngle: 0, s: 1, l: 0.5 }];

/** Referencia al nodo actualmente siendo arrastrado (null si no hay drag) */
let draggingNode = null;

/** Modo de armonía cromática actual: 'manual', 'complementary', 'triad', 'tetrad' */
let currentMode = 'manual';

/** CSS generado para exportación (se actualiza en updateVariations) */
let generatedCSS = '';

/**
 * Cambia el modo de armonía cromática.
 * Recalcula las posiciones de los nodos según la regla de armonía elegida.
 * 
 * MODOS DISPONIBLES:
 *   manual:        Nodos libres, el usuario posiciona cada uno individualmente
 *   complementary: 2 nodos separados por 180° (colores opuestos)
 *   triad:         3 nodos separados por 120° (triángulo equilátero)
 *   tetrad:        4 nodos separados por 90° (cuadrado)
 * 
 * @param {'manual'|'complementary'|'triad'|'tetrad'} mode
 */
window.setMode = (mode) => {
    currentMode = mode;
    
    // Actualizar botones del selector de armonía
    document.querySelectorAll('.modes-selector button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + mode).classList.add('active');
    
    const addBtn = document.getElementById('addNode');
    const base = nodes[0] || { id: Date.now(), baseAngle: 0, s: 1, l: 0.5 };

    // El botón "Añadir Color Libre" solo se muestra en modo manual
    addBtn.style.display = mode === 'manual' ? 'inline-flex' : 'none';

    // Generar los nodos según la distribución de armonía
    if (mode === 'complementary') {
        nodes = [base, { id: Date.now() + 1, baseAngle: base.baseAngle + 180, s: base.s, l: base.l }];
    } else if (mode === 'triad') {
        nodes = [
            base, 
            { id: Date.now() + 1, baseAngle: base.baseAngle + 120, s: base.s, l: base.l }, 
            { id: Date.now() + 2, baseAngle: base.baseAngle + 240, s: base.s, l: base.l }
        ];
    } else if (mode === 'tetrad') {
        nodes = [
            base, 
            { id: Date.now() + 1, baseAngle: base.baseAngle + 90, s: base.s, l: base.l }, 
            { id: Date.now() + 2, baseAngle: base.baseAngle + 180, s: base.s, l: base.l }, 
            { id: Date.now() + 3, baseAngle: base.baseAngle + 270, s: base.s, l: base.l }
        ];
    }
    
    buildDOM();
};

/**
 * Dibuja el círculo cromático y los nodos sobre el canvas visible.
 * 
 * OPTIMIZACIÓN: La rueda de color (360 sectores con gradiente radial)
 * se dibuja UNA SOLA VEZ en bgCanvas y se reutiliza con drawImage().
 * Solo los nodos se redibujan en cada frame.
 * 
 * ESTILO DE NODOS:
 *   - Círculo relleno con el color HSL del nodo
 *   - Borde blanco semi-transparente
 *   - En modos de armonía, el nodo 0 tiene borde punteado (es el "líder")
 *   - El nodo siendo arrastrado tiene un halo exterior
 */
function draw() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;

    // Dibujar la rueda de color al offscreen canvas (solo la primera vez)
    if (!bgDrawn) {
        for (let i = 0; i < 360; i++) {
            bgCtx.beginPath(); 
            bgCtx.moveTo(centerX, centerY);
            bgCtx.arc(centerX, centerY, radius, i * Math.PI / 180, (i + 1.5) * Math.PI / 180);
            // Gradiente radial: centro = gris (baja saturación), borde = puro (alta saturación)
            let gradient = bgCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, `hsl(${i}, 0%, 50%)`); 
            gradient.addColorStop(1, `hsl(${i}, 100%, 50%)`);
            bgCtx.fillStyle = gradient; 
            bgCtx.fill();
        }
        // Borde exterior sutil de la rueda
        bgCtx.beginPath();
        bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        bgCtx.lineWidth = 2;
        bgCtx.strokeStyle = 'rgba(255,255,255,0.2)';
        bgCtx.stroke();
        bgDrawn = true;
    }

    // Limpiar canvas visible y dibujar la rueda cacheada
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgCanvas, 0, 0);

    // Dibujar cada nodo
    nodes.forEach((node, index) => {
        const totalAngle = (node.baseAngle + offset) % 360;
        const rad = totalAngle * Math.PI / 180;
        const nodeRadius = radius * node.s;        // Saturación = distancia al centro
        const x = centerX + nodeRadius * Math.cos(rad);
        const y = centerY + nodeRadius * Math.sin(rad);

        // Halo de arrastre (solo para el nodo activo)
        if (draggingNode && draggingNode.id === node.id) {
            ctx.beginPath(); 
            ctx.arc(x, y, 16, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; 
            ctx.fill();
        }

        // Círculo del nodo
        ctx.beginPath(); 
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = hslToHex(totalAngle, node.s, node.l); 
        ctx.fill();
        
        // Borde del nodo
        ctx.lineWidth = 3;
        ctx.strokeStyle = (draggingNode && draggingNode.id === node.id) ? '#ffffff' : 'rgba(255,255,255,0.8)';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        
        // En modos de armonía, el nodo líder (index 0) tiene borde punteado
        if (currentMode !== 'manual' && index === 0) { 
            ctx.strokeStyle = '#ffffff'; 
            ctx.setLineDash([4, 4]); 
        } else { 
            ctx.setLineDash([]); 
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
    });
    ctx.setLineDash([]);
}


// ============================================================================
// 6. DOM DE NODOS (Lista de colores en el panel derecho)
// ============================================================================

/**
 * Reconstruye la lista de nodos en el DOM.
 * Cada nodo genera una fila con:
 *   [Etiqueta + Rol] [Color Picker] [Input Hex] [Slider Claridad] [Eliminar?]
 * 
 * También vincula los event listeners del slider de claridad.
 */
function buildDOM() {
    nodeListDiv.innerHTML = ''; 
    const offset = parseInt(globalRotInput.value) || 0;
    nodes.forEach((node, index) => {
        const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
        const div = document.createElement('div'); 
        div.className = 'node-item';
        
        // Asignar rol semántico según la posición del nodo
        let role = 'Extra';
        if (index === 0) role = 'Identidad Primaria';
        else if (index === 1) role = 'Fondo / Superficie';
        else if (index === 2) role = 'Secundario / Borde';

        const lightPercent = Math.round(node.l * 100);

        div.innerHTML = `
            <div style="line-height:1.2;">
                <span style="font-weight:bold; font-size:14px; color:var(--foreground); opacity:0.9;">N${index + 1}</span><br>
                <span style="font-size:10px; opacity:0.6;">${role}</span>
            </div>
            <input type="color" value="${hex}" data-id="${node.id}">
            <input type="text" value="${hex}" data-id="${node.id}" maxlength="7">
            <div class="lightness-control">
                <input type="range" class="lightness-range" min="0" max="100" value="${lightPercent}" data-id="${node.id}" title="Claridad: ${lightPercent}%">
                <span class="lightness-label">${lightPercent}%</span>
            </div>
            ${currentMode === 'manual' ? `<button class="btn btn-dashed" style="padding: 6px; font-size: 0.8rem;" onclick="removeNode(${node.id})">Del</button>` : ''}
        `;
        nodeListDiv.appendChild(div);
    });

    // ── VINCULACIÓN DE EVENTOS OPTIMIZADA (PERFORMANCE TUNING) ──
    // Los sliders pueden disparar decenas de eventos 'input' por segundo.
    // Si realizamos todas las tareas sincronamente el navegador sufre "Lag".
    nodeListDiv.querySelectorAll('.lightness-range').forEach(slider => {
        let lightRafPending = false;
        
        // Evento 'input': Ocurre EN TIEMPO REAL mientras el mouse se mueve (60Hz)
        slider.addEventListener('input', (e) => {
            const node = nodes.find(n => n.id === parseFloat(e.target.dataset.id));
            if (!node) return;
            node.l = parseInt(e.target.value) / 100;
            
            // 1. DOM Ligero (Inmediato): Actualizar el texto del porcentaje
            // Esto es super barato para el navegador, se hace al instante.
            e.target.nextElementSibling.textContent = e.target.value + '%';
            
            // 2. DOM Ligero (Inmediato): Sincronizar los inputs de texto/color
            const offset = parseInt(globalRotInput.value) || 0;
            const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
            const parent = e.target.closest('.node-item');
            parent.querySelector('input[type="color"]').value = hex;
            parent.querySelector('input[type="text"]').value = hex;
            
            // 3. THROTTLING (Aceleración de Hardware):
            // Evitamos llamar a las funciones graficas/tematicas en seco.
            // requestAnimationFrame (rAF) empaqueta los cambios para que se 
            // ejecuten justamente antes del siguiente refresco de la pantalla de tu monitor,
            // previniendo bloqueos del CPU (Stuttering).
            if (!lightRafPending) {
                lightRafPending = true;
                requestAnimationFrame(() => {
                    draw(); // <canvas> 2D (Rápido)
                    if (shouldApplyDynamic()) applyDynamicTheme(); // Inyectar CSS (Acelerado por GPU)
                    lightRafPending = false; // Liberamos el cerrojo para el próximo frame
                });
            }
        });
        
        // Evento 'change': Ocurre ÚNICAMENTE cuando el usuario suelta el click / levanta el dedo.
        // Aquí enviamos la reconstrucción pesada del DOM (DOM Thrashing).
        // Actualizar 20+ muestras de colores de la paleta lateral toma demasiados milisegundos,
        // por lo que aislarlo aquí garantiza fluidez total durante el arrastre previo.
        slider.addEventListener('change', () => {
            drawGame(); // Recalcular cuadritos del juego (Pesado)
            updateVariations(); // Destruir/Crear Swatches (Dominio lento)
        });
    });
    
    draw(); 
    if (shouldApplyDynamic()) applyDynamicTheme();
    updateVariations();
}


// ============================================================================
// 7. INTERACCIÓN: DRAG & DROP EN EL CÍRCULO CROMÁTICO
// ============================================================================
// 
// OPTIMIZACIÓN DE RENDIMIENTO:
//   El mousemove/touchmove puede disparar 60+ eventos por segundo.
//   Para evitar layout thrashing, se usa requestAnimationFrame como throttle:
//   - Se captura la posición del ratón INMEDIATAMENTE (sin lag)
//   - Se difiere el renderizado al siguiente frame de pantalla
//   - Se usa una flag (dragRAFPending) para evitar encolar múltiples frames
// 
//   La reconstrucción del DOM de la paleta (updateVariations) se difiere
//   hasta el mouseup/touchend para evitar manipulaciones DOM pesadas
//   durante el arrastre.
// ============================================================================

/**
 * Convierte la posición del mouse/touch a coordenadas del canvas.
 * Tiene en cuenta el escalado CSS (display size ≠ canvas resolution).
 * 
 * @param {HTMLCanvasElement} canvasEl - El canvas de referencia
 * @param {MouseEvent|TouchEvent} evt - El evento de interacción
 * @returns {{ x: number, y: number }} Coordenadas en el espacio del canvas
 */
function getMousePos(canvasEl, evt) {
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = canvasEl.width / rect.width;    // Factor de escala horizontal
    const scaleY = canvasEl.height / rect.height;   // Factor de escala vertical
    // Soportar tanto Mouse como Touch
    const clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientY : evt.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

// ── MOUSE: Detección de nodo bajo el cursor ──
canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(canvas, e);
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;
    // Iterar de atrás hacia adelante (nodos superiores tienen prioridad)
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const rad = ((node.baseAngle + offset) % 360) * Math.PI / 180;
        const nX = canvas.width / 2 + (radius * node.s) * Math.cos(rad);
        const nY = canvas.height / 2 + (radius * node.s) * Math.sin(rad);
        if (Math.sqrt((pos.x - nX) ** 2 + (pos.y - nY) ** 2) <= 25) { 
            draggingNode = node; 
            break; 
        }
    }
});

/** Flag para throttle con requestAnimationFrame durante el arrastre */
let dragRAFPending = false;

// ── MOUSE: Arrastre de nodo ──
canvas.addEventListener('mousemove', (e) => {
    if (!draggingNode) return;
    e.preventDefault();
    
    // 1. Capturar posición INMEDIATAMENTE (sin retraso perceptible)
    const pos = getMousePos(canvas, e);
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;
    let dx = pos.x - canvas.width / 2;
    let dy = pos.y - canvas.height / 2;
    let newS = Math.min(Math.sqrt(dx * dx + dy * dy) / radius, 1); // Saturación
    let angleDeg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360; // Ángulo

    // En modos de armonía, TODOS los nodos rotan juntos (manteniendo sus distancias)
    if (currentMode !== 'manual') {
        const angleDiff = angleDeg - (draggingNode.baseAngle + offset);
        nodes.forEach(n => { n.baseAngle = (n.baseAngle + angleDiff + 360) % 360; n.s = newS; });
    } else { 
        // En modo manual, solo se mueve el nodo seleccionado
        draggingNode.baseAngle = (angleDeg - offset + 360) % 360; 
        draggingNode.s = newS; 
    }

    // 2. Actualizar inputs de color (operación ligera, no causa reflow)
    nodes.forEach(node => {
        const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
        const colorInput = document.querySelector(`input[type="color"][data-id="${node.id}"]`);
        const textInput = document.querySelector(`input[type="text"][data-id="${node.id}"]`);
        if (colorInput) colorInput.value = hex; 
        if (textInput) textInput.value = hex;
    });

    // 3. Programar render para el siguiente frame (throttle con rAF)
    if (!dragRAFPending) {
        dragRAFPending = true;
        requestAnimationFrame(() => {
            draw();
            if (shouldApplyDynamic()) applyDynamicTheme();
            dragRAFPending = false;
        });
    }
});

// ── TOUCH: Equivalentes táctiles del drag & drop ──

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const pos = getMousePos(canvas, e);
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const rad = ((node.baseAngle + offset) % 360) * Math.PI / 180;
        const nX = canvas.width / 2 + (radius * node.s) * Math.cos(rad);
        const nY = canvas.height / 2 + (radius * node.s) * Math.sin(rad);
        if (Math.sqrt((pos.x - nX) ** 2 + (pos.y - nY) ** 2) <= 30) { 
            draggingNode = node; 
            break; 
        }
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    if (!draggingNode) return;
    e.preventDefault();
    const pos = getMousePos(canvas, e);
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;
    let dx = pos.x - canvas.width / 2;
    let dy = pos.y - canvas.height / 2;
    let newS = Math.min(Math.sqrt(dx * dx + dy * dy) / radius, 1);
    let angleDeg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;

    if (currentMode !== 'manual') {
        const angleDiff = angleDeg - (draggingNode.baseAngle + offset);
        nodes.forEach(n => { n.baseAngle = (n.baseAngle + angleDiff + 360) % 360; n.s = newS; });
    } else { 
        draggingNode.baseAngle = (angleDeg - offset + 360) % 360; 
        draggingNode.s = newS; 
    }

    if (!dragRAFPending) {
        dragRAFPending = true;
        requestAnimationFrame(() => {
            draw();
            if (shouldApplyDynamic()) applyDynamicTheme();
            dragRAFPending = false;
        });
    }
}, { passive: false });

// ── Fin del arrastre ──
// Al soltar, se regenera la paleta (operación pesada diferida del mousemove)
window.addEventListener('mouseup', () => { 
    if (draggingNode) { 
        draggingNode = null; 
        draw(); 
        if (shouldApplyDynamic()) applyDynamicTheme();
        updateVariations();
    } 
});

window.addEventListener('touchend', () => { 
    if (draggingNode) { 
        draggingNode = null; 
        draw(); 
        if (shouldApplyDynamic()) applyDynamicTheme();
        updateVariations();
    } 
});


// ============================================================================
// 8. INPUTS MANUALES (Color Picker + Texto Hex)
// ============================================================================

/**
 * Event delegation: Escucha cambios en TODOS los inputs dentro de #nodeList.
 * Si el usuario escribe un hex válido o cambia el color picker, se
 * actualiza el nodo correspondiente y se cambia a modo manual.
 */
nodeListDiv.addEventListener('input', (e) => {
    // Validar que el valor sea un hex válido (#RRGGBB)
    if (/^#[0-9A-Fa-f]{6}$/i.test(e.target.value)) {
        // Al cambiar manualmente un color, forzar modo "manual"
        if (currentMode !== 'manual') setMode('manual');
        
        // Encontrar el nodo por su ID (almacenado en data-id)
        const node = nodes.find(n => n.id === parseFloat(e.target.dataset.id));
        const hsl = hexToHSL(e.target.value);
        
        // Actualizar el nodo con los nuevos valores HSL
        // El baseAngle compensa la rotación global
        node.baseAngle = (hsl.h - parseInt(globalRotInput.value || 0) + 360) % 360; 
        node.s = hsl.s; 
        node.l = hsl.l;
        
        // Sincronizar el otro input (si se cambió el texto, actualizar el picker y viceversa)
        const parent = e.target.parentElement;
        if (e.target.type === 'text') parent.querySelector('input[type="color"]').value = e.target.value;
        else parent.querySelector('input[type="text"]').value = e.target.value.toUpperCase();
        
        draw();
        if (shouldApplyDynamic()) applyDynamicTheme();
    }
});

/** Añadir un nodo de color nuevo con ángulo aleatorio */
document.getElementById('addNode').onclick = () => { 
    nodes.push({ id: Date.now(), baseAngle: Math.random() * 360, s: 1, l: 0.5 }); 
    buildDOM(); 
};

/** Eliminar un nodo por ID. Si queda vacío, vuelve a crear uno gris por defecto. */
window.removeNode = (id) => { 
    nodes = nodes.filter(n => n.id !== id); 
    if (nodes.length === 0) nodes.push({ id: Date.now(), baseAngle: 0, s: 0, l: 0.7 });
    buildDOM(); 
};

/**
 * Slider de rotación global: Rota todos los nodos simultáneamente.
 * 
 * PERFORMANCE (Rendimiento):
 * Este deslizador mueve TODOS los colores a la vez. Aplicar un offset visual y
 * recalcular HEX para inyectarlos en vivo requiere que no bloqueemos el Thread.
 */
let rotRafPending = false;
globalRotInput.addEventListener('input', () => {
    // 1. Matemática Pura: Sumarle el offset (0-360) a los nodos lógicos
    const offset = parseInt(globalRotInput.value) || 0;
    
    // 2. Operación DOM ligera: Actualizar los cuadritos de '#RRGGBB'
    nodes.forEach(node => {
        const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
        const colorInput = document.querySelector(`input[type="color"][data-id="${node.id}"]`);
        const textInput = document.querySelector(`input[type="text"][data-id="${node.id}"]`);
        if (colorInput) colorInput.value = hex; 
        if (textInput && document.activeElement !== textInput) textInput.value = hex;
    });
    
    // 3. Throttle Visual (requestAnimationFrame):
    // Garantiza que aunque el ratón envíe 100 eventos de 'input' por segundo,
    // el canvas y el CSS engine solo se pinten un máximo de 60 veces (o la de tu monitor),
    // empalmando perfectamente el renderizado con la tasa de refresco del hardware.
    if (!rotRafPending) {
        rotRafPending = true;
        requestAnimationFrame(() => {
            draw();
            if (shouldApplyDynamic()) applyDynamicTheme();
            rotRafPending = false;
        });
    }
});

// Evento final de soltar el click: Momento seguro para operaciones pesadas.
// Repintamos los 1225 rectángulos del automata y destruimos/re-creamos el DOM de paletas.
globalRotInput.addEventListener('change', () => {
    drawGame();
    updateVariations();
});


// ============================================================================
// 9. AUTÓMATA CELULAR (JUEGO DE LA VIDA DE CONWAY)
// ============================================================================
// 
// REGLAS DE CONWAY:
//   1. Una célula VIVA con < 2 vecinos vivos → MUERE (soledad)
//   2. Una célula VIVA con 2 o 3 vecinos → SOBREVIVE
//   3. Una célula VIVA con > 3 vecinos → MUERE (sobrepoblación)
//   4. Una célula MUERTA con exactamente 3 vecinos → NACE
// 
// EXTENSIÓN DE COLOR:
//   Cada célula almacena un valor numérico (1, 2, 3...) que indica
//   qué nodo de color la pintó. Las células nuevas heredan el color
//   de uno de sus padres al azar, creando un efecto visual de "competencia"
//   territorial entre colores.
// 
// La grilla usa coordenadas toroidales (wrap-around): los bordes
// se conectan con el lado opuesto, formando un espacio infinito.
// ============================================================================

const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const RESOLUTION = 10;                             // Tamaño de cada célula en píxeles
const COLS = gameCanvas.width / RESOLUTION;         // 35 columnas
const ROWS = gameCanvas.height / RESOLUTION;        // 35 filas

/** Grilla del autómata: 0 = muerta, 1+ = viva (valor = índice de nodo + 1) */
let gameGrid = buildGrid();
let isGamePlaying = false;
let gameAnimationId;
let lastFrameTime = 0;
const GAME_SPEED_FPS = 12;                          // Velocidad: 12 generaciones/segundo

/** Crea una grilla vacía (todas las células muertas) */
function buildGrid() { 
    return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0)); 
}

/**
 * Dibuja el estado actual de la grilla en el canvas.
 * Cada célula viva se pinta con el color del nodo correspondiente.
 * El fondo usa --surface-sunken si está disponible (modo libre),
 * o un color por defecto según el tema.
 */
function drawGame() {
    // Para optimizar a 60fps, limpiamos en vez de usar fillRect.
    // El background-color general lo manejará el CSS nativo de #gameCanvas
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Pre-calcular los colores de los nodos
    const offset = parseInt(globalRotInput.value) || 0;
    const nodeColors = nodes.map(node => hslToHex((node.baseAngle + offset) % 360, node.s, node.l));
    const fallbackColor = nodeColors.length > 0 ? nodeColors[0] : '#ffffff';

    // Dibujar solo las células vivas
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            const cellValue = gameGrid[col][row];
            if (cellValue > 0) {
                // El valor de la célula (1, 2, 3...) indica qué nodo la coloreó
                const nodeLen = nodes.length || 1;
                const nodeIndex = (cellValue - 1) % nodeLen;
                gameCtx.fillStyle = nodeColors[nodeIndex] || fallbackColor;
                gameCtx.fillRect(col * RESOLUTION, row * RESOLUTION, RESOLUTION - 1, RESOLUTION - 1);
            }
        }
    }
}

/**
 * Calcula la siguiente generación del autómata según las reglas de Conway.
 * Las células nuevas heredan el color de un padre aleatorio.
 * Usa coordenadas toroidales (wrap-around en los bordes).
 */
function nextGeneration() {
    const nextGrid = buildGrid();
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            const cell = gameGrid[col][row];
            let numNeighbors = 0;
            let parentColors = [];                  // Colores de los vecinos vivos

            // Contar los 8 vecinos (Moore neighborhood)
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue; // Saltar la célula misma
                    // Coordenadas toroidales (wrap-around)
                    let x_cell = col + i;
                    let y_cell = row + j;
                    if (x_cell < 0) x_cell = COLS - 1; else if (x_cell >= COLS) x_cell = 0;
                    if (y_cell < 0) y_cell = ROWS - 1; else if (y_cell >= ROWS) y_cell = 0;

                    const neighbor = gameGrid[x_cell][y_cell];
                    if (neighbor > 0) { numNeighbors++; parentColors.push(neighbor); }
                }
            }

            // Aplicar reglas de Conway
            if (cell > 0 && (numNeighbors < 2 || numNeighbors > 3)) {
                nextGrid[col][row] = 0;             // Muere por soledad o sobrepoblación
            } else if (cell === 0 && numNeighbors === 3) {
                // Nace: hereda el color de un padre aleatorio
                nextGrid[col][row] = parentColors[Math.floor(Math.random() * parentColors.length)];
            } else {
                nextGrid[col][row] = cell;          // Sobrevive o permanece muerta
            }
        }
    }
    gameGrid = nextGrid;
    drawGame();
}

/**
 * Bucle de animación del autómata.
 * Usa requestAnimationFrame con throttle a GAME_SPEED_FPS (12fps).
 * Se detiene automáticamente si isGamePlaying es false.
 */
function gameLoop(timestamp) {
    if (!isGamePlaying) return;
    gameAnimationId = requestAnimationFrame(gameLoop);
    if (timestamp - lastFrameTime >= 1000 / GAME_SPEED_FPS) {
        nextGeneration();
        lastFrameTime = timestamp;
    }
}

/** Alternar play/pause del autómata */
window.toggleGame = () => {
    isGamePlaying = !isGamePlaying;
    const btn = document.getElementById('playPauseBtn');
    if (isGamePlaying) {
        btn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pausar`;
        lastFrameTime = performance.now();
        gameAnimationId = requestAnimationFrame(gameLoop);
    } else {
        btn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Iniciar`;
        cancelAnimationFrame(gameAnimationId);
    }
};

/** Limpiar la grilla y pausar el autómata */
window.resetGame = () => {
    isGamePlaying = false;
    document.getElementById('playPauseBtn').innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Iniciar`;
    cancelAnimationFrame(gameAnimationId);
    gameGrid = buildGrid(); 
    drawGame();
};

/** Llenar la grilla con células aleatorias (~15% de densidad) */
window.randomizeGame = () => {
    gameGrid = buildGrid();
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            if (Math.random() < 0.15) gameGrid[col][row] = Math.floor(Math.random() * nodes.length) + 1;
        }
    }
    drawGame();
};

// ── Pintado manual de células (click/drag sobre el canvas del juego) ──
let isPaintingGame = false;

/** Pinta una célula en la posición del cursor/touch */
function paintCell(e) {
    const pos = getMousePos(gameCanvas, e);
    const col = Math.floor(pos.x / RESOLUTION);
    const row = Math.floor(pos.y / RESOLUTION);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        // Asigna un nodo aleatorio como "padre" del color
        gameGrid[col][row] = Math.floor(Math.random() * nodes.length) + 1;
        drawGame();
    }
}

// Event listeners para pintado con mouse y touch
gameCanvas.addEventListener('mousedown', (e) => { isPaintingGame = true; paintCell(e); });
gameCanvas.addEventListener('mousemove', (e) => { if (isPaintingGame) paintCell(e); });
window.addEventListener('mouseup', () => { isPaintingGame = false; });
gameCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isPaintingGame = true; paintCell(e); }, { passive: false });
gameCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isPaintingGame) paintCell(e); }, { passive: false });
window.addEventListener('touchend', () => { isPaintingGame = false; });


// ============================================================================
// 10. INICIALIZACIÓN
// ============================================================================
// Al cargar:
//   1. Establecer modo Tríada (3 nodos a 120° de distancia)
//   2. Llenar el autómata con células aleatorias
setMode('triad'); 
randomizeGame();

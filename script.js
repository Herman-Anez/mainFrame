/**
 * Círculo Cromático y Juego de la Vida - Lógica Principal
 * Integración Semántica Modificada (Design Tokens)
 */

// ==========================================
// 1. GESTIÓN DE TEMA (CLARO/OSCURO)
// ==========================================
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

if(body.classList.contains('dark-mode')){
    themeToggleBtn.innerHTML = '☀️ Base Clara';
}

themeToggleBtn.addEventListener('click', () => {
    // Limpiar variables dinámicas antes de cambiar de tema
    document.body.style.cssText = '';
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggleBtn.innerHTML = isDark ? '☀️ Base Clara' : '🌙 Base Oscura';
    
    // Re-aplicar el tema dinámico con el nuevo modo
    applyDynamicTheme();
    drawGame(); 
});

// ==========================================
// 2. UTILIDADES DE COLOR
// ==========================================
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

function hslToHex(h, s, l) {
    h = (h % 360 + 360) % 360; 
    let r, g, b; 
    h /= 360;
    if (s === 0) { r = g = b = l; } 
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

function getLuminance(h, s, l) {
    let rgb = hslToHex(h, s, l);
    let r = parseInt(rgb.slice(1, 3), 16) / 255;
    let g = parseInt(rgb.slice(3, 5), 16) / 255;
    let b = parseInt(rgb.slice(5, 7), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getTextColorForBackground(h, s, l) {
    const lum = getLuminance(h, s, l);
    return lum > 0.5 ? '#0f172a' : '#ffffff';
}

window.applyDynamicTheme = function() {
    const offset = parseInt(globalRotInput.value) || 0;
    
    // NODO 1: IDENTIDAD PRIMARIA
    const node1 = nodes[0] || { baseAngle: 0, s: 0, l: 1 };
    // NODO 2: FONDOS (BACKGROUND Y SURFACE)
    const node2 = nodes[1] || node1; 
    // NODO 3: SECUNDARIOS / MUDOS / BORDES
    const node3 = nodes[2] || node2; 
    
    const hue1 = (node1.baseAngle + offset) % 360;
    const hue2 = (node2.baseAngle + offset) % 360;
    const hue3 = (node3.baseAngle + offset) % 360;

    let backgroundHex, surfaceHex, mutedHex, borderHex, secondaryHex, primaryHex, surfaceSunkenHex;
    let foregroundHex, secondaryForegroundHex, primaryForegroundHex;

    const isDark = document.body.classList.contains('dark-mode');

    // NODO 2: LÓGICA DE FONDOS
    if (isDark) {
        backgroundHex    = hslToHex(hue2, node2.s * 0.35, 0.08);
        surfaceHex       = hslToHex(hue2, node2.s * 0.4, 0.14);
        surfaceSunkenHex = hslToHex(hue2, node2.s * 0.2, 0.04); 
    } else {
        backgroundHex    = hslToHex(hue2, node2.s * 0.25, 0.92);
        surfaceHex       = hslToHex(hue2, node2.s * 0.3, 0.97); 
        surfaceSunkenHex = hslToHex(hue2, node2.s * 0.15, 0.90);
    }
    foregroundHex = getTextColorForBackground(hue2, node2.s * 0.3, isDark ? 0.14 : 0.97);

    // NODO 3: SECUNDARIOS Y MUDOS
    if (isDark) {
        mutedHex       = hslToHex(hue3, node3.s * 0.3, 0.10);
        secondaryHex   = hslToHex(hue3, node3.s * 0.5, 0.20);
        borderHex      = hslToHex(hue3, node3.s * 0.6, 0.30);
    } else {
        mutedHex       = hslToHex(hue3, node3.s * 0.15, 0.88);
        secondaryHex   = hslToHex(hue3, node3.s * 0.4, 0.85);
        borderHex      = hslToHex(hue3, node3.s * 0.5, 0.70);
    }
    secondaryForegroundHex = getTextColorForBackground(hue3, node3.s * 0.4, isDark ? 0.18 : 0.88);

    // NODO 1: IDENTIDAD PRIMARIA
    primaryHex = hslToHex(hue1, node1.s, node1.l);
    primaryForegroundHex = getTextColorForBackground(hue1, node1.s, node1.l);

    const target = document.body;
    target.style.setProperty('--background', backgroundHex);
    target.style.setProperty('--surface', isDark ? `${surfaceHex}aa` : `${surfaceHex}ee`); 
    target.style.setProperty('--muted', isDark ? `${mutedHex}99` : `${mutedHex}ee`);
    target.style.setProperty('--border', `${borderHex}aa`);
    target.style.setProperty('--secondary', isDark ? `${secondaryHex}99` : `${secondaryHex}cc`);
    target.style.setProperty('--secondary-hover', borderHex);
    
    target.style.setProperty('--foreground', foregroundHex);
    target.style.setProperty('--secondary-foreground', secondaryForegroundHex);
    
    target.style.setProperty('--primary', primaryHex);
    target.style.setProperty('--primary-foreground', primaryForegroundHex);
    
    target.style.setProperty('--surface-sunken', surfaceSunkenHex);

    drawGame(); 
}

// ==========================================
// 3. UI - MAPA CSS MODAL Y PALETA
// ==========================================
const modal = document.getElementById('cssMapModal');
window.openMapModal = () => modal.classList.add('visible');
window.closeMapModal = () => modal.classList.remove('visible');

modal.addEventListener('click', (e) => { 
    if(e.target === modal) closeMapModal(); 
});

window.highlight = function(targetVar) {
    document.querySelectorAll('.wf-element').forEach(el => {
        if(el.dataset.target && el.dataset.target.includes(targetVar)) {
            el.classList.add(`highlight-${targetVar}`);
        } else {
            el.style.opacity = '0.3';
        }
    });
}
window.unhighlight = function(targetVar) {
    document.querySelectorAll('.wf-element').forEach(el => {
        el.classList.remove(`highlight-${targetVar}`);
        el.style.opacity = '1';
    });
}

function updateVariations() {
    previewDiv.innerHTML = ''; 
    const offset = parseInt(globalRotInput.value) || 0;
    const isDark = document.body.classList.contains('dark-mode');
    const computedBody = getComputedStyle(document.body);
    
    // Obtener variables dinámicas del body.style, o las computadas del CSS
    const getVar = (name) => document.body.style.getPropertyValue(name).trim() || computedBody.getPropertyValue(name).trim();
    
    const bg = getVar('--background');
    const surface = getVar('--surface');
    const foreground = getVar('--foreground');
    const primary = getVar('--primary');
    const primaryFore = getVar('--primary-foreground');
    const muted = getVar('--muted');
    const border = getVar('--border');
    const secondary = getVar('--secondary');
    const secondaryFore = getVar('--secondary-foreground');
    
    // Formatear Bloque CSS Global
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

    const lightnessSteps = [0.9, 0.7, 0.5, 0.3, 0.1]; // 100 a 900 de intensidad

    nodes.forEach((node, index) => {
        const currentHue = (node.baseAngle + offset) % 360;
        const colDiv = document.createElement('div'); 
        colDiv.className = 'color-column';
        
        let label = 'primary';
        if (index === 1) label = 'base';
        else if (index === 2) label = 'secondary';
        else if (index > 2) label = `extra-${index+1}`;

        lightnessSteps.forEach((l, stepIndex) => {
            const weight = (stepIndex * 2 + 1) * 100; // 100, 300, 500, 700, 900
            const hex = hslToHex(currentHue, node.s, l);
            
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch'; 
            swatch.style.backgroundColor = hex; 
            swatch.textContent = hex;
            
            swatch.onclick = () => { 
                navigator.clipboard.writeText(hex); 
                const original = swatch.textContent; 
                swatch.textContent = 'Copied'; 
                setTimeout(() => swatch.textContent = original, 1000); 
            };
            colDiv.appendChild(swatch);
            
            generatedCSS += `  --color-${label}-${weight}: ${hex};\n`;
        });
        previewDiv.appendChild(colDiv);
    });
    generatedCSS += '}\n';
}

window.exportCSS = () => { 
    navigator.clipboard.writeText(generatedCSS); 
    const btn = document.getElementById('exportBtn'); 
    const originalText = btn.innerHTML;
    btn.innerHTML = '✨ ¡Tokens Copiados!'; 
    setTimeout(() => btn.innerHTML = originalText, 2500); 
};

// ==========================================
// 4. CÍRCULO CROMÁTICO (CANVAS)
// ==========================================
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const nodeListDiv = document.getElementById('nodeList');
const globalRotInput = document.getElementById('globalRotation');
const previewDiv = document.getElementById('palettePreview');

const bgCanvas = document.createElement('canvas');
bgCanvas.width = 350; bgCanvas.height = 350;
const bgCtx = bgCanvas.getContext('2d');
let bgDrawn = false;

let nodes = [{ id: Date.now(), baseAngle: 0, s: 1, l: 0.5 }];
let draggingNode = null;
let currentMode = 'manual';
let generatedCSS = '';

window.setMode = (mode) => {
    currentMode = mode;
    document.querySelectorAll('.modes-selector button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + mode).classList.add('active');
    
    const addBtn = document.getElementById('addNode');
    const base = nodes[0] || { id: Date.now(), baseAngle: 0, s: 1, l: 0.5 };

    addBtn.style.display = mode === 'manual' ? 'inline-flex' : 'none';

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

function draw() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;

    if (!bgDrawn) {
        for (let i = 0; i < 360; i++) {
            bgCtx.beginPath(); 
            bgCtx.moveTo(centerX, centerY);
            bgCtx.arc(centerX, centerY, radius, i * Math.PI / 180, (i + 1.5) * Math.PI / 180);
            let gradient = bgCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, `hsl(${i}, 0%, 50%)`); 
            gradient.addColorStop(1, `hsl(${i}, 100%, 50%)`);
            bgCtx.fillStyle = gradient; 
            bgCtx.fill();
        }
        bgCtx.beginPath();
        bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        bgCtx.lineWidth = 2;
        bgCtx.strokeStyle = 'rgba(255,255,255,0.2)';
        bgCtx.stroke();
        bgDrawn = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgCanvas, 0, 0);

    nodes.forEach((node, index) => {
        const totalAngle = (node.baseAngle + offset) % 360;
        const rad = totalAngle * Math.PI / 180;
        const nodeRadius = radius * node.s;
        const x = centerX + nodeRadius * Math.cos(rad);
        const y = centerY + nodeRadius * Math.sin(rad);

        if (draggingNode && draggingNode.id === node.id) {
            ctx.beginPath(); 
            ctx.arc(x, y, 16, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; 
            ctx.fill();
        }

        ctx.beginPath(); 
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = hslToHex(totalAngle, node.s, node.l); 
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = (draggingNode && draggingNode.id === node.id) ? '#ffffff' : 'rgba(255,255,255,0.8)';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 5;
        
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

function buildDOM() {
    nodeListDiv.innerHTML = ''; 
    const offset = parseInt(globalRotInput.value) || 0;
    nodes.forEach((node, index) => {
        const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
        const div = document.createElement('div'); 
        div.className = 'node-item';
        
        let role = 'Extra';
        if (index === 0) role = 'Identidad Primaria';
        else if (index === 1) role = 'Fondo / Superficie';
        else if (index === 2) role = 'Secundario / Borde';

        div.innerHTML = `
            <div style="line-height:1.2;">
                <span style="font-weight:bold; font-size:14px; color:var(--foreground); opacity:0.9;">N${index + 1}</span><br>
                <span style="font-size:10px; opacity:0.6;">${role}</span>
            </div>
            <input type="color" value="${hex}" data-id="${node.id}">
            <input type="text" value="${hex}" data-id="${node.id}" maxlength="7">
            ${currentMode === 'manual' ? `<button class="btn btn-dashed" style="padding: 6px; font-size: 0.8rem;" onclick="removeNode(${node.id})">Del</button>` : ''}
        `;
        nodeListDiv.appendChild(div);
    });
    
    draw(); 
    applyDynamicTheme();
    updateVariations();
}

function getMousePos(canvasEl, evt) {
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = canvasEl.width / rect.width;
    const scaleY = canvasEl.height / rect.height;
    const clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientY : evt.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(canvas, e);
    const radius = 150;
    const offset = parseInt(globalRotInput.value) || 0;
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

let dragRAFPending = false;

canvas.addEventListener('mousemove', (e) => {
    if (!draggingNode) return;
    e.preventDefault();
    
    // Capturar posición inmediatamente, pero despachar render con rAF
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

    // Actualizar inputs de color (ligero)
    nodes.forEach(node => {
        const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
        const colorInput = document.querySelector(`input[type="color"][data-id="${node.id}"]`);
        const textInput = document.querySelector(`input[type="text"][data-id="${node.id}"]`);
        if (colorInput) colorInput.value = hex; 
        if (textInput) textInput.value = hex;
    });

    // Throttle: solo un render por frame de pantalla
    if (!dragRAFPending) {
        dragRAFPending = true;
        requestAnimationFrame(() => {
            draw();
            applyDynamicTheme();
            dragRAFPending = false;
        });
    }
});

// Touch support para el círculo cromático
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
            applyDynamicTheme();
            dragRAFPending = false;
        });
    }
}, { passive: false });

window.addEventListener('mouseup', () => { 
    if (draggingNode) { 
        draggingNode = null; 
        draw(); 
        applyDynamicTheme();
        updateVariations();
    } 
});

window.addEventListener('touchend', () => { 
    if (draggingNode) { 
        draggingNode = null; 
        draw(); 
        applyDynamicTheme();
        updateVariations();
    } 
});

nodeListDiv.addEventListener('input', (e) => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(e.target.value)) {
        if (currentMode !== 'manual') setMode('manual');
        const node = nodes.find(n => n.id === parseFloat(e.target.dataset.id));
        const hsl = hexToHSL(e.target.value);
        node.baseAngle = (hsl.h - parseInt(globalRotInput.value || 0) + 360) % 360; 
        node.s = hsl.s; 
        node.l = hsl.l;
        
        const parent = e.target.parentElement;
        if (e.target.type === 'text') parent.querySelector('input[type="color"]').value = e.target.value;
        else parent.querySelector('input[type="text"]').value = e.target.value.toUpperCase();
        
        draw();
        applyDynamicTheme();
        updateVariations();
    }
});

document.getElementById('addNode').onclick = () => { 
    nodes.push({ id: Date.now(), baseAngle: Math.random() * 360, s: 1, l: 0.5 }); 
    buildDOM(); 
};
window.removeNode = (id) => { 
    nodes = nodes.filter(n => n.id !== id); 
    if (nodes.length === 0) nodes.push({ id: Date.now(), baseAngle: 0, s: 0, l: 0.7 });
    buildDOM(); 
};

globalRotInput.oninput = () => {
    const offset = parseInt(globalRotInput.value) || 0;
    nodes.forEach(node => {
        const hex = hslToHex((node.baseAngle + offset) % 360, node.s, node.l);
        const colorInput = document.querySelector(`input[type="color"][data-id="${node.id}"]`);
        const textInput = document.querySelector(`input[type="text"][data-id="${node.id}"]`);
        if (colorInput) colorInput.value = hex; 
        if (textInput && document.activeElement !== textInput) textInput.value = hex;
    });
    draw();
    applyDynamicTheme();
    updateVariations();
};

// ==========================================
// 5. AUTÓMATA CELULAR (JUEGO DE LA VIDA)
// ==========================================
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const RESOLUTION = 10; 
const COLS = gameCanvas.width / RESOLUTION;
const ROWS = gameCanvas.height / RESOLUTION;

let gameGrid = buildGrid();
let isGamePlaying = false;
let gameAnimationId;
let lastFrameTime = 0;
const GAME_SPEED_FPS = 12; 

function buildGrid() { return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0)); }

function drawGame() {
    let bgGameColor = document.body.classList.contains('dark-mode') ? '#0b1120' : '#f8fafc';
    const dynamicBg = document.body.style.getPropertyValue('--surface-sunken').trim();
    if (dynamicBg) bgGameColor = dynamicBg;

    gameCtx.fillStyle = bgGameColor;
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    const offset = parseInt(globalRotInput.value) || 0;
    const nodeColors = nodes.map(node => hslToHex((node.baseAngle + offset) % 360, node.s, node.l));
    const fallbackColor = nodeColors.length > 0 ? nodeColors[0] : '#ffffff';

    gameCtx.strokeStyle = 'rgba(255,255,255,0.05)';
    gameCtx.lineWidth = 1;

    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            const cellValue = gameGrid[col][row];
            if (cellValue > 0) {
                const nodeLen = nodes.length || 1;
                const nodeIndex = (cellValue - 1) % nodeLen;
                gameCtx.fillStyle = nodeColors[nodeIndex] || fallbackColor;
                gameCtx.fillRect(col * RESOLUTION, row * RESOLUTION, RESOLUTION - 1, RESOLUTION - 1);
            }
        }
    }
}

function nextGeneration() {
    const nextGrid = buildGrid();
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            const cell = gameGrid[col][row];
            let numNeighbors = 0;
            let parentColors = []; 

            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    let x_cell = col + i;
                    let y_cell = row + j;
                    if (x_cell < 0) x_cell = COLS - 1; else if (x_cell >= COLS) x_cell = 0;
                    if (y_cell < 0) y_cell = ROWS - 1; else if (y_cell >= ROWS) y_cell = 0;

                    const neighbor = gameGrid[x_cell][y_cell];
                    if (neighbor > 0) { numNeighbors++; parentColors.push(neighbor); }
                }
            }

            if (cell > 0 && (numNeighbors < 2 || numNeighbors > 3)) nextGrid[col][row] = 0; 
            else if (cell === 0 && numNeighbors === 3) nextGrid[col][row] = parentColors[Math.floor(Math.random() * parentColors.length)];
            else nextGrid[col][row] = cell;
        }
    }
    gameGrid = nextGrid;
    drawGame();
}

function gameLoop(timestamp) {
    if (!isGamePlaying) return;
    gameAnimationId = requestAnimationFrame(gameLoop);
    if (timestamp - lastFrameTime >= 1000 / GAME_SPEED_FPS) {
        nextGeneration();
        lastFrameTime = timestamp;
    }
}

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

window.resetGame = () => {
    isGamePlaying = false;
    document.getElementById('playPauseBtn').innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Iniciar`;
    cancelAnimationFrame(gameAnimationId);
    gameGrid = buildGrid(); 
    drawGame();
};

window.randomizeGame = () => {
    gameGrid = buildGrid();
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            if (Math.random() < 0.15) gameGrid[col][row] = Math.floor(Math.random() * nodes.length) + 1;
        }
    }
    drawGame();
};

let isPaintingGame = false;
function paintCell(e) {
    const pos = getMousePos(gameCanvas, e);
    const col = Math.floor(pos.x / RESOLUTION);
    const row = Math.floor(pos.y / RESOLUTION);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        gameGrid[col][row] = Math.floor(Math.random() * nodes.length) + 1;
        drawGame();
    }
}

gameCanvas.addEventListener('mousedown', (e) => { isPaintingGame = true; paintCell(e); });
gameCanvas.addEventListener('mousemove', (e) => { if (isPaintingGame) paintCell(e); });
window.addEventListener('mouseup', () => { isPaintingGame = false; });
gameCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isPaintingGame = true; paintCell(e); }, { passive: false });
gameCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isPaintingGame) paintCell(e); }, { passive: false });
window.addEventListener('touchend', () => { isPaintingGame = false; });

// --- INICIO ---
setMode('triad'); 
randomizeGame();

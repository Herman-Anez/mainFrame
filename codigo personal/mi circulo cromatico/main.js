// ==================== 1. CONFIGURACIÓN ====================
const canvas = document.getElementById('colorWheel');
const ctx = canvas.getContext('2d');
const w = canvas.width = 500;
const h = canvas.height = 500;
const cx = w / 2;
const cy = h / 2;
const radiusTotal = w * 0.45;   // 225px

let nodes = [];
let effectiveRadiusPercent = 100;
let effectiveRadius = radiusTotal;
let rotationAngle = 0; // Ángulo actual de rotación global en grados
let draggedNodeIndex = -1; // Índice del nodo que se está arrastrando

// --- Buffer para el fondo estático (círculo cromático) ---
let backgroundImageData = null;

// ==================== 2. FUNCIÓN HSL → RGB ====================
function hslToRgb(h, s, l) {
    h = (h % 360) / 360;
    s = s / 100;
    l = l / 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// ==================== 3. DIBUJO DEL CÍRCULO CROMÁTICO (una sola vez) ====================
function drawStaticBackground() {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let yFis = 0; yFis < h; yFis++) {
        for (let xFis = 0; xFis < w; xFis++) {
            const xLog = xFis;
            const yLog = h - 1 - yFis;
            const dx = xLog - cx;
            const dy = yLog - cy;
            const distance = Math.hypot(dx, dy);
            const idx = (yFis * w + xFis) * 4;
            if (distance <= radiusTotal) {
                let angle = Math.atan2(dy, dx);
                let hue = (angle * 180 / Math.PI + 360) % 360;
                const t = distance / radiusTotal;
                const saturation = t * 100;
                const [r, g, b] = hslToRgb(hue, saturation, 50);
                data[idx] = r;
                data[idx+1] = g;
                data[idx+2] = b;
                data[idx+3] = 255;
            } else {
                data[idx] = data[idx+1] = data[idx+2] = 0;
                data[idx+3] = 0;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    // Guardamos una copia del fondo (sin bordes ni nodos)
    backgroundImageData = ctx.getImageData(0, 0, w, h);
    
    // Dibujamos el borde exterior (se añade al fondo estático)
    ctx.save();
    ctx.translate(0, h);
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.arc(cx, cy, radiusTotal, 0, Math.PI * 2);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
    
    // Actualizamos el buffer incluyendo el borde
    backgroundImageData = ctx.getImageData(0, 0, w, h);
}

// ==================== 4. REFRESCO RÁPIDO (solo nodos + límite) ====================
function refreshCanvas() {
    // Restaurar fondo estático (círculo + borde)
    ctx.putImageData(backgroundImageData, 0, 0);
    // Dibujar nodos y círculo límite encima
    drawNodes();
    drawEffectiveRadiusLimit();
}

// ==================== 5. DIBUJO DE NODOS ====================
function drawNodes() {
    ctx.save();
    ctx.translate(0, h);
    ctx.scale(1, -1);
    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${node.r}, ${node.g}, ${node.b})`;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }
    ctx.restore();
}

// ==================== 6. CÍRCULO LÍMITE (discontinuo) ====================
function drawEffectiveRadiusLimit() {
    if (effectiveRadius <= 0) return;
    ctx.save();
    ctx.translate(0, h);
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.arc(cx, cy, effectiveRadius, 0, Math.PI * 2);
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f97316';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, effectiveRadius, 0, Math.PI * 2);
    ctx.setLineDash([8, 10]);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    // Texto indicador
    ctx.save();
    ctx.font = "bold 12px 'Segoe UI'";
    ctx.fillStyle = "#f97316";
    ctx.shadowBlur = 0;
    ctx.fillText(`⛔ ${effectiveRadiusPercent}%`, cx + effectiveRadius - 42, cy - effectiveRadius + 14);
    ctx.restore();
}

// ==================== 7. UTILIDADES ====================
function mouseToLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let fisX = (clientX - rect.left) * scaleX;
    let fisY = (clientY - rect.top) * scaleY;
    fisX = Math.min(Math.max(0, fisX), w - 1);
    fisY = Math.min(Math.max(0, fisY), h - 1);
    return { x: fisX, y: h - 1 - fisY };
}

function getColorAtLogical(x, y) {
    const fisX = x;
    const fisY = h - 1 - y;
    if (fisX < 0 || fisX >= w || fisY < 0 || fisY >= h) return null;
    const pixel = ctx.getImageData(fisX, fisY, 1, 1).data;
    return { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] };
}

function isInsideFullCircle(x, y) {
    return Math.hypot(x - cx, y - cy) <= radiusTotal;
}
function isInsideEffectiveRadius(x, y) {
    return Math.hypot(x - cx, y - cy) <= effectiveRadius;
}

// ==================== 8. AGREGAR NODO ====================
function addNodeAtLogical(x, y) {
    if (!isInsideFullCircle(x, y)) return false;
    if (!isInsideEffectiveRadius(x, y)) {
        const msgDiv = document.getElementById('cursorLimitMsg');
        if (msgDiv) {
            msgDiv.innerText = "⛔ Fuera del límite de saturación actual";
            setTimeout(() => { if (msgDiv.innerText.includes("Fuera")) msgDiv.innerText = ""; }, 1200);
        }
        return false;
    }
    const color = getColorAtLogical(x, y);
    if (!color || color.a === 0) return false;
    nodes.push({ x, y, r: color.r, g: color.g, b: color.b });
    refreshCanvas();
    updateNodeList();
    return true;
}

// ==================== 9. FILTRAR NODOS (al cambiar radio) ====================
function filterNodesByCurrentRadius() {
    const before = nodes.length;
    nodes = nodes.filter(node => Math.hypot(node.x - cx, node.y - cy) <= effectiveRadius);
    if (nodes.length !== before) {
        refreshCanvas();
        updateNodeList();
        const hint = document.getElementById('radiusHint');
        if (hint) {
            hint.style.backgroundColor = "#fed7aa";
            setTimeout(() => { hint.style.backgroundColor = ""; }, 400);
        }
    } else {
        refreshCanvas();
    }
}

// ==================== 10. LISTA DE NODOS (HTML) ====================
function updateNodeList() {
    const container = document.getElementById('nodesContainer');
    if (nodes.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#94a3b8;">✨ Haz clic dentro del círculo naranja para agregar nodos</div>';
        return;
    }
    let html = '';
    nodes.forEach((node, idx) => {
        html += `
            <div class="node-item" style="border-left-color: rgb(${node.r},${node.g},${node.b});">
                <div class="node-info">
                    📍 (${Math.round(node.x)}, ${Math.round(node.y)})<br>
                    🎨 rgb(${node.r}, ${node.g}, ${node.b})
                </div>
                <button class="delete-btn" data-index="${idx}">✖</button>
            </div>
        `;
    });
    container.innerHTML = html;
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-index'));
            if (!isNaN(idx) && idx >= 0 && idx < nodes.length) {
                nodes.splice(idx, 1);
                refreshCanvas();
                updateNodeList();
            }
        });
    });
}

function clearAllNodes() {
    nodes = [];
    refreshCanvas();
    updateNodeList();
}

// ==================== 11. ROTACIÓN ====================
function rotateAllNodes(newAngleDeg) {
    const delta = (newAngleDeg - rotationAngle) * (Math.PI / 180);
    rotationAngle = newAngleDeg;
    
    nodes.forEach(node => {
        const dx = node.x - cx;
        const dy = node.y - cy;
        const dist = Math.hypot(dx, dy);
        const currentAngle = Math.atan2(dy, dx);
        const nextAngle = currentAngle + delta;
        
        node.x = cx + Math.cos(nextAngle) * dist;
        node.y = cy + Math.sin(nextAngle) * dist;
        
        // Actualizar color basado en nueva posición al rotar
        const color = getColorAtLogical(node.x, node.y);
        if (color) {
            node.r = color.r;
            node.g = color.g;
            node.b = color.b;
        }
    });
    
    refreshCanvas();
    updateNodeList();
}

// ==================== 12. CONTROLES (SLIDERS) ====================
function setupRadiusSlider() {
    const slider = document.getElementById('radiusSlider');
    const percentLabel = document.getElementById('radiusPercentLabel');
    const hintDiv = document.getElementById('radiusHint');
    function update() {
        const percent = parseInt(slider.value, 10);
        effectiveRadiusPercent = percent;
        effectiveRadius = radiusTotal * (percent / 100);
        percentLabel.innerText = `${percent}%`;
        hintDiv.innerHTML = `📍 Radio efectivo: ${percent}% del total (saturación máxima ${percent}%)`;
        filterNodesByCurrentRadius();  // refresca y filtra
    }
    slider.addEventListener('input', update);
    update();
}

function setupRotationSlider() {
    const slider = document.getElementById('rotationSlider');
    const label = document.getElementById('rotationLabel');
    slider.addEventListener('input', () => {
        const val = parseInt(slider.value, 10);
        label.innerText = `${val}°`;
        rotateAllNodes(val);
    });
}

// ==================== 13. SEGUIMIENTO DEL CURSOR Y ARRASTRE ====================
function setupCursorTracker() {
    const coordsSpan = document.getElementById('cursorCoords');
    const rgbSpan = document.getElementById('cursorRgb');
    const previewDiv = document.getElementById('cursorPreview');
    const limitMsgSpan = document.getElementById('cursorLimitMsg');
    canvas.addEventListener('mousemove', (e) => {
        const logical = mouseToLogical(e.clientX, e.clientY);
        coordsSpan.innerText = `(${Math.round(logical.x)}, ${Math.round(logical.y)})`;
        const insideFull = isInsideFullCircle(logical.x, logical.y);
        const insideLimit = isInsideEffectiveRadius(logical.x, logical.y);
        
        // Cambiar cursor si está sobre un nodo para indicar que es arrastrable
        const overNode = nodes.some(n => Math.hypot(n.x - logical.x, n.y - logical.y) < 10);
        canvas.style.cursor = overNode ? 'move' : 'crosshair';

        if (insideFull) {
            const color = getColorAtLogical(logical.x, logical.y);
            if (color) {
                rgbSpan.innerText = `rgb(${color.r}, ${color.g}, ${color.b})`;
                previewDiv.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            }
            // Mensajes de límite
            if (!insideLimit && effectiveRadiusPercent < 100) {
                limitMsgSpan.innerHTML = '⚠️ Fuera del límite activo → no se puede agregar nodo';
                limitMsgSpan.style.color = '#ea580c';
            } else if (insideLimit) {
                limitMsgSpan.innerHTML = '✓ Dentro del radio permitido → clic para agregar';
                limitMsgSpan.style.color = '#15803d';
            } else {
                limitMsgSpan.innerHTML = '⚪ Fuera del círculo cromático';
                limitMsgSpan.style.color = '#6b7280';
            }
            if (effectiveRadiusPercent === 100 && insideFull) {
                limitMsgSpan.innerHTML = '✓ Límite completo → clic para agregar';
                limitMsgSpan.style.color = '#15803d';
            }
        } else {
            rgbSpan.innerText = 'fuera del círculo';
            previewDiv.style.backgroundColor = '#cbd5e1';
            limitMsgSpan.innerHTML = '❌ Fuera del círculo cromático';
            limitMsgSpan.style.color = '#9ca3af';
        }
    });
}

function setupInteraction() {
    canvas.addEventListener('mousedown', (e) => {
        const logical = mouseToLogical(e.clientX, e.clientY);
        
        // Detectar si click sobre nodo existente para arrastrar
        const hitIndex = nodes.findIndex(n => Math.hypot(n.x - logical.x, n.y - logical.y) < 12);
        
        if (hitIndex !== -1) {
            draggedNodeIndex = hitIndex;
        } else {
            // Si no hay nodo, intentar agregar uno
            addNodeAtLogical(logical.x, logical.y);
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (draggedNodeIndex === -1) return;
        
        const logical = mouseToLogical(e.clientX, e.clientY);
        const node = nodes[draggedNodeIndex];
        
        // Restringir al círculo total
        const dist = Math.hypot(logical.x - cx, logical.y - cy);
        if (dist <= radiusTotal) {
            // Si está fuera del radio efectivo, lo pegamos al borde
            if (dist > effectiveRadius) {
                const angle = Math.atan2(logical.y - cy, logical.x - cx);
                node.x = cx + Math.cos(angle) * effectiveRadius;
                node.y = cy + Math.sin(angle) * effectiveRadius;
            } else {
                node.x = logical.x;
                node.y = logical.y;
            }
            
            // Muestrear color en nueva posición
            const color = getColorAtLogical(node.x, node.y);
            if (color) {
                node.r = color.r;
                node.g = color.g;
                node.b = color.b;
            }
            
            refreshCanvas();
            updateNodeList();
        }
    });

    window.addEventListener('mouseup', () => {
        draggedNodeIndex = -1;
    });
}

// ==================== 14. INICIALIZACIÓN ====================
function init() {
    drawStaticBackground();      // fondo pesado una sola vez
    setupRadiusSlider();
    setupRotationSlider();
    setupCursorTracker();
    setupInteraction();
    document.getElementById('clearNodesBtn').addEventListener('click', clearAllNodes);
    updateNodeList();
    refreshCanvas();            // muestra el fondo + nodos (vacío) + límite
}
init();

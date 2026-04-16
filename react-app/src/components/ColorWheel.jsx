import { useRef, useEffect, useState, useCallback } from 'react';
import { hslToHex } from '../utils/colorUtils';

/**
 * COMPONENTE: ColorWheel
 * Canvas interactivo ultrarrápido que representa visualmente el modelo HSL espacial.
 * 
 * Optimizaciones Críticas:
 * 1. Renderizado en Canvas Oculto (Offscreen Cache): Pinta el gradiente cónico complejo (360° de cálculos) 
 *    SOLO UNA VEZ, para después redibujarlo trivialmente como imagen mediante `drawImage` en cada frame, 
 *    desbloqueando la capacidad teórica de re-render a +144FPS.
 * 2. Event Listeners Nativos + RAF: Elude por completo la reactividad de react `onMouseMove` usando listeners 
 *    de DOM acoplados matemáticamente a la Queue del GPU a través de `requestAnimationFrame` (RAF).
 * 
 * @param {Array} nodes - Estado actual de color
 * @param {number} globalRotation - Eje de desplazamiento visual
 * @param {Function} onNodeUpdate - Orquestador lógico de subidas (Drilling up)
 * @param {string} currentMode - Define modificadores del display GUI (por ej, líneas a trazos si no es Libre)
 */
export function ColorWheel({ nodes, globalRotation, onNodeUpdate, currentMode }) {
    const canvasRef = useRef(null);
    const bgCanvasRef = useRef(document.createElement('canvas'));
    const [bgDrawn, setBgDrawn] = useState(false);
    const draggingNodeRef = useRef(null);

    // ═══════════════════════════════════════════════════════════════
    // REFS ESTABLES: Solucionan el bug de "stale closure".
    //
    // Los event listeners nativos del DOM (mousedown, mousemove, etc.)
    // se registran UNA SOLA VEZ al montar el componente. Si usáramos
    // directly `nodes` o `globalRotation` dentro de esos handlers,
    // siempre leerían el valor capturado en el momento del primer render
    // (closure stale). Usando refs, los handlers siempre leen el valor
    // MÁS RECIENTE sin necesidad de destruir/re-registrar listeners.
    // ═══════════════════════════════════════════════════════════════
    const nodesRef = useRef(nodes);
    const globalRotationRef = useRef(globalRotation);
    const onNodeUpdateRef = useRef(onNodeUpdate);
    const currentModeRef = useRef(currentMode);

    // Sincronizar refs con las props actuales en cada render
    useEffect(() => { nodesRef.current = nodes; }, [nodes]);
    useEffect(() => { globalRotationRef.current = globalRotation; }, [globalRotation]);
    useEffect(() => { onNodeUpdateRef.current = onNodeUpdate; }, [onNodeUpdate]);
    useEffect(() => { currentModeRef.current = currentMode; }, [currentMode]);

    // Dibuja la rueda de color de fondo (ejecuta solo una vez)
    useEffect(() => {
        if (!bgDrawn) {
            const bgCanvas = bgCanvasRef.current;
            bgCanvas.width = 350;
            bgCanvas.height = 350;
            const bgCtx = bgCanvas.getContext('2d');
            const centerX = 175;
            const centerY = 175;
            const radius = 150;

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
            
            setBgDrawn(true);
        }
    }, [bgDrawn]);

    // Función de dibujado de nodos sobre el wheel
    const draw = useCallback(() => {
        if (!bgDrawn) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const bgCanvas = bgCanvasRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgCanvas, 0, 0);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        const offset = parseInt(globalRotation) || 0;

        nodes.forEach((node, index) => {
            const totalAngle = (node.baseAngle + offset) % 360;
            const rad = totalAngle * Math.PI / 180;
            const nodeRadius = radius * node.s;
            const x = centerX + nodeRadius * Math.cos(rad);
            const y = centerY + nodeRadius * Math.sin(rad);

            // Halo para el nodo arrastrado
            if (draggingNodeRef.current && draggingNodeRef.current.id === node.id) {
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
            ctx.strokeStyle = (draggingNodeRef.current && draggingNodeRef.current.id === node.id) ? '#ffffff' : 'rgba(255,255,255,0.8)';
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
    }, [nodes, globalRotation, bgDrawn, currentMode]);

    // Redibujar cuando cambian las props
    useEffect(() => {
        draw();
    }, [draw]);

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS NATIVOS (se registran UNA SOLA VEZ)
    //
    // El truco clave: en vez de leer `nodes` del closure (que estaría
    // stale después del primer render), leemos `nodesRef.current` que
    // siempre apunta al array más reciente. Lo mismo para
    // globalRotationRef y onNodeUpdateRef.
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getMousePos = (evt) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const clientX = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientX : evt.clientX;
            const clientY = evt.touches && evt.touches.length > 0 ? evt.touches[0].clientY : evt.clientY;
            return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
        };

        const handleStart = (e) => {
            const pos = getMousePos(e);
            const radius = 150;
            const currentNodes = nodesRef.current;
            const offset = parseInt(globalRotationRef.current) || 0;
            
            for (let i = currentNodes.length - 1; i >= 0; i--) {
                const node = currentNodes[i];
                const rad = ((node.baseAngle + offset) % 360) * Math.PI / 180;
                const nX = canvas.width / 2 + (radius * node.s) * Math.cos(rad);
                const nY = canvas.height / 2 + (radius * node.s) * Math.sin(rad);
                if (Math.sqrt((pos.x - nX) ** 2 + (pos.y - nY) ** 2) <= 30) { 
                    // Guardamos solo el ID, no la referencia al objeto
                    draggingNodeRef.current = { id: node.id };
                    break; 
                }
            }
        };

        let dragRAFPending = false;

        const handleMove = (e) => {
            if (!draggingNodeRef.current) return;
            e.preventDefault();

            const pos = getMousePos(e);
            const radius = 150;
            const offset = parseInt(globalRotationRef.current) || 0;
            let dx = pos.x - canvas.width / 2;
            let dy = pos.y - canvas.height / 2;
            let newS = Math.min(Math.sqrt(dx * dx + dy * dy) / radius, 1);
            let angleDeg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
            const baseAngle = (angleDeg - offset + 360) % 360;

            if (!dragRAFPending) {
                dragRAFPending = true;
                requestAnimationFrame(() => {
                    if (draggingNodeRef.current) {
                        onNodeUpdateRef.current(draggingNodeRef.current.id, baseAngle, newS);
                    }
                    dragRAFPending = false;
                });
            }
        };

        const handleEnd = () => {
            if (draggingNodeRef.current) {
                draggingNodeRef.current = null;
            }
        };

        canvas.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove, { passive: false });
        window.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('touchstart', handleStart, { passive: false });
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);

        return () => {
            canvas.removeEventListener('mousedown', handleStart);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            canvas.removeEventListener('touchstart', handleStart);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    // [] = se registra UNA SOLA VEZ. Los handlers leen de refs, no de closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="canvas-container glass-panel tooltip-container">
            <canvas ref={canvasRef} id="wheel" width="350" height="350"></canvas>
            <span className="tooltip">Arrastra los nodos para elegir colores</span>
        </div>
    );
}


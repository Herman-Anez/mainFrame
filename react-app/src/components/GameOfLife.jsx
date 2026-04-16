import { useRef, useState, useEffect, useCallback } from 'react';
import { hslToHex } from '../utils/colorUtils';

const RESOLUTION = 10;
const COLS = 35; // 350 / 10
const ROWS = 35; // 350 / 10
const GAME_SPEED_FPS = 12;

function buildGrid() { 
    return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0)); 
}

export function GameOfLife({ nodes, globalRotation }) {
    const canvasRef = useRef(null);
    const gridRef = useRef(buildGrid());
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef(null);
    const lastFrameTimeRef = useRef(0);

    const drawGrid = useCallback((grid) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const offset = parseInt(globalRotation) || 0;
        const nodeColors = nodes.map(node => hslToHex((node.baseAngle + offset) % 360, node.s, node.l));
        const fallbackColor = nodeColors.length > 0 ? nodeColors[0] : '#ffffff';

        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                const cellValue = grid[col][row];
                if (cellValue > 0) {
                    const nodeLen = nodes.length || 1;
                    const nodeIndex = (cellValue - 1) % nodeLen;
                    ctx.fillStyle = nodeColors[nodeIndex] || fallbackColor;
                    ctx.fillRect(col * RESOLUTION, row * RESOLUTION, RESOLUTION - 1, RESOLUTION - 1);
                }
            }
        }
    }, [nodes, globalRotation]);

    // Calcular siguiente generación
    const computeNextGeneration = useCallback(() => {
        const grid = gridRef.current;
        const nextGen = buildGrid();
        
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                const cell = grid[col][row];
                let numNeighbors = 0;
                let aliveNeighborsColors = [];
                
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue;
                        const x = (col + i + COLS) % COLS;
                        const y = (row + j + ROWS) % ROWS;
                        const neighborVal = grid[x][y];
                        if (neighborVal > 0) {
                            numNeighbors++;
                            aliveNeighborsColors.push(neighborVal);
                        }
                    }
                }
                
                if (cell > 0 && (numNeighbors < 2 || numNeighbors > 3)) {
                    nextGen[col][row] = 0;
                } else if (cell === 0 && numNeighbors === 3) {
                    const randomColorIndex = Math.floor(Math.random() * aliveNeighborsColors.length);
                    nextGen[col][row] = aliveNeighborsColors[randomColorIndex];
                } else {
                    nextGen[col][row] = cell;
                }
            }
        }
        gridRef.current = nextGen;
        drawGrid(nextGen);
    }, [drawGrid]);

    // Bucle del juego
    useEffect(() => {
        if (!isPlaying) return;

        const loop = (timestamp) => {
            if (timestamp - lastFrameTimeRef.current >= 1000 / GAME_SPEED_FPS) {
                computeNextGeneration();
                lastFrameTimeRef.current = timestamp;
            }
            animationRef.current = requestAnimationFrame(loop);
        };
        
        animationRef.current = requestAnimationFrame(loop);
        
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, computeNextGeneration]);

    // Redibujar siempre que cambien los nodos de manera forzada
    useEffect(() => {
        if (!isPlaying) {
            drawGrid(gridRef.current);
        }
    }, [nodes, globalRotation, isPlaying, drawGrid]);

    // Inicializar el juego aleatoriamente al cargar
    useEffect(() => {
        randomize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Controles manuales de pintura
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        const col = Math.floor(x / RESOLUTION);
        const row = Math.floor(y / RESOLUTION);
        
        if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
            const nodeIndexToPaint = 0; 
            gridRef.current[col][row] = gridRef.current[col][row] ? 0 : (nodeIndexToPaint + 1);
            drawGrid(gridRef.current);
        }
    };

    const randomize = () => {
        const newGrid = buildGrid();
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                if (Math.random() > 0.85) {
                    newGrid[col][row] = Math.floor(Math.random() * (nodes.length || 1)) + 1;
                }
            }
        }
        gridRef.current = newGrid;
        drawGrid(newGrid);
    };

    const clearGrid = () => {
        gridRef.current = buildGrid();
        drawGrid(gridRef.current);
        setIsPlaying(false);
    };

    return (
        <div className="game-container glass-panel">
            <div className="game-header">
                <h2>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    Autómata Celular
                </h2>
                <p className="subtitle">Pinta sobre el cuadro para añadir células</p>
            </div>
            <div className="canvas-wrapper">
                <canvas 
                    ref={canvasRef} 
                    id="gameCanvas" 
                    width="350" 
                    height="350"
                    onClick={handleCanvasClick}
                />
            </div>
            <div className="game-btn-group">
                <button onClick={() => setIsPlaying(!isPlaying)} className="btn icon-btn">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> 
                    {isPlaying ? 'Pausar' : 'Iniciar'}
                </button>
                <button onClick={randomize} className="btn icon-btn">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg> 
                    Azar
                </button>
                <button onClick={clearGrid} className="btn btn-outline icon-btn">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> 
                    Limpiar
                </button>
            </div>
        </div>
    );
}

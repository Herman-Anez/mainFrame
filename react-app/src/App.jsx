import { useState, useCallback } from 'react';
import { useColorState } from './hooks/useColorState';
import { useDynamicTheme } from './hooks/useDynamicTheme';
import { Header } from './components/Header';
import { ColorWheel } from './components/ColorWheel';
import { GameOfLife } from './components/GameOfLife';
import { ControlsPanel } from './components/ControlsPanel';
import { CssMapModal } from './components/CssMapModal';

/**
 * COMPONENTE PRINCIPAL (App)
 * Actúa como el orquestador principal (God Component) de la aplicación.
 * 
 * Arquitectura:
 * 1. Estado Global: Centraliza el estado de los nodos a través del hook `useColorState`.
 * 2. Motor de Tema: Inyecta variables CSS al `body` mediante `useDynamicTheme`.
 * 3. Presentación: Pasa estados y directivas como props a los componentes hijos
 *    (ColorWheel, GameOfLife, ControlsPanel), logrando una alta modularidad.
 */
function App() {
    // Estado para gestionar el modo del sistema (dark | light | free)
    const [themeMode, setThemeMode] = useState('dark');
    // Estado para controlar la visibilidad del modal de variables CSS
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    
    // Extracción de lógica compleja hacia Custom Hooks para un componente limpio
    const {
        nodes,
        currentMode,
        setMode,
        globalRotation,
        setGlobalRotation,
        addNode,
        removeNode,
        updateNode,
        updateAllHarmonicNodes
    } = useColorState();

    // Theming Dinámico Continuo
    // Solo aplica "free" mode si themeMode === 'free'
    useDynamicTheme(nodes, globalRotation, themeMode);

    const handleNodeDrag = useCallback((nodeId, newAngle, newS) => {
        if (currentMode === 'manual') {
            updateNode(nodeId, { baseAngle: newAngle, s: newS });
        } else {
            updateAllHarmonicNodes(nodeId, newAngle, newS);
        }
    }, [currentMode, updateNode, updateAllHarmonicNodes]);

    return (
        <div className="app-loader">
            <Header 
                themeMode={themeMode} 
                setThemeMode={setThemeMode} 
                onOpenMapModal={() => setIsMapModalOpen(true)}
            />
            
            <CssMapModal 
                isOpen={isMapModalOpen} 
                onClose={() => setIsMapModalOpen(false)} 
            />

            <main className="app-container">
                <section className="canvas-section">
                    <ColorWheel 
                        nodes={nodes}
                        globalRotation={globalRotation}
                        currentMode={currentMode}
                        onNodeUpdate={handleNodeDrag}
                    />
                    <GameOfLife 
                        nodes={nodes}
                        globalRotation={globalRotation}
                    />
                </section>

                <div className="right-panels">
                    <ControlsPanel 
                        nodes={nodes}
                        currentMode={currentMode}
                        setMode={setMode}
                        globalRotation={globalRotation}
                        setGlobalRotation={setGlobalRotation}
                        addNode={addNode}
                        removeNode={removeNode}
                        updateNode={updateNode}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;

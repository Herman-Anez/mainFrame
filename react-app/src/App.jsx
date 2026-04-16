import { useState, useCallback } from 'react';
import { useColorState } from './hooks/useColorState';
import { useDynamicTheme } from './hooks/useDynamicTheme';
import { Header } from './components/Header';
import { ColorWheel } from './components/ColorWheel';
import { GameOfLife } from './components/GameOfLife';
import { ControlsPanel } from './components/ControlsPanel';
import { CssMapModal } from './components/CssMapModal';

function App() {
    const [themeMode, setThemeMode] = useState('dark');
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    
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

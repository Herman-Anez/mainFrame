import { useState, useCallback } from 'react';

export function useColorState() {
    const [nodes, setNodes] = useState([
        { id: Date.now(), baseAngle: 210, s: 1, l: 0.5 },
        { id: Date.now() + 1, baseAngle: 330, s: 0.8, l: 0.15 },
        { id: Date.now() + 2, baseAngle: 90, s: 0.7, l: 0.3 }
    ]);
    const [currentMode, setCurrentMode] = useState('triad');
    const [globalRotation, setGlobalRotation] = useState(0);

    const setMode = useCallback((mode) => {
        setCurrentMode(mode);
        setNodes(prev => {
            const base = prev[0] || { id: Date.now(), baseAngle: 0, s: 1, l: 0.5 };
            
            if (mode === 'complementary') {
                return [base, { id: Date.now() + 1, baseAngle: (base.baseAngle + 180) % 360, s: base.s, l: base.l }];
            } else if (mode === 'triad') {
                return [
                    base, 
                    { id: Date.now() + 1, baseAngle: (base.baseAngle + 120) % 360, s: base.s, l: base.l }, 
                    { id: Date.now() + 2, baseAngle: (base.baseAngle + 240) % 360, s: base.s, l: base.l }
                ];
            } else if (mode === 'tetrad') {
                return [
                    base, 
                    { id: Date.now() + 1, baseAngle: (base.baseAngle + 90) % 360, s: base.s, l: base.l }, 
                    { id: Date.now() + 2, baseAngle: (base.baseAngle + 180) % 360, s: base.s, l: base.l }, 
                    { id: Date.now() + 3, baseAngle: (base.baseAngle + 270) % 360, s: base.s, l: base.l }
                ];
            }
            // mode === 'manual' keeps the previous state, maybe we should just allow modifying it
            return prev;
        });
    }, []);

    const addNode = useCallback(() => {
        if (currentMode !== 'manual') return;
        setNodes(prev => [
            ...prev,
            { id: Date.now(), baseAngle: Math.floor(Math.random() * 360), s: 1, l: 0.5 }
        ]);
    }, [currentMode]);

    const removeNode = useCallback((id) => {
        setNodes(prev => {
            const filtered = prev.filter(n => n.id !== id);
            if (filtered.length === 0) {
                return [{ id: Date.now(), baseAngle: 0, s: 0, l: 0.7 }];
            }
            return filtered;
        });
    }, []);

    const updateNode = useCallback((id, updates) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    }, []);

    // For dragging
    const updateAllHarmonicNodes = useCallback((baseNodeId, newAngle, newS) => {
        setNodes(prev => {
            const base = prev.find(n => n.id === baseNodeId);
            if (!base) return prev;
            
            const angleDiff = newAngle - base.baseAngle;
            return prev.map(n => ({
                ...n,
                baseAngle: (n.baseAngle + angleDiff + 360) % 360,
                s: newS
            }));
        });
    }, []);

    return {
        nodes,
        setNodes,
        currentMode,
        setMode,
        globalRotation,
        setGlobalRotation,
        addNode,
        removeNode,
        updateNode,
        updateAllHarmonicNodes
    };
}

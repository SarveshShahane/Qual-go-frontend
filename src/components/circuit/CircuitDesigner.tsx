import React, { useState, useEffect, useCallback } from 'react';
import type { Circuit, CanonicalCircuit, CanonicalMoment, CanonicalOperation, Operation, QuantumBackendId, QuantumBackendInfo, SimulationResult } from '../../types/circuit';
import { CircuitToolbar } from './CircuitToolbar';
import { GatePalette } from './GatePalette';
import { CircuitCanvas } from './CircuitCanvas';
import { GateInspector } from './GateInspector';
import { CodeEditorPanel } from './CodeEditorPanel';
import { SimulationPanel } from './SimulationPanel';
import { TemplatesModal } from './TemplatesModal';
import { ShortcutsModal } from './ShortcutsModal';
import { BackendSelector } from './BackendSelector';
import { BackendComparisonModal } from './BackendComparisonModal';
import { AITutorPanel } from '../ai/AITutorPanel';
import { BELL_STATE_TEMPLATE } from '../../core/quantum/templates';
import { useCircuitHistory } from '../../hooks/useCircuitHistory';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { executeQuantumSimulation, getQuantumBackends, FALLBACK_BACKENDS } from '../../api/quantum';
import { generateQiskitCode, generateOpenQASM } from '../../core/quantum/generator';
import { parseQiskitCode } from '../../core/quantum/parser';

export const CircuitDesigner: React.FC = () => {
  // Circuit state with undo/redo history
  const {
    circuit,
    setCircuit,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  } = useCircuitHistory(BELL_STATE_TEMPLATE);

  // Layout view modes: 'split' | 'canvas' | 'code'
  const [viewMode, setViewMode] = useState<'split' | 'canvas' | 'code'>('split');

  // Selected gate/operation for Inspector panel
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);

  // Multi-backend execution state
  const [activeBackend, setActiveBackend] = useState<QuantumBackendId>('qiskit_aer');
  const [backends, setBackends] = useState<QuantumBackendInfo[]>(FALLBACK_BACKENDS);
  const [shots, setShots] = useState<number>(1024);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Modals state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isBackendSelectorOpen, setIsBackendSelectorOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  // Load available backends on mount
  useEffect(() => {
    getQuantumBackends().then((bList) => {
      if (bList && bList.length > 0) {
        setBackends(bList);
      }
    });
  }, []);

  // Run simulation handler
  const handleRunSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      const res = await executeQuantumSimulation(circuit, activeBackend, shots);
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  }, [circuit, activeBackend, shots]);

  // Run initial simulation on mount
  useEffect(() => {
    handleRunSimulation();
  }, [circuit.qubits]); // Run when qubits change or initial load

  // Find currently selected operation
  const selectedOperation: Operation | null = React.useMemo(() => {
    if (!selectedOperationId) return null;
    for (const moment of circuit.moments) {
      const op = moment.operations.find((o) => o.id === selectedOperationId);
      if (op) return op;
    }
    return null;
  }, [circuit, selectedOperationId]);

  // Operations CRUD
  const handleAddOperation = (gateId: string, momentIndex: number, targetQubit: number) => {
    setCircuit((prev) => {
      const newMoments = prev.moments.map((m) => ({
        ...m,
        operations: [...m.operations],
      }));

      // Ensure moments array has enough columns
      while (newMoments.length <= momentIndex) {
        newMoments.push({
          id: `moment_${newMoments.length}_${Date.now()}`,
          operations: [],
        });
      }

      const newOp: Operation = {
        id: `op_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gate: gateId,
        targets: [targetQubit],
        controls: gateId === 'CX' || gateId === 'CZ' ? [targetQubit > 0 ? targetQubit - 1 : targetQubit + 1] : undefined,
        params: gateId === 'Rx' || gateId === 'Ry' || gateId === 'Rz' ? [Math.PI / 2] : undefined,
        paramExpressions: gateId === 'Rx' || gateId === 'Ry' || gateId === 'Rz' ? ['π/2'] : undefined,
        metadata: gateId === 'Measure' ? { classicalTarget: targetQubit } : undefined,
      };

      newMoments[momentIndex].operations.push(newOp);

      return {
        ...prev,
        moments: newMoments,
      };
    });
  };

  const handleMoveOperation = (operationId: string, toMomentIndex: number, toTargetQubit: number) => {
    setCircuit((prev) => {
      let movedOp: Operation | null = null;
      const newMoments = prev.moments.map((m) => {
        const remaining = m.operations.filter((op) => {
          if (op.id === operationId) {
            movedOp = { ...op };
            return false;
          }
          return true;
        });
        return { ...m, operations: remaining };
      });

      if (!movedOp) return prev;
      const targetOp = movedOp as Operation;

      // Update target qubit
      const updatedOp: Operation = {
        ...targetOp,
        targets: [toTargetQubit, ...(targetOp.targets.slice(1))],
      };

      // Ensure moment exists
      while (newMoments.length <= toMomentIndex) {
        newMoments.push({
          id: `moment_${newMoments.length}_${Date.now()}`,
          operations: [],
        });
      }

      newMoments[toMomentIndex].operations.push(updatedOp);

      return {
        ...prev,
        moments: newMoments,
      };
    });
  };

  const handleDeleteOperation = (operationId: string) => {
    setCircuit((prev) => {
      const newMoments = prev.moments.map((m) => ({
        ...m,
        operations: m.operations.filter((op) => op.id !== operationId),
      }));
      return { ...prev, moments: newMoments };
    });
    if (selectedOperationId === operationId) {
      setSelectedOperationId(null);
    }
  };

  const handleDuplicateOperation = (operationId: string) => {
    setCircuit((prev) => {
      let opToDup: Operation | null = null;
      let fromM = 0;
      prev.moments.forEach((m, idx) => {
        const found = m.operations.find((o) => o.id === operationId);
        if (found) {
          opToDup = found;
          fromM = idx;
        }
      });

      if (!opToDup) return prev;
      const targetOpToDup = opToDup as Operation;

      const dupTargetM = fromM + 1;
      const newMoments = prev.moments.map((m) => ({
        ...m,
        operations: [...m.operations],
      }));

      while (newMoments.length <= dupTargetM) {
        newMoments.push({
          id: `moment_${newMoments.length}_${Date.now()}`,
          operations: [],
        });
      }

      const dupOp: Operation = {
        ...targetOpToDup,
        id: `op_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };

      newMoments[dupTargetM].operations.push(dupOp);
      return { ...prev, moments: newMoments };
    });
  };

  const handleUpdateOperation = (updatedOp: Operation) => {
    setCircuit((prev) => {
      const newMoments = prev.moments.map((m) => ({
        ...m,
        operations: m.operations.map((op) => (op.id === updatedOp.id ? updatedOp : op)),
      }));
      return { ...prev, moments: newMoments };
    });
  };

  // Qubit management
  const handleAddQubit = () => {
    if (circuit.qubits >= 16) return;
    setCircuit((prev) => {
      const newCount = prev.qubits + 1;
      const newLabels = [...prev.qubitLabels, `q${prev.qubits}`];
      return {
        ...prev,
        qubits: newCount,
        qubitLabels: newLabels,
      };
    });
  };

  const handleRemoveQubit = (qubitIndex: number) => {
    if (circuit.qubits <= 1) return;
    setCircuit((prev) => {
      const newMoments = prev.moments.map((m) => ({
        ...m,
        operations: m.operations.filter((op) => {
          const usesTarget = op.targets.includes(qubitIndex);
          const usesCtrl = op.controls?.includes(qubitIndex);
          return !usesTarget && !usesCtrl;
        }).map((op) => ({
          ...op,
          targets: op.targets.map((t) => (t > qubitIndex ? t - 1 : t)),
          controls: op.controls?.map((c) => (c > qubitIndex ? c - 1 : c)),
        })),
      }));

      const newLabels = prev.qubitLabels.filter((_, i) => i !== qubitIndex);
      return {
        ...prev,
        qubits: prev.qubits - 1,
        qubitLabels: newLabels,
        moments: newMoments,
      };
    });
  };

  const handleAddMoment = () => {
    setCircuit((prev) => ({
      ...prev,
      moments: [
        ...prev.moments,
        { id: `moment_${prev.moments.length}_${Date.now()}`, operations: [] },
      ],
    }));
  };

  const handleDeleteMoment = (index: number) => {
    setCircuit((prev) => ({
      ...prev,
      moments: prev.moments.filter((_, i) => i !== index),
    }));
  };

  const handleClearCircuit = () => {
    setCircuit({
      name: 'Empty Circuit',
      qubits: 2,
      qubitLabels: ['q0', 'q1'],
      classicalBits: 2,
      classicalBitLabels: ['c0', 'c1'],
      moments: Array.from({ length: 5 }, (_, i) => ({
        id: `moment_${i}_${Date.now()}`,
        operations: [],
      })),
    });
    setSelectedOperationId(null);
  };

  const handleExportCode = (format: 'qiskit' | 'qasm' | 'json') => {
    let content = '';
    let filename = `${circuit.name.toLowerCase().replace(/\s+/g, '_')}`;

    if (format === 'qiskit') {
      content = generateQiskitCode(circuit);
      filename += '.py';
    } else if (format === 'qasm') {
      content = generateOpenQASM(circuit);
      filename += '.qasm';
    } else {
      content = JSON.stringify(circuit, null, 2);
      filename += '.json';
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyAICircuit = (aiCircuit: CanonicalCircuit) => {
    const newCircuit: Circuit = {
      name: aiCircuit.name || 'AI Generated Circuit',
      qubits: aiCircuit.qubits,
      qubitLabels: aiCircuit.qubitLabels || Array.from({ length: aiCircuit.qubits }, (_, i) => `q${i}`),
      classicalBits: aiCircuit.classicalBits || aiCircuit.qubits,
      classicalBitLabels: aiCircuit.classicalBitLabels || Array.from({ length: aiCircuit.classicalBits || aiCircuit.qubits }, (_, i) => `c${i}`),
      moments: aiCircuit.moments.map((m: CanonicalMoment, mIdx: number) => ({
        id: `moment_${mIdx}_${Date.now()}`,
        operations: m.operations.map((op: CanonicalOperation, opIdx: number) => ({
          id: `op_${mIdx}_${opIdx}_${Date.now()}`,
          gate: op.gate,
          targets: op.targets,
          controls: op.controls,
          params: op.params,
          paramExpressions: op.params ? op.params.map((p: number) => p.toString()) : undefined,
          metadata: op.metadata,
        })),
      })),
    };

    setCircuit(newCircuit);
    setSelectedOperationId(null);
    setTimeout(handleRunSimulation, 50);
  };

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onDelete: () => {
      if (selectedOperationId) handleDeleteOperation(selectedOperationId);
    },
    onDuplicate: () => {
      if (selectedOperationId) handleDuplicateOperation(selectedOperationId);
    },
    onDeselect: () => setSelectedOperationId(null),
    onSimulate: handleRunSimulation,
    onOpenHelp: () => setIsShortcutsOpen(true),
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-[#F5EBDD] text-[#413333] overflow-hidden select-none">
      {/* Top Application Toolbar */}
      <CircuitToolbar
        circuit={circuit}
        onUpdateCircuitName={(name) => setCircuit((prev) => ({ ...prev, name }))}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onAddQubit={handleAddQubit}
        onAddMoment={handleAddMoment}
        onClearCircuit={handleClearCircuit}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        activeBackend={activeBackend}
        onOpenBackendSelector={() => setIsBackendSelectorOpen(true)}
        onOpenBackendComparison={() => setIsComparisonOpen(true)}
        onExportCode={handleExportCode}
        onOpenAITutor={() => setIsAITutorOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left: Draggable Gate Palette */}
        {viewMode !== 'code' && (
          <div className="w-56 shrink-0 h-full border-r border-[#413333]/15 bg-[#FAF4EC] overflow-y-auto">
            <GatePalette />
          </div>
        )}

        {/* Center: Circuit Canvas / Split View / Code Editor */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex-1 flex min-h-0">
            {/* Visual Canvas Area */}
            {viewMode !== 'code' && (
              <div className="flex-1 flex min-h-0 min-w-0 bg-[#F5EBDD] relative">
                <CircuitCanvas
                  circuit={circuit}
                  selectedOperationId={selectedOperationId}
                  onSelectOperation={setSelectedOperationId}
                  onAddOperation={handleAddOperation}
                  onMoveOperation={handleMoveOperation}
                  onDeleteOperation={handleDeleteOperation}
                  onDuplicateOperation={handleDuplicateOperation}
                  onAddQubit={handleAddQubit}
                  onRemoveQubit={handleRemoveQubit}
                  onRenameQubit={(qIdx, newLabel) => {
                    setCircuit((prev) => {
                      const updatedLabels = [...prev.qubitLabels];
                      updatedLabels[qIdx] = newLabel;
                      return { ...prev, qubitLabels: updatedLabels };
                    });
                  }}
                  onAddMoment={handleAddMoment}
                  onDeleteMoment={handleDeleteMoment}
                />

                {/* Right Floating Gate Inspector */}
                {selectedOperation && (
                  <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-[#413333]/15 shadow-xl z-20 overflow-y-auto">
                    <GateInspector
                      operation={selectedOperation}
                      circuit={circuit}
                      onUpdateOperation={handleUpdateOperation}
                      onDeleteOperation={handleDeleteOperation}
                      onDuplicateOperation={handleDuplicateOperation}
                      onClose={() => setSelectedOperationId(null)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Monaco Code Editor Area */}
            {viewMode !== 'canvas' && (
              <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full min-h-0 flex flex-col`}>
                <CodeEditorPanel
                  circuit={circuit}
                  onCircuitCodeChange={(newCircuit) => {
                    setCircuit(newCircuit);
                  }}
                  onOpenAITutor={() => setIsAITutorOpen(true)}
                />
              </div>
            )}
          </div>

          {/* Bottom Telemetry & Simulation Panel */}
          <div className="h-64 shrink-0">
            <SimulationPanel
              circuit={circuit}
              result={simulationResult}
              isRunning={isSimulating}
              shots={shots}
              onShotsChange={setShots}
              onRunSimulation={handleRunSimulation}
              activeBackend={activeBackend}
              onOpenBackendSelector={() => setIsBackendSelectorOpen(true)}
              onOpenBackendComparison={() => setIsComparisonOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <BackendSelector
        isOpen={isBackendSelectorOpen}
        onClose={() => setIsBackendSelectorOpen(false)}
        backends={backends}
        activeBackend={activeBackend}
        onSelectBackend={(bId) => {
          setActiveBackend(bId);
          setTimeout(handleRunSimulation, 50);
        }}
      />

      <BackendComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        circuit={circuit}
        shots={shots}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(tpl) => {
          setCircuit(tpl);
          clearHistory(tpl);
          setSelectedOperationId(null);
        }}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* AI Quantum Mentor Drawer */}
      <AITutorPanel
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        circuit={circuit}
        code={generateQiskitCode(circuit)}
        simulationResult={simulationResult ? {
          backend: activeBackend,
          backend_name: activeBackend,
          framework: simulationResult.framework || 'qiskit',
          framework_version: simulationResult.frameworkVersion || '1.0.0',
          qubits: simulationResult.qubits || circuit.qubits,
          executionTimeMs: simulationResult.executionTimeMs,
          execution_time_ms: simulationResult.executionTimeMs,
          shots: simulationResult.shots || shots,
          statevector: simulationResult.statevector,
          probabilities: simulationResult.probabilities,
          counts: simulationResult.counts,
          blochVectors: simulationResult.blochVectors,
          bloch_vectors: simulationResult.blochVectors,
          success: true,
        } : null}
        onApplyCircuit={handleApplyAICircuit}
        onApplyCode={(newCode) => {
          try {
            const parsed = parseQiskitCode(newCode);
            if (parsed.success && parsed.circuit) {
              setCircuit(parsed.circuit);
            }
          } catch (e) {
            console.warn('Failed to parse AI code into canvas:', e);
          }
        }}
      />
    </div>
  );
};

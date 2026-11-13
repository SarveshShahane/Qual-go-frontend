import React, { useState, useEffect } from 'react';
import type { Circuit, Operation } from '../../types/circuit';
import { getGate } from '../../core/quantum/gateRegistry';
import { parseAngleExpression, formatAngle } from '../../core/quantum/mathUtils';

interface GateInspectorProps {
  circuit: Circuit;
  operation: Operation | null;
  onUpdateOperation: (updatedOp: Operation) => void;
  onDeleteOperation: (opId: string) => void;
  onDuplicateOperation: (opId: string) => void;
  onClose: () => void;
}

export const GateInspector: React.FC<GateInspectorProps> = ({
  circuit,
  operation,
  onUpdateOperation,
  onDeleteOperation,
  onDuplicateOperation,
  onClose,
}) => {
  const [angleExpr, setAngleExpr] = useState<string>('');

  useEffect(() => {
    if (operation?.params?.[0] !== undefined) {
      setAngleExpr(operation.paramExpressions?.[0] || formatAngle(operation.params[0]));
    }
  }, [operation]);

  if (!operation) {
    return (
      <aside className="w-80 bg-[#FAF4EC] border-l border-[#413333]/15 flex flex-col p-6 text-[#413333]/70 select-none">
        <div className="flex items-center justify-between pb-4 border-b border-[#413333]/15 mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#413333] font-semibold">
            Gate Inspector
          </h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-white border border-[#413333]/15 flex items-center justify-center text-[#413333]/60 mb-3 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#413333]">No Gate Selected</p>
          <p className="text-xs text-[#413333]/70 mt-1 max-w-[200px]">
            Click any gate in the circuit grid to inspect parameters, matrices, and theory.
          </p>
        </div>
      </aside>
    );
  }

  const gateDef = getGate(operation.gate);
  const numQubits = circuit.qubits;

  // Handle angle expression change
  const handleAngleChange = (expr: string) => {
    setAngleExpr(expr);
    const radians = parseAngleExpression(expr);
    onUpdateOperation({
      ...operation,
      params: [radians],
      paramExpressions: [expr],
    });
  };

  const handleSliderChange = (rad: number) => {
    const formatted = formatAngle(rad);
    setAngleExpr(formatted);
    onUpdateOperation({
      ...operation,
      params: [rad],
      paramExpressions: [formatted],
    });
  };

  // Change target qubit
  const handleTargetChange = (newTarget: number) => {
    onUpdateOperation({
      ...operation,
      targets: [newTarget],
    });
  };

  // Change control qubit
  const handleControlChange = (newControl: number, controlIdx: number = 0) => {
    const newControls = [...(operation.controls || [])];
    newControls[controlIdx] = newControl;
    onUpdateOperation({
      ...operation,
      controls: newControls,
    });
  };

  const currentRad = operation.params?.[0] ?? Math.PI / 2;
  const matrix = gateDef?.matrix(operation.params);

  return (
    <aside className="w-80 bg-[#FAF4EC] border-l border-[#413333]/15 flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Inspector Header */}
      <div className="p-4 border-b border-[#413333]/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm border ${gateDef?.color.bg} ${gateDef?.color.border} ${gateDef?.color.text}`}
          >
            {gateDef?.symbol || operation.gate}
          </div>
          <div>
            <h3 className="text-xs font-heading font-bold text-[#413333] leading-tight">
              {gateDef?.name || operation.gate}
            </h3>
            <span className="text-[10px] font-mono text-[#413333]/60 uppercase">
              {gateDef?.category}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-[#413333]/60 hover:text-[#413333] p-1 rounded transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Qubit Target & Control Assignment */}
        <div className="space-y-3">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#413333]/70 font-semibold block">
            Qubit Wires
          </label>

          {/* Target Selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#413333] font-medium">Target Qubit:</span>
            <select
              value={operation.targets[0] ?? 0}
              onChange={(e) => handleTargetChange(parseInt(e.target.value, 10))}
              className="bg-white border border-[#413333]/20 text-[#315B8C] rounded px-2.5 py-1 text-xs font-mono outline-none focus:border-[#315B8C] shadow-sm"
            >
              {Array.from({ length: numQubits }).map((_, q) => (
                <option key={q} value={q}>
                  {circuit.qubitLabels[q] || `q${q}`}
                </option>
              ))}
            </select>
          </div>

          {/* Control Selectors */}
          {operation.controls && operation.controls.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#413333]/10">
              {operation.controls.map((ctrl, cIdx) => (
                <div key={cIdx} className="flex items-center justify-between text-xs">
                  <span className="text-[#413333] font-medium">Control Qubit {cIdx + 1}:</span>
                  <select
                    value={ctrl}
                    onChange={(e) => handleControlChange(parseInt(e.target.value, 10), cIdx)}
                    className="bg-white border border-[#413333]/20 text-[#315B8C] rounded px-2.5 py-1 text-xs font-mono outline-none focus:border-[#315B8C] shadow-sm"
                  >
                    {Array.from({ length: numQubits }).map((_, q) => (
                      <option key={q} value={q} disabled={operation.targets.includes(q)}>
                        {circuit.qubitLabels[q] || `q${q}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Classical Target for Measurement */}
          {operation.gate === 'Measure' && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#413333]/10">
              <span className="text-[#413333] font-medium">Classical Bit:</span>
              <select
                value={(operation.metadata?.classicalTarget as number) ?? operation.targets[0]}
                onChange={(e) =>
                  onUpdateOperation({
                    ...operation,
                    metadata: { ...operation.metadata, classicalTarget: parseInt(e.target.value, 10) },
                  })
                }
                className="bg-white border border-[#413333]/20 text-[#F2765E] rounded px-2.5 py-1 text-xs font-mono outline-none focus:border-[#F2765E] shadow-sm"
              >
                {Array.from({ length: Math.max(1, circuit.classicalBits) }).map((_, c) => (
                  <option key={c} value={c}>
                    c[{c}]
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Parameter Slider & Expression Input */}
        {gateDef?.hasParams && (
          <div className="space-y-3 pt-3 border-t border-[#413333]/15">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#413333] font-semibold">
                Rotation Angle (θ)
              </label>
              <span className="text-xs font-mono text-[#413333]/70">
                {currentRad.toFixed(3)} rad
              </span>
            </div>

            {/* Expression Text Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={angleExpr}
                onChange={(e) => handleAngleChange(e.target.value)}
                placeholder="e.g. π/2, 3π/4, 1.57"
                className="flex-1 bg-white border border-[#413333]/20 focus:border-[#F2765E] text-[#413333] rounded px-2.5 py-1 text-xs font-mono outline-none shadow-sm"
              />
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max={2 * Math.PI}
              step="0.01"
              value={currentRad}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="w-full accent-[#F2765E] cursor-pointer"
            />

            {/* Quick Angle Presets */}
            <div className="flex flex-wrap gap-1">
              {[
                { label: '0', val: 0 },
                { label: 'π/4', val: Math.PI / 4 },
                { label: 'π/2', val: Math.PI / 2 },
                { label: 'π', val: Math.PI },
                { label: '3π/2', val: (3 * Math.PI) / 2 },
                { label: '2π', val: 2 * Math.PI },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleSliderChange(preset.val)}
                  className="px-2 py-0.5 text-[10px] font-mono rounded bg-white hover:bg-[#F2765E]/10 text-[#413333] hover:text-[#F2765E] border border-[#413333]/15 shadow-sm transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Matrix Display */}
        {matrix && matrix.length === 2 && (
          <div className="space-y-2 pt-3 border-t border-[#413333]/15">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#413333]/70 font-semibold block">
              Unitary Matrix (2×2)
            </label>
            <div className="p-2.5 rounded-lg bg-white border border-[#315B8C]/20 font-mono text-[11px] text-[#315B8C] leading-relaxed overflow-x-auto shadow-sm">
              <div>
                [{matrix[0][0].real.toFixed(2)}{matrix[0][0].imag >= 0 ? '+' : ''}{matrix[0][0].imag.toFixed(2)}i ,{' '}
                {matrix[0][1].real.toFixed(2)}{matrix[0][1].imag >= 0 ? '+' : ''}{matrix[0][1].imag.toFixed(2)}i]
              </div>
              <div>
                [{matrix[1][0].real.toFixed(2)}{matrix[1][0].imag >= 0 ? '+' : ''}{matrix[1][0].imag.toFixed(2)}i ,{' '}
                {matrix[1][1].real.toFixed(2)}{matrix[1][1].imag >= 0 ? '+' : ''}{matrix[1][1].imag.toFixed(2)}i]
              </div>
            </div>
          </div>
        )}

        {/* Educational Info */}
        {gateDef && (
          <div className="space-y-2 pt-3 border-t border-[#413333]/15">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#413333]/70 font-semibold block">
              Theory & Behavior
            </label>
            <p className="text-xs text-[#413333]/85 leading-relaxed">
              {gateDef.description}
            </p>
            {gateDef.exampleUsage && (
              <div className="p-2 rounded bg-[#315B8C]/10 border border-[#315B8C]/25 text-[11px] font-mono text-[#315B8C]">
                {gateDef.exampleUsage}
              </div>
            )}
          </div>
        )}

        {/* Actions (Duplicate & Delete) */}
        <div className="pt-4 border-t border-[#413333]/15 flex items-center gap-2">
          <button
            onClick={() => onDuplicateOperation(operation.id)}
            className="flex-1 py-1.5 px-3 rounded-lg border border-[#315B8C]/30 hover:border-[#315B8C] bg-white hover:bg-[#315B8C]/10 text-xs font-mono text-[#315B8C] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicate
          </button>
          <button
            onClick={() => onDeleteOperation(operation.id)}
            className="py-1.5 px-3 rounded-lg border border-[#F2765E]/30 hover:border-[#F2765E] bg-[#F2765E]/10 hover:bg-[#F2765E]/20 text-xs font-mono text-[#F2765E] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </aside>
  );
};

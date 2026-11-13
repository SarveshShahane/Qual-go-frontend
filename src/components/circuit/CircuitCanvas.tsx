import React, { useState } from 'react';
import type { Circuit, Operation } from '../../types/circuit';
import { GateNode } from './GateNode';

interface CircuitCanvasProps {
  circuit: Circuit;
  selectedOperationId: string | null;
  onSelectOperation: (opId: string | null) => void;
  onAddOperation: (gateId: string, momentIndex: number, targetQubit: number) => void;
  onMoveOperation: (operationId: string, toMomentIndex: number, toTargetQubit: number) => void;
  onDeleteOperation: (operationId: string) => void;
  onDuplicateOperation: (operationId: string) => void;
  onAddQubit: () => void;
  onRemoveQubit: (qubitIndex: number) => void;
  onRenameQubit: (qubitIndex: number, newName: string) => void;
  onAddMoment: (index?: number) => void;
  onDeleteMoment: (index: number) => void;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  circuit,
  selectedOperationId,
  onSelectOperation,
  onAddOperation,
  onMoveOperation,
  onDeleteOperation,
  onDuplicateOperation,
  onAddQubit,
  onRemoveQubit,
  onRenameQubit,
  onAddMoment,
  onDeleteMoment,
}) => {
  const [dragOverCell, setDragOverCell] = useState<{ momentIdx: number; qubitIdx: number } | null>(null);
  const [editingQubitIdx, setEditingQubitIdx] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const numQubits = Math.max(1, circuit.qubits);
  const moments = circuit.moments;

  // Drag over handler
  const handleDragOver = (e: React.DragEvent, momentIdx: number, qubitIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverCell?.momentIdx !== momentIdx || dragOverCell?.qubitIdx !== qubitIdx) {
      setDragOverCell({ momentIdx, qubitIdx });
    }
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  // Drop handler
  const handleDrop = (e: React.DragEvent, momentIdx: number, qubitIdx: number) => {
    e.preventDefault();
    setDragOverCell(null);

    const moveOpId = e.dataTransfer.getData('application/x-quantum-operation-id');
    const newGateId = e.dataTransfer.getData('text/plain');

    if (moveOpId) {
      // Moving existing operation
      onMoveOperation(moveOpId, momentIdx, qubitIdx);
    } else if (newGateId) {
      // Adding new gate from palette
      onAddOperation(newGateId, momentIdx, qubitIdx);
    }
  };

  const handleStartRename = (idx: number, currentName: string) => {
    setEditingQubitIdx(idx);
    setEditingName(currentName);
  };

  const handleSaveRename = (idx: number) => {
    if (editingName.trim()) {
      onRenameQubit(idx, editingName.trim());
    }
    setEditingQubitIdx(null);
  };

  return (
    <div
      onClick={() => onSelectOperation(null)}
      className="flex-1 bg-[#F5EBDD] overflow-auto p-6 select-none relative"
    >
      <div className="inline-block min-w-full">
        {/* Timeline Header (t0, t1, t2, ...) */}
        <div className="flex items-center mb-3">
          {/* Wire Labels Header placeholder */}
          <div className="w-28 shrink-0 flex items-center justify-between pr-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#413333]/60 font-bold">
              Wires
            </span>
            <span className="text-[10px] font-mono text-[#413333]/60">State</span>
          </div>

          {/* Moment Column Headers */}
          <div className="flex items-center gap-3">
            {moments.map((moment, mIdx) => (
              <div
                key={moment.id || mIdx}
                className="w-14 shrink-0 flex items-center justify-center relative group"
              >
                <span className="text-[10px] font-mono text-[#413333]/60 font-semibold group-hover:text-[#F2765E] transition-colors">
                  t{mIdx}
                </span>

                {/* Remove column button on hover */}
                {moments.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMoment(mIdx);
                    }}
                    title="Remove column"
                    className="absolute -top-3 text-[10px] text-[#413333]/40 hover:text-[#F2765E] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Add Moment Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddMoment();
              }}
              title="Add column (moment)"
              className="w-8 h-6 rounded border border-[#413333]/20 hover:border-[#F2765E] bg-white hover:bg-[#FAF4EC] text-[#413333] hover:text-[#F2765E] text-xs font-mono flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Qubit Wires Grid */}
        <div className="space-y-4">
          {Array.from({ length: numQubits }).map((_, qIdx) => {
            const qubitLabel = circuit.qubitLabels[qIdx] || `q${qIdx}`;

            return (
              <div key={qIdx} className="flex items-center group/wire relative">
                {/* Qubit Label and Initial State */}
                <div className="w-28 shrink-0 flex items-center justify-between pr-4">
                  {editingQubitIdx === qIdx ? (
                    <input
                      type="text"
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleSaveRename(qIdx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(qIdx);
                        if (e.key === 'Escape') setEditingQubitIdx(null);
                      }}
                      className="w-16 bg-white border border-[#315B8C] text-xs font-mono text-[#315B8C] px-1 py-0.5 rounded outline-none shadow-sm font-semibold"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span
                        title="Click to rename"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(qIdx, qubitLabel);
                        }}
                        className="text-xs font-mono font-bold text-[#413333] hover:text-[#F2765E] cursor-pointer transition-colors"
                      >
                        {qubitLabel}
                      </span>
                      {numQubits > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveQubit(qIdx);
                          }}
                          title="Remove Qubit"
                          className="opacity-0 group-hover/wire:opacity-100 text-[#413333]/40 hover:text-[#F2765E] transition-opacity p-0.5 cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Initial state ket |0> */}
                  <span className="text-[11px] font-mono text-[#315B8C] bg-[#EDE0CF] px-1.5 py-0.5 rounded border border-[#315B8C]/30 font-semibold">
                    |0⟩
                  </span>
                </div>

                {/* Wire Columns */}
                <div className="flex items-center gap-3 relative">
                  {/* Continuous Wire Line Background */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#413333]/30 z-0 pointer-events-none" />

                  {moments.map((moment, mIdx) => {
                    // Check if there is an operation on this (qubit, moment)
                    const op = moment.operations.find(
                      (o) => o.targets.includes(qIdx) || o.controls?.includes(qIdx)
                    );

                    const isDropTarget =
                      dragOverCell?.momentIdx === mIdx && dragOverCell?.qubitIdx === qIdx;

                    return (
                      <div
                        key={moment.id || mIdx}
                        onDragOver={(e) => handleDragOver(e, mIdx, qIdx)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, mIdx, qIdx)}
                        className={`w-14 h-12 shrink-0 flex items-center justify-center relative z-10 rounded transition-colors ${
                          isDropTarget
                            ? 'bg-[#315B8C]/15 ring-1 ring-[#315B8C]'
                            : 'hover:bg-[#413333]/5'
                        }`}
                      >
                        {op ? (
                          <GateNode
                            operation={op}
                            momentIndex={mIdx}
                            currentQubit={qIdx}
                            isSelected={selectedOperationId === op.id}
                            onSelect={() => onSelectOperation(op.id)}
                            onDelete={() => onDeleteOperation(op.id)}
                            onDuplicate={() => onDuplicateOperation(op.id)}
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                'application/x-quantum-operation-id',
                                op.id
                              );
                              e.dataTransfer.setData('text/plain', op.gate);
                            }}
                          />
                        ) : isDropTarget ? (
                          <div className="w-8 h-8 rounded-md border-2 border-dashed border-[#315B8C] bg-[#315B8C]/10 flex items-center justify-center font-mono text-xs text-[#315B8C] font-bold">
                            +
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Qubit Vertical Connection Lines Overlay */}
        <svg
          className="absolute inset-0 pointer-events-none z-1"
          style={{ width: '100%', height: '100%' }}
        >
          {moments.map((moment, mIdx) => {
            return moment.operations.map((op: Operation) => {
              const allQubits = [...op.targets, ...(op.controls || [])];
              if (allQubits.length < 2) return null;

              const minQ = Math.min(...allQubits);
              const maxQ = Math.max(...allQubits);

              const xPos = 112 + mIdx * (56 + 12) + 28;
              const yMin = 48 + minQ * 64 + 24;
              const yMax = 48 + maxQ * 64 + 24;

              const strokeColor =
                op.gate === 'SWAP' || op.gate === 'Measure'
                  ? '#F2765E'
                  : '#315B8C';

              return (
                <g key={`conn_${op.id}_${mIdx}`}>
                  {/* Vertical connecting line */}
                  <line
                    x1={xPos}
                    y1={yMin}
                    x2={xPos}
                    y2={yMax}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray={op.gate === 'Measure' ? '4 3' : 'none'}
                  />
                </g>
              );
            });
          })}
        </svg>

        {/* Classical Register Wire */}
        {circuit.classicalBits > 0 && (
          <div className="mt-6 pt-4 border-t border-[#413333]/15 flex items-center">
            <div className="w-28 shrink-0 flex items-center justify-between pr-4">
              <span className="text-xs font-mono font-bold text-[#413333]">
                c [{circuit.classicalBits}]
              </span>
              <span className="text-[10px] font-mono text-[#413333]/60">0</span>
            </div>
            <div className="flex items-center gap-3 relative">
              {/* Double classical wire */}
              <div className="absolute left-0 right-0 top-[22px] h-[1px] bg-[#413333]/40 z-0 pointer-events-none" />
              <div className="absolute left-0 right-0 top-[26px] h-[1px] bg-[#413333]/40 z-0 pointer-events-none" />

              {moments.map((moment, mIdx) => (
                <div
                  key={`cl_${mIdx}`}
                  className="w-14 h-12 shrink-0 flex items-center justify-center relative z-10"
                >
                  {/* Indicate if a measure operation is mapped here */}
                  {moment.operations.some((o) => o.gate === 'Measure') && (
                    <div className="w-2 h-2 rounded-full bg-[#F2765E] shadow-sm shadow-[#F2765E]/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Qubit Button */}
        <div className="mt-6 flex items-center gap-4">
          {numQubits < 8 && (
            <button
              onClick={onAddQubit}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-[#413333]/30 hover:border-[#F2765E] bg-white hover:bg-[#FAF4EC] text-[#413333] hover:text-[#F2765E] text-xs font-mono transition-all cursor-pointer shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Qubit (q{numQubits})
            </button>
          )}
          <span className="text-[11px] font-mono text-[#413333]/60">
            {numQubits} Qubits • {moments.length} Moments
          </span>
        </div>
      </div>
    </div>
  );
};

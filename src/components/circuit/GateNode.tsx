import React from 'react';
import type { Operation } from '../../types/circuit';
import { getGate } from '../../core/quantum/gateRegistry';
import { formatAngle } from '../../core/quantum/mathUtils';

interface GateNodeProps {
  operation: Operation;
  momentIndex: number;
  currentQubit: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export const GateNode: React.FC<GateNodeProps> = ({
  operation,
  momentIndex: _momentIndex,
  currentQubit,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onDragStart,
}) => {
  const gateDef = getGate(operation.gate);
  const isTarget = operation.targets.includes(currentQubit);
  const isControl = operation.controls?.includes(currentQubit);

  // If this qubit is neither a target nor a control, do not render a node (it's just empty wire)
  if (!isTarget && !isControl) {
    return null;
  }

  // ------------------------------------------------------------------
  // 1. Render Control Dot (for CX, CZ, CCX)
  // ------------------------------------------------------------------
  if (isControl) {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
          isSelected ? 'ring-2 ring-[#315B8C] ring-offset-2 ring-offset-[#F5EBDD]' : ''
        }`}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#315B8C] shadow-sm shadow-[#315B8C]/40" />
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 2. Render Target for SWAP (an '×' symbol)
  // ------------------------------------------------------------------
  if (operation.gate === 'SWAP') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xl font-bold transition-all cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'bg-[#F2765E]/20 border-2 border-[#F2765E] ring-2 ring-[#F2765E]/50 shadow-md shadow-[#F2765E]/20 text-[#F2765E]'
            : 'bg-white border border-[#F2765E]/70 text-[#F2765E] hover:border-[#F2765E]'
        }`}
      >
        ×
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 3. Render Target for CX / CNOT (a '⊕' symbol)
  // ------------------------------------------------------------------
  if (operation.gate === 'CX' || operation.gate === 'CCX') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xl font-bold transition-all cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'bg-[#315B8C]/20 border-2 border-[#315B8C] ring-2 ring-[#315B8C]/50 shadow-md shadow-[#315B8C]/20 text-[#315B8C]'
            : 'bg-white border-2 border-[#315B8C] text-[#315B8C] hover:scale-105'
        }`}
      >
        ⊕
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 4. Render Target for Measurement
  // ------------------------------------------------------------------
  if (operation.gate === 'Measure') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`relative z-10 w-9 h-9 rounded-lg flex flex-col items-center justify-center transition-all cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'bg-[#F2765E]/20 border-2 border-[#F2765E] ring-2 ring-[#F2765E]/50 shadow-md shadow-[#F2765E]/20 text-[#F2765E]'
            : 'bg-white border border-[#F2765E] text-[#F2765E] hover:scale-105 shadow-sm'
        }`}
      >
        <svg className="w-5 h-5 text-[#F2765E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 17a9 9 0 0 1 18 0" />
          <path d="m12 17 4-8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-[8px] font-mono leading-none mt-0.5 text-[#F2765E] font-bold">
          {operation.metadata?.classicalTarget !== undefined ? `c[${operation.metadata.classicalTarget}]` : 'M'}
        </span>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 5. Standard Single-Qubit & Parameterized Gate Block
  // ------------------------------------------------------------------
  const color = gateDef?.color || {
    bg: 'bg-[#315B8C]/15',
    border: 'border-[#315B8C]',
    text: 'text-[#315B8C]',
    glow: 'shadow-[#315B8C]/20',
  };

  const paramString =
    operation.paramExpressions?.[0] ||
    (operation.params?.[0] !== undefined ? formatAngle(operation.params[0]) : null);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative z-10 w-9 h-9 rounded-lg flex flex-col items-center justify-center font-mono font-bold transition-all cursor-grab active:cursor-grabbing select-none group ${
        isSelected
          ? `${color.bg} border-2 ${color.border} ring-2 ring-[#F2765E] ring-offset-2 ring-offset-[#F5EBDD] shadow-md ${color.glow} scale-105`
          : `bg-white border ${color.border} ${color.text} hover:scale-105 hover:shadow-md shadow-sm`
      }`}
    >
      {/* Symbol */}
      <span className="text-sm font-bold tracking-tight">
        {gateDef?.symbol || operation.gate}
      </span>

      {/* Parameter Badge if present */}
      {paramString && (
        <span className="text-[7.5px] font-mono font-medium px-1 leading-tight text-amber-300/90 truncate max-w-[34px]">
          {paramString}
        </span>
      )}

      {/* Quick Action buttons on hover */}
      {isSelected && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-[#413333]/20 rounded-md px-1.5 py-0.5 shadow-md z-30">
          <button
            title="Duplicate (Ctrl+D)"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="text-[#315B8C] hover:text-[#413333] p-0.5 rounded transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            title="Delete (Delete)"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[#F2765E] hover:text-[#e0634b] p-0.5 rounded transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

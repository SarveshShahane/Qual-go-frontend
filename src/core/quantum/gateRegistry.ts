import type { GateDefinition } from '../../types/circuit';
import { cExp } from './mathUtils';

const INV_SQRT2 = 1 / Math.SQRT2;

export const GATE_REGISTRY: Record<string, GateDefinition> = {
  // -------------------------------------------------------------
  // Single Qubit Gates
  // -------------------------------------------------------------
  H: {
    id: 'H',
    name: 'Hadamard',
    symbol: 'H',
    category: 'single',
    qubits: 1,
    controls: 0,
    description: 'Creates a balanced superposition state from basis states |0⟩ and |1⟩.',
    mathFormula: 'H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}',
    matrixDisplay: '[ [ 1/√2, 1/√2 ], [ 1/√2, -1/√2 ] ]',
    exampleUsage: 'H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩',
    matrix: () => [
      [{ real: INV_SQRT2, imag: 0 }, { real: INV_SQRT2, imag: 0 }],
      [{ real: INV_SQRT2, imag: 0 }, { real: -INV_SQRT2, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  X: {
    id: 'X',
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    category: 'single',
    qubits: 1,
    controls: 0,
    description: 'Quantum NOT gate. Flips |0⟩ to |1⟩ and |1⟩ to |0⟩ (π rotation around X-axis).',
    mathFormula: 'X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}',
    matrixDisplay: '[ [ 0, 1 ], [ 1, 0 ] ]',
    exampleUsage: 'X|0⟩ = |1⟩, X|1⟩ = |0⟩',
    matrix: () => [
      [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#F2765E]/15',
      border: 'border-[#F2765E]',
      text: 'text-[#F2765E]',
      glow: 'shadow-[#F2765E]/20',
    },
  },

  Y: {
    id: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    category: 'single',
    qubits: 1,
    controls: 0,
    description: 'Bit-flip and phase-flip combined (π rotation around Y-axis).',
    mathFormula: 'Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}',
    matrixDisplay: '[ [ 0, -i ], [ i, 0 ] ]',
    exampleUsage: 'Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩',
    matrix: () => [
      [{ real: 0, imag: 0 }, { real: 0, imag: -1 }],
      [{ real: 0, imag: 1 }, { real: 0, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  Z: {
    id: 'Z',
    name: 'Pauli-Z (Phase Flip)',
    symbol: 'Z',
    category: 'single',
    qubits: 1,
    controls: 0,
    description: 'Inverts the phase of |1⟩ while leaving |0⟩ unchanged (π rotation around Z-axis).',
    mathFormula: 'Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}',
    matrixDisplay: '[ [ 1, 0 ], [ 0, -1 ] ]',
    exampleUsage: 'Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: -1, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  S: {
    id: 'S',
    name: 'S Gate (Phase)',
    symbol: 'S',
    category: 'phase',
    qubits: 1,
    controls: 0,
    description: 'Square root of Z gate. Applies a π/2 phase shift to |1⟩.',
    mathFormula: 'S = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix}',
    matrixDisplay: '[ [ 1, 0 ], [ 0, i ] ]',
    exampleUsage: 'S|1⟩ = i|1⟩, S² = Z',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 1 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  T: {
    id: 'T',
    name: 'T Gate (π/8)',
    symbol: 'T',
    category: 'phase',
    qubits: 1,
    controls: 0,
    description: 'Fourth root of Z gate. Applies a π/4 phase shift to |1⟩. Crucial for fault-tolerant universal quantum computation.',
    mathFormula: 'T = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{pmatrix}',
    matrixDisplay: '[ [ 1, 0 ], [ 0, e^(iπ/4) ] ]',
    exampleUsage: 'T|1⟩ = e^(iπ/4)|1⟩, T² = S',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, cExp(Math.PI / 4)],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  SX: {
    id: 'SX',
    name: 'Square Root X',
    symbol: '√X',
    category: 'single',
    qubits: 1,
    controls: 0,
    description: 'Square root of Pauli-X (π/2 rotation around X-axis).',
    mathFormula: '\\sqrt{X} = \\frac{1}{2} \\begin{pmatrix} 1+i & 1-i \\\\ 1-i & 1+i \\end{pmatrix}',
    matrixDisplay: '1/2 [ [ 1+i, 1-i ], [ 1-i, 1+i ] ]',
    exampleUsage: 'SX · SX = X',
    matrix: () => [
      [{ real: 0.5, imag: 0.5 }, { real: 0.5, imag: -0.5 }],
      [{ real: 0.5, imag: -0.5 }, { real: 0.5, imag: 0.5 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  // -------------------------------------------------------------
  // Parameterized Rotations
  // -------------------------------------------------------------
  Rx: {
    id: 'Rx',
    name: 'Rotation-X',
    symbol: 'Rx',
    category: 'phase',
    qubits: 1,
    controls: 0,
    hasParams: true,
    paramNames: ['θ'],
    defaultParams: [Math.PI / 2],
    defaultExpressions: ['π/2'],
    description: 'Arbitrary angle rotation around the X-axis of the Bloch sphere.',
    mathFormula: 'R_x(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -i\\sin(\\theta/2) \\\\ -i\\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}',
    matrixDisplay: '[ [ cos(θ/2), -i*sin(θ/2) ], [ -i*sin(θ/2), cos(θ/2) ] ]',
    exampleUsage: 'Rx(π)|0⟩ = -i|1⟩',
    matrix: (params = [Math.PI / 2]) => {
      const theta = params[0] ?? Math.PI / 2;
      const c = Math.cos(theta / 2);
      const s = Math.sin(theta / 2);
      return [
        [{ real: c, imag: 0 }, { real: 0, imag: -s }],
        [{ real: 0, imag: -s }, { real: c, imag: 0 }],
      ];
    },
    color: {
      bg: 'bg-[#F2765E]/15',
      border: 'border-[#F2765E]',
      text: 'text-[#F2765E]',
      glow: 'shadow-[#F2765E]/20',
    },
  },

  Ry: {
    id: 'Ry',
    name: 'Rotation-Y',
    symbol: 'Ry',
    category: 'phase',
    qubits: 1,
    controls: 0,
    hasParams: true,
    paramNames: ['θ'],
    defaultParams: [Math.PI / 2],
    defaultExpressions: ['π/2'],
    description: 'Arbitrary angle rotation around the Y-axis of the Bloch sphere.',
    mathFormula: 'R_y(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}',
    matrixDisplay: '[ [ cos(θ/2), -sin(θ/2) ], [ sin(θ/2), cos(θ/2) ] ]',
    exampleUsage: 'Ry(π/2)|0⟩ = (|0⟩ + |1⟩)/√2',
    matrix: (params = [Math.PI / 2]) => {
      const theta = params[0] ?? Math.PI / 2;
      const c = Math.cos(theta / 2);
      const s = Math.sin(theta / 2);
      return [
        [{ real: c, imag: 0 }, { real: -s, imag: 0 }],
        [{ real: s, imag: 0 }, { real: c, imag: 0 }],
      ];
    },
    color: {
      bg: 'bg-[#F2765E]/15',
      border: 'border-[#F2765E]',
      text: 'text-[#F2765E]',
      glow: 'shadow-[#F2765E]/20',
    },
  },

  Rz: {
    id: 'Rz',
    name: 'Rotation-Z',
    symbol: 'Rz',
    category: 'phase',
    qubits: 1,
    controls: 0,
    hasParams: true,
    paramNames: ['θ'],
    defaultParams: [Math.PI / 2],
    defaultExpressions: ['π/2'],
    description: 'Arbitrary angle rotation around the Z-axis of the Bloch sphere.',
    mathFormula: 'R_z(\\theta) = \\begin{pmatrix} e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2} \\end{pmatrix}',
    matrixDisplay: '[ [ e^(-iθ/2), 0 ], [ 0, e^(iθ/2) ] ]',
    exampleUsage: 'Rz(π) = -i Z',
    matrix: (params = [Math.PI / 2]) => {
      const theta = params[0] ?? Math.PI / 2;
      return [
        [cExp(-theta / 2), { real: 0, imag: 0 }],
        [{ real: 0, imag: 0 }, cExp(theta / 2)],
      ];
    },
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  // -------------------------------------------------------------
  // Multi-Qubit Gates
  // -------------------------------------------------------------
  CX: {
    id: 'CX',
    name: 'CNOT (Controlled-X)',
    symbol: '⊕',
    category: 'multi',
    qubits: 1,
    controls: 1,
    isControlled: true,
    description: 'Flips target qubit if control qubit is |1⟩. Core gate for generating quantum entanglement.',
    mathFormula: 'CX = |0\\rangle\\langle 0| \\otimes I + |1\\rangle\\langle 1| \\otimes X',
    matrixDisplay: '4x4 Controlled-NOT permutation matrix',
    exampleUsage: 'CX|10⟩ = |11⟩, CX(H|0⟩ ⊗ |0⟩) = (|00⟩ + |11⟩)/√2 (Bell State)',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  CZ: {
    id: 'CZ',
    name: 'Controlled-Z',
    symbol: 'CZ',
    category: 'multi',
    qubits: 1,
    controls: 1,
    isControlled: true,
    description: 'Applies Pauli-Z phase flip to target qubit if control qubit is |1⟩.',
    mathFormula: 'CZ = |0\\rangle\\langle 0| \\otimes I + |1\\rangle\\langle 1| \\otimes Z',
    matrixDisplay: 'diag(1, 1, 1, -1)',
    exampleUsage: 'CZ|11⟩ = -|11⟩',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: -1, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#315B8C]/15',
      border: 'border-[#315B8C]',
      text: 'text-[#315B8C]',
      glow: 'shadow-[#315B8C]/20',
    },
  },

  SWAP: {
    id: 'SWAP',
    name: 'SWAP',
    symbol: '×',
    category: 'multi',
    qubits: 2,
    controls: 0,
    description: 'Swaps the states of two qubits: |ab⟩ → |ba⟩.',
    mathFormula: 'SWAP = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}',
    matrixDisplay: '4x4 SWAP permutation matrix',
    exampleUsage: 'SWAP|10⟩ = |01⟩',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#F2765E]/15',
      border: 'border-[#F2765E]',
      text: 'text-[#F2765E]',
      glow: 'shadow-[#F2765E]/20',
    },
  },

  CCX: {
    id: 'CCX',
    name: 'Toffoli (CCX)',
    symbol: '⊕',
    category: 'multi',
    qubits: 1,
    controls: 2,
    isControlled: true,
    description: 'Controlled-Controlled-NOT gate. Flips target qubit only if BOTH control qubits are |1⟩. Universal for classical reversible computation.',
    mathFormula: 'CCX|110⟩ = |111⟩, CCX|111⟩ = |110⟩',
    matrixDisplay: '8x8 Toffoli permutation matrix',
    exampleUsage: 'CCX(q0, q1, target)',
    matrix: () => [],
    color: {
      bg: 'bg-[#F2765E]/15',
      border: 'border-[#F2765E]',
      text: 'text-[#F2765E]',
      glow: 'shadow-[#F2765E]/20',
    },
  },

  // -------------------------------------------------------------
  // Measurement & Utility
  // -------------------------------------------------------------
  Measure: {
    id: 'Measure',
    name: 'Measurement',
    symbol: 'M',
    category: 'measurement',
    qubits: 1,
    controls: 0,
    description: 'Measures qubit in the computational basis and stores the classical outcome (0 or 1) in a classical bit.',
    mathFormula: 'P(0) = |\\alpha|^2, \\quad P(1) = |\\beta|^2',
    matrixDisplay: 'Projective Collapse Operators: |0⟩⟨0|, |1⟩⟨1|',
    exampleUsage: 'qc.measure(0, 0)',
    matrix: () => [],
    color: {
      bg: 'bg-[#F2765E]/15',
      border: 'border-[#F2765E]',
      text: 'text-[#F2765E]',
      glow: 'shadow-[#F2765E]/20',
    },
  },

  Barrier: {
    id: 'Barrier',
    name: 'Barrier',
    symbol: '‖',
    category: 'utility',
    qubits: 1,
    controls: 0,
    description: 'Visual separation line that prevents circuit compiler optimizations across the barrier.',
    mathFormula: 'I',
    matrixDisplay: 'Identity',
    exampleUsage: 'qc.barrier()',
    matrix: () => [
      [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
      [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
    ],
    color: {
      bg: 'bg-[#EDE0CF]',
      border: 'border-[#413333]/30',
      text: 'text-[#413333]',
      glow: 'shadow-[#413333]/10',
    },
  },
};

export function getGate(id: string): GateDefinition | undefined {
  return GATE_REGISTRY[id];
}

export function getAllGates(): GateDefinition[] {
  return Object.values(GATE_REGISTRY);
}

export function getGatesByCategory(category: GateDefinition['category']): GateDefinition[] {
  return Object.values(GATE_REGISTRY).filter((g) => g.category === category);
}

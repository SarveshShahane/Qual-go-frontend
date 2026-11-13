import type { Circuit } from '../../types/circuit';

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  circuit: Circuit;
}

export const CIRCUIT_TEMPLATES: CircuitTemplate[] = [
  {
    id: 'bell-state',
    name: 'Bell State (|Φ⁺⟩)',
    description: 'Creates a maximally entangled two-qubit EPR pair (|00⟩ + |11⟩)/√2 using Hadamard and CNOT.',
    difficulty: 'Beginner',
    tags: ['Entanglement', 'Foundations', 'Bell State'],
    circuit: {
      name: 'Bell State (|Φ⁺⟩)',
      qubits: 2,
      qubitLabels: ['q0', 'q1'],
      classicalBits: 2,
      classicalBitLabels: ['c0', 'c1'],
      moments: [
        {
          id: 'm0',
          operations: [
            { id: 'op1', gate: 'H', targets: [0] },
          ],
        },
        {
          id: 'm1',
          operations: [
            { id: 'op2', gate: 'CX', targets: [1], controls: [0] },
          ],
        },
        {
          id: 'm2',
          operations: [
            { id: 'op3', gate: 'Measure', targets: [0], metadata: { classicalTarget: 0 } },
            { id: 'op4', gate: 'Measure', targets: [1], metadata: { classicalTarget: 1 } },
          ],
        },
        { id: 'm3', operations: [] },
      ],
    },
  },

  {
    id: 'ghz-state',
    name: 'GHZ State (3-Qubit Entanglement)',
    description: 'Generates the Greenberger-Horne-Zeilinger state (|000⟩ + |111⟩)/√2, demonstrating genuine tripartite entanglement.',
    difficulty: 'Intermediate',
    tags: ['Multi-Qubit', 'Entanglement', 'GHZ'],
    circuit: {
      name: 'GHZ State',
      qubits: 3,
      qubitLabels: ['q0', 'q1', 'q2'],
      classicalBits: 3,
      classicalBitLabels: ['c0', 'c1', 'c2'],
      moments: [
        {
          id: 'm0',
          operations: [
            { id: 'op1', gate: 'H', targets: [0] },
          ],
        },
        {
          id: 'm1',
          operations: [
            { id: 'op2', gate: 'CX', targets: [1], controls: [0] },
          ],
        },
        {
          id: 'm2',
          operations: [
            { id: 'op3', gate: 'CX', targets: [2], controls: [1] },
          ],
        },
        {
          id: 'm3',
          operations: [
            { id: 'op4', gate: 'Measure', targets: [0], metadata: { classicalTarget: 0 } },
            { id: 'op5', gate: 'Measure', targets: [1], metadata: { classicalTarget: 1 } },
            { id: 'op6', gate: 'Measure', targets: [2], metadata: { classicalTarget: 2 } },
          ],
        },
      ],
    },
  },

  {
    id: 'superposition-demo',
    name: 'Superposition & Phase Shift',
    description: 'Explores single-qubit interference using Hadamard and parameterized Z-axis phase rotations.',
    difficulty: 'Beginner',
    tags: ['Superposition', 'Interference', 'Phase'],
    circuit: {
      name: 'Superposition & Phase',
      qubits: 2,
      qubitLabels: ['q0', 'q1'],
      classicalBits: 2,
      classicalBitLabels: ['c0', 'c1'],
      moments: [
        {
          id: 'm0',
          operations: [
            { id: 'op1', gate: 'H', targets: [0] },
            { id: 'op2', gate: 'H', targets: [1] },
          ],
        },
        {
          id: 'm1',
          operations: [
            { id: 'op3', gate: 'Rz', targets: [0], params: [Math.PI / 2], paramExpressions: ['π/2'] },
            { id: 'op4', gate: 'T', targets: [1] },
          ],
        },
        {
          id: 'm2',
          operations: [
            { id: 'op5', gate: 'H', targets: [0] },
            { id: 'op6', gate: 'H', targets: [1] },
          ],
        },
        { id: 'm3', operations: [] },
      ],
    },
  },

  {
    id: 'grover-2qubit',
    name: "Grover's 2-Qubit Search",
    description: "Executes Grover's search algorithm to amplify the target item |11⟩ using an oracle and diffusion operator.",
    difficulty: 'Advanced',
    tags: ['Algorithms', 'Grover', 'Speedup'],
    circuit: {
      name: "Grover's Search (Target |11⟩)",
      qubits: 2,
      qubitLabels: ['q0', 'q1'],
      classicalBits: 2,
      classicalBitLabels: ['c0', 'c1'],
      moments: [
        {
          id: 'm0',
          operations: [
            { id: 'op1', gate: 'H', targets: [0] },
            { id: 'op2', gate: 'H', targets: [1] },
          ],
        },
        // Oracle for |11>: CZ gate
        {
          id: 'm1',
          operations: [
            { id: 'op3', gate: 'CZ', targets: [1], controls: [0] },
          ],
        },
        // Diffusion operator
        {
          id: 'm2',
          operations: [
            { id: 'op4', gate: 'H', targets: [0] },
            { id: 'op5', gate: 'H', targets: [1] },
          ],
        },
        {
          id: 'm3',
          operations: [
            { id: 'op6', gate: 'X', targets: [0] },
            { id: 'op7', gate: 'X', targets: [1] },
          ],
        },
        {
          id: 'm4',
          operations: [
            { id: 'op8', gate: 'CZ', targets: [1], controls: [0] },
          ],
        },
        {
          id: 'm5',
          operations: [
            { id: 'op9', gate: 'X', targets: [0] },
            { id: 'op10', gate: 'X', targets: [1] },
          ],
        },
        {
          id: 'm6',
          operations: [
            { id: 'op11', gate: 'H', targets: [0] },
            { id: 'op12', gate: 'H', targets: [1] },
          ],
        },
        {
          id: 'm7',
          operations: [
            { id: 'op13', gate: 'Measure', targets: [0], metadata: { classicalTarget: 0 } },
            { id: 'op14', gate: 'Measure', targets: [1], metadata: { classicalTarget: 1 } },
          ],
        },
      ],
    },
  },

  {
    id: 'teleportation',
    name: 'Quantum Teleportation Protocol',
    description: 'Teleports the unknown quantum state of q0 to q2 through shared entanglement and classical communication.',
    difficulty: 'Advanced',
    tags: ['Teleportation', 'Protocols', 'Entanglement'],
    circuit: {
      name: 'Quantum Teleportation',
      qubits: 3,
      qubitLabels: ['q0 (source)', 'q1 (EPR)', 'q2 (target)'],
      classicalBits: 2,
      classicalBitLabels: ['c0', 'c1'],
      moments: [
        // Prepare arbitrary state on q0 and Bell pair on q1, q2
        {
          id: 'm0',
          operations: [
            { id: 'op1', gate: 'Ry', targets: [0], params: [Math.PI / 3], paramExpressions: ['π/3'] },
            { id: 'op2', gate: 'H', targets: [1] },
          ],
        },
        {
          id: 'm1',
          operations: [
            { id: 'op3', gate: 'CX', targets: [2], controls: [1] },
          ],
        },
        // Bell measurement of q0 and q1
        {
          id: 'm2',
          operations: [
            { id: 'op4', gate: 'CX', targets: [1], controls: [0] },
          ],
        },
        {
          id: 'm3',
          operations: [
            { id: 'op5', gate: 'H', targets: [0] },
          ],
        },
        {
          id: 'm4',
          operations: [
            { id: 'op6', gate: 'Measure', targets: [0], metadata: { classicalTarget: 0 } },
            { id: 'op7', gate: 'Measure', targets: [1], metadata: { classicalTarget: 1 } },
          ],
        },
      ],
    },
  },
];

export const BELL_STATE_TEMPLATE: Circuit = CIRCUIT_TEMPLATES[0].circuit;
export const GHZ_STATE_TEMPLATE: Circuit = CIRCUIT_TEMPLATES[1].circuit;

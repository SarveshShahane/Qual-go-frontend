import { describe, it, expect } from 'vitest';
import { getGate } from '../gateRegistry';
import { parseAngleExpression, formatAngle, cMagSq } from '../mathUtils';
import { validateCircuit } from '../validator';
import { generateQiskitCode, generateOpenQASM } from '../generator';
import { parseQiskitCode } from '../parser';
import { simulateCircuit } from '../simulator';
import { BELL_STATE_TEMPLATE, GHZ_STATE_TEMPLATE } from '../templates';
import type { Circuit, Moment } from '../../../types/circuit';

function createTestCircuit(qubits: number, moments: Moment[]): Circuit {
  return {
    name: 'Test Circuit',
    qubits,
    qubitLabels: Array.from({ length: qubits }, (_, i) => `q${i}`),
    classicalBits: qubits,
    classicalBitLabels: Array.from({ length: qubits }, (_, i) => `c${i}`),
    moments,
  };
}

describe('Quantum Math Utilities', () => {
  it('parses symbolic and decimal angle expressions correctly', () => {
    expect(parseAngleExpression('0')).toBeCloseTo(0, 5);
    expect(parseAngleExpression('pi')).toBeCloseTo(Math.PI, 5);
    expect(parseAngleExpression('π')).toBeCloseTo(Math.PI, 5);
    expect(parseAngleExpression('pi/2')).toBeCloseTo(Math.PI / 2, 5);
    expect(parseAngleExpression('π/2')).toBeCloseTo(Math.PI / 2, 5);
    expect(parseAngleExpression('3*pi/4')).toBeCloseTo((3 * Math.PI) / 4, 5);
    expect(parseAngleExpression('3π/4')).toBeCloseTo((3 * Math.PI) / 4, 5);
    expect(parseAngleExpression('2*pi')).toBeCloseTo(2 * Math.PI, 5);
    expect(parseAngleExpression('0.785')).toBeCloseTo(0.785, 3);
  });

  it('formats angles to friendly expressions', () => {
    expect(formatAngle(0)).toBe('0');
    expect(formatAngle(Math.PI)).toBe('π');
    expect(formatAngle(Math.PI / 2)).toBe('π/2');
    expect(formatAngle(Math.PI / 4)).toBe('π/4');
    expect(formatAngle(2 * Math.PI)).toBe('2π');
  });

  it('computes squared magnitudes of complex numbers accurately', () => {
    expect(cMagSq({ real: 1 / Math.SQRT2, imag: 0 })).toBeCloseTo(0.5, 5);
    expect(cMagSq({ real: 0, imag: 1 })).toBeCloseTo(1.0, 5);
    expect(cMagSq({ real: 0.5, imag: 0.5 })).toBeCloseTo(0.5, 5);
  });
});

describe('Gate Registry', () => {
  it('has essential single-qubit gates registered', () => {
    const h = getGate('H');
    expect(h).toBeDefined();
    expect(h?.name).toBe('Hadamard');
    expect(h?.qubits).toBe(1);
    expect(h?.category).toBe('single');

    const x = getGate('X');
    expect(x).toBeDefined();
    const xMat = x?.matrix();
    expect(xMat?.[0][1]).toEqual({ real: 1, imag: 0 });
    expect(xMat?.[1][0]).toEqual({ real: 1, imag: 0 });

    const z = getGate('Z');
    expect(z).toBeDefined();
    const zMat = z?.matrix();
    expect(zMat?.[1][1]).toEqual({ real: -1, imag: 0 });
  });

  it('has multi-qubit gates registered with correct target and control counts', () => {
    const cx = getGate('CX');
    expect(cx).toBeDefined();
    expect(cx?.qubits).toBe(1);
    expect(cx?.controls).toBe(1);
    expect(cx?.category).toBe('multi');

    const ccx = getGate('CCX');
    expect(ccx).toBeDefined();
    expect(ccx?.qubits).toBe(1);
    expect(ccx?.controls).toBe(2);

    const swap = getGate('SWAP');
    expect(swap).toBeDefined();
    expect(swap?.qubits).toBe(2);
  });

  it('has parameterized rotation gates with appropriate parameter definitions', () => {
    const rx = getGate('Rx');
    expect(rx).toBeDefined();
    expect(rx?.hasParams).toBe(true);
    expect(rx?.paramNames).toEqual(['θ']);
  });
});

describe('Circuit Validation', () => {
  it('validates a correct circuit with zero errors', () => {
    const errors = validateCircuit(BELL_STATE_TEMPLATE);
    expect(errors).toHaveLength(0);
  });

  it('flags out-of-bounds target qubits', () => {
    const invalidCircuit = createTestCircuit(2, [
      {
        operations: [
          { id: '1', gate: 'H', targets: [5] },
        ],
      },
    ]);
    const errors = validateCircuit(invalidCircuit);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.message.includes('Target qubit q5 is invalid'))).toBe(true);
  });

  it('flags collisions between control and target qubits on multi-qubit gates', () => {
    const collidingCircuit = createTestCircuit(2, [
      {
        operations: [
          { id: '1', gate: 'CX', targets: [0], controls: [0] },
        ],
      },
    ]);
    const errors = validateCircuit(collidingCircuit);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.message.includes('both control and target'))).toBe(true);
  });

  it('flags multiple operations occupying the same wire in the same moment', () => {
    const overlappingCircuit = createTestCircuit(2, [
      {
        operations: [
          { id: '1', gate: 'H', targets: [0] },
          { id: '2', gate: 'X', targets: [0] },
        ],
      },
    ]);
    const errors = validateCircuit(overlappingCircuit);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.message.includes('Conflicting operations'))).toBe(true);
  });
});

describe('Code Generation (IR -> Code)', () => {
  it('generates standard idiomatic Qiskit code from Circuit IR', () => {
    const code = generateQiskitCode(BELL_STATE_TEMPLATE);
    expect(code).toContain('qc = QuantumCircuit(2, 2)');
    expect(code).toContain('qc.h(0)');
    expect(code).toContain('qc.cx(0, 1)');
    expect(code).toContain('qc.measure(0, 0)');
    expect(code).toContain('qc.measure(1, 1)');
  });

  it('generates parameterized gate code in Qiskit', () => {
    const circuit = createTestCircuit(1, [
      {
        operations: [
          { id: '1', gate: 'Rx', targets: [0], params: [Math.PI / 2], paramExpressions: ['π/2'] },
        ],
      },
    ]);
    const code = generateQiskitCode(circuit);
    expect(code).toContain('qc.rx(np.pi/2, 0)');
  });

  it('generates valid OpenQASM 2.0', () => {
    const qasm = generateOpenQASM(BELL_STATE_TEMPLATE);
    expect(qasm).toContain('OPENQASM 2.0;');
    expect(qasm).toContain('qreg q[2];');
    expect(qasm).toContain('creg c[2];');
    expect(qasm).toContain('h q[0];');
    expect(qasm).toContain('cx q[0], q[1];');
    expect(qasm).toContain('measure q[0] -> c[0];');
    expect(qasm).toContain('measure q[1] -> c[1];');
  });
});

describe('Qiskit Parser (Code -> IR)', () => {
  it('parses basic Qiskit code into moments and operations', () => {
    const pythonCode = `
from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)
`;
    const parseResult = parseQiskitCode(pythonCode);
    expect(parseResult.errors).toHaveLength(0);
    expect(parseResult.circuit).toBeDefined();

    const circuit = parseResult.circuit!;
    expect(circuit.qubits).toBe(2);
    expect(circuit.classicalBits).toBe(2);

    const ops = circuit.moments.flatMap((m) => m.operations);
    expect(ops.some((op) => op.gate === 'H' && op.targets[0] === 0)).toBe(true);
    expect(ops.some((op) => op.gate === 'CX' && op.targets[0] === 1 && op.controls?.[0] === 0)).toBe(true);
  });

  it('parses parameterized rotation expressions correctly', () => {
    const pythonCode = `
qc = QuantumCircuit(1)
qc.rx(np.pi / 2, 0)
qc.rz(np.pi, 0)
`;
    const parseResult = parseQiskitCode(pythonCode);
    expect(parseResult.errors).toHaveLength(0);
    const ops = parseResult.circuit!.moments.flatMap((m) => m.operations);
    expect(ops[0].gate).toBe('Rx');
    expect(ops[0].params?.[0]).toBeCloseTo(Math.PI / 2, 4);
    expect(ops[1].gate).toBe('Rz');
    expect(ops[1].params?.[0]).toBeCloseTo(Math.PI, 4);
  });

  it('gracefully reports invalid lines without crashing', () => {
    const badCode = `
qc = QuantumCircuit(2)
qc.invalid_gate(0)
qc.cx(0, 5) # out of range qubit
`;
    const parseResult = parseQiskitCode(badCode);
    expect(parseResult.errors.length).toBeGreaterThan(0);
    expect(parseResult.errors.some((e) => e.message.includes('Unsupported instruction'))).toBe(true);
    expect(parseResult.errors.some((e) => e.message.includes('out of bounds'))).toBe(true);
  });
});

describe('Bidirectional Round-Trip Synchronization', () => {
  it('preserves circuit semantics through IR -> Code -> IR cycle', () => {
    const initialCircuit = BELL_STATE_TEMPLATE;
    const generatedCode = generateQiskitCode(initialCircuit);
    const parsed = parseQiskitCode(generatedCode);

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.circuit).toBeDefined();

    const reCircuit = parsed.circuit!;
    expect(reCircuit.qubits).toBe(initialCircuit.qubits);

    const initialGates = initialCircuit.moments.flatMap((m) => m.operations.map((o) => o.gate));
    const parsedGates = reCircuit.moments.flatMap((m) => m.operations.map((o) => o.gate));
    expect(parsedGates).toEqual(initialGates);
  });
});

describe('Quantum Statevector Simulator', () => {
  it('evolves single-qubit |0> through Hadamard to equal superposition', async () => {
    const circuit = createTestCircuit(1, [
      { operations: [{ id: '1', gate: 'H', targets: [0] }] },
    ]);

    const result = await simulateCircuit(circuit, 1024);
    expect(result.probabilities['0']).toBeCloseTo(0.5, 4);
    expect(result.probabilities['1']).toBeCloseTo(0.5, 4);
    expect(result.shots).toBe(1024);

    const totalCounts = (result.counts['0'] || 0) + (result.counts['1'] || 0);
    expect(totalCounts).toBe(1024);
  });

  it('correctly flips |0> to |1> with Pauli-X gate', async () => {
    const circuit = createTestCircuit(1, [
      { operations: [{ id: '1', gate: 'X', targets: [0] }] },
    ]);

    const result = await simulateCircuit(circuit, 100);
    expect(result.probabilities['0']).toBeCloseTo(0.0, 5);
    expect(result.probabilities['1']).toBeCloseTo(1.0, 5);
    expect(result.counts['1']).toBe(100);
  });

  it('correctly creates Bell State |Phi+> with 50% |00> and 50% |11>', async () => {
    const result = await simulateCircuit(BELL_STATE_TEMPLATE, 2048);

    expect(result.probabilities['00']).toBeCloseTo(0.5, 4);
    expect(result.probabilities['11']).toBeCloseTo(0.5, 4);
    expect(result.probabilities['01'] || 0).toBeCloseTo(0.0, 5);
    expect(result.probabilities['10'] || 0).toBeCloseTo(0.0, 5);

    const c00 = result.counts['00'] || 0;
    const c11 = result.counts['11'] || 0;
    expect(c00 + c11).toBe(2048);
    expect(c00).toBeGreaterThan(800);
    expect(c11).toBeGreaterThan(800);
  });

  it('simulates 3-qubit GHZ state correctly', async () => {
    const result = await simulateCircuit(GHZ_STATE_TEMPLATE, 1000);

    expect(result.probabilities['000']).toBeCloseTo(0.5, 4);
    expect(result.probabilities['111']).toBeCloseTo(0.5, 4);
    expect(result.probabilities['001'] || 0).toBeCloseTo(0.0, 5);
    expect(result.probabilities['010'] || 0).toBeCloseTo(0.0, 5);
  });

  it('simulates parameterized Rx(pi) gate flipping |0> to -i|1>', async () => {
    const circuit = createTestCircuit(1, [
      {
        operations: [{ id: '1', gate: 'Rx', targets: [0], params: [Math.PI] }],
      },
    ]);

    const result = await simulateCircuit(circuit, 500);
    expect(result.probabilities['1']).toBeCloseTo(1.0, 4);
    expect(result.probabilities['0']).toBeCloseTo(0.0, 4);
    expect(result.counts['1']).toBe(500);
  });

  it('simulates SWAP gate swapping states of two qubits', async () => {
    const circuit = createTestCircuit(2, [
      { operations: [{ id: '1', gate: 'X', targets: [0] }] },
      { operations: [{ id: '2', gate: 'SWAP', targets: [0, 1] }] },
    ]);

    const result = await simulateCircuit(circuit, 200);
    expect(result.probabilities['10']).toBeCloseTo(1.0, 4);
    expect(result.probabilities['01'] || 0).toBeCloseTo(0.0, 4);
    expect(result.counts['10']).toBe(200);
  });

  it('simulates CCX (Toffoli) gate requiring both controls active', async () => {
    const circuit = createTestCircuit(3, [
      {
        operations: [
          { id: '1', gate: 'X', targets: [0] },
          { id: '2', gate: 'X', targets: [1] },
        ],
      },
      {
        operations: [
          { id: '3', gate: 'CCX', targets: [2], controls: [0, 1] },
        ],
      },
    ]);

    const result = await simulateCircuit(circuit, 100);
    expect(result.probabilities['111']).toBeCloseTo(1.0, 4);
    expect(result.counts['111']).toBe(100);
  });

  it('simulates Pauli-Z phase flip transforming |+> into |->', async () => {
    const circuit = createTestCircuit(1, [
      { operations: [{ id: '1', gate: 'H', targets: [0] }] },
      { operations: [{ id: '2', gate: 'Z', targets: [0] }] },
      { operations: [{ id: '3', gate: 'H', targets: [0] }] },
    ]);

    const result = await simulateCircuit(circuit, 200);
    expect(result.probabilities['1']).toBeCloseTo(1.0, 4);
    expect(result.probabilities['0'] || 0).toBeCloseTo(0.0, 4);
  });
});

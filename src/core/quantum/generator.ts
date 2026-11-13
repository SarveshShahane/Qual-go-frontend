import type { Circuit } from '../../types/circuit';
import { formatAngle } from './mathUtils';

/**
 * Generates clean, idiomatic Qiskit Python code from the canonical Circuit IR.
 */
export function generateQiskitCode(circuit: Circuit): string {
  const lines: string[] = [];
  lines.push('from qiskit import QuantumCircuit');
  lines.push('import numpy as np');
  lines.push('');

  const numQubits = Math.max(1, circuit.qubits);
  const numClbits = circuit.classicalBits || 0;

  if (numClbits > 0) {
    lines.push(`qc = QuantumCircuit(${numQubits}, ${numClbits})`);
  } else {
    lines.push(`qc = QuantumCircuit(${numQubits})`);
  }
  lines.push('');

  let opCount = 0;

  for (let mIdx = 0; mIdx < circuit.moments.length; mIdx++) {
    const moment = circuit.moments[mIdx];
    if (moment.operations.length === 0) continue;

    for (const op of moment.operations) {
      opCount++;
      const gate = op.gate.toUpperCase();
      const target = op.targets[0] ?? 0;

      switch (gate) {
        case 'H':
          lines.push(`qc.h(${target})`);
          break;
        case 'X':
          lines.push(`qc.x(${target})`);
          break;
        case 'Y':
          lines.push(`qc.y(${target})`);
          break;
        case 'Z':
          lines.push(`qc.z(${target})`);
          break;
        case 'S':
          lines.push(`qc.s(${target})`);
          break;
        case 'T':
          lines.push(`qc.t(${target})`);
          break;
        case 'SX':
          lines.push(`qc.sx(${target})`);
          break;
        case 'RX': {
          const expr = op.paramExpressions?.[0] || (op.params?.[0] !== undefined ? formatAngle(op.params[0]).replace('π', 'np.pi') : 'np.pi/2');
          lines.push(`qc.rx(${expr.replace('π', 'np.pi')}, ${target})`);
          break;
        }
        case 'RY': {
          const expr = op.paramExpressions?.[0] || (op.params?.[0] !== undefined ? formatAngle(op.params[0]).replace('π', 'np.pi') : 'np.pi/2');
          lines.push(`qc.ry(${expr.replace('π', 'np.pi')}, ${target})`);
          break;
        }
        case 'RZ': {
          const expr = op.paramExpressions?.[0] || (op.params?.[0] !== undefined ? formatAngle(op.params[0]).replace('π', 'np.pi') : 'np.pi/2');
          lines.push(`qc.rz(${expr.replace('π', 'np.pi')}, ${target})`);
          break;
        }
        case 'CX': {
          const ctrl = op.controls?.[0] ?? 0;
          lines.push(`qc.cx(${ctrl}, ${target})`);
          break;
        }
        case 'CZ': {
          const ctrl = op.controls?.[0] ?? 0;
          lines.push(`qc.cz(${ctrl}, ${target})`);
          break;
        }
        case 'SWAP': {
          const q0 = op.targets[0] ?? 0;
          const q1 = op.targets[1] ?? 1;
          lines.push(`qc.swap(${q0}, ${q1})`);
          break;
        }
        case 'CCX': {
          const ctrl1 = op.controls?.[0] ?? 0;
          const ctrl2 = op.controls?.[1] ?? 1;
          lines.push(`qc.ccx(${ctrl1}, ${ctrl2}, ${target})`);
          break;
        }
        case 'MEASURE': {
          const cBit = op.metadata?.classicalTarget !== undefined ? op.metadata.classicalTarget : target;
          lines.push(`qc.measure(${target}, ${cBit})`);
          break;
        }
        case 'BARRIER':
          lines.push('qc.barrier()');
          break;
        default:
          lines.push(`# unsupported gate: ${op.gate}`);
          break;
      }
    }
  }

  if (opCount === 0) {
    lines.push('# Empty circuit: drag gates onto wires or add instructions here');
  }

  lines.push('');
  lines.push('# Draw circuit');
  lines.push('print(qc.draw(output="text"))');

  return lines.join('\n');
}

/**
 * Generates OpenQASM 2.0 representation of the circuit
 */
export function generateOpenQasm(circuit: Circuit): string {
  const lines: string[] = [];
  lines.push('OPENQASM 2.0;');
  lines.push('include "qelib1.inc";');
  lines.push('');
  lines.push(`qreg q[${circuit.qubits}];`);
  if (circuit.classicalBits > 0) {
    lines.push(`creg c[${circuit.classicalBits}];`);
  }
  lines.push('');

  for (const moment of circuit.moments) {
    for (const op of moment.operations) {
      const g = op.gate.toUpperCase();
      const t = op.targets[0];
      switch (g) {
        case 'H': lines.push(`h q[${t}];`); break;
        case 'X': lines.push(`x q[${t}];`); break;
        case 'Y': lines.push(`y q[${t}];`); break;
        case 'Z': lines.push(`z q[${t}];`); break;
        case 'S': lines.push(`s q[${t}];`); break;
        case 'T': lines.push(`t q[${t}];`); break;
        case 'SX': lines.push(`sx q[${t}];`); break;
        case 'RX': lines.push(`rx(${op.params?.[0] ?? Math.PI / 2}) q[${t}];`); break;
        case 'RY': lines.push(`ry(${op.params?.[0] ?? Math.PI / 2}) q[${t}];`); break;
        case 'RZ': lines.push(`rz(${op.params?.[0] ?? Math.PI / 2}) q[${t}];`); break;
        case 'CX': lines.push(`cx q[${op.controls?.[0] ?? 0}], q[${t}];`); break;
        case 'CZ': lines.push(`cz q[${op.controls?.[0] ?? 0}], q[${t}];`); break;
        case 'SWAP': lines.push(`swap q[${op.targets[0]}], q[${op.targets[1]}];`); break;
        case 'CCX': lines.push(`ccx q[${op.controls?.[0]}], q[${op.controls?.[1]}], q[${t}];`); break;
        case 'MEASURE': {
          const cBit = op.metadata?.classicalTarget ?? t;
          lines.push(`measure q[${t}] -> c[${cBit}];`);
          break;
        }
        case 'BARRIER': lines.push('barrier q;'); break;
      }
    }
  }

  return lines.join('\n');
}

export const generateOpenQASM = generateOpenQasm;

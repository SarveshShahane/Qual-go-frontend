import type { Circuit, CircuitValidationError } from '../../types/circuit';
import { getGate } from './gateRegistry';

export function validateCircuit(circuit: Circuit): CircuitValidationError[] {
  const errors: CircuitValidationError[] = [];
  const numQubits = circuit.qubits;

  if (numQubits < 1) {
    errors.push({
      momentIndex: 0,
      message: 'Circuit must have at least 1 qubit.',
      severity: 'error',
    });
    return errors;
  }

  for (let mIdx = 0; mIdx < circuit.moments.length; mIdx++) {
    const moment = circuit.moments[mIdx];
    const occupiedQubits = new Set<number>();

    for (const op of moment.operations) {
      const gateDef = getGate(op.gate);
      if (!gateDef) {
        errors.push({
          momentIndex: mIdx,
          operationId: op.id,
          message: `Unknown gate "${op.gate}" at column ${mIdx + 1}.`,
          severity: 'error',
        });
        continue;
      }

      // Check targets
      for (const t of op.targets) {
        if (t < 0 || t >= numQubits) {
          errors.push({
            momentIndex: mIdx,
            operationId: op.id,
            message: `Target qubit q${t} is invalid. Circuit has ${numQubits} qubits.`,
            severity: 'error',
          });
        }
        if (occupiedQubits.has(t)) {
          errors.push({
            momentIndex: mIdx,
            operationId: op.id,
            message: `Conflicting operations on qubit q${t} at column ${mIdx + 1}.`,
            severity: 'error',
          });
        }
        occupiedQubits.add(t);
      }

      // Check controls
      if (op.controls) {
        for (const c of op.controls) {
          if (c < 0 || c >= numQubits) {
            errors.push({
              momentIndex: mIdx,
              operationId: op.id,
              message: `Control qubit q${c} is invalid. Circuit has ${numQubits} qubits.`,
              severity: 'error',
            });
          }
          if (op.targets.includes(c)) {
            errors.push({
              momentIndex: mIdx,
              operationId: op.id,
              message: `Gate ${op.gate} has qubit q${c} as both control and target.`,
              severity: 'error',
            });
          }
          if (occupiedQubits.has(c)) {
            errors.push({
              momentIndex: mIdx,
              operationId: op.id,
              message: `Control wire on qubit q${c} conflicts with another operation in column ${mIdx + 1}.`,
              severity: 'error',
            });
          }
          occupiedQubits.add(c);
        }
      }

      // Check parameters
      if (gateDef.hasParams && op.params) {
        for (let pIdx = 0; pIdx < op.params.length; pIdx++) {
          const val = op.params[pIdx];
          if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
            errors.push({
              momentIndex: mIdx,
              operationId: op.id,
              message: `Invalid parameter for gate ${op.gate} at column ${mIdx + 1}.`,
              severity: 'error',
            });
          }
        }
      }
    }
  }

  return errors;
}

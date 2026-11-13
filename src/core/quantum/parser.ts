import type { Circuit, Moment, Operation } from '../../types/circuit';
import { parseAngleExpression, formatAngle } from './mathUtils';

export interface ParseResult {
  success: boolean;
  circuit?: Circuit;
  errors: { line: number; message: string }[];
}

/**
 * Parses Python Qiskit-style code into Canonical Circuit IR.
 * Schedules operations into moments without overlapping wires.
 */
export function parseQiskitCode(code: string): ParseResult {
  const errors: { line: number; message: string }[] = [];
  const lines = code.split('\n');

  let numQubits = 2;
  let numClbits = 2;

  const rawOperations: {
    line: number;
    gate: string;
    targets: number[];
    controls?: number[];
    params?: number[];
    paramExpressions?: string[];
    metadata?: Record<string, unknown>;
  }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    let line = lines[i].trim();

    // Strip comments
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx).trim();
    }

    if (!line) continue;
    if (line.startsWith('from') || line.startsWith('import') || line.startsWith('print')) continue;

    // 1. QuantumCircuit instantiation: qc = QuantumCircuit(qubits, [clbits])
    const qcMatch = line.match(/(?:\w+\s*=\s*)?QuantumCircuit\s*\(\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/);
    if (qcMatch) {
      numQubits = parseInt(qcMatch[1], 10);
      numClbits = qcMatch[2] ? parseInt(qcMatch[2], 10) : numQubits;
      continue;
    }

    // 2. Measure all: qc.measure_all()
    if (/^\w+\.measure_all\s*\(\s*\)/.test(line)) {
      for (let q = 0; q < numQubits; q++) {
        rawOperations.push({
          line: lineNum,
          gate: 'Measure',
          targets: [q],
          metadata: { classicalTarget: q },
        });
      }
      continue;
    }

    // 3. Barrier: qc.barrier()
    if (/^\w+\.barrier\s*\(/.test(line)) {
      rawOperations.push({
        line: lineNum,
        gate: 'Barrier',
        targets: [0],
      });
      continue;
    }

    // 4. Single qubit non-parameterized gates: qc.h(0), qc.x(1), qc.y(0), qc.z(0), qc.s(0), qc.t(0), qc.sx(0)
    const singleGateMatch = line.match(/^\w+\.(h|x|y|z|s|t|sx)\s*\(\s*(\d+)\s*\)/i);
    if (singleGateMatch) {
      const gateName = singleGateMatch[1].toUpperCase();
      const target = parseInt(singleGateMatch[2], 10);
      rawOperations.push({
        line: lineNum,
        gate: gateName,
        targets: [target],
      });
      continue;
    }

    // 5. Parameterized gates: qc.rx(theta, q), qc.ry(theta, q), qc.rz(theta, q)
    const paramGateMatch = line.match(/^\w+\.(rx|ry|rz)\s*\(\s*(.+?)\s*,\s*(\d+)\s*\)/i);
    if (paramGateMatch) {
      const gateName = paramGateMatch[1].toUpperCase();
      const expr = paramGateMatch[2].trim().replace(/np\./g, '');
      const target = parseInt(paramGateMatch[3], 10);
      const angleRad = parseAngleExpression(expr);

      rawOperations.push({
        line: lineNum,
        gate: gateName === 'RX' ? 'Rx' : gateName === 'RY' ? 'Ry' : 'Rz',
        targets: [target],
        params: [angleRad],
        paramExpressions: [formatAngle(angleRad)],
      });
      continue;
    }

    // 6. Two-qubit controlled gates: qc.cx(c, t), qc.cz(c, t), qc.swap(q0, q1)
    const twoQubitMatch = line.match(/^\w+\.(cx|cz|swap)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (twoQubitMatch) {
      const gateName = twoQubitMatch[1].toUpperCase();
      const qA = parseInt(twoQubitMatch[2], 10);
      const qB = parseInt(twoQubitMatch[3], 10);

      if (qA === qB) {
        errors.push({
          line: lineNum,
          message: `Control and target qubit cannot be the same wire (qubit ${qA}).`,
        });
        continue;
      }

      if (gateName === 'SWAP') {
        rawOperations.push({
          line: lineNum,
          gate: 'SWAP',
          targets: [qA, qB],
        });
      } else {
        rawOperations.push({
          line: lineNum,
          gate: gateName,
          targets: [qB],
          controls: [qA],
        });
      }
      continue;
    }

    // 7. Three-qubit gate: qc.ccx(c1, c2, t)
    const ccxMatch = line.match(/^\w+\.ccx\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (ccxMatch) {
      const c1 = parseInt(ccxMatch[1], 10);
      const c2 = parseInt(ccxMatch[2], 10);
      const target = parseInt(ccxMatch[3], 10);

      if (c1 === c2 || c1 === target || c2 === target) {
        errors.push({
          line: lineNum,
          message: 'CCX control and target qubits must all be distinct wires.',
        });
        continue;
      }

      rawOperations.push({
        line: lineNum,
        gate: 'CCX',
        targets: [target],
        controls: [c1, c2],
      });
      continue;
    }

    // 8. Explicit measurement: qc.measure(q, c)
    const measureMatch = line.match(/^\w+\.measure\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (measureMatch) {
      const q = parseInt(measureMatch[1], 10);
      const c = parseInt(measureMatch[2], 10);
      rawOperations.push({
        line: lineNum,
        gate: 'Measure',
        targets: [q],
        metadata: { classicalTarget: c },
      });
      continue;
    }

    // Unrecognized line that looks like an operation
    if (/^\w+\.\w+/.test(line)) {
      errors.push({
        line: lineNum,
        message: `Unsupported instruction or syntax: "${line}"`,
      });
    }
  }

  // Validate qubit bounds
  for (const op of rawOperations) {
    for (const t of op.targets) {
      if (t >= numQubits) {
        errors.push({
          line: op.line,
          message: `Target qubit q${t} is out of bounds for a ${numQubits}-qubit circuit.`,
        });
      }
    }
    if (op.controls) {
      for (const c of op.controls) {
        if (c >= numQubits) {
          errors.push({
            line: op.line,
            message: `Control qubit q${c} is out of bounds for a ${numQubits}-qubit circuit.`,
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // Greedy moment packing: Place operations in the earliest available moment respecting causal order
  const moments: Moment[] = [];
  const qubitLastMoment: Record<number, number> = {};

  for (let i = 0; i < rawOperations.length; i++) {
    const rawOp = rawOperations[i];
    const opQubits = new Set<number>([
      ...rawOp.targets,
      ...(rawOp.controls || []),
    ]);

    // An operation on qubit q cannot appear before an earlier operation on qubit q
    let minStartMoment = 0;
    for (const q of opQubits) {
      if (qubitLastMoment[q] !== undefined) {
        minStartMoment = Math.max(minStartMoment, qubitLastMoment[q] + 1);
      }
    }

    // Find the first moment >= minStartMoment where none of opQubits are already occupied
    let placedMomentIdx = -1;
    for (let m = minStartMoment; m < moments.length; m++) {
      const moment = moments[m];
      let conflict = false;

      for (const existingOp of moment.operations) {
        const existingQubits = [
          ...existingOp.targets,
          ...(existingOp.controls || []),
        ];
        for (const q of existingQubits) {
          if (opQubits.has(q)) {
            conflict = true;
            break;
          }
        }
        if (conflict) break;
      }

      if (!conflict) {
        placedMomentIdx = m;
        break;
      }
    }

    const op: Operation = {
      id: `op_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      gate: rawOp.gate,
      targets: rawOp.targets,
      controls: rawOp.controls,
      params: rawOp.params,
      paramExpressions: rawOp.paramExpressions,
      metadata: rawOp.metadata,
    };

    if (placedMomentIdx !== -1) {
      moments[placedMomentIdx].operations.push(op);
      for (const q of opQubits) {
        qubitLastMoment[q] = placedMomentIdx;
      }
    } else {
      while (moments.length < minStartMoment) {
        moments.push({
          id: `moment_${moments.length}_${Date.now()}`,
          operations: [],
        });
      }
      const newMomentIdx = moments.length;
      moments.push({
        id: `moment_${newMomentIdx}_${Date.now()}`,
        operations: [op],
      });
      for (const q of opQubits) {
        qubitLastMoment[q] = newMomentIdx;
      }
    }
  }

  // Ensure at least 4 empty moments for friendly canvas view
  while (moments.length < 5) {
    moments.push({
      id: `moment_${moments.length}_${Date.now()}`,
      operations: [],
    });
  }

  const qubitLabels = Array.from({ length: numQubits }, (_, idx) => `q${idx}`);
  const classicalBitLabels = Array.from({ length: numClbits }, (_, idx) => `c${idx}`);

  const circuit: Circuit = {
    name: 'Quantum Circuit',
    qubits: numQubits,
    qubitLabels,
    classicalBits: numClbits,
    classicalBitLabels,
    moments,
  };

  return { success: true, circuit, errors: [] };
}

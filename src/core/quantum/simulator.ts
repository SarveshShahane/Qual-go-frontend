import type { Circuit, Complex, SimulationResult } from '../../types/circuit';
import { getGate } from './gateRegistry';
import { cMag, cPhase, toBitstring } from './mathUtils';

export class QuantumSimulator {
  /**
   * Executes client-side statevector simulation and shot sampling.
   * Handles arbitrary single-qubit, controlled, and multi-qubit gates up to 10 qubits.
   */
  public async simulate(circuit: Circuit, shots: number = 1024): Promise<SimulationResult> {
    const startTime = performance.now();
    const numQubits = Math.max(1, Math.min(10, circuit.qubits));
    const dim = 1 << numQubits; // 2^n

    // Initialize statevector to |00...0>
    const real = new Float64Array(dim);
    const imag = new Float64Array(dim);
    real[0] = 1.0;

    // Run circuit through moments
    for (const moment of circuit.moments) {
      for (const op of moment.operations) {
        if (op.gate === 'Barrier') continue;

        if (op.gate === 'Measure') {
          // In statevector simulation, measurement defines the readout basis;
          // preserve coherent state amplitudes for visualization & shot sampling
          continue;
        }

        // Apply Unitary Gate
        this.applyOperation(real, imag, op, numQubits);
      }
    }

    // Compute exact probabilities
    const probabilities: Record<string, number> = {};
    const statevectorList: SimulationResult['statevector'] = [];

    for (let i = 0; i < dim; i++) {
      const bitstr = toBitstring(i, numQubits);
      const prob = real[i] * real[i] + imag[i] * imag[i];
      probabilities[bitstr] = prob;

      const comp: Complex = { real: real[i], imag: imag[i] };
      const mag = cMag(comp);
      const phaseRad = cPhase(comp);
      const phaseDeg = (phaseRad * 180) / Math.PI;

      statevectorList.push({
        basisState: `|${bitstr}⟩`,
        index: i,
        real: real[i],
        imag: imag[i],
        magnitude: mag,
        probability: prob,
        phaseRadians: phaseRad,
        phaseDegrees: phaseDeg < 0 ? phaseDeg + 360 : phaseDeg,
      });
    }

    // Stochastic shot sampling based on exact probabilities
    const counts: Record<string, number> = {};
    for (const bitstr of Object.keys(probabilities)) {
      counts[bitstr] = 0;
    }

    // Cumulative distribution for fast sampling
    const cdf = new Float64Array(dim);
    let accum = 0;
    for (let i = 0; i < dim; i++) {
      accum += real[i] * real[i] + imag[i] * imag[i];
      cdf[i] = accum;
    }

    // Sample N shots
    for (let s = 0; s < shots; s++) {
      const r = Math.random() * accum;
      // Binary search on CDF
      let low = 0;
      let high = dim - 1;
      let sampledIdx = 0;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (cdf[mid] >= r) {
          sampledIdx = mid;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
      const bitstr = toBitstring(sampledIdx, numQubits);
      counts[bitstr] = (counts[bitstr] || 0) + 1;
    }

    const executionTimeMs = performance.now() - startTime;

    return {
      statevector: statevectorList,
      probabilities,
      counts,
      shots,
      qubits: numQubits,
      executionTimeMs,
    };
  }

  /**
   * In-place application of arbitrary single or multi-controlled unitary operation
   */
  private applyOperation(
    real: Float64Array,
    imag: Float64Array,
    op: { gate: string; targets: number[]; controls?: number[]; params?: number[] },
    numQubits: number
  ): void {
    const gateDef = getGate(op.gate);
    if (!gateDef) return;

    if (op.gate === 'SWAP') {
      const q0 = op.targets[0];
      const q1 = op.targets[1];
      if (q0 === undefined || q1 === undefined || q0 >= numQubits || q1 >= numQubits) return;
      this.applySwap(real, imag, q0, q1, numQubits, op.controls || []);
      return;
    }

    // Resolve 2x2 target unitary matrix (extract for controlled gates)
    let uMatrix = gateDef.matrix(op.params);
    if (op.gate === 'CX' || op.gate === 'CCX') {
      const xDef = getGate('X');
      uMatrix = xDef ? xDef.matrix() : uMatrix;
    } else if (op.gate === 'CZ') {
      const zDef = getGate('Z');
      uMatrix = zDef ? zDef.matrix() : uMatrix;
    }

    if (!uMatrix || uMatrix.length !== 2) return;

    const u00 = uMatrix[0][0];
    const u01 = uMatrix[0][1];
    const u10 = uMatrix[1][0];
    const u11 = uMatrix[1][1];

    const target = op.targets[0];
    if (target === undefined || target >= numQubits) return;

    const controls = op.controls || [];
    const targetMask = 1 << target;

    // Bitmask requirement for all control qubits to be 1
    let controlMask = 0;
    for (const c of controls) {
      if (c < numQubits) {
        controlMask |= 1 << c;
      }
    }

    const dim = 1 << numQubits;

    // Iterate over all index pairs differing at target bit
    for (let i = 0; i < dim; i++) {
      // Check if target bit is 0
      if ((i & targetMask) === 0) {
        const j = i | targetMask;

        // Check if all control bits are active
        if ((i & controlMask) === controlMask) {
          const r0 = real[i];
          const i0 = imag[i];
          const r1 = real[j];
          const i1 = imag[j];

          // New v0 = u00*v0 + u01*v1
          real[i] = (u00.real * r0 - u00.imag * i0) + (u01.real * r1 - u01.imag * i1);
          imag[i] = (u00.real * i0 + u00.imag * r0) + (u01.real * i1 + u01.imag * r1);

          // New v1 = u10*v0 + u11*v1
          real[j] = (u10.real * r0 - u10.imag * i0) + (u11.real * r1 - u11.imag * i1);
          imag[j] = (u10.real * i0 + u10.imag * r0) + (u11.real * i1 + u11.imag * r1);
        }
      }
    }
  }

  private applySwap(
    real: Float64Array,
    imag: Float64Array,
    q0: number,
    q1: number,
    numQubits: number,
    controls: number[]
  ): void {
    const mask0 = 1 << q0;
    const mask1 = 1 << q1;
    let controlMask = 0;
    for (const c of controls) {
      if (c < numQubits) controlMask |= 1 << c;
    }

    const dim = 1 << numQubits;
    for (let i = 0; i < dim; i++) {
      const bit0 = (i & mask0) !== 0 ? 1 : 0;
      const bit1 = (i & mask1) !== 0 ? 1 : 0;

      // Only swap if bits differ and i < j to avoid double-swap
      if (bit0 === 0 && bit1 === 1) {
        const j = (i ^ mask0) ^ mask1;
        if ((i & controlMask) === controlMask) {
          const tempR = real[i];
          const tempI = imag[i];
          real[i] = real[j];
          imag[i] = imag[j];
          real[j] = tempR;
          imag[j] = tempI;
        }
      }
    }
  }
}

export const quantumSimulator = new QuantumSimulator();

export async function simulateCircuit(circuit: Circuit, shots: number = 1024): Promise<SimulationResult> {
  return quantumSimulator.simulate(circuit, shots);
}

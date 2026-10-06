/**
 * Polynomial least-squares regression trained with full-batch Adam.
 * The curve on the Origin sheet is this model actually learning — the loss
 * readout is its real mean squared error, not an animation.
 */
export class PolyRegressor {
  readonly degree: number;
  readonly w: Float64Array;
  private readonly m: Float64Array;
  private readonly v: Float64Array;
  private readonly g: Float64Array;
  private t = 0;

  constructor(degree: number) {
    const size = degree + 1;
    this.degree = degree;
    this.w = new Float64Array(size);
    this.m = new Float64Array(size);
    this.v = new Float64Array(size);
    this.g = new Float64Array(size);
  }

  predict(u: number): number {
    let y = 0;
    let p = 1;
    for (let k = 0; k <= this.degree; k++) {
      y += this.w[k] * p;
      p *= u;
    }
    return y;
  }

  /** One Adam step over all points. Returns the MSE measured before the update. */
  step(us: Float64Array, vs: Float64Array, n: number, lr: number): number {
    if (n === 0) return 0;
    const { degree, w, m, v, g } = this;
    g.fill(0);
    let loss = 0;
    for (let i = 0; i < n; i++) {
      const u = us[i];
      const r = this.predict(u) - vs[i];
      loss += r * r;
      let p = 1;
      for (let k = 0; k <= degree; k++) {
        g[k] += r * p;
        p *= u;
      }
    }

    const b1 = 0.9;
    const b2 = 0.999;
    this.t++;
    const c1 = 1 - b1 ** this.t;
    const c2 = 1 - b2 ** this.t;
    for (let k = 0; k <= degree; k++) {
      const gk = (2 / n) * g[k];
      m[k] = b1 * m[k] + (1 - b1) * gk;
      v[k] = b2 * v[k] + (1 - b2) * gk * gk;
      w[k] -= (lr * (m[k] / c1)) / (Math.sqrt(v[k] / c2) + 1e-8);
    }
    return loss / n;
  }
}

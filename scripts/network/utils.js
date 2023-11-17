export function sigmoid(x) {
    return 1 / (1 + Math.pow(Math.E, -x));
}

export function sigmoidDerivative(x) {
    if (Math.abs(x - 1) < 1e-9 || Math.abs(x) < 1e-9) return 0.0;
    return x * (1.0 - x);
}
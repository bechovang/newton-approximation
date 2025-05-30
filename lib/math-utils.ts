// Math evaluation function with proper Ans handling
export function evaluateExpression(expr: string, ansValue: number): number {
  try {
    let processedExpr = expr.replace(/Ans/g, `(${ansValue})`)
    processedExpr = processedExpr.replace(/\^/g, "**")
    processedExpr = processedExpr.replace(/÷/g, "/")
    processedExpr = processedExpr.replace(/×/g, "*")
    processedExpr = processedExpr.replace(/sqrt\(/g, "Math.sqrt(")
    processedExpr = processedExpr.replace(/log\(/g, "Math.log10(")
    processedExpr = processedExpr.replace(/ln\(/g, "Math.log(")
    processedExpr = processedExpr.replace(/sin\(/g, "Math.sin(")
    processedExpr = processedExpr.replace(/cos\(/g, "Math.cos(")
    processedExpr = processedExpr.replace(/tan\(/g, "Math.tan(")
    processedExpr = processedExpr.replace(/exp\(/g, "Math.exp(")

    const result = Function('"use strict"; return (' + processedExpr + ")")()
    return typeof result === "number" && !isNaN(result) && isFinite(result) ? result : 0
  } catch {
    return 0
  }
}

// Function to evaluate mathematical expressions for graphing
export function evaluateFunction(expr: string, x: number): number {
  try {
    let processedExpr = expr.replace(/x/g, `(${x})`)
    processedExpr = processedExpr.replace(/\^/g, "**")
    processedExpr = processedExpr.replace(/sqrt\(/g, "Math.sqrt(")
    processedExpr = processedExpr.replace(/log\(/g, "Math.log10(")
    processedExpr = processedExpr.replace(/ln\(/g, "Math.log(")
    processedExpr = processedExpr.replace(/sin\(/g, "Math.sin(")
    processedExpr = processedExpr.replace(/cos\(/g, "Math.cos(")
    processedExpr = processedExpr.replace(/tan\(/g, "Math.tan(")
    processedExpr = processedExpr.replace(/exp\(/g, "Math.exp(")

    const result = Function('"use strict"; return (' + processedExpr + ")")()
    return typeof result === "number" && !isNaN(result) && isFinite(result) ? result : 0
  } catch {
    return 0
  }
}

// Derivative calculation (numerical)
export function calculateDerivative(expr: string, x: number, h = 0.0001): number {
  const f1 = evaluateFunction(expr, x + h)
  const f2 = evaluateFunction(expr, x - h)
  return (f1 - f2) / (2 * h)
} 
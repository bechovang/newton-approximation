"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Lightbulb,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

// Math evaluation function with proper Ans handling
function evaluateExpression(expr: string, ansValue: number): number {
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
function evaluateFunction(expr: string, x: number): number {
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
function calculateDerivative(expr: string, x: number, h = 0.0001): number {
  const f1 = evaluateFunction(expr, x + h)
  const f2 = evaluateFunction(expr, x - h)
  return (f1 - f2) / (2 * h)
}

// Fireworks component
function Fireworks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-75"></div>
        </div>
      ))}
    </div>
  )
}

// Newton Animation Canvas Component with Zoom and Pan
function NewtonCanvas({
  equation,
  initialX,
  steps,
  currentStep,
  isAnimating,
}: {
  equation: string
  initialX: number
  steps: Array<{ x: number; fx: number; fpx: number }>
  currentStep: number
  isAnimating: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    setPanX((prev) => prev + deltaX)
    setPanY((prev) => prev + deltaY)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Zoom functions
  const zoomIn = () => {
    setZoom((prev) => Math.min(10, prev * 1.2))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(0.1, prev / 1.2))
  }

  const resetView = () => {
    setZoom(1)
    setPanX(0)
    setPanY(0)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system with zoom and pan
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2 + panX
    const centerY = height / 2 + panY
    const scale = 100 * zoom

    // Draw axes
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 1
    ctx.beginPath()
    // X-axis
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    // Y-axis
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // Draw grid
    ctx.strokeStyle = "#eee"
    ctx.lineWidth = 0.5
    const gridSpacing = scale / 2

    // Vertical grid lines
    for (let i = -20; i <= 20; i++) {
      const x = centerX + i * gridSpacing
      if (x >= 0 && x <= width) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
    }

    // Horizontal grid lines
    for (let i = -20; i <= 20; i++) {
      const y = centerY + i * gridSpacing
      if (y >= 0 && y <= height) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    // Draw axis labels
    ctx.fillStyle = "#666"
    ctx.font = "12px sans-serif"

    // X-axis numbers
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        const x = centerX + i * gridSpacing
        if (x >= 0 && x <= width) {
          ctx.fillText(i.toString(), x - 5, centerY + 15)
        }
      }
    }

    // Y-axis numbers
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        const y = centerY - i * gridSpacing
        if (y >= 0 && y <= height) {
          ctx.fillText(i.toString(), centerX + 5, y + 5)
        }
      }
    }

    // Draw function curve
    if (equation) {
      ctx.strokeStyle = "#2563eb"
      ctx.lineWidth = 2
      ctx.beginPath()

      let firstPoint = true
      for (let px = 0; px <= width; px += 1) {
        const x = (px - centerX) / scale
        const y = evaluateFunction(equation, x)
        const py = centerY - y * scale

        if (!isNaN(y) && isFinite(y)) {
          if (firstPoint) {
            ctx.moveTo(px, py)
            firstPoint = false
          } else {
            ctx.lineTo(px, py)
          }
        } else {
          firstPoint = true
        }
      }
      ctx.stroke()
    }

    // Draw Newton method steps
    if (steps.length > 0 && currentStep >= 0) {
      for (let i = 0; i <= Math.min(currentStep, steps.length - 1); i++) {
        const step = steps[i]
        const x = step.x
        const fx = step.fx
        const fpx = step.fpx

        const px = centerX + x * scale
        const py = centerY - fx * scale

        // Draw point on curve
        ctx.fillStyle = i === currentStep ? "#ef4444" : "#16a34a"
        ctx.beginPath()
        ctx.arc(px, py, 6, 0, 2 * Math.PI)
        ctx.fill()

        // Draw vertical line to x-axis
        ctx.strokeStyle = "#94a3b8"
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px, centerY)
        ctx.stroke()
        ctx.setLineDash([])

        // Draw tangent line using correct formula: y = f(x0) + f'(x0)(x - x0)
        if (fpx !== 0) {
          ctx.strokeStyle = "#f59e0b"
          ctx.lineWidth = 2
          ctx.beginPath()

          // Calculate tangent line points
          const tangentRange = 4 / zoom // Adjust range based on zoom
          const x1 = x - tangentRange
          const x2 = x + tangentRange

          // y = f(x0) + f'(x0)(x - x0)
          const y1 = fx + fpx * (x1 - x)
          const y2 = fx + fpx * (x2 - x)

          const px1 = centerX + x1 * scale
          const py1 = centerY - y1 * scale
          const px2 = centerX + x2 * scale
          const py2 = centerY - y2 * scale

          ctx.moveTo(px1, py1)
          ctx.lineTo(px2, py2)
          ctx.stroke()

          // Draw next x point (intersection with x-axis)
          if (i < steps.length - 1) {
            const nextX = steps[i + 1].x
            const nextPx = centerX + nextX * scale

            ctx.fillStyle = "#dc2626"
            ctx.beginPath()
            ctx.arc(nextPx, centerY, 4, 0, 2 * Math.PI)
            ctx.fill()

            // Draw arrow from tangent to next point
            ctx.strokeStyle = "#dc2626"
            ctx.lineWidth = 2
            ctx.setLineDash([])
            ctx.beginPath()

            // Find intersection point on tangent line
            const intersectionY = fx + fpx * (nextX - x)
            const intersectionPy = centerY - intersectionY * scale

            ctx.moveTo(nextPx, intersectionPy)
            ctx.lineTo(nextPx, centerY)
            ctx.stroke()
          }
        }

        // Label points
        ctx.fillStyle = "#1f2937"
        ctx.font = `${12 * Math.min(zoom, 2)}px monospace`
        ctx.fillText(`x${i + 1} = ${x.toFixed(4)}`, px + 10, py - 10)
      }
    }

    // Draw zoom info
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.fillText(`Zoom: ${zoom.toFixed(1)}x`, 10, 20)
    ctx.fillText("Kéo thả để di chuyển", 10, 35)
  }, [equation, steps, currentStep, isAnimating, zoom, panX, panY])

  return (
    <div className="relative w-full">
      {/* Canvas Container with fixed size */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="block cursor-grab active:cursor-grabbing max-w-full h-auto"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Control buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button variant="outline" size="sm" onClick={zoomIn} className="bg-white/90 hover:bg-white text-xs px-2 py-1">
          +
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut} className="bg-white/90 hover:bg-white text-xs px-2 py-1">
          -
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="bg-white/90 hover:bg-white text-xs px-2 py-1"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

// Analysis component for initial point selection
function InitialPointAnalysis({ equation, initialX }: { equation: string; initialX: number }) {
  const [analysisResults, setAnalysisResults] = useState<{
    convergence: string
    iterations: number
    finalValue: number
    derivative: number
    recommendation: string
  } | null>(null)

  useEffect(() => {
    if (!equation || !initialX) return

    // Test convergence
    let x = initialX
    let iterations = 0
    const maxIterations = 50
    let converged = false

    for (let i = 0; i < maxIterations; i++) {
      const fx = evaluateFunction(equation, x)
      const fpx = calculateDerivative(equation, x)

      if (Math.abs(fx) < 0.0001) {
        converged = true
        iterations = i + 1
        break
      }

      if (fpx === 0 || Math.abs(fpx) < 0.0001) {
        break
      }

      const newX = x - fx / fpx

      if (Math.abs(newX - x) < 0.0001) {
        converged = true
        iterations = i + 1
        x = newX
        break
      }

      x = newX
      iterations = i + 1
    }

    const derivative = calculateDerivative(equation, initialX)
    let recommendation = ""

    if (Math.abs(derivative) < 0.1) {
      recommendation = "⚠️ Đạo hàm quá nhỏ, có thể hội tụ chậm hoặc phân kỳ"
    } else if (Math.abs(derivative) > 10) {
      recommendation = "⚠️ Đạo hàm quá lớn, có thể dao động mạnh"
    } else if (converged && iterations <= 10) {
      recommendation = "✅ Điểm khởi tạo tốt, hội tụ nhanh"
    } else if (converged && iterations <= 20) {
      recommendation = "✅ Điểm khởi tạo khá tốt"
    } else if (converged) {
      recommendation = "⚠️ Hội tụ chậm, nên thử điểm khác"
    } else {
      recommendation = "❌ Không hội tụ, cần chọn điểm khác"
    }

    setAnalysisResults({
      convergence: converged ? "Hội tụ" : "Phân kỳ",
      iterations,
      finalValue: x,
      derivative,
      recommendation,
    })
  }, [equation, initialX])

  if (!analysisResults) return null

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-semibold mb-2 text-blue-800">Phân tích điểm khởi tạo x₁ = {initialX}</h4>
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Trạng thái:</span> {analysisResults.convergence}
          </div>
          <div>
            <span className="font-medium">Số vòng lặp:</span> {analysisResults.iterations}
          </div>
          <div>
            <span className="font-medium">f'(x₁):</span> {analysisResults.derivative.toFixed(4)}
          </div>
          <div>
            <span className="font-medium">Nghiệm cuối:</span> {analysisResults.finalValue.toFixed(6)}
          </div>
        </div>
        <div className="mt-3 p-2 bg-white rounded border-l-4 border-blue-400">
          <span className="font-medium">Đánh giá:</span> {analysisResults.recommendation}
        </div>

        <div className="mt-3 text-xs text-blue-700">
          <p>
            <strong>Lưu ý khi chọn x₁:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Chọn gần nghiệm dự đoán</li>
            <li>Tránh điểm có f'(x) = 0 (cực trị)</li>
            <li>Tránh điểm có f'(x) quá nhỏ</li>
            <li>Kiểm tra đồ thị để chọn vùng phù hợp</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function CasioCalculatorApp() {
  const [display, setDisplay] = useState("0")
  const [ans, setAns] = useState(2)
  const [isResult, setIsResult] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [step, setStep] = useState(1)
  const [lastExpression, setLastExpression] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showFireworks, setShowFireworks] = useState(false)

  // Custom equation inputs
  const [equation, setEquation] = useState("x^3 - 7")
  const [initialX, setInitialX] = useState(2)
  const [newtonFormula, setNewtonFormula] = useState("Ans - (Ans^3 - 7)/(3*Ans^2)")

  // Animation states
  const [newtonSteps, setNewtonSteps] = useState<Array<{ x: number; fx: number; fpx: number }>>([])
  const [currentAnimationStep, setCurrentAnimationStep] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize Newton steps when equation or initial value changes
  useEffect(() => {
    calculateNewtonSteps()
  }, [equation, initialX])

  const calculateNewtonSteps = () => {
    const steps = []
    let x = initialX

    for (let i = 0; i < 10; i++) {
      const fx = evaluateFunction(equation, x)
      const fpx = calculateDerivative(equation, x)

      steps.push({ x, fx, fpx })

      if (Math.abs(fx) < 0.0001 || fpx === 0) break

      x = x - fx / fpx
    }

    setNewtonSteps(steps)
    setCurrentAnimationStep(-1)
  }

  const startAnimation = () => {
    setIsAnimating(true)
    setCurrentAnimationStep(0)

    const interval = setInterval(() => {
      setCurrentAnimationStep((prev) => {
        if (prev >= newtonSteps.length - 1) {
          setIsAnimating(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const resetAnimation = () => {
    setIsAnimating(false)
    setCurrentAnimationStep(-1)
  }

  const nextStep = () => {
    if (currentAnimationStep < newtonSteps.length - 1) {
      setCurrentAnimationStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentAnimationStep > -1) {
      setCurrentAnimationStep((prev) => prev - 1)
    }
  }

  // Check if answer is close to exact solution
  const checkAnswer = (value: number) => {
    const exactAnswer = newtonSteps[newtonSteps.length - 1]?.x || 0
    const difference = Math.abs(value - exactAnswer)
    if (difference < 0.0001) {
      setShowFireworks(true)
      setTimeout(() => setShowFireworks(false), 3000)
      return true
    }
    return false
  }

  const handleButtonClick = (value: string) => {
    if (value === "AC") {
      setDisplay("0")
      setIsResult(false)
      setCursorPosition(0)
    } else if (value === "DEL") {
      if (display === "0" || display === "") {
        return
      }

      if (cursorPosition > 0) {
        const newDisplay = display.slice(0, cursorPosition - 1) + display.slice(cursorPosition)
        setDisplay(newDisplay || "0")
        setCursorPosition(Math.max(0, cursorPosition - 1))
      }
      setIsResult(false)
    } else if (value === "←") {
      setCursorPosition(Math.max(0, cursorPosition - 1))
    } else if (value === "→") {
      setCursorPosition(Math.min(display.length, cursorPosition + 1))
    } else if (value === "=") {
      try {
        let expressionToEvaluate = display

        if (isResult && lastExpression) {
          expressionToEvaluate = lastExpression
        }

        const result = evaluateExpression(expressionToEvaluate, ans)
        setAns(result)
        setLastExpression(expressionToEvaluate)
        setDisplay(result.toString())
        setIsResult(true)
        setStep(step + 1)
        setCursorPosition(result.toString().length)

        checkAnswer(result)
      } catch {
        setDisplay("Error")
        setIsResult(true)
        setCursorPosition(5)
      }
    } else if (value === "Ans") {
      if (isResult && lastExpression) {
        return
      }

      if (isResult || display === "0") {
        setDisplay("Ans")
        setCursorPosition(3)
      } else {
        const newDisplay = display.slice(0, cursorPosition) + "Ans" + display.slice(cursorPosition)
        setDisplay(newDisplay)
        setCursorPosition(cursorPosition + 3)
      }
      setIsResult(false)
    } else if (value === "^2") {
      if (isResult || display === "0") {
        setDisplay("Ans^2")
        setCursorPosition(6)
      } else {
        const newDisplay = display.slice(0, cursorPosition) + "^2" + display.slice(cursorPosition)
        setDisplay(newDisplay)
        setCursorPosition(cursorPosition + 2)
      }
      setIsResult(false)
    } else if (["+", "-", "*", "/", "×", "÷", "^"].includes(value)) {
      if (isResult) {
        setDisplay("Ans" + value)
        setCursorPosition(4)
      } else if (display === "0") {
        setDisplay("Ans" + value)
        setCursorPosition(4)
      } else {
        const newDisplay = display.slice(0, cursorPosition) + value + display.slice(cursorPosition)
        setDisplay(newDisplay)
        setCursorPosition(cursorPosition + 1)
      }
      setIsResult(false)
    } else {
      if (isResult || display === "0") {
        setDisplay(value)
        setCursorPosition(value.length)
      } else {
        const newDisplay = display.slice(0, cursorPosition) + value + display.slice(cursorPosition)
        setDisplay(newDisplay)
        setCursorPosition(cursorPosition + value.length)
      }
      setIsResult(false)
    }
  }

  const getDisplayValue = () => {
    if (display.includes("Ans")) {
      const preview = display.replace(/Ans/g, `(${ans})`)
      return (
        <div>
          <div className="text-sm text-gray-600">{renderDisplayWithCursor(display)}</div>
          <div>{preview}</div>
        </div>
      )
    }

    if (isResult && lastExpression) {
      return (
        <div>
          <div className="text-lg">{renderDisplayWithCursor(display)}</div>
          <div className="text-xs text-gray-600 mt-1">Nhấn = để lặp lại</div>
        </div>
      )
    }

    return renderDisplayWithCursor(display)
  }

  const renderDisplayWithCursor = (text: string) => {
    if (isResult) {
      return text
    }

    const beforeCursor = text.slice(0, cursorPosition)
    const afterCursor = text.slice(cursorPosition)

    return (
      <span className="relative">
        {beforeCursor}
        <span className="relative">
          <span className="animate-pulse bg-black w-0.5 h-5 absolute top-0 left-0 inline-block"></span>
          {afterCursor}
        </span>
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {showFireworks && <Fireworks />}

      {/* Congratulations Modal */}
      {showFireworks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <Card className="w-96 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="text-center p-6">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">🎉 Chúc mừng! 🎉</h2>
              <p className="text-lg mb-2">Bạn đã tìm được nghiệm!</p>
              <p className="text-sm">Kết quả: {ans.toFixed(10)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Máy tính Casio fx-580VN X</h1>
          <p className="text-gray-600">Thực hành phương pháp Newton với phương trình tùy chỉnh</p>
        </div>
      </div>

      {/* Problem Input Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Nhập phương trình và thiết lập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="equation">Phương trình f(x) = 0</Label>
                <Input
                  id="equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="x^3 - 7"
                  className="font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Ví dụ: x^3 - 7, x^2 - 10, sin(x) - x/2</p>
              </div>
              <div>
                <Label htmlFor="initialX">Nghiệm ban đầu x₁</Label>
                <Input
                  id="initialX"
                  type="number"
                  value={initialX}
                  onChange={(e) => setInitialX(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="newtonFormula">Công thức Newton (cho máy tính)</Label>
                <Input
                  id="newtonFormula"
                  value={newtonFormula}
                  onChange={(e) => setNewtonFormula(e.target.value)}
                  placeholder="Ans - (Ans^3 - 7)/(3*Ans^2)"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2"
              >
                {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showHint ? "Ẩn gợi ý" : "Hiện gợi ý"}
              </Button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Gợi ý
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Công thức Newton:</strong> x_{"{n+1}"} = x_n - f(x_n)/f'(x_n)
                  </p>
                  <p>
                    <strong>Cách sử dụng:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>Nhập phương trình f(x) (ví dụ: x^3 - 7)</li>
                    <li>Chọn nghiệm ban đầu x₁</li>
                    <li>Nhập công thức Newton vào máy tính</li>
                    <li>Nhấn = liên tục để tìm nghiệm</li>
                    <li>Xem animation để hiểu quá trình</li>
                  </ol>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Left Column - Graph Animation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Minh họa phương pháp Newton</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NewtonCanvas
                equation={equation}
                initialX={initialX}
                steps={newtonSteps}
                currentStep={currentAnimationStep}
                isAnimating={isAnimating}
              />

              {/* Add Initial Point Analysis */}
              <InitialPointAnalysis equation={equation} initialX={initialX} />

              {/* Animation Controls */}
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={prevStep} disabled={currentAnimationStep <= -1}>
                  ← Lùi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isAnimating ? () => setIsAnimating(false) : startAnimation}
                  className="flex items-center gap-2"
                >
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAnimating ? "Dừng" : "Chạy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentAnimationStep >= newtonSteps.length - 1}
                >
                  Tiến →
                </Button>
                <Button variant="outline" size="sm" onClick={resetAnimation} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              {/* Steps Table */}
              {newtonSteps.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Các bước Newton:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Bước</th>
                          <th className="text-left p-2">x_n</th>
                          <th className="text-left p-2">f(x_n)</th>
                          <th className="text-left p-2">f'(x_n)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newtonSteps.map((step, index) => (
                          <tr key={index} className={`border-b ${index === currentAnimationStep ? "bg-blue-100" : ""}`}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 font-mono">{step.x.toFixed(6)}</td>
                            <td className="p-2 font-mono">{step.fx.toFixed(6)}</td>
                            <td className="p-2 font-mono">{step.fpx.toFixed(6)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Current Status */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Trạng thái hiện tại:</h4>
                <div className="space-y-1 text-sm">
                  <div>Phương trình: f(x) = {equation}</div>
                  <div>Nghiệm ban đầu: x₁ = {initialX}</div>
                  <div>Ans hiện tại = {ans}</div>
                  {currentAnimationStep >= 0 && <div>Đang hiển thị bước: {currentAnimationStep + 1}</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calculator */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-gray-900 text-white">
            <CardHeader className="text-center pb-2">
              <div className="text-sm text-gray-300">CASIO</div>
              <div className="text-lg font-bold">fx-580VN X</div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display */}
              <div className="bg-green-900 p-4 rounded-lg">
                <div className="bg-green-100 text-black p-3 rounded font-mono text-right text-lg min-h-[60px] flex items-center justify-end break-all">
                  {getDisplayValue()}
                </div>
              </div>

              {/* Calculator Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {/* Row 1 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("SHIFT")}
                >
                  SHIFT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-600 text-white border-blue-600"
                  onClick={() => handleButtonClick("←")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-600 text-white border-blue-600"
                  onClick={() => handleButtonClick("→")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("MODE")}
                >
                  MODE
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600 hover:bg-red-500 text-white border-red-500"
                  onClick={() => handleButtonClick("AC")}
                >
                  AC
                </Button>

                {/* Row 2 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("^2")}
                >
                  x²
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("sqrt(")}
                >
                  √
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("^")}
                >
                  ^
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("log(")}
                >
                  log
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("ln(")}
                >
                  ln
                </Button>

                {/* Row 3 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("sin(")}
                >
                  sin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("cos(")}
                >
                  cos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("tan(")}
                >
                  tan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("(")}
                >
                  (
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick(")")}
                >
                  )
                </Button>

                {/* Row 4 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("7")}
                >
                  7
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("8")}
                >
                  8
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("9")}
                >
                  9
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-500 text-white border-orange-500"
                  onClick={() => handleButtonClick("DEL")}
                >
                  DEL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("/")}
                >
                  ÷
                </Button>

                {/* Row 5 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("4")}
                >
                  4
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("5")}
                >
                  5
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("6")}
                >
                  6
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("*")}
                >
                  ×
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500"
                  onClick={() => handleButtonClick("Ans")}
                >
                  Ans
                </Button>

                {/* Row 6 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("1")}
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("2")}
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick("3")}
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("-")}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleButtonClick("+")}
                >
                  +
                </Button>

                {/* Row 7 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500 col-span-2"
                  onClick={() => handleButtonClick("0")}
                >
                  0
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                  onClick={() => handleButtonClick(".")}
                >
                  .
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-600 hover:bg-green-500 text-white border-green-500 col-span-2"
                  onClick={() => handleButtonClick("=")}
                >
                  =
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-gray-600">
        <p className="text-sm">Mô phỏng máy tính Casio fx-580VN X với animation phương pháp Newton</p>
      </div>
    </div>
  )
}

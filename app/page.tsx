"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Lightbulb,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Trophy,
} from "lucide-react"
import { evaluateFunction, calculateDerivative } from "@/lib/math-utils"

const Calculator = require("@/components/calculator/Calculator").Calculator
const NewtonCanvas = require("@/components/newton/NewtonCanvas").NewtonCanvas
const InitialPointAnalysis = require("@/components/newton/InitialPointAnalysis").InitialPointAnalysis
const Fireworks = require("@/components/ui/Fireworks").Fireworks

export default function CasioCalculatorApp() {
  const [showHint, setShowHint] = React.useState(false)
  const [showFireworks, setShowFireworks] = React.useState(false)

  // Custom equation inputs
  const [equation, setEquation] = React.useState("x^3 - 7")
  const [initialX, setInitialX] = React.useState(2)
  const [newtonFormula, setNewtonFormula] = React.useState("Ans - (Ans^3 - 7)/(3*Ans^2)")

  // Animation states
  const [newtonSteps, setNewtonSteps] = React.useState<Array<{ x: number; fx: number; fpx: number }>>([])
  const [currentAnimationStep, setCurrentAnimationStep] = React.useState(-1)
  const [isAnimating, setIsAnimating] = React.useState(false)

  // Initialize Newton steps when equation or initial value changes
  React.useEffect(() => {
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
              <p className="text-sm">Kết quả: {newtonSteps[newtonSteps.length - 1]?.x.toFixed(10)}</p>
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
                  {currentAnimationStep >= 0 && <div>Đang hiển thị bước: {currentAnimationStep + 1}</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calculator */}
        <div className="flex justify-center">
          <Calculator onResultChange={() => {}} checkAnswer={checkAnswer} />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-gray-600">
        <p className="text-sm">Mô phỏng máy tính Casio fx-580VN X với animation phương pháp Newton</p>
      </div>
    </div>
  )
}

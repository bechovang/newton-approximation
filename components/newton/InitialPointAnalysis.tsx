import { useState, useEffect } from "react"
import { evaluateFunction, calculateDerivative } from "@/lib/math-utils"

interface InitialPointAnalysisProps {
  equation: string
  initialX: number
}

export function InitialPointAnalysis({ equation, initialX }: InitialPointAnalysisProps) {
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
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { evaluateFunction } from "@/lib/math-utils"

interface NewtonCanvasProps {
  equation: string
  initialX: number
  steps: Array<{ x: number; fx: number; fpx: number }>
  currentStep: number
  isAnimating: boolean
}

export function NewtonCanvas({ equation, initialX, steps, currentStep, isAnimating }: NewtonCanvasProps) {
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
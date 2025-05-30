import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { evaluateExpression } from "@/lib/math-utils"

interface CalculatorProps {
  onResultChange: (result: number) => void
  checkAnswer: (value: number) => boolean
}

export function Calculator({ onResultChange, checkAnswer }: CalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [ans, setAns] = useState(2)
  const [isResult, setIsResult] = useState(false)
  const [lastExpression, setLastExpression] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)

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
        setCursorPosition(result.toString().length)

        onResultChange(result)
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
  )
} 
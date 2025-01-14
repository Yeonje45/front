import { useEffect, useRef, useState } from "react";
import Input from "tailwindElement/Input";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}


const DragZoomContainer = ({ children, className, style } :IProps) => {
  const refGraph = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number>(0.5)
  const [point, setPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const [panning, setPanning] = useState<boolean>(false)
  const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Transform Handler
  const transformHandler = () => {
    if (refGraph.current) {
      refGraph.current.style.transform = `translate(${point.x}px, ${point.y}px)`
    }
  }

  // 마우스 클릭 후 뗐을 경우
  const mouseUpHandler = () => {
    if (refGraph.current) {
      refGraph.current.style.cursor = 'default'
      setPanning(false)
    }
  }

  // 마우스 클릭하고 있을 경우
  const mouseDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (refGraph.current) {
      refGraph.current.style.cursor = 'move'

      setStart({ x: e.clientX - point.x, y: e.clientY - point.y })

      setPanning(true)
    }
  }

  // 마우스 Move 이벤트 핸들러
  const mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panning) {
      setPoint({ x: e.clientX - start.x, y: e.clientY - start.y })
      transformHandler()
    }
  }

  // 휠 이벤트 핸들러
  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    const modal = document.getElementById('modal open')
    if(modal) {
      modal.style.overflow = 'hidden'
    }

    setScale(prev => {
      const data = prev + (e.deltaY > 0 ? -0.1 : 0.1)

      const newScale = data >= 5.0 ? 5.0 : data <= 0.2 ? 0.2 : data

      if (refGraph.current) {
        refGraph.current.style.scale = newScale.toString()
      }

      return newScale
    })

    const xs = e.clientX - point.x
    const ys = e.clientY - point.y
    setPoint({
      x: e.clientX - xs,
      y: e.clientY - ys,
    })
  }

  // 돋보기 버튼 핸들러
  const scaleHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name

    setScale(prev => {
      let result = scale

      result = name === 'plus' ? prev + 0.1 : prev - 0.1
      result = result >= 5.0 ? 5.0 : result <= 0.2 ? 0.2 : result

      if (refGraph.current) {
        refGraph.current.style.scale = result.toString()
      }

      return result
    })
  }

  const onMouseOver = () => {
    document.getElementsByTagName('html')[0].style.overflow = 'hidden'

  }

  const onMouseOut = () => {
    document.getElementsByTagName('html')[0].style.overflow = 'auto'
    const modal = document.getElementById('modal open')
    if(modal) {
      modal.style.overflow = 'auto'
    }
  }

  useEffect(() => {
    setPanning(false)
    setPoint({ x: 0, y: 0 })
    setScale(1)
    setStart({ x: 0, y: 0 })

    if(refGraph.current) {
      refGraph.current.style.transform = `translate(${point.x}px, ${point.y}px)`
      refGraph.current.style.scale = scale.toString()
    }
  }, [refGraph.current])

  return (
    <div 
      className="relative z-10 flex items-center justify-center w-full h-full max-h-[620px] overflow-hidden border select-none active:cursor-move"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseUp={mouseUpHandler}
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onWheel={wheelHandler}>
      <div className="absolute bottom-0 left-0 z-10 flex justify-between m-2 bg-white border rounded-sm w-44 gap-3">
        <button className="px-4 py-2 border-e hover:bg-gray-100" name="minus" onClick={scaleHandler}>
          -
        </button>
        <Input
          disabled
          className="text-center !ring-0 !shadow-none !bg-white"
          value={`${Math.round(scale * 100)}%`}
        />
        <button className="px-4 py-2 border-s hover:bg-gray-100" name="plus" onClick={scaleHandler}>
          +
        </button>
      </div>
      <div ref={refGraph} className={`${className}`} style={style}>
        {children}
      </div>
    </div>
  )
}

export default DragZoomContainer;

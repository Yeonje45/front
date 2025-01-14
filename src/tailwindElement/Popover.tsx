import { useState } from 'react'

interface IPopover {
  children: React.ReactNode
  className?: string
  button: React.ReactNode
  placement: 'top' | 'bottom' | 'left' | 'right'
}

interface IChildrenProps {
  children: React.ReactNode
}

const Header = ({ children }: IChildrenProps) => {
  return <div className={`text-xl text-start bg-gray-100 border-b p-3 `}>{children}</div>
}

const Body = ({ children }: IChildrenProps) => {
  return <div className={`w-full text-lg bg-white p-3`}>{children}</div>
}

const Popover = ({ children, button, placement }: IPopover) => {
  const [show, setShow] = useState<boolean>(false)
  const popoverMouseOverHandler = () => {
    setShow(true)
  }

  const popoverMouseOutHandler = () => {
    setShow(false)
  }

  const arrowSize = 15

  let placementStyle = ''
  let arrowStyle = ''
  let childrenGroupStyle = ''
  let inlineStyle = {}

  const buttonProps: any = button
  const size = buttonProps.props.size

  if (placement === 'top') {
    childrenGroupStyle = `flex flex-col-reverse items-center`
    inlineStyle = { bottom: size + arrowSize }
    placementStyle = 'flex flex-col-reverse items-center'
    arrowStyle = 'bottom-[1px]'
  } else if (placement === 'bottom') {
    childrenGroupStyle = `flex flex-col items-center `
    inlineStyle = { top: size + arrowSize }
    placementStyle = 'flex flex-col items-center gap-5'
    arrowStyle = 'rotate-180 -bottom-[1px]'
  } else if (placement === 'left') {
    childrenGroupStyle = `flex flex-row-reverse items-center`
    inlineStyle = { right: size + arrowSize }
    placementStyle = 'flex flex-row-reverse items-center gap-5'
    arrowStyle = '-rotate-90 -left-[1px]'
  } else if (placement === 'right') {
    childrenGroupStyle = `flex flex-row items-center`
    inlineStyle = { left: size + arrowSize }
    placementStyle = 'flex flex-row items-center gap-5'
    arrowStyle = 'rotate-90 left-[1px]'
  }

  return (
    <div
      onMouseOver={popoverMouseOverHandler}
      onMouseOut={popoverMouseOutHandler}
      className={`w-10 relative`}>
      <div className={`${placementStyle} absolute flex`}>
        <div>{button}</div>
        {show && (
          <div className={`absolute ${childrenGroupStyle}`} style={inlineStyle}>
            <div className={`absolute z-50 ${arrowStyle}`}>
              <div
                className={`border-[15px] border-transparent border-t-gray-200 absolute translate-x-[-50%] `}
              />
              <div
                className={`border-[14px] border-transparent border-t-white absolute translate-x-[-50%] text-gray-200 `}
              />
            </div>
            <div className="whitespace-nowrap border rounded overflow-hidden absolute z-40">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Popover.Header = Header
Popover.Body = Body

export default Popover

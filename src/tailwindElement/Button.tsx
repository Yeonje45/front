import React from 'react'

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | ''
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'light'
    | 'unset'
}

const Button = ({
  children,
  onClick,
  onMouseOver,
  onMouseOut,
  variant,
  disabled,
  className,
  type,
  name,
  id,
}: IButton) => {
  const baseStyle = 'p-1.5 px-3 rounded-lg'
  // const primaryStyle = 'bg-blue-500 text-white'
  const primaryStyle = 'bg-gray-700 text-white'
  const secondaryStyle = 'bg-gray-700 text-white'
  const successStyle = 'bg-green-500 text-white'
  const dangerStyle = 'bg-red-500 text-white'
  const warningStyle = 'bg-yellow-500 text-white'
  const lightStyle = 'bg-gray-100 text-gray-700'
  const unsetStyle = 'bg-transparent text-gray-700'
  const disabledStyle = '!bg-gray-300 !text-gray-700 opacity-30 cursor-default'

  return (
    <button
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className={`${baseStyle} ${
        variant === 'primary'
          ? primaryStyle
          : variant === 'secondary'
          ? secondaryStyle
          : variant === 'success'
          ? successStyle
          : variant === 'danger'
          ? dangerStyle
          : variant === 'warning'
          ? warningStyle
          : variant === 'light'
          ? lightStyle
          : variant === 'unset'
          ? unsetStyle
          : primaryStyle
      } ${disabled ? disabledStyle : ''} ${className}`}
      disabled={disabled}
      type={type ? type : 'button'}
      name={name}
      id={id}>
      {children}
    </button>
  )
}

export default Button

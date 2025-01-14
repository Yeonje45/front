interface IProps {
  type: string
  controlId: string
  placeholder: string
  className?: string
  width: string

  ChangeFormFieldHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UserFormField = ({
  controlId,
  placeholder,
  type,
  className,
  width,
  ChangeFormFieldHandler,
}: IProps) => {
  return (
    <input
      name={controlId}
      type={type}
      placeholder={placeholder}
      autoComplete="off"
      required
      className={`border border-gray-300 rounded-lg outline-none ps-2 hover:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 ${width} ${className}`}
      onChange={ChangeFormFieldHandler}
    />
  )
}

export default UserFormField

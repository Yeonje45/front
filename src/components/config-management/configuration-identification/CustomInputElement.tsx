import React from 'react'

// Table TD<TableData> 안에 들어가는 Custom Input Element
const CustomInputElement = ({ placeholder, value, onChange, readOnly, name, type, defaultValue, autoComplete, disabled, id }: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
    <input
      className={`block outline-none w-full border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:leading-6 p-3`}
      placeholder={placeholder}
      value={value}
      readOnly={readOnly}
			id={id}
      name={name}
      onChange={onChange}
      type={type}
      defaultValue={defaultValue}
      autoComplete={autoComplete}
      disabled={disabled}
    />
	)
}

export default CustomInputElement

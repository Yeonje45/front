import React, { Fragment } from 'react'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {}

interface IInputLabel extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface IFloatingLabelInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface ITextarea extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  rows: number
}

interface ISelectGroup extends React.FormHTMLAttributes<HTMLFormElement> {}

interface ISelectInput extends React.InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  ref?: React.ForwardedRef<HTMLInputElement>
}

interface IOptionInput extends React.InputHTMLAttributes<HTMLInputElement> {
  selected?: boolean
}

interface IFileInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  ref?: React.ForwardedRef<HTMLInputElement>
}

interface ICheckboxInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

interface IRadio extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = ({
  placeholder,
  value,
  onChange,
  className="",
  readOnly,
  name,
  type,
  defaultValue,
  autoComplete,
  disabled,
	id
}: IInput) => {
  return (
    <input
      className={`block outline-none w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:leading-6 ${className}`}
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

const InputLabel = ({
  placeholder,
  label,
  name,
  type,
  id,
  autoComplete,
  required,
  className,
  onChange,
  value,
  disabled,
  readOnly,
  defaultValue,
  defaultChecked,
  maxLength,
}: IInputLabel) => {
  return (
    <div
      className={`w-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${className}`}>
      <label
        htmlFor={name}
        className="block font-medium text-gray-900 leading-6 whitespace-nowrap">
        {label}
      </label>
      <div className="w-full mt-1">
        <input
          value={value}
          placeholder={placeholder}
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          defaultValue={defaultValue}
          defaultChecked={defaultChecked}
          maxLength={maxLength}
          className="w-full block outline-none rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  )
}

const FloatingLabelInput = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  readOnly,
  name,
}: IFloatingLabelInput) => {
  return (
    <div className={`relative p-4 transition-all ${className}`}>
      <input
        id="floating_input"
        type="text"
        className="w-full border-0 peer focus:p-1 focus:border-0 focus:outline-none focus:placeholder:hidden focus:ring-0"
        placeholder={placeholder}
        value={value}
        name={name}
        readOnly={readOnly}
        onChange={onChange}
      />
      <label
        htmlFor="floating_input"
        className="absolute top-0 text-sm text-gray-500 left-2 transition-all peer-focus:top-1 peer-focus:text-gray-600 peer-focus:text-xs">
        {label}
      </label>
      <div className="absolute top-0 left-0 w-full h-full p-4 border border-gray-300 rounded-lg -z-1 peer-focus:border-2 peer-focus:border-blue-300"></div>
    </div>
  )
}

const SelectGroup = ({ className, children }: ISelectGroup) => {
  return <form className={className}>{children}</form>
}

const Select = React.forwardRef<HTMLSelectElement, ISelectInput>(
  ({ id, className, children, onChange, label, name, value, disabled }, ref) => {
    return (
      <div className="flex flex-col justify-center w-full gap-1">
        {label && <label>{label}</label>}
        <select
          value={value}
          name={name}
          id={id}
					disabled={disabled}
          className={`w-full outline-none bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 ${className}`}
          onChange={onChange}
          ref={ref}>
          {children}
        </select>
      </div>
    )
  },
)

const Option = ({ id, className, children, value, defaultChecked }: IOptionInput) => {
  return (
    <option id={id} value={value} className={className} defaultChecked>
      {children}
    </option>
  )
}

const File = React.forwardRef<HTMLInputElement, IFileInput>(
  ({ id, className, onChange, label, name, multiple, accept, disabled, value }, ref) => {
    return (
      <div className={`flex flex-col w-full h-full gap-1 ${className}`}>
        {label && <label>{label}</label>}
        <input
          onChange={onChange}
          className="relative cursor-pointer m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out bg-white file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
          type="file"
          id={id}
          name={name}
          value={value}
          ref={ref}
          multiple={multiple}
          disabled={disabled}
					accept={accept}
        />
      </div>
    )
  },
)

const Checkbox = ({
  label,
  id,
  name,
  defaultChecked,
  onChange,
  disabled,
	checked,
  value
}: ICheckboxInput) => {
  return (
    <div className="flex justify-center gap-2">
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
				checked={checked}
      />
      {label && <label>{label}</label>}
    </div>
  )
}

const Radio = ({
  label,
  name,
  value,
  defaultChecked,
  onChange,
  disabled,
  checked,
	id,
}: IRadio) => {
  return (
    <div className="flex justify-center gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
				id={id}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  )
}

const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  readOnly,
  defaultValue,
  name,
  type,
  autoComplete,
  rows,
  disabled,
	id,
}: ITextarea) => {
  return (
    <div className="flex flex-col justify-center w-full h-full gap-1">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        className={`block outline-none w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:leading-6 ${className}`}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        readOnly={readOnly}
        name={name}
        onChange={onChange}
        autoComplete={autoComplete}
        rows={rows}
        disabled={disabled}
      />
    </div>
  )
}

Input.Float = FloatingLabelInput
Input.InputLabel = InputLabel
Input.Textarea = Textarea

// Select & Option
Input.SelectGroup = SelectGroup
Input.Select = Select
Input.Option = Option

// File
Input.File = File

// Checkbox
Input.Checkbox = Checkbox

// radio
Input.Radio = Radio

export default Input

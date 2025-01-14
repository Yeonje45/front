import { Fragment } from 'react'

import Input from 'tailwindElement/Input'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const ProjectUpdateFormField = ({ label, type, value, onChange, id, name }: IProps) => {
  switch (type) {
    case 'radio':
      return (
        <div className="w-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <label className='block text-md font-medium leading-6 text-gray-900"'>
            {label}
          </label>
          <div className="flex mt-2 outline-none w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <div className="w-full flex justify-center gap-2">
              <input
                type="radio"
                name="project_unit_code"
                value="sys"
                onChange={onChange}
                checked={value === 'sys'}
              />
              <label>체계</label>
            </div>
            <div className="w-full flex justify-center gap-2">
              <input
                type="radio"
                name="project_unit_code"
                value="subsys"
                onChange={onChange}
                checked={value === 'subsys'}
              />
              <label>부체계</label>
            </div>
            <div className="w-full flex justify-center gap-2">
              <input
                type="radio"
                name="project_unit_code"
                value="csci"
                onChange={onChange}
                checked={value === 'csci'}
              />
              <label>CSCI</label>
            </div>
          </div>
        </div>
      )
    case 'date':
      return (
        <Input.InputLabel
          label={label}
          type={type}
          value={value}
          id={id}
          name={name}
          onChange={onChange}
        />
      )
    default:
      return (
        <Input.InputLabel
          label={label}
          type={type}
          value={value}
          id={id}
          name={name}
          onChange={onChange}
        />
      )
  }
}

export default ProjectUpdateFormField

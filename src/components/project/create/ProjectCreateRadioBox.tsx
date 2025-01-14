import Input from 'tailwindElement/Input'
import { IProjectManageUnit } from '../../../constant/project/projectCreateFormFields'

interface IProps {
  label: string
  radioData?: IProjectManageUnit[]
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ProjectCreateRadioBox = ({ label, radioData, onChange }: IProps) => {
  return (
    <div className="w-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <label className='block text-md font-medium leading-6 text-gray-900"'>
        {label}
      </label>
      <div className="flex mt-2 outline-none w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        {radioData?.map((radio, index_st) => (
          <div key={index_st} className="w-full flex justify-center gap-2">
            <input
              type="radio"
              name={radio.name}
              value={radio.value}
              onChange={onChange}
							defaultChecked={radio.value === 'csci'}
            />
            <label>{radio.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectCreateRadioBox

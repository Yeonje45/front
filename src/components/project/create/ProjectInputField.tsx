import {
  ICreateFormState,
  IProjectCreateFormFields,
  std_business_type_name,
} from 'constant/project/projectCreateFormFields'
import ProjectCreateRadioBox from './ProjectCreateRadioBox'
import Input from 'tailwindElement/Input'

interface IProps {
  createFormState: ICreateFormState
  formFields: IProjectCreateFormFields[]
  changeStateHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  changeCustomTypeHandler: (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>,
  ) => void
}

const ProjectInputField = ({
  createFormState,
  formFields,
  changeStateHandler,
  changeCustomTypeHandler,
}: IProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-3">
      {formFields.map((field, index_st) => {
        switch (field.controlId) {
          case 'admin':
            return (
              <div className="w-full" key={index_st}>
                <label htmlFor={field.controlId}>{field.label}</label>
                <Input.Select>
                  <Input.Option value="">선택</Input.Option>
                  <Input.Option value="here_user_id">
									 	[홍길동] (hgd) Moasoft
                  </Input.Option>
                </Input.Select>
              </div>
            )
          case 'project_unit_code':
            return (
              <ProjectCreateRadioBox
                key={index_st}
                label={field.label}
                radioData={field.radioData}
                onChange={changeStateHandler}
              />
            )
          case 'std_business_type_index':
            return (
              <div className="w-full" key={index_st}>
                <label htmlFor={field.controlId}>{field.label}</label>
                <div className="flex flex-col gap-2">
                  <Input.Select
                    name="std_business_type_index"
                    value={createFormState.std_business_type_index.value}
                    onChange={changeCustomTypeHandler}>
                    <Input.Option value="">선택</Input.Option>
                    {std_business_type_name.map((data, index_st) => (
                      <Input.Option key={index_st} value={data.value}>
                        {data.label}
                      </Input.Option>
                    ))}
                  </Input.Select>
                  {createFormState.std_business_type_index.value === '14' && (
                    <Input
                      name="custom_business_type_name"
                      placeholder="그 외(사용자 입력)"
                      onChange={changeCustomTypeHandler}
                    />
                  )}
                </div>
              </div>
            )
          default:
            return (
              <Input.InputLabel
                key={index_st}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                id={field.controlId}
                name={field.controlId}
                onChange={changeStateHandler}
              />
            )
        }
      })}
    </div>
  )
}

export default ProjectInputField

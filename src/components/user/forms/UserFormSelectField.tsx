import { ISignupFormOptionFields } from 'constant/user/signupFormFields'

interface IProps {
  className?: string
  selectFields: ISignupFormOptionFields[]
  ChangeFormFieldHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const UserFormSelectField = ({
  className,
  selectFields,
  ChangeFormFieldHandler,
}: IProps) => {
  return (
    <select onChange={ChangeFormFieldHandler} className={`${className} shadow-none`}>
      {selectFields &&
        selectFields.map(selectField => (
          <option key={selectField.option} value={selectField.option}>
            {selectField.label}
          </option>
        ))}
    </select>
  )
}

export default UserFormSelectField

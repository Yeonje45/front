import UserFormField from './UserFormField'

import styles from '../user.module.scss'
import { ISignupFormFields } from 'constant/user/signupFormFields'
import { ISettingFormFields } from 'constant/user/settingFormFields'
import UserFormSelectField from './UserFormSelectField'

interface IProps {
  formFields: ISignupFormFields[] | ISettingFormFields[]
  ChangeInputFormFieldHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  ChangeSelectFormFieldHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const UserFormTable = ({
  formFields,
  ChangeInputFormFieldHandler,
  ChangeSelectFormFieldHandler,
}: IProps) => {
  return (
    <table className={`${styles.user_form_table} w-3/4 h-full border`}>
      <thead>
        {formFields.map((field, index_st) => (
          <tr key={index_st} className={`h-14`}>
            <th
              className={`text-center align-middle h-14 border-e border-gray-300 ${
                index_st % 2 == 0 ? 'bg-white' : 'bg-gray-100'
              }`}>
              {field.label}
            </th>
            <td className={`box-border block h-14`}>
              {field.type === 'select' ? (
                // type == 'select' ? [options] is required!
                // when selected [Other] ? Open Modal
                <UserFormSelectField
                  className="border-0"
                  selectFields={field.options!}
                  ChangeFormFieldHandler={ChangeSelectFormFieldHandler}
                />
              ) : (
                <UserFormField
                  controlId={field.controlId}
                  placeholder={field.placeholder}
                  type={field.type}
                  className={`h-full border-0 flex-row-reverse rounded-none ${
                    index_st % 2 == 0 ? 'bg-white' : 'bg-gray-100'
                  }`}
                  width="w-full"
                  ChangeFormFieldHandler={ChangeInputFormFieldHandler}
                />
              )}
            </td>
          </tr>
        ))}
      </thead>
    </table>
  )
}

export default UserFormTable

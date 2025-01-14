import { useEffect, useState, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import UserAccessPointFormContainer from 'components/user/containers/UserAccessPointFormContainer'
import ChangePasswordModal from 'components/user/setting/ChangePasswrodModal'

import { formFields } from 'constant/user/settingFormFields'
import { RootState } from 'app/store'
import { ISignupFormFields } from 'constant/user/signupFormFields'
import { UpdateUserModel } from 'models/UserInfoModel'

interface ISettingFormState {
  value: string | number | File
  isError: boolean
}

// 인덱스 시그니처를 추가하여 어떤 문자열 키에도 대응할 수 있게
type SettingFormState = {
  [key: string]: ISettingFormState
}

const UserSettingPage = () => {
	const navigate = useNavigate()
  const user_state = useSelector((state: RootState) => state.user)

  const [settingFormState, setSettingFormState] = useState<SettingFormState>({
    user_id: { value: user_state.user.user_id, isError: false },
    user_name: { value: user_state.user.user_name, isError: false },
    user_dept: { value: user_state.user.user_dept, isError: false },
    user_position: { value: user_state.user.user_position, isError: false },
    user_company: { value: user_state.user.user_company, isError: false },
    user_contact_1: { value: user_state.user.user_contact[0], isError: false },
    user_contact_2: { value: user_state.user.user_contact[1], isError: false },
    user_email: { value: user_state.user.user_email, isError: false },
    user_birth: { value: String(user_state.user.user_birth), isError: false },
    user_password: { value: "", isError: false },
    user_confirmPassword: { value: "", isError: false },
		user_profile: { value: user_state.user.user_profile, isError: false },
  })

  const changeStateHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // type이 file일 경우 string 방식으로 저장 불가
    if (e.target.type === 'file' && e.target.files && e.target.files[0]) {
      setSettingFormState(prev => ({
        ...prev,
        [name]: {
          ...prev[name as keyof typeof settingFormState],
          value: e.target.files ? e.target.files[0] : '',
        },
      }))
      return
    }

    setSettingFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof settingFormState],
        value: value,
      },
    }))
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    Swal.fire({
      title: '정보 수정',
      text: '정보를 수정하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
    }).then(async result => {
      if (result.isConfirmed) {
				const update_user = new UpdateUserModel(
					user_state.user.user_id,
					settingFormState.user_name.value as string,
					settingFormState.user_dept.value as string,
					settingFormState.user_position.value as string,
					settingFormState.user_company.value as string,
					settingFormState.user_contact_1.value as string + " " + settingFormState.user_contact_2.value as string,
					settingFormState.user_email.value as string,
					settingFormState.user_birth.value as string,
					settingFormState.user_password.value as string,
					settingFormState.user_profile.value as File
				)

				const res = await update_user.updateUserInfo()
				if (res.success) {
					await Swal.fire({
						title: '정보 수정',
						text: '정보가 수정되었습니다.',
						icon: 'success',
						showConfirmButton: false,
						timer: 1500,
					})
					navigate('/')
					return
				}
				Swal.fire({
					title: '정보 수정',
					text: res.message || '정보 수정에 실패했습니다.',
					icon: 'error',
					showConfirmButton: false,
					timer: 1500,
				})
      }
    })
  }

  // FORM을 type에 맞게 구성
  const getInputElement = (fieldItem: ISignupFormFields): ReactElement<any, any> => {
    switch (fieldItem.controlId) {
      case 'user_id':
        return (
					<Input
						className="w-full h-10 p-2 bg-gray-100"
						name={fieldItem.controlId}
						id={fieldItem.controlId}
						type={fieldItem.type}
						placeholder={fieldItem.placeholder}
						autoComplete="off"
						onChange={changeStateHandler}
						value={settingFormState.user_id.value as string}
						disabled
					/>
        )
      case 'user_profile': // TODO: 현재 프로필 이미지 미리보기와, 이미지 변경 시에 미리보기도 추가
        return (
          <Input.File
            className="w-full h-10 p-2"
            name={fieldItem.controlId}
            id={fieldItem.controlId}
            placeholder={fieldItem.placeholder}
            autoComplete="off"
            onChange={changeStateHandler}
          />
        )
			case 'user_email':
        return (
          <Input
            className="w-full h-10 p-2"
            name={fieldItem.controlId}
            id={fieldItem.controlId}
            type={fieldItem.type}
            placeholder={fieldItem.placeholder}
            autoComplete="off"
            onChange={changeStateHandler}
						value={settingFormState[fieldItem.controlId].value as string}
          />
        )
      default:
        return (
          <Input
            className="w-full h-10 p-2"
            name={fieldItem.controlId}
            id={fieldItem.controlId}
            type={fieldItem.type}
            placeholder={fieldItem.placeholder}
            autoComplete="off"
            onChange={changeStateHandler}
						value={settingFormState[fieldItem.controlId].value as string}
          />
        )
    }
  }

  return (
    <UserAccessPointFormContainer
      page_title="사용자 정보 관리"
      submitHandler={submitHandler}>
      <div className="w-full p-8 pt-1 mx-auto bg-white border shadow-md sm:max-w-full md:max-w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl gap-2">
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-center text-gray-900 leading-9">
          정보 수정
        </h2>
        <table className="block w-full mx-auto sm:max-w-full md:max-w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <tbody className="block w-full">
            {formFields.map(fieldItem => (
              <tr
                key={fieldItem.controlId}
                className="flex items-center w-full py-1 my-1">
                <th className="block w-1/4">{fieldItem.label}</th>
                <td className="block w-3/4">
                  {getInputElement(fieldItem)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
				
        <div className="flex items-center justify-center w-full mx-auto mt-5 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl gap-2">
          <Button
            variant="primary"
            type="submit" >
            저장
          </Button>
          <ChangePasswordModal 
            user_id={user_state.user.user_id}
          />
        </div>
      </div>
    </UserAccessPointFormContainer>
  )
}

export default UserSettingPage

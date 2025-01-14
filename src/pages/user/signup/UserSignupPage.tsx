import { useNavigate } from 'react-router-dom'
import { ReactElement, useState } from 'react'
import Swal from 'sweetalert2'

import ActiveModal from 'tailwindElement/ActiveModal'
import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'

import UserLinkPointFormContainer from 'components/user/containers/UserLinkPointFormContainer'
import ActiveLink from 'components/common/links/ActiveLink'

import logo_img from '../../../assets/project_logo.svg'
import { 
  CheckDuplicateId, CheckUserId,
  CheckSignupValidInputs, RequestSignup
} from 'models/UserInfoModel'

const UserSignupPage = () => {
  const navigate = useNavigate()

  // Profile Image Preview Modal State
  const [isShowProfileImageModal, setIsShowProfileImageModal] = useState<boolean>(false)
  const [previewImageSrc, setPreviewImageSrc] = useState<{
    src: string
    name: string
    size: number
  }>({ src: '', name: '', size: 0 })

  const [isIdCheck, setIsIdCheck] = useState<boolean>(false) // 아이디 중복확인 여부
  const [signupState, setSignupState] = useState<Record<string, string>>({
    user_id: '', // ID
    user_name: '', // 이름
    user_dept: '', // 부서
    user_position: '', // 직책
    user_company: '', // 회사
    user_contact_1: '', // 휴대전화
    user_contact_2: '', // 연락처
    user_email: '',
    user_birth: '',
    password: '',
    user_confirmPassword: '',
  })
  const [signupProfileImage, setSignupProfileImage] = useState<File | null>(null)

  // handle Profile Image Preview Modal State Handler
  const handleProfileImageModal = (): void => {
    setIsShowProfileImageModal(() => !isShowProfileImageModal)
    return
  }

  // 입력 된 아이디 중복 확인
  // setisIdCheck: 중복확인 여부 ( True: 중복확인 완료, False: 중복확인 실패 )
  const handleIdCheck = async () => {
    if (signupState.user_id === '') {
      await Swal.fire({
        title: '아이디를 입력해주세요.',
        icon: 'error',
      })
      return
    }
    if (!CheckUserId(signupState.user_id)) {
      await Swal.fire({
        title: '6~12자의 영문,숫자,_만 사용 가능합니다.',
        icon: 'error',
      })
      return
    }
    const checkRes = await CheckDuplicateId(signupState.user_id)
    // 중복 체크 실패 시에 메시지 출력 및 return
    if (!checkRes.success) {
      setIsIdCheck(false)
      await Swal.fire({
        title: checkRes.message,
        icon: 'error',
      })
      return
    }
    await Swal.fire({
      title: checkRes.message,
      icon: 'success',
    })
    setIsIdCheck(true)
  }

  const handleChangeID = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSignupState(prev => ({
      ...prev,
      user_id: value,
    }))
    setIsIdCheck(() => false)
  }

  // 사용자가 프로필 이미지 변경 시에 
  const handleChangeProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setSignupProfileImage(e.target.files![0])
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    await new Promise(resolve => {
      reader.onload = () => {
        setPreviewImageSrc({
          src: reader.result as string,
          name: e.target.files![0].name,
          size: e.target.files![0].size,
        })
        resolve(reader.result)
      }
    })
    return
  }

  const changeStateHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupState(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    for (const key in signupState) {
      if (signupState[key] === '') {
        await Swal.fire({
          title: '모든 값을 입력해주세요.',
          icon: 'error',
        })
        return
      }
    }
    const check_valid = CheckSignupValidInputs({user_id: signupState.user_id, password: signupState.password, contact_1: signupState.user_contact_1})
    if (check_valid !== '') {
      await Swal.fire({
        title: check_valid,
        icon: 'error',
      })
      return
    }
    if (signupState.password !== signupState.user_confirmPassword) {
      await Swal.fire({
        title: '비밀번호가 일치하지 않습니다.',
        icon: 'error',
      })
      return
    }
    if (!isIdCheck) {
      await Swal.fire({
        title: '아이디 중복확인을 해주세요.',
        icon: 'error',
      })
      return
    }

    // 회원가입 하겠냐는 문구로 한 번더 확인
    // 취소 버튼이 나오면 함수 바로 종료
    const confirmResult = await Swal.fire({
      title: '회원가입 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '회원가입',
      cancelButtonText: '취소',
    })

    if (confirmResult.isDismissed) {
      return
    }

    // request 보내기
    const res = await RequestSignup({
      user_id: signupState.user_id,
      user_name: signupState.user_name,
      user_dept: signupState.user_dept,
      user_position: signupState.user_position,
      user_company: signupState.user_company,
      user_email: signupState.user_email,
      user_contact: signupState.user_contact_1 + " " + signupState.user_contact_2,
      user_birth: signupState.user_birth,
      password: signupState.password,
      user_profile: signupProfileImage,
    })
    if (!res.success) {
      if (res.message.includes("limit of 4")) {
        await Swal.fire({
          title: '최대 회원가입 인원을 초과하였습니다.',
          text: '관리자에게 문의해주세요.',
          icon: 'error',
        })
      } else {
        await Swal.fire({
          title: res.message || '회원가입 실패',
          icon: 'error',
        })
      }
      return
    }
    await Swal.fire({
      title: res.message || '회원가입 성공',
      icon: 'success',
    })
    navigate('/')
    return
  }

  return (
    <UserLinkPointFormContainer onSubmit={submitHandler}>
      <div className="w-full mx-auto bg-white border sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl md:p-3 md:rounded-md">
        <div className="w-full mx-auto sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <img
            className="w-auto h-40 mx-auto"
            src={logo_img}
            alt="Your Company"
          />
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-center text-gray-900 leading-9">
            회원가입
          </h2>
        </div>
        <table className="block w-full mx-auto sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <tbody className="block w-full">
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">ID</th>
              <td className="block w-2/4">
                <Input 
                  id="user_id"
                  name="user_id"
                  onChange={handleChangeID}
                  placeholder='아이디를 입력해주세요.'
                />
              </td>
              <td className='block w-1/4 ms-3'>
                <Button onClick={handleIdCheck}>중복 확인</Button>
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">이름</th>
              <td className="block w-3/4">
                <Input 
                  id="user_name"
                  name="user_name"
                  onChange={changeStateHandler}
                  placeholder='이름을 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">부서</th>
              <td className="block w-3/4">
                <Input 
                  id="user_dept"
                  name="user_dept"
                  onChange={changeStateHandler}
                  placeholder='부서를 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">직책</th>
              <td className="block w-3/4">
                <Input 
                  id="user_position"
                  name="user_position"
                  onChange={changeStateHandler}
                  placeholder='직책을 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">회사</th>
              <td className="block w-3/4">
                <Input 
                  id="user_company"
                  name="user_company"
                  onChange={changeStateHandler}
                  placeholder='회사를 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">휴대전화</th>
              <td className="block w-3/4">
                <Input 
                  id="user_contact_1"
                  name="user_contact_1"
                  onChange={changeStateHandler}
                  placeholder='휴대전화를 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">연락처</th>
              <td className="block w-3/4">
                <Input 
                  id="user_contact_2"
                  name="user_contact_2"
                  onChange={changeStateHandler}
                  placeholder='연락처를 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">이메일</th>
              <td className="block w-3/4">
                <Input 
                  type='email'
                  id="user_email"
                  name="user_email"
                  onChange={changeStateHandler}
                  placeholder='이메일을 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">생년월일</th>
              <td className="block w-3/4">
                <Input 
                  type="date"
                  id="user_birth"
                  name="user_birth"
                  onChange={changeStateHandler}
                  placeholder='생년월일을 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">비밀번호</th>
              <td className="block w-3/4">
                <Input 
                  type="password"
                  id="password"
                  name="password"
                  onChange={changeStateHandler}
                  placeholder='비밀번호를 입력해주세요.'
                />
              </td>
            </tr>
            <tr
              className="flex items-center w-full py-1 my-1">
              <th className="block w-1/4">비밀번호 확인</th>
              <td className="block w-3/4">
                <Input 
                  type="password"
                  id="user_confirmPassword"
                  name="user_confirmPassword"
                  onChange={changeStateHandler}
                  placeholder='비밀번호를 다시 입력해주세요.'
                />
              </td>
            </tr>
            <tr className='flex items-center'>
              <th className="block w-1/4">프로필 이미지</th>
              <td className="block w-3/4">
              <Input.File
                className="w-full h-10 p-2"
                autoComplete="off"
                onChange={handleChangeProfileImage}
              />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Preview Profile Image - Size, Image, [Active Modal || Modal] */}
        <ActiveModal
          isOpen={isShowProfileImageModal}
          size="md"
          buttonElement={
            previewImageSrc.src && (
              <p
                onClick={handleProfileImageModal}
                className="w-full text-right text-gray-500 cursor-pointer">
                프로필 이미지 미리보기
              </p>
            )
          }>
          <ActiveModal.Head>
            <h2>프로필 사진 미리보기</h2>
          </ActiveModal.Head>
          <ActiveModal.Body>
            <img
              src={previewImageSrc.src}
              alt="Profile Image Preview"
              className="w-full"
            />
            <ul>
              <li>사진 이름: {previewImageSrc.name}</li>
              <li>사진 크기: {Math.round(previewImageSrc.size / 1024)} KB</li>
            </ul>
          </ActiveModal.Body>
          <ActiveModal.Footer>
            <Button onClick={handleProfileImageModal}>닫기</Button>
          </ActiveModal.Footer>
        </ActiveModal>

        <div className="flex items-center justify-center w-full mx-auto sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl gap-2">
          <Button
            variant="primary"
            type="submit"
            className="w-full mt-4 bg-gray-700 rounded-sm shadow-lg"
            disabled={!isIdCheck}>
            회원가입
          </Button>
        </div>
        <div className="flex items-center justify-center w-full mx-auto sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl gap-2">
          <ActiveLink to="/" className="text-black">
            로그인
          </ActiveLink>
        </div>
      </div>
    </UserLinkPointFormContainer>
  )
}

export default UserSignupPage

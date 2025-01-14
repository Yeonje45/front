import Swal from 'sweetalert2'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { loginUser } from 'features/user/userSlice'

import UserLinkPointFormContainer from 'components/user/containers/UserLinkPointFormContainer'
import ActiveLink from 'components/common/links/ActiveLink'
import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import UserResetInfoModal from 'components/user/modals/UserResetInfoModal'

import logo_img from '../../../assets/project_logo.svg'

import { setCookie } from 'utils/cookie'
import { RequestLogin, CheckLoginValidInputs } from 'models/UserInfoModel'

const UserLoginPage = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	
	const [loginFormState, setLoginFormState] = useState<Record<string, string>>({
		ID: '',
		PW: '',
	})

	// Find OR Reset ID/PW Modal State
	const [findIdPwModalState, setFindIdPwModalState] = useState<boolean>(false)

	// Find ID/PW Modal State Handler
	const findIdPwModalStateHandler = () => {
		setFindIdPwModalState(prev => !prev)
	}

	const changeStateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setLoginFormState(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		
		// 입력 정규식 확인 
		const check_valid_inputs = CheckLoginValidInputs({ user_id: loginFormState.ID, password: loginFormState.PW })
		if (check_valid_inputs !== "") {
			Swal.fire({
				title: '입력 오류',
				text: check_valid_inputs,
				icon: 'error',
				timer: 2000,
				showConfirmButton: false,
			})
			return
		}

		const res = await RequestLogin({ user_id: loginFormState.ID, password: loginFormState.PW })
		if (!res.success || !res.data) {
			Swal.fire({
				title: '로그인 실패',
				text: '입력한 정보를 다시 확인해주세요',
				icon: 'error',
				timer: 2000,
				showConfirmButton: false,
			})
			return
		}

		// Save Redux
		dispatch(
			loginUser({
				user: res.data.user,
				access_token: res.data.access_token,
			}),
		)

		// Save Cookie
		setCookie('access_token', res.data.access_token)
		setCookie('user_id', res.data.user.user_id)

		await Swal.fire({
			title: '로그인 성공',
			icon: 'success',
			timer: 2000,
			showConfirmButton: false,
		}).then(() => {
			navigate('/project/list')
		})

		return
	}

	return (
		<UserLinkPointFormContainer onSubmit={submitHandler}>
			<div className="w-full p-3 mx-auto bg-white border sm:max-w-full md:max-w-md lg:max-w-md xl:max-w-md 2xl:max-w-md rounded-md">
				<div className="flex flex-col items-center w-full gap-2">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<div className="text-right text-xl font-bold text-gray-900">
							Ver.24
						</div>
						<img className="w-auto h-56 mx-auto" src={logo_img} alt="Your Company" />
						<h2 className="text-2xl font-bold tracking-tight text-center text-gray-900 leading-9">
							로그인
						</h2>
					</div>
					<div className="w-full mx-auto sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
						<Input.InputLabel
							label="ID"
							name="ID"
							type="text"
							className="mt-0"
							value={loginFormState.ID}
							onChange={changeStateHandler}
						/>
						<Input.InputLabel
							label="PW"
							name="PW"
							type="password"
							className="mt-0"
							value={loginFormState.PW}
							onChange={changeStateHandler}
						/>
					</div>
				</div>
				<div className="flex items-center justify-center w-full mx-auto mt-5 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl gap-2">
					<Button
						variant="primary"
						type="submit"
						className="w-full bg-gray-700 rounded-sm shadow-lg">
						로그인
					</Button>
				</div>
				<div className="flex items-center justify-center w-full mx-auto mt-3 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl gap-2">
					{/* Modal 
					<UserResetInfoModal
						isOpen={findIdPwModalState}
						closeHandler={findIdPwModalStateHandler}
					/>
					<Button
						className="text-black underline"
						variant="unset"
						onClick={findIdPwModalStateHandler}>
						ID/PW 찾기
					</Button> */}
					<ActiveLink to="/user/signup" className="text-gray-700">
						회원가입
					</ActiveLink>
				</div>
			</div>
			<div className='w-full p-1.5 mx-auto sm:max-w-full md:max-w-md lg:max-w-md xl:max-w-md 2xl:max-w-md rounded-md mt-2'>
				<div className='text-sm text-gray-500 dark:text-gray-400' >
					<p className='text-center'>
						&copy; 2024. (주)모아소프트. All rights reserved.   <br />
					</p>
					<br />
					<p>
					본 프로그램은 방위사업청 누리집에 게시된 '무기체계 소프트웨어 개발 및 관리 매뉴얼'을 참조하여 개발되었습니다. 해당 매뉴얼은 방위사업청의 저작권 개방 정책에 따라 방위사업청과 활용 협의를 하였으며, 방위사업청 누리집(https://www.dapa.go.kr)에서 무료로 다운로드할 수 있습니다.
					</p> 
				</div>
			</div>
		</UserLinkPointFormContainer>
	)
}

export default UserLoginPage

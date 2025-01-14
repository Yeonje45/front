import { isAxiosError } from 'axios'
import { LinkPointAxios, AccessAxios } from 'models'
import { IResponse } from './Response'
import { IUserListModel } from 'models/ProjectInfoModel'

const userIdRegex = /^[a-zA-Z0-9_]{6,12}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{9,}$/;
const contact_01 = /^\d{3}-\d{4}-\d{4}$/;
const contact_02 = /^\d{2,3}-\d{3,4}-\d{4}$/;

export interface ILoginModel {
	id: number,
	user_id: string, // 6~12자의 영문,숫자,_만 사용 가능
	password: string, //  ( A-Z, a-z, 0~9, 특수문자 32개 중 3종류 이상의 조합과 최소 9글자 이상
	user_name: string, // 이름
	user_birth: Date, // YYYY-MM-DD 형식
	user_contact: string[], //  // 010-0000-0000 형식
	user_email: string, // 이메일
	user_company: string, // 회사명
	user_dept: string, // 부서
	user_position: string, // 직책
	user_profile: string, // 이미지 파일 경로
	user_registerDate: Date, // 등록 시간
	user_modifyDate: Date, // 수정 시간
	user_DeleteDate: Date, // 삭제 시간
}

// ID 입력 정규식 확인 
export const CheckUserId = (user_id: string): boolean => {
	return userIdRegex.test(user_id)
}

// PW 입력 정규식 확인
export const CheckPassword = (password: string): boolean => {
	return passwordRegex.test(password)
}

// 로그인 입력 데이터 확인 ( ID, PW )
export const CheckLoginValidInputs = (loginProps: {user_id: string, password: string}): string => {
	if (loginProps.user_id.length === 0 || loginProps.password.length === 0) {
		return "ID혹은 PW은 필수 입력사항입니다."
	}
	if (!userIdRegex.test(loginProps.user_id)) {
		return "ID는 6~12자의 영문,숫자,_만 사용 가능합니다."
	}
	if (!passwordRegex.test(loginProps.password)) {
		return "PW는 ( A-Z, a-z, 0~9, 특수문자 32개 중 3종류 이상의 조합과 최소 9글자 이상이어야 합니다."
	}
	return ""
}

// 로그인 Request
export const RequestLogin = async (loginProps: {user_id: string, password: string}): Promise<{success: boolean, message: string, data: { user: ILoginModel, access_token: string, refresh_token: string } | null}> => {
	try { 
		const res = await LinkPointAxios.post('/users/auth/', {
			...loginProps
		})
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message,
			data: null,
		}
	} catch (error: any) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}			
			return {
				success: false,
				message: errorMessage || error.response.data.message,
				data: null,
			}
	}
}

// 중복 확인 ( ID )
export const CheckDuplicateId = async ( user_id: string): Promise<{ success: boolean; message: string }> => {
	try {
		const res = await LinkPointAxios.post('/users/account/id-check/', {
			user_id: user_id,
		})
		if (res.status == 200) {
			return {
				success: true,
				message: '사용 가능한 아이디입니다.',
			}
		}
		return {
			success: false,
			message: '이미 존재하는 아이디입니다.',
		}
	} catch (error) {
		let errorMessage: string = ''
		if (isAxiosError<IResponse<string>>(error)) {
			if (error.response === undefined) {
				return {
					success: false,
					message: '서버와의 연결이 끊겼습니다.',
				}
			}
			const errorData = error.response!.data
			errorMessage = Array.isArray(errorData.error)
				? errorData.error.join('\n')
				: errorData.error
		}
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export interface ISignupValidInputsProps {
	user_id: string // 6~12자의 영문,숫자,_만 사용 가능
	password: string //  ( A-Z, a-z, 0~9, 특수문자 32개 중 3종류 이상의 조합과 최소 9글자 이상
	contact_1: string // 010-0000-0000 형식
}
// 회원가입 입력 데이터 확인 ( ID, PW )
export const CheckSignupValidInputs = (signupProps: ISignupValidInputsProps): string => {
	if (signupProps.user_id.length === 0 || signupProps.password.length === 0) {
		return "모든 항목은 필수 입력사항입니다."
	}
	if (!userIdRegex.test(signupProps.user_id)) {
		return "ID는 6~12자의 영문,숫자,_만 사용 가능합니다."
	}
	if (!passwordRegex.test(signupProps.password)) {
		return "PW는 ( A-Z, a-z, 0~9, 특수문자 32개 중 3종류 이상의 조합과 최소 9글자 이상이어야 합니다."
	}
	if (!contact_01.test(signupProps.contact_1)) {
		return "휴대전화는 하이픈 (-) 포함 13자리 형식으로 입력해주세요."
	}
	return ""
}

export interface ISignupProps {
	user_id: string;
	user_name: string;
	user_dept: string;
	user_position: string;
	user_company: string;
	user_email: string;
	user_contact: string;
	user_birth: string;
	password: string;
	user_profile: File | null;
}
export const RequestSignup = async (signupProps: ISignupProps): Promise<{ success: boolean; message: string, data: null }> => {
	try { 
		const form = new FormData()
		form.append('user_id', signupProps.user_id)
		form.append('user_name', signupProps.user_name)
		form.append('user_dept', signupProps.user_dept)
		form.append('user_position', signupProps.user_position)
		form.append('user_company', signupProps.user_company)
		form.append('user_email', signupProps.user_email)
		form.append('user_contact', signupProps.user_contact)
		form.append('user_birth', signupProps.user_birth)
		form.append('password', signupProps.password)
		if (signupProps.user_profile) {
			form.append('user_profile', signupProps.user_profile)
		}
		const res = await LinkPointAxios.post('/users/account/', form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		if (res.data.state === 201) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message,
			data: null,
		}
	} catch (error: any) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}			
			return {
				success: false,
				message: errorMessage || error.response.data.message,
				data: null,
			}
	}
}

export class UpdateUserModel {
	constructor(
		public user_id: string,
		public user_name: string,
		public user_dept: string,
		public user_position: string,
		public user_company: string,
		public user_contact: string,
		public user_email: string,
		public user_birth: string,
		public password: string,
		public user_profile: any,
	) {
		this.user_id = user_id
		this.user_name = user_name
		this.user_dept = user_dept
		this.user_position = user_position
		this.user_company = user_company
		this.user_contact = user_contact
		this.user_email = user_email
		this.user_birth = user_birth
		this.password = password
		this.user_profile = user_profile
	}

	// 서버로 회원 정보 수정 요청 보내기
	public updateUserInfo = async (
	): Promise<{ success: boolean; message: string }> => {
			try {
				const form = new FormData()
				form.append('user_id', this.user_id)
				form.append('user_name', this.user_name)
				form.append('user_dept', this.user_dept)
				form.append('user_position', this.user_position)
				form.append('user_company', this.user_company)
				form.append('user_email', this.user_email)
				form.append('user_contact', this.user_contact)
				form.append('user_birth', this.user_birth)
				form.append('password', this.password)
				form.append('user_profile', this.user_profile)

				await LinkPointAxios.put('/users/edit/', form, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				return {
					success: true,
					message: '회원정보 수정에 성공했습니다.',
				}
			} catch (error: any) {
				return {
					success: false,
					message: error.response.data.message || error.response.data.error || "회원정보 수정에 실패했습니다.",
				}
			}
	}

	// ID 정규식 확인 ( 6~12자의 영문,숫자,_만 사용 가능 )
	public isValidUserId = (user_id: string): boolean => {
		const regex = /^[a-zA-Z0-9_]{6,12}$/
		return regex.test(user_id)
	}

	// PW 정규식 확인 ( A-Z, a-z, 0~9, 특수문자 32개 중 3종류 이상의 조합과 최소 9글자 이상
	public isValidPassword = (password: string): boolean => {
		const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{9,}$/
		return regex.test(password)
	}

	// 이름 정규식 확인 ( 한글 또는 영문 대소문자만 사용 가능 )
	public isValidName = (user_name: string): boolean => {
		// const regex = /^[가-힣a-zA-Z]+$/
		if (user_name.length === 0) return false
		// return regex.test(user_name)
		return true
	}

	// 생년월일 정규식 확인 ( YYYY-MM-DD 형식 )
	public isValidBirth = (user_birth: string): boolean => {
		const regex = /^\d{4}-\d{2}-\d{2}$/
		if (user_birth.length === 0) return false
		return regex.test(user_birth)
	}

	// 연락처 정규식 ( 현재는 Integer로 처리 )
	public isValidContact = (contact: number): boolean => {
		if (contact == 0) {
			return false
		}
		return true
		// return regex.test(contact)
	}

	// 이메일 정규식 확인
	public isValidEmail = (user_email: string): boolean => {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		if (user_email.length === 0) return false
		return regex.test(user_email)
	}

	// 부서 정규식 확인
	public isValidDept = (user_dept: string): boolean => {
		// const regex = /^[가-힣a-zA-Zuser_]+$/
		if (user_dept.length === 0) return false
		// return regex.test(user_dept)
		return true
	}

	// 직책 정규식 확인
	public isValidPosition = (position: string): boolean => {
		// const regex = /^[가-힣a-zA-Z]+$/
		if (position.length === 0) return false
		// return regex.test(position)
		return true
	}

	// 회사 정규식 확인
	public isValidCompany = (user_company: string): boolean => {
		// const regex = /^[가-힣a-zA-Z]+$/
		if (user_company.length === 0) return false
		// return regex.test(user_company)
		return true
	}

}

/* 사용자 조회/관리 페이지 - 사용자 활성화/비활성화 */
export const AssignUserActive = async ({user_id}: { user_id: string }): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`authorities/assign/`, { 
			user_id
    })
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message,
			data: null,
		}
	} catch (error: any) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}			
			return {
				success: false,
				message: errorMessage || error.response.data.message,
				data: null,
			}
	}
}

export interface IAssignUserListModel {
	project_id: string;
	project_name: string;
	project_member: IUserListModel[];
	system_member: IUserListModel[];
}
/* 사용자 조회/관리 페이지 - 사용자 수정 버튼 클릭 시에 ( 모달에서 사용하는 데이터 ) */
export const GetAssignUserList = async (): Promise<{ success: boolean, message: string, data: IAssignUserListModel[] | null }> => {
	try { 
		const res = await AccessAxios.post(`authorities/project/`, { 
    })
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message,
			data: null,
		}
	} catch (error: any) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}			
			return {
				success: false,
				message: errorMessage || error.response.data.message,
				data: null,
			}
	}
}

export const ResetPassword = async (user_id: string): Promise<{ success: boolean, message: string, data: string }> => {
	try { 
		const res = await AccessAxios.post(`users/account/reset-password/`, { 
			user_id
    })
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message,
			data: "",
		}
	} catch (error: any) {
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || "비밀번호 초기화에 실패하였습니다.",
			data: "",
		}
	}
}

export const ChangePassword = async (user_id: string, password: string, new_password: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`users/account/change-password/`, { 
			user_id,
			password,
			new_password
    })
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message,
			data: null,
		}
	} catch (error: any) {
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || "비밀번호 변경에 실패하였습니다.",
			data: null,
		}
	}
}

import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'


export interface IPeerReviewCategoryPeermentionsModel { // peer_mentions [ 맨션 ]
	peer_mention_id: number
	peer_comment_id: number | undefined
	peer_reply_id: number | undefined
	mention_user_id: string
}
export interface IPeerReviewCategoryPeerrepliesModel { // peer_replies [ 답글/댓글/리플 ]
	peer_reply_id: number
	peer_comment_id: number
	peer_reply_writer: string
	peer_reply_state: string
	peer_reply_content: string
	peer_reply_date: string
	peer_mentions: IPeerReviewCategoryPeermentionsModel[]
}
export interface IPeerReviewCategoryModel { // peer-reviews/comment/ 응답 데이터 모델
	peer_comment_id: number
	peer_comment_writer: string
	peer_comment_state: string
	peer_comment_title: string
	peer_comment_content: string
	peer_comment_date: string
	peer_comment_is_issue: boolean
	peer_chapter_id: number
	peer_comment_key: number
	peer_mentions: IPeerReviewCategoryPeermentionsModel[]
	peer_replies: IPeerReviewCategoryPeerrepliesModel[]
}

// PeerReview_목록 조회
interface IPeerReviewCategoryProps {
	project_id: string
	peer_comment_key: number
	peer_chapter: string
}
export const GetPeerReviewCategories = async (getProps: IPeerReviewCategoryProps): Promise<{ success: boolean, message: string, data: IPeerReviewCategoryModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`peer-reviews/comment/?project_id=${getProps.project_id}&peer_comment_key=${getProps.peer_comment_key}&peer_chapter=${getProps.peer_chapter}`, {
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

/** PeerReview 이슈 등록 요청 [Peer Review 항목 이슈 등록]
 * 기존 PeerReview를 이슈로 등록하는 요청
 */
interface ISignupPeerReviewIssueProps {
	project_id: string 
	peer_comment_id: number
}
export const SignupPeerReviewIssue = async (signupProps: ISignupPeerReviewIssueProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`peer-reviews/comment/`, {
			...signupProps
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

/** PeerReview 신규 등록 요청 [PeerReview_신규 등록_요청]
 * 새로운 PeerReview를 등록하는 요청
 */
interface ICreatePeerReviewProps {
	peer_chapter: string 
	peer_comment_state: string 
	peer_comment_title: string 
	peer_comment_content: string 
	peer_comment_key: number 
	mention_user_id_list: string[]
}
export const CreatePeerReview = async (createProps: ICreatePeerReviewProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`peer-reviews/comment/`, {
			...createProps
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

/** PeerReview 수정 요청 */
interface IUpdatePeerReviewProps {
	peer_comment_id: number
	peer_comment_state: string
	peer_comment_title: string
	peer_comment_content: string
	mention_user_id_list: string[]
}
export const UpdatePeerReview = async (updateProps: IUpdatePeerReviewProps): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.patch(`peer-reviews/comment/`, {
			...updateProps
		})
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message,
				data: null,
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

/** PeerReview 삭제 요청 */
interface IDeletePeerReviewProps {
	peer_comment_id: number
}
export const DeletePeerReview = async ({peer_comment_id}: IDeletePeerReviewProps): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.delete(`peer-reviews/comment/?peer_comment_id=${peer_comment_id}`, { })
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message,
				data: null,
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

/** PeerReview 상태 단일 수정 요청 */
interface IUpdatePeerReviewStateProps {
	peer_comment_id: number
	peer_comment_state: string
}
export const UpdatePeerReviewState = async (updateProps: IUpdatePeerReviewStateProps): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.patch(`peer-reviews/state/`, {
			...updateProps
		})
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message,
				data: null,
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

/** PeerReview Reply 답글/댓글/리플 등록 요청 */
interface ICreatePeerReviewReplyProps {
	peer_comment_id: number
	peer_reply_state: string 
	peer_reply_content: string
	mention_user_id_list: string[]
}
export const CreatePeerReviewReply = async (createProps: ICreatePeerReviewReplyProps): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.put(`peer-reviews/reply/`, {
			...createProps
		})
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message,
				data: null,
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

/** PeerReview Reply 답글/댓글/리플 수정 요청 */
interface IUpdatePeerReviewReplyProps {
	peer_reply_id: number
	peer_comment_id: number
	peer_reply_state: string
	peer_reply_content: string
	mention_user_id_list: string[]
}
export const UpdatePeerReviewReply = async (updateProps: IUpdatePeerReviewReplyProps): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.patch(`peer-reviews/reply/`, {
			...updateProps
		})
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message,
				data: null,
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

/** PeerReview Reply 답글/댓글/리플 삭제 요청 */
export const DeletePeerReviewReply = async ({peer_reply_id}: {peer_reply_id: number}): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.delete(`peer-reviews/reply/?peer_reply_id=${peer_reply_id}`, { })
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message,
				data: null,
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

/** PeerReview  기능용 사용자 정보 구성 (PKID, 이름) 요청 */
export interface IPeerReviewUser {
	user_id: string
	user_name: string
}

/** PeerReview 기능용 사용자 정보 요청 */
export const GetPeerReviewUsers = async (project_id: string): Promise<{ success: boolean, message: string, data: IPeerReviewUser[] | [] }> => {
	try {
		const res = await AccessAxios.get(`peer-reviews/user/?project_id=${project_id}`)
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
			data: [],
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
			data: [],
		}
	}
}
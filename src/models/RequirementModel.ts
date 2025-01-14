import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'

export type RequirementChildren = {
	req_group_code_child: number;
	req_group_name_child: string;
	req_group_device_child: string;
};

export type RequirementChildrenGroup = {
    group_name: string;
		req_group_device: string;
    child_groups: RequirementChildren[];
};

// 요구사항 탐색기 그룹 모델
export type RequirementGroupModel = {
	group_name: string;
	[key: number]: RequirementChildrenGroup;
};

/** 요구사항 그룹 조회 함수입니다.
 * @param project_id 프로젝트 PK
*/
export const GetRequirementGroup = async (project_id: string): Promise<{ 
	success: boolean, 
	message: string, 
	data: { [key: number]: RequirementChildrenGroup } | null }> => {
	try {
		const res = await AccessAxios.get(`/requirements/explorer/?project_id=${project_id}`)

		return {
			success: true,
			message: res.data.message, 
			data: res.data.data,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 그룹 생성 함수입니다.
*/
// # TODO: parameter 이름 변경 필요, type 이름 변경 필요
export const CreateRequirementGroup = async (req: any): Promise<{
	success: boolean,
	message: string,
	data: null }> => {
	try {
		const res = await AccessAxios.post(`/requirements/explorer/`, {
			...req
		})

		return {
			success: true,
			message: res.data.message, 
			data: res.data.data,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 그룹 삭제 함수입니다.
 * @param req_group_code 요구사항 그룹 PK
*/
export const DeleteRequirementGroup = async (req_group_code: string): Promise<{
	success: boolean, 
	message: string, 
	data: null }> => {
	try {
		const res = await AccessAxios.delete(`/requirements/explorer/?req_group_code=${req_group_code}`)

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: null,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 그룹 수정 시에 사용하는 중복 체크 함수입니다. 
 * @param req_group_name 변경하려는 요구사항 이름
 * @param project_id 프로젝트 PK
*/

export const checkDuplicateCSUName = async (req_group_name: string, project_id: string): Promise<{ success: boolean, message: string, data: {req_group_code: number, req_group_name: string} | null }> => {
	try {
		const res = await AccessAxios.get(`/requirements/group/?req_group_name=${req_group_name}&project_id=${project_id}`)

		return {
			success: res.request.status,
			message: res.data.message, 
			data: res.data.data,
		}

	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 그룹 수정 함수입니다.
 * @param req_group_code 요구사항 그룹 PK 
 * @param req_group_name 변경하려는 요구사항 이름
*/
export const EditRequirementGroup = async (req_group_code: number, req_group_name: string): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.patch(`/requirements/explorer/`, {
			req_group_code: req_group_code,
			req_group_name: req_group_name,
		})

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: null,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

export type RequirementModel = {
	req_id: string
	req_number: string 
	req_title: string
	req_content: string
	req_tvm_code: string
	req_assort_code: string
	req_update_content: string
	req_create_date: string
	req_update_date: string
}

/** 요구사항 그룹에 해당하는 요구사항을 조회하는 함수입니다. 
 * @param project_id 프로젝트 PK 
 * @param req_group_code 요구사항 그룹 PK
 */
export const GetRequirements = async (project_id: string, req_group_code: number, req_classification_code: string): Promise<{ success: boolean, message: string, data: RequirementModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`/requirements/manage/?project_id=${project_id}&req_group_code=${req_group_code}&req_classification_code=${req_classification_code}`)
		if (res.data.state == 200) {
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
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

export type CreateRequirementModel = {
	req_group_code : string// 요구사항 분류 PK
	req_assort_code : string // 요구사항 분류 PK
	req_number: string // 요구사항 식별자
	req_title: string // 요구사항 제목
	req_content: string // 요구사항 내용
	req_tvm_code: string // 시험/검증방법
}

/** 요구사항 생성 시에 식별자 중복 체크 함수입니다.
 *	@param req_number 요구사항 식별자
 *	@param project_id 프로젝트 PK
 */
export const CheckDuplicateReqNumber = async (req_number: string, project_id: string): Promise<{ success: boolean, message: string, data: {req_number: string} | null }> => {
	try {
		const res = await AccessAxios.get(`/requirements/edit/?project_id=${project_id}&req_number=${req_number}`)

		return {
			success: res.request.status,
			message: res.data.message, 
			data: res.data.data,
		}

	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 생성 함수입니다.
	* @param CreateRequirementModel : 프로젝트 생성에 필요한 정보
	* @param req_classification_code : 요구사항 분류 PK
	*/
export const CreateRequirement = async (createdReq: CreateRequirementModel, req_classification_code: string): Promise<{success: boolean, message: string, data: null}> => {
	try { 
		const res = await AccessAxios.post(`/requirements/edit/`, {
			req_group_code: createdReq.req_group_code,
			req_assort_code: createdReq.req_assort_code,
			req_number: createdReq.req_number,
			req_title: createdReq.req_title,
			req_content: createdReq.req_content,
			req_tvm_code: createdReq.req_tvm_code,
			req_classification_code: req_classification_code
		})
		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data,
			}
		}
		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}
			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

export type CreateTestRequirementModel = {
	req_group_code : string// 요구사항 분류 PK
	req_assort_code : string // 요구사항 분류 PK
	req_number: string // 요구사항 식별자
	req_title: string // 요구사항 제목
	req_content: string // 요구사항 내용
}

/** 요구사항 설계 생성 함수입니다.
	* @param CreateRequirementModel : 프로젝트 생성에 필요한 정보
	*/
export const CreateTestRequirement = async (createdReq:CreateTestRequirementModel, req_classification_code: string): Promise<{success: boolean, message: string, data: null}> => {
	try { 
		const res = await AccessAxios.post(`/requirements/edit/`, {
			req_group_code: createdReq.req_group_code,
			req_assort_code: createdReq.req_assort_code,
			req_number: createdReq.req_number,
			req_title: createdReq.req_title,
			req_content: createdReq.req_content,
			req_tvm_code: "",
			req_classification_code: req_classification_code
		})

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	} }

/** 요구사항 삭제 함수입니다. 
 * @param req_id_list 요구사항 PK 배열
 */
export const DeleteRequirement = async (req_id_list: string[]): Promise<{ success: boolean, message: string, data: null }> => {
	try {
		const res = await AccessAxios.delete(`/requirements/edit/`, {
			data: {
				req_id_list: req_id_list
			}
		})

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: null,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 Import 함수입니다.
 *	@param project_id 프로젝트 PK
 *	@param file 파일 정보를 담고 있는 Form ( Import를 목적으로 하는 파일 ) 
 */
export const ImportRequirements = async (project_id: string, formBody: FormData): Promise<{ success: boolean, message: string, data: string[][] | null }> => {
	try {
		const res = await AccessAxios.post(`/requirements/import/`, formBody)

		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}

		return {
			success: false,
			message: "", 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

// 요구사항 편집 페이지 - Import 템플릿 다운로드 함수
export const DownloadConfigurationFile = async (): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		window.open(`${process.env.REACT_APP_BASE_URL}requirements/import/`)
		return {
		  success: true,
		  message: '파일 다운로드 성공',
		  data: null,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || '파일 다운로드 실패',
			data: null,
		}
	}
}

export type UpdateRequirementModel = {
	req_assort_code: string 
	req_number: string 
	req_title: string 
	req_content: string 
	req_tvm_code: string 
	req_update_content: string 
	req_id: string
}


/** 요구사항 수정 함수입니다.
	* @param UpdateRequirementModel : 프로젝트 생성에 필요한 정보
	*/
export const UpdateRequirement = async (updatedReq: UpdateRequirementModel): Promise<{success: boolean, message: string, data: null}> => {
	try { 
		const res = await AccessAxios.patch(`/requirements/edit/`, {
			req_assort_code: updatedReq.req_assort_code,
			req_number: updatedReq.req_number,
			req_title: updatedReq.req_title,
			req_content: updatedReq.req_content,
			req_tvm_code: updatedReq.req_tvm_code,
			req_update_content: updatedReq.req_update_content,
			req_id: updatedReq.req_id
		})

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/** 요구사항 그룹 이동 및 할당에 사용되는 함수입니다. 그룹 분류 중 CSC 정보만을 가져옵니다. 
 * @param project_id 프로젝트 PK
 */
export const GetCSCGroupsArray = async (res: { [key: number]: RequirementGroupModel }): Promise<({ [key: number]: RequirementChildrenGroup } | undefined) | void> => {
	if (!res || Object.keys(res).length <= 0) {
		return
	}

	const csc_group = Object.keys(res).map((item) => {
		if (!res) {
			return
		}

		const csc_groups = res[+item]
		if (!csc_groups) {
			return 
		}

		return csc_groups
	})

	if (!csc_group) { return }

	let merged = {}
	Object.keys(csc_group).forEach((key) => {
		if (key == "group_name") { return }

		const group = csc_group[+key]
		if (!group) {
			return
		}

		Object.keys(group).map((item) => {
			if (item == "group_name") { return }

			merged = {...merged, [item]: group[+item]}
			return
		})
		return merged
	})

	return merged
}

/** 요구사항 그룹 이동 및 할당에 사용되는 함수입니다. CSC 배열 중에 CSU 정보를 CSC ID로 가져옵니다. 
 * @param CSC_groups CSC 그룹 배열 
 * @param CSC_key CSC ID  
 */
export const GetCSUGroupsArrayByCSCID = async (CSC_groups: { [key: number]: RequirementChildrenGroup }, CSC_key: number): Promise<(RequirementChildren[] | undefined)[]> => {
	if ( !Object.keys(CSC_groups).length ) { return [] }

	const merged = Object.keys(CSC_groups).map((csc_group_key) => {
		if ( csc_group_key != CSC_key.toString() ) {
			return
		}
		if (!CSC_groups[+csc_group_key].child_groups) {
			return
		}

		return CSC_groups[+csc_group_key].child_groups
	})

	return merged.filter((item) => item !== undefined)
}

/** 요구사항 그룹 이동 및 할당에 사용되는 함수입니다. CSC ID로 요구사항 그룹 ID를 가져옵니다.
 * @param req_list 요구사항 그룹 리스트
 * @param CSCkey CSC ID
 */
export const GetRequirementGroupIDByCSCID = async (req_list: {[key: number]: RequirementGroupModel}, CSCkey: string ): Promise<string> => {
	if ( !Object.keys(req_list).length ) { return "" }

	let find_key: string = ""
	Object.keys(req_list).map((req_group_key) => {
		if (!req_list[+req_group_key]) {
			return
		}

		if (req_list[+req_group_key][+CSCkey]) {
			find_key = req_group_key
		}
		return
	})
	return find_key
}

/** 요구사항 이동 및 할당 함수입니다.
 * @param req_group_code 요구사항 이동 및 할당을 목적으로 하는 그룹 경로
 * @param req_id 선택 된 요구사항 PK 
 */ 
export const MoveRequirement = async (req_group_code: number[], req_id: string[], delete_id: string | null, project_id: string): Promise<{success: boolean, message: string, data: null}> => {
	try { 
		const res = await AccessAxios.post(`/requirements/group/?project_id=${project_id}`, {
			del_group_code: delete_id,
			req_group_code: req_group_code,
			req_id: req_id,
		})

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

/* baseline 버전 등록 요청 */
export const RequestBaselineVersion = async (project_id: string, baseline_request_comment: string): Promise<{success: boolean, message: string, data: null}> => {
	try { 
		const res = await AccessAxios.post(`baselines/req-version/`, {
			project_id: project_id,
			baseline_request_comment: baseline_request_comment,
		})

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error) {
			let errorMessage: string = ''
			if (isAxiosError<IResponse<string>>(error) && error.response) {
				const errorData = error.response.data
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error
			}

			return {
				success: false,
				message: errorMessage,
				data: null,
			}
	}
}

interface ISendImportRequirementsFileProps {
  project_id: string
  file: File
}
/* 요구사항 편집 페이지 - 요구사항 Import 완료 */
export const SendImportRequirementsFile = async ({project_id, file}:ISendImportRequirementsFileProps): Promise<{success: boolean, message: string, data: null}> => {
	try { 
	  const formBody = new FormData()
	  formBody.append('project_id', project_id)
	  formBody.append('file', file)
		const res = await AccessAxios.post(`requirements/support/`, formBody)

		if (res.data.success) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || '요구사항 Import 실패',
				data: null,
			}
	}
}

// 요구사항 목록 Export 내보내기를 해주는 함수
export const ExportRequirementList = async ({project_id}: {project_id: string}): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		window.open(`${process.env.REACT_APP_BASE_URL}requirements/support/?project_id=${project_id}`)
		return {
		  success: true,
		  message: '요구사항 내보내기 성공',
		  data: null,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || '요구사항 내보내기 성공',
			data: null,
		}
	}
}

// 현재 요구사항 버전 등록 시에 생기는 버전 정보를 가져오기
export interface IGetRequirementVersionModel {
	baseline_number: string,
	is_trace: boolean,
}
export const GetRequirementVersion = async (project_id: string): Promise<{ success: boolean, message: string, data: IGetRequirementVersionModel | null }> => {
	try { 
		const res = await AccessAxios.get(`baselines/req-version/?project_id=${project_id}`)

		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || '요구사항 Import 실패',
				data: null,
			}
	}
}

/* Edit Mode의 상태를 가져옵니다. 
  * 현재 특정 사용자가 Edit Mode를 활성화 했는지 여부를 가져옵니다.
  */
export const getEditModeState = async (project_id: string, edit_doc_type: string): Promise<{ success: boolean, message: string, data: { user_id: string, edit_doc_type: string } | null }> => {
	try { 
		const res = await AccessAxios.get(`documents/editmode/?project_id=${project_id}&edit_doc_type=${edit_doc_type}`)

		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || 'Edit Mode 상태 가져오기 실패',
				data: null,
			}
	}
}

/** Edit Mode의 상태를 변경합니다. 
  * On 일 시에는 Edit Mode를 활성화하고 true를 보내고, Off 일 시에는 Edit Mode를 비활성화하고 false를 보냅니다.
  */
export const changeEditModeState = async (project_id: string, edit_doc_type: string, is_edit: boolean): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`documents/editmode/`, {
		  project_id,
		  edit_doc_type,
		  is_edit,
		})

		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}

		return {
			success: true,
			message: res.data.message, 
			data: null,
		}
	} catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || 'Edit Mode 상태 변경 실패',
				data: null,
			}
	}
}

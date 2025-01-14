import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'

/* 상태에 따른, 상태 코드에 따른 텍스트 반환 함수 */
export const GetStatusByStatusCode = (status: string): string => {
	switch(status) {
		case 'apr':
			return '승인'
		case 'rjc':
			return '거절'
		case 'del':
			return '삭제 완료'
		case 'drq':
			return '삭제 요청'
		case 'rqt':
			return '검토중'
		case 'edt':
			return '편집중'
		case null:
			return '최초생성'
		default:
			return ''
	}
}

/* 버전 및 산출물 관리 */
/** 산출물 관리 패널 데이터
 * @param project_id 프로젝트 ID
 */
export interface IProductManagementPanelModel {
	std_output_id: number;
	std_output_name: string;
}
export const GetProductManagementPanelData = async (project_id: string): Promise<{ success: boolean, message: string, data: IProductManagementPanelModel[] | null }> => {
	try { 
		const res = await AccessAxios.post(`/versions/output-file/`, {
			project_id: project_id,
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

/** 산출물 관리 테이블 데이터
 * @param categories 산출물 관리 페이지 카테고리
 */
export interface IProductManagementModel {
	output_version_id?: number;
	std_output_id: number;
	std_output_name: string;
	output_content_file_name: string | null;
	output_content_file: string | null;
	output_content_state: string;
	output_content_update_date: string;
	output_content_update_person: string;
	output_content_update_person_name: string | null;
	latest_output_content_name: string;
	latest_output_content_chapter: string;
	latest_output_content_work: string;
}
export const GetProductManagementTableData = async (categories: number[]): Promise<{ success: boolean, message: string, data: IProductManagementModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`/versions/output/?std_output_list=[${categories.join(',')}]`, {
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

/** 산출물 관리 테이블 자세히 보기 버튼 
 * @param std_output_id 산출물 ID
 */
export interface IProductManagementTableDetailModel {
	output_content_name: string;
	output_content_work: string;
	output_content_chapter: string;
}
export const GetProductManagementTableDetailData = async (std_output_id: number): Promise<{ success: boolean, message: string, data: IProductManagementTableDetailModel[] | null }> => {
	try { 
		const res = await AccessAxios.post(`/versions/output/`, {
				output_version_id: std_output_id,
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

/** 산출물 관리 테이블 데이터 다운로드
 *
 */
export const DownloadProductManagementTableData = async (output_version_id: number): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		window.open(`${process.env.REACT_APP_BASE_URL}versions/output-file/?output_version_id=${output_version_id}`)
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

/** 요구사항 관리 테이블 데이터
 * @param project_id 프로젝트 ID
 */
export interface IRequirementManagementModel {
	baseline_id: number;
	baseline_number: string;
	baseline_state: string | null;
	baseline_request_date: string | null;
	baseline_approval_date: string | null;
	baseline_approval_id: string;
	baseline_approval_comment: string;
	baseline_request_id: string;
	baseline_request_comment: string;
	baseline_comment: string | null;
	baseline_approval_name: string | null;
	baseline_request_name: string | null;
}
export const GetRequirementManagementTableData = async (project_id: string): Promise<{ success: boolean, message: string, data: IRequirementManagementModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`/versions/req/?project_id=${project_id}`, {
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

/** 요구사항 관리 테이블에서 승인/반려 */
export interface IApproveAndRejectRequirementManagementTableDataParams {
		baseline_id: string
		baseline_state: string
		baseline_approval_comment: string
}
export const ApproveAndRejectRequirementManagementTableData = async ({baseline_id, baseline_state, baseline_approval_comment}: IApproveAndRejectRequirementManagementTableDataParams): Promise<{ success: boolean, message: string, data: null }> => {
	const responseComment = baseline_state === 'apr' ? '승인' : '반려'
	try { 
		const res = await AccessAxios.post(`/versions/req/`, {
			baseline_id: baseline_id,
			baseline_state: baseline_state,
			baseline_approval_comment: baseline_approval_comment,
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
			message: res.data.message || `${responseComment} 요청 실패`, 
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
				message: errorMessage || error.response.data.message || `${responseComment} 요청 실패`,
				data: null,
			}
	}
}

/* 시험 관리 */
/** 시험 관리 테이블 데이터
 * @param project_id 프로젝트 ID
 */
export interface ITestManagementTCModel {
	tc_version_id: number;
	tc_version_name: string;
	tc_version_status: string;
	requester_date: string | null;
	approver_date: string | null;
	requester_user_id: string | null;
	requester_comment: string | null;
	approver_user_id: string | null;
	approver_comment: string | null;
	tc_version_content: string;
	requester_user_name: string | null;
	approver_user_name: string | null;
}
export interface ITestManagementTRModel {
	tr_version_id: number;
	tr_version_name: string;
	tr_version_status: string;
	requester_date: string | null;
	approver_date: string | null;
	requester_user_id: string | null;
	requester_comment: string | null;
	approver_user_id: string | null;
	approver_comment: string | null;
	tr_version_content: string;
	requester_user_name: string | null;
	approver_user_name: string | null;
}
export interface ITestManagementModel {
	tc_data: ITestManagementTCModel[]
	tr_data: ITestManagementTRModel[]
}
export const GetTestManagementTableData = async (project_id: string): Promise<{ success: boolean, message: string, data: ITestManagementModel | null }> => {
	try { 
		const res = await AccessAxios.get(`/versions/test/?project_id=${project_id}`, {
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

/* 소스코드 관리 */
/** 소스코드 관리 테이블 데이터
 * @param project_id 프로젝트 ID
 */
export interface ISourceCodeManagementModel {
	src_version_id: number;
	src_version_name: string;
	src_version_status: string;
	requester_date: string | null;
	approver_date: string | null;
	src_version_content: string;
	requester_user_id: string | null;
	approver_user_id: string | null;
	approver_comment: string | null;
	requester_user_name: string | null;
	approver_user_name: string | null;
}
export const GetSourceCodeManagementTableData = async (project_id: string): Promise<{ success: boolean, message: string, data: ISourceCodeManagementModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`/versions/source/?project_id=${project_id}`, {
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

/** 요구사항 관리 테이블에서 승인/반려 */
export interface IApproveAndRejectTestTrManagementTableDataParams {
		tr_version_id: string
		tr_version_status: string
		approval_comment: string
}
export const ApproveAndRejectTestTrManagementTableData = async ({tr_version_id, tr_version_status, approval_comment}: IApproveAndRejectTestTrManagementTableDataParams): Promise<{ success: boolean, message: string, data: null }> => {
	const responseComment = tr_version_status === 'apr' ? '승인' : '반려'
	try { 
		const res = await AccessAxios.post(`/versions/test/`, {
			tr_version_id: tr_version_id,
			tr_version_status: tr_version_status,
			approver_comment: approval_comment,
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
			message: res.data.message || `${responseComment} 요청 실패`, 
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
				message: errorMessage || error.response.data.message || `${responseComment} 요청 실패`,
				data: null,
			}
	}
}
/** 요구사항 관리 테이블에서 승인/반려 */
export interface IApproveAndRejectTestTcManagementTableDataParams {
		tc_version_id: string
		tc_version_status: string
		approval_comment: string
}
export const ApproveAndRejectTestTcManagementTableData = async ({tc_version_id, tc_version_status, approval_comment}: IApproveAndRejectTestTcManagementTableDataParams): Promise<{ success: boolean, message: string, data: null }> => {
	const responseComment = tc_version_status === 'apr' ? '승인' : '반려'
	try { 
		const res = await AccessAxios.post(`/versions/test/`, {
			tc_version_id: tc_version_id,
			tc_version_status: tc_version_status,
			approver_comment: approval_comment,
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
			message: res.data.message || `${responseComment} 요청 실패`, 
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
				message: errorMessage || error.response.data.message || `${responseComment} 요청 실패`,
				data: null,
			}
	}
}

export interface IDeleteSurceCodeManagementTableDataParams {
	src_version_id: number;
	src_version_status: string;
}
/** 소스코드 관리 테이블 데이터 삭제
 * @param IDeleteSurceCodeManagementTableDataParams
 */
export const DeleteSourceCodeManagementTableData = async ({src_version_id, src_version_status}: IDeleteSurceCodeManagementTableDataParams): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.delete(`/versions/source/?src_version_id=${src_version_id}&src_version_status=${src_version_status}`)
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message || '삭제 요청 실패', 
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
				message: errorMessage || error.response.data.message || '삭제 요청 실패',
				data: null,
			}
	}

}

/** 소스코드 관리 테이블에서 승인/반려 */
export interface IApproveAndRejectSourceCodeManagementTableDataParams {
		src_version_id: string
		src_version_status: string
		approver_comment: string
}
export const ApproveAndRejectSourceCodeManagementTableData = async ({src_version_id, src_version_status, approver_comment}: IApproveAndRejectSourceCodeManagementTableDataParams): Promise<{ success: boolean, message: string, data: null }> => {
	const responseComment = src_version_status === 'apr' ? '승인' : '반려'
	try { 
		const res = await AccessAxios.delete(`/versions/source/?src_version_id=${src_version_id}&src_version_status=${src_version_status}&approver_comment=${approver_comment}`)
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message || `${responseComment} 요청 실패`, 
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
				message: errorMessage || error.response.data.message || `${responseComment} 요청 실패`,
				data: null,
			}
	}
}

/** 소스코드 관리 테이블 데이터 등록 ( 추가 )  */
export interface IAddSourceCodeManagementTableDataParams {
	project_id: string
  src_version_name: string
  file: File
  src_version_content: string
}
export const AddSourceCodeManagementTableData = async ({project_id, src_version_name, file, src_version_content}: IAddSourceCodeManagementTableDataParams): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const formData = new FormData()
		formData.append('file', file)
		formData.append('src_version_name', src_version_name)
		formData.append('src_version_content', src_version_content)
		formData.append('project_id', project_id)
		const res = await AccessAxios.put(`/versions/source/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
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
			message: res.data.message || `소스 코드 추가 실패`, 
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
				message: errorMessage || error.response.data.message || `소스 코드 추가 실패`,
				data: null,
			}
	}
}

/** 소스코드 관리 테이블 편집 시에 파일 목록 데이 조회 */
export interface IGetSourceCodeManagementTableEditFileListDataParams {
	src_version_id: number
}
export interface IGetSourceCodeManagementTableEditFileListDataModel { // [] type
	src_file_id: number
	src_version_id: number
	src_file_name: string
	src_file_path: string
	src_file_byte: number
	src_file_checksum: string
	src_file_create_at: string
	src_file_line: number
	src_file_content: string
}
export const GetSourceCodeManagementTableEditFileListData = async ({src_version_id}: IGetSourceCodeManagementTableEditFileListDataParams): Promise<{ success: boolean, message: string, data: IGetSourceCodeManagementTableEditFileListDataModel[] | null }> => {
	try { 
		const res = await AccessAxios.post(`/versions/source/`, {
			src_version_id: src_version_id,
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
			message: res.data.message || `소스 코드 추가 실패`, 
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
				message: errorMessage || error.response.data.message || `소스 코드 추가 실패`,
				data: null,
			}
	}
}

/** 소스코드 관리 편집 요청 */
export const EditSourceCodeManagementTableData = async (project_id: string, del_file_ids: number[], src_file_list: { src_file_id: number, src_file_content: string }[] | null): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`/versions/source/`, {
			project_id: project_id,
			del_file_ids: del_file_ids,
			src_file_list: src_file_list,
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
			message: res.data.message || `소스 코드 편집 실패`, 
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
				message: errorMessage || error.response.data.message || `소스 코드 편집 실패`,
				data: null,
			}
	}
}

/* 베이스라인 관리 페이지 */
/** 베이스라인 관리 페이지 베이스라인 목록 조회 Sidebar 
 * @param project_id 프로젝트 ID
 */
export interface IBaselineManagementSidebarDestailModel {
	conf_base_detail_id: number;
	conf_version_name: string;
	conf_version_status: string;
}
export interface IBaselineManagementSidebarModel {
	conf_base_id: number;
	conf_base_name: string;
	conf_base_category: string;
	conf_base_comment: string;
	conf_base_state: string | null;
	project_id: string;
	conf_created_date: string;
	conf_created_user_id: string;
	baseline_details: IBaselineManagementSidebarDestailModel[] | null;
}
export const GetBaselineManagementSidebarData = async (project_id: string): Promise<{ success: boolean, message: string, data: IBaselineManagementSidebarModel[] | null }> => {
	try { 
		const res = await AccessAxios.post(`/configurations/baseline/`, {
			project_id: project_id
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
			message: res.data.message || '베이스라인 관리 Sidebar 조회 실패',
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
				message: errorMessage || error.response.data.message || '베이스라인 관리 Sidebar 조회 실패',
				data: null,
			}
	}
}

/** 베이스라인 관리 페이지에서 베이스라인 상세 조회 ( Sidebar-Detail )
 * @param conf_base_detail_id 베이스라인 상세 ID
 */
export interface IBaselineManagementDetailOutputsModel {
	conf_base_output_id: number;
	std_output_id: number;
	std_output_name: string;
	output_content_file: string | null;
	output_content_update_date: string;
	output_content_update_person: string;
}
export interface IBaselineManagementDetailModel {
	conf_base_detail_id: number;
	conf_version_name: string;
	conf_version_status: string | null;
	src_version_id: number | null;
	src_version_name: string | null;
	src_version_content: string | null;
	baseline_id: number | null;
	baseline_number: string | null;
	tc_version_id: number | null;
	tc_version_name: string | null;
	tr_version_id: number | null;
	tr_version_name: string | null;
	config_request_file: string | null;
	change_details_file: string | null;
	ccb_file: string | null;
	conf_version_request_comment: string;
	conf_version_approval_comment: string | null;
	baseline_outputs: IBaselineManagementDetailOutputsModel[] | null;
	origin_baseline_versions: IRequirementManagementModel;  // 빈 값이라도 "" 으로 옴
	origin_source_versions: ISourceCodeManagementModel; // 빈 값이라도 "" 으로 옴 
}
export const GetBaselineManagementSidebarDetailData = async (conf_base_detail_id: number): Promise<{ success: boolean, message: string, data: IBaselineManagementDetailModel | null }> => {
	try { 
		const res = await AccessAxios.get(`configurations/baseline/?conf_base_detail_id=${conf_base_detail_id}`)
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message || '베이스라인 조회 실패',
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
				message: errorMessage || error.response.data.message || '베이스라인 조회 실패',
				data: null,
			}
	}
}

/* 형상식별 페이지에서 사용 되는 함수들 */

// 분류체계 식별자 - Classification-IdentificationTable
export interface IClassificationIdentificationModel {
	classif_id?: string;
	project_id: string;
	classif_code: string;
	classif_csci_name: string;
	classif_csc_name: string;
	classif_unit_identify: string;
	classif_unit_category: string;
	classif_system_name: string;
	classif_part_code: string;
	classif_csci_as: string;
	classif_csc_as: string;
	classif_sw_type: string;
	classif_serial_num: string;
	classif_tech_doc: string;
	classif_security: string;
	classif_sw_version: string;
	classif_update_code: string;
}
export const GetClassificationIdentificationData = async (project_id: string): Promise<{ success: boolean, message: string, data: IClassificationIdentificationModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`identifybases/category/?project_id=${project_id}`)
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

/* 작성한 내용 업데이트 */
export const UpdateClassificationIdentificationData = async (data: IClassificationIdentificationModel[], project_id: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`identifybases/category/`, {
			data: data,
			project_id: project_id,
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

// 내장형SW 분류체계 총괄자료 목록 - EmbeddedSoftwareClassificationSystemMasterDataListTable
export interface IEmbeddedSoftwareClassificationSystemMasterDataModel {
	emd_id?: string;
	project_id: string;
	classif_code: string;
	emd_weapon_system_name: string;
	emd_optional_unit: string;
	emd_obtain_type: string;
	emd_obtain_method: string;
	emd_weapon_system: string;
	emd_prototype_vendor: string;
	emd_develop_year?: string;
	emd_deploy_year: string;
	emd_develop_lang: string;
	emd_os: string;
	emd_loc: string;
	emd_manage_tool: string;
	emd_middleware: string;
	emd_dbms: string;
	emd_duration: string;
	emd_workforce: string;
	emd_cost: string;
	emd_cost_method: string;
	emd_output_count: string;
	emd_standard_count: string;
	emd_csci_count: string;
}
export const GetEmbeddedSoftwareClassificationSystemMasterDataListData = async (project_id: string): Promise<{ success: boolean, message: string, data: IEmbeddedSoftwareClassificationSystemMasterDataModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`identifybases/embedded/?project_id=${project_id}`)
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
export const UpdateEmbeddedSoftwareClassificationSystemMasterDataListData = async (data: IEmbeddedSoftwareClassificationSystemMasterDataModel[], project_id: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`identifybases/embedded/`, {
			data: data,
			project_id: project_id,
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

// 분류체계 속성자료 목록 - ClassificationSystemAttributeDataListTable
export interface IClassificationSystemAttributeDataModel {
	classif_attr_id?: string;
	project_id: string;
	classif_code: string;
	attr_classif_code: string;
	emd_weapon_system_name: string;
	emd_obtain_type: string;
	emd_weapon_system: string;
	attr_partner: string;
	emd_develop_lang: string;
	attr_develop_tool: string;
	emd_os: string;
	emd_loc: string;
	attr_case_tool: string;
	emd_middleware: string;
	emd_dbms: string;
	emd_duration: string;
	emd_workforce: string;
	emd_cost: string;
	emd_cost_method: string;
	attr_main_feat: string;
	attr_importance: string;
	attr_importance_reason: string;
	attr_reusable: string;
	attr_drawing_code: string;
	attr_spec_num: string;
	attr_stock_num: string;
	attr_device: string;
	attr_equip_code: string;
	attr_tech_code: string;
	attr_output_file: string;
}
export const GetClassificationSystemAttributeDataListData = async (project_id: string): Promise<{ success: boolean, message: string, data: IClassificationSystemAttributeDataModel[] |null }> => {
	try { 
		const res = await AccessAxios.get(`identifybases/attribute/?project_id=${project_id}`)
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
export const UpdateClassificationSystemAttributeDataListData = async (data: IClassificationSystemAttributeDataModel[], project_id: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`identifybases/attribute/`, {
			data: data,
			project_id: project_id,
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

/* 형상식별서 데이터 조회 */
export interface IIdentificationDocumentRowModel {
	title: string;
	code: string;
	note: string;
}
export interface IIdentificationDocumentModel {
	project_id: string;
	columns: string[]
	rows : IIdentificationDocumentRowModel[]
}
export const GetIdentificationDocumentData = async (project_id: string): Promise<{ success: boolean, message: string, data: IIdentificationDocumentModel | null }> => {
	try { 
		const res = await AccessAxios.get(`identifybases/function/?project_id=${project_id}`, {
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
export const UpdateIdentificationDocumentData = async (data: IIdentificationDocumentModel, project_id: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`identifybases/function/`, {
			data: data,
			project_id: project_id,
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

/* 요구사항 식별자 부여규칙 테이블 데이터 조회 */
export interface IRequirementIdentificationRuleRowModel {
	title: string; 
	explain: string;
	example: string;
}
export interface IRequirementIdentificationRuleModel {
	project_id: string;
	columns: string[]
	rows: IRequirementIdentificationRuleRowModel[]
}
export const GetRequirementIdentificationRuleData = async (project_id: string): Promise<{ success: boolean, message: string, data: IRequirementIdentificationRuleModel | null }> => {
	try { 
		const res = await AccessAxios.get(`identifybases/req/?project_id=${project_id}`, )
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
export const UpdateRequirementIdentificationRuleData = async (data: IRequirementIdentificationRuleModel, project_id: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`identifybases/req/`, {
			data: data,
			project_id: project_id,
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

/* 베이스라인 관리 페이지 - 승인 요청 */
interface IBaselineApprovalParams {
	conf_base_detail_id: number;
	conf_version_request_comment: string;
}
export const RequestBaselineApproval = async ({conf_base_detail_id, conf_version_request_comment}: IBaselineApprovalParams): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`configurations/request/`, {
			conf_base_detail_id: conf_base_detail_id,
			conf_version_request_comment: conf_version_request_comment,
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

/* 베이스라인 관리 페이지 - 승인 취소 */
export const CancelBaselineApproval = async (conf_base_detail_id: number): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`configurations/request/`, {
			conf_base_detail_id: conf_base_detail_id,
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

/* 베이스라인 관리 페이지 - 베이스라인 생성 요청 */
export const RequestCreateBaseline = async (project_id: string, conf_base_name: string, conf_base_comment: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`configurations/baseline/`, {
			project_id, 
			conf_base_name, 
			conf_base_comment
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

/* 베이스라인 관리 페이지 - 베이스라인 삭제 요청 */
export const RequestDeleteBaseline = async (conf_base_id: number, conf_base_detail_id: number, isDeleteAll: boolean, conf_version_request_comment: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
    // isDeleteAll == true, 
    // isDeleteAll == false
    let requestUrl: string = ""; 
    if (isDeleteAll) {
      requestUrl = `configurations/baseline/?conf_base_id=${conf_base_id}&conf_version_request_comment=${conf_version_request_comment}`
    } else { 
      requestUrl = `configurations/baseline/?conf_base_detail_id=${conf_base_detail_id}&conf_version_request_comment=${conf_version_request_comment}`
    }


		const res = await AccessAxios.delete(requestUrl)
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

/* 베이스라인 관리 페이지 - 베이스라인 승인 요청 검토 승인/반려*/
export interface IRequestReviewBaselineParams {
	conf_base_detail_id: number;
	conf_version_status: string; // rjc, apr 
	conf_version_approval_comment: string;
}
export const RequestReviewBaseline = async ({conf_base_detail_id, conf_version_status, conf_version_approval_comment}: IRequestReviewBaselineParams): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`configurations/approval/`, {
			conf_base_detail_id,
			conf_version_status,
			conf_version_approval_comment
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

/* 베이스라인 관리 페이지 - History 데이터 조회 */
export interface IBaselineHistoryModel extends IBaselineManagementDetailModel { }
export const GetBaselineHistoryData = async (conf_base_id: number): Promise<{ success: boolean, message: string, data: IBaselineHistoryModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`configurations/approval/?conf_base_id=${conf_base_id}`, {
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

/* 베이스라인 관리 페이지 - 베이스라인 항목 편집 - 시험 버전 TC ID로 TR 데이터 가져오는 함수 */
export interface IGetBaselineManagementTableEditTRDataModel {
	tr_version_id: number;
	tc_version_id: number;
	tr_version_name: string;
	tr_version_content: string;
	tr_version_date: string;
}
export const GetBaselineManagementTableEditTRData = async (tc_version_id: number): Promise<{ success: boolean, message: string, data: IGetBaselineManagementTableEditTRDataModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`integration/tr-version/?tc_version_id=${tc_version_id}`, {
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

/* 베이스라인 관리 페이지 - 편집 모달에서 저장 버튼 클릭 시에 */
interface IRequestEditBaselineManagementProps {
	conf_base_detail_id: number
	conf_version_request_comment: string 
	std_output_list: number[] | null
	baseline_id: number | null
	baseline_number: string | null
	src_version_id?: number | null
	src_version_name?: string | null
	request_file?: File | null
	details_file?: File | null
}
export const RequestEditBaselineManagement = async ({baseline_id, baseline_number, src_version_id, src_version_name, conf_base_detail_id, conf_version_request_comment, std_output_list, request_file, details_file}: IRequestEditBaselineManagementProps): Promise<{ success: boolean, message: string, data: IGetBaselineManagementTableEditTRDataModel[] | null }> => {
	try { 
		const formData = new FormData()
		formData.append('conf_base_detail_id', conf_base_detail_id.toString())
		formData.append('conf_version_request_comment', conf_version_request_comment)
		if ( std_output_list ) formData.append('std_output_list', JSON.stringify(std_output_list))
		if ( baseline_id ) formData.append('baseline_id', baseline_id.toString())
		if ( baseline_number ) formData.append('baseline_number', baseline_number)
		if ( request_file ) formData.append('request_file', request_file)
		if ( details_file ) formData.append('details_file', details_file)
		if ( src_version_id ) formData.append('src_version_id', src_version_id.toString())
		if ( src_version_name ) formData.append('src_version_name', src_version_name)
		const res = await AccessAxios.put(`configurations/request/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
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
			message: error.response.data.message || error.response.data.error || '베이스라인 편집 실패',
			data: null,
		}
	}
}

/* 베이스라인 관리 페이지 - 형상변경요청 승인/반려 모달에서 쓰이는 승인/반려 함수 */
interface IRequestConfigurationApprovalBaselineManagementProps {
	conf_base_detail_id: number
	conf_version_status: string
	conf_version_approval_comment: string
	is_ccb: boolean 
	config_ccb_file: File | null
}
export const RequestConfigurationApprovalBaselineManagement = async ({conf_base_detail_id, conf_version_status, conf_version_approval_comment, is_ccb, config_ccb_file}: IRequestConfigurationApprovalBaselineManagementProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const formData = new FormData()
		formData.append('conf_base_detail_id', conf_base_detail_id.toString())
		formData.append('conf_version_status', conf_version_status)
		formData.append('conf_version_approval_comment', conf_version_approval_comment)
		formData.append('is_ccb', is_ccb.toString())
		if (config_ccb_file) {
			formData.append('config_ccb_file', config_ccb_file)
		}
		const res = await AccessAxios.post(`configurations/approval/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
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

// 베이스라인 관리 페이지 - 형상변경요청서, 변경사항 세부내역, CCB 파일 다운로드
export const DownloadConfigurationFile = async (conf_base_detail_id: number, file_type: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		window.open(`${process.env.REACT_APP_BASE_URL}configurations/request/?conf_base_detail_id=${conf_base_detail_id}&field=${file_type}`)
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

// 베이스라인 관리 페이지 - 형상변경요청서, 변경사항 세부내역, CCB 파일 템플릿 다운로드
export const DownloadConfigurationTemplateFile = async (file_type: string): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		window.open(`${process.env.REACT_APP_BASE_URL}configurations/request/?field=${file_type}`)
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

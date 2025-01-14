import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'

// ################################################# SW 결함관리 페이지 ################################################# // 
export interface CreateDefectManagementLogModel {
	issue_name: string; // 식별자
	issue_source: string; // Source(=장절)
	issue_comment: string; // 의견
	issue_state: string; // 상태
	issue_affected_doc: string; // 영향받는 문서
	issue_resolver: string; // 결함 처리자
	issue_solution: string; // 해결책
	issue_solution_date: string | null; // 해결일자
	issue_solv_is_appr: boolean | null; // 해결책 승인 여부
	issue_priority: number; // 우선순위
}
export interface UpdateDefectManagementLogModel {
	issue_id: number; // ID
	issue_name: string; // 식별자
	issue_source: string; // Source(=장절)
	issue_comment: string; // 의견
	issue_state: string; // 상태
	issue_affected_doc: string; // 영향받는 문서
	issue_resolver: string; // 결함 처리자
	issue_solution: string; // 해결책
	issue_solution_date: string | null; // 해결일자
	issue_solv_is_appr: boolean | null; // 해결책 승인 여부
	issue_priority: number; // 우선순위
}
export interface DefectManagementLogModel {
	issue_id: number; // ID 
	issue_name: string; // 식별자
	issue_source: string; // Source(=장절)
	issue_comment: string; // 의견
	issue_state: string; // 상태
	issue_reporter: string; // 제기자
	issue_reporter_name: string; // 제기자 이름
	issue_report_date: string; // 제기일자
	issue_affected_doc: string; // 영향받는 문서
	issue_resolver: string; // 결함 처리자
	issue_resolver_name: string; // 결함 처리자 이름
	issue_solution: string; // 해결책
	issue_solv_is_appr: boolean | null; // 해결책 승인 여부
	issue_solution_date: string | null; // 해결일자
	issue_priority: number; // 우선순위
}

/** 결함관리 로그 목록을 가져오는 함수 
 * @param project_id: string
 */
export const GetDefectManagementLogs = async (project_id: string): Promise<{ success: boolean, message: string, data: DefectManagementLogModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`qc-issues/manage/?project_id=${project_id}`)
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

/** 새로운 결함관리 로그를 추가하는 함수
 * @param project_id: string
 * @param defect: CreateDefectManagementLogModel
 */
export const CreateDefectManagementLog = async (project_id: string, defect: CreateDefectManagementLogModel): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`qc-issues/manage/`, {
			project_id,
			"issue_category": "Custom",
			...defect
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

/** 결함관리 로그를 수정하는 함수
 * @param defect: UpdateDefectManagementLogModel
 */
export const UpdateDefectManagementLog = async (defect: UpdateDefectManagementLogModel): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`qc-issues/manage/`, {
			...defect
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

/** 결함관리 로그를 삭제하는 함수	(qc-issues/manage/)
 * @param issue_id_list[]: number[]
 */
export const DeleteDefectManagementLog = async (issue_id_list: number[]): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		// delete 요청은 body에 데이터를 넣을 수 없기 때문에, query string으로 데이터를 넘겨준다.
		const res = await AccessAxios.post(`qc-issues/data/`, {
			issue_id_list
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

// ################################################# SW 검토 페이지 ################################################# //
export interface IManagReviewModel { // SW 검토 모델
	review_id: number
	review_category: string
	review_name: string
	review_description: string
	review_start_date: string
	review_end_date: string
	review_duration: string
	review_state: string
	review_participant: string
}
export interface IMeetingPeopleModel { // 참석자 목록 모델 
	user_id: string
	user_name: string
}
export interface IMeetingModel { // 관련 회의 모델
	review_id: number
	review_name: string
}

export interface IManagReviewUpdateStateModel { // SW검토 페이지 - 검토_진행상태_변경_요청
	review_id: number;
	review_state: string;
}

interface ITechnicalReviewCase3ReviewTargetState {
	review_participant_id: number;
	participant_user_id: string;
	review_state: string;
}
export const TechnicalReviewCase3ReviewTargetCategories = [
  {
    key: "all", // default values by useState
    name: "전체",
  },
  {
    key: "SYS",
    name: "체계요구사항",
  },
  {
    key: "R",
    name: "SW 요구사항",
  },
  {
    key: "D",
    name: "SW 설계 요구사항",
  },
  {
    key: "T",
    name: "SW 테스트 요구사항",
  },
  {
    key: "SDD",
    name: "SDD",
  },
  {
    key: "SDP",
    name: "SDP",
  },
  {
    key: "SPS",
    name: "SPS",
  },
  {
    key: "SRS",
    name: "SRS",
  },
  {
    key: "STD",
    name: "STD",
  },
  {
    key: "STP",
    name: "STP",
  },
  {
    key: "STR",
    name: "STR",
  },
]
export interface ITechnicalReviewCase3ReviewTarget {
	review_target_id: number;
	review_order: number;
	review_target_content: string;
	review_target_name: string;
	peer_chapter_id: number;
	peer_category: string;
	review_target_states: ITechnicalReviewCase3ReviewTargetState[];
}
export interface ITechnicalReviewCase3Model { // 기술검토_조회(Case3)_요청 모델 
	review_id: number;
	review_category: string;
	review_name: string;
	review_description: string;
	review_start_date: string;
	review_end_date: string;
	review_duration: number | null;
	review_targets: ITechnicalReviewCase3ReviewTarget[];
}

export interface SystemRequirement {
	req_id: number;
	req_number: string;
	req_content: string;
}
export interface SoftwareRequirement {
	req_id: number;
	req_number: string;
	req_content: string;
}
export interface SoftwareDesignRequirement {
	req_id: number;
	req_number: string;
	req_content: string;
}
export interface SoftwareTestRequirement {
	req_id: number;
	req_number: string;
	req_content: string;
}
export interface SRS {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface STR {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface SDD {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface SPS {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface SDP {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface STP {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface STD {
  peer_chapter_id: number;
  peer_chapter_index: string;
  peer_chapter_title: string;
}
export interface ITechnicalReviewSelectRequirement {
  [key: string]: {
    system_requirement: SystemRequirement[];
  }
}
export interface ITechnicalReviewSelect { // 기술검토_항목선택_조회_요청 모델
	requirement: ITechnicalReviewSelectRequirement;
	SRS: SRS[];
	STR: STR[];
	SDD: SDD[];
	SPS: SPS[];
	SDP: SDP[];
	STP: STP[];
	STD: STD[];
	sdp_list: {
	  sdp_id: number;
	  sdp_name: string;
	}[];
	sps_list: {
	  sps_id: number;
    sps_name: string;
  }[];
  srs_list: {
    srs_id: number;
    srs_name: string;
  }[];
  sdd_list: {
    sdd_id: number;
    sdd_name: string;
  }[];
  stp_list: {
    stp_id: number;
    stp_name: string;
  }[];
  std_list: {
    std_id: number;
    std_name: string;
  }[];
  str_list: {
    str_id: number;
    str_name: string;
  }[];
}

export interface ICreateTechnicalReviewCase3Model { // 기술검토_추가(Case3)_요청 모델 
	project_id: string;
	review_name: string;
	review_description: string;
	review_start_date: string;
	review_end_date: string;
	review_user_id_list: string[];
	meeting_id_list: number[];
	review_targets: {
    review_order: number;
    review_classification: string;
    requirement_id?: number;
    output_id?: number;
    peer_chapter_id?: number;
	}[]
}

export interface IUpdateTechnicalReviewCase3Model { // 기술검토_수정(Case3)_요청 모델
	review_id: number
	review_targets: {
		review_order: number 
		review_classification?: string 
		requirement_id?: number
		output_id?: number
		peer_chapter_id?: number
	}[]
}

/** SW검토 페이지 - 검토항목_목록조회_요청 */
export const GetManagReviewSelecteAll = async ({project_id}: {project_id: string}): Promise<{ success: boolean, message: string, data: IManagReviewModel[] | null }> => { 
	try { 
		// delete 요청은 body에 데이터를 넣을 수 없기 때문에, query string으로 데이터를 넘겨준다.
		const res = await AccessAxios.get(`reviews/manag/?project_id=${project_id}`, { })
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

/* SW검토 페이지 - 검토_삭제_요청 */
export const DeleteManagReview = async ({review_id}: {review_id: number}): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.delete(`reviews/manag/?review_id=${review_id}`, { })
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

/* SW검토 페이지 - 검토_진행상태_변경_요청 */
export const UpdateManagReviewState = async (updateStateProps: IManagReviewUpdateStateModel): Promise<{ success: boolean, message: string, data: null }> => { 
	try { 
		const res = await AccessAxios.post(`reviews/manag/`, { 
			...updateStateProps
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

/** SW검토 페이지 - 참석자 목록 조회 ( 프로젝트에 해당 된 사용자 조회 ) */
export const GetMeetingPeopleList = async ({project_id}: {project_id: string}): Promise<{ success: boolean, message: string, data: IMeetingPeopleModel[] | null }> => { 
	try { 
		const res = await AccessAxios.get(`reviews/meeting/?project_id=${project_id}`, { })
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
			message: error.response.data.message || error.response.data.error || '데이터 조회 중 오류가 발생하였습니다.',
			data: null,
		}
	}
}

/* SW검토 페이지 - 관련 회의 조회 */
export const GetMeetingList = async ({review_id}: {review_id: number}): Promise<{ success: boolean, message: string, data: IMeetingModel[] | null }> => { 
	try { 
		const res = await AccessAxios.post(`reviews/meeting/`, {
			review_id
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

/* SW검토 페이지 - 기술검토_조회(Case3)_요청 */
export const GetTechnicalReviewCase3 = async ({review_id}: {review_id: number}): Promise<{ success: boolean, message: string, data: ITechnicalReviewCase3Model | null }> => {
	try { 
		const res = await AccessAxios.get(`reviews/technical/?review_id=${review_id}`, { })
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
			message: error.response.data.message || error.response.data.error || '데이터 조회 중 오류가 발생하였습니다.',
			data: null,
		}
	}
}

/* SW검토 페이지 - 기술검토_항목선택_조회_요청 */
export const GetTechnicalReviewSelect = async ({project_id}: {project_id: string}): Promise<{ success: boolean, message: string, data: ITechnicalReviewSelect | null }> => {
	try { 
		const res = await AccessAxios.post(`reviews/technical/`, { 
			project_id
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
			message: error.response.data.message || error.response.data.error || '데이터 조회 중 오류가 발생하였습니다.',
			data: null,
		}
	}
}

/* SW검토 페이지 - 기술검토_추가(Case3)_요청 */
export const CreateTechnicalReviewCase3 = async (createProps: ICreateTechnicalReviewCase3Model): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`reviews/technical/`, { 
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

/* SW검토 페이지 - 기술검토_수정(Case3)_요청 */
export const UpdateTechnicalReviewCase3 = async (updateProps: IUpdateTechnicalReviewCase3Model): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`reviews/technical/`, { 
			...updateProps
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

interface ITechnicalReviewCase4ReviewParticipant {
	review_participant_id: number;
	participant_user_id: string;
}
export interface ITechnicalReviewCase4ReviewMeeting {
	id?: number;
	review_meeting_id: number;
	meeting_name: string
}
export interface ITechnicalReviewCase4ReviewOutput {
	review_output_id: number;
	conf_base_output_id: number;
	std_output_name: string;
	output_content_file: string;
	output_content_update_date: string;
}
interface ITechnicalReviewCase4ReviewFile {
	review_file_id: number;
	review_file_is_material: boolean;
	review_file_path: string;
	review_file_date: string;
	review_file_user_id: string;
}
interface ITechnicalReviewCase4ReviewActionItem {
	review_action_item_id: number;
	issue_source: string;
	issue_comment: string;
	issue_state: string;
	issue_report_date: string;
	issue_affected_doc: string | null;
	issue_solution: string;
	issue_solv_is_appr: boolean;
	issue_solution_date: string | null;
	issue_priority: number;
	review_id: number;
	issue_reporter: string;
	issue_resolver: string;
	// 행 추가 삭제 시에 방금 만들어진 행인지 식별하기 위한 필드
	isNew?: boolean;
}
export interface ITechnicalReviewCase4Model { // 기술검토_조회(Case4)_요청 모델
	review_id: number;
	review_category: string;
	review_name: string;
	review_description: string;
	review_start_date: string;
	review_end_date: string;
	review_duration: string | null;
	review_state: string | null;
	baseline_id: number 
	baseline_number: string
	src_version_id: number
	src_version_name: string
	review_participants: ITechnicalReviewCase4ReviewParticipant[];
	review_meetings: ITechnicalReviewCase4ReviewMeeting[];
	review_outputs: ITechnicalReviewCase4ReviewOutput[];
	review_files: ITechnicalReviewCase4ReviewFile[];
	review_action_items: ITechnicalReviewCase4ReviewActionItem[];
}

export interface ICreateTechnicalReviewCase4Model { // 기술검토_추가(Case4)_요청 모델
	project_id: string;
	review_category: string;
	review_name: string;
	review_description: string;
	review_start_date: string;
	review_end_date: string;
	review_user_id_list: string[];
	meeting_id_list: number[];
	conf_base_detail_id: number;
	std_output_list: number[] | null;
	baseline_id: number | null;
	src_version_id: number | null;
}

export interface IUpdateTechnicalReviewCase4Model { // 기술검토_수정(Case4)_요청 모델
	review_id: number 
	conf_base_detail_id: number
	std_output_list: number[] | null
	baseline_id: number | null
	src_version_id: number | null
}

interface ISaveTechnicalReviewCase4ReviewActionItemList {
	review_action_item_id?: number;
	issue_source: string;
	issue_comment: string;
	issue_solution: string;
	issue_state: string;
	issue_reporter: string;
	issue_report_date: string;
	issue_resolver: string;
	issue_solv_is_appr: boolean;
	issue_solution_date: string | null;
	issue_priority: number;
}
export interface ISaveTechnicalReviewCase4ReviewActionItemModel { // 기술검토_추가(Case4)_ActionItem_요청 모델
	review_id: number;
	del_action_item_list: number[];
	action_item_list: any[];
}

export interface IUploadBusinessReviewCase4MeetingFileModel {
	review_id: number;
	review_file_is_material: "true" | "false"; // bolean 타입을 formData에 넣을 수 없어서 string으로 변환
	review_file_date: string;
	file: File;
}

export interface ICreateTechnicalReviewActionItemModel {
	project_id: string; 
	action_item_list: number[];
}

/* SW검토 페이지 - 사업관리회의_조회(Case4)_요청 */ 
export const GetBusinessReviewCase4 = async ({review_id}: {review_id: number}): Promise<{ success: boolean, message: string, data: ITechnicalReviewCase4Model | null }> => {
	try { 
		const res = await AccessAxios.get(`reviews/inspection/?review_id=${review_id}`, {})
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

/* SW검토 페이지 - 사업관리회의_추가(Case4)_요청 */
export const CreateBusinessReviewCase4 = async (createProps: ICreateTechnicalReviewCase4Model): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`reviews/inspection/`, {
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
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || '사업관리회의 추가 중 오류가 발생하였습니다.',
			data: null,
		}
	}
}

/* SW검토 페이지 - 사업관리회의_수정(Case4)_요청 */
export const UpdateBusinessReviewCase4 = async (updateProps: IUpdateTechnicalReviewCase4Model): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`reviews/inspection/`, {
			...updateProps
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

/* SW검토 페이지 - 사업관리회의(Case4)_ActionItem_저장_요청 */
export const SaveBusinessReviewCase4ActionItem = async (saveProps: ISaveTechnicalReviewCase4ReviewActionItemModel): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`reviews/inspection/`, {
			...saveProps
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

/* SW검토 페이지 - 사업관리회의(Case4)_회의자료_회의록_업로드_요청 */
export const UploadBusinessReviewCase4MeetingFile = async (updateProps: IUploadBusinessReviewCase4MeetingFileModel): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const formData = new FormData();
		formData.append('review_id', updateProps.review_id.toString())
		formData.append('review_file_is_material', updateProps.review_file_is_material)
		formData.append('review_file_date', updateProps.review_file_date)
		formData.append('file', updateProps.file)

		const res = await AccessAxios.post(`reviews/material/`, formData);
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

/* SW검토 페이지 - 사업관리회의(Case4)_회의자료_회의록_다운로드_요청 */
export const DownloadBusinessReviewCase4MeetingFile = async ({review_file_id}: {review_file_id: number}): Promise<{ success: boolean, message: string, data: Blob | null }> => {
	try { 
		const res = await AccessAxios.get(`reviews/material/?review_file_id=${review_file_id}`, {})
		if (res.data) {
			return {
				success: true,
				message: '회의자료/회의록 다운로드에 성공했습니다.',
				data: res.data,
			}
		}
		return {
			success: false,
			message: '회의자료/회의록 다운로드에 실패했습니다.',
			data: null,
		}
	} catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || error.response.data.error || '회의자료/회의록 다운로드에 실패했습니다.',
				data: null,
			}
	}
}

/* SW검토 페이지 - ActionItem_이슈등록_요청 */
export const CreateTechnicalReviewActionItem = async (createProps: ICreateTechnicalReviewActionItemModel): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`reviews/material/`, {
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
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || 'ActionItem 이슈등록에 실패했습니다.',
			data: null,
		}
	}
}

/* 기술검토 회의(case3) 구분으로 <technical> 이름을 받아오는 함수 */
export const GetTechnicalNameByClassification = (classification: string): string => {
	switch(classification) {
		case "technical":
			return "기술검토 회의(Case3)"
		case "sys":
			return "체계요구사항검토회의(SYS)"
		case "sfr":
			return "체계기능검토회의(SFR)"
		case "srr":
			return "소프트웨어요구사항검토회의(SRR)"
		case "pdr":
			return "기본설계검토회의(PDR)"
		case "cdr":
			return "상세설계검토회의(CDR)"
		case "trr":
			return "시험준비검토회의(TRR)"
		default:
			return ""
	}
}


// ################################################# SW 검증 페이지 ################################################# //

// SW 검증 페이지 - 검증_문서목록_조회_요청
export interface IVerificationDocumentModel {
  std_output_id: number;
  std_output_name: string;
  verification_file: string // File or null
  verification_check_file: string
  verification_result: string // "Fail", "Pass"
}
export const GetVerificationDocumentList = async ({project_id}: {project_id: string}): Promise<{ success: boolean, message: string, data: IVerificationDocumentModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`verifications/manag/?project_id=${project_id}`, {})
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
			message: error.response.data.message || error.response.data.error || '문서목록 조회에 실패했습니다.',
			data: null,
		}
	}
}

// SW 검증 페이지 - 검증_수행이력_목록조회_요청
export interface IVerificationHistoryModel {
  verification_id: number; 
  verification_file: string; // File or null
  verification_check_file: string;
  verification_start_date: string | null;
  verification_end_date: string | null;
  verification_duration: string | null;
  verification_state: string | null;
  verification_result: string; // "Fail", "Pass"
  project_id: string;
  std_output_id: number;
  verification_user_id: string;
}
interface GetVerificationHistoryListProps {
  project_id: string;
  std_output_id: number;
}
export const GetVerificationHistoryList = async (getProps: GetVerificationHistoryListProps): Promise<{ success: boolean, message: string, data: IVerificationHistoryModel[] | null }> => {
	try { 
		const res = await AccessAxios.post(`verifications/manag/`, {
		  ...getProps
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
			message: error.response.data.message || error.response.data.error || '수행이력 조회에 실패했습니다.',
			data: null,
		}
	}
}

/* SW검증 페이지 - 검증 수행 이력 보기 */
export interface IGetShowVerificationHistoryModel {
  verification_chapter: string;
  verification_content: string;
  verification_result: string;
  verification_comment: string;
}
export const GetShowVerificationHistory = async ({verification_id}: {verification_id: number}): Promise<{ success: boolean, message: string, data: IGetShowVerificationHistoryModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`verifications/history/?verification_id=${verification_id}`, {
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
			message: error.response.data.message || error.response.data.error || '수행이력 조회에 실패했습니다.',
			data: null,
		}
	}
}

/* SW검증 페이지 - 검증 대상 문서 시작  */
export const StartVerificationDocument = async ({std_output_id}: {std_output_id: number}): Promise<{ success: boolean, message: string, data: IGetShowVerificationHistoryModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`verifications/history/?std_output_id=${std_output_id}`, {
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
			message: error.response.data.message || error.response.data.error || '수행이력 조회에 실패했습니다.',
			data: null,
		}
	}
}

/* SW검증 페이지 - 검증 대상 문서 종료/저장  */
export interface IEndVerificationDocumentProps {
  std_output_id: number;
  verification_start_date: Date | null;
  verification_end_date: Date | null;
  verification_duration: Date | null;
  check_results: IGetShowVerificationHistoryModel[];
}
export const EndVerificationDocument = async (endProps: IEndVerificationDocumentProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`verifications/history/`, {
		  ...endProps
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
			message: error.response.data.message || error.response.data.error || '수행이력 저장에 실패했습니다.',
			data: null,
		}
	}
}

/* SW검증 페이지 - 이슈등록하기  요청 */
interface ICreateVerificationIssueProps {
  std_output_id: number;
  check_results: {
    index: number;
    verification_chapter: string;
    verification_content: string;
    verification_result: string;
    verification_comment: string;
  }[]
}
export const CreateVerificationIssue = async (createProps: ICreateVerificationIssueProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`verifications/manag/`, {
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
		return {
			success: false,
			message: error.response.data.message || error.response.data.error || '수행이력 저장에 실패했습니다.',
			data: null,
		}
	}
}

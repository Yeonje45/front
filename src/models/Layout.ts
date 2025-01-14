import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'

export interface IProjectStepsModel {
	[key: string]: number
}

/** 프로젝트 단계를 가져오는 함수입니다.
	* @param project_id 프로젝트 아이디
 */ 
export const GetProjectSteps = async (project_id: string): Promise<{ success: boolean, message: string, data: IProjectStepsModel | null }> => {
	try { 
		const res = await AccessAxios.get(`/dashboards/step/?project_id=${project_id}`, {
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
			message: "Failed to get project steps", 
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

/** 프로젝트 단계의 약자를 받으면 해당 단계의 이름을 반환하는 함수입니다.
 * @param step 프로젝트 단계의 약자
 */
export const GetStepName = (step: string): string => {
	switch (step) {
		case 'kom':
			return 'SW 개발계획'
		case 'srr':
			return 'SW요구사항 분석'
		case 'pdr':
			return 'SW구조설계'
		case 'ddr':
			return 'SW상세설계'
		case 'cdr':
			return 'SW구현'
		case 'trr':
			return 'SW통합 및 시험'
		case 'svr':
			return '체계 통합 및 시험'
		case 'fqr':
			return '시험평가'
		case 'par':
			return '규격화 및 인도'
		default:
			return '알 수 없음'
	}
}

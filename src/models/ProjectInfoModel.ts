import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'

// export interface ICreateProjectModels {
//   project_name: string
//   admin: string
//   project_start_date: string
//   project_end_date: string
//   project_unit_code: string
//   project_sys_name: string
//   project_subsys_name: string
//   project_component_name: string
//   project_csci_name: string
// }

export class ProjectInfoModel {
  project_id: string
  project_name: string
  project_start_date: Date
  project_end_date: Date
  project_schedule: string
  project_stage_code: string
  project_unit_code: string
  project_sys_name: string
  project_subsys_name: string
  project_csci_name: string
  project_component_name: string
  project_register_date: Date
  project_update_date: Date
  project_delete_date: Date
  project_manager_id: string | null
  project_manager_name: string | null
  project_manager_contact: string | null
  project_manager_email: string | null
  std_business_type_index: string
  custom_business_type_name: string

  constructor(
    project_id: string,
    project_name: string,
    project_start_date: Date,
    project_end_date: Date,
    project_schedule: string,
    project_stage_code: string,
    project_unit_code: string,
    project_sys_name: string,
    project_subsys_name: string,
    project_csci_name: string,
    project_component_name: string,
    project_register_date: Date,
    project_update_date: Date,
    project_delete_date: Date,
    project_manager_id: string,
    project_manager_name: string,
    project_manager_contact: string,
    project_manager_email: string,
    std_business_type_index: string,
    custom_business_type_name: string
  
  ) {
    this.project_id = project_id
    this.project_name = project_name
    this.project_start_date = project_start_date
    this.project_end_date = project_end_date
    this.project_schedule = project_schedule
    this.project_stage_code = project_stage_code
    this.project_unit_code = project_unit_code
    this.project_sys_name = project_sys_name
    this.project_subsys_name = project_subsys_name
    this.project_csci_name = project_csci_name
    this.project_component_name = project_component_name
    this.project_register_date = project_register_date
    this.project_update_date = project_update_date
    this.project_delete_date = project_delete_date
    this.project_manager_id = project_manager_id
    this.project_manager_name = project_manager_name
    this.project_manager_contact = project_manager_contact
    this.project_manager_email = project_manager_email
    this.std_business_type_index = std_business_type_index
    this.custom_business_type_name = custom_business_type_name
  }
}

export class ProjectUpdateModel {
  project_name: string
  project_start_date: Date
  project_end_date: Date
  project_unit_code: string
  project_sys_name: string
  project_subsys_name: string
  project_csci_name: string
  project_component_name: string
  std_business_type_index: string
  custom_business_type_name: string | null

  constructor(
    project_name: string,
    project_start_date: Date,
    project_end_date: Date,
    project_unit_code: string,
    project_sys_name: string,
    project_subsys_name: string,
    project_csci_name: string,
    project_component_name: string,
    std_business_type_index: string,
    custom_business_type_name: string | null
  ) {
    this.project_name = project_name
    this.project_start_date = project_start_date
    this.project_end_date = project_end_date
    this.project_unit_code = project_unit_code
    this.project_sys_name = project_sys_name
    this.project_subsys_name = project_subsys_name
    this.project_csci_name = project_csci_name
    this.project_component_name = project_component_name
    this.std_business_type_index = std_business_type_index
    this.custom_business_type_name = custom_business_type_name
  }
}

export class CreateProjectModel {
	constructor(
		public project_name: string,
		public admin: string,
		public project_start_date: string,
		public project_end_date: string,
		public project_unit_code: string,
		public project_sys_name: string,
		public project_subsys_name: string,
		public project_component_name: string,
		public project_csci_name: string,
		public std_business_type_index: string,
		public custom_business_type_name: string | null,
	) {
		this.project_name = project_name
		this.admin = admin
		this.project_start_date = project_start_date
		this.project_end_date = project_end_date
		this.project_unit_code = project_unit_code
		this.project_sys_name = project_sys_name
		this.project_subsys_name = project_subsys_name
		this.project_component_name = project_component_name
		this.project_csci_name = project_csci_name
		this.std_business_type_index = std_business_type_index
		this.custom_business_type_name = custom_business_type_name
	}

	// ProjectName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectName = (project_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_name)
	}

	// Admin 정규식 확인 ( 1 ~ 30 글자 )
	public isValidAdmin = (admin: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(admin)
	}

	// ProjectUnit 정규식 확인 ( value: 'sys' | 'subsys' | 'csci')
	public isValidProjectUnit = (project_unit_code: string): boolean => {
		const regex = /^(sys|subsys|csci)$/
		return regex.test(project_unit_code)
	}

	// ProjectSysName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectSysName = (project_sys_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_sys_name)
	}

	// ProjectSubsysName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectSubsysName = (project_subsys_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_subsys_name)
	}

	// ProjectComponentName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectComponentName = (project_component_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_component_name)
	}

	// ProjectCSCIName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectCSCIName = (project_csci_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_csci_name)
	}

	public requestCreateProject = async (): Promise<{
		success: boolean
		message: string
		data: CreateProjectModel | null
	}> => {
		try {
			const res = await AccessAxios.post('/projects/manage/post/', {
				project_name: this.project_name,
				project_start_date: this.project_start_date,
				project_end_date: this.project_end_date,
				project_unit_code: this.project_unit_code,
				project_sys_name: this.project_sys_name,
				project_subsys_name: this.project_subsys_name,
				project_component_name: this.project_component_name,
				project_csci_name: this.project_csci_name,
				std_business_type_index: this.std_business_type_index,
				custom_business_type_name: this.custom_business_type_name,
			})

			return {
				success: true,
				message: '프로젝트 생성에 성공했습니다.',
				data: res.data.data ? res.data.data : null,
			}
		} catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || error.response.data.error || '프로젝트 생성에 실패했습니다.',
				data: null,
			}
		}
	}
}
 
export class GetProjectModel {
  public requestGetProject = async (
    requestURL: string,
  ): Promise<{
    success: boolean
    message: string
    data: {
      count: number
      next: string
      previous: string
      results: ProjectInfoModel[]
    } | null
  }> => {
    try {
      const res = await AccessAxios.get(requestURL)
      return {
        success: true,
        message: '프로젝트 조회에 성공했습니다.',
        data: res.data.data ? res.data.data : null,
      }
    } catch (error) {
      let errorMessage: string = ''
      if (isAxiosError<IResponse<string>>(error)) {
        if (error.response === undefined) {
          return {
            success: false,
            message: '서버와의 연결이 끊겼습니다.',
            data: null,
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
        data: null,
      }
    }
  }
}

export class UpdateProjectModel {
  project_name: string
	project_manager_id: string
  project_start_date: Date
  project_end_date: Date
  project_unit_code: string
  project_sys_name: string
  project_subsys_name: string
  project_csci_name: string
  project_component_name: string
  std_business_type_index: string
  custom_business_type_name: string

  constructor(
    project_name: string,
		project_manager_id: string,
    project_start_date: Date,
    project_end_date: Date,
    project_unit_code: string,
    project_sys_name: string,
    project_subsys_name: string,
    project_csci_name: string,
    project_component_name: string,
    std_business_type_index: string,
    custom_business_type_name: string
  ) {
    this.project_name = project_name
		this.project_manager_id = project_manager_id
    this.project_start_date = project_start_date
    this.project_end_date = project_end_date
    this.project_unit_code = project_unit_code
    this.project_sys_name = project_sys_name
    this.project_subsys_name = project_subsys_name
    this.project_csci_name = project_csci_name
    this.project_component_name = project_component_name
    this.std_business_type_index = std_business_type_index
    this.custom_business_type_name = custom_business_type_name
  }

	// ProjectName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectName = (project_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_name)
	}

	// ProjectUnit 정규식 확인 ( value: 'sys' | 'subsys' | 'csci')
	public isValidProjectUnit = (project_unit_code: string): boolean => {
		const regex = /^(sys|subsys|csci)$/
		return regex.test(project_unit_code)
	}

	// ProjectSysName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectSysName = (project_sys_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_sys_name)
	}

	// ProjectSubsysName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectSubsysName = (project_subsys_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_subsys_name)
	}

	// ProjectComponentName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectComponentName = (project_component_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_component_name)
	}

	// ProjectCSCIName 정규식 확인 ( 1 ~ 30 글자 )
	public isValidProjectCSCIName = (project_csci_name: string): boolean => {
		const regex = /^.{1,30}$/
		return regex.test(project_csci_name)
	}

  public requestUpdateProject = async (
    project_id: string,
    project_stage_code: string,
  ): Promise<{
    success: boolean
    message: string
  }> => {
    try {
      const res = await AccessAxios.put(`/projects/manage/put/${project_id}/`, {
        // custom
        project_id: project_id,
        project_stage_code: project_stage_code,
        // origin
        project_name: this.project_name,
				project_manager_id: this.project_manager_id,
        project_start_date: this.project_start_date,
        project_end_date: this.project_end_date,
        project_unit_code: this.project_unit_code,
        project_sys_name: this.project_sys_name,
        project_subsys_name: this.project_subsys_name,
        project_component_name: this.project_component_name,
        project_csci_name: this.project_csci_name,
        std_business_type_index: this.std_business_type_index,
        custom_business_type_name: this.custom_business_type_name,
      })
			if (res.data.state === 200) {
				return {
					success: true,
					message: '프로젝트 수정에 성공했습니다.',
				}
			}
			return {
				success: false,
				message: res.data.message || '프로젝트 수정에 실패했습니다.',
			}
    } catch (error: any) {
			return {
				success: false,
				message: error.response.data.message || '프로젝트 수정에 실패했습니다.',
			}
		}
	}
}

export const DeleteProjectModel = async (
	project_id: string,
): Promise<{
	success: boolean
	message: string
}> => {
	try {
		await AccessAxios.delete(`/projects/manage/delete/${project_id}/`)
		return {
			success: true,
			message: '프로젝트 삭제에 성공했습니다.',
		}
	} catch (error) {
		let errorMessage: string = ''
		if (isAxiosError<IResponse<string>>(error)) {
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

export const GetProjectByIdModel = async (
	project_id: string,
): Promise<{
	success: boolean
	message: string
	data: ProjectInfoModel | null
}> => {
	{
		try {
			const res = await AccessAxios.get(`/projects/manage/get/?project_id=${project_id}`)

			if (res.status !== 200) {
				return {
					success: false,
					message: '프로젝트 조회에 실패했습니다.',
					data: null,
				}
			}

			return {
				success: true,
				message: '프로젝트 조회에 성공했습니다.',
				data: res.data.data ? res.data.data : null,
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
}

export interface IUserListProjectListModel {
	project_id: string;
	project_name: string;
	user_role: string;
}

export interface IUserListModel {
	user_id: string;
	user_name: string;
	user_company: string;
	user_dept: string;
	user_email: string; 
	user_contact: string[];
	user_position: string;
	user_projects: IUserListProjectListModel[] | null;
	is_active: boolean; // 사용자 활성화 여부
}

/* 프로젝트 목록 페이지 / 사용자 권한 관리 페이지 - 사용자 목록 조회 */
export const GetUserList = async (): Promise<{ success: boolean, message: string, data: IUserListModel[] | null }> => {
	try { 
		const res = await AccessAxios.get(`authorities/assign/`, { })
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

/* 프로젝트 목록 페이지 - 프로젝트 PM 할당 요청 */
export const AssignProjectManager = async (updateProps: {user_id: string, project_id: string}): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`authorities/assign/`, { 
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

export interface IAssignUserActiveProps {
	project_id: string;
	project_member: string[];
}
/* 프로젝트 목록 페이지 - 프로젝트에 사용자 할당 ( 덮어 씌우기 ) */
export const AssignUserActive = async (updateProps: IAssignUserActiveProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`authorities/project/`, { 
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

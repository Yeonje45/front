import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'
import { ICustomDataItem, ICustomDataArrow, ICustomDataGroup, ICustomDataAssignee } from 'components/dashboard/panels/DashboardDevelopmentTimeline'
import { IChildren } from 'constant/dashboard/systemArchitectureFields'

export interface IDashboardArchitecturalModels {
	project_id: string
	outline: IDashboardArchitecturalOutline[]
}

interface IDashboardArchitecturalOutline {
	title: string
	content: string
}

export class DashboardArchitecturalModel {
	project_id: string
	outline: IDashboardArchitecturalOutline[]

	constructor(architecturalModels: IDashboardArchitecturalModels) {
		this.project_id = architecturalModels.project_id
		this.outline = architecturalModels.outline
	}

	static async requestGetArchitectural(project_id: string): Promise<IResponse<IDashboardArchitecturalModels | null>> {
		try {
			const res = await AccessAxios.get(`/dashboards/outline/?project_id=${project_id}`);
			return {
				statusCode: res.status,
				error: res.data.error,
				message: res.data.message,
				data: res.data.data
			};
		} catch (err) {
			let errorMessage: string = '';
			if (isAxiosError(err)) {
				if (!err.response) {
					return {
						statusCode: 500,
						error: '서버와의 통신에 실패했습니다.',
						message: '서버와의 통신에 실패했습니다.',
						data: null
					};
				}

				const errorData = err.response.data;
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error;

				return {
					statusCode: err.response.status,
					error: errorData.error,
					message: errorData.message,
					data: null
				};
			}
			return {
				statusCode: 500,
				error: errorMessage,
				message: errorMessage,
				data: null
			};
		}
	}

	public async requestPostArchitectural(): Promise<IResponse<IDashboardArchitecturalModels | null>> {
		try {
			const res = await AccessAxios.post('/dashboards/outline/', {
				project_id: this.project_id,
				outline: this.outline,
			})
			return {
				statusCode: res.status,
				error: res.data.error,
				message: res.data.message,
				data: res.data.data
			}
		} catch (err) {
			let errorMessage: string = '';
			if (isAxiosError(err)) {
				if (!err.response) {
					return {
						statusCode: 500,
						error: '서버와의 통신에 실패했습니다.',
						message: '서버와의 통신에 실패했습니다.',
						data: null
					};
				}

				const errorData = err.response.data;
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error;

				return {
					statusCode: err.response.status,
					error: errorData.error,
					message: errorData.message,
					data: null
				};
			}
			return {
				statusCode: 500,
				error: errorMessage,
				message: errorMessage,
				data: null
			};
		}
	}
}

export interface IDashboardParticipatingOrganizationModels {
	project_id: string
	columns: string[]
	rows: IDashboardParticipatingOrganizationRow[]
}

export interface IDashboardParticipatingOrganizationRow {
	[key: string]: string
}

export class DashboardParticipatingOrganizationModel {
	project_id: string
	columns: string[]
	rows: IDashboardParticipatingOrganizationRow[]

	constructor(participatingOrganization: IDashboardParticipatingOrganizationModels) {
		this.project_id = participatingOrganization.project_id
		this.columns = participatingOrganization.columns
		this.rows = participatingOrganization.rows
	}

	static async requestGetParticipatingOrganization(project_id: string): Promise<IResponse<IDashboardParticipatingOrganizationModels | null>> {
		try {
			const res = await AccessAxios.get(`/dashboards/organization/?project_id=${project_id}`);
			return {
				statusCode: res.status,
				error: res.data.error,
				message: res.data.message,
				data: res.data.data
			};
		} catch (err) {
			let errorMessage: string = '';
			if (isAxiosError(err)) {
				if (!err.response) {
					return {
						statusCode: 500,
						error: '서버와의 통신에 실패했습니다.',
						message: '서버와의 통신에 실패했습니다.',
						data: null
					};
				}

				const errorData = err.response.data;
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error;

				return {
					statusCode: err.response.status,
					error: errorData.error,
					message: errorData.message,
					data: null
				};
			}
			return {
				statusCode: 500,
				error: errorMessage,
				message: errorMessage,
				data: null
			};
		}
	}

	public async requestPostParticipatingOrganization(): Promise<{success: boolean, message: string, data: IDashboardParticipatingOrganizationModels | null}> {
		try {
			const res = await AccessAxios.post('/dashboards/organization/', {
				project_id: this.project_id,
				columns: this.columns,
				rows: this.rows,
			})
			return {
				success: true,
				message: res.data.message,
				data: res.data.data
			}
		} catch (err) {
			let errorMessage: string = '';
			if (isAxiosError(err)) {
				if (!err.response) {
					return {
						success: false,
						message: '서버와의 통신에 실패했습니다.',
						data: null
					};
				}

				const errorData = err.response.data;
				errorMessage = Array.isArray(errorData.error)
					? errorData.error.join('\n')
					: errorData.error;

				return {
					success: false,
					message: errorData.message,
					data: null
				};
			}
			return {
				success: false,
				message: errorMessage,
				data: null
			};
		}
	}
}

interface IGanttItemResponseGet {
	items: ICustomDataItem[] | null;
	item_links: ICustomDataArrow[] | null;
}

interface IGanttItemResponsePost {
	item: ICustomDataItem | null;
	item_links: ICustomDataArrow[] | null;
}

interface IGanttItemResponsePatch {
	item: ICustomDataItem | null;
	item_links: ICustomDataArrow[] | null;
}

interface IGanttItemResponseNextID {
	next_id: number | null;
}

export class DashboardGanttItemModel {

	// GET 요청 (특정 프로젝트의 모든 GanttItem을 조회)
	static async requestGetItems(project_id: string): Promise<IResponse<IGanttItemResponseGet | null>> {
		try {
				const res = await AccessAxios.get(`/dashboards/gantt/items/?project_id=${project_id}`);
				return {
						statusCode: res.status,
						error: res.data.error,
						message: res.data.message,
						data: {
								items: res.data.items,
								item_links: res.data.item_links
						},
				};
		} catch (err) {
				let errorMessage = '';
				if (isAxiosError(err)) {
						if (!err.response) {
								return {
										statusCode: 500,
										error: '서버와의 통신에 실패했습니다.',
										message: '서버와의 통신에 실패했습니다.',
										data: null
								};
						}

						const errorData = err.response.data;
						errorMessage = Array.isArray(errorData.error)
								? errorData.error.join('\n')
								: errorData.error;

						return {
								statusCode: err.response.status,
								error: errorMessage,
								message: errorMessage,
								data: null
						};
				}
				return {
						statusCode: 500,
						error: errorMessage,
						message: errorMessage,
						data: null
				};
		}
	}

	// Post 요청 (특정 프로젝트의 GanttItem을 추가)
	static async requestPostItem(requestData: Omit<ICustomDataItem, 'id'>): Promise<IResponse<IGanttItemResponsePost | null>> {
		try {
				const res = await AccessAxios.post('/dashboards/gantt/items/', requestData);
				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: {
							item: res.data.item, // `item`이 없으면 null로 설정
							item_links: res.data.item_link, // `item`이 없으면 null로 설정
					},
				};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}

	// Patch 요청 (특정 프로젝트의 GanttItem을 수정)
	static async requestPatchItem(requestData: Omit<ICustomDataItem, 'id'>): Promise<IResponse<IGanttItemResponsePatch | null>> { 
		try {
				// PATCH 요청 전송
				const res = await AccessAxios.patch(`/dashboards/gantt/items/`, requestData);
				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: {
							item: res.data.item, 
							item_links: res.data.item_link,
					},
			};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}

	// Delete 요청 (특정 프로젝트의 GanttItem을 삭제)
	static async requestDeleteItem(itemID: number, projectID: string): Promise<IResponse<null>> {
		try {
			// DELETE 요청 전송
			const res = await AccessAxios.delete('/dashboards/gantt/items/' , {
				data: { id: itemID, project: projectID }
			});

				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: null
			};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}

	// GET 요청 (특정 프로젝트의 Item을 조회하여 다음 ID를 가져옴)
	static async requestItemNextID(): Promise<IResponse<IGanttItemResponseNextID|null>> {
		try {
			// GET 요청 전송
			const res = await AccessAxios.get('/dashboards/gantt/items/next_id');

				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: {
						next_id: res.data.next_id,
					},
			};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null,
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null,
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null,
			};
		}
	}
}

interface IGanttGroupResponseGet {
	groups: ICustomDataGroup[] | null;
}
interface IGanttGroupResponsePost {
	group: ICustomDataGroup | null;
}
interface IGanttGroupResponsePatch {
	group: ICustomDataGroup | null;
}
interface IGanttGroupResponseNextID {
	next_id: number | null;
}

export class DashboardGanttGroupModel {

	// GET 요청 (특정 프로젝트의 모든 GanttGroup을 조회)
	static async requestGetGroups(project_id: string): Promise<IResponse<IGanttGroupResponseGet | null>> {
		try {
				const res = await AccessAxios.get(`/dashboards/gantt/groups/?project_id=${project_id}`);
				return {
						statusCode: res.status,
						error: res.data.error,
						message: res.data.message,
						data: {
								groups: res.data.groups,
						},
				};
		} catch (err) {
				let errorMessage = '';
				if (isAxiosError(err)) {
						if (!err.response) {
								return {
										statusCode: 500,
										error: '서버와의 통신에 실패했습니다.',
										message: '서버와의 통신에 실패했습니다.',
										data: null
								};
						}

						const errorData = err.response.data;
						errorMessage = Array.isArray(errorData.error)
								? errorData.error.join('\n')
								: errorData.error;

						return {
								statusCode: err.response.status,
								error: errorMessage,
								message: errorMessage,
								data: null
						};
				}
				return {
						statusCode: 500,
						error: errorMessage,
						message: errorMessage,
						data: null
				};
		}
	}

	// Post 요청 (특정 프로젝트의 GanttGroup을 추가)
	static async requestPostGroup(requestData: Omit<ICustomDataGroup, 'id'>): Promise<IResponse<IGanttGroupResponsePost | null>> {
		try {
				const res = await AccessAxios.post('/dashboards/gantt/groups/', requestData);
				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: {
							group: res.data.group, // `group`이 없으면 null로 설정
					},
				};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}

	// Patch 요청 (특정 프로젝트의 GanttGroup을 수정)
	static async requestPatchGroup(requestData: Omit<ICustomDataGroup, 'id'>): Promise<IResponse<IGanttGroupResponsePatch | null>> { //groupId: number, 
		try {
				// PATCH 요청 전송
				const res = await AccessAxios.patch(`/dashboards/gantt/groups/`, requestData); //${groupId}/
				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: {
							group: res.data.group, // `group`이 없으면 null로 설정 || null
					},
			};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}

	// Delete 요청 (특정 프로젝트의 GanttGroup을 삭제)
	static async requestDeleteGroup(groupID: number, projectID: string): Promise<IResponse<null>> {
		try {
			// DELETE 요청 전송
			const res = await AccessAxios.delete('/dashboards/gantt/groups/' , {
				data: { id: groupID, project: projectID }
			});

				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: null
			};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}

	// GET 요청 (특정 프로젝트의 Group을 조회하여 다음 ID를 가져옴)
	static async requestGroupNextID(): Promise<IResponse<IGanttGroupResponseNextID|null>> {
		try {
			// GET 요청 전송
			const res = await AccessAxios.get('/dashboards/gantt/groups/next_id');

				return {
					statusCode: res.status,
					error: res.data.error,
					message: res.data.message,
					data: {
						next_id: res.data.next_id,
					},
			};
		} catch (err) {
			let errorMessage = '';
			if (isAxiosError(err)) {
					if (!err.response) {
							return {
									statusCode: 500,
									error: '서버와의 통신에 실패했습니다.',
									message: '서버와의 통신에 실패했습니다.',
									data: null
							};
					}

					const errorData = err.response.data;
					errorMessage = Array.isArray(errorData.error)
							? errorData.error.join('\n')
							: errorData.error;

					return {
							statusCode: err.response.status,
							error: errorMessage,
							message: errorMessage,
							data: null
					};
			}
			return {
					statusCode: 500,
					error: errorMessage,
					message: errorMessage,
					data: null
			};
		}
	}
}

interface IGanttAssigneeResponse {
	assignees: ICustomDataAssignee[] | null;
}

export class DashboardGanttAssigneeModel { // read only

	// GET 요청 (특정 프로젝트의 모든 User를 조회)
	static async requestGetAssignees(project_id: string): Promise<IResponse<IGanttAssigneeResponse | null>> {
		try {
				const res = await AccessAxios.get(`/dashboards/gantt/assignees/?project_id=${project_id}`);
				return {
						statusCode: res.status,
						error: res.data.error,
						message: res.data.message,
						data: {
							assignees: res.data.assignees,
						},
				};
		} catch (err) {
				let errorMessage = '';
				if (isAxiosError(err)) {
						if (!err.response) {
								return {
										statusCode: 500,
										error: '서버와의 통신에 실패했습니다.',
										message: '서버와의 통신에 실패했습니다.',
										data: null
								};
						}

						const errorData = err.response.data;
						errorMessage = Array.isArray(errorData.error)
								? errorData.error.join('\n')
								: errorData.error;

						return {
								statusCode: err.response.status,
								error: errorMessage,
								message: errorMessage,
								data: null
						};
				}
				return {
						statusCode: 500,
						error: errorMessage,
						message: errorMessage,
						data: null
				};
		}
	}
}

export const GetSystemAarchitectureGraph = async (project_id: string): Promise<{ success: boolean, message: string, data: IChildren[] }> => {
	try { 
		const res = await AccessAxios.get(`/dashboards/architecture/?project_id=${project_id}`)
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data.architecture,
			}
		}
		return {
			success: false,
			message: res.data.message || '베이스라인 조회 실패',
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
				message: errorMessage || error.response.data.message || '베이스라인 조회 실패',
				data: [],
			}
	}
}

export const SaveSystemAarchitectureGraph = async (project_id: string, architecture: IChildren[]): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.post(`/dashboards/architecture/?project_id=${project_id}`, {
			project_id: project_id,
			architecture: architecture,
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

export interface INoticeBoardModels {
  notice_id: number,
  notice_title: string,
  notice_content: string,
  notice_created_date: string,
  notice_view: number,
  notice_writer: string,
}

interface INoticeBoardResponse {
  results: INoticeBoardModels[] | null
  count: number
}

export const requestGetNoticeBoardData = async (project_id: string, pagelimit: number, pageoffset: number): Promise<{ success: boolean, message: string, data: INoticeBoardResponse | null }> => {
	try { 
		const res = await AccessAxios.get(`/dashboards/notice/?pagelimit=${pagelimit}&pageoffset=${pageoffset}&project_id=${project_id}`)
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message || '공지사항 조회 실패',
			data: null,
		}
	} catch (error: any) {		
			return {
				success: false,
				message: error.response.data.error || error.response.data.message || '공지사항 조회 실패',
				data: null,
			}
	}
}

// 상세 조회 
export const requestGetDetailNoticeBoardData = async (notice_id: number): Promise<{ success: boolean, message: string, data: INoticeBoardModels | null }> => {
	try { 
		const res = await AccessAxios.post(`/dashboards/notice/`, {
		  notice_id: notice_id
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
			message: res.data.message || '공지사항 상세조회 실패',
			data: null,
		}
	} catch (error: any) {		
			return {
				success: false,
				message: error.response.data.error || error.response.data.message || '공지사항 상세조회 실패',
				data: null,
			}
	}
}

// 수정 요청 
export const UpdateNoticeBoardData = async (updateProps: INoticeBoardModels): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.patch(`/dashboards/notice/`, {
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
			message: res.data.message || '공지사항 상세조회 실패',
			data: null,
		}
	} catch (error: any) {		
			return {
				success: false,
				message: error.response.data.error || error.response.data.message || '공지사항 상세조회 실패',
				data: null,
			}
	}
}

// 삭제 요청
export const DeleteNoticeBoardData = async (notice_id: number): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.delete(`dashboards/notice/?notice_id=${notice_id}`)
		if (res.data.state === 200) {
			return {
				success: true,
				message: res.data.message, 
				data: res.data.data,
			}
		}
		return {
			success: false,
			message: res.data.message || '공지사항 상세조회 실패',
			data: null,
		}
	} catch (error: any) {		
			return {
				success: false,
				message: error.response.data.error || error.response.data.message || '공지사항 상세조회 실패',
				data: null,
			}
	}
}

// 생성 요청
export interface ICreateNoticeBoardProps {
  project_id: string;
  notice_title: string;
  notice_content: string;
}
export const CreateNoticeBoardData = async (createProps: ICreateNoticeBoardProps): Promise<{ success: boolean, message: string, data: null }> => {
	try { 
		const res = await AccessAxios.put(`dashboards/notice/`, {
		  ...createProps
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
			message: res.data.message || '공지사항 추가 실패',
			data: null,
		}
	} catch (error: any) {		
			return {
				success: false,
				message: error.response.data.error || error.response.data.message || '공지사항 추가 실패',
				data: null,
			}
	}
}

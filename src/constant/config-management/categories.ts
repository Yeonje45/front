export type VersionDeliverableManagementPageCategory = {
	name: string
	value: string
}

export const VersionDeliverableManagementPageCategories: VersionDeliverableManagementPageCategory[] = [
	{
		name: '산출물 관리',
		value: 'Product-Management'
	},
	{
		name: '요구사항 관리',
		value: 'Requirements-Management'
	},
	{
		name: '소스코드 관리',
		value: 'Source-Code-Management'
	}
]

export type ManagementCategory = {
	name: string
	value: string
}

// 산출물 관리
export const DeliverableManagementPageCategory: ManagementCategory[] = [
	{
		name: '체계요구사항 명세서',
		value: 'System-Requirement-Specification'
	},
	{
		name: '소프트웨어 개발계획서(SDP)',
		value: 'Software-Development-Plan'
	},
	{
		name: '소프트웨어 요구사항 명세서(SRS)',
		value: 'Software-Requirement-Specification'
	},
	{
		name: '소프트웨어 설계 기술서(SDD)',
		value: 'Software-Design-Document'
	}
]

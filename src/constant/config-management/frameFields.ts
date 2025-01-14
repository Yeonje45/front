export interface IConfigurationFrameFields {
  frameKey: string
  frameName: string
}

export const configurationframes: IConfigurationFrameFields[] = [
  {
		frameName: '분류체계 식별자',
		frameKey: 'Classification-Identification',
	},
	{
		frameName: '형상항목 구성',
		frameKey: 'Configuration-Item-Composition',
  },
  {
		frameName: '형상식별서',
		frameKey: 'Configuration-Identification-Document',
	},
  {
		frameName: '요구사항 식별자 부여규칙',
		frameKey: 'Requirement-Identification-Rule',
  },
]

export interface ITestManagementFrameFields {
  frameKey: string
  frameName: string
}

export const testmanagementframes: ITestManagementFrameFields[] = [
	{
		frameName: '시험계획 및 절차',
		frameKey: 'Test-Plan-and-Procedures',
	},
	{
		frameName: '시험결과 버전 이력',
		frameKey: 'Test-Results-Version-History',
	}
]

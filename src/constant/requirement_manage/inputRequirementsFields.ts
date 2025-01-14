// IInputRequirementsFields는 최상위 타이틀임.
// IInputRequirementCSCFields는 IInputRequirementsFields보다 depth가 1 낮은 CSC임
// IInputRequirementCSUFields는 IInputRequirementCSCFields보다 depth가 1 낮은 CSU임
// 위 내용은 트리구조를 이루며 실제 UI에서도 트리구조로 표현됨.
// 이를 위해 IInputRequirementsFields는 IInputRequirementCSCFields[]를 가지고 있고
// IInputRequirementCSCFields는 IInputRequirementCSUFields[]를 가지고 있음.
// 이를 통해 트리구조를 구현함.
// title 클릭 시에 depth가 1 낮은 타이틀이 펼쳐지고 닫히는 방식으로 구현함.
// ex) IInputRequirementsFields의 title 클릭 시에 IInputRequirementCSCFields가 펼쳐지고 닫힘.
// ex) IInputRequirementCSCFields의 title 클릭 시에 IInputRequirementCSUFields가 펼쳐지고 닫힘.
// ex) IInputRequirementCSUFields의 title 클릭 시에 동작은 아직 미정.
// ex )

export interface IInputRequirementsFields {
	title: string
	CSCList: IInputRequirementCSCFields[]
}

export interface IInputRequirementCSCFields {
	title: string
	CSUList: IInputRequirementCSUFields[]
}

export interface IInputRequirementCSUFields {
	title: string
}

// 체계요구사항, SW요구사항, Use Case, SW 설계, SW 구현, SW 테스트, SW 검증, SW 인수, SW 유지보수
// CSC1, CSC2, CSC3, CSC4 까지...
// CSU1, CSU2, CSU3, CSU4, CSU5, CSU6, CSU7, CSU8까지...
// 위와 같은 형태로 임시 구현됨.
// 데이터를 많이 넣은 이유는 테스트를 위함이며, 요구사항 탐색기 트리 구조에서 스크롤 기능을 테스트 하기 위한 것도 있고, 트리 구조를 테스트 하기 위한 것도 있음.

export let inputRequirementsFields: IInputRequirementsFields[] = [
	{
		title: '체계요구사항',
		CSCList: [
			{
				title: 'CSC1',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
			{
				title: 'CSC2',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
			{
				title: 'CSC3',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
			{
				title: 'CSC4',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
		],
	},
	{
		title: 'SW요구사항',
		CSCList: [
			{
				title: 'CSC1',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
			{
				title: 'CSC2',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
			{
				title: 'CSC3',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
			{
				title: 'CSC4',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
				],
			},
		],
	},
	{
		title: 'Use Case',
		CSCList: [
			{
				title: 'CSC1',
				CSUList: [
					{
						title: 'CSU1',
					},
				],
			},
			{
				title: 'CSC2',
				CSUList: [
					{
						title: 'CSU1',
					},
				],
			},
			{
				title: 'CSC3',
				CSUList: [
					{
						title: 'CSU1',
					},
				],
			},
			{
				title: 'CSC4',
				CSUList: [
					{
						title: 'CSU1',
					},
				],
			},
		],
	},
	{
		title: 'SW 설계',
		CSCList: [
			{
				title: 'CSC1',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC2',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC3',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC4',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
		],
	},
	{
		title: 'SW 테스트',
		CSCList: [
			{
				title: 'CSC1',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC2',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC3',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC4',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
		],
	},
	{
		title: '구현',
		CSCList: [
			{
				title: 'CSC1',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC2',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC3',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
			{
				title: 'CSC4',
				CSUList: [
					{
						title: 'CSU1',
					},
					{
						title: 'CSU2',
					},
					{
						title: 'CSU3',
					},
					{
						title: 'CSU4',
					},
					{
						title: 'CSU5',
					},
					{
						title: 'CSU6',
					},
					{
						title: 'CSU7',
					},
					{
						title: 'CSU8',
					},
				],
			},
		],
	},
]

// 요구사항 불러오기(Import) 및 SW요구사항 테이블에 들어갈 내용입니다.
// 기본적인 테이블의 열 값과 행 값이 들어가 있습니다.
// 열 값의 목록은 아래와 같습니다.
// 식별자, 제목, 내용, 자격부여방법, CSC
// 행 값의 목록은 아래와 같습니다. ( 열의 순서와 동일하게 작성합니다. ) ( 쉼표로 구분합니다. ) ( 줄바꿈으로 행을 구분합니다. ) ( 행의 마지막에는 쉼표를 붙이지 않습니다. ( 내용 제외 ) )
// R-RAM-P-01​, Full-scale 모델 데이터입력​, 개발 단계별 Full-scale 모델의 데이터를 입력 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-02​, Full-scale 모델 데이터출력​, 개발 단계별 Full-scale 모델의 데이터를 출력 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-03​, Full-scale 모델 데이터수정​, 개발 단계별 Full-scale 모델의 데이터를 수정 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-04​, Full-scale 모델 데이터삭제​, 개발 단계별 Full-scale 모델의 데이터를 삭제 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-05​, Full-scale 모델 데이터검색​, 개발 단계별 Full-scale 모델의 데이터를 검색 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-06​, Full-scale 모델 데이터저장​, 개발 단계별 Full-scale 모델의 데이터를 저장 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-07​, Full-scale 모델 데이터복원​, 개발 단계별 Full-scale 모델의 데이터를 복원 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-08​, Full-scale 모델 데이터백업​, 개발 단계별 Full-scale 모델의 데이터를 백업 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-09​, Full-scale 모델 데이터복구​, 개발 단계별 Full-scale 모델의 데이터를 복구 할 수 있어야 한다. Demo​, CSC1​
// R-RAM-P-10​, Full-scale 모델 데이터복사​, 개발 단계별 Full-scale 모델의 데이터를 복사 할 수 있어야 한다. Demo​, CSC1​
// 임시 데이터로는 10개의 행이 됩니다.
// 실제 데이터가 들어가면 이 데이터는 삭제될 것입니다.
// 실제 데이터가 들어가면 데이터의 형식이 변경될 수 있습니다.
// 실제 데이터가 들어가면 데이터의 내용이 변경될 수 있습니다.
export interface IinputRequirementsImportData {
	head: string[]
	content: IinputRequirementsImportContentData[]
}

export interface IinputRequirementsImportContentData {
	req_id: number
	req_number: string 
	req_title: string
	req_content: string
	req_tvm_code: string
	req_update_content: string
	req_create_date: string
}



export const inputRequirementsImportData: IinputRequirementsImportData = {
	head: ['req_id', 'req_number', 'req_title', 'req_content', 'req_tvm_code', 'req_update_content', 'req_create_date'],
	content: [
		{
			req_id: 1,
			req_number: 'R-RAM-P-01',
			req_title: 'Full-scale 모델 데이터입력',
			req_content: '개발 단계별 Full-scale 모델의 데이터를 입력 할 수 있어야 한다. Demo',
			req_tvm_code: 'CSC1',
			req_update_content: 'CSU1',
			req_create_date: '2021-01-01',
		},
	],
}

export interface IInputRequirementExportFields {
	id: string
	content: string
}

// 추출할 파일 형식이 엑셀일 때 필드 값입니다.
export const inputRequirementXlsxExportFields: IInputRequirementExportFields[] = [
	{
		id: 'type',
		content: '구분',
	},
	{
		id: 'identifier',
		content: '식별자',
	},
	{
		id: 'title',
		content: '제목',
	},
	{
		id: 'content',
		content: '내용',
	},
	{
		id: 'parents',
		content: '상위항목(Parents)',
	},
	{
		id: 'children',
		content: '하위항목(Children)',
	},
	{
		id: 'method',
		content: '시험/검증방법',
	},
	{
		id: 'created_at',
		content: '생성일',
	},
	{
		id: 'updated_at',
		content: '업데이트일',
	},
	{
		id: 'CSC',
		content: 'CSC',
	},
	{
		id: 'CSU',
		content: 'CSU',
	},
]

// 추출 파일 형식이 한글일 때 필드 값입니다.
export const inputRequirementHwpExportFields: IInputRequirementExportFields[] = [
	{
		id: 'type',
		content: '구분',
	},
	{
		id: 'identifier',
		content: '식별자',
	},
	{
		id: 'title',
		content: '제목',
	},
	{
		id: 'content',
		content: '내용',
	},
	{
		id: 'parents',
		content: '상위항목(Parents)',
	},
	{
		id: 'children',
		content: '하위항목(Children)',
	},
	{
		id: 'method',
		content: '시험/검증방법',
	},
	{
		id: 'created_at',
		content: '생성일',
	},
	{
		id: 'updated_at',
		content: '업데이트일',
	},
]


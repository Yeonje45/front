export const userManageTableHeadColumns: string[] = [
  'No.',
  '이름',
  '회사 및 부서',
  '메일주소',
  '연락처',
  '역할',
  '권한',
  '프로젝트',
  '수정',
  '삭제',
]

export interface IUserManageBodyRow {
  id: number
  name: string
  department: string
	role: string
  position: string
  company: string
  contact: string[]
  email: string
  project_role:string
	project: string
}

const user1: IUserManageBodyRow = {
  id: 1,
	name: '홍길동',
	department: 'AI/Data Science 연구소',
	position: '책임연구원',
	role: 'AI-RAMP',
	company: '㈜모아소프트',
	contact: ['02-1234-5678', '010-1234-5678'],
	email: 'kdhong@moasoftware.co.kr',
  project_role: '대시보드 : 읽기,추가/수정, 삭제산출물관리 : 읽기',
	project: 'AI-RAMP',
}

const user2: IUserManageBodyRow = {
  id: 2,
	name: '김철수',
	department: 'AI/Data Science 연구소',
	position: '팀원',
	role: 'AI-RAMP',
	company: '㈜모아소프트',
	contact: ['02-1234-5678', '010-1234-5678'],
	email: 'AAA@moasoftware.co.kr',
  project_role: '대시보드 : 읽기,추가/수정',
	project: ""
}

export const userManageTableBodyRows: IUserManageBodyRow[] = [user1, user2]

export interface IProjectTableColumns {
  [key: string]: any
  id: number
  title: string
  admin: string
  date: string
  step: string
}

export const ProjectTableHeaders: string[] = [
  '프로젝트 제목',
  '프로젝트 관리자',
  '개발 기간',
  '기타정보',
  '삭제',
  '수정',
]

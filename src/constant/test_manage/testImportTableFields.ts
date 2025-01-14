export interface ITestImportTableData {
  id: number,
  name: number,
  baseline_id: number,
  baseline_number: number,
  date: string,
  info: string,
  progress_rate: number,
  uploader: string,
  uploader_name: string
}

// 시험 절차 테이블
export interface TestExecutionRecordsStdVersionList {
  baseline_id: string
  baseline_number: string
  std_id: string
  std_name: string
  std_date: string
  std_info: string
  std_progress_rate: string
  std_uploader: string
  std_uploader_name: string
  isDisabled: boolean
}

// 소스코드 버전 테이블 
export interface TestExecutionRecordsSrcVersionList {
  project_id: string
  src_version_id: string
  src_version_name: string
  src_version_status: string
  src_version_content: string
  src_version_file_zip: string
  approver_user_id: string
  approver_date: string
  approver_comment: string
  requester_user_id: string
  requester_date: string
  requester_comment: string
}

export const TestVersionImportTableHeaderFields: string[] = [
  "선택",
  "산출물 이름",
  "변경 사항",
  "완료 상태",
  "업로드 일시",
  "올린이",
]

export const TestExecutionRecordsStdVersionListTableHeaderFields: string[] = [
  "선택",
  "시험 절차서 (STD) 버전",
  "설명",
  "연결된 요구사항 버전",
  // "연결된 소스코드 버전",
  // "상태",
  "요청자",
  "요청일"
]

export const TestSrcVersionImportTableHeaderFields: string[] = [
  "선택",
  "소스코드 명칭",
  "승인 일시",
  "설명",
  "상태",
  "요청자",
  "요청일"
]

interface ITestImportTableStatus {
  [index: string]: string
  apr: string
  rjc: string
  rqt: string
  drq: string
  del: string 
}

export const TestImportTableStatus: ITestImportTableStatus =  {
  apr: '승인',
  rjc: '반려',
  rqt: '검토중(요청)',
  drq: '삭제 검토중',
  del: "삭제"
}


export const testExecutionRecordsTableHeaderFields:string[] = [
  "선택",
  "시험",
  "시험 구분",
  "시험 이름",
  "시험 절차서 버전",
  "요구사항 버전",
  "소스코드 버전",
  "시험 일시",
  "시험 장소",
  "시험 수행자",
  "시험 입회자",
  "시험 대상 요구사항 및 시험 결과",
  "신뢰성 시험 결과",
  "시험 자료",
  // "이슈"
]

export interface ITestExecutionId {
  baseline_id: number
  baseline_number: string
  test_exe_id: number
  test_exe_name: string
  std_id: number
  std_name: number
}

export interface ITestExecutionTargets {
  test_exe_id: number
  test_target_id: number
  test_target_order: number
  req_id: number
  req_number: string
  req_title: string
  test_target_result: string | null
}

export interface ITestRequirement {
  req_id: number
  req_number: string
  req_title: string
  test_target_result: string | null
}

interface ITestResultFields {
  [key: string]: string
  "pass": string
  "conditional": string
  "fail": string
  "skip": string
}

export const testResultFields:ITestResultFields = {
  "pass": "양호",
  "conditional": "조건부 충족",
  "fail": "미충족",
  "skip": "생략"
}

// 시험 수행 기록 / 시험 기록 등록 / 시험 구분 Select Options
interface ITestHistoryAppendSelectFields {
  label: string
  value: string
}

export const testHistoryAppendSelectFields: ITestHistoryAppendSelectFields[] = [
  {
    label: "단위시험",
    value: "unit_test"
  },
  {
    label: "SW통합시험",
    value: "sw_test"
  },
  {
    label: "체계통합시험",
    value: "system_test"
  },
  {
    label: "개발시험",
    value: "development_test"
  },
  {
    label: "기타",
    value: "others"
  },
]

export const testResultDynamicToolReportStaticTableHeaderFields: string[] = [
  "구분",
  "상세 항목",
  "업로드",
  "레포트",
  "결과 판정",
  "오류 검출 건수",
  "거짓 경보 검출 건수"
]

export const testResultDynamicToolReportDynamicTableHeaderFields: string[] = [
  "구분",
  "업로드",
  "레포트",
  "결과 판정",
  "도구 측정치",
  "미달성 분석치"
]

export const testResultReasonTableHeaderFields: string[] = [
  "구분",
  "상세 항목",
  "템플릿 다운",
  "업로드",
  "파일명",
]
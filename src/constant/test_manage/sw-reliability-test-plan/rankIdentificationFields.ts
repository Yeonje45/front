export interface IProjectTypeData {
  std_business_type_index: string
  custom_business_type_name: string
}

export interface IRankIdentificationInputFields {
  [index: string]: string | number
  reliability_test_index: string, // 각 row 당 PK
  reliability_plan_index: string, // 해당 데이터가 속한 시험계획 PK  
  reliability_test_unit_name: string, // 시험 단위명
  reliability_test_language: string, // 언어
  target_sw: string, // 출처
  is_reliability_static: number, // 정적시험 여부 
  is_reliability_dynamic: number, // 동적시험 여부
  coding_rule_name: string, // 코딩규칙 파일 이름
  coding_rule_tool: string, // 코딩규칙 도구
  coding_rule_version: string, // 코딩규칙 버전
  secure_name: string, // 취약점 점검 파일 이름
  secure_tool: string, // 취약점 점검 도구
  secure_version: string, // 취약점 점검 버전
  code_metric_name: string, // 코드메트릭 파일 이름
  code_metric_tool: string, // 코드매트릭 도구
  code_metric_version: string, // 코드매트릭 버전
  dynamic_test_tool: string, // 동적시험 도구
  dynamic_test_version: string, // 동적 시험 버전
  severity: string, // 결함 영향도
  exposure: string, // 결함 발생빈도
  controllability: string, // 결함 제어 가능성
  dynamic_test_level: string, // 동적시험 레벨
  target_value: string, // 목표값
}

export interface IRankIdentificationStaticInput {
  [key: string]: string
  label: string,
  name: string,
  type: string,
}

export interface IRankIdentificationStaticInputFields {
  [key: string]: IRankIdentificationStaticInput[],
  coding_rule: IRankIdentificationStaticInput[],
  secure: IRankIdentificationStaticInput[],
  code_metric: IRankIdentificationStaticInput[],
}

// 저장된 신뢰성 시험 계획 목록에서 가져온 파일 데이터 타입
export interface IFileData {
  reliability_test_index: string
  reliability_test_language: string
  coding_rule: string
  secure: string
  code_metric: string
}

export const rankIdentificationStaticInputFields: IRankIdentificationStaticInputFields = {
  coding_rule: [
    {
      label: "코딩규칙",
      name: "coding_rule_name",
      type: "file"
    },
    {
      label: "도구",
      name: "coding_rule_tool",
      type: "select"
    },
    {
      label: "버전",
      name: "coding_rule_version",
      type: "text"
    },
  ],
  secure: [
    {
      label: "취약점 점검",
      name: "secure_name",
      type: "file"
    },
    {
      label: "도구",
      name: "secure_tool",
      type: "select"
    },
    {
      label: "버전",
      name: "secure_version",
      type: "text"
    },
  ],
  code_metric: [
    {
      label: "코드 메트릭",
      name: "code_metric_name",
      type: "file"
    },
    {
      label: "도구",
      name: "code_metric_tool",
      type: "select"
    },
    {
      label: "버전",
      name: "code_metric_version",
      type: "text"
    },
  ],
}

export interface IRankIdentificationStaticSelectName {
  [key: string]: string[]
  "C": string[],
  "C++": string[],
  "JAVA": string[],
  "C#": string[],
  "기타": string[],
}

export interface IRankIdentificationStaticSelectFileNameFields {
  [key: string]: IRankIdentificationStaticSelectName,
  coding_rule_name: IRankIdentificationStaticSelectName,
  secure_name: IRankIdentificationStaticSelectName,
  code_metric_name: IRankIdentificationStaticSelectName,
  tool: IRankIdentificationStaticSelectName,
}

export const rankIdentificationStaticSelectFileNameFields: IRankIdentificationStaticSelectFileNameFields = {
  coding_rule_name: {
    "C": ["DAPA SCR-G", "MISRA C 2012"],
    "C++": ["MISRA-C++ 2008", "JSF++"],
    "JAVA": ["Code conventions for the Java"],
    "C#": ["C# Coding Conventions"],
    "기타": [],
  },
  secure_name: {
    "C": ["CWE-658"],
    "C++": ["CWE-659"],
    "JAVA": ["CWE-660"],
    "C#": [],
    "기타": [],
  },
  code_metric_name: {
    "C": ["Code metric"],
    "C++": ["Code metric"],
    "JAVA": ["Code metric"],
    "C#": ["Code metric"],
    "기타": ["Code metric"],
  },
  tool: {
    "C": ["LDRA"],
    "C++": ["LDRA"],
    "JAVA": ["LDRA"],
    "C#": ["Visual Studio"],
    "기타": [],
  }
}


export const rankIdentificationDynamicSelectSeverityFields: string[] = [
  "S1",
  "S2",
  "S3",
  "S4",
]


export const rankIdentificationDynamicSelectExposureFields: string[] = [
  "E1",
  "E2",
  "E3",
  "E4",
]

export const rankIdentificationDynamicSelectControllabilityFields: string[] = [
  "C1",
  "C2",
  "C3",
]


export interface ICodeMetricTableColumn {
  [key: string]: string,
  codeMetric: string,
  limitValue: string,
  note: string,
}

export const rankIdentificationCodeMetricModalColumnFields: ICodeMetricTableColumn[] = [
  {
    codeMetric: "Cyclomatic Complexity",
    limitValue: "",
    note: ""
  },
  {
    codeMetric: "Number of Call Levels",
    limitValue: "",
    note: "함수 내 조건문 등의 최대 중첩(Nesting)의 깊이"
  },
  {
    codeMetric: "Number of Function Parameters",
    limitValue: "",
    note: ""
  },
  {
    codeMetric: "Number of Calling Functions",
    limitValue: "",
    note: "이 함수가 몇 개의 다른 함수에 의해 호출되는가? (C언어 해당)"
  },
  {
    codeMetric: "Number of Called Functions",
    limitValue: "",
    note: "이 함수가 몇 개의 다른 함수를 호출 하는가? * 같은 함수를 호출시는 1로 계산 (C언어 해당)"
  },
  {
    codeMetric: "Number of Executable Code Lines",
    limitValue: "",
    note: ""
  },

]

export interface IRankIdentificationInputDataSelect {
  [key: string]: string
  name: string
  text: string
}

interface IRankIdentificationInputDataErrorMessages {
  [key: string]: string | IRankIdentificationInputDataSelect
  reliability_test_language_text: string,
  reliability_test_language: string,
  coding_rule_name: IRankIdentificationInputDataSelect,
  coding_rule_tool: IRankIdentificationInputDataSelect,
  coding_rule_version: string,
  secure_name: IRankIdentificationInputDataSelect,
  secure_tool: IRankIdentificationInputDataSelect,
  secure_version: string,
  code_metric_name: IRankIdentificationInputDataSelect,
  code_metric_tool: IRankIdentificationInputDataSelect,
  code_metric_version: string,
  dynamic_test_tool: IRankIdentificationInputDataSelect,
  dynamic_test_version: string,
}

export const rankIdentificationInputDataErrorMessages: IRankIdentificationInputDataErrorMessages = {
  reliability_test_language: "개발 언어를 선택해주세요.",
  reliability_test_language_text: "개발 언어를 입력해주세요.",
  coding_rule_name: {
    name: "코딩규칙을 선택해주세요.",
    text: "코딩규칙을 입력해주세요.",
  },
  coding_rule_tool: {
    name: "코딩규칙 도구를 선택해주세요.",
    text: "코딩규칙 도구를 입력해주세요."
  },
  coding_rule_version: "코딩규칙 버전을 입력해주세요.",
  secure_name: {
    name: "취약점 점검을 선택해주세요.",
    text: "취약점 점검을 입력해주세요."
  },
  secure_tool: {
    name: "취약점 점검 도구를 선택해주세요.",
    text: "취약점 점검 도구를 입력해주세요."
  },
  secure_version: "취약점 점검 버전을 입력해주세요.",
  code_metric_name: {
    name: "코드 메트릭을 선택해주세요.",
    text: "코드 메트릭을 입력해주세요."
  },
  code_metric_tool: {
    name: "코드 메트릭 도구를 선택해주세요.",
    text: "코드 메트릭 도구를 입력해주세요."
  },
  code_metric_version: "코드 메트릭 버전을 입력해주세요.",
  dynamic_test_tool: {
    name: "동적시험 도구를 선택해주세요.",
    text: "동적시험 도구를 입력해주세요."
  },
  dynamic_test_version: "동적시험 버전을 입력해주세요.",
}

export interface ISaveListData {
  reliability_plan_index: string
  reliability_plan_title: string
  reliability_plan_content: string
  user_id: string
  user_name: string
  reliability_test_plan_update_date: string
}
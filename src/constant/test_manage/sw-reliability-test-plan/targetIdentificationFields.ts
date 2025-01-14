

export const targetIdentificationSelectTypeFields: string[] = [
  '무기체계 연구개발사업(탐색개발)',
  '무기체계 연구개발사업(체계개발)',
  '핵심기술(시험개발)',
  '핵심SW(시험개발)',
  '부품국산화(핵심부품)',
  '(경미한)성능개량',
  '현존전력 성능 극대화 사업(시험평가대상)',
  '핵심기술(응용연구)',
  '핵심기술(기초연구)',
  '구매사업',
  '부품국산화(일반부품)',
  '미래도전기술사업',
  '신속획득사업',
  '그 외(사용자 입력)',
]

export const targetIdentificationSelectTypeCommentFields: string[] = [
  "사업의 목적, 특성, 그리고 신뢰성확보 필요성을 고려하여 적용 여부 및 적용 기준을 결정하여 적용",
  "정적시험(코딩규칙, 취약점 점검, 코드메트릭), 동적시험 수행 대상",
  "정적시험의 코드 메트릭과 동적시험 항목은 사업의 특성, 체계 개발 시 활용계획을 고려하여 적용 여부 및 적용범위를 결정 \n(단, 시험개발 등에서 개발한 소프트웨어가 체계사업 등에 적용될 경우, 체계개발 단계의 신뢰성시험 기준을 고려하여 재수행 해야 한다. )",
  "정적시험의 코드 메트릭과 동적시험 항목은 사업의 특성, 체계 개발 시 활용계획을 고려하여 적용 여부 및 적용범위를 결정 \n(단, 시험개발 등에서 개발한 소프트웨어가 체계사업 등에 적용될 경우, 체계개발 단계의 신뢰성시험 기준을 고려하여 재수행 해야 한다. )",
  "소프트웨어 신뢰성시험을 적용하되, 사업의 목적과 특성을 고려하여 적용 기준을 결정하여 적용",
  "정적시험(코딩규칙, 취약점 점검, 코드메트릭), 동적시험 수행 대상",
  "정적시험(코딩규칙, 취약점 점검, 코드메트릭), 동적시험 수행 대상",
  "사업의 목적, 특성, 그리고 신뢰성확보 필요성을 고려하여 적용 여부 및 적용 기준을 결정하여 적용",
  "사업의 목적, 특성, 그리고 신뢰성확보 필요성을 고려하여 적용 여부 및 적용 기준을 결정하여 적용",
  "필요시 신뢰성 시험 적용",
  "체계부품국산화, 양산부품국산화와 같이 전력화 대상 장비에 해당하는 경우에는 신뢰성시험을 적용하되, 사업의 목적과 특성을 고려하여 적용 기준을 결정하여 적용함",
  "사업의 목적, 특성, 그리고 신뢰성확보 필요성을 고려하여 적용 여부 및 적용 기준을 결정하여 적용",
  "대상사업의 능력요구서에서 신뢰성시험 요구가 있는 경우 적용하되, 적용 범위 및 적용 기준은 사업의 목적과 특성으로 고려하여 결정",
  "필요시 신뢰성 시험 적용"
]

export const targetIdentificationSelectTestUnitFields: string[] = [
  'CSCI',
  'CSC',
  'CSU',
  'SW',
  'BUILD',
]

export const targetIdentificationSelectDevLangFields: string[] = [
  'C',
  'C++',
  'C#',
  'JAVA',
  '기타',
]

export const targetIdentificationSelectDevLangCommentFields: string[] = [
  "신뢰성/보안성 시험 대상임",
  "신뢰성/보안성 시험 대상임",
  "신뢰성/보안성 시험 대상임",
  "신뢰성/보안성 시험 대상임",
  "자동화도구 지원 여부 확인 및 사업기관과 논의 필요"
]


interface ITargetIdentificationSelectStaticTestFields {
  [key: string]: string
  name: string,
  value: string
}

export const targetIdentificationSelectApplySWFields: ITargetIdentificationSelectStaticTestFields[] = [
  {
    name: '개발 소프트웨어',
    value: 'development',
  },
  {
    name: '기개발 소프트웨어',
    value: 'legacy',
  },
  {
    name: '상용(COTS) 소프트웨어 ( HW와 함께 제공되는 SW 포함 )',
    value: 'cots',
  },
  {
    name: '공개( Open ) 소프트웨어',
    value: 'opensource',
  },
  {
    name: '자동 생성 Code',
    value: 'autocode',
  }
]

export const targetIdentificationTableHeaderFields: string[] = [
  '삭제',
  '시험단위명',
  'SW 출처',
  '개발언어',
  '정적시험대상',
  '동적시험대상',
]
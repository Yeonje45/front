export const productTailoringStandardTitleFields: string[] = ['번호', '산출물']

export interface IProductTailoringStandardContentFields {
  [key: string]: number | string
  std_output_index: number
  std_output_name: string
}

export interface IProductTailoringBusinessContentFields {
  std_output_index: number
  std_output_name: string
  replacement_output: null | number
  separate_output: boolean
  output_name?: string
  alter_output?: number
  custom_output_stage?: string[]
  std_output_alias?: string
}
export interface IProductTailoringBusinessAddData {
  output_name: string // 입력한 Value
  alter_output: number // 대체 산출물 번호
  custom_output_stage: string[] // 선택한 개발단계
  std_output_alias: string // 약어 
}


export const productTailoringBusinessTitleFields: string[] = [
  '번호',
  '산출물',
  '독립 문서 여부',
]

export interface IProductTailoringFinalContentFields {
  std_output_index: number
  std_output_name: string
  replacement_output?: null | number
  separate_output?: boolean | 'NA'
  output_name?: string
  alter_output?: number
  custom_output_stage?: string[]
  std_output_alias?: string
}

export const productTailoringFinalTitleFields: string[] = [
  '번호',
  '표준 산출물',
  '작성 대상',
]

export const productTailoringBusinessAddDataStage: { value: string; label: string }[] = [
  { value: 'kom', label: 'SW 개발계획' },
  { value: 'srr', label: 'SW 요구사항 분석' },
  { value: 'pdr', label: 'SW 구조 설계' },
  { value: 'ddr', label: 'SW 상세 설계' },
  { value: 'cdr', label: 'SW 구현' },
  { value: 'trr', label: 'SW 통합 및 시험' },
  { value: 'svr', label: '체계 통합 및 시험' },
  { value: 'fqr', label: '시험 평가' },
  { value: 'par', label: '규격화 및 인도' },
]

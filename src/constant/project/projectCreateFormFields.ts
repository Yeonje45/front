export interface IProjectManageUnit {
  [key: string]: string
}

export interface IProjectCreateFormFields {
  label: string
  placeholder: string
  controlId: string
  type: string
  isRadio?: boolean
  radioData?: IProjectManageUnit[]
}

export const formFields: IProjectCreateFormFields[] = [
  {
    label: '프로젝트 제목',
    placeholder: '프로젝트 제목을 입력하세요',
    controlId: 'project_name',
    type: 'text',
  },
  {
    label: '개발 시작일',
    placeholder: '',
    controlId: 'project_start_date',
    type: 'date',
  },
  { label: '개발 종료일', placeholder: '', controlId: 'project_end_date', type: 'date' },
  {label: '사업유형', placeholder: '', controlId: 'std_business_type_index', type: 'text'},
  {
    label: '프로젝트 관리 단위',
    placeholder: '프로젝트 관리 단위를 선택하세요',
    controlId: 'project_unit_code',
    type: 'radio',
    radioData: [
      { label: '체계', name: 'project_unit_code', value: 'sys' },
      { label: '부체계', name: 'project_unit_code', value: 'subsys' },
      { label: 'CSCI', name: 'project_unit_code', value: 'csci' },
    ],
  },
  {
    label: '체계명',
    placeholder: '체계명을 입력하세요',
    controlId: 'project_sys_name',
    type: 'text',
  },
  {
    label: '부체계명',
    placeholder: '부체계명을 입력하세요',
    controlId: 'project_subsys_name',
    type: 'text',
  },
  {
    label: '구성품명',
    placeholder: '구성품명을 입력하세요',
    controlId: 'project_component_name',
    type: 'text',
  },
  {
    label: 'CSCI명',
    placeholder: 'CSCI명을 입력하세요',
    controlId: 'project_csci_name',
    type: 'text',
  },
]

interface ICreateFormState1 {
  value: string
  isError: boolean
}

export interface ICreateFormState {
  project_name: ICreateFormState1
  admin: ICreateFormState1
  project_start_date: ICreateFormState1
  project_end_date: ICreateFormState1
  project_unit_code: ICreateFormState1
  project_sys_name: ICreateFormState1
  project_subsys_name: ICreateFormState1
  project_component_name: ICreateFormState1
  project_csci_name: ICreateFormState1
  std_business_type_index: ICreateFormState1
  custom_business_type_name: ICreateFormState1
}


export const std_business_type_name: { label: string, value: string }[] = [
  { label: '무기체계 연구개발사업(탐색개발)', value: '1' },
  { label: '무기체계 연구개발사업(체계개발)', value: '2' },
  { label: '핵심기술(시험개발)', value: '3' },
  { label: '핵심SW(시험개발)', value: '4' },
  { label: '부품국산화(핵심부품)', value: '5' },
  { label: '(경미한)성능개량', value: '6' },
  { label: '현존전력 성능 극대화 사업(시험평가대상)', value: '7' },
  { label: '핵심기술(응용연구)', value: '8' },
  { label: '핵심기술(기초연구)', value: '9' },
  { label: '구매사업', value: '10' },
  { label: '부품국산화(일반부품)', value: '11' },
  { label: '미래도전기술사업', value: '12' },
  { label: '신속획득사업', value: '13' },
  { label: '그 외(사용자 입력)', value: '14' },
];
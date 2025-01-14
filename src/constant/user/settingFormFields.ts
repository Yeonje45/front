export interface ISettingFormFields {
  label: string
  placeholder: string
  controlId: string
  type: string
  options?: ISettingFormOptionFields[]
}

export interface ISettingFormOptionFields {
  label: string
  option: string
}

export const formFields: ISettingFormFields[] = [
  { label: 'ID', placeholder: 'ID를 입력하세요', controlId: 'user_id', type: 'text' },
  {
    label: '이름',
    placeholder: '이름을 입력하세요',
    controlId: 'user_name',
    type: 'text',
  },
  {
    label: '부서',
    placeholder: '부서를 입력하세요',
    controlId: 'user_dept',
    type: 'text',
  },
  {
    label: '직책',
    placeholder: '직책을 입력하세요',
    controlId: 'user_position',
    type: 'text',
  },
  {
    label: '회사',
    placeholder: '회사를 입력하세요',
    controlId: 'user_company',
    type: 'text',
  },
  {
    label: '휴대전화',
    placeholder: '휴대전화를 입력하세요',
    controlId: 'user_contact_1',
    type: 'text',
  },
  {
    label: '연락처',
    placeholder: '연락처를 입력하세요',
    controlId: 'user_contact_2',
    type: 'text',
  },
  {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    controlId: 'user_email',
    type: 'email',
  },
  {
    label: '생년월일',
    placeholder: '생년월일을 입력하세요',
    controlId: 'user_birth',
    type: 'date',
  },
  {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    controlId: 'user_password',
    type: 'password',
  },
  {
    label: '비밀번호 확인',
    placeholder: '비밀번호를 확인하세요',
    controlId: 'user_confirmPassword',
    type: 'password',
  },
  {
    label: '프로필 사진',
    placeholder: '프로필 사진을 등록하세요',
    controlId: 'user_profile',
    type: 'file',
  },
]

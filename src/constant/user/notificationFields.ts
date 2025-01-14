export interface IProjectNotificationFormFields {
  projectTitle: string
  subTitle: string
  subState: boolean
  notifications: INotificationFormFields[]
}

export interface INotificationFormFields {
  content: string
  state: boolean
}

export const testVariables: IProjectNotificationFormFields[] = [
  {
    projectTitle: 'SDSP',
    subTitle: '(ICON) 산물출 관리',
    subState: false,
    notifications: [
      { content: '업로드 알림', state: false },
      { content: '산출물 진행상태 변경 알림', state: false },
    ],
  },
  {
    projectTitle: 'KDDX',
    subTitle: '(ICON) KDDX 관리',
    subState: false,
    notifications: [
      { content: '업로드 알림', state: false },
      { content: '진행상태 변경 알림', state: false },
    ],
  },
]

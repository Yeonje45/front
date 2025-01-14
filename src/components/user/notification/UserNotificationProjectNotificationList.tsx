import { useState } from 'react'
import UserNotificationProjectNotificationItem from './UserNotificationProjectNotificationItem'

import {
  INotificationFormFields,
  IProjectNotificationFormFields,
} from 'constant/user/notificationFields'

interface IProps {
  projectItem: IProjectNotificationFormFields
  isOpen: boolean
}

interface IProjectNotifications {
  subTitle: string
  subState: boolean
  notifications: INotificationFormFields[]
}

interface ICollapse {
  isOpen: boolean
  children: React.ReactNode
  className?: string
}

const NotificationCollapse = ({ isOpen, children, className }: ICollapse) => {
  return (
    <div
      className={`transition-all duration-200 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-full' : 'max-h-0'
      }`}>
      {children}
    </div>
  )
}

const UserNotificationProjectNotificationList = ({ projectItem, isOpen }: IProps) => {
  const [notifications, setNotifications] = useState<IProjectNotifications>({
    subTitle: projectItem.subTitle,
    subState: projectItem.subState,
    notifications: projectItem.notifications,
  })

  // subState가 true가되면 notifications의 모든 state를 true로 변경하는 함수
  const handleSubState = (): void => {
    setNotifications({
      ...notifications,
      subState: !notifications.subState,
      notifications: notifications.notifications.map(notification => ({
        ...notification,
        state: !notifications.subState,
      })),
    })
  }

  // notification의 state를 변경하는 함수
  const handleState = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNotifications({
      ...notifications,
      notifications: notifications.notifications.map(notification =>
        notification.content === e.target.id
          ? { ...notification, state: !notification.state }
          : notification,
      ),
    })
  }

  return (
    <NotificationCollapse isOpen={isOpen} className="w-3/4 p-2">
      <div id={projectItem.projectTitle}>
        {/* 모든 알림을 한 번에 On/Off */}
        <div className={`flex items-center justify-between w-3/4 text-xl py-1 my-1`}>
          <span className="fs-5">{projectItem.subTitle}</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              checked={notifications.subState}
              id={projectItem.subTitle}
              onChange={handleSubState}
              className="sr-only peer"
            />
            <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {/* 알림 목록들 */}
        <div className="flex flex-col justify-between pt-2">
          {notifications.notifications.map((notification, index_nd) => (
            <UserNotificationProjectNotificationItem
              key={index_nd}
              notificationItem={notification}
              handleState={handleState}
            />
          ))}
        </div>
      </div>
    </NotificationCollapse>
  )
}

export default UserNotificationProjectNotificationList

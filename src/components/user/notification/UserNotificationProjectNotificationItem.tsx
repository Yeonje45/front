import { INotificationFormFields } from 'constant/user/notificationFields'

interface IProps {
  notificationItem: INotificationFormFields
  handleState: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UserNotificationProjectNotificationItem = ({
  notificationItem,
  handleState,
}: IProps) => {
  return (
    <div className="flex items-center justify-between w-3/4 mb-1">
      <span className="text-lg before:content-['_-_']">{notificationItem.content}</span>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={notificationItem.state}
          value=""
          id={notificationItem.content}
          onChange={handleState}
          className="sr-only peer"
        />
        <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  )
}

export default UserNotificationProjectNotificationItem

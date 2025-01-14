import { ArrowBarDown, ArrowBarUp } from 'react-bootstrap-icons'

import { IProjectNotificationFormFields } from 'constant/user/notificationFields'

interface IProps {
  projectItem: IProjectNotificationFormFields
  collapseHandler: (projectTitle: string) => void
  isOpen: boolean
}

const UserNotificationProjectItem = ({
  projectItem,
  collapseHandler,
  isOpen,
}: IProps) => {
  return (
    <div className="border-b w-3/4 flex items-center justify-between">
      <span className="text-3xl">{projectItem.projectTitle}</span>
      <button
        onClick={() => collapseHandler(projectItem.projectTitle)}
        aria-controls={projectItem.projectTitle}
        aria-expanded={isOpen}
        className="text-lg border-0 text-black bg-transparent"
        type="button">
        {isOpen && <ArrowBarUp />}
        {!isOpen && <ArrowBarDown />}
      </button>
    </div>
  )
}

export default UserNotificationProjectItem

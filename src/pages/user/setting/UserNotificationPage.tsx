import UserAccessPointFormContainer from 'components/user/containers/UserAccessPointFormContainer'
import UserNotificationProjectList from 'components/user/notification/UserNotificationProjectList'

import { testVariables } from 'constant/user/notificationFields'

const UserNotificationPage = () => {
  return (
    <UserAccessPointFormContainer page_title="알림 관리​">
      <UserNotificationProjectList projectList={testVariables} />
    </UserAccessPointFormContainer>
  )
}

export default UserNotificationPage

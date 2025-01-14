import { Fragment, useEffect, useState } from 'react'
import Container from 'tailwindElement/Container'

import UserNotificationProjectItem from './UserNotificationProjectItem'
import { IProjectNotificationFormFields } from 'constant/user/notificationFields'
import UserNotificationProjectNotificationList from './UserNotificationProjectNotificationList'

interface IProps {
  projectList: IProjectNotificationFormFields[]
}

interface ICollapseState {
  projectTitle: string
  isOpen: boolean
}

const UserNotificationProjectList = ({ projectList }: IProps) => {
  // 프로젝트 정보를 배열로 받아 프로젝트 이름에 해당하는 부분만 추출
  // 프로젝트 이름, Collapse State로 객체 배열로 초기화
  const [isOpenProject, setIsOpenProject] = useState<ICollapseState[]>(
    projectList
      .map(projectItems => projectItems.projectTitle)
      .map(title => ({
        projectTitle: title,
        isOpen: false,
      })),
  )

  const collapseHandler = (projectTItle: string) => {
    setIsOpenProject(prev => {
      return prev.map(project => {
        if (project.projectTitle == projectTItle) {
          return {
            ...project,
            isOpen: !project.isOpen,
          }
        }
        return project
      })
    })
  }

  return (
    <Container fluid className="flex flex-col h-full items-start justify-start gap-2">
      {projectList.map((projectItem, index_st) => (
        <div key={index_st} className="w-3/4">
          <UserNotificationProjectItem
            projectItem={projectItem}
            collapseHandler={collapseHandler}
            isOpen={
              isOpenProject.find(
                project => project.projectTitle === projectItem.projectTitle,
              )?.isOpen || false
            }
          />
          <UserNotificationProjectNotificationList
            projectItem={projectItem}
            isOpen={
              isOpenProject.find(
                project => project.projectTitle === projectItem.projectTitle,
              )?.isOpen || false
            }
          />
        </div>
      ))}
    </Container>
  )
}

export default UserNotificationProjectList

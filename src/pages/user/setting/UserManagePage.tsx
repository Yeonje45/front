import React from 'react';
import Swal from 'sweetalert2';
import { EyeSlash, Eye } from 'react-bootstrap-icons'

import Input from 'tailwindElement/Input';
import UserAssignModal from 'components/user/manage/UserAssignModal';
import UserInfoModal from 'components/user/manage/UserInfoModal';

import { AssignUserActive } from 'models/UserInfoModel';
import { GetUserList, IUserListModel } from 'models/ProjectInfoModel'

export interface IFilterdProjectModel {
	user_id: string;
	user_name: string;
	user_company: string;
	user_dept: string;
	user_email: string; 
	user_contact: string[];
	user_position: string;
	project_id: string;
	project_name: string;
	user_role: string;
	is_active: boolean; // 사용자 활성화 여부
}

const UserManagePage = () => {
  const [userList, setUserList] = React.useState<IUserListModel[] | null>(null)
  const [userProjectFilterdList, setUserProjectFilterdList] = React.useState<IFilterdProjectModel[] | null>(null)
  const [projectList, setProjectList] = React.useState<string[]>([]) // 프로젝트 목록
  const [selectedProject, setSelectedProject] = React.useState<string>("") // 선택된 프로젝트

  React.useEffect(() => {
    getUserList()
  }, [])

  /* 사용자 목록 조회 */
  const getUserList = async (): Promise<void> => {
    const res = await GetUserList();
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message || '사용자 목록을 조회하는데 실패하였습니다.'
      })
      return
    }
    setUserList(() => res.data)
    filterUserProjects(res.data)
    return 
  }

  /* 사용자 활성화/비활성화 함수 */
  const handleUserActiveHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const user_id = event.currentTarget.id
		const user_active = event.currentTarget.name === "active" ? true : false
    const checkConfirm = await Swal.fire({
      title: user_active ? '사용자 비활성화' : '사용자 활성화',
      text: user_active ? '사용자를 비활성화 하시겠습니까?' : '사용자를 활성화 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소'
    })
    if (!checkConfirm.isConfirmed) {
      return
    }
    const res = await AssignUserActive({user_id})
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message || '사용자 활성화/비활성화에 실패하였습니다.'
      })
      return
    }
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: user_active ? '사용자를 비활성화 하였습니다.' : '사용자를 활성화 하였습니다.'
    })
    getUserList()
  }

  const handleChangeSelectedProject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(() => event.target.value)
  }

  /* 사용자 프로젝트 필터링 */
  const filterUserProjects = (users: IUserListModel[] | null) => {
    if (!users) return
    let filterdList:IFilterdProjectModel[] | null  = []
    let projectList: string[] = [] // 중복 프로젝트 이름은 추가하지 않고, 한번만 추가하며 프로젝트 이름만 저장
    users.map((userItem) => {
      if (userItem.user_projects && userItem.user_projects.length > 0) {
        userItem.user_projects.map((projectItem) => {
          if (!projectList.includes(projectItem.project_name)) {
            projectList.push(projectItem.project_name)
          }
        })
        userItem.user_projects.map((projectItem) => {
          filterdList?.push({
            user_id: userItem.user_id,
            user_name: userItem.user_name,
            user_company: userItem.user_company,
            user_dept: userItem.user_dept,
            user_email: userItem.user_email,
            user_contact: userItem.user_contact,
            user_position: userItem.user_position,
            project_id: projectItem.project_id,
            project_name: projectItem.project_name,
            user_role: projectItem.user_role,
            is_active: userItem.is_active
          })
        })
      } else {
        filterdList?.push({
          user_id: userItem.user_id,
          user_name: userItem.user_name,
          user_company: userItem.user_company,
          user_dept: userItem.user_dept,
          user_email: userItem.user_email,
          user_contact: userItem.user_contact,
          user_position: userItem.user_position,
          project_id: "",
          project_name: "",
          user_role: "",
          is_active: userItem.is_active
        })
      }
    })
    setUserProjectFilterdList(() => filterdList)
    setProjectList(() => projectList)
  }
  
  // 프로젝트 역할에 따른 텍스트 반환
  const getProjectRole = (role: string) => {
    switch (role) {
      case 'PM':
        return '프로젝트 매니저'
      case 'DEV':
        return '개발자'
      default:
        return ''
    }
  }
  
  return (
    <div className="container mx-4 md:mx-auto overflow-x-auto pb-12 space-y-3">
      <div className="w-full flex flex-wrap items-center justify-end space-x-3">
        <div className="flex items-center">
          <label className="text-center">프로젝트 검색</label>
          <Input.Select onChange={handleChangeSelectedProject}>
            <option value="">전체 프로젝트</option>
            {projectList && projectList.length > 0 && projectList.map((project, index) => (
              <option key={index} value={project}>{project}</option>
            ))}
          </Input.Select>
        </div>
        <UserAssignModal />
      </div>
      <table className="table table-border w-full">
        <thead className="whitespace-nowrap">
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>회사 및 부서</th>
            <th>메일주소</th>
            <th>연락처</th>
            <th>역할</th> 
            <th>프로젝트</th>
            <th>수정</th>
            <th>활성화/비활성화</th>
          </tr>
        </thead>
        <tbody>
          {userProjectFilterdList && userProjectFilterdList.length > 0 && userProjectFilterdList.map((filterdItem, index) => (
            (selectedProject === "" || selectedProject === filterdItem.project_name) && (
              <tr key={index}>
                <td>{filterdItem.user_id}</td>
                <td>{filterdItem.user_name}</td>
                <td>{filterdItem.user_company}/{filterdItem.user_dept}</td>
                <td>{filterdItem.user_email}</td>
                <td>
                  <div>
                    {filterdItem.user_contact && filterdItem.user_contact.map((contact, index) => (
                      <div key={index}>{contact}</div>
                    ))}
                  </div>
                </td>
                <td>{getProjectRole(filterdItem.user_role)}</td>
                <td>{filterdItem.project_name}</td>
                <td>
                  <UserInfoModal user={filterdItem} />
                </td>
                <td>
                  <button id={filterdItem.user_id} name={filterdItem.is_active ? "active" : "deactive"} onClick={handleUserActiveHandler}>
                    {filterdItem.is_active ? (
                      <Eye size={20} />
                    ) : (
                      <EyeSlash className="mx-auto" size={20} />
                    )}
                  </button>
                </td>
              </tr>
            )
          ))}

        </tbody>
      </table>
    </div>
  )
}

export default UserManagePage

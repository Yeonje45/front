import React from "react"
import Swal from "sweetalert2"
import { CaretRightFill, CaretLeftFill } from "react-bootstrap-icons"

import Input from "tailwindElement/Input"
import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal"
import PanelContainer from "components/common/panels/PanelContainer"
import PanelHeader from "components/common/panels/PanelHeader"
import PanelBody from "components/common/panels/PanelBody"

import { GetAssignUserList, IAssignUserListModel } from 'models/UserInfoModel'
import { IUserListModel, AssignUserActive, IAssignUserActiveProps } from 'models/ProjectInfoModel'

interface IFilterProjectListModel {
  project_id: string
  project_name: string
}

const UserAssignModal = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const [assignList, setAssignList] = React.useState<IAssignUserListModel[] | null>(null)
  const [filterdAssignUserList, setFilterdAssignUserList] = React.useState<IUserListModel[] | null>(null) // 모든 사용자 목록
  const [filterdProjectAssignUserList, setFilterdProjectAssignUserList] = React.useState<IUserListModel[] | null>(null) // 프로젝트에 해당한 사용자 목록

  const [filterdProjectList, setFilterdProjectList] = React.useState<IFilterProjectListModel[] | null>(null)

  const [selectedProjectID, setSelectedProjectID] = React.useState<string>('')
  const [selectedProjectMemberIdList, setSelectedProjectMemberIdList] = React.useState<string[]>([])
  const [selectedSystemMemberIdList, setSelectedSystemMemberIdList] = React.useState<string[]>([])
  
  const handleOpenModal = async () => {
    const chekced = await getAssignUserList()
    if (!chekced) { return }
    setIsOpen(() => true)
  } 
  
  const handleCloseModal = () => { 
    setSelectedProjectID(() => '')
    setSelectedProjectMemberIdList(() => [])
    setSelectedSystemMemberIdList(() => [])
    setFilterdProjectAssignUserList(() => null)
    setFilterdAssignUserList(() => null)
    setFilterdProjectList(() => null)
    setAssignList(() => null)
    setIsOpen(() => false) 
  }
  
  const getAssignUserList = async (): Promise<boolean> => {
    const res = await GetAssignUserList()
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message || '프로젝트 맴버 목록을 조회하는데 실패하였습니다.'
      })
      return false
    }
    setAssignList(() => res.data)
    filterProjectList(res.data)
    return true
  }
  
  /* 프로젝트 정보만 Filter */
  const filterProjectList = (userList: IAssignUserListModel[] | null) => {
    if (!userList) return
    const filterd = userList.map((userItem) => {
      return {
        project_id: userItem.project_id,
        project_name: userItem.project_name
      }
    })
    setFilterdProjectList(() => filterd)
    return
  }

  /* 프로젝트 Select Box 클릭 시에 해당 프로젝트에 해당한 사용자 목록 추출 */
  const handleChangeProjectSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!assignList) return
    const project_id = event.target.value
    if (project_id == '') {
      setFilterdAssignUserList(() => null)
      setFilterdProjectAssignUserList(() => null)
      setSelectedProjectID(() => '')
      setSelectedProjectMemberIdList(() => [])
      setSelectedSystemMemberIdList(() => [])
      return
    }
    const filterd = assignList.filter((assignItem) => assignItem.project_id === project_id)[0]
    if (!filterd) { return }
    setSelectedProjectID(() => project_id)
    setFilterdProjectAssignUserList(() => filterd.project_member)
    setFilterdAssignUserList(() => filterd.system_member)
  }

  /* 프로젝트 사용자 체크박스 클릭 시에 */
  const handleChangeProjectMemeber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const user_id = event.target.value
    const checked = event.target.checked
    if (checked) {
      setSelectedProjectMemberIdList((prev) => [...prev, user_id])
    } else {
      setSelectedProjectMemberIdList((prev) => prev.filter((item) => item !== user_id))
    }
  }

  /* 시스템 사용자 체크박스 클릭 시에 */
  const handleChangeSystemMemeber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const user_id = event.target.value
    const checked = event.target.checked
    if (checked) {
      setSelectedSystemMemberIdList((prev) => [...prev, user_id])
    } else {
      setSelectedSystemMemberIdList((prev) => prev.filter((item) => item !== user_id))
    }
  }

  /* Left 화살표 클릭 시에  */
  const handleAddProjectMember = () => {
    if ( !filterdAssignUserList || filterdAssignUserList.length === 0 ) { return }
    if (selectedProjectID === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '프로젝트를 선택해주세요.'
      })
      return
    }
    if (selectedSystemMemberIdList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '추가할 사용자를 선택해주세요.'
      })
      return
    }
    // const filterd = filterdAssignUserList.filter((filterdItem) => selectedSystemMemberIdList.includes(filterdItem.user_id))
    // filter 하여 filterdProjectAssignUserList에 추가 하는데, 이미 존재하는 사용자는 추가하지 않음
    const filterd = filterdAssignUserList
    .filter((filterdItem) => selectedSystemMemberIdList.includes(filterdItem.user_id))
    .filter((filterdItem) => !filterdProjectAssignUserList?.map((item) => item.user_id).includes(filterdItem.user_id))
    setFilterdProjectAssignUserList((prev) => {
      if (!prev) { return filterd }
      return [...prev, ...filterd]
    })
    setSelectedSystemMemberIdList(() => [])
  }

  /* Right 화살표 클릭 시에 */
  const handleRemoveProjectMember = () => {
    if ( !filterdProjectAssignUserList || filterdProjectAssignUserList.length === 0 ) { return }
    if (selectedProjectID === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '프로젝트를 선택해주세요.'
      })
      return
    }
    if (selectedProjectMemberIdList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '제거할 사용자를 선택해주세요.'
      })
      return
    }
    const filterd = filterdProjectAssignUserList.filter((filterdItem) => !selectedProjectMemberIdList.includes(filterdItem.user_id))
    setFilterdProjectAssignUserList(() => filterd)
    setSelectedProjectMemberIdList(() => [])
  }

  const submitHandler = async () => {
    if (selectedProjectID === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '프로젝트를 선택해주세요.'
      })
      return
    }
    const filterdUserIdList = filterdProjectAssignUserList ? filterdProjectAssignUserList.map((filterdItem) => filterdItem.user_id) : []
    const updateProps: IAssignUserActiveProps = {
      project_id: selectedProjectID,
      project_member: filterdUserIdList
    }
    const res = await AssignUserActive(updateProps)
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message || '프로젝트 맴버를 수정하는데 실패하였습니다.'
      })
      return
    }
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: '프로젝트 맴버를 수정하였습니다.'
    })
    // 모든 useState 초기화
    setSelectedProjectID(() => '')
    setSelectedProjectMemberIdList(() => [])
    setSelectedSystemMemberIdList(() => [])
    setFilterdProjectAssignUserList(() => null)
    setFilterdAssignUserList(() => null)
    setFilterdProjectList(() => null)
    setAssignList(() => null)
    handleCloseModal()
  }

  return (
    <React.Fragment>
      <Button onClick={handleOpenModal}>프로젝트 멤버 설정</Button>
      <Modal isOpen={isOpen} size="xl">
        <Modal.Head>프로젝트 맴버 설정</Modal.Head>
        <Modal.Body>
          <div className="grid lg:grid-cols-11 gap-1 grid-flow-row overflow-auto">
            <PanelContainer className="col-span-5">
              <PanelHeader>프로젝트 맴버 목록</PanelHeader>
              <PanelBody className="space-y-3">
                <div>
                  <label htmlFor="select_project">프로젝트 선택</label>
                  <Input.Select name="select_project" onChange={handleChangeProjectSelect}>
                    <Input.Option value="">
                    </Input.Option>
                    {
                      filterdProjectList && filterdProjectList.length !== 0 && filterdProjectList.map((filterdProjectItem) => (
                        <Input.Option key={filterdProjectItem.project_id} value={filterdProjectItem.project_id}>
                          {filterdProjectItem.project_name}
                        </Input.Option>
                      ))
                    }
                  </Input.Select>
                </div>
                <div>
                  <table className="table table-border w-full">
                    <thead className="whitespace-nowrap">
                      <tr>
                        <th>선택</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>회사 및 부서</th>
                        <th>메일주소</th>
                        <th>연락처</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          filterdProjectAssignUserList && filterdProjectAssignUserList.length != 0 &&  filterdProjectAssignUserList.map((filterdItem, index) => (
                          <tr key={index}>
                            <td>
                              <Input.Checkbox 
                                name="project_member"
                                value={filterdItem.user_id}
                                onChange={handleChangeProjectMemeber}
                                checked={selectedProjectMemberIdList.includes(filterdItem.user_id)}
                              />
                            </td>
                            <td>{filterdItem.user_id}</td>
                            <td>{filterdItem.user_name}</td>
                            <td>{filterdItem.user_company}/{filterdItem.user_dept}</td>
                            <td>{filterdItem.user_email}</td>
                            <td>
                              <div>
                                {
                                  filterdItem.user_contact && filterdItem.user_contact.map((contact, index) => (
                                    <div key={index}>{contact}</div>
                                  ))
                                }
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </PanelBody>
            </PanelContainer>

            <div className="flex flex-col flex-wrap items-center justify-center gap-3 col-span-1">
              <Button onClick={handleRemoveProjectMember}>
                <CaretRightFill size={30}/>
              </Button>
              <Button onClick={handleAddProjectMember}>
                <CaretLeftFill size={30} />
              </Button>
            </div>

            <PanelContainer className="max-h-[600px] overflow-y-auto col-span-5">
              <PanelHeader>시스템 가입자 목록</PanelHeader>
              <PanelBody>
                <div className="overflow-auto max-w-full">
                  <table className="table table-border w-full">
                    <thead className="whitespace-nowrap">
                      <tr>
                        <th>선택</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>회사 및 부서</th>
                        <th>메일주소</th>
                        <th>연락처</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          filterdAssignUserList && filterdAssignUserList.length != 0 && filterdAssignUserList.map((filterdItem, index) => (
                          <tr key={index}>
                            <td>
                              <Input.Checkbox 
                                name="system_member"
                                value={filterdItem.user_id}
                                onChange={handleChangeSystemMemeber}
                                checked={selectedSystemMemberIdList.includes(filterdItem.user_id)}
                              />
                            </td>
                            <td>{filterdItem.user_id}</td>
                            <td>{filterdItem.user_name}</td>
                            <td>{filterdItem.user_company}/{filterdItem.user_dept}</td>
                            <td>{filterdItem.user_email}</td>
                            <td>
                              <div>
                                {
                                  filterdItem.user_contact && filterdItem.user_contact.map((contact, index) => (
                                    <div key={index}>{contact}</div>
                                  ))
                                }
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </PanelBody>
            </PanelContainer>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitHandler}>저장</Button>
          <Button onClick={handleCloseModal}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

export default UserAssignModal

import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { PersonVcard } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import ProjectInfoList from './ProjectInfoList'
import Button from 'tailwindElement/Button'
import Popover from 'tailwindElement/Popover'

import ProjectListTableAdminInfo from './ProjectListTableAdminInfo'
import { ProjectInfoModel, GetProjectByIdModel } from 'models/ProjectInfoModel'
import { setProject } from 'features/project/projectSlice'
import ActiveLink from 'components/common/links/ActiveLink'

interface IProps {
  deleteHandler: (event: React.MouseEvent<HTMLButtonElement>) => void
  header: string[]
  column: ProjectInfoModel[]
}

const ProjectListTable = ({ deleteHandler, header, column }: IProps) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 프로젝트 목록 더블 클릭시 프로젝트로 이동
  const clickProjectHandler = async (
    event: React.MouseEvent<HTMLTableRowElement>,
  ): Promise<void> => {
    const id = event.currentTarget.id

    if (id) {
      // Redux State에 프로젝트 정보 저장
      const getResponse = await GetProjectByIdModel(id)

      if (!getResponse.success) {
        Swal.fire({
          title: '프로젝트 정보를 가져오는데 실패했습니다.',
          icon: 'error',
        }).then(() => {
          navigate('/')
        })
        return
      }

      if (!getResponse.data) {
        Swal.fire({
          title: '프로젝트 정보가 없습니다.',
          icon: 'error',
        }).then(() => {
          navigate(-1)
        })
        return
      }

      dispatch(setProject({ project: getResponse.data }))
      navigate(`/dashboard/overview?project_id=${id}&step=kom`)
    }
  }

  // 수정 페이지로 이동
  const updateHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const id = event.currentTarget.id

    if (id) {
      navigate(`/project/update/${id}`)
    }
  }

  const getStageName = (stageCode: string): string => {
    switch (stageCode) {
      case 'KOM':
        return 'SW 개발계획'
      case 'SRR':
        return 'SW 요구사항 분석'
      case 'PDR':
        return 'SW 구조설계'
      case 'DDR':
        return 'SW 상세설계'
      case 'CDR':
        return 'SW 구현'
      case 'TRR':
        return 'SW 통합 및 시험'
      case 'SVR':
        return '체계 통합 및 시험'
      case 'FQR':
        return '시험평가'
      case 'PAR':
        return '규격화 및 인도'
      default:
        return ''
    }
  }

  return (
    <div className="grid items-center justify-center gap-4">
      <Button className="ms-auto">
        <ActiveLink to="/project/create" className="w-full text-end">
          프로젝트 생성
        </ActiveLink>
      </Button>
      <div className="overflow-x-auto">
        <table className="table w-full h-full p-2 text-xl text-center align-middle select-none table-border">
          <thead className="whitespace-nowrap">
            <tr className="bg-gray-100 border-b">
              {header &&
                header.map((data, index) => (
                  <th key={index} className="p-3">
                    {data}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {column &&
              column.map((tr, tr_idx) => (
                <tr
                  key={tr_idx}
                  id={tr.project_id.toString()}
                  onDoubleClick={clickProjectHandler}
                  className="py-8 border-b cursor-pointer hover:bg-gray-200">
                  <td>{tr.project_name}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      {
                        tr.project_manager_id && tr.project_manager_name && tr.project_manager_contact && tr.project_manager_email ? 
                        <>
                          {tr.project_manager_name}
                          <Popover button={<PersonVcard size={25} />} placement={'right'}>
                            <Popover.Header>관리자 정보</Popover.Header>
                            <Popover.Body>
                              <ProjectListTableAdminInfo
                                id={tr.project_manager_id}
                                name={tr.project_manager_name}
                                phone={tr.project_manager_contact}
                                email={tr.project_manager_email}
                              />
                            </Popover.Body>
                          </Popover>
                        </>
                        :
                        <Button id={tr.project_id} onClick={updateHandler}>관리자 할당</Button>
                      }
                    </div>
                  </td>
                  <td>
                    {new Date(tr.project_start_date).toLocaleDateString()} ~{' '}
                    {new Date(tr.project_end_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    <ProjectInfoList
                      infoData={{
                        system: tr.project_sys_name,
                        subSystem: tr.project_subsys_name,
                        component: tr.project_component_name,
                        csci: tr.project_csci_name,
                      }}
                    />
                  </td>
                  <td className="whitespace-nowrap">
                    <Button
                      variant={'secondary'}
                      id={tr.project_id.toString()}
                      onClick={deleteHandler}>
                      삭제
                    </Button>
                  </td>
                  <td className="whitespace-nowrap">
                    <Button
                      variant={'primary'}
                      id={tr.project_id.toString()}
                      onClick={updateHandler}>
                      수정
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProjectListTable

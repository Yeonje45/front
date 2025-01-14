import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'

import Container from 'tailwindElement/Container'
import ProjectListTable from 'components/project/list/ProjectListTable'
import Pagination from 'components/common/pagination/Pagination'
import ActionItems from 'components/project/list/action/ActionItems'
import Spinner from 'tailwindElement/Spinner'

import { ProjectTableHeaders } from '../../../constant/project/projectTableFields'
import {
  GetProjectModel,
  ProjectInfoModel,
  DeleteProjectModel,
} from 'models/ProjectInfoModel'
import { logoutUser } from 'features/user/userSlice'
import { clearProject } from 'features/project/projectSlice'

const ProjectList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [projectList, setProjectList] = useState<{
    projects: ProjectInfoModel[]
    isLoading: boolean
  }>({
    projects: [],
    isLoading: true,
  })
  const [presentPage, setPresentPage] = useState<number>(1)
  const [maxPage, setMaxPage] = useState<number>(0)
  const limit = 3
  const getResponse = new GetProjectModel()

  // 페이지 입장 최초 한번만 실행
  // - 페이지 초기화
  // - 프로젝트 redux 초기화
  useEffect(() => {
    presentHandler(1)
    dispatch(clearProject())
  }, [])

  const getProejctListHandler = async (presentData: number) => {
    setProjectList(() => ({ projects: [], isLoading: true }))

    // '/projects/manage/get/?pagelimit=3&pageoffset=0'
    const requestURL = `/projects/manage/get/?pagelimit=${limit}&pageoffset=${
      (presentData - 1) * limit
    }`

    const res = await getResponse.requestGetProject(requestURL)

    if (!res.success) {
      switch (res.message) {
        case 'Authorization header is missing':
          Swal.fire({
            title: '로그인이 필요합니다.',
            icon: 'error',
          }).then(() => {
            dispatch(logoutUser())
            navigate('/')
          })

          break
        default:
          Swal.fire({
            title: '세션이 만료 되었습니다.\n로그인이 필요합니다.',
            icon: 'error',
          }).then(() => {
            dispatch(logoutUser())
            navigate('/')
          })
          break
      }
      return
    }

		if (!res.data || !res.data.results || res.data.results.length === 0) {
			setMaxPage(() => 0)
			setProjectList(() => ({ projects: [], isLoading: false }))
			return
		}

    const { count, results } = res.data

    setMaxPage(() => Math.ceil(count / limit))
    setProjectList(() => ({ projects: results, isLoading: false }))
  }

  const presentHandler = async (presentData: number): Promise<void> => {
    setPresentPage(() => presentData)
    await getProejctListHandler(presentData)
  }

  // 삭제 버튼 클릭시 프로젝트 확인 후 삭제
  const deleteHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const id = event.currentTarget.id

    if (!id) {
      return
    }

    Swal.fire({
      title: '프로젝트를 삭제하시겠습니까?',
      text: '삭제된 프로젝트는 복구할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async result => {
      if (result.isConfirmed) {
        const deleteResponse = await DeleteProjectModel(id)

        if (!deleteResponse.success) {
          Swal.fire({
            title: '프로젝트 삭제에 실패했습니다.',
            icon: 'error',
          })
          return
        }
        Swal.fire({
          title: deleteResponse.message,
          icon: 'success',
        }).then(() => {
          presentHandler(1)
        })
      }
    })
  }

  return (
    <Container fluid className="flex flex-col items-center w-full h-full gap-3 overflow-x-auto">
      {projectList.isLoading ? (
        <Spinner.center />
      ) : (
        <ProjectListTable
          deleteHandler={deleteHandler}
          header={ProjectTableHeaders}
          column={projectList.projects}
        />
      )}
      <Pagination
        presentHandler={presentHandler}
        presentPage={presentPage}
        maxPage={maxPage}
      />
      {/* <ActionItems /> */}
      
    </Container>
  )
}

export default ProjectList

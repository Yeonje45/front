import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import ProjectUpdateForm from 'components/project/ProjectUpdateForm'
import FormContainer from 'components/common/container/FormContainer'
import Button from 'tailwindElement/Button'
import { GetProjectByIdModel, UpdateProjectModel } from 'models/ProjectInfoModel'

interface IUpdateFormState {
  value: string
  isError: boolean
}

const ProjectUpdatePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [updateFormState, setUpdateFormState] = useState<{
    project_manager_id: IUpdateFormState
    project_stage_code: IUpdateFormState
    project_name: IUpdateFormState
    project_start_date: IUpdateFormState
    project_end_date: IUpdateFormState
    project_unit_code: IUpdateFormState
    project_sys_name: IUpdateFormState
    project_subsys_name: IUpdateFormState
    project_component_name: IUpdateFormState
    project_csci_name: IUpdateFormState
    std_business_type_index: IUpdateFormState
    custom_business_type_name: IUpdateFormState
  }>({
    project_manager_id: {
      value: '',
      isError: false,
    },
    project_name: {
      value: '',
      isError: false,
    },
    project_stage_code: {
      value: '',
      isError: false,
    },
    project_start_date: {
      value: '',
      isError: false,
    },
    project_end_date: {
      value: '',
      isError: false,
    },
    project_unit_code: {
      value: '',
      isError: false,
    },
    project_sys_name: {
      value: '',
      isError: false,
    },
    project_subsys_name: {
      value: '',
      isError: false,
    },
    project_component_name: {
      value: '',
      isError: false,
    },
    project_csci_name: {
      value: '',
      isError: false,
    },
    std_business_type_index: {
      value: '',
      isError: false,
    },
    custom_business_type_name: {
      value: '',
      isError: false,
    },
  })

  // <Route path="update/:id" element={<ProjectUpdatePage />} />
  useEffect(() => {
    GetProjectData()
  }, [])

  // 프로젝트 정보 가져오기
  const GetProjectData = async () => {
    if (!id) {
      navigate(-1)
      return
    }

    const res = await GetProjectByIdModel(id)

    if (!res.success) {
      Swal.fire({
        title: '프로젝트 정보를 가져오는데 실패했습니다.',
        icon: 'error',
      }).then(() => {
        navigate(-1)
      })
      return
    }

    if (!res.data) {
      Swal.fire({
        title: '프로젝트 정보가 없습니다.',
        icon: 'error',
      }).then(() => {
        navigate(-1)
      })
      return
    }

    const projectData = res.data

    setUpdateFormState(() => ({
      project_manager_id: {
        value: projectData.project_manager_id?.toString() || '',
        isError: false,
      },
      project_name: {
        value: projectData.project_name,
        isError: false,
      },
      project_stage_code: {
        value: projectData.project_stage_code,
        isError: false,
      },
      project_start_date: {
        value: String(projectData.project_start_date),
        isError: false,
      },
      project_end_date: {
        value: String(projectData.project_end_date),
        isError: false,
      },
      project_unit_code: {
        value: projectData.project_unit_code,
        isError: false,
      },
      project_sys_name: {
        value: projectData.project_sys_name,
        isError: false,
      },
      project_subsys_name: {
        value: projectData.project_subsys_name,
        isError: false,
      },
      project_component_name: {
        value: projectData.project_component_name,
        isError: false,
      },
      project_csci_name: {
        value: projectData.project_csci_name,
        isError: false,
      },
      std_business_type_index: {
        value: projectData.std_business_type_index,
        isError: false,
      },
      custom_business_type_name: {
        value: projectData.custom_business_type_name,
        isError: false,
      },
    }))
  }

  // 입력 변경 State
  const changeStateHandler = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setUpdateFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof updateFormState],
        value,
      },
    }))
  }
  // Submit 버튼 클릭 시
  const updateSubmitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    Swal.fire({
      title: '프로젝트 수정',
      text: '프로젝트를 수정하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(async result => {
      if (!result.isConfirmed) {
        return
      }
      const updateModel = new UpdateProjectModel(
        updateFormState.project_name.value,
        updateFormState.project_manager_id.value,
        new Date(updateFormState.project_start_date.value),
        new Date(updateFormState.project_end_date.value),
        updateFormState.project_unit_code.value,
        updateFormState.project_sys_name.value,
        updateFormState.project_subsys_name.value,
        updateFormState.project_component_name.value,
        updateFormState.project_csci_name.value,
        updateFormState.std_business_type_index.value,
        updateFormState.custom_business_type_name.value,
      )

      // 정규식 확인

      const updateResponse = await updateModel.requestUpdateProject(
        id!,
        updateFormState.project_stage_code.value,
      )
			console.log(updateResponse)
      if (!updateResponse.success) {
        Swal.fire({
          title: '프로젝트 수정에 실패했습니다.',
					text: updateResponse.message || '프로젝트 수정에 실패했습니다.',
          icon: 'error',
        })
        return
      }

      Swal.fire({
        title: '프로젝트 수정 완료',
        icon: 'success',
      }).then(() => {
        navigate(-1)
      })

      return
    })
  }

  // 이전 페이지 이동 PreventPage
  const preventPage = () => {
    Swal.fire({
      title: '페이지 이동',
      text: '변경사항을 저장하지 않고 나가시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '나가기',
      cancelButtonText: '취소',
    }).then(result => {
      if (!result.isConfirmed) {
        return
      }

      navigate(-1)
    })
  }

  return (
    <FormContainer
      className="flex flex-col border shadow-md gap-3"
      submitHandler={updateSubmitHandler}>
      <h2 className="mt-5 text-2xl font-bold tracking-tight sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl text-start leading-9">
        프로젝트 변경
      </h2>
      <ProjectUpdateForm
        updateFormState={updateFormState}
        changeStateHandler={changeStateHandler}
      />
      <div className="flex items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm gap-2">
        <Button variant="primary" type="submit">
          수정
        </Button>
        <Button variant="secondary" type="button" onClick={preventPage}>
          취소
        </Button>
      </div>
    </FormContainer>
  )
}

export default ProjectUpdatePage

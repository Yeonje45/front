import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import ProjectInputField from 'components/project/create/ProjectInputField'
import ProjectSubmitField from 'components/project/ProjectSubmitField'

import {
  formFields,
  ICreateFormState,
} from '../../../constant/project/projectCreateFormFields'
import FormContainer from 'components/common/container/FormContainer'
import { CreateProjectModel } from 'models/ProjectInfoModel'

const ProjectCreatePage = () => {
  const navigate = useNavigate()

  const [createFormState, setCreateFormState] = useState<ICreateFormState>({
    project_name: { value: '', isError: false },
    admin: { value: '', isError: false },
    project_start_date: { value: '', isError: false },
    project_end_date: { value: '', isError: false },
    project_unit_code: { value: 'csci', isError: false },
    project_sys_name: { value: '', isError: false },
    project_subsys_name: { value: '', isError: false },
    project_component_name: { value: '', isError: false },
    project_csci_name: { value: '', isError: false },
    std_business_type_index: { value: '', isError: false },
    custom_business_type_name: { value: '', isError: false },
  })

  // type == input
  const changeStateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setCreateFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof createFormState],
        value,
      },
    }))
  }

  // type == select
  const changeCustomTypeHandler = (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.name === 'std_business_type_index') {
      setCreateFormState(prev => ({
        ...prev,
        std_business_type_index: {
          ...prev.std_business_type_index,
          value: e.target.value,
        },
      }))
    } else {
      setCreateFormState(prev => ({
        ...prev,
        custom_business_type_name: {
          ...prev.custom_business_type_name,
          value: e.target.value,
        },
      }))
    }
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // createFormState validation check
    for (const key in createFormState) {
      if (createFormState[key as keyof typeof createFormState].value === '') {
        console.log(key)
        if (key === 'admin' || key === 'std_business_type_index' || key === 'custom_business_type_name') {
          continue
        }
        Swal.fire({
          title: '프로젝트 생성 실패',
          text: '필수 입력 항목을 모두 입력해주세요.',
          icon: 'error',
        })
        return
      }
    }

    const createProjectModel = new CreateProjectModel(
      createFormState.project_name.value,
      createFormState.admin.value,
      createFormState.project_start_date.value,
      createFormState.project_end_date.value,
      createFormState.project_unit_code.value,
      createFormState.project_sys_name.value,
      createFormState.project_subsys_name.value,
      createFormState.project_component_name.value,
      createFormState.project_csci_name.value,
      createFormState.std_business_type_index.value,
      createFormState.custom_business_type_name.value,
    )
    const createResponse = await createProjectModel.requestCreateProject()

    console.log(createResponse.message)

    if (createResponse.data === null) {
      await Swal.fire({
        title: '프로젝트 생성 실패',
        text: createResponse.message || '알 수 없는 오류가 발생했습니다.',
        icon: 'error',
      })
      return
    }

    if (!createResponse.success) {
      await Swal.fire({
        title: 'ㅍ로젝트 생성 실패',
        text: createResponse.message || '알 수 없는 오류가 발생했습니다.',
        icon: 'error',
      })
      return
    }

    await Swal.fire({
      icon: 'success',
      title: '프로젝트가 생성되었습니다.',
    })
    navigate('/project/list')
    return
  }

  return (
    <FormContainer
      className="flex flex-col border shadow-md gap-3"
      submitHandler={submitHandler}>
      <h2 className="mt-5 text-2xl font-bold tracking-tight sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl text-start leading-9">
        프로젝트 생성
      </h2>
      <ProjectInputField
        createFormState={createFormState}
        formFields={formFields}
        changeStateHandler={changeStateHandler}
        changeCustomTypeHandler={changeCustomTypeHandler}
      />
      <ProjectSubmitField />
    </FormContainer>
  )
}

export default ProjectCreatePage

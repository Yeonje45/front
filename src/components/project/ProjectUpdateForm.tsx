import React from 'react';
import Swal from 'sweetalert2';

import Input from 'tailwindElement/Input'
import ProjectUpdateFormField from './update/ProjectUpdateFormField'
import { useState } from 'react'
import { std_business_type_name } from 'constant/project/projectCreateFormFields'

import { GetUserList, IUserListModel } from 'models/ProjectInfoModel';

interface IProps extends React.InputHTMLAttributes<HTMLDivElement> {
  updateFormState: {
    project_name: IUpdateFormState
    project_manager_id: IUpdateFormState
    project_start_date: IUpdateFormState
    project_end_date: IUpdateFormState
    project_unit_code: IUpdateFormState
    project_sys_name: IUpdateFormState
    project_subsys_name: IUpdateFormState
    project_component_name: IUpdateFormState
    project_csci_name: IUpdateFormState
    std_business_type_index: IUpdateFormState
    custom_business_type_name: IUpdateFormState
  }
  changeStateHandler: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => void
}

interface IUpdateFormState {
  value: string
  isError: boolean
}

const ProjectUpdateForm = ({ updateFormState, changeStateHandler }: IProps) => {
  const [userList, setUserList] = React.useState<IUserListModel[] | null>(null)

  React.useEffect(() => {
    getUserList()
  }, [])

  const getUserList = async () => {
    const res = await GetUserList()
    if (!res.success) {
      Swal.fire({
        title: '사용자 정보를 불러오는데 실패했습니다.',
        icon: 'error',
      })
      return
    }
    setUserList(() => res.data)
  }


  return (
    <div className="w-full h-full text-left text-lg flex flex-col gap-4">
      <ProjectUpdateFormField
        label="프로젝트 제목"
        type="text"
        name="project_name"
        id="project_name"
        onChange={changeStateHandler}
        placeholder="프로젝트 제목을 입력하세요"
        value={updateFormState.project_name.value}
      />
      <div className="w-full">
        <label htmlFor={'std_business_type_index'}>관리자 할당</label>
        <div className="flex flex-col gap-2">
          <Input.Select
            name="project_manager_id"
            value={updateFormState.project_manager_id.value}
            onChange={changeStateHandler}>
            <Input.Option value="">선택</Input.Option>
            {
              userList && userList.length !== 0 && userList.map((userItem, index_st) => (
                <Input.Option key={index_st} value={userItem.user_id}>
                  [{userItem.user_company}]{userItem.user_name}
                </Input.Option>
              ))
            }
          </Input.Select>
        </div>
      </div>
      <ProjectUpdateFormField
        label="개발 시작일"
        type="date"
        name="project_start_date"
        id="project_start_date"
        onChange={changeStateHandler}
        value={updateFormState.project_start_date.value}
      />
      <ProjectUpdateFormField
        label="개발 종료일"
        type="date"
        name="project_end_date"
        id="project_end_date"
        onChange={changeStateHandler}
        value={updateFormState.project_end_date.value}
      />
      <div className="w-full">
        <label htmlFor={'std_business_type_index'}>사업유형</label>
        <div className="flex flex-col gap-2">
          <Input.Select
            name="std_business_type_index"
            value={updateFormState.std_business_type_index.value}
            onChange={changeStateHandler}>
            <Input.Option value="">선택</Input.Option>
            {std_business_type_name.map((data, index_st) => (
              <Input.Option key={index_st} value={data.value}>
                {data.label}
              </Input.Option>
            ))}
          </Input.Select>
          {Number(updateFormState.std_business_type_index.value) >= 14 && (
            <Input
              name="custom_business_type_name"
              placeholder="그 외(사용자 입력)"
              value={updateFormState.custom_business_type_name.value}
              onChange={changeStateHandler}
            />
          )}
        </div>
      </div>
      <ProjectUpdateFormField
        label="프로젝트 관리 단위"
        type="radio"
        name="project_unit_code"
        id="project_unit_code"
        onChange={changeStateHandler}
        value={updateFormState.project_unit_code.value}
      />
      <ProjectUpdateFormField
        label="체계명"
        type="text"
        name="project_sys_name"
        id="project_sys_name"
        onChange={changeStateHandler}
        placeholder="체계명을 입력하세요"
        value={updateFormState.project_sys_name.value}
      />
      <ProjectUpdateFormField
        label="부체계명"
        type="text"
        name="project_subsys_name"
        id="project_subsys_name"
        onChange={changeStateHandler}
        placeholder="부체계명을 입력하세요"
        value={updateFormState.project_subsys_name.value}
      />
      <ProjectUpdateFormField
        label="구성품명"
        type="text"
        name="project_component_name"
        id="project_component_name"
        onChange={changeStateHandler}
        placeholder="구성품명을 입력하세요"
        value={updateFormState.project_component_name.value}
      />
      <ProjectUpdateFormField
        label="CSCI명"
        type="text"
        name="project_csci_name"
        id="project_csci_name"
        onChange={changeStateHandler}
        placeholder="CSCI명을 입력하세요"
        value={updateFormState.project_csci_name.value}
      />
    </div>
  )
}

export default ProjectUpdateForm

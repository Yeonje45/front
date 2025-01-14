import React, { useState, useEffect } from 'react'
import SweetAlert from 'sweetalert2'
import { InfoSquareFill } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'

import Input from 'tailwindElement/Input'
// import Popover from 'tailwindElement/Popover'
import Modal from 'tailwindElement/Modal'
import Button from 'tailwindElement/Button'

import { RequirementGroupModel, GetRequirementGroup, RequirementChildrenGroup, CreateRequirementGroup } from "models/RequirementModel"
import { RootState } from 'app/store'

interface IProps {
	isOpen: boolean
	handleAddGroupModal: () => void
	inputRequirementsFields: {[key: number]: RequirementGroupModel}
	getRequirementGroupHandler: () => void
}

interface IFieldWrapper {
	children: React.ReactNode
}

const FieldWrapper = ({ children }: IFieldWrapper) => {
	return (
		<div className="relative flex items-center justify-start w-full mt-1 text-center gap-2">
			{children}
		</div>
	)
}

const RequirementTreeAddGroupModal = ({ isOpen, handleAddGroupModal, inputRequirementsFields, getRequirementGroupHandler }: IProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [groupAttribute, setGroupAttribute] = useState<string>('') // 그룹 속성
	const [groupName, setGroupName] = useState<string>('') // 그룹 이름
	const [parentGroup, setParentGroup] = useState<string>('') // 부모 그룹
	const [req_group_device, setReq_group_device] = useState<string>('hdev') // 디바이스 타입
	const [cscGroup, setCscGroup] = useState<{ [key: number]: RequirementChildrenGroup } | null>(null)

	// 입력 란 및 선택 란 초기화
	useEffect(() => {
		setGroupAttribute('')
		setGroupName('')
		setParentGroup('')
		getCSCGroup()
	}, [isOpen])

	// 그룹 이름 변경 시에 사용 되는 함수입니다.
	const changeGroupNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setGroupName(() => event.target.value)
	}

	// 그룹 속성 변경 시
	const handleGroupAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGroupAttribute(e.target.value)
		setParentGroup('')
	}

	const changeParentGroupHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setParentGroup(e.target.value)
	}

	const getCSCGroup = async (): Promise<void> => {
		const res = await GetRequirementGroup(project.project_id)
		if (!res.success) {
			SweetAlert.fire({
				icon: 'error',
				title: 'CSC 그룹을 가져오는데 실패했습니다.',
				html: res.message,
			})
			return
		}

		setCscGroup(() => res.data)
	}

	// 그룹 추가 모달에서 확인 버튼 클릭 시에
	const handleSubmitAddGroup = async (): Promise<void> => {
		if (groupAttribute === 'csu' && parentGroup === '') {
			SweetAlert.fire({
				icon: 'error',
				title: 'CSC 그룹을 선택해주세요.',
			})
			return
		}

		if (groupName === '') {
			SweetAlert.fire({
				icon: 'error',
				title: '그룹 이름을 입력해주세요.',
			})
			return
		}

		if (groupAttribute === '') {
			SweetAlert.fire({
				icon: 'error',
				title: '그룹 속성을 선택해주세요.',
			})
			return
		}

		if (req_group_device === '') {
			SweetAlert.fire({
				icon: 'error',
				title: '디바이스 타입을 선택해주세요.',
			})
			return
		}

		const req = {
			project_id: project.project_id,
			req_group_name: groupName,
			req_group_division: groupAttribute,
			req_group_code_parent: parentGroup ? parseInt(parentGroup) : null,
			req_group_device: req_group_device,
		}

		console.log(req)
		const res = await CreateRequirementGroup(req)
		if (!res.success) {
			SweetAlert.fire({
				icon: 'error',
				title: '그룹 추가에 실패했습니다.',
				html: res.message,
			})
			return
		}
		SweetAlert.fire({
			icon: 'success',
			title: '그룹 추가에 성공했습니다.',
		})
		getRequirementGroupHandler()
		handleAddGroupModal()
		return
	}

	return (
		<Modal isOpen={isOpen} size="md">
			<Modal.Head>그룹 추가</Modal.Head>
				<Modal.Body>
				<div className="container px-4 mx-auto">
					<div className="flex flex-col items-center justify-center text-black">

						{/* 그룹 이름 */}
						<FieldWrapper>
							<label className="w-1/2 whitespace-nowrap">그룹 이름</label>
							<Input onChange={changeGroupNameHandler} value={groupName} />
						</FieldWrapper>
						{/* 그룹 속성 */}
						<FieldWrapper>
							<div className="relative w-1/2">
								<label className="whitespace-nowrap">
									<div className="relative group">
										<InfoSquareFill 
											className="rounded-full" 
										/>
										<div className="absolute z-10 -top-[25px] hidden p-2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg group-hover:block transition-opacity duration-300">
											<p className="text-sm">
												CSC 하위에는 CSC 1개 이상 가능하지만, CSU는 1개만 가능합니다.
											</p>
										</div>
									</div>
									그룹 속성
								</label>
							</div>
							<Input.Select onChange={handleGroupAttributeChange} value={groupAttribute}>
								<Input.Option value=""></Input.Option>
								<Input.Option value="csc">CSC</Input.Option>
								<Input.Option value="csu">CSU</Input.Option>
							</Input.Select>
						</FieldWrapper>
						{/* CSC 항목 선택 ( groupAttributeRef의 값이 CSU이면 나오는 항목 */}
						{groupAttribute === 'csu' && (
							<FieldWrapper>
								<label className="w-1/2 whitespace-nowrap">
									<div className="relative group">
										<InfoSquareFill 
											className="rounded-full cursor-pointer icon_1" 
										/>
										<div className="absolute z-10 -top-[25px] hidden p-2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg group-hover:block transition-opacity duration-300">
											<p className="text-sm">
													CSC 밑에 CSU 그룹을 만들기 위해서는 CSC 그룹이 우선 생성되어야
													합니다.
											</p>
										</div>
									</div>
									CSC 항목 선택
								</label>
								<Input.Select onChange={changeParentGroupHandler} value={parentGroup}>
									<Input.Option value=""></Input.Option>
									{ cscGroup && Object.keys(cscGroup).map((key: string) => {
										return (
											<Input.Option
												key={key}
												value={key}
											>
												{cscGroup[parseInt(key)].group_name}
											</Input.Option>
										)
									})}
								</Input.Select>
							</FieldWrapper>
					)}
					{/* 디바이스 타입 */}
					<FieldWrapper>
						<label className="w-1/2 whitespace-nowrap">
							<div className="relative group">
								<InfoSquareFill 
									className="rounded-full cursor-pointer icon_1" 
								/>
								<div className="absolute z-10 top-[25px] hidden p-2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg group-hover:block transition-opacity duration-300">
									<p className="text-sm">
										<table className="table w-full table-border">
											<thead className="whitespace-nowrap">
												<tr>
													<th>구분</th>
													<th>식별자</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>컴퓨터 탑재형</td>
													<td>HDEV</td>
												</tr>
												<tr>
													<td>마이크로프로세서 탑재형</td>
													<td>FDEV</td>
												</tr>
												<tr>
													<td>논리회로 탑재형</td>
													<td>LDEV</td>
												</tr>
											</tbody>
										</table>
									</p>
								</div>
							</div>
							디바이스 타입
						</label>
						<Input.Select onChange={(e) => setReq_group_device(e.target.value)} value={req_group_device}>
							<Input.Option value="hdev">HDEV</Input.Option>
							<Input.Option value="fdev">FDEV</Input.Option>
							<Input.Option value="ldev">LDEV</Input.Option>
						</Input.Select>
					</FieldWrapper>
				</div>
			</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleSubmitAddGroup}>추가</Button>
				<Button onClick={handleAddGroupModal}>취소</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default RequirementTreeAddGroupModal

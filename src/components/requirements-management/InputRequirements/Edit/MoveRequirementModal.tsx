import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'

import Modal from 'tailwindElement/Modal'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

import { GetRequirements, RequirementChildren, RequirementModel, GetRequirementGroup, GetCSUGroupsArrayByCSCID, RequirementChildrenGroup, RequirementGroupModel, GetRequirementGroupIDByCSCID, MoveRequirement } from "models/RequirementModel"
import { fieldState } from "context/requirementContext"
import { RootState } from 'app/store'

interface IMoveRequirementModalProps {
	moveRequirementList: RequirementModel[]
	moveRequirementModalState: boolean
	handleMoveRequirementModalState: () => void
	submitMoveRequirementSubHandler: () => void
	parentGroupCode: fieldState | null
	requirements_classification: string | null
}

const ElementWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col items-start justify-center mb-4 gap-2">
			{children}
		</div>
	)
}

const MoveRequirementModal = ({ moveRequirementList, moveRequirementModalState, handleMoveRequirementModalState, submitMoveRequirementSubHandler, parentGroupCode }: IMoveRequirementModalProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [csc_list, setCSCList] = useState<({ [key: number]: RequirementChildrenGroup } | null)>(null)
	const [csu_list, setCSUList] = useState<(RequirementChildren | undefined)[]>()
	const [selected_csc, setSelectedCSC] = useState<{name: string, key_id: string} | null>(null)
	const [selected_csu, setSelectedCSU] = useState<{name: string, key_id: string} | null>(null)

	// 현재 소속 된 그룹에서 취소가 되었는지 
	const [del_group_code, setDelGroupCode] = useState<string | null>(null)
	const [target_groups_code, setTargetGroupsCode] = useState<{name: string, key_id: string}[] | null>(null)

	React.useEffect(() => {
		if (!parentGroupCode) {
			return
		}

		InitialGroupInfo()
	}, [moveRequirementModalState])

	const InitialGroupInfo = async (): Promise<void> => {
		if (moveRequirementModalState && !parentGroupCode) {
			Swal.fire({
				icon: 'error',
				title: '그룹 정보 없음',
				text: '그룹 정보가 없습니다.'
			})
			return 
		}

		setDelGroupCode(() => null)
		setTargetGroupsCode(() => null)

		const res = await GetRequirementGroup(project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 조회 오류',
				text: res.message
			})
			return
		}
		setCSCList(() => res!.data)
	}

	const addDeletedGroupCode = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!parentGroupCode) {
			return
		}
		setDelGroupCode(() => parentGroupCode!.code)
	}

	const changeCSCGroupHandler = async (e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
		const { value } = e.target
		let id: string = ''
    const options = e.target.options
		id = e.target[options.selectedIndex].id

		setSelectedCSC(() => ({name: id, key_id: value}))
		setSelectedCSU(() => null)
		setCSUList(() => undefined)
		if (!csc_list || !value) {
			return
		}
		const csu_groups = await GetCSUGroupsArrayByCSCID(csc_list, +value)
		if (!csu_groups || csu_groups == undefined) {
			return
		}
		setCSUList(() => csu_groups[0])
		return
	}	

	const changeCSUGroupHandler = async (e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
		const { value } = e.target
		let id: string = ''
		const options = e.target.options
		id = e.target[options.selectedIndex].id
		setSelectedCSU(() => ({name: id, key_id: value}))
	}

	// targetMove Group으로 둔 항목 중에서 ID를 찾아서 그 항목만 Filter
	const filterTargetMoveGroup = (event: React.MouseEvent<HTMLButtonElement>): void => {
		const { id } = event.currentTarget

		if (!target_groups_code) {
			return
		}

		const filtered = target_groups_code.filter((group) => group.key_id !== id)
		setTargetGroupsCode(() => filtered)
	}

	const addMoveTargetRequirement = () => {
		// CSC가 있으면서 CSU가 있으면 CSU를 추가 
		if (selected_csc && selected_csu) {
			setTargetGroupsCode((prev) => {
				if (!prev) {
					return [{
						name: selected_csc.name + " - " + selected_csu.name,
						key_id: selected_csu.key_id
					}]
				}
				return [...prev, {
					name: selected_csc.name + " - " + selected_csu.name,
					key_id: selected_csu.key_id
				}]
			})
			setSelectedCSC(() => null)
			setSelectedCSU(() => null)
			return
		}
		// CSU가 없으면서 CSC만 있으면 CSC를 추가 
		if (selected_csc && !selected_csu) {
			setTargetGroupsCode((prev) => {
				if (!prev) {
					console.log(selected_csc)
					return [selected_csc]
				}
				console.log(selected_csc)
				return [...prev, selected_csc]
			})
			setSelectedCSC(() => null)
			setSelectedCSU(() => null)
			return
		}
		setSelectedCSC(() => null)
		setSelectedCSU(() => null)
		return
	}

	const submitMoveRequirement = async (): Promise<void> => {
		let request: number[] = []
		target_groups_code?.map((group) => {
			request.push(+group.key_id)
		})
		const requirements_id = moveRequirementList.map((requirementItem) => requirementItem.req_id)

		// request: 이동하려는 그룹 ID, requirements_id: 현재 선택 된 요구사항 ID, del_group_code: 현재 그룹에서 나갈 건지, 안 나갈 건지
		const res = await MoveRequirement(request, requirements_id, del_group_code, project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '이동 실패',
				text: '요구사항 이동에 실패하였습니다.'
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '이동 성공',
			text: '요구사항 이동에 성공하였습니다.'
		})
		submitMoveRequirementSubHandler()
	}

	return (
		<Modal isOpen={moveRequirementModalState} size="lg">
			<Modal.Head>그룹 이동 및 할당</Modal.Head>
			<Modal.Body>
				<ElementWrapper>
					<p className="font-bold">현재 할당된 그룹</p>
					{ !del_group_code && <Button onClick={addDeletedGroupCode}>{parentGroupCode?.absPath.replaceAll('\\', ' - ')}</Button> }
				</ElementWrapper>
				<ElementWrapper>
					<p className="font-bold">이동 및 추가하고자 하는 그룹</p>
					<div className="flex items-center justify-start w-full gap-2">
						<Input.Select className="w-1/2" onChange={changeCSCGroupHandler} name="csc_group" value={selected_csc?.key_id || ""}>
							<Input.Option value="">CSC 그룹 선택</Input.Option>
							{ csc_list && Object.keys(csc_list).map((csc_id) => (
								<Input.Option key={csc_id} value={csc_id} id={csc_list[+csc_id].group_name}>{csc_list[+csc_id].group_name}</Input.Option>
							))}
						</Input.Select>
						<Input.Select className="w-1/2" onChange={changeCSUGroupHandler} value={selected_csu?.key_id || ""} disabled={!selected_csc}>
							<Input.Option value="">CSU 그룹 선택</Input.Option>
							{ csu_list && csu_list.map((csu_item) => (
								<Input.Option key={csu_item?.req_group_code_child} value={csu_item?.req_group_code_child} id={csu_item?.req_group_name_child}>{csu_item?.req_group_name_child}</Input.Option>
							))}
						</Input.Select>
					</div>
				</ElementWrapper>

				<div className="flex flex-wrap items-center justify-start gap-2">
					{ target_groups_code && target_groups_code.map((groups, index) => (
						<Button key={index} id={groups.key_id} onClick={filterTargetMoveGroup}>{groups.name}</Button>
					)) }
				</div>
				<Button onClick={addMoveTargetRequirement}>이동 그룹 추가</Button>

				<ElementWrapper>
					<p className="font-bold">대상 항목</p>
					<div className="w-full overflow-x-auto">
						<table className="w-full p-1 border whitespace-nowrap">
							<thead>
								<tr className="relative p-2 text-center bg-gray-100">
									<th className="w-1/3 p-2 text-center">식별자</th>
									<th className="text-center">제목</th>
								</tr>
							</thead>
							<tbody>
								{ moveRequirementList.map((requirementItem, index) => (
									<tr key={index} className="text-center select-none cursoe-pointer even:bg-gray-100 odd:bg-white">
										<td className="p-2">{requirementItem.req_number}</td>
										<td>{requirementItem.req_title.replaceAll('\\', '-')}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</ElementWrapper>

			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={submitMoveRequirement} disabled={del_group_code == null && target_groups_code == null}>확인</Button>
				<Button variant="secondary" onClick={handleMoveRequirementModalState}>취소</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default MoveRequirementModal;

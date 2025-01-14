import { useState, useEffect, Fragment } from 'react'
import { Search } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

import RequirementTreeCSCList from 'components/requirements-management/InputRequirements/TreeElement/RequirementTreeCSCList'
import RequirementTreeAddGroupModal from './TreeElement/RequirementTreeAddGroupModal'

import { RootState } from 'app/store'
import { RequirementChildrenGroup, GetRequirementGroup } from "models/RequirementModel"
import { useRequirementDispatch } from 'context/requirementContext'

import RequirementTreeGroupGraphModal from './TreeElement/RequirementTreeGroupGraphModal'

const InputRequirementTree = () => {
	const requirementDispatch = useRequirementDispatch()
	const project = useSelector((state: RootState) => state.project).project
	const navigate = useNavigate()
	const [inputRequirements, setInputRequirements] = useState<{[key: number]: RequirementChildrenGroup}>([])
	// 그룹 추가 모달 상태
	const [addGroupModal, setAddGroupModal] = useState<boolean>(false)
	// 그룹 구성도 모달 상태
	const [groupGraphModal, setGroupGraphModal] = useState<boolean>(false)
	// 그룹 선택 Select Box
	const [selectGroup, setSelectGroup] = useState<string>('system_requirement')
	useEffect(() => {
		getRequirementGroupHandler()
		requirementDispatch({
			type: 'setup_group',
			payload: {
				group_id: 'system_requirement',
				group_name: getGroupNameByGroupId('system_requirement'),
			},
		})
	}, [])

	// 그룹 추가 버튼 클릭 시에
	const handleAddGroupModal = (): void => {
		setAddGroupModal(!addGroupModal)
	}

	// 그룹 구성도 버튼 클릭 시에
	const handleGroupGraphModal = (): void => {
		setGroupGraphModal(!groupGraphModal)
	}	

	const getGroupNameByGroupId = (groupId: string): string => {
		switch (groupId) {
			case 'system_requirement':
				return '체계요구사항'
			case 'sw_requirement':
				return 'SW 요구사항'
			case 'swdesign_requirement':
				return 'SW 설계 요구사항'
			case 'swtest_requirement':
				return 'SW 테스트 요구사항'
			default:
				return ''
		}
	}

	// 그룹 관리 Select Box
	const handleChangeSelectBox = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const { value } = e.target
		setSelectGroup(() => value)

		requirementDispatch({
			type: 'setup_group',
			payload: {
				group_id: value || 'system_requirement',
				group_name: getGroupNameByGroupId(value),
			},
		})
	}

	// 요구사항 탐색기 그룹 정보를 가져오는 함수입니다. 
	const getRequirementGroupHandler = async (): Promise<void> => {
		if (!project.project_id) {
			Swal.fire({
				icon: 'error',
				title: '프로젝트 정보가 없습니다.',
				text: '프로젝트 정보가 없어 요구사항 탐색기 정보를 불러올 수 없습니다.',
			})
			navigate(-1)
			return
		}
		const res = await GetRequirementGroup(project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 탐색기 정보를 불러오는데 실패했습니다.',
				text: res.message,
			})
			navigate(-1)
			return
		}
		// success가 true이면 무조건 데이터가 존재합니다. 
		setInputRequirements(() => res.data!)
		return
	}

	return (
		<div className="min-h-[500px] mb-10 min-w-96">
			<RequirementTreeAddGroupModal 
				isOpen={addGroupModal} 
				handleAddGroupModal={handleAddGroupModal}
				inputRequirementsFields={inputRequirements} 
				getRequirementGroupHandler={getRequirementGroupHandler}/>
			<RequirementTreeGroupGraphModal
				isOpen={groupGraphModal}
				handleGroupGraphModal={handleGroupGraphModal}
				treeRequirementFields={inputRequirements}
				/>

			<div className="relative h-full me-4">
				<PanelContainer className="h-full pb-20 mb-20">
					<PanelHeader title="요구사항 탐색기" />
					<PanelBody className="h-full">
						<div className="w-full mb-1">
							<Input.Select onChange={handleChangeSelectBox} value={selectGroup}>
								<Input.Option value="system_requirement">체계요구사항</Input.Option>
								<Input.Option value="sw_requirement">SW 요구사항</Input.Option>
								<Input.Option value="swdesign_requirement">SW 설계 요구사항</Input.Option>
								<Input.Option value="swtest_requirement">SW 테스트 요구사항</Input.Option>
							</Input.Select>
						</div>
						<div className="flex items-center justify-between pb-2 text-sm border-b gap-2">
							<div className="relative w-full">
								<Input placeholder="검색어를 입력하세요" className="w-1/2 pe-8" />
								<Button variant="unset" className="absolute top-1 -right-2">
									<Search />
								</Button>
							</div>
							<Button variant="primary" onClick={handleAddGroupModal} className="w-1/2">
								그룹 추가
							</Button>
						</div>
						<div className='flex items-center justify-between py-2 text-sm border-b gap-2'>
							<Button variant='primary' onClick={handleGroupGraphModal}>그룹 구성도</Button>
						</div>
						<div className="h-full pb-10">
							<RequirementTreeCSCList CSCList={inputRequirements} />
						</div>
					</PanelBody>
				</PanelContainer>
			</div>
		</div>
	)
}

export default InputRequirementTree

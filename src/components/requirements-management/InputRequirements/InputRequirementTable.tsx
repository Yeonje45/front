import { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	LockFill,
	UnlockFill,
	CaretDownSquareFill,
	CaretUpSquareFill,
	ThreeDotsVertical,
} from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Container from 'tailwindElement/Container'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelOptionBar from './PanelOptionBar'
import EditRequirementModal from './Edit/EditRequirementModal'
import DeleteRequirementModal from './Delete/DeleteRequirementModal'
import CreateRequirementModal from './Create/CreateRequirementModal'
import CreateTestRequirementModal from './Create/CreateTestRequirementModal'
import MoveRequirementModal from './Edit/MoveRequirementModal'

import { RootState } from 'app/store'
import { RequirementModel, GetRequirements } from "models/RequirementModel"
import { useRequirementState } from 'context/requirementContext'

// for peer-review
import PeerReview from 'components/common/peer-review/PeerReview'
import React from 'react'

interface IProps {
	editingUser: string
	editModeState: boolean
	handleEditModeState: () => void
}

const InputRequirementTable = ({ editingUser, editModeState, handleEditModeState }: IProps) => {
	const requirementState = useRequirementState()
	const navigate = useNavigate()
	const project = useSelector((state: RootState) => state.project).project

	// [요구사항 탐색기]에 선택 된 그룹 정보를 가져옵니다.
	const [selectedRequirement, setSelectedRequirement] = useState<string>("")
	// 요구사항 데이터 목록
	const [inputRequirementsData, setInputRequirementsData] = useState<RequirementModel[]>([])
	// 정렬 시에 사용되는 Config ( 오름/내림 ) 
	const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ASC' | 'DESC' } | null>({ key: 'req_number', direction: 'ASC' })
	/** 
	 * 요구사항 추가 모달 상태입니다.
	 * 요구사항이 SW 설계라면 Test가 True가 되고, 이외의 요구사항일 때는 default: true가 됩니다. 
	*/  
	const [createRequirementModalState, setCreateRequirementModalState] = useState<{test: boolean, default: boolean}>({
		test: false,
		default: false
	})
	/**
	 * 요구사항 편집 모달 상태입니다.
	 * 요구사항 편집을 목적으로 하는 요구사항 식별자 정보를 저장합니다.
	 */
	const [editRequirementModalState, setEditRequirementModalState] = useState<boolean>(false)
	const [editedRequirement, setEditedRequirement] = useState<RequirementModel>()
	/**
	 * 요구사항 삭제 모달 상태입니다.
	 * [삭제] 버튼을 클릭 시에 필터링 되는 데이터를 저장하는 상태입니다. 
	*/
	const [deleteRequirementModalState, setDeleteRequirementModalState] = useState<boolean>(false)
	const [deleteRequirementList, setDeleteRequirementList] = useState<RequirementModel[]>([])
	/**
	 * 체크박스에 해당하는 CSC/CSU [그룹 이동/할당] 모달 상태입니다. 
	 * [그룹 이동/할당] 버튼을 클릭 시에 필터링 되는 데이터를 저장하는 상태입니다.
	*/
	const [moveRequirementModalState, setMoveRequirementModalState] = useState<boolean>(false)
	const [moveRequirementList, setMoveRequirementList] = useState<RequirementModel[]>([])
	/**
	 * 편집 모드일 때 체크박스가 생기는데 해당 체크박스에 대한 요구사항 목록입니다.
	 * Label 우클릭 시에 htmlFor을 통해 해당 체크박스를 클릭 시키기 위해 사용됩니다. ( 이는 Checkbox 중복 클릭을 방지하기 위함입니다. ) ( Label 정보를 저장합니다. )
	*/
	const [checkedRequirementList, setCheckedRequirementList] = useState<number[] | null>([])
	const [checkedRequirement, setCheckedRequirement] = useState<number | null>()

	// for peer-review
	const [isPeerReviewOpen, setIsPeerReviewOpen] = useState<boolean>(false)  				// peer-review 창을 열고 닫는 상태 // for peer-review
	const [isPeerReviewAvailable, setIsPeerReviewAvailable] = useState<boolean>(false)  	// peer-review 가능 여부 // for peer-review
	const [selectedPeerChapter, setSelectedPeerChapter] = useState<string>("")  			// 선택된 카테고리의 장절 코드 문자열 // for peer-review // default: system_requirement
	const getPeerChapterFromRequirement = (requirement: string): string => {  				// 요구사항의 명칭과 장절 매칭은 절대 변경이 없을것이기 때문에 이렇게 처리해도 무방하다
		const key_list = ["system_requirement", "sw_requirement", "swdesign_requirement", "swtest_requirement"]	// 좌측 요구사항 탐색기의 분류 코드
		const value_index_list = ['체계요구사항', 'SW 요구사항', 'SW 설계 요구사항', 'SW 테스트 요구사항']			// 좌측 요구사항 탐색기의 분류 명칭
		const index = value_index_list.indexOf(requirement);
		return index !== -1 ? key_list[index] : "";
	}
	const getHeaderContentFromIdentifier = (checkID: number): string => {	// 선택된 행의 식별자 정보를 편집기에서 보여준다
		// req_id를 문자열로 변환
		const modifiedData = inputRequirementsData.map(item => ({
			...item,
			req_id: item.req_id.toString()  // req_id를 문자열로 변환
		}));

		// checkID를 문자열로 변환
		const normalizedID = checkID.toString();

		// 임시 데이터 배열에서 req_id로 비교
		const selectedRow = modifiedData.find((item) => item.req_id === normalizedID);

		return selectedRow?.req_number || '';  // 결과가 없으면 빈 문자열 반환
	}
	const handleButtonPeerReview = () => {
		setIsPeerReviewOpen(!isPeerReviewOpen)
	}

	useEffect(() => {
		// 요구사항이 없을 때, 초기화를 진행합니다.
		if (checkedRequirementList == null || checkedRequirementList.length === 0) {
			initialCheckboxDefaultState()
			initialCheckAllRow()
			setIsPeerReviewOpen(false); // 피어 리뷰 플래그 해제	// for peer-review
			setIsPeerReviewAvailable(false); // 피어 리뷰 가능 플래그 해제	// for peer-review
			return
		}

		// // for peer-review
		// 선택된 항목이 하나만 있을 경우 플래그 변경
		if (checkedRequirementList.length === 1) {
			setIsPeerReviewAvailable(true); // 피어 리뷰 가능 플래그 설정
			setIsPeerReviewOpen(false); // 피어 리뷰 플래그 설정
		}
		else {
			setIsPeerReviewAvailable(false); // 피어 리뷰 가능 플래그 해제
			setIsPeerReviewOpen(false); // 피어 리뷰 플래그 해제
		}

		if (checkedRequirementList && checkedRequirementList.length === inputRequirementsData.length) {
			const checkbox = document.getElementById('checkAll') as HTMLInputElement
			if (checkbox && !checkbox.checked) checkbox.click()
			return
		}
	}, [checkedRequirementList])

	// 필요에 의한 UI 및 데이터 변경이 필요합니다.
	useEffect(() => {
		setCheckedRequirementList([])
		initialCheckboxDefaultState()
	}, [editModeState])

	/** 
	 * 선택 된 CSU 변경 시에 선택 된 요구사항도 확인 및 변경이 필요합니다.
	 * contextState가 있는 지 확인 후에 변경이 필요합니다. ( Context-Type | null )
	*/
	useEffect(() => { 
		if (!requirementState || !requirementState.selectedRequirement || !requirementState.selectedRequirement.code ) return
		setCheckedRequirementList(null)
		setCheckedRequirement(null)
		getRequirementsHandler()
		setSelectedRequirement(requirementState.selectedRequirement.group_name) 

		// for peer-review
		setSelectedPeerChapter(getPeerChapterFromRequirement(requirementState.selectedRequirement.group_name))	// 요구사항 탐색기의 선택된 카테고리에 따라 장절 코드를 설정
		
	}, [requirementState, requirementState.selectedRequirement, requirementState.selectedRequirement?.group_id])

	const getRequirementsHandler = async (): Promise<void> => {
		if (!requirementState || !requirementState.selectedRequirement) return

		const res = await GetRequirements(project.project_id, +requirementState.selectedRequirement.code, requirementState.selectedRequirement.group_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 조회 오류',
				text: res.message
			})
			navigate('/')
			return
		}
		// res.data를 정렬 id 기준으로 
		setInputRequirementsData(() => res.data?.sort((a, b) => +a.req_id - +b.req_id) || [])
	}

	// 요구사항의 테이블 열 부분을 가져옵니다 .
	const getRequirementTableColumns = (): string[] => {
		if (inputRequirementsData.length === 0) return []
		return Object.keys(inputRequirementsData[0])
	}


	// 요구사항의 테이블 열 부분을 한글로 변환합니다.
	const getEngHeaderToKor = (name: keyof RequirementModel): string => {
		switch (name) {
			case 'req_number':
				return '식별자'
			case 'req_title':
				return '제목'
			case 'req_content':
				return '내용'
			case 'req_tvm_code':
				return '시험/검증방법'
			case 'req_update_content':
				return '업데이트 내용'
			case 'req_create_date':
				return '생성일'
			case 'req_update_date':
				return '수정일'
			default:
				return ''
		}
	}

	/** 
	 체크박스 초기화 함수입니다. 
	 * 삭제/추가/편집 모달에서 사용되며, State 초기화, 체크박스 초기화를 합니다. 
	 * 현재 열린 peer Menu가 있다면 닫아줍니다.
	*/
	const initialCheckboxDefaultState = (): void => {
		inputRequirementsData.forEach((item) => {
			const checkbox = document.getElementById(item.req_id) as HTMLInputElement
			if (checkbox && checkbox.checked) checkbox.click()
		})

		setCheckedRequirementList(null)
		setCheckedRequirement(null)
	}

	/**
	 * 요구사항 삭제 모달을 열고 닫습니다.
	 * 선택 된 요구사항을 필터링하여 State에 저장합니다.
	*/
	const handleDeleteRequirementModalState = () => {
		// 모달이 열려 있을 때, 닫아줍니다.
		if (deleteRequirementModalState) {
			setCheckedRequirement(null)
			initialCheckboxDefaultState()
			setDeleteRequirementModalState(!deleteRequirementModalState)
			return
		}
		if (!checkedRequirementList || checkedRequirementList.length === 0) {
			setCheckedRequirement(null)
			initialCheckboxDefaultState()
			return
		}

		if (checkedRequirementList && !deleteRequirementModalState) {
			setDeleteRequirementList(() => {
				return inputRequirementsData.filter((item) => checkedRequirementList.includes(+item.req_id))
			})
		}

		setCheckedRequirement(null)
		initialCheckboxDefaultState()
		setDeleteRequirementModalState(!deleteRequirementModalState)
	}

	// CSC/CSU 그룹 이동/할당 모달을 열고 닫습니다.
	const handleMoveRequirementModalState = () => {
		// 모달이 열려 있을 때, 닫아줍니다.
		if (moveRequirementModalState) {
			setCheckedRequirement(null)
			initialCheckboxDefaultState()
			setMoveRequirementModalState(!moveRequirementModalState)
			return
		}
		if (!checkedRequirementList || checkedRequirementList.length === 0) {
			setCheckedRequirement(null)
			initialCheckboxDefaultState()
			return
		}
		if (checkedRequirementList && !moveRequirementModalState) {
			setMoveRequirementList(() => {
				return inputRequirementsData.filter((item) => checkedRequirementList.includes(+item.req_id))
			})
		}

		setCheckedRequirement(null)
		initialCheckboxDefaultState()
		setMoveRequirementModalState(!moveRequirementModalState)
	}

	// CSC/CSU 그룹 이동/할당 요청 시에 사용되는 함수입니다.
	const submitMoveRequirementSubHandler = (): void => {
		getRequirementsHandler()
		handleMoveRequirementModalState()
		setCheckedRequirement(null)
		initialCheckboxDefaultState()
	}

	const closeEditRequirementModal = (): void => {
		setEditRequirementModalState(() => false)
		setEditedRequirement(undefined)
		initialCheckboxDefaultState()
		getRequirementsHandler()
	}

	// 편집 모드에서 요구사항 편집 모달을 열고 닫습니다.
	const handleEditRequirementModalState = (event: React.MouseEvent<HTMLButtonElement>) => {
		// 모달이 열려 있을 때, 닫아줍니다.
		if (editRequirementModalState) {
			setEditRequirementModalState(prev => !prev)
			setEditedRequirement(undefined)
			initialCheckboxDefaultState()
			return
		}

		if (checkedRequirementList && !moveRequirementModalState) {
			setMoveRequirementList(() => {
				return inputRequirementsData.filter((item) => checkedRequirementList.includes(+item.req_id))
			})
		}

		const { name } = event.currentTarget

		const selectedRequirement = inputRequirementsData.find((item) => {
			if ( item.req_id == name ) return item
		})
		setEditedRequirement(() => selectedRequirement)
		setEditRequirementModalState(prev => !prev)
	}

	// 요구사항 편집 요청 시에 사용되는 함수입니다.
	const submitEditRequirementSubHandler = (): void => {
		setEditRequirementModalState(prev => !prev)
		setEditedRequirement(undefined)
		initialCheckboxDefaultState()
		getRequirementsHandler()
	}

	// 요구사항 추가 모달을 열고 닫습니다.
	const handleCreateRequirementModalState = (): void => {
		if (!selectedRequirement) return
		if (selectedRequirement === "SW 설계 요구사항") {
			setCreateRequirementModalState(() => {
				return {
					test: !createRequirementModalState.test,
					default: false
				}
			})
			return
		}
		setCreateRequirementModalState(() => {
			return {
				test: false,
				default: !createRequirementModalState.default
			}
		})
		return
	}

	// 체크박스 선택 시 해당 요구사항을 추가 및 삭제합니다.
	const handleCheckRow= (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = e.target
		if (!setCheckedRequirementList) return
		
		setCheckedRequirementList((prev) => {
			// prev null check
			if (!prev) return [+name]

			if (prev.includes(+name)) {
				// 체크 박스를 해제 하는데, [기능] 메뉴가 열려 있을 때는 닫아줍니다.
				if (checkedRequirement === +name) setCheckedRequirement(null)

				return prev.filter((item) => item !== +name)
			} else {
				return [...prev, +name]
			}
		})
	}

	/** 
	 * 모든 체크박스 선택 및 해제합니다.
	 * UI가 업데이트 되지 않는 문제가 있습니다. ( 그렇기에 직접적으로 클릭 이벤트를 발생시킵니다. )
	*/
	const handleCheckAllRow = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.target

		if (checked) {
			inputRequirementsData.forEach((item) => {
				const checkbox = document.getElementById(item.req_id) as HTMLInputElement
				if (!checkbox.checked) checkbox.click()
			})
			const filterdRequiremnts = inputRequirementsData.map((item) => +item.req_id)
			setCheckedRequirementList(() => filterdRequiremnts)
			return
		} 

		inputRequirementsData.forEach((item) => {
			const checkbox = document.getElementById(item.req_id) as HTMLInputElement
			if (checkbox.checked) checkbox.click()
		})
		setCheckedRequirementList(() => [])
	}

	const initialCheckAllRow = (): void => {
		const checkbox = document.getElementById('checkAll') as HTMLInputElement
		if (checkbox && checkbox.checked) checkbox.click()
	}

	/**
		* [기능] 열의 "DOT :" 우클릭 시에 나오는 메뉴를 구현합니다.
		* htmlFor={row.req_id + "\\table_row"} 형식으로 숨겨진 peer을 클릭하여 Menu를 여는 방식입니다.
	*/
	const handleFunctionColumnContextMenu = (e: React.MouseEvent<HTMLLabelElement>) => {
		e.preventDefault()
		const labelID = +e.currentTarget.id

		// 기존에 열린 [기능] 열의 메뉴가 현재 클릭한 열의 메뉴와 동일하면 메뉴를 닫습니다.
		if (checkedRequirement === labelID) {
			setCheckedRequirement(null)
			return
		}

		if (checkedRequirementList == null) {
			return
		}

		// 기존에 열린 [기능] 열의 메뉴를 닫습니다.
		if (checkedRequirement != null) setCheckedRequirement(null)

		/**
			* label이 존재하는 row가 checkbox에 해당하는지 확인해야 합니다.
			* selectedRequirement에 없는 ID면 Click 이벤트를 발생 시키지 않습니다.
		*/
		if (checkedRequirementList && !checkedRequirementList.includes(labelID)) {
			return
		} 
		setCheckedRequirement(() => labelID)
		return
	}

	// [기능] 열의 "DOT :" 좌클릭 시에 나오는 메뉴를 막기 위해서 사용되는 함수입니다.
	const handleFunctionColumnClick = (e: React.MouseEvent<HTMLLabelElement>) => {
		e.preventDefault()
	}

	/* TVM 문자열을 한국어로 변경 */
	const getTVMCodeToKor = (tvmCode: string): string => {
		switch (tvmCode) {
			case 'tvm_demo':
				return '데모'
			case 'tvm_analysis':
				return '분석'
			case 'tvm_test':
				return '테스트'
			case 'tvm_inspection':
				return '검사'
			case 'tvm_specific':
				return '특수'
			default:
				return '기타'
		}
	}

	return (
		<div className="min-h-[600px] w-full grid grid-cols-[1fr,auto] items-start">
			<PanelContainer>
				<PanelHeader
					title={
						<div className="flex items-center gap-2">
							<span>
								{requirementState.selectedRequirement?.group_id ? (
									<>
										<span>
											{requirementState.selectedRequirement.group_name + ' - '}
										</span>
										{requirementState.selectedRequirement?.absPath.split('\\').map((item, index) => (
											<React.Fragment key={index}>
												{index > 0 && (
													<span key={`separator-${index}`} className="text-normal"> - </span> // 구분자는 스타일 적용 안함
												)}
												<span className="font-bold underline" key={`item-${index}`}>
													{item}
												</span>
											</React.Fragment>
										))}
									</>
								) : "SW요구사항 테이블"} </span>
							{editingUser ? <LockFill /> : <UnlockFill />}
							{editingUser && (
								<span className="text-blue-600">{editingUser} 편집중</span>
							)}
						</div>
					}
					className="flex flex-wrap items-center justify-between"
					rightElement={
						<PanelOptionBar
							editModeState={editModeState}
							handleEditModeState={handleEditModeState}
							handleCreateModeState={handleCreateRequirementModalState}							
							peerReviewAvailableState={isPeerReviewAvailable}	// for peer-review
							peerReviewModeState={isPeerReviewOpen}	// for peer-review
							handlePeerReviewModeState={handleButtonPeerReview}	// for peer-review
							// tableColumns={getTableColumns()}
							tableColumns={[]}
						/>
					}
				/>

				{/** SW요구사항  > 요구사항 편집 모달 */}
				{ editModeState && editedRequirement &&
					<EditRequirementModal
						editedRequirementModel={editedRequirement}
						editRequirementModalState={editRequirementModalState}
						submitEditRequirementSubHandler={submitEditRequirementSubHandler}
						closeEditRequirementModal={closeEditRequirementModal}
					/>
				}
				{/** SW요구사항 > 그룹 이동 및 할당 */}
				<MoveRequirementModal
					requirements_classification={requirementState.selectedRequirement?.group_name || ''}
					moveRequirementList={moveRequirementList}
					moveRequirementModalState={moveRequirementModalState}
					handleMoveRequirementModalState={handleMoveRequirementModalState}
					submitMoveRequirementSubHandler={submitMoveRequirementSubHandler} 
					parentGroupCode={requirementState && requirementState.selectedRequirement}
					/>
				{/** SW요구사항 > 요구사항 삭제 모달 */}
				<DeleteRequirementModal
					isOpen={deleteRequirementModalState}
					handleDeleteRequirementModalState={handleDeleteRequirementModalState}
					deleteRequirementList={deleteRequirementList}
					getRequirementsHandler={getRequirementsHandler}/>
				{/** SW요구사항 | SW 설계 요구사항 > 요구사항 추가 모달 ( 두 종류의 추가 모달을 관리하기에 컴포넌트 분리를 하지 않습니다. ) */}
				<CreateTestRequirementModal 
					isOpen={createRequirementModalState.test} 
					req_group_code={requirementState.selectedRequirement?.code || ''}
					handleCreateTestRequirementModalState={handleCreateRequirementModalState}
					req_classification_code={requirementState.selectedRequirement?.group_id || ''}
					getRequirementsHandler={getRequirementsHandler}/>
				<CreateRequirementModal 
					isOpen={createRequirementModalState.default} 
					req_group_code={requirementState.selectedRequirement?.code || ''}
					handleCreateRequirementModalState={handleCreateRequirementModalState}
					req_classification_code={requirementState.selectedRequirement?.group_id || ''}
					getRequirementsHandler={getRequirementsHandler}
					requirementState_group_name={requirementState.selectedRequirement?.group_name || ''}
				/>

				{ selectedRequirement ? <div className="overflow-auto max-h-[516px] min-h-[516px] pb-20">
					<table className="table w-full min-h-full table-border">
						<thead className="whitespace-nowrap">
							<tr className="relative p-2 text-center bg-gray-100">
								<Fragment> 
									<th>
										<Input.Checkbox id="checkAll" onChange={handleCheckAllRow} />
									</th> 
									<th>기능</th>
								</Fragment>
								{/* SW 요구사항은 TVM이 나오지만 그 이외 요구사항은 나오면 안 됨 */}
								{getRequirementTableColumns().map((col, index) => (
									requirementState.selectedRequirement?.group_id == "sw_requirement" && getEngHeaderToKor(col as keyof RequirementModel) != "" ?
									<th key={index} className="p-2">
										{ getEngHeaderToKor(col as keyof RequirementModel) }
									</th> : getEngHeaderToKor(col as keyof RequirementModel) != "" && col != "req_tvm_code" && 
									<th key={index}>
										{ getEngHeaderToKor(col as keyof RequirementModel) }
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{inputRequirementsData.map((row, index) => (
								<tr key={index} className="text-center select-none cursoe-pointer even:bg-gray-100 odd:bg-white">
									<td className="p-2">
										<Input.Checkbox 
											defaultChecked={checkedRequirementList && checkedRequirementList.includes(+row.req_id) ? true : false}
											id={row.req_id} 
											name={row.req_id} 
											onChange={handleCheckRow} /> 
									</td>
									<td className="relative">
										<input type="checkbox" className="hidden peer" name={row.req_id} id={row.req_id} onChange={() => {}} checked={+row.req_id == checkedRequirement}/>
										<label 
											htmlFor={row.req_id + "\\table_row"} 
											id={row.req_id} 
											className="cursor-pointer -z-1" 
											onClick={editModeState ? handleFunctionColumnContextMenu : () => {}}
										>
											<ThreeDotsVertical size={15} className='mx-auto' />
										</label>
										<div className="absolute left-0 z-40 flex-col hidden py-1 text-center text-black border shadow-md bg-gray-50 rounded-md peer-checked:flex whitespace-nowrap">
											<Button variant="unset" name={row.req_id} className="hover:text-white hover:bg-gray-500 hover:rounded-none" onClick={ editModeState ? handleEditRequirementModalState : undefined }>편집</Button>
											<Button variant="unset" className="hover:text-white hover:bg-gray-500 hover:rounded-none" onClick={handleDeleteRequirementModalState}>삭제</Button>
											<Button variant="unset" className="hover:text-white hover:bg-gray-500 hover:rounded-none" onClick={handleMoveRequirementModalState}>그룹 이동/할당</Button>
										</div>
									</td>
									<td className="p-2">{row.req_number}</td>
									<td>{row.req_title}</td>
									<td>{row.req_content}</td>
									{ requirementState.selectedRequirement?.group_id == "sw_requirement" && <td>{getTVMCodeToKor(row.req_tvm_code)}</td> }
									<td>{row.req_update_content}</td>
									<td>{new Date(row.req_create_date).toLocaleDateString()}</td>
									<td>{row.req_update_date ? new Date(row.req_update_date).toLocaleDateString() : '0000:00:00'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div> :
				<p className="w-full p-2 text-center">요구사항을 먼저 선택하세요.</p>}
			</PanelContainer>
		
			{/* for peer-review */}
			<div>

				<div>
					{/* Peer Review */}
					{isPeerReviewOpen && (	// 피어 리뷰 창을 열고 닫는다
						<PeerReview
							isOpen={isPeerReviewOpen}
							className={''}
							headerContent={	// 요구사항의 식별자 코드를 제목에 사용
								checkedRequirementList?.length === 1
									? getHeaderContentFromIdentifier(checkedRequirementList[0])
									: ''
								}
							project_id={project.project_id}
							peer_comment_key={	// 요구사항의 항목 pk를 사용
								checkedRequirementList?.length === 1 
									? checkedRequirementList[0] 
									: -1
							}
							peer_chapter={selectedPeerChapter}	// 요구사항 카테고리 4종에 따른 식별 코드
						/>
					)}
				</div>
			</div>

		</div>
	) 
}
export default InputRequirementTable

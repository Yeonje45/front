import React from 'react'
import SweetAlert from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ActiveModal from "tailwindElement/ActiveModal"
import Button from "tailwindElement/Button"
import Input from "tailwindElement/Input"

import { RequirementChildren, DeleteRequirementGroup, EditRequirementGroup, checkDuplicateCSUName } from 'models/RequirementModel'
import { useRequirementDispatch } from 'context/requirementContext'
import { RootState } from 'app/store'

interface IProps {
	cscHtmlFor: string
	setSelectGroupByCSCNameHandler: (cscName: string) => void
	CSUList: RequirementChildren[]
	parentPath: string
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

// CSUList
const RequirementTreeCSUList = ({ cscHtmlFor, setSelectGroupByCSCNameHandler, CSUList, parentPath }: IProps) => {
	const project = useSelector((state: RootState) => state.project.project)
	const requirementDispatch = useRequirementDispatch()
	const navigate = useNavigate()

	const [editCSUModalState, setEditCSUModalState] = React.useState<boolean>(false) // CSU 이름 변경 모달 상태입니다.
	const [editCSUName, setEditCSUName] = React.useState<string>('') // 변경하려는 CSU 이름 입력 상태입니다 .
	const [isDuplicateCSUName, setIsDuplicateCSUName] = React.useState<boolean>(false) // 중복된 CSU 이름이 있는지 확인하는 상태입니다.
  const [selectedContextClickCSU, setSelectedContextClickCSU] = React.useState<string>('')

	// CSU 이름 변경 모달 상태 값이 변경 될 때마다 입력 값을 초기화 해줍니다.
	React.useEffect(() => {
		if (!editCSUModalState) {
			setEditCSUName(() => '')
			setIsDuplicateCSUName(() => false)
		}
	}, [editCSUModalState])

	/**  CSU 클릭 시에 실행되는 함수입니다. ( CSU 선택 )
	 * htmlFor의 경우에는 CSU 이름과 CSU 코드를 '\\'로 구분하여 사용합니다.
	 */
	const selectCSUHandler = (event: React.MouseEvent<HTMLLabelElement>) => {
		event.preventDefault()
		setSelectGroupByCSCNameHandler(cscHtmlFor)
		requirementDispatch({
			type: 'set_requirement',
			payload: {
				absPath: event.currentTarget.id,
				selected: event.currentTarget.htmlFor.split('\\')[0],
				code: event.currentTarget.htmlFor.split('\\')[1],
			},
		})
	}

	// CSU 이름 변경 입력 값에 대한 함수입니다. 
	const handleEditCSUName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEditCSUName(event.target.value)
	}

	// 그룹 편집 모달 ON/OFF 입니다.
	const handlerEditCSUModal = () => {
		setEditCSUModalState(!editCSUModalState)
	}

	const CSUContextMenuHandler = (event: React.MouseEvent<HTMLLabelElement>) => {
		event.preventDefault()
		if (selectedContextClickCSU === event.currentTarget.htmlFor) {
      setSelectedContextClickCSU('')
      return
    }
    setSelectedContextClickCSU(event.currentTarget.htmlFor)
	}

	const deleteCSUHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
	  setSelectedContextClickCSU('')
		const { id, name } = event.currentTarget
		const currentCSCName = parentPath.split('\\')[1]

		SweetAlert.fire({
			title: '요구사항 삭제',
			html: `${name} 그룹을 삭제 하시겠습니까?<br />${name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '네',
			cancelButtonText: '아니요',
		}).then(async (result) => {
			if (result.isConfirmed) {
				const target = document.getElementById(parentPath + '\\' + name) as HTMLInputElement
				target.checked = false

				const res = await DeleteRequirementGroup(id)
				if (!res.success) {
					SweetAlert.fire({
						title: '요구사항 삭제 실패',
						text: res.message,
						icon: 'error',
					})
				}

				await SweetAlert.fire({
					title: '요구사항 삭제 성공',
					text: '요구사항이 삭제 되었습니다.',
					icon: 'success',
				})
				navigate(0)
			}
		})
	}

	// CSU 입력 값에 대한 중복 체크 함수입니다. 
	const checkDuplicateCSUNameHandler = async (_ : React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		const res = await checkDuplicateCSUName(editCSUName, project.project_id)
		console.log(res)
		if (res.data != null) {
			SweetAlert.fire({
				title: '중복 확인',
				text: '동일한 그룹 이름이 존재합니다.',
				icon: 'error',
			})
			return
		}

		SweetAlert.fire({
			title: '중복 확인 성공',
			text: '사용 가능한 이름 입니다.',
			icon: 'success',
		})
		setIsDuplicateCSUName(() => true)
	}

	// 그룹 편집 모달 [적용] 버튼 클릭 시에 실행되는 함수입니다.
	const submitEditCSUModalHandler = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		const { id } = event.currentTarget

		const res = await EditRequirementGroup(+id, editCSUName)
		if (!res.success) {
			SweetAlert.fire({
				title: '그룹 수정 실패',
				text: res.message,
				icon: 'error',
			})
			return
		}
		
		await SweetAlert.fire({
			title: '그룹 수정',
			text: '그룹 수정이 완료되었습니다.',
			icon: 'success',
			confirmButtonText: '확인',
		})

		
		const target = document.getElementById(id) as HTMLInputElement
		target.checked = !target.checked
		handlerEditCSUModal()

		navigate(0)
		return
	}

	return (
		<div className="ps-4">
			{CSUList.map((CSUItem, index) => (
				<div key={index}>
					<input
						type="checkbox"
						id={parentPath + '\\' + CSUItem.req_group_name_child}
						name={CSUItem.req_group_name_child}
						className="hidden peer"
						checked={selectedContextClickCSU === CSUItem.req_group_name_child + '\\' + CSUItem.req_group_code_child.toString()}
						onChange={() => {}}
					/>
					<label
						id={parentPath + '\\' + CSUItem.req_group_name_child}
						htmlFor={CSUItem.req_group_name_child + '\\' + CSUItem.req_group_code_child.toString()}
						className="cursor-pointer select-none"
						onContextMenu={CSUContextMenuHandler}
						onClick={selectCSUHandler}>
						{CSUItem.req_group_name_child}
					</label>
					<div className="absolute flex-col hidden rounded-lg peer-checked:flex">
						<button
							id={CSUItem.req_group_code_child.toString()}
							name={CSUItem.req_group_name_child}
							className="p-2 text-black border bg-gray-50 rounded-md hover:bg-gray-500 hover:rounded-none hover:text-white"
							onClick={deleteCSUHandler}>
							그룹 삭제 [ {CSUItem.req_group_name_child} ]
						</button>

						{/* 요구사항 그룹 - CSU 이름 변경 Modal 입니다. */}
						<ActiveModal 
							size="sm"
							isOpen={editCSUModalState}
							buttonElement={
							<button
								className="p-2 text-black border bg-gray-50 rounded-md hover:bg-gray-500 hover:rounded-none hover:text-white"
								onClick={handlerEditCSUModal}>
								그룹 이름 변경 [ {CSUItem.req_group_name_child} ]
							</button> }>
							<ActiveModal.Head>그룹 이름 변경</ActiveModal.Head>
							<ActiveModal.Body>
								<div className="flex flex-col items-center justify-center">
								<FieldWrapper>
									<label className="whitespace-nowrap">그룹 속성</label>
									<Input placeholder={parentPath.split('//')[1]} disabled />
								</FieldWrapper>
								<FieldWrapper>
									<label className="whitespace-nowrap">그룹 이름</label>
									<Input value={editCSUName} placeholder={CSUItem.req_group_name_child} onChange={handleEditCSUName} />
									<Button className="whitespace-nowrap" onClick={checkDuplicateCSUNameHandler}>중복조회</Button>
								</FieldWrapper>
								</div>
							</ActiveModal.Body>
							<ActiveModal.Footer>
								<Button id={CSUItem.req_group_code_child.toString()} disabled={!isDuplicateCSUName} onClick={submitEditCSUModalHandler} variant='primary'>적용</Button>
								<Button variant='secondary' onClick={handlerEditCSUModal}>취소</Button>
							</ActiveModal.Footer>
						</ActiveModal>
					</div>
				</div>
			))}
		</div>
	)
}

export default RequirementTreeCSUList

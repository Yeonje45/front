import { useState } from 'react'
import { Dash, Plus } from 'react-bootstrap-icons'
import Collapse from 'tailwindElement/Collapse'
import SweetAlert from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

import RequirementTreeCSUList from './RequirementTreeCSUList'
import styles from '../input_requirements.module.scss'

import { RequirementChildrenGroup, DeleteRequirementGroup } from 'models/RequirementModel'
import { useRequirementDispatch } from 'context/requirementContext'

interface IProps {
	CSCList: {[key: number]: RequirementChildrenGroup}
}

// CSCList
const RequirementTreeCSCList = ({ CSCList }: IProps) => {
	const navigate = useNavigate()
	const requirementDispatch = useRequirementDispatch()

	const [isOpenCSUList, setIsOpenCSUList] = useState<{CSCItemName: string, isOpen: boolean}>({ CSCItemName: '', isOpen: false })
	const [selectedCSC, setSelectedCSC] = useState<string>('')
  const [selectedContextClickCSC, setSelectedContextClickCSC] = useState<string>('')

	const setSelectGroupByCSCNameHandler = (cscName: string) => {
		setSelectedCSC(cscName)
	}

	/**  CSC 클릭 시에 실행되는 함수입니다. ( CSC 선택 )
	 * htmlFor의 경우에는 CSC 이름과 CSC 코드를 '\\'로 구분하여 사용합니다.
	 */
	const selectCSUHandler = (event: React.MouseEvent<HTMLLabelElement>) => {
		event.preventDefault()
		setSelectGroupByCSCNameHandler(event.currentTarget.htmlFor)
		requirementDispatch({
			type: 'set_requirement',
			payload: {
				absPath: event.currentTarget.id,
				selected: event.currentTarget.htmlFor.split('\\')[0],
				code: event.currentTarget.htmlFor.split('\\')[1],
			},
		})
	}


	const handleIsOpenCSCList = (event: React.MouseEvent<SVGElement>) => {
	  if (selectedContextClickCSC) {
	    setSelectedContextClickCSC('')
	  }
		const { id } = event.currentTarget

		// 기존 CSC 이름과 같으면 상태를 NOT 으로 하고 
		// 기존 CSC 이름과 다르면 무조건 true 로 하고 CSC 이름을 변경합니다.
		setIsOpenCSUList(prevState => {
			if (prevState.CSCItemName === id) {
				return { CSCItemName: '', isOpen: !prevState.isOpen }
			} else {
				return { CSCItemName: id, isOpen: true }
			}
		});
	}

	const CSCContextMenuHandler = (event: React.MouseEvent<HTMLLabelElement>) => {
		event.preventDefault()
		if (selectedContextClickCSC === event.currentTarget.htmlFor) {
      setSelectedContextClickCSC('')
      return
    }
		setSelectedContextClickCSC(event.currentTarget.htmlFor)
	}

	const deleteCSCHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		const { id, name } = event.currentTarget

		SweetAlert.fire({
			title: '요구사항 삭제',
			html: `${name} 그룹을 삭제 하시겠습니까?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '네',
			cancelButtonText: '아니요',
		}).then(async (result) => {
			if (result.isConfirmed) {
				const target = document.getElementById(name) as HTMLInputElement
				target.checked = false

				const res = await DeleteRequirementGroup(id)
				console.log(res)
				if (!res.success) {
					SweetAlert.fire({
						title: '요구사항 삭제 실패',
						text: res.message,
						icon: 'error',
					})
					return
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

	return (
		<div className="ps-4">
			{Object.keys(CSCList).map((key, index_st) => (
				key != 'group_name' && 
				CSCList[+key].child_groups && (
					<div className="my-1" key={index_st}>
						<span className="flex items-center gap-2">
							{isOpenCSUList.CSCItemName == CSCList[+key].group_name ? (
								<Dash
									id={CSCList[+key].group_name}
									onClick={handleIsOpenCSCList}
									className={`${styles.treeButton} me-2`}
								/>
							) : (
								<Plus
									id={CSCList[+key].group_name}
									onClick={handleIsOpenCSCList}
									className={`${styles.treeButton} me-2`}
								/>
							)}
							<div>
								<input
									type="checkbox"
									name={CSCList[+key].group_name}
									id={" " + CSCList[+key].group_name}
									className="hidden peer"
									checked={selectedContextClickCSC === CSCList[+key].group_name + '\\' + key}
								  onChange={() => {}}
								/>
								<label
									htmlFor={CSCList[+key].group_name + '\\' + key}
									id={" " + CSCList[+key].group_name}
									className={`cursor-pointer select-none ${selectedCSC === CSCList[+key].group_name + '\\' + key ? 'text-blue-500 font-bold' : 'text-black'}`}
									onContextMenu={CSCContextMenuHandler}
									onClick={selectCSUHandler}
								>
									{CSCList[+key].group_name}
								</label>
								<button
									id={key}
									name={CSCList[+key].group_name}
									className="absolute flex-col hidden p-2 text-center text-black border shadow-md left-12 bg-gray-50 rounded-md peer-checked:flex hover:bg-gray-700 hover:text-white"
									onClick={deleteCSCHandler}>
									그룹 삭제 [ {CSCList[+key].group_name} ]
								</button>
							</div>
						</span>
						<Collapse isOpen={ isOpenCSUList.isOpen && isOpenCSUList.CSCItemName == CSCList[+key].group_name }>
							<div className="ps-4">
								<RequirementTreeCSUList
									cscHtmlFor={CSCList[+key].group_name + '\\' + key}
									setSelectGroupByCSCNameHandler={setSelectGroupByCSCNameHandler}
									CSUList={CSCList[+key].child_groups}
									parentPath={CSCList[+key].group_name}
								/>
							</div>
						</Collapse>
					</div>
			)))}
		</div>
	)
}

export default RequirementTreeCSCList

import { useState } from 'react'
import { Plus, Dash } from 'react-bootstrap-icons'

// Styles
import Collapse from 'tailwindElement/Collapse'
import styles from '../input_requirements.module.scss'

// Components 
import RequirementTreeCSCList from './RequirementTreeCSCList'

// utils
import { RequirementGroupModel } from "models/RequirementModel"
import { useRequirementDispatch } from 'context/requirementContext'

interface IProps {
	RequirementTreeItem: RequirementGroupModel 
	reqKey: string
}

const RequirementTreeItem = ({ RequirementTreeItem, reqKey }: IProps) => {
	const requirementDispatch = useRequirementDispatch()
	const [isOpenCSCList, setIsOpenCSCList] = useState<boolean>(true)

	// 분류 클릭 시에 실행되는 함수입니다. ( 분류선택 )
	const selectCSUHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		requirementDispatch({
			type: 'set_requirement',
			payload: {
				absPath: event.currentTarget.id,
				selected: event.currentTarget.name.split('\\')[0],
				code: event.currentTarget.name.split('\\')[1],
			},
		})
	}

	const handleIsOpenCSCList = () => {
		setIsOpenCSCList(!isOpenCSCList)
	}

	return (
		<div className="ps-1">
			<div className="px-2 py-3">
				<button className="flex items-center" id={RequirementTreeItem.group_name} name={RequirementTreeItem.group_name + '\\' + reqKey} onClick={selectCSUHandler}>
					{isOpenCSCList ? (
						<Dash
							onClick={handleIsOpenCSCList}
							className={`${styles.treeButton} me-2`}
						/>
					) : (
						<Plus
							onClick={handleIsOpenCSCList}
							className={`${styles.treeButton} me-2`}
						/>
					)}
					{RequirementTreeItem.group_name}
				</button>
				<Collapse isOpen={isOpenCSCList}>
					<div>
						<RequirementTreeCSCList CSCList={RequirementTreeItem} />
					</div>
				</Collapse>
			</div>
		</div>
	)
}

export default RequirementTreeItem

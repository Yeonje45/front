import RequirementTreeItem from './RequirementTreeItem'

import { RequirementGroupModel } from "models/RequirementModel"

interface IProps {
	inputRequirementsFields:{ [key: number]: RequirementGroupModel } 
}

// 요구사항 탐색기 커맨드 라인 트리
const CommendLineTree = ({ inputRequirementsFields }: IProps) => {
	return (
		<div className="h-full max-h-[600px] min-h-96 overflow-y-auto p-1">
			{ Object.keys(inputRequirementsFields).length > 0 && Object.keys(inputRequirementsFields).map((key: string, index_st) => (
				<RequirementTreeItem key={index_st} RequirementTreeItem={inputRequirementsFields[+key]} reqKey={key} />
			)) } 
		</div>
	)
}

export default CommendLineTree

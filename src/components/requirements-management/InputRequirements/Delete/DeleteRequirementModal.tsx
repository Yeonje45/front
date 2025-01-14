import Swal from 'sweetalert2'
import React from 'react'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'

import { RequirementModel, DeleteRequirement } from 'models/RequirementModel'

interface IProps {
  deleteRequirementList: RequirementModel[]
	isOpen: boolean

	handleDeleteRequirementModalState: () => void
	getRequirementsHandler: () => void
}

const DeleteRequirementModal = ({ deleteRequirementList, isOpen, handleDeleteRequirementModalState, getRequirementsHandler }: IProps) => {
	const [requirements, setRequirements] = React.useState<RequirementModel[]>([])
	
	React.useEffect(() => {
		setRequirements(() => deleteRequirementList)
	}, [deleteRequirementList])

	const submitDeleteRequirement = async (): Promise<void> => {
		const delete_requirement_id_list = requirements.map((requirement) => requirement.req_id)

		const res = await DeleteRequirement(delete_requirement_id_list)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '삭제 실패',
				text: '요구사항 삭제에 실패했습니다.',
			})
			return
		}

		Swal.fire({
			icon: 'success',
			title: '삭제 성공',
			text: '요구사항 삭제에 성공했습니다.',
		})
		// Call Get Requirements Function

		handleDeleteRequirementModalState()
		getRequirementsHandler()

		return
	}

  return (
		<Modal isOpen={isOpen} size="lg">
			<Modal.Head>삭제 요구사항</Modal.Head>
			<Modal.Body>
				<div className="flex flex-col items-center gap-4">
					<table className="w-full text-lg border">
						<thead>
							<tr className="p-2 bg-gray-100">
								<th className="w-1/4 p-2 text-lg text-center border">식별자</th>
								<th className="w-3/4 p-2 text-lg text-center border">제목</th>
							</tr>
						</thead>
						<tbody>
							{deleteRequirementList.map((filterDataItem, index) => (
								<tr key={index} className="even:bg-gray-100 odd:bg-white">
									<td className="p-1 text-center border">{filterDataItem.req_number}</td>
									<td className="p-1 text-center border">{filterDataItem.req_title}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="w-full my-4">
						<label htmlFor="edited_comment" className="text-lg">
							변경내용 요약
						</label>
						<Input.Textarea rows={4} id="edited_comment" name="edited_comment" />
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={submitDeleteRequirement}>
					완료
				</Button>
				<Button variant="secondary" onClick={handleDeleteRequirementModalState}>
					취소
				</Button>
			</Modal.Footer>
		</Modal>
  )
}

export default DeleteRequirementModal

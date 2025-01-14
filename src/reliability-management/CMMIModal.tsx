import React, { useState } from 'react'
import SweetAlert from 'sweetalert2'

import Modal from "tailwindElement/Modal"
import Button from "tailwindElement/Button"
import Input from "tailwindElement/Input"

import PanelContainer from "components/common/panels/PanelContainer"
import PanelHeader from "components/common/panels/PanelHeader"

import { AIRAMPAxios } from "models/index"

type Props = {
	putSelectedResult: (id: string) => void
}

export const CMMI_CHECKLIST_MODAL_FIELD = {
	fieldheader: ['CMMI level', '참여 업체의 CMMI 비율(%)\
	(The rate of the code is being developed by an organization \
	that has been assessed at CMMI level)'],
	fielddata: [
		{
			text: '1 or  unrated',
		},
		{
			text: '2',
		},
		{
			text: '3, 4, or 5',
		},
	]
}

const CMMIModal = ({putSelectedResult}: Props) => {
	const [CMMI_checklist, setCMMIChecklist] = React.useState<string[]>(Array.from({length: CMMI_CHECKLIST_MODAL_FIELD.fielddata.length}, () => '0'))

	const [cmmiModalState, setCMMIModalState] = useState<boolean>(false)

	const CMMIModalStateHandler = () => {
		setCMMIModalState(prev => !prev)
	}

	React.useEffect(() => {
		getCMMIChecklistRows()
	}, [cmmiModalState])

	const getCMMIChecklistRows = async (): Promise<void> => {
		const res: { data: { checkListData: string } } = await AIRAMPAxios.get('/cmmis/2/')
		const data = res.data.checkListData.split(',')

		setCMMIChecklist(() => data)
	}

	/**
	 * value: value, id: index
	 */
	const handleCMMIChecklist = (event: React.ChangeEvent<HTMLInputElement>) => {
		let { value, id } = event.target

		if (value.length > 1 && value[0] === '0') {
			value = value.slice(1)
		}

		setCMMIChecklist((prev) => {
			const data = [...prev]
			data[parseInt(id)] = value
			return data
		})
	}

	const submitCMMIChecklist = async (): Promise<void> => {
		const sum = CMMI_checklist.reduce((acc, cur) => acc + parseInt(cur), 0)
		if (sum > 100) {
			SweetAlert.fire({
				title: 'Error',
				text: 'The sum of the values must be less than or equal to 100',
				icon: 'error',
			})
			return
		}

		const data = CMMI_checklist.join(',')
		await AIRAMPAxios.put('/cmmis/2/', { checkListData: data, csciID: 2 })
		CMMIModalStateHandler()
		putSelectedResult("CMMI")
		return
	}

	return (
		<div>
			<Button onClick={CMMIModalStateHandler}>Edit</Button>

			<Modal isOpen={cmmiModalState} size="md">
				<Modal.Head>
					<p>CMMI CheckList</p>
				</Modal.Head>
				<Modal.Body className="max-h-[500px] overflow-y-auto">
					<PanelContainer>
						<PanelHeader title="참여 업체의 CMMI 비율" className="overflow-hidden"/>
						<div className="overflow-hidden">
							<table className="w-full table-auto">
								<thead>
									<tr>
										{ CMMI_CHECKLIST_MODAL_FIELD.fieldheader.map((header, index_nd) => (
											<th key={index_nd} className="p-2 text-center bg-gray-100">
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{ CMMI_CHECKLIST_MODAL_FIELD.fielddata.map((field_row, index_nd) => (
										<tr key={index_nd} className="text-center even:bg-gray-100 odd:bg-white">
											<td className="w-1/4">{field_row.text}</td>
											<td>
												<Input type="number" className="text-right" name={field_row.text} value={CMMI_checklist[index_nd]} id={index_nd.toString()} onChange={handleCMMIChecklist}/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</PanelContainer>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitCMMIChecklist}>Calculator</Button>
					<Button variant="primary" onClick={CMMIModalStateHandler}>Close</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default CMMIModal

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

// Shortcut_CHECKLIST_MODAL_FIELD
export const IndustryApp_CHECKLIST_MODAL_FIELD = {
	key: 'measure01',
	title: "Application 비율",
	fieldheader: ['Application Type', '시스템의 Application Type 비율(%)'],
	fielddata: [
		{
			text: "Defense",
		},
		{
			text: "Space",
		},
		{
			text: "Medical/Healthcare",
		},
		{
			text: "Commercial electronics",
		},
		{
			text: "Commercial transportation",
		},
		{
			text: "Commercial Software",
		},
		{
			text: "Energy",
		},
		{
			text: "Semiconductor fabrication",
		},
		{
			text: "Non Commercial Vehicle",
		},
		{
			text: "Satellite",
		},
		{
			text: "Missiles",
		},
		{
			text: "Software only",
		},
		{
			text: "Equipment",
		},
		{
			text: "Sensor of FW",
		},
		{
			text: "Device",
		},
		{
			text: "Aircraft",
		},
	]
}

const IndustryApplicationModal = ({ putSelectedResult }: Props) => {
	const [industryApplicationModalState, setIndustryApplicationModalState] = useState<boolean>(false)

	const [industryApplication_checklist, setIndustryApplicationChecklist] = React.useState<string[]>(Array.from({length: 16}, () => '0'))

	

	const IndustryApplicationModalStateHandler = () => {
		setIndustryApplicationModalState(prev => !prev)
	}

	React.useEffect(() => {
		getIndustryApplicationChecklistRows()
	}, [industryApplicationModalState])

	const getIndustryApplicationChecklistRows = async () => {
		const res: { data: { checkListData: string } } = await AIRAMPAxios.get('/industry-applications/2/')
		const data = res.data.checkListData.split(',')

		setIndustryApplicationChecklist(() => data)
	}

	/**
	 * value: value, id: index
	 */
	const handleIndustryApplicationChecklist = (event: React.ChangeEvent<HTMLInputElement>) => {
		let { value, id } = event.target

		setIndustryApplicationChecklist((prev) => {
			const data = [...prev]
			data[parseInt(id)] = value
			return data
		})
	}

	const submitIndustryApplicationChecklist = async () => {
		const sum = industryApplication_checklist.reduce((acc, cur) => acc + parseInt(cur), 0)
		if (sum > 100) {
			SweetAlert.fire({
				title: 'Error',
				text: 'The sum of the values must be less than or equal to 100',
				icon: 'error',
			})
			return
		}

		const data = industryApplication_checklist.join(',')
		await AIRAMPAxios.put('/industry-applications/2/', { checkListData: data, csciID: 2 })
		IndustryApplicationModalStateHandler()
		putSelectedResult("IndustryApplication")
	}

	return (
		<div>
			<Button onClick={IndustryApplicationModalStateHandler}>Edit</Button>
			<Modal isOpen={industryApplicationModalState} size="lg">
				<Modal.Head>
					<p>Industry Application CheckList</p>
				</Modal.Head>
				<Modal.Body className="max-h-[500px] overflow-y-auto">
					<PanelContainer>
						<PanelHeader title="Application 비율" className="overflow-hidden"/>
						<div className="overflow-hidden">
							<table className="w-full table-auto">
								<thead>
									<tr>
										{ IndustryApp_CHECKLIST_MODAL_FIELD.fieldheader.map((header, index_nd) => (
											<th key={index_nd} className="p-2 text-center bg-gray-100">
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{IndustryApp_CHECKLIST_MODAL_FIELD.fielddata.map((field_row, index_nd) => (
										<tr key={index_nd} className="text-center even:bg-gray-100 odd:bg-white">
											<td className="p-2">{field_row.text}</td>
											<td>
												<Input type="number" className="text-right" name={field_row.text} value={industryApplication_checklist[index_nd]} id={index_nd.toString()} onChange={handleIndustryApplicationChecklist}/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</PanelContainer>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitIndustryApplicationChecklist}>Calculator</Button>
					<Button variant="primary" onClick={IndustryApplicationModalStateHandler}>Close</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default IndustryApplicationModal 

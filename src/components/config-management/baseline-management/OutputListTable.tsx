import React from 'react'

import Button from 'tailwindElement/Button';
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { IBaselineManagementDetailModel } from "models/ConfigManagement"

interface OutputListTableProps {
	selectedSidebarDetailData: IBaselineManagementDetailModel | null
}

const OutputListTable = ({ selectedSidebarDetailData }: OutputListTableProps) => {
	return (
		<PanelContainer>
			<PanelHeader >산출물 목록</PanelHeader>
			<PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				<table className="table w-full table-border">
					<thead className="whitespace-nowrap">
						<tr>
							<th>산출물 종류</th>
							<th>파일명</th>
							<th>업로드 일시</th>
							<th>올린이</th>
						</tr>
					</thead>
					<tbody>
						{ selectedSidebarDetailData && selectedSidebarDetailData.baseline_outputs && selectedSidebarDetailData.baseline_outputs.length != 0 && selectedSidebarDetailData.baseline_outputs.map((output, index) => (
							<tr key={index}>
								<td> { output.std_output_name } </td>
								<td> { output.output_content_file || '' } </td>
								<td> { output.output_content_update_date } </td>
								<td> { output.output_content_update_person } </td>
							</tr>
						)) }
					</tbody>
				</table>
			</PanelBody>
		</PanelContainer>
	)
}

export default OutputListTable

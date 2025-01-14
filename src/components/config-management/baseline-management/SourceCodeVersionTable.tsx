import React from 'react'

import Button from 'tailwindElement/Button';
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { IBaselineManagementDetailModel } from "models/ConfigManagement"

interface SourceCodeVersionTableProps {
	selectedSidebarDetailData: IBaselineManagementDetailModel | null
}

const SourceCodeVersionTable = ({ selectedSidebarDetailData }: SourceCodeVersionTableProps) => {
	return (
		<PanelContainer>
			<PanelHeader
			>소스코드 버전</PanelHeader>
			<PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				<table className="table w-full table-border">
					<thead className="whitespace-nowrap">
						<tr>
							<th>소스코드 명칭</th>
							<th>설명</th>
						</tr>
					</thead>
					<tbody>
					  {
					    selectedSidebarDetailData && selectedSidebarDetailData.src_version_id && (
						    <tr>
							    <td>V.{selectedSidebarDetailData.src_version_name}</td>
							    <td>
								    <span>{selectedSidebarDetailData.src_version_content}</span>
							    </td>
						    </tr>
					    )
					  }
					</tbody>
				</table>
			</PanelBody>
		</PanelContainer>
	)
}

export default SourceCodeVersionTable

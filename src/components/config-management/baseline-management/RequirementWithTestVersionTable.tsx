import React from 'react'

import Button from 'tailwindElement/Button';
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { IBaselineManagementDetailModel } from "models/ConfigManagement"

interface RequirementWithTestVersionTableProps {
	detailData: IBaselineManagementDetailModel | null
}

const RequirementWithTestVersionTable = ({detailData}: RequirementWithTestVersionTableProps) => {
	return (
		detailData && <PanelContainer>
			<PanelHeader>요구사항 버전</PanelHeader>
			<PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				<table className="table w-full table-border">
					<thead className="whitespace-nowrap">
						<tr>
							<th>요구사항 버전</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{ detailData.baseline_id && detailData.baseline_number && 
									detailData.baseline_number
								}
							</td>
						</tr>
					</tbody>
				</table>
			</PanelBody>
		</PanelContainer>
	)
}

export default RequirementWithTestVersionTable;

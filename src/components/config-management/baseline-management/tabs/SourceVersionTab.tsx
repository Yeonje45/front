import React from 'react';
import Swal from 'sweetalert2'
import { useSelector } from "react-redux"

// UI
import Input from 'tailwindElement/Input';
import Button from 'tailwindElement/Button';

import TableWrapper from 'components/config-management/version-and-deliverable-management/TableWrapper';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';
import ReviewerFeedbackModal from 'components/config-management/version-and-deliverable-management/ReviewerFeedbackModal';

import {
	GetSourceCodeManagementTableData, ISourceCodeManagementModel,
	GetStatusByStatusCode
} from 'models/ConfigManagement'
import { RootState } from "app/store"

interface IProps {
	handleAddSourceCode: (sourceCode: ISourceCodeManagementModel) => void
}

const SourceVersionTab = ({handleAddSourceCode}: IProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [sourceCodeManagementTableData, setSourceCodeManagementTableData] = React.useState<ISourceCodeManagementModel[] | null>(null)
	const [selectedRowData, setSelectedRowData] = React.useState<ISourceCodeManagementModel | null>(null)

	/** 컴포넌트 마운트 시에 테이블 데이터 조회 */
	React.useEffect(() => {
    getSourceCodeManagementTableDataHandler()
	}, [])

	/** 테이블 데이터를 가져와주는 함수 */
	const getSourceCodeManagementTableDataHandler = async (): Promise<void> => {
		const res = await GetSourceCodeManagementTableData(project.project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '시험 관리 데이터 조회 실패',
				text: res.message
			})
		}
		if (!res.data) {
			return 
		}
		setSourceCodeManagementTableData(() => res.data)
		return
	}

	/** 테이블 행 Radio 선택 클릭 시에 작동 되는 함수 */
	const filterSelectedRow = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const { id } = event.currentTarget
		if (!sourceCodeManagementTableData) {
			await Swal.fire({
				icon: 'error',
				title: '데이터가 없습니다.',
				text: '페이지를 새로고침 해주세요.'
			})
			return
		}
		const selectedRow = sourceCodeManagementTableData.find((item) => item.src_version_id.toString() === id)
		if (!selectedRow) {
			await Swal.fire({
				icon: 'error',
				title: '데이터가 없습니다.',
				text: '페이지를 새로고침 해주세요.'
			})
			return
		}
		setSelectedRowData(() => selectedRow)
		return
	}

	const submitAddSource = () => {
		if (!selectedRowData) {
			Swal.fire({
				icon: 'error',
				title: '소스코드를 선택해야 합니다.',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '소스코드가 추가되었습니다.',
		})
		handleAddSourceCode(selectedRowData)
	}

	return (
		<div className="relative">
			<Button className='absolute right-5 top-2' onClick={submitAddSource}>선택항목 추가</Button>
			<PanelContainer>
				<PanelHeader>
					소스코드 버전
				</PanelHeader>

				<PanelBody>
					<TableWrapper>
						<div className="flex flex-col w-full">
							<table className="table w-full h-full table-border">
								<thead className="whitespace-nowrap">
									<tr>
										<th>선택</th>
										<th>소스코드 명칭</th>
										<th>상태</th>
										<th>요청일시</th>
										<th>승인/반려 일시</th>
										<th>설명</th>
										<th>요청자</th>
										<th>승인자</th>
									</tr>
								</thead>
								<tbody>
									{ sourceCodeManagementTableData && sourceCodeManagementTableData.length != 0 && sourceCodeManagementTableData.map((sourceCodeManagementTableItem, index) => (
										<tr key={index}>
											<td>
												<Input.Radio 
													name="radio" 
													onChange={filterSelectedRow}
													checked={selectedRowData?.src_version_id === sourceCodeManagementTableItem.src_version_id}
													id={sourceCodeManagementTableItem.src_version_id.toString()} />
											</td>
											<td>{sourceCodeManagementTableItem.src_version_name}</td>
											<td>{GetStatusByStatusCode(sourceCodeManagementTableItem.src_version_status || '')}</td>
											<td>{sourceCodeManagementTableItem.requester_date && new Date(sourceCodeManagementTableItem.requester_date).toLocaleString()}</td>
											<td>{sourceCodeManagementTableItem.approver_date && new Date(sourceCodeManagementTableItem.approver_date).toLocaleString()}</td>
											<td>{sourceCodeManagementTableItem.src_version_content}</td>
											<td>
												{
													<ReviewerFeedbackModal 
														content={sourceCodeManagementTableItem.src_version_content || ''}>
														{sourceCodeManagementTableItem.requester_user_name || ''}
													</ReviewerFeedbackModal>
												}
											</td>
											<td>
												{ 
														<ReviewerFeedbackModal 
															content={sourceCodeManagementTableItem.approver_comment || ''}>
															{sourceCodeManagementTableItem.approver_user_name || ''}
														</ReviewerFeedbackModal> 
												}
											</td>
									</tr>
									)) }
								</tbody>
							</table>
						</div>
					</TableWrapper>
				</PanelBody>
			</PanelContainer>
		</div>
	)
}

export default SourceVersionTab

import React from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"

// UI
import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';

// Components
import TableWrapper from 'components/config-management/version-and-deliverable-management/TableWrapper';
import ReviewerFeedbackModal from 'components/config-management/version-and-deliverable-management/ReviewerFeedbackModal';
import RequesterFeedbackModal from 'components/config-management/version-and-deliverable-management/RequesterFeedbackModal';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

// Constants
import { GetRequirementManagementTableData, IRequirementManagementModel, GetStatusByStatusCode } from 'models/ConfigManagement';
import { RootState } from "app/store"

interface IProps {
	handleAddRequirement: (requirement: IRequirementManagementModel) => void
}

// 요구사항 관리 테이블
const RequirementVersionTab = ({handleAddRequirement}: IProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [requirementManagementData, setRequirementManagementData] = React.useState<IRequirementManagementModel[] | null>(null)
	const [selectedRequirementManagementData, setSelectedRequirementManagementData] = React.useState<IRequirementManagementModel | null>(null)

	React.useEffect(() => {
		getRequirementManagementTableData()
	}, [])

	/* 요구사항 관리 테이블 데이터 조회 */
	const getRequirementManagementTableData = async ():Promise<void> => {
		const res = await GetRequirementManagementTableData(project.project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '산출물 관리 페이지 데이터 조회 실패',
				text: res.message,
			})
		}
		setRequirementManagementData(() => res.data)
		setSelectedRequirementManagementData(() => null)
	}

	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!requirementManagementData) {
			return
		}
		const id = +event.currentTarget.id;
		const filtered = requirementManagementData.filter((item) => item.baseline_id === id)[0]
		if (!filtered) {
			return
		}
		// 데이터가 이미 있으면 제거, 없으면 추가 
		setSelectedRequirementManagementData(() => filtered)
	}

	const submitAddRequirementList = () => {
		if (!selectedRequirementManagementData) {
			Swal.fire({
				icon: 'error',
				title: '선택된 산출물이 없습니다.',
			})
			return
		}
		handleAddRequirement(selectedRequirementManagementData)
		Swal.fire({
			icon: 'success',
			title: '선택된 산출물이 추가되었습니다.',
		})
		setSelectedRequirementManagementData(() => null)
	}

	return (
		<div className="relative">
			<PanelContainer>
				<PanelHeader>요구사항 버전</PanelHeader>
				<PanelBody>
					<TableWrapper>
						<div className="flex flex-col w-full">
							<table className="table w-full h-full table-border">
								<thead className="whitespace-nowrap">
									<tr>
										<th>선택</th>
										<th>버전</th>
										<th>상태</th>
										<th>요청일시</th>
										<th>승인/반려 일시</th>
										<th>요청자</th>
										<th>승인자</th>
									</tr>
								</thead>
								<tbody>
									{ requirementManagementData && requirementManagementData.map((requirementManagementItem, index) => (
										<tr key={index}>
											<td> 
												<Input.Radio
													id={requirementManagementItem.baseline_id.toString()}
													onChange={handleChangeCheckbox}
													checked={selectedRequirementManagementData?.baseline_id == requirementManagementItem.baseline_id ? true : false}
												/> 
											</td>
											<td>{requirementManagementItem.baseline_number}</td>
											<td>{GetStatusByStatusCode(requirementManagementItem.baseline_state || '')}</td>
											<td>{requirementManagementItem.baseline_request_date && new Date(requirementManagementItem.baseline_request_date).toLocaleString()}</td>
											<td>{requirementManagementItem.baseline_approval_date && new Date(requirementManagementItem.baseline_approval_date).toLocaleString()}</td>
											<td>
												{ requirementManagementItem.baseline_request_id && <RequesterFeedbackModal content={requirementManagementItem.baseline_request_comment}>
														{requirementManagementItem.baseline_request_name}
													</RequesterFeedbackModal>
												}
											</td>
											<td>
												{ requirementManagementItem.baseline_approval_comment && <ReviewerFeedbackModal content={requirementManagementItem.baseline_approval_comment}>
														{requirementManagementItem.baseline_approval_name}
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
			<Button onClick={submitAddRequirementList} className="absolute right-5 top-2">선택항목 추가</Button>
		</div>
	)
}

export default RequirementVersionTab;

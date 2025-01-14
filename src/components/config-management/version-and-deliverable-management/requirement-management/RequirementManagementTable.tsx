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
import ReviewOutcomeFinalizationModal from 'components/config-management/version-and-deliverable-management/ReviewOutcomeFinalizationModal';
import RequesterFeedbackModal from 'components/config-management/version-and-deliverable-management/RequesterFeedbackModal';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

// Constants
import { GetURLWithProjectIdAndStep } from 'utils/router';
import { GetRequirementManagementTableData, IRequirementManagementModel, ApproveAndRejectRequirementManagementTableData, GetStatusByStatusCode } from 'models/ConfigManagement';
import { RootState } from "app/store"

// 요구사항 관리 테이블
const RequirementManagementTable = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const project = useSelector((state: RootState) => state.project).project

	const [requirementManagementData, setRequirementManagementData] = React.useState<IRequirementManagementModel[] | null>(null)

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
	}

	/* 승인 요청 함수 */
	const requestApprovalHandler = async (data: Record<string, string>):Promise<void> => {
		if (!data['approver_comment'] || data['approver_comment'].length === 0) {
		  Swal.fire({
		    icon: 'error',
		    title: '승인 요청 실패',
		    text: '승인 사유를 입력해주세요.',
		  });
		  return;
		}
		const comment = data['approver_comment']
		const res = await ApproveAndRejectRequirementManagementTableData({baseline_id: data['src_version_id'], baseline_state: 'apr', baseline_approval_comment: comment, });
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '승인 요청 실패',
				text: res.message,
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '승인 요청 성공',
			text: res.message,
		})
		getRequirementManagementTableData()
	}

	/* 반려 요청 함수 */
	const requestRejectHandler = async (data: Record<string, string>):Promise<void> => {
    if (!data['approver_comment'] || data['approver_comment'].length === 0) {
      await Swal.fire({
        icon: 'error',
        title: '반려 요청 실패',
        text: '반려 사유를 입력해주세요.',
      })
      return
    }
		const comment = data['approver_comment']
		const res = await ApproveAndRejectRequirementManagementTableData({baseline_id: data['src_version_id'], baseline_state: 'rjc', baseline_approval_comment: comment, });
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '반려 요청 실패',
				text: res.message,
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '반려 요청 성공',
			text: res.message,
		})
		getRequirementManagementTableData()
	}

	return (
		<div className="flex flex-col w-10/12">
			<PanelContainer>
				<PanelHeader rightElement={
					<div className="flex items-center justify-end w-full">
						<Button onClick={() => {navigate(GetURLWithProjectIdAndStep(location, '/requirements-management/input-requirement'))}}>자세히 보기</Button>
					</div>
				}/>
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
										<th>기타</th>
									</tr>
								</thead>
								<tbody>
									{ requirementManagementData && requirementManagementData.map((requirementManagementItem, index) => (
										<tr key={index}>
											<td> <Input.Checkbox value={requirementManagementItem.baseline_id}/> </td>
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
												{ requirementManagementItem.baseline_state == 'rqt' || requirementManagementItem.baseline_state == 'drq' ? 
													<ReviewOutcomeFinalizationModal baseline_id={requirementManagementItem.baseline_id} baseline_state={requirementManagementItem.baseline_state} aprHandler={requestApprovalHandler} rjcHandler={requestRejectHandler} /> :
													<ReviewerFeedbackModal content={requirementManagementItem.baseline_approval_comment}>
														{requirementManagementItem.baseline_approval_name}
													</ReviewerFeedbackModal>
												}
											</td>
											<td>{requirementManagementItem.baseline_comment}</td>
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

export default RequirementManagementTable;

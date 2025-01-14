import React from 'react'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { List, FolderFill } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button';
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'
import OutputListTable from 'components/config-management/baseline-management/OutputListTable';
import RequirementWithTestVersionTable from 'components/config-management/baseline-management/RequirementWithTestVersionTable';
import SourceCodeVersionTable from 'components/config-management/baseline-management/SourceCodeVersionTable';
import ApprovalRequestModal from 'components/config-management/baseline-management/modals/ApprovalRequestModal';
import CreateBaselineModal from 'components/config-management/baseline-management/modals/CreateBaselineModal';
import DeleteBaselineModal from 'components/config-management/baseline-management/modals/DeleteBaselineModal';
import RequestReviewModal from 'components/config-management/baseline-management/modals/RequestReviewModal';
import HistoryModal from 'components/config-management/baseline-management/modals/HistoryModal';
import BaselineEditModal from 'components/config-management/baseline-management/modals/BaselineEditModal';
import ShowRequestCommentModal from 'components/config-management/baseline-management/modals/ShowRequestCommentModal';
import ShowApproveCommentModal from 'components/config-management/baseline-management/modals/ShowApprovCommentModal';
import ReviewDeleteModal from 'components/config-management/baseline-management/modals/ReviewDeleteModal'
import ConfigurationReviewModal from 'components/config-management/baseline-management/modals/ConfigurationReviewModal';
import ConfigEditRequestModal from 'components/config-management/baseline-management/modals/ConfigurationEditRequestModal';
import FilesTable from 'components/config-management/baseline-management/FilesTable';

import { 
	GetStatusByStatusCode, IBaselineManagementSidebarModel, GetBaselineManagementSidebarData,
	IBaselineManagementDetailModel, GetBaselineManagementSidebarDetailData,
	RequestBaselineApproval, CancelBaselineApproval,
	RequestCreateBaseline, RequestDeleteBaseline, RequestReviewBaseline,
	RequestConfigurationApprovalBaselineManagement
} from "models/ConfigManagement"
import { RootState } from 'app/store'

{/* drq, del */}
{/* 승인 요청 중이라면 무슨무슨 상태 코드임: rqt */}

const BaselineManagementPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
	const project = useSelector((state: RootState) => state.project).project
  const baselineTarget = searchParams.get('currentTarget');

	const [sidebarData, setSidebarData] = React.useState<IBaselineManagementSidebarModel[] | null>(null)
	const [selectedBaseline, setSelectedBaseline] = React.useState<IBaselineManagementSidebarModel | null>(null)
	const [selectedSidebarDetailData, setSeletedSidebarDetailData] = React.useState<IBaselineManagementDetailModel | null>(null)

	React.useEffect(() => {
		getBaselineManagementSidebar()
	}, [])

	/* Sidebar 콘텐츠 조회 ( Baseline ) */
	const getBaselineManagementSidebar = async (): Promise<void> => {
		const res = await GetBaselineManagementSidebarData(project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '콘텐츠 조회 실패',
			})
			return
		}
		setSidebarData(() => res.data)
		setSeletedSidebarDetailData(() => null)
		if (!res.data || !selectedBaseline) { return }
		const parentBaseline = res.data.filter((sidebarItem) => sidebarItem.conf_base_id == selectedBaseline.conf_base_id)[0] // conf 베이스라인 아이디
		if (!parentBaseline) { return }
		setSelectedBaseline(() => parentBaseline) // 베이스라인 클릭 시에 베이스라인 정보를 저장
	}

	/* Sidebar-Detail 콘텐츠 조회 ( Baseline Detail ) */
	const getSidebarDetail = async (baselineDetail: number):Promise<void> => {
		const res = await GetBaselineManagementSidebarDetailData(baselineDetail)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '콘텐츠 조회 실패',
			})
			return
		}
		setSeletedSidebarDetailData(() => res.data)
	}

  /* 기존에 선택 했었던 Sidebar-Detail을 클릭 이벤트 없이 다시 데이터를 조회하는 함수 */
  const handleSidebarDetail = async (): Promise<void> => {
    if (!selectedSidebarDetailData) { return }
		await getBaselineManagementSidebar()
		await getSidebarDetail(selectedSidebarDetailData.conf_base_detail_id)
  }

	/* Sidebar에 Sidebar-Detail을 클릭 하면 생기는 이벤트*/
	const handleSidebarDetailClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		if (!sidebarData) { return }
		const baselineDetailID = event.currentTarget.id // conf 베이스라인 상세 ( 디테일 ) 아이디
		const parentBaseline = sidebarData.filter((sidebarItem) => sidebarItem.conf_base_id == +event.currentTarget.name)[0] // conf 베이스라인 아이디
		if (!parentBaseline) { return }
		setSelectedBaseline(() => parentBaseline) // 베이스라인 클릭 시에 베이스라인 정보를 저장
		getSidebarDetail(+baselineDetailID) // 베이스라인 버전 클릭 시에 상세 정보 조회를 해주는 함수를 호출
	}

	/* 베이스라인 생성 요청 */
	const handleBaselineCreateRequest = async (data: Record<string, string>): Promise<void> => {
		const res = await RequestCreateBaseline(project.project_id, data['conf_base_name'], data['conf_base_comment'])
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '베이스라인 생성 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '베이스라인 생성 완료',
			text: '베이스라인 생성이 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
	}

	/* 베이스라인 삭제 요청 */
	const handleBaselineDeleteRequest = async (conf_base_id: number, conf_base_detail_id: number, isDeleteAll: boolean, conf_version_request_comment: string): Promise<void> => {
		if (!sidebarData) { return }
		const res = await RequestDeleteBaseline(conf_base_id, conf_base_detail_id, isDeleteAll, conf_version_request_comment)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '삭제 요청 실패',
				text: res.message || '베이스라인 삭제 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '베이스라인 삭제 요청 완료',
			text: '베이스라인 삭제 요청이 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
	}

	/* 승인 요청 */
	const handleApprovalRequest = async (data: Record<string, string>): Promise<void> => {
		if (!selectedSidebarDetailData) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: '승인 요청할 베이스라인을 선택해주세요.',
			})
			return
		}
		const res = await RequestBaselineApproval({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_request_comment: data['conf_version_request_comment'] })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '승인 요청 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '승인 요청 완료',
			text: '승인 요청이 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		await getSidebarDetail(selectedSidebarDetailData.conf_base_detail_id)
	}

	/* 승인 요청 취소 */
	const handleApprovalRequestCancel = async (): Promise<void> => {
		if (!selectedSidebarDetailData) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: '승인 요청 취소할 베이스라인을 선택해주세요.',
			})
			return
		}
		const checkCancle = await Swal.fire({
			icon: 'question',
			title: '승인 요청 취소',
			text: '승인 요청을 취소하시겠습니까?',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
		})
		if (!checkCancle.isConfirmed) return
		const res = await CancelBaselineApproval(selectedSidebarDetailData.conf_base_detail_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '승인 요청 취소 실패',
				text: res.message || '승인 요청 취소 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '승인 요청 취소 완료',
			text: '승인 요청 취소가 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		await getSidebarDetail(selectedSidebarDetailData.conf_base_detail_id)
	}

	/* 승인 함수 */
	const handleApproval = async (conf_version_approval_comment: string): Promise<void> => {
		if (!selectedSidebarDetailData) { return }
		const conf_version_status = 'apr'
		const res = await RequestReviewBaseline({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_status, conf_version_approval_comment })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '승인 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '승인 완료',
			text: '승인이 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		setSeletedSidebarDetailData(() => null)
	}

	/* 반려 함수 */
	const handleReject = async (conf_version_approval_comment: string): Promise<void> => {
		if (!selectedSidebarDetailData) { return }
		const conf_version_status = 'rjc'
		const res = await RequestReviewBaseline({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_status, conf_version_approval_comment })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '반려 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '반려 완료',
			text: '반려가 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		setSeletedSidebarDetailData(() => null)
	}

	/* 승인 함수 */
	const handleDeleteApproval = async (conf_version_approval_comment: string): Promise<void> => {
		if (!selectedSidebarDetailData) { return }
		const conf_version_status = 'apr'
		const res = await RequestReviewBaseline({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_status, conf_version_approval_comment })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '승인 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '승인 완료',
			text: '승인이 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		setSeletedSidebarDetailData(() => null)
	}

	/* 반려 함수 */
	const handleDeleteReject = async (conf_version_approval_comment: string): Promise<void> => {
		if (!selectedSidebarDetailData) { return }
		const conf_version_status = 'rjc'
		const res = await RequestReviewBaseline({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_status, conf_version_approval_comment })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '반려 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '반려 완료',
			text: '반려가 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		setSeletedSidebarDetailData(() => null)
	}

	{ /* 형상변경 승인 요청 모달 / ccb 상태 */ }
	const handleConfigurationApproval = async (conf_version_approval_comment: string, is_ccb: boolean, config_ccb_file: File | null): Promise<void> => {
		if (!selectedSidebarDetailData) { return }
		const conf_version_status = 'apr'
		const res = await RequestConfigurationApprovalBaselineManagement({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_status, conf_version_approval_comment, is_ccb, config_ccb_file })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '승인 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '승인 완료',
			text: '승인이 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		await getSidebarDetail(selectedSidebarDetailData.conf_base_detail_id)
	}

	{/* 형상변경 반려 요청 모달 / ccb 상태 */}
	const handleConfigurationReject = async (conf_version_approval_comment: string, is_ccb: boolean, config_ccb_file: File | null): Promise<void> => {
		if (!selectedSidebarDetailData) { return }
		const conf_version_status = 'rjc'
		const res = await RequestConfigurationApprovalBaselineManagement({ conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id, conf_version_status, conf_version_approval_comment, is_ccb, config_ccb_file })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '반려 실패',
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '반려 완료',
			text: '반려가 완료되었습니다.',
		})
		await getBaselineManagementSidebar()
		await getSidebarDetail(selectedSidebarDetailData.conf_base_detail_id)
	}

  return (
		<div className="container mx-auto">
			<div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-8">

				{/* Sidebar */}
				<div className="col-span-2 h-full">
					<PanelContainer>
						<PanelHeader>
							<div className="flex flex-wrap items-center justify-between w-full gap-2">
								<p>베이스라인 관리</p>
								<div className="flex items-center gap-2">
									<CreateBaselineModal 
										handleBaselineCreateRequest={handleBaselineCreateRequest}
										nameList={sidebarData ? sidebarData.map((sidebarItem) => sidebarItem.conf_base_name) : []}
									/>
									<DeleteBaselineModal 
										baselineData={sidebarData}
										handleBaselineDeleteRequest={handleBaselineDeleteRequest}
									/>
								</div>
							</div>
						</PanelHeader>
						<PanelBody className="overflow-y-auto max-h-[651px] min-h-[651px]">
							{sidebarData && sidebarData.map((sidebarItem, index) => (
								sidebarItem.baseline_details?.length !== 0 && <div key={index} className="my-2">
									<input type="checkbox" id={`collapse-${index}`} className="hidden peer" defaultChecked={baselineTarget == sidebarItem.conf_base_category} />
									<div className="flex flex-wrap items-center justify-between">
										<span className={`flex-1 text-lg ${baselineTarget == sidebarItem.conf_base_category ? 'underline font-bold' : ''}`}>{sidebarItem.conf_base_name}</span>
										{ sidebarItem.baseline_details && sidebarItem.baseline_details.length != 0 && <label htmlFor={`collapse-${index}`} className="block p-2 cursor-pointer"><List size={16} /></label> }
									</div>
									<div className="hidden border bg-gray-50 peer-checked:block">
										{ sidebarItem.baseline_details && sidebarItem.baseline_details.map((baselineDetail, index) => (
											<button 
												key={index} 
												onClick={handleSidebarDetailClick}
												id={baselineDetail.conf_base_detail_id.toString()} // Detail ID 
												name={sidebarItem.conf_base_id.toString()} // Parent Name
												className={`flex flex-wrap items-center w-full h-full p-2 gap-2 hover:bg-gray-200 
																		${selectedSidebarDetailData && baselineDetail.conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id ? 'bg-gray-200' : 'no_selected'}`}
											>
												<FolderFill 
													className="text-yellow-500"
												/>
												<span className="mr-auto">v{baselineDetail.conf_version_name}</span>
												<span>{GetStatusByStatusCode(baselineDetail.conf_version_status)}</span>
											</button>
										))}
									</div>
								</div>
							))}
						</PanelBody>
					</PanelContainer>
				</div>

				{/* Main Content */}
				<div className="col-span-6">
					{ selectedSidebarDetailData && selectedBaseline &&
						<PanelContainer>
							<PanelHeader>
								<div className="flex flex-wrap items-center justify-between w-full">
									<p className="font-bold">{selectedBaseline.conf_base_name} ( V{selectedSidebarDetailData.conf_version_name} )</p>
									<div className="flex flex-wrap items-center gap-2">
										{/* 승인/반려 해주는 모달 : 승인 요청 중일 때 혹은 삭제 요청 중일 때 */}
										{ 
											selectedSidebarDetailData.conf_version_status == 'rqt' && 
											selectedSidebarDetailData.config_request_file == null && 
											selectedSidebarDetailData.change_details_file == null ?
											<RequestReviewModal 
												handleApproval={handleApproval}
												handleReject={handleReject}
											/> : <></>
										}
										
										{/* 승인/반려 해주는 모달 : 파일 2개 중 하나라도 있으면서 rqt라면 아래 모달 [ccb] */}
										{
											selectedSidebarDetailData.conf_version_status == 'rqt' &&
											(selectedSidebarDetailData.config_request_file != null || selectedSidebarDetailData.change_details_file != null) &&
											<ConfigurationReviewModal 
												handleApproval={handleConfigurationApproval}
												handleReject={handleConfigurationReject}
											/>
										}

										{/* 삭제 요청에 대한 승인/반려 해주는 모달 ( 마지막 버전이면서, drq면 )*/}
										{
											selectedBaseline.baseline_details && 
											selectedBaseline.baseline_details.length > 0 && 
											selectedBaseline.baseline_details[selectedBaseline.baseline_details.length - 1].conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id &&
											selectedSidebarDetailData.conf_version_status == 'drq' &&
											<ReviewDeleteModal 
												handleApproval={handleDeleteApproval}
												handleReject={handleDeleteReject}
											/>
										}

										{ selectedSidebarDetailData.conf_version_status == 'apr' && <Button variant="secondary">승인 완료</Button> }
										{ selectedSidebarDetailData.conf_version_status == 'rjc' && <Button variant="danger">반려</Button> }

										{/* 베이스라인 상세 목록을 조회 중이라면 베이스라인 ID로 이력을 조회 */}
										{ selectedBaseline && <HistoryModal conf_base_id={selectedBaseline.conf_base_id} /> }
									</div>
								</div>
							</PanelHeader>
							<PanelHeader>
								<div className="flex flex-wrap items-center justify-between w-full">
                  { // 형상 변경 요청 모달 : 승인/반려 상태이면서, 검토 요청 상태가 아니라면 보여지는 모달 ( 가장 최신 버전이여야 함 )
                    selectedBaseline.baseline_details && 
                    selectedBaseline.baseline_details.length > 0 && 
                    selectedBaseline.baseline_details[selectedBaseline.baseline_details.length - 1].conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id &&
										selectedSidebarDetailData.conf_version_status === 'apr'
                    ? 
                    <ConfigEditRequestModal 
                      conf_base_detail_id={selectedSidebarDetailData?.conf_base_detail_id}
                      handleSidebarDetail={handleSidebarDetail}
											origin_outputs={selectedSidebarDetailData.baseline_outputs}
											origin_requirement={selectedSidebarDetailData.origin_baseline_versions}
											origin_source_code={selectedSidebarDetailData.origin_source_versions}
                    /> 
                    : 
                    <div />
                  }

									<div className="flex flex-wrap items-center gap-2">
										{/* 승인 요청 중일 때 승인 요청 취소 */}
										{ 
										  selectedSidebarDetailData.conf_version_status == 'rqt' && 
										  <Button variant="primary" onClick={handleApprovalRequestCancel}>승인요청취소</Button> 
										}

										{/* 승인 요청 모달 */}
										{ // apr, rjc, null 이면 뜸
										  selectedSidebarDetailData.conf_version_status == 'edt' ||
										  selectedSidebarDetailData.conf_version_status == null ?
											<ApprovalRequestModal 
												handleApprovalRequest={handleApprovalRequest}
												selectedSidebarDetailStatusData={selectedSidebarDetailData?.conf_version_status}
											/> :
											<div />
										}

										{/* 형상 편집 모달 / 항목 편집 모달 */}
										{/* 버전1 이면서 편집중 상태라면 항목 편집 BaselineEditModal 이 떠야 함 */}
                    {
                      selectedBaseline?.baseline_details && 
                      selectedBaseline.baseline_details.length > 0 && 
                      selectedBaseline.baseline_details.length === 1 && 
                      selectedBaseline.baseline_details[selectedBaseline.baseline_details.length - 1].conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id &&
                      selectedSidebarDetailData.conf_version_status === 'edt' &&
                      <BaselineEditModal 
                        conf_base_detail_id={selectedSidebarDetailData?.conf_base_detail_id}
                        handleSidebarDetail={handleSidebarDetail}
                        origin_outputs={selectedSidebarDetailData.baseline_outputs}
                        origin_requirement={selectedSidebarDetailData.origin_baseline_versions}
                        origin_source_code={selectedSidebarDetailData.origin_source_versions}
                      />
                    }

										{/* 형상 편집 모달 / 항목 편집 모달 */}
										{ // 마지막 버전 이면서 rqt, edt ( 승인, 편집 중) 이 아니라면 떠야 함 
                      selectedBaseline?.baseline_details && 
                      selectedBaseline.baseline_details.length > 0 && 
                      selectedBaseline.baseline_details[selectedBaseline.baseline_details.length - 1].conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id &&
											selectedSidebarDetailData.conf_version_status !== 'rqt' &&
											selectedSidebarDetailData.conf_version_status !== 'apr' &&
											selectedSidebarDetailData.conf_version_status !== 'drq' &&
											selectedSidebarDetailData.conf_version_status !== 'edt' &&
											selectedSidebarDetailData.conf_version_status !== 'rjc' &&
											<BaselineEditModal 
												conf_base_detail_id={selectedSidebarDetailData?.conf_base_detail_id}
                        handleSidebarDetail={handleSidebarDetail}
												origin_outputs={selectedSidebarDetailData.baseline_outputs}
												origin_requirement={selectedSidebarDetailData.origin_baseline_versions}
												origin_source_code={selectedSidebarDetailData.origin_source_versions}
											/>
										}
										{ // 형상 변경 요청 모달 : 승인/반려 상태이면서, 검토 요청 상태가 아니라면 보여지는 모달 ( 가장 최신 버전이여야 함 )
											selectedBaseline.baseline_details && 
											selectedBaseline.baseline_details.length > 1 && 
											selectedBaseline.baseline_details[selectedBaseline.baseline_details.length - 1].conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id &&
											(
												selectedSidebarDetailData.conf_version_status === 'edt' || 
												selectedSidebarDetailData.conf_version_status === 'rjc'
											) 
											? 
											<ConfigEditRequestModal 
												conf_base_detail_id={selectedSidebarDetailData.conf_base_detail_id}
												handleSidebarDetail={handleSidebarDetail}
												content='항목 편집'
												is_pass_file={true}
												origin_outputs={selectedSidebarDetailData.baseline_outputs}
												origin_requirement={selectedSidebarDetailData.origin_baseline_versions}
												origin_source_code={selectedSidebarDetailData.origin_source_versions
												}
											/> 
											: 
											<div />
										}
										{ // 형상 변경 요청 모달 : 승인/반려 상태이면서, 검토 요청 상태가 아니라면 보여지는 모달 ( 가장 최신 버전이여야 함 )
											selectedBaseline.baseline_details && 
											selectedBaseline.baseline_details.length === 1 && 
											(
												selectedSidebarDetailData.conf_version_status === 'null' || 
												selectedSidebarDetailData.conf_version_status === 'rjc'
											) 
											? 
											<BaselineEditModal 
												conf_base_detail_id={selectedSidebarDetailData?.conf_base_detail_id}
                        handleSidebarDetail={handleSidebarDetail}
												origin_outputs={selectedSidebarDetailData.baseline_outputs}
												origin_requirement={selectedSidebarDetailData.origin_baseline_versions}
												origin_source_code={selectedSidebarDetailData.origin_source_versions}
											/>
											: 
											<div />
										}
									</div>
								</div>
							</PanelHeader>
							<PanelBody className="max-h-[600px] min-h-[600px] overflow-y-auto">
								<div className="space-x-1">
									<ShowRequestCommentModal comment={selectedSidebarDetailData.conf_version_request_comment} />
									<ShowApproveCommentModal comment={selectedSidebarDetailData.conf_version_approval_comment}/>
								</div>
								{
									selectedBaseline?.baseline_details && 
									selectedBaseline.baseline_details.length > 0 && 
									selectedBaseline.baseline_details[0].conf_base_detail_id !== selectedSidebarDetailData.conf_base_detail_id &&
									<FilesTable 
										selectedSidebarDetailData={selectedSidebarDetailData}
									/>
								}
								{/* 산출물 목록 */}
								<OutputListTable
									selectedSidebarDetailData={selectedSidebarDetailData}
								/>

								{/*요구사항/시험 버전 */}
								<RequirementWithTestVersionTable 
									detailData={selectedSidebarDetailData}
								/>

								{/* 소스코드 버전*/}
								<SourceCodeVersionTable 
									selectedSidebarDetailData={selectedSidebarDetailData}
								/>
							</PanelBody>
						</PanelContainer>
					}
				</div>
			</div>
		</div>
  )
}

export default BaselineManagementPage

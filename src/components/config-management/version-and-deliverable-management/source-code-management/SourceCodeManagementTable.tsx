import React from 'react';
import Swal from 'sweetalert2'
import {
	LockFill,
	UnlockFill,
} from 'react-bootstrap-icons'
import { useSelector } from "react-redux"

// UI
import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';

import TableWrapper from 'components/config-management/version-and-deliverable-management/TableWrapper';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';
import ReviewerFeedbackModal from 'components/config-management/version-and-deliverable-management/ReviewerFeedbackModal';
import ReviewOutcomeFinalizationModal from 'components/config-management/version-and-deliverable-management/ReviewOutcomeFinalizationModal';
import DeleteModal from 'components/config-management/version-and-deliverable-management/source-code-management/DeleteModal';
import AddModal from 'components/config-management/version-and-deliverable-management/source-code-management/AddModal';
import EditModal from 'components/config-management/version-and-deliverable-management/source-code-management/EditModal';

import {
	GetSourceCodeManagementTableData, ISourceCodeManagementModel,
	DeleteSourceCodeManagementTableData, IDeleteSurceCodeManagementTableDataParams,
	ApproveAndRejectSourceCodeManagementTableData,
	IAddSourceCodeManagementTableDataParams, AddSourceCodeManagementTableData,
	EditSourceCodeManagementTableData, 
	GetStatusByStatusCode
} from 'models/ConfigManagement'
import { RootState } from "app/store"

const SourceCodeManagementTable = () => {
	const project = useSelector((state: RootState) => state.project).project

	const [editModeState, setEditModeState] = React.useState<boolean>(false)
	const [sourceCodeManagementTableData, setSourceCodeManagementTableData] = React.useState<ISourceCodeManagementModel[] | null>(null)
	const [selectedRowData, setSelectedRowData] = React.useState<ISourceCodeManagementModel | null>(null)

	/** 컴포넌트 마운트 시에 테이블 데이터 조회 */
	React.useEffect(() => {
    getSourceCodeManagementTableDataHandler()
	}, [])

	/** Edit Mode 변경 핸들러 */
	const handleEditModeState = (): void => {
		setEditModeState(!editModeState)
	}

	/** 테이블 데이터를 가져와주는 함수 */
	const getSourceCodeManagementTableDataHandler = async (): Promise<void> => {
		const project_id = project.project_id
		const res = await GetSourceCodeManagementTableData(project_id);
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

	/** 테이블 행 삭제에 사용되는 함수 */
	const deleteSourceCodeManagementTableDataHandler = async ({ src_version_id, src_version_status }: IDeleteSurceCodeManagementTableDataParams): Promise<void> => {
    setSelectedRowData(null) // Change selected row data to null
		const res = await DeleteSourceCodeManagementTableData({ src_version_id, src_version_status: src_version_status })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '소스코드 삭제 요청 실패',
				text: res.message || '소스코드 삭제 요청 실패'
			})
      return
    }
    Swal.fire({
      icon: 'success',
      title: '소스코드 삭제 요청 성공',
      text: '소스코드 삭제 요청 성공'
    })
    getSourceCodeManagementTableDataHandler()
		return
	}

	/** 승인자 승인 함수 */
	const approveSourceCodeManagementTableDataHandler = async (data: Record<string, string>): Promise<void> => {
		data['src_version_status'] = 'apr'
		
		if (!data['approver_comment'].trim().length) {
			await Swal.fire({
				icon: 'error',
				title: '승인 의견을 입력해주세요.',
				text: '승인 의견을 입력해주세요.'
			})
			return
		}

		const res = await ApproveAndRejectSourceCodeManagementTableData({ src_version_id: data['src_version_id'], src_version_status: data['src_version_status'], approver_comment: data['approver_comment']})
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '소스코드 승인 요청 실패',
				text: res.message || '소스코드 승인 요청 실패'
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '소스코드 승인 요청 성공',
			text: '소스코드 승인 요청 성공'
		})
		getSourceCodeManagementTableDataHandler()
		return
	}

	/** 승인자 반려 함수 */
	const rejectSourceCodeManagementTableDataHandler = async (data: Record<string, string>): Promise<void> => {
		data['src_version_status'] = 'rjc'

		if (!data['approver_comment'].trim().length) {
			await Swal.fire({
				icon: 'error',
				title: '반려 의견을 입력해주세요.',
				text: '반려 의견을 입력해주세요.'
			})
			return
		}

		const res = await ApproveAndRejectSourceCodeManagementTableData({ src_version_id: data['src_version_id'], src_version_status: data['src_version_status'], approver_comment: data['approver_comment']})
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '소스코드 반려 요청 실패',
				text: res.message || '소스코드 반려 요청 실패'
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '소스코드 반려 요청 성공',
			text: '소스코드 반려 요청 성공'
		})
		getSourceCodeManagementTableDataHandler()
		return
	}

	/** 등록 함수 */
	const addSourceCodeManagementTableDataHandler = async (data: IAddSourceCodeManagementTableDataParams): Promise<void> => {
		if (!data) {
			Swal.fire({
				icon: 'error',
				title: '데이터가 없습니다.',
				text: '데이터를 입력해주세요.'
			})
			return
		}
		const res = await AddSourceCodeManagementTableData(data)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '소스코드 등록 요청 실패',
				text: res.message || '소스코드 등록 요청 실패'
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '소스코드 등록 요청 성공',
			text: '소스코드 등록 요청 성공'
		})
		getSourceCodeManagementTableDataHandler()
		return
	}

	/** 편집 버튼 클릭 이후 저장 버튼 클릭 시에 작동하는 함수 */
	const editSourceCodeManagementTableDataHandler = async (del_file_ids: number[], src_file_list: { src_file_id: number, src_file_content: string }[] | null): Promise<void> => {
		const project_id = project.project_id
		const res = await EditSourceCodeManagementTableData(project_id, del_file_ids, src_file_list)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '소스코드 편집 실패',
				text: res.message || '소스코드 편집 실패'
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: '소스코드 편집 성공',
			text: '소스코드 편집 성공'
		})
		getSourceCodeManagementTableDataHandler()
		return
	}


	return (
		<div className="flex flex-col w-10/12">
			<PanelContainer>
				<PanelHeader>
					<div className="flex flex-wrap items-center justify-between w-full">
						<div className="flex flex-wrap items-center gap-2">
						{/*
							<Button variant="primary">다운로드</Button>
							<Button variant="primary">자세히 보기</Button>
						*/}
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<AddModal 
								addSourceCodeManagementTableDataHandler={addSourceCodeManagementTableDataHandler}/>
							<EditModal 
								selectedRowData={selectedRowData}	
								editSourceCodeManagementTableDataHandler={editSourceCodeManagementTableDataHandler}/>
							<DeleteModal 
								selectedRowData={selectedRowData}	
								deleteSourceCodeManagementTableDataHandler={deleteSourceCodeManagementTableDataHandler} />
						</div>
					</div>
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
												{ sourceCodeManagementTableItem.src_version_status == 'rqt' || sourceCodeManagementTableItem.src_version_status == 'drq' ? 
													<ReviewOutcomeFinalizationModal 
														baseline_id={sourceCodeManagementTableItem.src_version_id} 
														baseline_state={sourceCodeManagementTableItem.src_version_status} 
														aprHandler={approveSourceCodeManagementTableDataHandler}
														rjcHandler={rejectSourceCodeManagementTableDataHandler} /> :
													sourceCodeManagementTableItem.approver_comment && 
														<ReviewerFeedbackModal 
															content={sourceCodeManagementTableItem.approver_comment}>
															{sourceCodeManagementTableItem.approver_user_name}
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

export default SourceCodeManagementTable

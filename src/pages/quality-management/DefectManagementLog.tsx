import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';
import ShowModal from 'components/quality-management/defect-management-log/ShowModal';
import AddModal from 'components/quality-management/defect-management-log/AddModal';
import UpdateModal from 'components/quality-management/defect-management-log/UpdateModal';

import { 
	DefectManagementLogModel, GetDefectManagementLogs,
	CreateDefectManagementLogModel, CreateDefectManagementLog,
	UpdateDefectManagementLogModel, UpdateDefectManagementLog,
	DeleteDefectManagementLog,
} from 'models/QualityManagement';
import { RootState } from 'app/store';

const DefectManagementLog = () => {
	const project = useSelector((state: RootState) => state.project).project;

	const [tableData, setTableData] = React.useState<DefectManagementLogModel[] | null>(null);
	const [seletedRow, setSelectedRow] = React.useState<number[]>([]);

	React.useEffect(() => {
		getDefectManagementLogs();
	}, []);

	/* 결함관리대장 목록을 가져오는 함수 */
	const getDefectManagementLogs = async () => {
		const res = await GetDefectManagementLogs(project.project_id);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '결함관리대장 목록을 가져오는데 실패하였습니다.',
				text: res.message,
			});
			return
		}
		setTableData(res.data);
	}

	/* 결함관리대장 새로운 데이터 생성 */
	const createDefectManagementLog = async (defect: CreateDefectManagementLogModel): Promise<void> => {
		const res = await CreateDefectManagementLog(project.project_id, defect);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '결함관리대장 데이터 생성에 실패하였습니다.',
				text: res.message,
			});
			return
		}
		Swal.fire({
			icon: 'success',
			title: '결함관리대장 데이터 생성에 성공하였습니다.',
			text: res.message,
		});
		getDefectManagementLogs();
	}

	/* 결함관리대장 데이터 수정*/
	const updateDefectManagementLog = async (defect: UpdateDefectManagementLogModel): Promise<void> => {
		const res = await UpdateDefectManagementLog(defect);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '결함관리대장 데이터 수정에 실패하였습니다.',
				text: res.message,
			});
			return
		}
		Swal.fire({
			icon: 'success',
			title: '결함관리대장 데이터 수정에 성공하였습니다.',
			text: res.message,
		});
		getDefectManagementLogs();
	}

	/* 결함관리대장 데이터 삭제 */
	const deleteDefectManagementLog = async (): Promise<void> => {
		if (seletedRow.length === 0) {
			Swal.fire({
				icon: 'warning',
				title: '삭제할 데이터를 선택해주세요.',
			});
			return
		}
		const res = await DeleteDefectManagementLog(seletedRow);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '결함관리대장 데이터 삭제에 실패하였습니다.',
				text: res.message,
			});
			return
		}
		Swal.fire({
			icon: 'success',
			title: '결함관리대장 데이터 삭제에 성공하였습니다.',
			text: res.message,
		});
		getDefectManagementLogs();
	}

	/* 우선순위를 가져와주는 함수입니다 */
	const getPriorityHandler = (priority: number) => {
		switch (priority) {
			case 1:
				return 'high';
			case 2:
				return 'middle';
			case 3:
				return 'low';
		}
	}

	/* row의 Checkbox 클릭 시에 seletedRow에 해당 행의 ID를 추가 */
	const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id } = event.target;
		const selectedId = parseInt(id);

		if (event.target.checked) {
			setSelectedRow([...seletedRow, selectedId]);
		} else {
			setSelectedRow(seletedRow.filter(row => row !== selectedId));
		}
	}

	return (
		<React.Fragment>
			<div className="container px-4 mx-auto mb-3">
				<PanelContainer>
					<PanelHeader>
						<div className="flex flex-wrap items-center justify-between w-full text-sm">
							<div className="items-center grid gap-1 grid-cols-2">
						    <p>결함관리대장</p>
								{/*<Button>내보내기</Button>*/}
							</div>
							<div className="grid gap-1 grid-cols-3">
								<AddModal 
									content="추가"
									onCreateHandler={createDefectManagementLog} 
								/>
								<UpdateModal 
									content="편집"
									disabled={seletedRow.length != 1}
									onUpdateHandler={updateDefectManagementLog} 
									// tableData가 있을 때, 그리고 선택 된 row가 있을 때, 선택된 row의 데이터를 가져온다.
									defectData={(tableData && seletedRow.length && tableData.find(row => row.issue_id === seletedRow[0])) || null}
								/>
								<Button 
									disabled={seletedRow.length == 0}
									onClick={deleteDefectManagementLog}
								>삭제</Button>
							</div>
						</div>
					</PanelHeader>

					<PanelBody className="min-h-[500px] max-h-screen overflow-y-auto p-0">
						<table className="table w-full h-full table-border">
							<thead className="whitespace-nowrap">
								<tr>
									<th>선택</th>
									<th>식별자</th>
									<th>Source(=장절)</th>
									<th>의견</th>
									<th>상태</th>
									<th>제기자</th>
									<th>제기일자</th>
									<th>영향받는 문서</th>
									<th>결함 조치자</th>
									<th>해결방안</th>
									<th>해결방안 승인여부</th>
									<th>조치완료일자</th>
									<th>우선순위</th>
								</tr>
							</thead>
							<tbody>
								{ tableData && tableData.map((tableItem, index) => (
									<tr key={index}>
										<td>
											<input 
												type="checkbox" 
												id={tableItem.issue_id.toString()} 
												onChange={handleCheckboxClick}
												checked={seletedRow.includes(tableItem.issue_id)}
											/>
										</td>
										<td>
											<ShowModal defectData={ tableItem } >
												{tableItem.issue_name}
											</ShowModal>
										</td>
										<td>{tableItem.issue_source}</td>
										<td>{tableItem.issue_comment}</td>
										<td>{tableItem.issue_state}</td>
										<td>{tableItem.issue_reporter_name}</td>
										<td>{tableItem.issue_report_date}</td>
										<td>{tableItem.issue_affected_doc}</td>
										<td>{tableItem.issue_resolver_name}</td>
										<td>{tableItem.issue_solution}</td>
										<td>{tableItem.issue_solv_is_appr == null ? '대기' : tableItem.issue_solv_is_appr ? '승인' : '반려'}</td>
										<td>{tableItem.issue_solution_date}</td>
										<td>{getPriorityHandler(tableItem.issue_priority)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</PanelBody>
				</PanelContainer>
			</div>
		</React.Fragment>
	)
}

export default DefectManagementLog;

import React from "react"
import Swal from "sweetalert2"
import { X } from "react-bootstrap-icons"

import Input from "tailwindElement/Input"
import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal"
import Tabs from "tailwindElement/Tabs"
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';
import UploadReviewMaterialFilesModal from 'components/quality-management/review/UploadReviewMaterialFilesModal';
import UpdateCase4TechnicalModal from 'components/quality-management/review/update/UpdateCase4TechnicalModal';

import {
	GetBusinessReviewCase4, ITechnicalReviewCase4Model,
	GetTechnicalNameByClassification, ITechnicalReviewCase4ReviewMeeting,
  DownloadBusinessReviewCase4MeetingFile, CreateTechnicalReviewActionItem,
	SaveBusinessReviewCase4ActionItem, ISaveTechnicalReviewCase4ReviewActionItemModel,
	GetMeetingPeopleList, IMeetingPeopleModel
} from 'models/QualityManagement';


interface IShowCase4DetailModalProps {
	project_id: string;
	selected_review_id: number | null
	disabled: boolean
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

const ShowCase4DetailModal = ({ project_id, selected_review_id, disabled }: IShowCase4DetailModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [managData, setManagData] = React.useState<ITechnicalReviewCase4Model | null>(null)

  // 회의자료/회의록 Radio 버튼 선택된 id 값 
  const [selectedReviewMaterialId, setSelectedReviewMaterialId] = React.useState<number | null>(null)

  // action_item Checkbox 버튼 클릭 시에 id 값 
  const [selectedActionItemList, setSelectedActionItemList] = React.useState<number[]>([])
	// 삭제할 action item id 값
	const [deleteActionItemId, setDeleteActionItemId] = React.useState<number[]>([]);

	// 사용자 목록 정보
	const [meetingPeopleList, setMeetingPeopleList] = React.useState<IMeetingPeopleModel[] | null>(null);

	/* props로 받은 review_id로 상세보기 데이터 조회 */
	const getDetailData = async (review_id: number): Promise<void> => {
		const res = await GetBusinessReviewCase4({review_id});
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '상세보기 데이터 조회 오류',
				text: res.message || '상세보기 데이터 조회에 실패했습니다.',
			})
			return
		}
		setManagData(() => res.data)
		if (res.data?.review_action_items.length == 0) {
			setManagData((prev) => {
				if (!prev) { return null }
				return {
					...prev,
					review_action_items: [{
						review_action_item_id: prev.review_action_items.length + 1,
						issue_source: '',
						issue_comment: '',
						issue_state: '',
						issue_report_date: new Date().toISOString().split('T')[0],
						issue_affected_doc: null,
						issue_solution: '',
						issue_solv_is_appr: false,
						issue_solution_date: null,
						issue_priority: 0,
						review_id: 0,
						issue_reporter: '',
						issue_resolver: '',
						isNew: true,
					}]
				}
			})
		}
		
	}

	const handleGetPeopleList = async () => {
		const res = await GetMeetingPeopleList({project_id});
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '회의자 목록 조회 오류',
				text: res.message || '회의자 목록 조회에 실패했습니다.',
			})
			return
		}
		setMeetingPeopleList(res.data);
	}
	
  const handleOpen = () => {
		if (!selected_review_id) { return }
		handleGetPeopleList();
		setSelectedActionItemList(() => [])
		setDeleteActionItemId(() => [])
		getDetailData(selected_review_id)
    setIsOpen(() => true)
    return 
  }

  const handleClose = () => {
		setManagData(() => null)
    setIsOpen(() => false)
    return 
  }

  // 회의록/회의자료 Radio 버튼 선택 시 실행되는 함수
  const handleChangeReviewMaterialRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReviewMaterialId(() => parseInt(e.target.value))
  }

  // 회의록/회의자료 다운로드 함수 
  const handleDownloadReviewMaterialFile = async () => {
    if (!selectedReviewMaterialId) {
      Swal.fire({
        icon: 'error',
        title: '다운로드 오류',
        text: '다운로드 할 파일을 선택해주세요.'
      })
      return 
    }
    const res = await DownloadBusinessReviewCase4MeetingFile({ review_file_id: selectedReviewMaterialId })
    if (!res.data) {
      Swal.fire({
        icon: 'error',
        title: '다운로드 오류',
        text: res.message || '다운로드에 실패했습니다.'
      })
      return
    }
    const selected_file = managData?.review_files.filter((review_file) => review_file.review_file_id === selectedReviewMaterialId) // 파일 명을 가져옴
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', selected_file ? selected_file[0].review_file_path : 'download')
    document.body.appendChild(link)
    link.click()
    link.remove();
    Swal.fire({
      icon: 'success',
      title: '다운로드 성공',
      text: '다운로드가 완료되었습니다.'
    })
  }
  
  // ActionItem Checkbox 버튼 선택 시 실행되는 함수
  const handleChangeActionItemCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) // action_item_id
    const chekcked = e.target.checked
    if (chekcked) {
      setSelectedActionItemList((prev) => [...prev, value])
      return
    }
    setSelectedActionItemList((prev) => prev.filter((item) => item !== value))
  }

	// action Item 입력 해주는 함수 
	const handleChangeActionItem = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number, key: string) => {
		const { value } = event.target;
		// id는 index가 아니라 review_action_item_id
		if (key === 'issue_solv_is_appr') {
			setManagData((prev) => {
				if (!prev) { return null }
				return {
					...prev,
					review_action_items: prev.review_action_items.map((item) => {
						if (item.review_action_item_id === id) {
							return {
								...item,
								[key]: !item.issue_solv_is_appr
							}
						}
						return item
					})
				}
			})
			return
		}
		setManagData((prev) => {
			if (!prev) { return null }
			return {
				...prev,
				review_action_items: prev.review_action_items.map((item) => {
					if (item.review_action_item_id === id) {
						return {
							...item,
							[key]: value
						}
					}
					return item
				})
			}
		})
	}

	// action item 행 추가
	const handleAddActionItemRow = () => {
		setManagData((prev) => {
			if (!prev) { return null }
			return {
				...prev,
				review_action_items: [
					...prev.review_action_items,
					{
						review_action_item_id: prev.review_action_items.length + 1,
						issue_source: '',
						issue_comment: '',
						issue_state: '',
						issue_report_date: new Date().toISOString().split('T')[0],
						issue_affected_doc: null,
						issue_solution: '',
						issue_solv_is_appr: false,
						issue_solution_date: null,
						issue_priority: 0,
						review_id: 0,
						issue_reporter: '',
						issue_resolver: '',
						isNew: true,
					}
				]
			}
		})
	}

	// action Item 행 삭제 
	const handleDeleteActionItemRow = () => {
		// selectedActionItemList에 있는 모든 정보를 filter
		const filterd = managData?.review_action_items.filter((item) => !selectedActionItemList.includes(item.review_action_item_id))
		if (!filterd) { return }
		setManagData((prev) => {
			if (!prev) { return null }
			return {
				...prev,
				review_action_items: filterd
			}
		})
		setDeleteActionItemId(() => selectedActionItemList)
		setSelectedActionItemList(() => [])
	}

	// 저장을 위한 함수
	const handleSaveActionItem = async () => {
		if (!managData) {
			return
		}
		const newActionItemsFiltered = managData.review_action_items.map((item) => {
			const { review_action_item_id, isNew, ...rest } = item
			return rest
		})
		// is new가 아닌 것들만 
		const filter_review_id_list = managData.review_action_items
		.filter((item) => !item.isNew)
		.map((item) => item.review_action_item_id)
		console.log(filter_review_id_list)
		// filter_review_id_list와 기존 delected Action Item id 를 합쳐주기 ( 없으면 그냥 filter_review_id_list만 )
		const deleteActionItemIdMap = deleteActionItemId ? [...deleteActionItemId, ...filter_review_id_list] : filter_review_id_list
		const res = await SaveBusinessReviewCase4ActionItem({ review_id: selected_review_id!, del_action_item_list: deleteActionItemIdMap || [], action_item_list: newActionItemsFiltered })
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Action Item 저장 오류',
				text: res.message || 'Action Item 저장에 실패했습니다.'
			})
			return
		}
		Swal.fire({
			icon: 'success',
			title: 'Action Item 저장 성공',
			text: 'Action Item이 저장되었습니다.'
		})
		setDeleteActionItemId(() => [])
		setSelectedActionItemList(() => [])
		await getDetailData(selected_review_id!)
	}

	// 행 추가하기로 만들어진 action item 삭제
	const handleDeleteCreatedActionItem = async (id: number) => {
		const confirm = await Swal.fire({
			icon: 'question',
			title: 'Action Item 삭제',
			text: '생성된 Action Item을 삭제하시겠습니까?',
			showCancelButton: true
		})
		if (!confirm.isConfirmed) { return }
		if (!managData) { return }
		const filtered = managData.review_action_items.filter((item) => item.review_action_item_id !== id)
		setManagData((prev) => {
			if (!prev) { return null }
			return {
				...prev,
				review_action_items: filtered
			}
		})
	}


  // ActionItem을 결함대장에 추가하는 함수
  const handleAddActionItemToDefectBook = async () => {
    if (!selectedActionItemList || selectedActionItemList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '결함대장 추가 오류',
        text: '추가할 Action Item을 선택해주세요.'
      })
      return
    }
    const createProps = {
      project_id,
      action_item_list: selectedActionItemList
    };
    const res = await CreateTechnicalReviewActionItem(createProps);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '결함대장 추가 오류',
        text: res.message || '결함대장 추가에 실패했습니다.'
      })
      return
    }
    Swal.fire({
      icon: 'success',
      title: '결함대장 추가 성공',
      text: '결함대장에 추가되었습니다.'
    });
    setSelectedActionItemList(() => [])
  }

  return (
    <React.Fragment>
      <Button onClick={handleOpen} disabled={disabled}>상세보기</Button>

      { selected_review_id && <Modal isOpen={isOpen} size="xl">
        <Modal.Head>상세내용(SRR 검토회의)</Modal.Head>
        <Modal.Body>
					{ // 데이터 조회 이후 렌더링
						managData && 
						<Tabs defaultTab="개요">

							<Tabs.Tab label="개요">
								<div className="p-1.5 grid grid-cols-1 grid-flow-row gap-3">
									{/* 구분 */}
									<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
										<div className="lg:col-span-2">구분*</div>
										<div className="lg:col-span-3">
											<Input defaultValue="사업관리회의" disabled />
										</div>
										<div className="lg:col-span-3">
											<Input defaultValue={GetTechnicalNameByClassification(managData.review_category)} disabled />
										</div>
									</div>
									{/* 검토 이름 */}
									<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
										<div className="lg:col-span-2">검토 이름*</div>
										<div className="lg:col-span-6">
											<Input defaultValue={managData.review_name} disabled />
										</div>
									</div>
									{/* 검토 설명 */}
									<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
										<div className="lg:col-span-2">검토 설명</div>
										<div className="lg:col-span-6">
											<Input defaultValue={managData.review_description} disabled />
										</div>
									</div>
									{/* 시작 예정일 */}
									<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
										<div className="grid grid-cols-8 col-span-8">
											<div className="lg:col-span-2">시작 예정일</div>
											<Input className="lg:col-span-6" type="date" defaultValue={new Date(managData.review_start_date).toISOString().split('T')[0]} disabled/>
										</div>
										<div className="grid grid-cols-8 col-span-8">
											<div className="lg:col-span-2">종료 예정일</div>
											<Input className="lg:col-span-6" type="date" defaultValue={new Date(managData.review_end_date).toISOString().split('T')[0]} disabled/>
										</div>
									</div>
									{/* 참석자 */}
									<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
										<div className="lg:col-span-2">참석자*</div>
										<div className="lg:col-span-6">
											<Input defaultValue={managData.review_participants.map((review_participant) => review_participant.participant_user_id)} disabled />
										</div>
									</div>
									{/* 관련 회의 */}
									<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-start">
										<div className="lg:col-span-2">관련회의</div>
										<div className="lg:col-span-6 space-y-2">
											<div>
											</div>
											<div className="grid lg:grid-cols-2 grid-flow-row gap-2">
												{
													managData.review_meetings && managData.review_meetings.map((review_meeting, index) => {
														return (
															<Input key={index} defaultValue={review_meeting.meeting_name} disabled/>
														)
													})
												}
											</div>
										</div>
									</div>
								</div>
							</Tabs.Tab>


							<Tabs.Tab label="검토 대상">
								<div className="space-y-3 mt-3 mb-9 overflow-x-auto relative pb-16">
								  <PanelContainer>
								    <PanelHeader>산출물 목록</PanelHeader>
								    <PanelBody>
									    { // 산출물 버전 목록
										    managData && managData.review_id && 
										    <table className="table w-full h-full table-border">
											    <thead className="whitespace-nowrap">
												    <tr>
													    <th>선택</th>
													    <th>산출물 종류</th>
													    <th>파일명</th>
													    <th>업로드 일시</th>
												    </tr>
											    </thead>
											    <tbody>
												    {managData.review_outputs && managData.review_outputs.map((productManagementItem, index) => (
													    <tr key={index}>
														    <td>
															    <Input.Checkbox 
																    name="checkbox" 
																    value={productManagementItem.review_output_id} 
																    id={productManagementItem.review_output_id.toString()} />
															    </td>
														    <td>{productManagementItem.std_output_name}</td>
														    <td>{productManagementItem.output_content_file}</td>
														    <td>{new Date(productManagementItem.output_content_update_date).toLocaleString()}</td>
													    </tr>
												    ))}
											    </tbody>
										    </table>
									    }
								    </PanelBody>
								  </PanelContainer>
								  <PanelContainer>
								    <PanelHeader>요구사항 목록</PanelHeader>
								    <PanelBody>
									    { // 요구사항 버전 목록 
										    managData && managData.baseline_id && 
										    <table className="table w-full h-full table-border">
											    <caption className="text-start"></caption>
											    <thead className="whitespace-nowrap">
												    <tr>
													    <th>선택</th>
													    <th>버전</th>
												    </tr>
											    </thead>
											    <tbody>
												    <tr>
													    <td> 
														    <Input.Checkbox
															    id={managData.baseline_id.toString()}
														    /> 
													    </td>
													    <td>{managData.baseline_number}</td>
												    </tr>
											    </tbody>
										    </table>
									    }
								    </PanelBody>
								  </PanelContainer>
									<PanelContainer>
									  <PanelHeader>소스코드 목록</PanelHeader>
									  <PanelBody>
									    { // 소스코드 버전 목록
										    managData && managData.src_version_id &&
										    <table className="table w-full h-full table-border">
											    <caption className="text-start"></caption>
											    <thead className="whitespace-nowrap">
												    <tr>
													    <th>선택</th>
													    <th>소스코드 명칭</th>
												    </tr>
											    </thead>
											    <tbody>
												    <tr>
													    <td>
														    <Input.Radio 
															    name="radio" 
															    id={managData.src_version_id.toString()} />
													    </td>
													    <td>{managData.src_version_name}</td>
											    </tr>
											    </tbody>
										    </table>
									    }
									  </PanelBody>
									</PanelContainer>
                { managData && <UpdateCase4TechnicalModal 
                  project_id={project_id}
                  selected_review_id={selected_review_id}
                  review_outputs={managData.review_outputs.map((review_output) => review_output.review_output_id)}
                  baseline_id={managData.baseline_id}
                  src_version_id={managData.src_version_id}
                  handleGetRemote={getDetailData}
                /> }
								</div>
							</Tabs.Tab>
							

							<Tabs.Tab label="회의자료 및 회의록">
								<div className="space-y-3 mt-3 mb-9 overflow-x-auto">
								  <PanelContainer>
								    <PanelHeader>
								      <div className="flex flex-wrap justify-end w-full items-center gap-3">
								        <Button onClick={handleDownloadReviewMaterialFile}>다운로드</Button>
								        <UploadReviewMaterialFilesModal 
								          review_id={selected_review_id}
								          review_file_is_material="true"
													getDetailData={getDetailData}
								        />
								      </div>
								    </PanelHeader>
								    <PanelBody>
									    {
										    managData.review_files && 
										    managData.review_files.filter((review_file) => review_file.review_file_is_material) &&
										    <table className="table table-border w-full">
												    <thead className="whitespace-nowrap">
													    <tr>
														    <th>선택</th>
														    <th>파일명</th>
														    <th>업로드 일시</th>
														    <th>올린이</th>
													    </tr>
												    </thead>
												    <tbody>
													    { managData.review_files.filter((review_file) => review_file.review_file_is_material).map((review_file) => (
														    <tr key={review_file.review_file_id}>
															    <td>
															      <Input.Radio
															        name="material_radio"
															        value={review_file.review_file_id}
															        onChange={handleChangeReviewMaterialRadio}
															        checked={selectedReviewMaterialId === review_file.review_file_id}
															      />
															    </td>
															    <td>{review_file.review_file_path}</td>
															    <td>{new Date(review_file.review_file_date).toLocaleString()}</td>
															    <td>{review_file.review_file_user_id}</td>
														    </tr>
													    )) }
												    </tbody>
										    </table>
									    }
								    </PanelBody>
								  </PanelContainer>
								  <PanelContainer>
								    <PanelHeader>
								      <div className="flex flex-wrap justify-end w-full items-center gap-3">
								        <Button onClick={handleDownloadReviewMaterialFile}>다운로드</Button>
								        <UploadReviewMaterialFilesModal 
								          review_id={selected_review_id}
								          review_file_is_material="false"
													getDetailData={getDetailData}
								        />
								      </div>
								    </PanelHeader>
								    <PanelBody>
									    {
										    managData.review_files && 
										    managData.review_files.filter((review_file) => !review_file.review_file_is_material) && 
										    <table className="table table-border w-full">
												    <thead className="whitespace-nowrap">
													    <tr>
														    <th>선택</th>
														    <th>파일명</th>
														    <th>업로드 일시</th>
														    <th>올린이</th>
													    </tr>
												    </thead>
												    <tbody>
													    { managData.review_files.filter((review_file) => !review_file.review_file_is_material).map((review_file) => (
														    <tr key={review_file.review_file_id}>
															    <td>
															      <Input.Radio
															        name="material_radio"
															        value={review_file.review_file_id}
															        onChange={handleChangeReviewMaterialRadio}
															        checked={selectedReviewMaterialId === review_file.review_file_id}
															      />
															    </td>
															    <td>{review_file.review_file_path}</td>
															    <td>{new Date(review_file.review_file_date).toLocaleString()}</td>
															    <td>{review_file.review_file_user_id}</td>
														    </tr>
													    )) }
												    </tbody>
										    </table>
									    }
								    </PanelBody>
								  </PanelContainer>
								</div>
							</Tabs.Tab>


							<Tabs.Tab label="Action Item">
								<div className="space-y-3 mt-3 mb-9 overflow-x-auto relative">
									<div className="flex flex-wrap justify-end gap-2 mt-2 sticky left-0">
										<Button onClick={handleAddActionItemRow}>행 추가</Button>
										<Button onClick={handleDeleteActionItemRow} disabled={selectedActionItemList.length < 1}>행 삭제</Button>
										<Button onClick={handleSaveActionItem}>저장</Button>
										<Button onClick={handleAddActionItemToDefectBook}>결함대장관리에 추가</Button>
									</div>
									<table className="table table-border w-full">
										<thead className="whitespace-nowrap">
											<tr>
												<th>선택</th>
												<th>Source</th>
												<th>설명</th>
												<th>상태</th>
												<th>제기자</th>
												<th>제기일자</th>
												<th>조치 담당자</th>
												<th>조치 계획</th>
												<th>조치 결과 확인</th>
												<th>조치 완료 예정 일자</th>
												<th>우선순위</th>
											</tr>
										</thead>
										<tbody>
											{
												managData.review_action_items && 
												managData.review_action_items.map((review_action_item) => (
													<tr key={review_action_item.review_action_item_id}>
														<td>
															{
																review_action_item.isNew ? 
																<X
																	className="text-red-500 font-bold text-lg mx-auto cursor-pointer"
																	name={review_action_item.review_action_item_id.toString()}
																	onClick={() => handleDeleteCreatedActionItem(review_action_item.review_action_item_id)}
																/>
																:
																<Input.Checkbox 
																	name="checkbox" 
																	value={review_action_item.review_action_item_id} 
																	id={review_action_item.review_action_item_id.toString()} 
																	onChange={handleChangeActionItemCheckbox}
																	checked={selectedActionItemList.includes(review_action_item.review_action_item_id)}
																	disabled={review_action_item.isNew}
																/>
															}
														</td>
														<td>
															<Input 
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_source')}
																value={review_action_item.issue_source}
															/>
														</td>
														<td>
															<Input
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_comment')}
																value={review_action_item.issue_comment}
															/>
														</td>
														<td>
															<Input.Select
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_state')}
																value={review_action_item.issue_state} // Open, Close
															>
																<Input.Option value={""}></Input.Option>
																<Input.Option value="Open">Open</Input.Option>
																<Input.Option value="Closed">Closed</Input.Option>
															</Input.Select>
														</td>
														<td>
															<Input.Select
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_reporter')}
																value={review_action_item.issue_reporter}
															>
																<Input.Option value={""}></Input.Option>
																{ meetingPeopleList && meetingPeopleList.map((people) => (
																	<Input.Option key={people.user_id} value={people.user_id}>{people.user_name}</Input.Option>
																)) }
															</Input.Select>
														</td>
														<td>{new Date(review_action_item.issue_report_date).toLocaleString()}</td>
														<td>
															<Input.Select
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_resolver')}
																value={review_action_item.issue_resolver}
															>
																<Input.Option value={""}></Input.Option>
																{ meetingPeopleList && meetingPeopleList.map((people) => (
																	<Input.Option key={people.user_id} value={people.user_id}>{people.user_name}</Input.Option>
																)) }
															</Input.Select>
														</td>
														<td>
															<Input
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_solution')}
																value={review_action_item.issue_solution}
															/>
														</td>
														<td>
															<Input.Checkbox
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_solv_is_appr')}
																checked={review_action_item.issue_solv_is_appr}
															/>
														</td>
														<td>
															<Input
																type="date"
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_solution_date')}
																value={review_action_item.issue_solution_date?.toString().split('T')[0]}
															/>
														</td>
														<td>
															
															<Input.Select
																onChange={(e) => handleChangeActionItem(e, review_action_item.review_action_item_id, 'issue_priority')}
																value={review_action_item.issue_priority}
															>
																<Input.Option value={0}></Input.Option>
																<Input.Option value={1}>high</Input.Option>
																<Input.Option value={2}>middle</Input.Option>
																<Input.Option value={3}>low</Input.Option>
															</Input.Select>
														</td>
													</tr>
												))
											}
										</tbody>
									</table>
								</div>
							</Tabs.Tab>
						</Tabs>
					}

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal> }

    </React.Fragment>
  )
}

export default ShowCase4DetailModal

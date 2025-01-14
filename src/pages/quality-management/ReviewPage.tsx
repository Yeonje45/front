// Technical : 기술검토 회의 Case 3 
// Another : 사업 관리 회의 Case 4 

import React from "react"
import Swal from 'sweetalert2'
import { useSelector } from "react-redux";

import Button from "tailwindElement/Button";
import Input from "tailwindElement/Input";
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'
import ShowCase3DetailModal from "components/quality-management/review/detail/ShowCase3DetailModal";
import ShowCase4DetailModal from "components/quality-management/review/detail/ShowCase4DetailModal";
import CreateCase4TechnicalModal from "components/quality-management/review/create/CreateCase4TechnicalModal"; 

import { RootState } from 'app/store';
import {
	GetManagReviewSelecteAll, IManagReviewModel,
  GetTechnicalNameByClassification, DeleteManagReview,
  UpdateManagReviewState
} from 'models/QualityManagement';
// SW 검토 페이지 
const ReviewPage = () => {
	const project = useSelector((state: RootState) => state.project.project);

	const [managReviewList, setManagReviewList] = React.useState<IManagReviewModel[] | null>(null);
	const [selectedMangReviewList, setSelectedMangReviewList] = React.useState<IManagReviewModel[] | null>(null);

	React.useEffect(() => {
		getManagReviewList();
	}, [])

	/* 검토항목 목록조회 */
	const getManagReviewList = async (): Promise<void> => {
		const res = await GetManagReviewSelecteAll({project_id: project.project_id});
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '검토항목 목록조회 오류',
				text: res.message || '프로젝트 검토항목 목록조회에 실패했습니다.',
			})
			return;
		}
		setManagReviewList(res.data);
	}

	/** Checkbox 클릭 시에 발생하는 이벤트 핸들러 함수
	 *  - 기존에 존재하는 선택된 항목을 선택하면 선택된 항목을 제거
	 *  - 기존에 존재하지 않는 항목을 선택하면 선택된 항목에 추가
	 */
	const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!managReviewList) { return }
		const review_id = +e.target.id;
		const selectedReview = managReviewList.find((item) => item.review_id === review_id);
		if (!selectedReview) { return }
		setSelectedMangReviewList((prev) => {
			if (!prev) { return [selectedReview] }
			const isExist = prev.some((item) => item.review_id === review_id);
			if (isExist) {
				return prev.filter((item) => item.review_id !== review_id);
			} else {
				return [...prev, selectedReview];
			}
		})

	}

  // 검토항목 검토 삭제 
  const handleDeleteReview = async () => {
    if (!selectedMangReviewList || selectedMangReviewList.length > 1) {
      Swal.fire({
        icon: 'warning',
        title: '검토항목 삭제 오류',
        text: '선택된 검토항목이 없습니다.',
      })
      return
    }
    const isConfirm = await Swal.fire({
      icon: 'question',
      title: '검토항목 삭제',
      text: '선택된 검토항목을 삭제하시겠습니까?',
      showCancelButton: true,
    })
    if (!isConfirm.isConfirmed) { return }
    const res = await DeleteManagReview({review_id: selectedMangReviewList[0].review_id});
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '검토항목 삭제 오류',
        text: res.message || '검토항목 삭제에 실패했습니다.',
      })
      return
    }
    await Swal.fire({
      icon: 'success',
      title: '검토항목 삭제 성공',
      text: '검토항목이 삭제되었습니다.',
    })
    await getManagReviewList();
    setSelectedMangReviewList(null);
    return
  };

  // 검토 상태 변경 시에 발생하는 이벤트 핸들러 함수
  const handleChangeReviewState = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const review_id = +e.target.name;
    const state = e.target.value;

    const res = await UpdateManagReviewState({review_id, review_state: state});
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '검토 상태 변경 오류',
        text: res.message || '검토 상태 변경에 실패했습니다.',
      })
      return
    }
    await getManagReviewList();
    return
  }

  return (
		<div className="container px-4 mx-auto">
			<PanelContainer>
				<PanelHeader title="SW검토"/>
				<PanelBody className="space-y-3">

					{/* Button Wrapper */}
					<div className="flex flex-wrap justify-between gap-3">
						<div className="space-x-3">
							<CreateCase4TechnicalModal 
							  project_id={project.project_id}
							  originReviewList={managReviewList}
							  handleGetRemoteData={getManagReviewList}
							/>
							<Button 
							  onClick={handleDeleteReview}
							  disabled={!selectedMangReviewList || selectedMangReviewList.length === 0 || selectedMangReviewList.length > 1}
							>검토 항목 삭제</Button>
						</div>
						<div>
						  {
                selectedMangReviewList && selectedMangReviewList.length === 1 && selectedMangReviewList[0].review_category === 'technical' &&
							  <ShowCase3DetailModal
								  project_id={project.project_id}
								  selected_review_id={selectedMangReviewList && selectedMangReviewList.length === 1 && selectedMangReviewList[0].review_id || null}
								  disabled={!selectedMangReviewList}
							  />
						  }
						  {
                selectedMangReviewList && selectedMangReviewList.length === 1 && selectedMangReviewList[0].review_category !== 'technical' &&
							  <ShowCase4DetailModal
								  project_id={project.project_id}
								  selected_review_id={selectedMangReviewList && selectedMangReviewList.length === 1 && selectedMangReviewList[0].review_id || null}
								  disabled={!selectedMangReviewList}
							  />
						  }
						</div>
					</div>
					
					{/* Table Wrapper */}
					<div className="w-full overflow-x-auto text-sm">
						<table className="table table-border w-full">
							<thead className="whitespace-nowrap">
								<tr>
									<th>선택</th>
									<th>구분</th>
									<th>검토 이름</th>
									<th>시작 일시</th>
									<th>종료 일시</th>
									<th>참석자</th>
									<th>검토 상태</th>
								</tr>
							</thead>
							<tbody>
								{
									managReviewList && managReviewList.length != 0 && managReviewList.map((managReviewItem) => (
										<tr key={managReviewItem.review_id}>
											<td><Input.Checkbox name="review_id" id={managReviewItem.review_id.toString()} onChange={handleCheckboxClick} /></td>
											<td>{GetTechnicalNameByClassification(managReviewItem.review_category)}</td>
											<td>{managReviewItem.review_name}</td>
											<td>{new Date(managReviewItem.review_start_date).toLocaleDateString()}</td>
											<td>{new Date(managReviewItem.review_end_date).toLocaleDateString()}</td>
											<td>{managReviewItem.review_participant}</td>
											<td>
											  <Input.Select value={managReviewItem.review_state} name={managReviewItem.review_id.toString()} onChange={handleChangeReviewState}>
                          <Input.Option value="Paused" defaultChecked>대기</Input.Option>
                          <Input.Option value="InProgress">진행중</Input.Option>
                          <Input.Option value="Completed">완료</Input.Option>
                        </Input.Select>
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				</PanelBody>
			</PanelContainer>
		</div>
  )
}

export default ReviewPage

import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import Input from 'tailwindElement/Input';
import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

import { RootState } from 'app/store';
import { 
  CreateDefectManagementLogModel, 
  GetMeetingPeopleList, IMeetingPeopleModel,
} from 'models/QualityManagement';

interface AddModalProps {
	content: string
	onCreateHandler: (defect: CreateDefectManagementLogModel) => void;
}

const AddModal = ({content, onCreateHandler}: AddModalProps) => {
	const project_state = useSelector((state: RootState) => state.project);

	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const [defect, setDefect] = React.useState<CreateDefectManagementLogModel>({
		issue_name: '',
		issue_source: '',
		issue_comment: '',
		issue_state: 'Open',
		issue_affected_doc: '',
		issue_resolver: '',
		issue_solution: '',
		issue_solv_is_appr: false,
		issue_solution_date: null,
		issue_priority: 1,
	})
  const [userList, setUserList] = React.useState<IMeetingPeopleModel[]>([]);

	React.useEffect(() => {
		if (isOpen) {
			setDefect({
				issue_name: '',
				issue_source: '',
				issue_comment: '',
				issue_state: 'Open',
				issue_affected_doc: '',
				issue_resolver: '',
				issue_solution: '',
				issue_solv_is_appr: false,
				issue_solution_date: null,
				issue_priority: 1,
			})
      getPeopleList();
		}
	}, [isOpen])

	const handleOpen = () => {
		setIsOpen(() => true);
	}

	const handleClose = () => {
		setIsOpen(() => false);
	}

  const getPeopleList = async () => {
    const res = await GetMeetingPeopleList({project_id : project_state.project.project_id});
    if (!res.success || !res.data) {
      Swal.fire({
        icon: 'error',
        title: '사용자 목록을 가져오는데 실패하였습니다.',
        text: res.message,
      });
      return
    }
    setUserList(res.data);
  }

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { id, value } = event.target;

		setDefect({
			...defect,
			[id]: value
		})
	}

	const handleonChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.currentTarget;

		setDefect({
			...defect,
			[name]: value
		})
	}

	/* 해결방안 승인 따로 개별 관리 Handler */
	const handleChangeSolutionApproval = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { id, value } = event.target;

		setDefect({
			...defect,
			[id]: value === '승인' ? true : false
		})
	}

	const onSubmit = () => {
		// 상태, 의견, Source 는 필수 입력 사항
			if (!defect.issue_state.length || !defect.issue_comment.length || !defect.issue_source.length) {
			Swal.fire({
				icon: 'error',
				title: '필수 입력 사항을 입력해주세요',
				text: '상태, 의견, Source는 필수 입력 사항입니다.'
			})
			return;
		}
		onCreateHandler(defect);
		handleClose();
	}

	return (
		<React.Fragment>
			<Button 
				variant="primary"
				onClick={handleOpen}>{content}</Button>

			<Modal size="md" isOpen={isOpen}>
				<Modal.Head>결함 추가</Modal.Head>
				<Modal.Body>
					<div 
						className="grid grid-cols-1 auto-rows-auto gap-3">
						{/* 식별자 & 상태 */}
						<div className="p-3 border border-gray-300 grid grid-cols-1 lg:grid-cols-2 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<label htmlFor="issue_name" className="me-auto text-start">
									식별자
								</label>
								<Input id="issue_name" onChange={handleOnChange} value={defect.issue_name}/>
							</div>
							<div className="text-start">
								<label htmlFor="issue_state" className="me-auto text-start">
									상태*
								</label>
								<Input.Select id="issue_state" onChange={handleOnChange} value={defect.issue_state}>
									<Input.Option value="Open" defaultChecked>Open</Input.Option>
									<Input.Option value="InProgress">In Progress</Input.Option>
									<Input.Option value="InReview">In Review</Input.Option>
									<Input.Option value="Rejected">Rejected</Input.Option>
									<Input.Option value="Resolved">Resolved</Input.Option>
									<Input.Option value="Closed">Closed</Input.Option>
									<Input.Option value="Reopened">Reopened</Input.Option>
								</Input.Select>
							</div>
						</div>

						{/* Source & 의견 */}
						<div className="p-3 border border-gray-300 grid grid-cols-1 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<label htmlFor="issue_source" className="me-auto text-start">
									Source*
								</label>
								<Input id="issue_source" onChange={handleOnChange} value={defect.issue_source}/>
							</div>
							<div className="text-start">
								<Input.Textarea name="issue_comment" rows={4} className="mb-3" label="의견*" onChange={handleonChangeTextArea} value={defect.issue_comment} />
							</div>
						</div>

						{/* 해결방안 & 영향받은 문서 & 해결방안 승인 */}
						<div className="p-3 border border-gray-300 grid grid-cols-1 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<Input.Textarea name="issue_solution" rows={4} className="mb-3" label="해결방안" onChange={handleonChangeTextArea} value={defect.issue_solution}/>
							</div>
							<div className="text-start">
								<label htmlFor="issue_affected_doc" className="me-auto text-start">영향받은 문서</label>
								<Input id="issue_affected_doc" onChange={handleOnChange} value={defect.issue_affected_doc}/>
							</div>
							<div className="text-start">
								<label htmlFor="issue_solv_is_appr" className="me-auto text-start">해결방안승인</label>
								<Input.Select id="issue_solv_is_appr" onChange={handleChangeSolutionApproval} value={defect.issue_solv_is_appr ? '승인' : '반려'} >
									<Input.Option value="승인">승인</Input.Option>
									<Input.Option value="반려" defaultChecked>반려</Input.Option>
								</Input.Select>
							</div>
						</div>

						{/* 결함 조치자 & 조치완료일자 */}
						<div className="p-3 border border-gray-300 grid grid-cols-1 lg:grid-cols-2 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<label htmlFor="issue_resolver" className="me-auto text-start">결함조치자</label>
								<Input.Select id="issue_resolver" onChange={handleOnChange} value={defect.issue_resolver}>
                  <Input.Option value="" defaultChecked>선택</Input.Option>
                  { userList.map((user, index) => (
                    <Input.Option key={index} value={user.user_id}>{user.user_name}</Input.Option>
                  ))}
								</Input.Select>
							</div>
							<div className="text-start">
								<label htmlFor="issue_report_date" className="me-auto text-start">
									조치완료일자
								</label>
								<Input 
								  type="date" 
								  id="issue_solution_date" 
								  onChange={handleOnChange} 
								  // defect 값 혹은 빈 값이 아니라 오늘 날짜로 설정
								  value={defect.issue_solution_date || new Date().toISOString().split('T')[0]}
								/>
							</div>
						</div>

						{/* 우선순위 */}
						<div className="w-1/2 text-start">
							<label htmlFor="issue_priority" className="me-auto text-start">우선순위</label>
							<Input.Select id="issue_priority" onChange={handleOnChange} value={defect.issue_priority}>
								<Input.Option value="1" defaultChecked>High</Input.Option>
								<Input.Option value="2">Medium</Input.Option>
								<Input.Option value="3">Low</Input.Option>
							</Input.Select>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={onSubmit}>확인</Button>
					<Button variant="secondary" onClick={handleClose}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default AddModal;

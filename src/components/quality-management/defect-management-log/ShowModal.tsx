import React from 'react';
import Swal from 'sweetalert2';

import Input from 'tailwindElement/Input';
import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

import { DefectManagementLogModel } from 'models/QualityManagement';

interface ShowModalProps {
	children: React.ReactNode;
	defectData: DefectManagementLogModel | null;
}

const ShowModal = ({children, defectData}: ShowModalProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const handleOpen = () => {
		if (!defectData) {
			Swal.fire({
				icon: 'error',
				title: '결함 데이터가 없습니다.',
				text: '결함 데이터를 불러오는 데 실패했습니다.'
			});
			return
		}
		setIsOpen(() => true);
	}

	const handleClose = () => {
		setIsOpen(() => false);
	}

	return (
		<React.Fragment>
			<button 
				className="text-blue-500 underline"
				onClick={handleOpen}>{children}</button>

			<Modal size="md" isOpen={isOpen}>
				<Modal.Head>결함 보기/편집</Modal.Head>
				<Modal.Body>
					{ defectData ?
					<div 
						className="grid grid-cols-1 auto-rows-auto gap-3">
						{/* 식별자 & 상태 */}
						<div className="p-3 border border-gray-300 grid grid-cols-2 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<label htmlFor="iden" className="me-auto text-start">식별자</label>
								<Input id="iden" disabled value={defectData.issue_name}/>
							</div>
							<div className="text-start">
								<label htmlFor="status" className="me-auto text-start">
									상태*
								</label>
								<Input.Select id="status" value={defectData.issue_state} disabled>
									<Input.Option value="open" defaultChecked>Open</Input.Option>
									<Input.Option value="inProgress">In Progress</Input.Option>
									<Input.Option value="inReview">In Review</Input.Option>
									<Input.Option value="resolved">Resolved</Input.Option>
									<Input.Option value="rejected">Rejected</Input.Option>
									<Input.Option value="closed">Closed</Input.Option>
									<Input.Option value="reopened">Reopened</Input.Option>
								</Input.Select>
							</div>
						</div>

						{/* Source & 의견 */}
						<div className="p-3 border border-gray-300 grid grid-cols-1 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<label htmlFor="source" className="me-auto text-start">
									Source*
								</label>
								<Input id="source" value={defectData.issue_source} disabled/>
							</div>
							<div className="text-start">
								<Input.Textarea id="opinion" rows={4} className="mb-3" label="의견*" disabled value={defectData.issue_comment}/>
							</div>
						</div>

						{/* 해결방안 & 영향받은 문서 & 해결방안 승인 */}
						<div className="p-3 border border-gray-300 grid grid-cols-1 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<Input.Textarea id="solve" rows={4} className="mb-3" label="해결방안" value={defectData.issue_solution} disabled/>
							</div>
							<div className="text-start">
								<label htmlFor="document" className="me-auto text-start">영향받은 문서</label>
								<Input id="document" value={defectData.issue_affected_doc} disabled/>
							</div>
						</div>

						{/* 결함 조치자 & 조치완료일자 */}
						<div className="p-3 border border-gray-300 grid grid-cols-2 gap-1 rounded-md bg-gray-50">
							<div className="text-start">
								<label htmlFor="fixer" className="me-auto text-start">결함조치자</label>
								<Input id="fixer" disabled value={defectData.issue_resolver}/>
							</div>
							<div className="text-start">
								<label htmlFor="comp_date" className="me-auto text-start">
									조치완료일자
								</label>
								<Input 
									type="date" 
									id="comp_date" 
									disabled 
									value={defectData.issue_solution_date || '0000-01-01'} 
								/>
							</div>
						</div>

						{/* 우선순위 */}
						<div className="w-1/2 text-start">
							<label htmlFor="rank" className="me-auto text-start">우선순위</label>
							<Input.Select id="rank" disabled value={defectData.issue_priority}>
								<Input.Option value="1" defaultChecked>High</Input.Option>
								<Input.Option value="2">Medium</Input.Option>
								<Input.Option value="3">Low</Input.Option>
							</Input.Select>
						</div>
					</div> : <></> }
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>확인</Button>
					<Button variant="secondary" onClick={handleClose}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default ShowModal;

import React from 'react';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

type Props = {
	baseline_id: number;
	baseline_state: string;
	aprHandler?: (data: Record<string, string>) => void;
	rjcHandler?: (data: Record<string, string>) => void;
}

const ReviewOutcomeFinalizationModal = ({ baseline_id, baseline_state, aprHandler, rjcHandler }: Props) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [submitData, setSubmitData] = React.useState<Record<string, string>>({
		src_version_id: `${baseline_id}`,
		approver_comment: '' ,
	});

	// 모달 On/Off 시에 데이터 초기화
	React.useEffect(() => {
		setSubmitData((prev) => ({
			src_version_id: `${baseline_id}`,
			approver_comment: '',
		}));
	}, [isModalOpen])

	const handleOpenModal = () => {
		setIsModalOpen(() => true);
	}

	const handleCloseModal = () => {
		setIsModalOpen(() => false);
	}
	
	/** comment 입력 값 Handle */
	const approveCommentHandler = async (event: React.ChangeEvent<HTMLTextAreaElement>): Promise<void> => {
		const { value } = event.target;
		setSubmitData((prev) => ({
			...prev,
			approver_comment: value,
		}));
	}


	/** 승인 
	 * 승인이면 state apr
	*/
	const handleApprove = async (): Promise<void> => {
		aprHandler && aprHandler(submitData);
		handleCloseModal()
	}

	/** 반려 
	 * 반려이면 state rjc
	*/
	const handleReject = async (): Promise<void> => {
		rjcHandler && rjcHandler(submitData);
		handleCloseModal()
	}

	return (
		<React.Fragment>
			<Button onClick={handleOpenModal} className="text-blue-500">승인/반려</Button>
			<Modal
				isOpen={isModalOpen}
				size="md"
			>
				<Modal.Head>승인/반려 검토 결과 확정</Modal.Head>
				<Modal.Body>
					<div className="w-full">
						<div className="flex flex-col w-full">
							<div className="w-full">
								<Input.Textarea rows={6} className="w-full" placeholder="검토자 의견을 입력하세요." onChange={approveCommentHandler} value={submitData['approver_comment']}/>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleApprove}>승인</Button>
					<Button variant="primary" onClick={handleReject}>반려</Button>
					<Button variant="secondary" onClick={handleCloseModal}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default ReviewOutcomeFinalizationModal;

import React from 'react';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

type Props = {
	btnContent: string;
}

const TestPlanTableActionModal = ({btnContent}: Props) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const handleIsOpen = (): void => {
		setIsOpen(prev => !prev);
		return;
	}

	const submitSaveHandler = async (): Promise<void> => {
		return
	}

	const submitDeleteHandler = async (): Promise<void> => {
		return
	}

	return (
		<div>
			<Button variant="primary" onClick={handleIsOpen}>{btnContent}</Button>

			<Modal isOpen={isOpen} size="sm">
				<Modal.Head>
					열 편집
				</Modal.Head>
				<Modal.Body>
					<div className="flex items-center justify-center mb-4 gap-2">
						<label className="text-center">이름</label>
						<div className="w-3/4">
							<Input/>
						</div>
					</div>
					<div className="flex justify-center mb-4 gap-2">
						<label className="text-center">설명</label>
						<div className="w-3/4">
							<Input.Textarea rows={4}/>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitSaveHandler}>저장</Button>
					<Button variant="primary" onClick={handleIsOpen}>취소</Button>
					<Button variant="secondary" onClick={submitDeleteHandler}>삭제</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default TestPlanTableActionModal

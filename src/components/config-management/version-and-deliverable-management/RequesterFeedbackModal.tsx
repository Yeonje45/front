import React from 'react';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

type Props = {
	children: React.ReactNode;
	content: string;
}

const RequesterFeedbackModal = ({ children, content }: Props) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

	const handleOpenModal = () => {
		setIsModalOpen(() => true);
	}

	const handleCloseModal = () => {
		setIsModalOpen(() => false);
	}

	return (
		<React.Fragment>
			<button onClick={handleOpenModal} className="text-blue-500 underline">{children}</button>
			<Modal
				isOpen={isModalOpen}
				size="md"
			>
				<Modal.Head>요청자 의견</Modal.Head>
				<Modal.Body>
					<div className="w-full">
						<div className="flex flex-col w-full">
							<div className="w-full">
								<Input.Textarea rows={6} className="w-full" value={content} disabled onChange={() => {}}/>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleCloseModal}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default RequesterFeedbackModal;

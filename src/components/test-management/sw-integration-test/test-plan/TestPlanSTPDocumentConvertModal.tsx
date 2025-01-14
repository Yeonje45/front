import React from 'react';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

type Props = {
	submitEditorContent: () => Promise<void>;
}

const TestPlanSTPDocumentConvertModal = ({submitEditorContent}: Props) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const handleIsOpen = (): void => {
		setIsOpen(prev => !prev);
		return;
	}

	return (
		<div className="w-full">
			<Button variant="primary" className="w-full" onClick={handleIsOpen}>STP 문서 변환</Button>

			<Modal isOpen={isOpen} size="sm">
				<Modal.Head>표 20 000 bps 에러정정 기능</Modal.Head>
				<Modal.Body>
					<table className="w-full table-border">
						<thead>
							<tr className="text-center">
								<th>항목</th>
								<th>설명</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>시험 목적</td>
								<td>특정 전송속도에서의 에러 정정기능 확인</td>
							</tr>
							<tr>
								<td>...</td>
								<td>...</td>
							</tr>
						</tbody>
					</table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleIsOpen}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)

}

export default TestPlanSTPDocumentConvertModal

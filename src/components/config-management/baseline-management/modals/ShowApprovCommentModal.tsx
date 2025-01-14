import React from 'react'

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

interface IProps {
  comment: string | null
}

const ShowApproveCommentModal = ({comment}: IProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const handleOpen = () => {
		setIsOpen(() => true)
	}

	const handleClose = () => {
		setIsOpen(() => false)
	}
  
	return (
		<React.Fragment>
			<Button onClick={handleOpen}>검토자 의견</Button>

			<Modal isOpen={isOpen} size="sm">
				<Modal.Head>검토자 의견</Modal.Head>

				<Modal.Body>
          <label htmlFor="comment">검토자 의견</label>
          <Input.Textarea rows={5} disabled placeholder={comment || "검토자 의견이 없습니다."} />
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={handleClose}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default ShowApproveCommentModal

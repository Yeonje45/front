import React from 'react'

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

interface IReviewDeleteModalProps {
  handleApproval: (conf_version_approval_comment: string) => void
  handleReject: (conf_version_reject_comment: string) => void
}

// selectedSidebarDetailStatusData가 rqt면 disabled
const ReviewDeleteModal = ({handleApproval, handleReject}: IReviewDeleteModalProps) => {
	const [data, setData] = React.useState<Record<string, string>>({
		comment: '',
	})
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const handleOpen = () => {
		setData(() => ({
			comment: '',
		}))
		setIsOpen(() => true)
	}

	const handleClose = () => {
		setIsOpen(() => false)
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target
		setData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

  const submitApprovalHandler = () => {
    if (!data['comment']) {
      return
    }
    handleApproval(data['comment'])
    handleClose()
  }

  const submitRejectHandler = () => {
    if (!data['comment']) {
      return
    }
    handleReject(data['comment'])
    handleClose()
  }

	return (
		<React.Fragment>
			<Button onClick={handleOpen}>삭제 요청 검토</Button>

			<Modal isOpen={isOpen} size="md">
				<Modal.Head>삭제 요청 검토</Modal.Head>
				<Modal.Body>
					<div>
						<label htmlFor="comment" >의견 작성</label>
						<Input.Textarea 
							rows={5}
							type="text" 
							name="comment"
							placeholder="삭제 요청 사유를 입력하세요." 
							value={data.conf_version_request_comment}
							onChange={handleChange}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={submitApprovalHandler}>승인</Button>
					<Button onClick={submitRejectHandler}>반려</Button>
					<Button onClick={handleClose}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default ReviewDeleteModal

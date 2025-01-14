import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

interface IRequestReviewModalProps {
  handleApproval: (conf_version_approval_comment: string) => void
  handleReject: (conf_version_approval_comment: string) => void
}

const RequestReviewModal = ({handleApproval, handleReject}: IRequestReviewModalProps) => {
	const [data, setData] = React.useState<Record<string, string>>({
    conf_version_approval_comment: ''
	})
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const handleOpen = () => {
		setData(() => ({
			conf_version_approval_comment: '',
		}))
		setIsOpen(() => true)
	}

	const handleClose = () => {
		setIsOpen(() => false)
	}
	
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

  const submitApprovalHandler = () => {
    if (!data['conf_version_approval_comment']) {
			Swal.fire({
				icon: 'error',
				title: '승인 요청',
				text: '의견을 작성해주세요.',
			})
      return
    }
    handleApproval(data['conf_version_approval_comment'])
    handleClose()
  }

  const submitRejectHandler = () => {
    if (!data['conf_version_approval_comment']) {
			Swal.fire({
				icon: 'error',
				title: '승인 요청',
				text: '의견을 작성해주세요.',
			})
      return
    }
    handleReject(data['conf_version_approval_comment'])
    handleClose()
  }

  return (
		<React.Fragment>
			<Button onClick={handleOpen}>승인 요청 검토</Button>

			<Modal isOpen={isOpen} size="md">
				<Modal.Head>승인 요청</Modal.Head>

				<Modal.Body>
          <label htmlFor='conf_version_approval_comment'>의견 작성</label>
          <Input.Textarea
            name="conf_version_approval_comment"
            value={data['conf_version_approval_comment']}
            onChange={handleChange}
            rows={5}
          />
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

export default  RequestReviewModal 

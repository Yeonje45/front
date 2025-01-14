import React from 'react'

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

interface IApprovalRequestModalProps {
	handleApprovalRequest: (data: Record<string, string>) => void
	selectedSidebarDetailStatusData: string | null
}

// selectedSidebarDetailStatusData가 rqt면 disabled
const ApprovalRequestModal = ({handleApprovalRequest, selectedSidebarDetailStatusData}: IApprovalRequestModalProps) => {
	const [data, setData] = React.useState<Record<string, string>>({
		conf_version_request_comment: '',
	})
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const handleOpen = () => {
		setData(() => ({
			conf_version_request_comment: '',
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

	const handleSubmit = () => {
		handleApprovalRequest(data)
		handleClose()
	}

	return (
		<React.Fragment>
			<Button onClick={handleOpen} disabled={selectedSidebarDetailStatusData == 'rqt'}>승인 요청</Button>

			<Modal isOpen={isOpen} size="md">
				<Modal.Head>승인 요청</Modal.Head>
				<Modal.Body>
					<div>
						<label htmlFor="conf_version_request_comment" >의견 작성</label>
						<Input.Textarea 
							rows={5}
							type="text" 
							name="conf_version_request_comment"
							placeholder="승인 요청 사유를 입력하세요." 
							value={data.conf_version_request_comment}
							onChange={handleChange}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleSubmit}>확인</Button>
					<Button onClick={handleClose}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default ApprovalRequestModal

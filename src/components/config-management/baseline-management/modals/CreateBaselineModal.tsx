import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

interface CreateBaselineModalProps {
	handleBaselineCreateRequest: (data: Record<string, string>) => void
	nameList: string[]
}

const CreateBaselineModal = ({handleBaselineCreateRequest, nameList}: CreateBaselineModalProps) => {
	const [data, setData] = React.useState<Record<string, string>>({
		conf_base_name: '',
		conf_base_comment: '',
	})
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const handleOpen = () => {
		setData(() => ({
			conf_base_name: '',
			conf_base_comment: '',
		}))
		setIsOpen(() => true)
	}

	const handleClose = () => {
		setIsOpen(() => false)
	}
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async () => {
		if (data['conf_base_name'] === '') {
			Swal.fire({
				icon: 'error',
				title: '베이스라인 명칭을 입력해주세요.',
			})
			return
		}
		if (data['conf_base_comment'] === '') {
			Swal.fire({
				icon: 'error',
				title: '베이스라인 설명을 입력해주세요.',
			})
			return
		}
		if (nameList && nameList.includes(data['conf_base_name'])) {
			Swal.fire({
				icon: 'error',
				title: '이미 존재하는 베이스라인 명칭입니다.',
			})
			return
		}
		handleBaselineCreateRequest(data)
		handleClose()
	}

	return (
		<React.Fragment>
			<Button onClick={handleOpen}>생성</Button>

			<Modal isOpen={isOpen} size="sm">
				<Modal.Head>베이스라인 생성</Modal.Head>

				<Modal.Body>
					<div className='grid grid-cols-1 grid-rows-2 gap-3'>
						<div className="grid grid-cols-1 grid-rows-2">
							<label htmlFor='conf_base_name'>베이스라인 명칭</label>
							<Input 
								name="conf_base_name"
								value={data['conf_base_name']}
								onChange={handleChange}
							/>
						</div>
						<div className="grid grid-cols-1 grid-rows-2">
							<label htmlFor='conf_base_comment'>베이스라인 설명</label>
							<Input 
								name="conf_base_comment"
								value={data['conf_base_comment']}
								onChange={handleChange}
							/>
						</div>
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

export default CreateBaselineModal 

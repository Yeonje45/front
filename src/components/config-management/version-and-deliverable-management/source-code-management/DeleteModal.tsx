import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

import { 
	ISourceCodeManagementModel, 
	IDeleteSurceCodeManagementTableDataParams 
} from 'models/ConfigManagement'

interface IDeleteModalProps {
	selectedRowData: ISourceCodeManagementModel | null
	deleteSourceCodeManagementTableDataHandler: ({ src_version_id, src_version_status }: IDeleteSurceCodeManagementTableDataParams) => Promise<void>
}

const DeleteModal = ({ selectedRowData, deleteSourceCodeManagementTableDataHandler }: IDeleteModalProps) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

	const handleOpenModal = () => {
		if (!selectedRowData) {
			Swal.fire({
				icon: 'error',
				title: '선택된 행이 없습니다.',
				text: '행을 선택해주세요.'
			})
			return
		}

		setIsModalOpen(() => true);
	}

	const handleCloseModal = () => {
		setIsModalOpen(() => false);
	}

	const submitHandler = async (): Promise<void> => {
		if (!selectedRowData) {
			await Swal.fire({
				icon: 'error',
				title: '선택된 행이 없습니다.',
				text: '행을 선택해주세요.'
			})
			return
		}
		
		const checkDel = await Swal.fire({
			title: '삭제 요청',
			text: '삭제 요청을 진행하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '확인',
			cancelButtonText: '취소'
		}).then(async (result) => {
			return result.isConfirmed
		})
		if (!checkDel) {
			return
		}

		await deleteSourceCodeManagementTableDataHandler({
			src_version_id: selectedRowData.src_version_id,
			src_version_status: 'drq'
		})
		handleCloseModal()
	}

	return (
		<React.Fragment>
			<Button variant="primary" onClick={handleOpenModal} disabled={selectedRowData?.src_version_status == 'drq' || selectedRowData?.src_version_status == 'del'}>삭제</Button>

			<Modal
				isOpen={isModalOpen}
				size="md"
			>
				<Modal.Head>삭제 확인 검토 요청</Modal.Head>
				<Modal.Body>
					<p>해당 소스코드는 검토후에 삭제됩니다.</p>
					<p>계속 진행하시겠습니까?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitHandler}>확인</Button>
					<Button variant="primary" onClick={handleCloseModal}>취소</Button>
				</Modal.Footer>
			</Modal>

		</React.Fragment>
	)
}

export default DeleteModal

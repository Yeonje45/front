import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from "react-redux"

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import AddPanel from 'components/config-management/version-and-deliverable-management/source-code-management/AddPanel';

import { IAddSourceCodeManagementTableDataParams } from 'models/ConfigManagement'
import { RootState } from "app/store"

interface IAddModalProps {
	addSourceCodeManagementTableDataHandler: (data: IAddSourceCodeManagementTableDataParams) => Promise<void>
}

const AddModal = ({ addSourceCodeManagementTableDataHandler}: IAddModalProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
 
	const handleOpenModal = () => {
		setIsModalOpen(() => true);
	}

	const handleCloseModal = () => {
		setIsModalOpen(() => false);
	}

	/** 저장 버튼 클릭 시에 */
	const submitHandler = async (data: Record<string, string | boolean | File>): Promise<void> => {
		const submitData: IAddSourceCodeManagementTableDataParams = {
			project_id: project.project_id,
			src_version_name: data.src_version_name as string,
			file: data.file as File,
			src_version_content: data.src_version_content as string,
		}


		await addSourceCodeManagementTableDataHandler(submitData)
		handleCloseModal();
	}
	
  return (
		<React.Fragment>
			<Button variant="primary" onClick={handleOpenModal}>등록</Button>

			<Modal
				isOpen={isModalOpen}
				size="lg"
			>
				<Modal.Head>소스코드 등록</Modal.Head>
				<Modal.Body>
					<AddPanel 
						modalState={isModalOpen}
						submitHandler={submitHandler}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleCloseModal}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
  )
}

export default AddModal


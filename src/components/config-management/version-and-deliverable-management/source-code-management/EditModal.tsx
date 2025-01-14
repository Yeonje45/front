import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import EditPanel from 'components/config-management/version-and-deliverable-management/source-code-management/EditPanel';

import {} from 'models/ConfigManagement';

import { 
	ISourceCodeManagementModel, 
	IGetSourceCodeManagementTableEditFileListDataModel,
	GetSourceCodeManagementTableEditFileListData,
} from 'models/ConfigManagement'

interface IEditModalProps {
	selectedRowData: ISourceCodeManagementModel | null
	editSourceCodeManagementTableDataHandler: (del_file_ids: number[], src_file_list: { src_file_id: number, src_file_content: string }[] | null) => Promise<void>
}

const EditModal = ({ selectedRowData, editSourceCodeManagementTableDataHandler }: IEditModalProps) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [files, setFiles] = React.useState<IGetSourceCodeManagementTableEditFileListDataModel[] | null>(null);
 
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
		getFilesHandler();
	}

	const handleCloseModal = () => {
		setIsModalOpen(() => false);
	}

	/** 파일 목록 조회 */
	const getFilesHandler = async (): Promise<void> => {
		if (!selectedRowData) {
			Swal.fire({
				icon: 'error',
				title: '선택된 행이 없습니다.',
				text: '행을 선택해주세요.'
			})
			return
		}

		const res = await GetSourceCodeManagementTableEditFileListData({ src_version_id: selectedRowData.src_version_id });
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '파일 목록 조회 실패',
				text: res.message
			})
			return
		}

		if (res.data) { 
			setFiles(() => res.data);
		}
		return
	}

	/** 테이블 삭제 버튼 클릭 시에 사용 
	 * 저장 버튼을 누르기 전까지는 Filter 
	 */
	const filterDelteFiles = (file: number[]): void => {
		setFiles((prev) => {
			if (!prev) return null;
			const filteredFiles = prev.filter((prevFile) => !file.includes(prevFile.src_file_id));
			return filteredFiles;
		})
	}

	/** 저장 버튼 클릭 시에 */
	const submitHandler = async (filteredFiles: number[], editedComment: { src_file_id: number, src_file_content: string }[] | null): Promise<void> => {
		// editedComment 안에 filteredFiles가 포함되어 있으면 삭제
		const filteredEditedComment = editedComment?.filter((comment) => !filteredFiles.includes(comment.src_file_id));

		const check = await Swal.fire({
			title: '편집',
			text: '편집을 진행하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '확인',
			cancelButtonText: '취소'
		}).then(async (result) => {
			return result.isConfirmed
		})

		if (!check) {
			return
		}

		await editSourceCodeManagementTableDataHandler(filteredFiles, filteredEditedComment || []);
		handleCloseModal()
	}
	
  return (
		<React.Fragment>
			<Button variant="primary" onClick={handleOpenModal}>편집</Button>

			<Modal
				isOpen={isModalOpen}
				size="lg"
			>
				<Modal.Head>소스코드 편집</Modal.Head>
				<Modal.Body>
					{ selectedRowData && 
						<EditPanel 
							modalState={isModalOpen}
							src_version_name={selectedRowData.src_version_name}
							src_version_content={selectedRowData.src_version_content}
							files={files}
							filterDelteFiles={filterDelteFiles}
							submitHandler={submitHandler} />
					}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleCloseModal}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
  )
}

export default EditModal


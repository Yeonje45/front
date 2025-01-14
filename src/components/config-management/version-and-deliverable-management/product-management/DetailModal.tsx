import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

import { GetProductManagementTableDetailData, IProductManagementTableDetailModel } from 'models/ConfigManagement';

interface IDetailModalProps {
	output_version_id: number | null;
}

const DetailModal = ({output_version_id}: IDetailModalProps) => {
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [detailData, setDetailData] = React.useState<IProductManagementTableDetailModel[] | null>(null);

	React.useEffect(() => {
		if (isModalOpen) {
			getDetailDataHandler();
		}
	}, [isModalOpen])

	const handleOpenModal = () => {
		if (!output_version_id) {
			Swal.fire({
				icon: 'error',
				title: '오류',
				text: '상세 정보를 불러오는데 오류가 발생했습니다.'
			})
			return;
		}

		setIsModalOpen(() => true);
	}

	const handleCloseModal = () => {
		setIsModalOpen(() => false);
	}

	const getDetailDataHandler = async (): Promise<void> => {
		if (!output_version_id) {
			return
		}

		const res = await GetProductManagementTableDetailData(output_version_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '상세 정보 조회 실패',
				text: res.message
			})
		}

		if (!res.data) {
			return 
		}

		console.log(res.data)
		setDetailData(() => res.data)
		return
	}

	return (
		<React.Fragment>
			<Button variant="primary" onClick={handleOpenModal}>자세히</Button>
			<Modal
				isOpen={isModalOpen}
				size="sm"
			>
				<Modal.Head>자세히</Modal.Head>
				<Modal.Body>
					<div className="overflow-x-auto max-h-[400px]">
						<table className="table w-full table-border">
							<thead className="whitespace-nowrap">
								<tr>
									<th>상세업무</th>
									<th>장절</th>
									<th>변경사항</th>
								</tr>
							</thead>
							<tbody>
								{ detailData && detailData.length && detailData.map((data, index) => (
									<tr key={index}>
										<td>{data.output_content_name}</td>
										<td>{data.output_content_chapter}</td>
										<td>{data.output_content_work}</td>
									</tr>
									))}
							</tbody>
						</table>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleCloseModal}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default DetailModal;

import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

import { IBaselineManagementSidebarModel, IBaselineManagementSidebarDestailModel } from 'models/ConfigManagement';

interface IDeleteBaselineModalProps {
  baselineData: IBaselineManagementSidebarModel[] | null
  handleBaselineDeleteRequest: (conf_base_id: number, conf_base_detail_id: number, isDeleteAll: boolean, conf_version_request_comment: string) => Promise<void>
}

const DeleteBaselineModal = ({baselineData, handleBaselineDeleteRequest}: IDeleteBaselineModalProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const [data, setData] = React.useState<Record<string, string>>({
    conf_base_id: "",
    conf_base_detail_id: "",
	  conf_version_request_comment: "",
	})
  const [selectedBaselineDetails, setSelectedBaselineDetails] = React.useState<IBaselineManagementSidebarDestailModel | null>(null)
  const [isDeleteAll, setIsDeleteAll] = React.useState<boolean>(false)

	const handleOpen = () => {
    if (!baselineData) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '베이스라인 ID가 없습니다.',
      })
      return
    }
		setData(() => ({
      conf_base_id: "",
      conf_version_request_comment: "",
		}))
		setSelectedBaselineDetails(() => null)
    setIsDeleteAll(() => false)
		setIsOpen(() => true)
	}

  const handleChangeBaseline = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
    const baselineDetails = baselineData?.find((baseline) => baseline.conf_base_id === +value)?.baseline_details
    if (!baselineDetails) {
      setSelectedBaselineDetails(() => null)
      return
    }
    const lastBaselineDetail = baselineDetails.reduce((prev, current) => (prev.conf_base_detail_id > current.conf_base_detail_id) ? prev : current)
    setData((prev) => ({
      ...prev,
      ['conf_base_detail_id']: lastBaselineDetail.conf_base_detail_id.toString(),
    }))
    setSelectedBaselineDetails(() => lastBaselineDetail)
  }

  const handleChangeBaselineDetail = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

	const handleClose = () => {
		setIsOpen(() => false)
	}

  // 전체 삭제이면: conf_base_id와 의견 주기
  // 마지막 버전 삭제이면: conf_base_detail_id와 의견 주기
  const handleSubmit = () => {
    if (data['conf_base_id'] === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '베이스라인 ID를 선택해주세요.',
      })
      return
    }
    handleBaselineDeleteRequest(+data['conf_base_id'], +data['conf_base_detail_id'], isDeleteAll, data['conf_version_request_comment'])
    handleClose()
  }

  return (
		<React.Fragment>
			<Button onClick={handleOpen}>삭제</Button>

			<Modal isOpen={isOpen} size="sm">
				<Modal.Head>베이스라인 삭제 요청</Modal.Head>

				<Modal.Body>
				  <div>
            <label htmlFor='conf_base_id'>베이스라인 선택</label>
            <Input.Select name="conf_base_id" onChange={handleChangeBaseline} value={data.conf_base_id}>
              <Input.Option value="" defaultChecked></Input.Option>
              { 
                baselineData && 
                baselineData.length !== 0 &&  // 기준기능선이라는 이름은 안 나오게 필터, 개발기준선은 안 나오게 필터, 형상 기준선은 안 나오게 필터
                baselineData.filter((conf_base_item) => conf_base_item.conf_base_name !== '기능기준선' && conf_base_item.conf_base_name !== '개발기준선' && conf_base_item.conf_base_name !== '제품기준선').map((conf_base_item) => (
                  <Input.Option key={conf_base_item.conf_base_id} value={conf_base_item.conf_base_id}>{conf_base_item.conf_base_name}</Input.Option>
                ))
              }
            </Input.Select>
				  </div>
				  <div>
            <label htmlFor='conf_base_detail_id'>베이스라인 버전</label>
            <Input.Select name="conf_base_detail_id" onChange={handleChangeBaselineDetail} value={data.conf_base_detail_id} disabled>
              <Input.Option value="" defaultChecked></Input.Option>
              { selectedBaselineDetails && 
                <Input.Option key={selectedBaselineDetails.conf_base_detail_id} value={selectedBaselineDetails.conf_base_detail_id}>v{selectedBaselineDetails.conf_version_name}</Input.Option>
              }
            </Input.Select>
            <div className="flex items-center gap-3 mt-3">
              <label htmlFor='isDeleteAll'>베이스라인 전체 삭제 요청</label>
              <input type="checkbox" name="isDeleteAll" onChange={() => setIsDeleteAll((prev) => !prev)} checked={isDeleteAll} />
            </div>
				  </div>
				  <div>
				    <label htmlFor='conf_version_request_comment'>삭제 요청자 의견</label>
				    <Input.Textarea name="conf_version_request_comment" rows={4} onChange={handleChangeComment} value={data.conf_version_request_comment} />
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

export default DeleteBaselineModal

import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import {
  UploadBusinessReviewCase4MeetingFile,
} from 'models/QualityManagement';

interface IProps {
  review_id: number;
  review_file_is_material: "true" | "false"; // "true": 회의자료 / "false": 회의록 ( String Type )
  getDetailData: (review_id: number) => Promise<void>
}

// 회의자료 및 회의록 파일 업로드 모달 
const UploadReviewMaterialFilesModal = ({review_id, review_file_is_material, getDetailData}: IProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [file, setFile] = React.useState<File | null>(null);

  const handleOpen = () => {
    setFile(() => null);
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }
  
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) { return }
    const file = e.target.files[0];
    setFile(() => file);
  }

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: '파일 업로드 오류',
        text: '파일을 선택해주세요.',
      })
      return;
    }
    const updateProps = {
      review_id,
      review_file_is_material,
      review_file_date: new Date(file.lastModified).toLocaleDateString(),
      file
    }
    const res = await UploadBusinessReviewCase4MeetingFile(updateProps);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '파일 업로드 오류',
        text: res.message || '파일 업로드에 실패했습니다.',
      })
      handleClose();
      return
    };
    await Swal.fire({
      icon: 'success',
      title: review_file_is_material === "true" ? "회의자료 업로드" : "회의록 업로드",
      text: '파일 업로드에 성공했습니다.',
    });
    await getDetailData(review_id);
    handleClose();
  }

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>업로드</Button>

      <Modal isOpen={isOpen} size="md">
        <Modal.Head>
          {
            review_file_is_material === "true"
              ? "회의자료 업로드"
              : "회의록 업로드"
          }
        </Modal.Head>
        <Modal.Body>
        
          <PanelContainer>
            <PanelHeader>
              {
                review_file_is_material === "true"
                  ? "회의자료 파일 업로드"
                  : "회의록 파일 업로드"
              }
            </PanelHeader>
            <PanelBody>
              <div>
                { file? file.name : '' }
                <label className="flex items-center border border-gray-300 cursor-pointer" htmlFor={review_file_is_material === "true" ? 'material_file' : 'no_material_file'}>
                  <div className="p-1.5 px-3 bg-gray-100 rounded-sm border-e border-gray-300">파일 선택</div>
                  <span className="ml-2">{ file ? file.name : "파일 업로드" }</span>
                </label>
              </div>
              <div className='w-full overflow-x-auto mt-3'>
                <table className='table table-border w-full'>
                  <thead className='whitespace-nowrap'>
                    <tr>
                      <th>파일 이름</th>
                      <th>파일 생성 날짜</th>
                      <th>파일 크기</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{ file ? file.name : '파일을 선택해주세요.' }</td>
                      <td>
                        { file && file.lastModified ? new Date(file.lastModified).toLocaleDateString() : '파일을 선택해주세요.' }
                      </td>
                      <td>
                        { file ? (file.size / 1024 / 1024).toFixed(2)+"MB" : '파일을 선택해주세요.' }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <input type="file" className="hidden" name={review_file_is_material === "true" ? 'material_file' : 'no_material_file'} id={review_file_is_material === "true" ? 'material_file' : 'no_material_file'} onChange={handleChangeFile}/>
            </PanelBody>
          </PanelContainer>
        </Modal.Body>
        <Modal.Footer className="whitespace-nowrap">
          <Button onClick={handleSubmit}>업로드</Button>
          <Button onClick={handleClose}>취소</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

export default UploadReviewMaterialFilesModal;

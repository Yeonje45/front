import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';
import PanelContainer from 'components/common/panels/PanelContainer'; 
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import {
  GetShowVerificationHistory, IGetShowVerificationHistoryModel, CreateVerificationIssue
} from 'models/QualityManagement';

interface IVerificationHistoryModalProps {
  verification_id: number;
  std_output_id: number;
}

interface IGetShowVerificationHistoryModelCheck extends IGetShowVerificationHistoryModel {
  index: number;
}

const VerificationHistoryModal = ({verification_id, std_output_id}: IVerificationHistoryModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [historyData, setHistoryData] = React.useState<IGetShowVerificationHistoryModel[] | null>(null);
  
  const [selectedHistoryList, setSelectedHistoryList] = React.useState<IGetShowVerificationHistoryModelCheck[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setHistoryData(() => null);
      setSelectedHistoryList(() => []);
      handleGetShowVerificationHistory();
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(() => true);
  }

  const handleClose = () => {
    setIsOpen(() => false);
  }

  // 체크박스 클릭 시에 Filter 하여 추가
  // 다시 선택 시에는 삭제
  // 처음 선택 시에는 추가
  const handleCheckHistory = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!historyData) { return }
    const { checked, value } = event.target; // value = index 로 관리
    const selectedIndex = parseInt(value, 10);
    if (checked) {
      setSelectedHistoryList((prev) => [...prev, {...historyData[selectedIndex], index: selectedIndex}]);
    } else {
      setSelectedHistoryList((prev) => prev.filter((_, index) => index !== selectedIndex ));
    }
  }

  const handleGetShowVerificationHistory = async () => {
    const res = await GetShowVerificationHistory({verification_id});
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '검증 수행 이력 조회 실패',
        text: res.message || '검증 수행 이력 조회 실패',
      })
      return
    }
    setHistoryData(() => res.data)
  }

  // 이슈 등록하기
  const handleSubmitCreateIssue = async () => {
    const createProps = {
      std_output_id: std_output_id,
      check_results: selectedHistoryList
    }
    const res = await CreateVerificationIssue(createProps);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '이슈 등록 실패',
        text: res.message || '이슈 등록 실패',
      })
      return;
    }
    await Swal.fire({
      icon: 'success',
      title: '이슈 등록 성공',
      text: '이슈 등록이 성공적으로 완료.'
    })
    handleClose();
  }

  return (
    <React.Fragment>

      <Button onClick={handleOpen}>자세히</Button>

      <Modal isOpen={isOpen} size="lg">
        <Modal.Head>검증 수행 이력 자세히 보기</Modal.Head>
        <Modal.Body>
          { historyData && <PanelContainer>
            <PanelHeader>
              <Button className="ms-auto" onClick={handleSubmitCreateIssue}>이슈 등록하기</Button>
            </PanelHeader>
            <PanelBody>
              <div className="w-full overflow-x-auto">
                <table className="table w-full table-border">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th>선택</th>
                      <th>장절</th>
                      <th>점검항목</th>
                      <th>점검결과</th>
                      <th>점검의견</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      historyData && historyData.length !== 0 && historyData.map((historyItem, index) => (
                        <tr key={index}>
                          <td>
                            <Input.Checkbox 
                              id={`verification-history-${index}`}
                              value={index}
                              onChange={handleCheckHistory}
                              checked={selectedHistoryList.some((item) => item.index === index)}
                            />
                          </td>
                          <td>{historyItem.verification_chapter}</td>
                          <td>{historyItem.verification_content}</td>
                          <td>{historyItem.verification_result}</td>
                          <td>{historyItem.verification_comment}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </PanelBody>
          </PanelContainer> }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>

    </React.Fragment>
  )
}

export default VerificationHistoryModal

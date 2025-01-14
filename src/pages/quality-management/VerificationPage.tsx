import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import PanelContainer from 'components/common/panels/PanelContainer'; 
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';
import VerificationHistoryModal from 'components/quality-management/verification/VerificationHistoryModal';
import StartVerificationDocumentModal from 'components/quality-management/verification/StartVerificationDocumentModal';

import {
  GetVerificationDocumentList, IVerificationDocumentModel,
  GetVerificationHistoryList, IVerificationHistoryModel
} from 'models/QualityManagement';
import { RootState } from 'app/store';

const VerificationPage = () => {
  const project_state = useSelector((state: RootState) => state.project.project);

  // 검증 대상 문서
  const [verification_document_list, setVerificationDocumentList] = React.useState<IVerificationDocumentModel[] | null>(null);
  const [selectedVerificationDocument, setSelectedVerificationDocument] = React.useState<IVerificationDocumentModel | null>(null);

  // 검증 수행 이력 
  const [verification_history_list, setVerificationHistoryList] = React.useState<IVerificationHistoryModel[] | null>(null);
  const [selectedVerificationHistory, setSelectedVerificationHistory] = React.useState<IVerificationHistoryModel | null>(null);

  React.useEffect(() => {
    getVerificationDocumentListHandler()
  } , [])

  //  SW 검증 대상 문서 조회
  const getVerificationDocumentListHandler = async () => {
    if (!project_state) {
      return;
    }
    const res = await GetVerificationDocumentList({ project_id: project_state.project_id })
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'SW 검증 대상 문서 조회 실패',
        text: res.message || 'SW 검증 대상 문서 조회 실패',
      })
      return
    }
    setVerificationDocumentList(() => res.data)
  }

  // SW 검증 대상 문서 Radio 선택 시에 - ( 검증 수행 이력도 조회해야 함 )
  const handleVerificationDocumentRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!verification_document_list) { return }
    const inp_id = +event.target.value;
    const selected_document = verification_document_list.find((item) => item.std_output_id === inp_id)
    if (!selected_document) { return }
    getVerificationHistoryListHandler(selected_document.std_output_id)
    setSelectedVerificationDocument(() => selected_document)
  }

  const handleVerificationDocumentDocument = async () => {
    if (!verification_document_list) { return }
    if (!selectedVerificationDocument) { return }
    await getVerificationHistoryListHandler(selectedVerificationDocument.std_output_id)
  }

  const getVerificationDocumentAndHistory = async () => {
    await getVerificationDocumentListHandler();
    await handleVerificationDocumentDocument();
  }

  // SW 검증 수행 이력 조회
  const getVerificationHistoryListHandler = async (std_output_id: number) => {
    if (!project_state) {
      return;
    }
    const res = await GetVerificationHistoryList({ project_id: project_state.project_id, std_output_id })
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'SW 검증 수행 이력 조회 실패',
        text: res.message || 'SW 검증 수행 이력 조회 실패',
      })
      return
    }
    setVerificationHistoryList(() => res.data)
  }

  // SW 검증 수행 이력 Radio 선택 시에
  const handleVerificationHistoryRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!verification_history_list) { return }
    const inp_id = +event.target.value;
    const selected_history = verification_history_list.find((item) => item.verification_id === inp_id)
    if (!selected_history) { return }
    setSelectedVerificationHistory(() => selected_history)
  }

  return (
    <div className="grid grid-flow-row grid-cols-1">

      <PanelContainer>
        <PanelHeader>
          <div className="flex flex-wrap justify-between items-center w-full">
            <p>SW 검증 대상 문서</p>
            <div className="space-x-3">
              { selectedVerificationDocument && <StartVerificationDocumentModal std_output_id={selectedVerificationDocument.std_output_id} getRemoteData={getVerificationDocumentAndHistory} /> }
            </div>
          </div>
        </PanelHeader>
        <PanelBody>
          <div className="w-full overflow-x-auto">
            <table className="table table-border w-full">
              <thead className="whitespace-nowrap">
                <tr>
                  <th>선택</th>
                  <th>산출물 종류</th>
                  <th>산출물 파일명</th>
                  <th>검증 체크리스트명</th>
                  <th>최종 검증 결과</th>
                </tr>
              </thead>
              <tbody>
                {
                  verification_document_list && verification_document_list.length !== 0 && verification_document_list.map((verification_document_item) => (
                    <tr key={verification_document_item.std_output_id}>
                      <td>
                        <Input.Radio 
                          value={verification_document_item.std_output_id} 
                          id="verification_document" 
                          name="verification_document" 
                          onChange={handleVerificationDocumentRadioChange} />
                      </td>
                      <td>{verification_document_item.std_output_name}</td>
                      <td>{verification_document_item.verification_file}</td>
                      <td>{verification_document_item.verification_check_file}</td>
                      <td className="uppercase">{verification_document_item.verification_result}</td>
                    </tr>
                  ))
                }
                <tr></tr>
              </tbody>
            </table>
          </div>
        </PanelBody>
      </PanelContainer>

      {
        selectedVerificationDocument && 
        <PanelContainer>
          <PanelHeader>
            <div className="flex flex-wrap justify-between items-center w-full">
              <p>검증 수행 이력 - 체계요구사항명세서(SSRS)</p>
              <div className="space-x-3">
                { selectedVerificationHistory && selectedVerificationDocument && <VerificationHistoryModal verification_id={selectedVerificationHistory.verification_id} std_output_id={selectedVerificationDocument.std_output_id} /> }
              </div>
            </div>
          </PanelHeader>
          <PanelBody>
            <div className="w-full overflow-x-auto">
              <table className="table table-border w-full">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th>선택</th>
                    <th>산출물 파일명</th>
                    <th>체크리스트 이름</th>
                    <th>검토자</th>
                    <th>검토 일자</th>
                    <th>검토 결과</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    verification_history_list && verification_history_list.length !== 0 && verification_history_list.map((verification_history_item) => (
                      <tr key={verification_history_item.verification_id}>
                        <td>
                          <Input.Radio 
                            value={verification_history_item.verification_id} 
                            id="verification_history" 
                            name="verification_history" 
                            onChange={handleVerificationHistoryRadioChange} />
                        </td>
                        <td>{verification_history_item.verification_file}</td>
                        <td>{verification_history_item.verification_check_file}</td>
                        <td>{verification_history_item.verification_user_id}</td>
                        <td>
                          <p>{verification_history_item.verification_start_date && new Date(verification_history_item.verification_start_date).toLocaleString()}</p>
                          <p>{verification_history_item.verification_start_date && "~"}</p>
                          <p>{verification_history_item.verification_end_date && new Date(verification_history_item.verification_end_date).toLocaleString()}</p>
                          {/* 종료시간 - 시작시간 ( 몇 분 몇 초가 걸렸는지 UI로 표시 */}
                          <p>{verification_history_item.verification_start_date && verification_history_item.verification_end_date && new Date(verification_history_item.verification_end_date).getSeconds() - new Date(verification_history_item.verification_start_date).getSeconds() + "초"}</p>
                        </td>
                        <td className="uppercase">{verification_history_item.verification_result}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </PanelBody>
        </PanelContainer>
      }

    </div>
  )
}

export default VerificationPage

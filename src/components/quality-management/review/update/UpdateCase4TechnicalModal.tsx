import React from 'react';
import Swal from 'sweetalert2';
import { List, FolderFill } from 'react-bootstrap-icons';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import Modal from 'tailwindElement/Modal';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import {
  UpdateBusinessReviewCase4, IUpdateTechnicalReviewCase4Model,
} from 'models/QualityManagement';

import { 
	IBaselineManagementSidebarModel, GetBaselineManagementSidebarData,
  IBaselineManagementDetailModel, GetBaselineManagementSidebarDetailData, GetStatusByStatusCode,
} from "models/ConfigManagement"

interface IUpdateCase4TechnicalModalProps {
  project_id: string;
  selected_review_id: number | null;
  review_outputs: number[];
  baseline_id: number;
  src_version_id: number;
  handleGetRemote: (review_id: number) => Promise<void>;
}

const UpdateCase4TechnicalModal = ({project_id, selected_review_id, review_outputs, baseline_id, src_version_id, handleGetRemote}: IUpdateCase4TechnicalModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const [sidebarData, setSidebarData] = React.useState<IBaselineManagementSidebarModel[] | null>(null)
	const [selectedSidebarDetailData, setSeletedSidebarDetailData] = React.useState<IBaselineManagementDetailModel | null>(null)
  const [selectedOutputList, setSelectedOutputList] = React.useState<number[]>([])
  const [selectedBaseline, setSelectedBaseline] = React.useState<number | null>(0)
  const [selectedSrcVersion, setSelectedSrcVersion] = React.useState<number | null>(0)

  const handleOpen = () => {
    handleGetSidebarData();
    setSelectedOutputList(() => review_outputs);
    setSelectedBaseline(() => baseline_id);
    setSelectedSrcVersion(() => src_version_id);
    setSeletedSidebarDetailData(() => null)
    setIsOpen(() => true)
  };

  const handleClose = () => {
    setSeletedSidebarDetailData(() => null);
    setIsOpen(() => false)
  };

  // 카테고리 데이터를 가져와주는 함수
  const handleGetSidebarData = async () => {
		const res = await GetBaselineManagementSidebarData(project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '콘텐츠 조회 실패',
			})
			return
		}
		setSidebarData(() => res.data)
  }

	/* Sidebar에 Sidebar-Detail을 클릭 하면 생기는 이벤트*/
	const handleSidebarDetailClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		if (!sidebarData) { return }
		const baselineDetail = event.currentTarget.id // detail ID
		setSelectedOutputList(() => [])
		setSelectedBaseline(() => null)
		setSelectedSrcVersion(() => null)
		getSidebarDetail(+baselineDetail)
	}

	/* Sidebar-Detail 콘텐츠 조회 ( Baseline Detail ) */
	const getSidebarDetail = async (baselineDetail: number):Promise<void> => {
		const res = await GetBaselineManagementSidebarDetailData(baselineDetail)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message || '콘텐츠 조회 실패',
			})
			return
		}
		setSeletedSidebarDetailData(() => res.data)
	}

  // 산출물 목록 checkbox 클릭 이벤트 함수 
  const handleChangeOutputList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedOutputList([...selectedOutputList, +value]);
      return;
    }
    const filterd = selectedOutputList.filter((output) => output !== +value);
    setSelectedOutputList(() => filterd);
  }

  // 요구사항 목록 Radio 클릭 이벤트 함수
  const handleChangeBaseline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBaseline(() => +event.target.value);
  }

  // 소스코드 목록 Radio 클릭 이벤트 함수
  const handleChangeSrcVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSrcVersion(() => +event.target.value);
  }

  // 서버로 수정 요청 보내기
  const handleSubmit = async () => {
    if (!selected_review_id || !selectedSidebarDetailData) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '검토 대상을 찾을 수 없습니다.',
      })
      handleClose();
      return;
    }
    const updateProps: IUpdateTechnicalReviewCase4Model = {
      review_id: selected_review_id,
      conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id || 0,
      std_output_list: selectedOutputList,
      baseline_id: selectedBaseline,
      src_version_id: selectedSrcVersion,
    }
    const res = await UpdateBusinessReviewCase4(updateProps);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message || '수정 실패',
      })
      return
    };
    await Swal.fire({
      icon: 'success',
      title: '사업관리 회의 검토 대상 수정 성공',
      text: '수정 완료',
    });
    await handleGetRemote(selected_review_id);
    handleClose();
    return;
  }

  return (
    <React.Fragment>
      <Button variant="secondary" onClick={handleOpen} className="absolute end-2">검토 대상 수정</Button>

      <Modal isOpen={isOpen} size="lg">
        <Modal.Head>검토 대상 수정</Modal.Head>
        <Modal.Body>
          <div className="grid grid-flow-row grid-cols-8 items-center gap-1">
            <div className="overflow-x-auto col-span-2">
              <PanelContainer>
                <PanelHeader>항목</PanelHeader>
                <PanelBody className="overflow-y-auto max-h-[651px] min-h-[651px]">
							    {sidebarData && sidebarData.map((sidebarItem, index) => (
								    <div key={index} className="my-2">
									    <input type="checkbox" id={`collapse-${index}`} className="hidden peer" />
									    <div className="flex flex-wrap items-center justify-between">
										    <span className="flex-1 text-lg">{sidebarItem.conf_base_name}</span>
										    { sidebarItem.baseline_details && sidebarItem.baseline_details.length != 0 && <label htmlFor={`collapse-${index}`} className="block p-2 cursor-pointer"><List size={16} /></label> }
									    </div>
									    <div className="hidden border bg-gray-50 peer-checked:block">
										    { sidebarItem.baseline_details && sidebarItem.baseline_details.map((baselineDetail, index) => (
											    <button 
												    key={index} 
												    onClick={handleSidebarDetailClick}
												    id={baselineDetail.conf_base_detail_id.toString()} // Detail ID 
												    name={sidebarItem.conf_base_id.toString()} // Parent Name
												    className={`flex flex-wrap items-center w-full h-full p-2 gap-2 hover:bg-gray-200 
																		    ${selectedSidebarDetailData && baselineDetail.conf_base_detail_id == selectedSidebarDetailData.conf_base_detail_id ? 'bg-gray-200' : 'no_selected'}`}
											    >
												    <FolderFill 
													    className="text-yellow-500"
												    />
												    <span className="mr-auto">{baselineDetail.conf_version_name}</span>
												    <span>{sidebarItem.conf_base_state ? GetStatusByStatusCode(sidebarItem.conf_base_state) : GetStatusByStatusCode(baselineDetail.conf_version_status)}</span>
											    </button>
										    ))}
									    </div>
								    </div>
							    ))}
                </PanelBody>
              </PanelContainer>
            </div>

            <div className="overflow-x-auto col-span-6">
              <PanelContainer>
                <PanelHeader>항목 상세</PanelHeader>
                <PanelBody className="overflow-y-auto max-h-[651px] min-h-[651px]">
								  {/* 산출물 목록 */}
		              <PanelContainer>
			              <PanelHeader>산출물 목록</PanelHeader>
			              <PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				              <table className="table w-full table-border">
					              <thead className="whitespace-nowrap">
						              <tr>
							              <th>선택</th>
							              <th>산출물 종류</th>
							              <th>파일명</th>
							              <th>업로드 일시</th>
							              <th>올린이</th>
						              </tr>
					              </thead>
					              <tbody>
						              { selectedSidebarDetailData && selectedSidebarDetailData.baseline_outputs && selectedSidebarDetailData.baseline_outputs.length != 0 && selectedSidebarDetailData.baseline_outputs.map((output, index) => (
							              <tr key={index}>
								              <td>
								                <Input.Checkbox 
								                  name="output_id"
								                  value={output.std_output_id}
								                  onChange={handleChangeOutputList}
								                  checked={selectedOutputList.includes(output.std_output_id)}
								                />
								              </td>
								              <td> { output.std_output_name } </td>
								              <td> { output.output_content_file || '' } </td>
								              <td> { new Date(output.output_content_update_date).toLocaleString() } </td>
								              <td> { output.output_content_update_person } </td>
							              </tr>
						              )) }
					              </tbody>
				              </table>
			              </PanelBody>
		              </PanelContainer>

								  {/*요구사항 버전 */}
		              <PanelContainer>
			              <PanelHeader>요구사항 버전</PanelHeader>
			              <PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				              <table className="table w-full table-border">
					              <thead className="whitespace-nowrap">
						              <tr>
						                <th>선택</th>
							              <th>요구사항 버전</th>
						              </tr>
					              </thead>
					              <tbody>
					                {
                            selectedSidebarDetailData && selectedSidebarDetailData.baseline_id && (
						                  <tr>
						                    <td>
						                      <Input.Radio
						                        name="baseline_id"
                                    value={selectedSidebarDetailData.baseline_id}
                                    onChange={handleChangeBaseline}
                                    checked={selectedBaseline === selectedSidebarDetailData.baseline_id}
                                    />
						                    </td>
							                  <td>
								                  { selectedSidebarDetailData.baseline_number && selectedSidebarDetailData.baseline_number }
							                  </td>
						                  </tr>
                            )
					                }
					              </tbody>
				              </table>
			              </PanelBody>
		              </PanelContainer>

								  {/* 소스코드 버전*/}
		              <PanelContainer>
			              <PanelHeader
			              >소스코드 버전</PanelHeader>
			              <PanelBody className="max-h-[300px] min-h-[150px] overflow-y-auto">
				              <table className="table w-full table-border">
					              <thead className="whitespace-nowrap">
						              <tr>
							              <th>선택</th>
							              <th>소스코드 명칭</th>
							              <th>설명</th>
						              </tr>
					              </thead>
					              <tbody>
					                {
					                  selectedSidebarDetailData && selectedSidebarDetailData.src_version_id && (
						                  <tr>
						                    <td>
						                      <Input.Radio 
						                        name="src_version_id"
						                        value={selectedSidebarDetailData.src_version_id}
						                        onChange={handleChangeSrcVersion}
						                        checked={selectedSrcVersion === selectedSidebarDetailData.src_version_id}
						                      />
						                    </td>
							                  <td>V.{selectedSidebarDetailData.src_version_name}</td>
							                  <td>
								                  <span>{selectedSidebarDetailData.src_version_content}</span>
							                  </td>
						                  </tr>
					                  )
					                }
					              </tbody>
				              </table>
			              </PanelBody>
		              </PanelContainer>
                </PanelBody>
              </PanelContainer>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>수정</Button>
          <Button onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
};

export default UpdateCase4TechnicalModal;

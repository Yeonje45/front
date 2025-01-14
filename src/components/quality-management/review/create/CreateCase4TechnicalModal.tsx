import React from "react";
import Swal from 'sweetalert2';
import { List, FolderFill } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import Modal from 'tailwindElement/Modal';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import {
  CreateBusinessReviewCase4, ICreateTechnicalReviewCase4Model,
  GetMeetingPeopleList, IMeetingPeopleModel,
  IManagReviewModel
} from 'models/QualityManagement';
import { 
	IBaselineManagementSidebarModel, GetBaselineManagementSidebarData,
  IBaselineManagementDetailModel, GetBaselineManagementSidebarDetailData, GetStatusByStatusCode,
} from "models/ConfigManagement"

interface ICreateCase4TechnicalModalProps {
  project_id: string;
  originReviewList: IManagReviewModel[] | null
  handleGetRemoteData: () => Promise<void>;
};

const CreateCase4TechnicalModal = ({project_id, originReviewList, handleGetRemoteData}: ICreateCase4TechnicalModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // Using By Step 1
  const [managData, setData] = React.useState<Record<string, string>>({ // 기본 입력 Input
    review_category: 'srr',
    review_name: '',
    review_description: '',
    review_start_date: '',
    review_end_date: '',
  });
  const [userList, setUserList] = React.useState<IMeetingPeopleModel[] | null>(null);
  const [managDataUserIdList, setManagDataUserIdList] = React.useState<IMeetingPeopleModel[]>([]); // 참석자 ID
  const [reviewList, setReviewList] = React.useState<IManagReviewModel[] | null>(originReviewList); // 관련 회의
  const [managReviewList, setManagReviewList] = React.useState<IManagReviewModel[]>([]);

  // Using By Step 2
  const [isNext, setIsNext] = React.useState<boolean>(false); // 검토 항목 선택 ( 검토 항목 생성에서 [다음] 버튼을 누르면 True로 변경 ) 
	const [sidebarData, setSidebarData] = React.useState<IBaselineManagementSidebarModel[] | null>(null)
	const [selectedSidebarDetailData, setSeletedSidebarDetailData] = React.useState<IBaselineManagementDetailModel | null>(null)
  const [selectedOutputList, setSelectedOutputList] = React.useState<number[]>([])
  const [selectedBaseline, setSelectedBaseline] = React.useState<number>(0)
  const [selectedSrcVersion, setSelectedSrcVersion] = React.useState<number>(0)

  React.useEffect(() => {
    if (isOpen) {
      // Step1
      getUserList();
      setReviewList(() => originReviewList);
      setData({
        review_category: 'srr',
        review_name: '',
        review_description: '',
        review_start_date: '',
        review_end_date: '',
      });
      setManagDataUserIdList(() => []);
      setManagReviewList(() => []);
      // Step2
      setSidebarData(null);
      setSeletedSidebarDetailData(null);
      setSelectedOutputList([]);
      setSelectedBaseline(0);
      setSelectedSrcVersion(0);
      return
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(true);
    setIsNext(false);
  };

  const handleClose = () => {
    setIsNext(false);
    setIsOpen(false);
  }

  // Footer에서 다음 버튼 클릭 시
  const handleNext = () => {
    if (!managData.review_name || !managData.review_start_date || !managData.review_end_date) {
      Swal.fire({
        icon: 'warning',
        title: '검토 항목 추가 실패',
        text: '필수 입력 항목을 입력해주세요.',
      });
      return;
    }
    setIsNext(true);
    handleGetSidebarData();
  }

  // 기본 데이터 입력 
  const handleChangeManagData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({
      ...managData,
      [e.target.name]: e.target.value,
    });
  }

  // 사용자 목록 조회
  const getUserList = async () => {
    const res = await GetMeetingPeopleList({project_id});
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '사용자 목록 조회 실패',
        text: res.message,
      })
    }
    setUserList(res.data);
  }

  // 사용자 선택 시에 자동으로 추가 되는 방식
  const handleChangeManagUserIdList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const userItem = userList?.find((user) => user.user_id === userId);
    if (!userItem) {
      return;
    }
    // 이미 추가된 사용자면 return 
    if (managDataUserIdList.some((userItem) => userItem.user_id === userId)) {
      return;
    }
    setManagDataUserIdList([...managDataUserIdList, userItem]);
  }

  const handleChangeManagReviewList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reviewId = e.target.value;
    const reviewItem = reviewList?.find((review) => review.review_id === +reviewId);
    if (!reviewItem) {
      return;
    }
    // 이미 추가된 review라면 return
    if (managReviewList?.some((reviewItem) => reviewItem.review_id === +reviewId)) {
      return;
    }
    setManagReviewList((prev) => {
      if (!prev) {
        return [reviewItem];
      }
      return [...prev, reviewItem];
    });
  }

  // 사용자 버튼 선택 시에 filter 해주는 함수 
  const handleRemoveManagUserIdList = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    const filterd = managDataUserIdList.filter((userItem) => userItem.user_id !== id);
    setManagDataUserIdList(() => filterd);
  }

  // Review 버튼 선택 시에 filter 해주는 함수
  const handleRemoveManagReviewList = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    const filterd = managReviewList?.filter((reviewItem) => reviewItem.review_id !== +id);
    if (!filterd) {
      return;
    }
    setManagReviewList(() => filterd);
  }

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

  // 추가 버튼 클릭 시
  const handleSubmit = async () => {
    if (!selectedSidebarDetailData) {
      return
    }
    if (!managData.review_name || !managData.review_start_date || !managData.review_end_date) {
      Swal.fire({
        icon: 'warning',
        title: '검토 항목 추가 실패',
        text: '필수 입력 항목을 입력해주세요.',
      });
      return;
    }
    const createProps: ICreateTechnicalReviewCase4Model = {
      project_id: project_id,
      review_category: managData.review_category,
      review_name: managData.review_name,
      review_description: managData.review_description,
      review_start_date: managData.review_start_date,
      review_end_date: managData.review_end_date,
      review_user_id_list: managDataUserIdList.map((userItem) => userItem.user_id),
      meeting_id_list: managReviewList.map((reviewItem) => reviewItem.review_id),
      conf_base_detail_id: selectedSidebarDetailData.conf_base_detail_id,
      std_output_list: selectedOutputList || [],
      baseline_id: selectedBaseline === 0 ? null : selectedBaseline,
      src_version_id: selectedSrcVersion === 0 ? null : selectedSrcVersion,
    }
    const res = await CreateBusinessReviewCase4(createProps);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '검토 항목 추가 실패',
        text: res.message || '검토 항목 추가 실패',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: '검토 항목 추가 성공',
      text: '검토 항목 추가 성공',
    });
    await handleGetRemoteData();
    handleClose();
  }

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>신규 사업관리 회의 추가</Button>

      {/* 검토 항목 생성 */}
      <Modal isOpen={isOpen} size="lg">
        <Modal.Head>신규 사업관리 검토회의 추가</Modal.Head>
        <Modal.Body>
					<div className="p-1.5 grid grid-cols-1 grid-flow-row gap-3">
						{/* 구분 */}
						<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
							<div className="lg:col-span-2">구분</div>
							<div className="lg:col-span-3">
								<Input defaultValue="사업관리 검토회의" disabled />
							</div>
							<div className="lg:col-span-3">
							  <Input.Select onChange={handleChangeManagData} name="review_category" id="review_category" value={managData.review_category}>
			            <Input.Option value="technical">기술검토 회의(Case3)</Input.Option>
			            <Input.Option value="sys">체계요구사항검토회의(SYS)</Input.Option>
			            <Input.Option value="sfr">체계기능검토회의(SFR)</Input.Option>
			            <Input.Option value="srr">소프트웨어요구사항검토회의(SRR)</Input.Option>
			            <Input.Option value="pdr">기본설계검토회의(PDR)</Input.Option>
			            <Input.Option value="cdr">상세설계검토회의(CDR)</Input.Option>
			            <Input.Option value="trr">시험준비검토회의(TRR)</Input.Option>
							  </Input.Select>
							</div>
						</div>
						{/* 검토 이름 */}
						<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
							<div className="lg:col-span-2">검토 이름<b className="text-red-500">*</b></div>
							<div className="lg:col-span-6">
								<Input value={managData.review_name} name="review_name" onChange={handleChangeManagData} />
							</div>
						</div>
						{/* 검토 설명 */}
						<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
							<div className="lg:col-span-2">검토 설명</div>
							<div className="lg:col-span-6">
								<Input value={managData.review_description} name="review_description" onChange={handleChangeManagData}/>
							</div>
						</div>
						{/* 시작 예정일 */}
						<div className="grid grid-flow-row gap-1 items-center">
							<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
								<div className="lg:col-span-2">시작 예정일<b className="text-red-500">*</b></div>
								<Input className="lg:col-span-6" type="date" value={managData.review_start_date} name="review_start_date" onChange={handleChangeManagData} />
							</div>
							<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
								<div className="lg:col-span-2">종료 예정일<b className="text-red-500">*</b></div>
								<Input className="lg:col-span-6" type="date" value={managData.review_end_date} name="review_end_date" onChange={handleChangeManagData} />
							  </div>
						</div>
						{/* 참석자 */}
						<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
							<div className="lg:col-span-2">참석자</div>
							<div className="lg:col-span-6">
							  <Input.Select onChange={handleChangeManagUserIdList}>
                  <Input.Option value="">선택</Input.Option>
							    {
							      userList && userList.map((userItem) => (
							        <Input.Option key={userItem.user_id} value={userItem.user_id}>{userItem.user_name}[{userItem.user_id}]</Input.Option>
							      ))
							    }
							  </Input.Select>
							</div>
						</div>
						<div className="mb-3">
						  <span className="font-bold">참석자 목록</span>
						  {
						    managDataUserIdList && managDataUserIdList.map((userItem) => (
                  <Button variant="unset" key={userItem.user_id} id={userItem.user_id} onClick={handleRemoveManagUserIdList}>{userItem.user_name}</Button>
						    ))
						  }
						</div>
						{/* 관련 회의 */}
						<div className="grid grid-flow-row lg:grid-cols-8 gap-1 items-center">
							<div className="lg:col-span-2">관련 회의</div>
							<div className="lg:col-span-6">
							  <Input.Select onChange={handleChangeManagReviewList}>
                  <Input.Option value="">선택</Input.Option>
							    {
							      reviewList && reviewList.map((reviewItem) => (
							        <Input.Option key={reviewItem.review_id} value={reviewItem.review_id}>{reviewItem.review_name}</Input.Option>
							      ))
							    }
							  </Input.Select>
							</div>
						</div>
						<div className="mb-3">
						  <span className="font-bold">관련 회의 목록</span>
						  {
						    managReviewList && managReviewList.map((reviewItem) => (
                  <Button variant="unset" key={reviewItem.review_id} id={reviewItem.review_id.toString()} onClick={handleRemoveManagReviewList}>{reviewItem.review_name}</Button>
						    ))
						  }
						</div>
					</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleNext}>다음</Button>
          <Button onClick={handleClose}>취소</Button>
        </Modal.Footer>
      </Modal>

      {/* 검토 항목 선택 */}
      <Modal isOpen={isNext} size="lg">
        <Modal.Head>검토 항목 선택</Modal.Head>
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
											    baselineDetail.conf_version_status !== 'apr' && baselineDetail.conf_version_status !== 'rjc' && <button 
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
          <Button onClick={handleSubmit}>추가</Button>
          <Button onClick={handleClose}>취소</Button>
        </Modal.Footer>
      </Modal>

    </React.Fragment>
  );
};

export default CreateCase4TechnicalModal;

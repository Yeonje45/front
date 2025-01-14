import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';
import EditElement from 'components/config-management/baseline-management/EditElement';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import { 
	IProductManagementModel, IRequirementManagementModel, ISourceCodeManagementModel,
	RequestEditBaselineManagement, DownloadConfigurationTemplateFile,
	IBaselineManagementDetailOutputsModel
} from 'models/ConfigManagement';

interface IProps {
	conf_base_detail_id: number
  handleSidebarDetail: () => Promise<void>;
	// 버튼 텍스트 / 기본값: "형상변경요청"
	content?: string;
	// 파일이 있는 지 없는 지 확인하는 변수 / 기본값: false
	is_pass_file?: boolean;
	// 산출물, 요구사항, 소스코드 기존 정보 불러오기
	origin_outputs?: IBaselineManagementDetailOutputsModel[] | null;
	origin_requirement?: IRequirementManagementModel;
	origin_source_code?: ISourceCodeManagementModel;
}

// 형상 변경 요청 모달
const ConfigurationEditRequestModal = ({
	conf_base_detail_id, handleSidebarDetail, 
	content="형상변경요청", is_pass_file=false,
	origin_outputs, origin_requirement, origin_source_code
}: IProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)
	const [selectedProductList, setSelectedProductList] = React.useState<IProductManagementModel[] | null>(null)
	const [selectedRequirement, setSelectedRequirementList] = React.useState<IRequirementManagementModel | null>(null)
	const [selectedSourceCode, setSelectedSourceCode] = React.useState<ISourceCodeManagementModel | null>(null)
	const [request_file, setRequestFile] = React.useState<File | null>(null)
	const [details_file, setDetailsFile] = React.useState<File | null>(null)
	const [conf_version_request_comment, setConfVersionRequestComment] = React.useState<string>("")
	const [step, setStep] = React.useState<number>(0) // 0 = 변경 요청서 작성, 1 = 대상 항목 선택

  const handleOpen = () => {
		setStep(() => 0)
		setSelectedProductList(() => null)
		setSelectedRequirementList(() => null)
		setSelectedSourceCode(() => null)
		setRequestFile(() => null)
		setDetailsFile(() => null)
		setConfVersionRequestComment(() => "")
    setIsOpen(() => true)
		// 기존에 있었던 데이터를 불러옴
		if (origin_outputs) {
			const product_list: IProductManagementModel[] = origin_outputs.map((output) => {
				return {
					std_output_id: output.std_output_id,
					std_output_name: output.std_output_name,
					output_content_file: output.output_content_file,
					output_content_update_date: output.output_content_update_date,
					output_content_update_person: output.output_content_update_person,
					output_content_file_name: output.output_content_file,
					output_content_state: "",
					output_content_update_person_name: output.output_content_update_person,
					latest_output_content_name: "",
					latest_output_content_chapter: "",
					latest_output_content_work: "",

				}
			})
			setSelectedProductList(() => product_list)
		}
		if (origin_requirement) {
			setSelectedRequirementList(() => origin_requirement.baseline_id.toString() === "" ? null : origin_requirement)
		}
		if (origin_source_code) {
			setSelectedSourceCode(() => origin_source_code.src_version_id.toString() === "" ? null : origin_source_code)
		}
  }

  const handleClose = () => {
    setIsOpen(() => false)
  }

	const handleNextStep = () => {
		// 의견 작성이 없을 경우
		if (!conf_version_request_comment) {
			Swal.fire({
				icon: 'error',
				title: '의견이 없습니다',
				text: '의견을 작성해주세요'
			})
			return
		}
		if (!is_pass_file) {
			// 형상변경 요청서 파일이 없을 경우
			if (!request_file) {
				Swal.fire({
					icon: 'error',
					title: '형상변경 요청서 파일이 없습니다',
					text: '형상변경 요청서 파일을 업로드 해주세요'
				})
				return
			}
			// 변경사항 세부내역 파일이 없을 경우
			if (!details_file) {
				Swal.fire({
					icon: 'error',
					title: '변경사항 세부내역 파일이 없습니다',
					text: '변경사항 세부내역 파일을 업로드 해주세요'
				})
				return
			}
		}
		setStep((prev) => prev + 1)
	}

	// handle Download template file
	const handleDownloadTemplate = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const res = await DownloadConfigurationTemplateFile(event.currentTarget.name);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '템플릿 파일 다운로드 실패',
				text: res.message || '템플릿 파일 다운로드 실패'
			})
			return;
		}
		Swal.fire({
			icon: 'success',
			title: '템플릿 파일 다운로드 성공',
			text: res.message || '템플릿 파일 다운로드 성공'
		})
	};

	// conf_version_request_comment 입력 이벤트 핸들링 함수
	const handleConfVersionRequestComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value
		setConfVersionRequestComment(() => value)
	}

	// request_file 파일 업로드 이벤트 핸들링 함수 
	const handleRequestFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setRequestFile(() => file)
		}
	}

	// details_file 파일 업로드 이벤트 핸들링 함수 
	const handleDetailsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setDetailsFile(() => file)
		}
	}
  
	// 산출물 버전 탭에서 선택 된 산출물을 저장하는 함수
	const handleAddProduct = (productList: IProductManagementModel[]) => {
		// 기존에 선택 된 산출물이 있는 경우 제외하고 리시트에 추가
		setSelectedProductList((prev) => {
			if (prev) {
				const newProductList = productList.filter((productItem) => !prev.some((prevProductItem) => prevProductItem.std_output_id === productItem.std_output_id))
				return [...prev, ...newProductList]
			}
			return productList
		})
	}
	
	const handleRemoveProduct = (productIDList: number[]) => {
		setSelectedProductList((prev) => {
			if (prev) {
				const newProductList = prev.filter((productItem) => !productIDList.includes(productItem.std_output_id))
				return newProductList
			}
			return null
		})
	}

	// 요구사항 버전 탭에서 선택 된 요구사항을 저장하는 함수
	const handleAddRequirement = (requirement: IRequirementManagementModel | null) => {
		setSelectedRequirementList(() => requirement)
	}

	// 소스코드 버전 탭에서 선택 된 소스코드를 저장하는 함수
	const handleAddSourceCode = (sourceCode: ISourceCodeManagementModel | null) => {
		setSelectedSourceCode(() => sourceCode)
	}

	// 저장 버튼 클릭 시에
	const handleSubmit = async ():Promise<void> => {
		// 산출물 및 conf_vase_detail_id를 제외하고는 null 값이 허용 됨
		const std_output_list = selectedProductList?.map((productItem) => productItem.std_output_id) || []
		const baseline_id = selectedRequirement?.baseline_id || null
		const baseline_number = selectedRequirement?.baseline_number || null
		const src_version_id = selectedSourceCode?.src_version_id || null
		const src_version_name = selectedSourceCode?.src_version_name || null
		
		const res = await RequestEditBaselineManagement({conf_base_detail_id, std_output_list: std_output_list, baseline_id, baseline_number, conf_version_request_comment, request_file, details_file, src_version_id, src_version_name})
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '베이스라인 수정 실패',
				text: res.message || '베이스라인 수정 실패'
			})
			setStep(() => 0)
			setSelectedProductList(() => null)
			setSelectedRequirementList(() => null)
			setSelectedSourceCode(() => null)
			setRequestFile(() => null)
			setDetailsFile(() => null)
			setConfVersionRequestComment(() => "")
			return
		}
		Swal.fire({
			icon: 'success',
			title: '베이스라인 수정 성공',
			text: res.message || '베이스라인 수정 성공'	
		})
    await handleSidebarDetail()
		handleClose()
	}

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>{content}</Button>

      <Modal isOpen={isOpen} size={`${step == 0 ? "md" : "xl"}`}>
        <Modal.Head>형상 변경 요청</Modal.Head>
        <Modal.Body>
					{
						isOpen && (
							<React.Fragment>
								{
									step == 0 &&
									<PanelContainer>
										<PanelHeader title="변경 요청서 작성" />
										<PanelBody>
											<div className="mb-3">
												<div className="space-x-2 mb-3">
													<span className="text-lg">형상변경 요청서</span>
													<Button name="config_request_file_template" onClick={handleDownloadTemplate}>형식다운</Button>
													<Button>
														<label htmlFor="request_file" className="cursor-pointer">업로드</label>
													</Button>
												</div>
												<Input.File name="request_file" id="request_file" onChange={handleRequestFile}/>
											</div>

											<div className="mb-3">
												<div className="space-x-2 mb-3">
													<span className="text-lg">변경사항 세부내역</span>
													<Button name="change_details_file_template" onClick={handleDownloadTemplate}>형식다운</Button>
													<Button>
														<label htmlFor="details_file" className="cursor-pointer">업로드</label>
													</Button>
												</div>
												<Input.File name="details_file" id="details_file" onChange={handleDetailsFile}/>
											</div>

											<div className="mb-3">
												<label htmlFor="conf_version_request_comment">기타 의견 작성</label>
												<Input.Textarea rows={5} name="conf_version_request_comment" value={conf_version_request_comment} onChange={handleConfVersionRequestComment} />
											</div>
										</PanelBody>
									</PanelContainer>
								}
								{
									step == 1 && 
									<PanelContainer>
										<PanelHeader title="대상 항목 선택" />
										<PanelBody>
											<EditElement 
												selectedProductList={selectedProductList}
												selectedRequirement={selectedRequirement}
												selectedSourceCode={selectedSourceCode}
												handleAddProduct={handleAddProduct}
												handleAddRequirement={handleAddRequirement}
												handleAddSourceCode={handleAddSourceCode}
												handleRemoveProduct={handleRemoveProduct}
											/>
										</PanelBody>
									</PanelContainer>
								}
							</React.Fragment>
						)
					}

        </Modal.Body>
        <Modal.Footer>
					{
						step == 0 && 
						<React.Fragment>
						  <Button onClick={handleNextStep}>다음</Button>
						  <Button onClick={handleClose}>취소</Button>
						</React.Fragment>
					}
					{
						step == 1 && 
						<React.Fragment>
							<Button onClick={handleSubmit}>저장</Button>
							<Button onClick={handleClose}>취소</Button>
						</React.Fragment>
					}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

export default ConfigurationEditRequestModal

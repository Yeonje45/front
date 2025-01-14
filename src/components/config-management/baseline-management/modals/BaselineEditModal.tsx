import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import EditElement from 'components/config-management/baseline-management/EditElement';

import { 
	IProductManagementModel, IRequirementManagementModel, ISourceCodeManagementModel,
	RequestEditBaselineManagement, IBaselineManagementDetailOutputsModel
} from 'models/ConfigManagement';

interface IProps {
	conf_base_detail_id: number
  handleSidebarDetail: () => Promise<void>;
	origin_outputs?: IBaselineManagementDetailOutputsModel[] | null;
	origin_requirement?: IRequirementManagementModel;
	origin_source_code?: ISourceCodeManagementModel;
}

const BaselineEditModal = ({conf_base_detail_id, handleSidebarDetail, origin_outputs, origin_requirement, origin_source_code}: IProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)
	const [selectedProductList, setSelectedProductList] = React.useState<IProductManagementModel[] | null>(null)
	const [selectedRequirement, setSelectedRequirementList] = React.useState<IRequirementManagementModel | null>(null)
	const [selectedSourceCode, setSelectedSourceCode] = React.useState<ISourceCodeManagementModel | null>(null)

	const handleOpen = () => {
		setSelectedProductList(() => null)
		setSelectedRequirementList(() => null)
		setSelectedSourceCode(() => null)
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
		const conf_version_request_comment = ""
		const src_version_id = selectedSourceCode?.src_version_id || null
		const src_version_name = selectedSourceCode?.src_version_name || null

		const res = await RequestEditBaselineManagement({conf_base_detail_id, std_output_list: std_output_list, baseline_id, baseline_number, conf_version_request_comment, src_version_id, src_version_name})
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '베이스라인 수정 실패',
				text: res.message || '베이스라인 수정 실패'
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '베이스라인 수정 성공',
			text: res.message || '베이스라인 수정 성공'	
		})
    await handleSidebarDetail()
		handleClose()
	}

	return (
		<React.Fragment>
			<Button onClick={handleOpen}>항목 편집</Button>

			<Modal isOpen={isOpen} size="xl">
				<Modal.Head>베이스라인 항목 편집</Modal.Head>
				<Modal.Body className="min-h-full">
					{ // isOpen 조건문을 넣은 이유는 모달이 여/닫힐 때 랜더링을 다시 하게 하기 위함임
						isOpen && 
						<EditElement 
							selectedProductList={selectedProductList}
							selectedRequirement={selectedRequirement}
							selectedSourceCode={selectedSourceCode}
							handleAddProduct={handleAddProduct}
							handleAddRequirement={handleAddRequirement}
							handleAddSourceCode={handleAddSourceCode}
							handleRemoveProduct={handleRemoveProduct}
						/>
					}
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={handleSubmit}>수정</Button>
					<Button onClick={handleClose}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default BaselineEditModal

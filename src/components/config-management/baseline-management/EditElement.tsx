import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import Tabs from 'tailwindElement/Tabs';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';
import ProductVersionTab from 'components/config-management/baseline-management/tabs/ProductVersionTab';
import RequirementVersionTab from 'components/config-management/baseline-management/tabs/RequirementVersionTab';
import SourceVersionTab from 'components/config-management/baseline-management/tabs/SourceVersionTab';

import { 
	GetStatusByStatusCode, IProductManagementModel, IRequirementManagementModel, ITestManagementTCModel, IGetBaselineManagementTableEditTRDataModel, ISourceCodeManagementModel,
} from 'models/ConfigManagement';

interface IProps {
  selectedProductList: IProductManagementModel[] | null
  selectedRequirement: IRequirementManagementModel | null
  selectedSourceCode: ISourceCodeManagementModel | null
  
  handleAddProduct: (productList: IProductManagementModel[]) => void
	handleAddRequirement: (requirement: IRequirementManagementModel | null) => void
	handleAddSourceCode: (sourceCode: ISourceCodeManagementModel | null) => void
  handleRemoveProduct: (productIDList: number[]) => void
}

const EditElement = ({
  selectedProductList, selectedRequirement, selectedSourceCode,
  handleAddProduct, handleAddRequirement, handleAddSourceCode, handleRemoveProduct
}: IProps) => {
  const [selectedProductIDList, setSelectedProductIDList] = React.useState<number[]>([])
  const [selectedRequirementID, setSelectedRequirementID] = React.useState<number | null>(null)
  const [selectedSourceCodeID, setSelectedSourceCodeID] = React.useState<number | null>(null)

  // 산출물 목록은 체크박스 - 체크박스 해제/선택 시 selectedProductIDList에 추가/제거
  const handleChangeProductCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    if (checked) {
      setSelectedProductIDList((prev) => [...prev, parseInt(value)])
    } else {
      setSelectedProductIDList((prev) => prev.filter((id) => id !== parseInt(value)))
    }
  }

  const handleChangeRequirementRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRequirementID(parseInt(e.target.value))
  }

  const handleChangeSourceCodeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSourceCodeID(parseInt(e.target.value))
  }

  const removeSelectedProduct = () => {
    handleRemoveProduct(selectedProductIDList)
    Swal.fire({
      icon: 'success',
      title: '산출물 목록에서 삭제 완료',
      text: '선택된 산출물이 목록에서 삭제되었습니다.'
    })
  }

  const removeSelectedRequirement = () => {
    handleAddRequirement(null)
    Swal.fire({
      icon: 'success',
      title: '요구사항 목록에서 삭제 완료',
      text: '선택된 요구사항이 목록에서 삭제되었습니다.'
    })
  }

  const removeSelectedSourceCode = () => {
    handleAddSourceCode(null)
    Swal.fire({
      icon: 'success',
      title: '소스코드 목록에서 삭제 완료',
      text: '선택된 소스코드가 목록에서 삭제되었습니다.'
    })
  }

  return (
    <React.Fragment>
      <div className="overflow-x-auto max-h-[500px]">
        <Tabs defaultTab="산출물 버전">
          <Tabs.Tab label="산출물 버전">
            <ProductVersionTab 
              handleAddProduct={handleAddProduct}
            />
          </Tabs.Tab>

          <Tabs.Tab label="요구사항 버전">
            <RequirementVersionTab 
              handleAddRequirement={handleAddRequirement}
            />
          </Tabs.Tab>

          <Tabs.Tab label="소스코드 버전">
            <SourceVersionTab 
              handleAddSourceCode={handleAddSourceCode}
            />
          </Tabs.Tab>
        </Tabs> 
      </div>
      
      <hr />

      <PanelContainer className="mx-0">
        <PanelHeader>베이스라인에 등록할 항목</PanelHeader>
        <PanelBody className="my-1 min-h-[150px]">
          <div className="space-y-3 mt-3 mb-9 overflow-y-auto max-h-[300px]">
            { // 산출물 버전 목록
              selectedProductList && 

              <PanelContainer>
                <PanelHeader rightElement={
                  <Button 
                    onClick={removeSelectedProduct}
                  >삭제</Button>
                }>산출물 목록</PanelHeader>
                <PanelBody>
                  <div className='overflow-x-auto'>
                    <table className="table w-full h-full table-border">
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
                        {selectedProductList && selectedProductList.map((productManagementItem, index) => (
                          <tr key={index}>
                            <td>
                              <Input.Checkbox 
                                value={productManagementItem.std_output_id} 
                                id={productManagementItem.std_output_id.toString()} 
                                checked={selectedProductIDList.includes(productManagementItem.std_output_id)}
                                onChange={handleChangeProductCheckbox}
                              />
                              </td>
                            <td>{productManagementItem.std_output_name}</td>
                            <td>{productManagementItem.output_content_file_name}</td>
                            <td>{productManagementItem.output_content_update_date}</td>
                            <td>{productManagementItem.output_content_update_person_name || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </PanelBody>
              </PanelContainer>
            }

            { // 요구사항 버전 목록 
              selectedRequirement &&
              <PanelContainer>
                <PanelHeader rightElement={
                  <Button 
                    onClick={removeSelectedRequirement}
                  >삭제</Button>
                }>요구사항 목록</PanelHeader>
                <PanelBody>
                  <div className='overflow-x-auto'>
                    <table className="table w-full h-full table-border">
                      <thead className="whitespace-nowrap">
                        <tr>
                          <th>선택</th>
                          <th>버전</th>
                          <th>상태</th>
                          <th>요청일시</th>
                          <th>승인/반려 일시</th>
                          <th>요청자</th>
                          <th>승인자</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td> 
                            <Input.Radio
                              value={selectedRequirement.baseline_id}
                              id={selectedRequirement.baseline_id.toString()}
                              checked={selectedRequirementID === selectedRequirement.baseline_id}
                              onChange={handleChangeRequirementRadio}
                            /> 
                          </td>
                          <td>{selectedRequirement.baseline_number}</td>
                          <td>{GetStatusByStatusCode(selectedRequirement.baseline_state || '')}</td>
                          <td>{selectedRequirement.baseline_request_date && new Date(selectedRequirement.baseline_request_date).toLocaleString()}</td>
                          <td>{selectedRequirement.baseline_approval_date && new Date(selectedRequirement.baseline_approval_date).toLocaleString()}</td>
                          <td>{selectedRequirement.baseline_request_name}</td>
                          <td>{selectedRequirement.baseline_approval_name}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </PanelBody>
              </PanelContainer>
            }

            { // 소스코드 버전 목록
              selectedSourceCode &&
              <PanelContainer>
                <PanelHeader
                  rightElement={
                    <Button 
                      onClick={removeSelectedSourceCode}
                    >삭제</Button>
                  }
                >소스코드 목록</PanelHeader>
                <PanelBody>
                  <div className='overflow-x-auto'>
                    <table className="table w-full h-full table-border">
                      <thead className="whitespace-nowrap">
                        <tr>
                          <th>선택</th>
                          <th>소스코드 명칭</th>
                          <th>상태</th>
                          <th>요청일시</th>
                          <th>승인/반려 일시</th>
                          <th>설명</th>
                          <th>요청자</th>
                          <th>승인자</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Input.Radio 
                              value={selectedSourceCode.src_version_id}
                              id={selectedSourceCode.src_version_id.toString()} 
                              checked={selectedSourceCodeID === selectedSourceCode.src_version_id}
                              onChange={handleChangeSourceCodeRadio}
                            />
                          </td>
                          <td>{selectedSourceCode.src_version_name}</td>
                          <td>{GetStatusByStatusCode(selectedSourceCode.src_version_status || '')}</td>
                          <td>{selectedSourceCode.requester_date && new Date(selectedSourceCode.requester_date).toLocaleString()}</td>
                          <td>{selectedSourceCode.approver_date && new Date(selectedSourceCode.approver_date).toLocaleString()}</td>
                          <td>{selectedSourceCode.src_version_content}</td>
                          <td>{selectedSourceCode.requester_user_name || ''}</td>
                          <td>{selectedSourceCode.approver_user_name || ''}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </PanelBody>
              </PanelContainer>
            }
          </div>
        </PanelBody>
      </PanelContainer>
    </React.Fragment>
  )
}

export default EditElement

import FormContainer from 'components/common/container/FormContainer'
import { IProductListFormContentFields } from 'pages/product/list/ProductListPage'
import Input from 'tailwindElement/Input'

interface IProps {
  productList: IProductListFormContentFields
  uploadSelectChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  uploadFileChangeandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadData: {
    step: string
    output_index: string
    file: File
  }
}

const ProductListUploadModalTable = ({
  productList,
  uploadSelectChangeHandler,
  uploadFileChangeandler,
  uploadData,
}: IProps) => {
  return (
    <FormContainer>
      <div className="w-full flex flex-col gap-5 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mt-5">
        <Input.Select
          label="개발단계"
          value={uploadData.step}
          name="step"
          onChange={uploadSelectChangeHandler}>
          <Input.Option value={'KOM'}>SW 개발계획</Input.Option>
          <Input.Option value={'SRR'}>SW 요구사항 분석</Input.Option>
          <Input.Option value={'PDR'}>SW 구조 설계</Input.Option>
          <Input.Option value={'DDR'}>SW 상세 설계</Input.Option>
          <Input.Option value={'CDR'}>SW 구현</Input.Option>
          <Input.Option value={'TRR'}>SW 통합 및 시험</Input.Option>
          <Input.Option value={'SVR'}>체계 통합 및 시험</Input.Option>
          <Input.Option value={'FQR'}>시험 평가</Input.Option>
          <Input.Option value={'PAR'}>규격화 및 인도</Input.Option>
        </Input.Select>

        <Input.Select
          label="산출물 종류"
          value={uploadData.output_index}
          name="output_index"
          onChange={uploadSelectChangeHandler}>
          <Input.Option value={''}>선택</Input.Option>
          {productList[uploadData.step] &&
            productList[uploadData.step].map((item, index_st) => (
              <Input.Option key={index_st} value={item.custom_output_history_index}>
                {item.custom_output_name}
              </Input.Option>
            ))}
        </Input.Select>

        <Input.File
          label="파일"
          name="file"
          onChange={uploadFileChangeandler}
        />
      </div>
    </FormContainer>
  )
}

export default ProductListUploadModalTable

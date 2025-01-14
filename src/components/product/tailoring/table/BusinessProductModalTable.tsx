import FormContainer from 'components/common/container/FormContainer'
import {
  IProductTailoringBusinessAddData,
  IProductTailoringStandardContentFields,
  productTailoringBusinessAddDataStage,
} from 'constant/product/productTailoring'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

interface IProps {
  productAddDataInputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  productAddData: IProductTailoringBusinessAddData
  standardDocument: IProductTailoringStandardContentFields[]
  productAddDataSelectHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  productAddDataClickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const BusinessProductModalTable = ({
  productAddDataInputHandler,
  productAddData,
  standardDocument,
  productAddDataSelectHandler,
  productAddDataClickHandler,
}: IProps) => {
  return (
    <FormContainer className="flex flex-col gap-2">
      <Input.InputLabel
        label="산출물 종류"
        name="output_name"
        onChange={productAddDataInputHandler}
        value={productAddData.output_name}
      />

      <Input.Select
        label="대체되는 산출물"
        onChange={productAddDataSelectHandler}
        value={productAddData.alter_output}>
        <Input.Option value={0}>선택</Input.Option>
        {standardDocument.map((doc, index_st) => (
          <Input.Option key={index_st} value={doc.std_output_index}>
            {doc.std_output_name}
          </Input.Option>
        ))}
      </Input.Select>

      <div className="flex flex-col gap-1">
        <label>개발 단계</label>
        <div className="w-full flex flex-col gap-2">
          {productTailoringBusinessAddDataStage.map((data, index_st) => (
            <Button
              key={index_st}
              className="border"
              variant={
                productAddData.custom_output_stage.includes(data.value)
                  ? 'secondary'
                  : 'unset'
              }
              onClick={productAddDataClickHandler}
              name={data.value}>
              {data.label}
            </Button>
          ))}
        </div>
      </div>

      <Input.InputLabel
        label="약어 이름"
        name="std_output_alias"
        onChange={productAddDataInputHandler}
        value={productAddData.std_output_alias}
      />
    </FormContainer>
  )
}

export default BusinessProductModalTable

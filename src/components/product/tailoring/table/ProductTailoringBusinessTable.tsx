import {
  IProductTailoringBusinessContentFields,
  IProductTailoringStandardContentFields,
} from 'constant/product/productTailoring'
import Input from 'tailwindElement/Input'

interface IProps {
  [key: string]: any
  header: string[]
  column: IProductTailoringBusinessContentFields[]
  activeDocument: number[]
  clickDocumentHandler: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void
  changeCheckHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  changeSelectHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  standardDocument: IProductTailoringStandardContentFields[]
}

const ProductTailoringBusinessTable = ({
  header,
  column,
  activeDocument,
  clickDocumentHandler,
  changeCheckHandler,
  changeSelectHandler,
  standardDocument,
}: IProps) => {
  return (
    <div className="w-full max-h-[660px] mb-3 overflow-y-auto">
      {/* hover 추가 */}
      <table className="w-full m-0 bg-white">
        <thead>
          <tr>
            {header.map((header, index_st) => (
              <th key={index_st} className={`${index_st && "min-w-[200px]"} text-center border p-2`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        {
          column.length ?
          column.map((col, index_st) => (
            <tr
              key={index_st}
              className={`
              ${activeDocument.includes(col.std_output_index) && 'bg-[#dddddd]'}
              ${!activeDocument.includes(col.std_output_index) && 'hover:bg-gray-100'}
              `}>
              <td className="text-center align-middle p-2 border">{index_st + 1}</td>
              <td
                className="align-middle py-2 px-5 border text-center"
                id={col.std_output_index.toString()}
                onClick={clickDocumentHandler}>
                {col.std_output_name}{col.std_output_alias && "("+col.std_output_alias+")"}
              </td>
              <td className="border">
                <div className="flex justify-center gap-2 items-center p-2">
                  <Input.Radio
                    label="예"
                    onChange={changeCheckHandler}
                    name={index_st.toString()}
                    value={'yes'}
                    checked={col.separate_output}
                  />
                  <Input.Radio
                    label="아니오"
                    onChange={changeCheckHandler}
                    name={index_st.toString()}
                    value={'no'}
                    checked={!col.separate_output}
                  />
                  <div>
                    {!col.separate_output && (
                      <Input.Select
                        name={col.std_output_index.toString()}
                        onChange={changeSelectHandler}
                        value={col.replacement_output || ''}>
                        <Input.Option value="">선택</Input.Option>
                        {standardDocument
                          .filter(d => d.std_output_index !== col.std_output_index)
                          .map((doc, index_st) => (
                            <Input.Option key={index_st} value={doc.std_output_index}>
                              {doc.std_output_name}
                            </Input.Option>
                          ))}
                      </Input.Select>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))
          :
          <tr>
            <td colSpan={header.length} className="text-center p-3 border">추가된 산출물 데이터가 없습니다.</td>
          </tr>
        }
        </tbody>
      </table>
    </div>
  )
}

export default ProductTailoringBusinessTable

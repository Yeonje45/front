import {
  IProductTailoringFinalContentFields,
  IProductTailoringStandardContentFields,
} from 'constant/product/productTailoring'

interface IProps {
  header: string[]
  column: IProductTailoringFinalContentFields[]
  standardDocument: IProductTailoringStandardContentFields[]
}

const ProductTailoringFinalTable = ({ header, column, standardDocument }: IProps) => {
  return (
    <div className="w-full max-h-[700px] mb-3 overflow-y-auto">
      <table className="w-full m-0 bg-white" id="product_tailoring_result_table">
        <thead>
          <tr>
            {header.map((header, index_st) => (
              <th key={index_st} className="p-2 text-center border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {column.map((col, index_st) => (
            <tr key={index_st}>
              <td className="p-2 text-center align-middle border">{index_st + 1}</td>
              <td
                className="px-5 py-2 text-center align-middle border"
                id={col.std_output_index.toString()}>
                {col.std_output_name}{col.std_output_alias && "("+col.std_output_alias+")"}
              </td>
              <td className="p-2 text-center align-middle border">
                {col.separate_output === 'NA'
                  ? ''
                  : col.separate_output
                  ? 'O'
                  : col.separate_output === false
                  ? `△(${
                      standardDocument.find(
                        d => d.std_output_index === col.replacement_output,
                      )?.std_output_name
                    } 포함)`
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTailoringFinalTable

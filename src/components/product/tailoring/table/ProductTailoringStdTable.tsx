import { IProductTailoringBusinessContentFields, IProductTailoringStandardContentFields } from 'constant/product/productTailoring'

interface IProps {
  header: string[]
  column: IProductTailoringStandardContentFields[]
  activeDocument: number[]
  documentClickHandler: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void
  businessDocument: IProductTailoringBusinessContentFields[]
}

const ProductTailoringStdTable = ({
  header,
  column,
  activeDocument,
  documentClickHandler,
  businessDocument
}: IProps) => {
  return (
    <div className="w-full max-h-[700px] mb-3 overflow-y-auto">
      <table className="w-full m-0 bg-white">
        <thead>
          <tr>
            {header.map((header, index_st) => (
              <th key={index_st} className="text-center border p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {column.map((col, index_st) => (
            <tr
              key={index_st}
              className={`
                ${(businessDocument.find((d) => d.std_output_index === col.std_output_index) || activeDocument.includes(col.std_output_index)) ? 'bg-[#dddddd]' : "hover:bg-gray-100"}
              `}>
              <td className="text-center align-middle p-2 border">{index_st + 1}</td>
              <td
                className="align-middle py-2 px-5 border text-center"
                id={col.std_output_index.toString()}
                onClick={documentClickHandler}>
                {col.std_output_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTailoringStdTable

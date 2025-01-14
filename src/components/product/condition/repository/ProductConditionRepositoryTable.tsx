import Container from 'tailwindElement/Container'

import {
  productConditionRepositoryFormFieldsHeader,
  productConditionRepositoryFormFieldsColumn,
} from 'constant/product/productConditionRepositoryFormFields'

const ProductConditionRepositoryTable = () => {
  return (
    <Container className="p-2 text-center">
      <table className="w-full border">
        <thead>
          <tr>
            {productConditionRepositoryFormFieldsHeader.map((header, index_st) => (
              <th key={index_st} className="border p-2 text-lg">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productConditionRepositoryFormFieldsColumn.map((column, index_st) => (
            <tr key={index_st}>
              {column.map((row, index_nd) => (
                <td key={index_nd} className="border p-2">
                  {row}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  )
}

export default ProductConditionRepositoryTable

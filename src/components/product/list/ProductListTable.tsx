import { RootState } from 'app/store'
import { IProductListFormContentFields } from 'pages/product/list/ProductListPage'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'

interface IProps {
  className?: string
  header: string[]
  column: IProductListFormContentFields
}

const ProductListTable = ({ className, header, column }: IProps) => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const maxColumn = Math.max(...Object.keys(column).map(key => column[key].length)) | 1

  const [mouseOver, setMouseOver] = useState<string>('')

  const mouseOverHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMouseOver(e.currentTarget.name)
  }

  const mouseOutHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMouseOver('')
  }

  const clickTemplateHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.location.href = `${process.env.REACT_APP_BASE_URL}outputs/template/?project_id=${projectID}&custom_output_history_index=${e.currentTarget.id}`
  }

  const clickNotTemplateHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    Swal.fire({
      icon: 'error',
      title: '템플릿을 제공하지 않는 산출물입니다.',
    })
  }

  const keyData = ['KOM', 'SRR', 'PDR', 'DDR', 'CDR', 'TRR', 'SVR', 'FQR', 'PAR']

  return (
    <div className="table-border max-h-[500px] overflow-y-auto overflow-x-auto pb-2">
      <table className={`${className} w-full table table-border`}>
        <thead className="bg-gray-300 whitespace-nowrap">
					<tr>
						<th className="thin" colSpan={1}>산출물 테일러링</th>
						<th className="thin" colSpan={4}>요구사항 관리</th>
						<th className="thin" colSpan={6}>시험 관리</th>
					</tr>
          <tr>
            {header.map((head, index_st) => (
              <th key={index_st} className={`w-[10%] text-center p-3`}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxColumn }).map((_, index_st) => (
            <tr key={index_st} className="aligin-top">
              {keyData.map((key, index_nd) => (
                <td key={index_nd} className="!p-0">
                  {column[key] &&
                    (column[key][index_st] ? (
                      <Button
                        onClick={
                          column[key][index_st].custom_output_template
                            ? clickTemplateHandler
                            : clickNotTemplateHandler
                        }
                        onMouseOver={mouseOverHandler}
                        onMouseOut={mouseOutHandler}
                        className={`w-full text-center rounded-none whitespace-nowrap ${
                          column[key][index_st].custom_output_template
                            ? ''
                            : '!bg-gray-50 !text-black'
                        }`}
                        id={column[key][index_st].custom_output_history_index.toString()}
                        name={`${index_st}` + `${index_nd}`}>
												
                        {/* {mouseOver == `${index_st}` + `${index_nd}`
                          ? column[key][index_st].custom_output_name
                          : column[key][index_st].custom_output_name.slice(0, 8) +
                            (column[key][index_st].custom_output_name.length > 8
                              ? ' ...'
                              : '')} */}
												{column[key][index_st].custom_output_name}
                      </Button>
                    ) : (
                      ''
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductListTable

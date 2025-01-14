import Input from "tailwindElement/Input"

import { IRADC_FieldData } from "./ReliabilityFieldData"

interface IProps {
  field_row: IRADC_FieldData
  index_check: number
  value: number | undefined
  checked: string | undefined
  handleFactorChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  radioClickHandler: (e: React.MouseEvent<HTMLTableCellElement>) => void
}

const RADCModalTableRow = ({ field_row, index_check, value, checked, handleFactorChange, radioClickHandler }: IProps) => {
  const check = field_row.check[index_check] 
  // Implementation RADC SR Factor
  const disabled_check = ["B/NM", "A/NM", "1-(TDD/SLOC)"]  

  return ( 
    <tr className="even:bg-gray-100 odd:bg-white">
      {field_row.item && index_check === 0 &&
        <td className="p-2 text-center" rowSpan={field_row.question.length}>{field_row.item}</td>
      }
      <td className="p-2 whitespace-pre-line">{field_row.question[index_check]}</td>
      {
        check.input && value !== undefined? 
          (
            <td colSpan={4}>
              <Input
                type="number"
                name={check.input}
                disabled={check.calcul ? disabled_check.includes(check.calcul) : true && check.input.split("_")[1] === "SR"}
                id={`${check.calcul}_${index_check}`}
                value={(Math.round((value) * 10000) / 10000) || 0}
                onChange={handleFactorChange}
              />
            </td>
          )
        :
        checked != undefined ? 
          (
            Object.keys(check).map((key, index_key) => (
              <td key={index_key} onClick={radioClickHandler} >
                <Input.Radio name={check[key]} value={key} checked={key === checked} onChange={handleFactorChange} />
              </td>
            ))	
          )
        :
        null
      }
    </tr>
  )
}

export default RADCModalTableRow
import { useEffect, useState } from "react";

import { IRequirementsTableData, table_03_assort_code } from "pages/requirements-management/output-requirements/sw-requirements-specification/requirementSpecificationEditorData"

interface IProps {
  headerFields: string[]
  requirementsTableData: IRequirementsTableData[]
}

const SRSTable03 = ({headerFields, requirementsTableData}: IProps) => {
  const [data, setData] = useState<IRequirementsTableData[]>([])

  useEffect(() => {    
    if(requirementsTableData && requirementsTableData.length) {
      setData(
        requirementsTableData.map((req, index_st) => (
          {
            ...req,
            req_assort_code: table_03_assort_code[req.req_assort_code]
          }
        ))
      )
    }
  }, [requirementsTableData])

  return (
    <div id="srs_table03" className="hidden">
      { data.length ?
      `
        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;&nbsp;AAA체계 AAC-601K의 요구사항 목록은 다음과 같다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="line-height:30%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 9 요구사항 목록</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;text-align:center;">
          <thead>
          <tr>
          ${
            headerFields.map((th, index_st) => (
              `<th valign="middle" bgcolor="#d6d6d6" style="overflow:hidden;width:180px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%;text-align:center;">${th}</span></p>
             </th>`
            )).flat()
          }
          </tr>
          </thead>
          <tbody>
            ${
              data.map((tr, index_st) => (
                `
                <tr>
                  <td valign="middle" class="HStyle6" style="text-align:center;overflow:hidden;width:180px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                    ${tr.req_number}
                  </td>
                  <td valign="middle" class="HStyle6" style="text-align:center;overflow:hidden;width:180px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                    ${tr.req_title}
                  </td>
                  <td valign="middle" class="HStyle6" style="text-align:center;overflow:hidden;width:180px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                    ${tr.req_assort_code}
                  </td>
                </tr>
                `
              ))
            }
          </tbody>
        </table>
      `
      :
      `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
<p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
      }
    </div>
  )
}

export default SRSTable03
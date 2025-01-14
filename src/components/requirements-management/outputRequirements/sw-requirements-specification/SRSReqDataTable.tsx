import { IRequirementsTableData } from "pages/requirements-management/output-requirements/sw-requirements-specification/requirementSpecificationEditorData"
import { useEffect, useState } from "react"

interface IProps {
  requirementsTableData: IRequirementsTableData[]
  id: string
}
const SRSReqDataTable = ({requirementsTableData, id}: IProps) => {
  const [data, setData] = useState<IRequirementsTableData[]>([])

  useEffect(() => {
    if(requirementsTableData && requirementsTableData.length) {
      setData(requirementsTableData.sort((a, b) => a.req_number > b.req_number ? 1 : -1))
    }
  }, [requirementsTableData])
    
  return (
    <div id={id} className="hidden">
      {
        data.length ?
        `
        
        ${
          data.map((item, index_st) => (
            `
              <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:121px;height:20px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식 별 자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:426px;height:20px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:121px;height:99px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:426px;height:99px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">[${item.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:121px;height:24px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">출&nbsp;&nbsp;&nbsp; 처</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:426px;height:24px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.parent_req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>

        <p class="HStyle2"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
          `
          ))
        }
        `
        :
        `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
<p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
      }
    </div>
  )
}

export default SRSReqDataTable
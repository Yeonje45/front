import { IRequirementsTableData } from "pages/requirements-management/output-requirements/sw-requirements-specification/requirementSpecificationEditorData"
import { useEffect, useState } from "react"

interface IProps {
  requirementsTableData: IRequirementsTableData[]
}
const SRSTable0302 = ({requirementsTableData}: IProps) => {
  const [data, setData] = useState<IRequirementsTableData[]>([])

  useEffect(() => {
    if(requirementsTableData && requirementsTableData.length) {
      setData(requirementsTableData.sort((a, b) => a.req_number > b.req_number ? 1 : -1))
    }
  }, [requirementsTableData])
    
  return (
    <div id="srs_table0302" className="hidden">
      {
        data.length ?
        `
        <p class="HStyle1" style="text-align:center;line-height:0%;"><span style="position:relative;">
        $base64_0302_1
        </span>
        <p class="HStyle1" style="text-align:left;"><p class="HStyle1" style="text-align:left;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        <span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em;color:#0000ff">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;그림 3 AAA CSCI Use Case Diagram</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:left;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" style="overflow:hidden;width:578px;height:72px;border-left: #000000 0.425250pt dotted;border-right: #000000 0.425250pt dotted;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 5.1pt 1.4pt 5.1pt">
            <p class="HStyle2" style="margin-left:12.5pt;margin-right:3.0pt;text-indent:-9.5pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;color:#0000ff;line-height:180%">* </span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.070000em;color:#0000ff;line-height:180%">소프트웨어의 기능 요구사항을 식별하기 위해 Use </span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.190000em;color:#0000ff;line-height:180%">Case Diagram, 다른 표현방법 및 서술방식을 사용할 수 있음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;color:#0000ff;line-height:180%">* Use Case Diagram은 CSCI 이하 단위로도 작성 가능</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:13.7pt;margin-right:3.0pt;text-indent:-10.7pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;color:#0000ff;line-height:180%">* Diagram이 복잡하여 문서 내에서 식별하기 힘든 경우 부록으로 포함하거나 패키지 단위로 작성</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle1" style="text-align:left;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:left;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:left;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.map((item, index_st) => (
            `
          <p class="HStyle1" style="text-align:left;"><span style="position:relative;letter-spacing:0.000000em">3.2.${index_st+1} ${item.req_title}(${item.req_number})</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
  
          <p class="HStyle1" style="text-align:center;">
          <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
          <tr>
              <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:135px;height:27px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식 별 자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
              <td valign="middle" style="overflow:hidden;width:408px;height:27px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
          </tr>
          <tr>
              <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:135px;height:57px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
              <td valign="middle" style="overflow:hidden;width:408px;height:57px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">[${item.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
          </tr>
          <tr>
              <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:135px;height:27px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">출&nbsp;&nbsp;&nbsp; 처</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
              <td valign="middle" style="overflow:hidden;width:408px;height:27px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.parent_req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
          </tr>
          <tr>
              <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:135px;height:27px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">관련 Use Case</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
              <td valign="middle" style="overflow:hidden;width:408px;height:27px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
              <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
              </td>
          </tr>
          </table></p>
          
          <p class="HStyle1" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
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

export default SRSTable0302
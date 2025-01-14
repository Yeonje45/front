import { IRequirementsTableData } from "pages/requirements-management/output-requirements/sw-requirements-specification/requirementSpecificationEditorData"
import { useEffect, useState } from "react"

interface IProps {
  requirementsTableData: IRequirementsTableData[]
}
const SRSTable0301 = ({requirementsTableData}: IProps) => {
  const [data, setData] = useState<IRequirementsTableData[]>([])

  useEffect(() => {
    if(requirementsTableData && requirementsTableData.length) {
      setData(requirementsTableData.sort((a, b) => a.req_number > b.req_number ? 1 : -1))
    }
  }, [requirementsTableData])
    
  return (
    <div id="srs_table0301" className="hidden">
      {
        data.length ?
        `
        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;&nbsp;AAA체계 AAC-601K는 작전모드, 훈련모드, 정비모드로 구분된다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:center;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:26px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식 별 자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:26px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:70px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:70px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].req_title}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">출&nbsp;&nbsp;&nbsp; 처</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].parent_req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">관련 Use Case</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;○ 작전모드 : 실제 업무에 활용</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;○ 훈련모드 : 훈련 목적으로 기능 작동상태만 확인 가능한 상태를 지원한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;○ 정비모드 </span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- </span><span style="position:relative;letter-spacing:-0.040000em">전원인가 자체점검 : 전원인가 시 AAA체계 AAC-601K의 상태를 점검한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2"><span style="position:relative">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 비주기적 자체점검 : 운용자의 선택 또는 정비 시 상태를 점검한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:center;line-height:50%;"><span style="position:relative;">
        $base64_0301_1
        </span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em;color:#0000ff">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;그림 2 상태 및 모드 개념도</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:right;line-height:250%;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" style="overflow:hidden;width:582px;height:32px;border-left: #000000 0.425250pt dotted;border-right: #000000 0.425250pt dotted;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 5.1pt 1.4pt 5.1pt">
            <p class="HStyle14"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">필요에 따라서&nbsp; Use Case diagram 또는 다른 표현이나 서술방식을 사용할 수 있음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle2" style="text-align:right;line-height:250%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.slice(1).length ?
          data.slice(1).map((item, index_st) => (
            `<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:26px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식 별 자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:26px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:70px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:70px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_title}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">출&nbsp;&nbsp;&nbsp; 처</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.parent_req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:105px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">관련 Use Case</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:438px;height:30px;border-left: #000000 1.134000pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
          ))
          :
          ``
        }

        `
        :
        `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
<p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
      }
    </div>
  )
}

export default SRSTable0301
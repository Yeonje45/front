import { IRequirementsTableData } from "pages/requirements-management/output-requirements/sw-requirements-specification/requirementSpecificationEditorData"
import { useEffect, useState } from "react"

interface IProps {
  requirementsTableData: IRequirementsTableData[]
}
const SDDTable0307 = ({requirementsTableData }: IProps) => {
  const [data, setData] = useState<IRequirementsTableData[]>([])

  const key_value = [["performance", "state_and_mode_requirements"], ["external_interface", "internal_interface", "user_interface_requirements"], ["internal_data"], ["safety", "security"], ["environment", "resources"]]

  useEffect(() => {
    if(requirementsTableData && requirementsTableData.length) {
      setData(requirementsTableData.sort((a, b) => a.req_number > b.req_number ? 1 : -1))
    }
  }, [requirementsTableData])
    
  return (
    <div id="sdd_table0307" className="hidden">
      {
        data.length ?
        `
        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.7.1 소프트웨어 기능요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        ${
          data.filter((d) => key_value[0].find((key) => key === d.req_assort_code) ).length ?
          data.filter((d) => key_value[0].find((key) => key === d.req_assort_code)).map((d, i) => (
            `<p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3" style="line-height:50%;"><p class="HStyle3" style="line-height:50%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>

        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 xx 기능요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:106px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항식별자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:436px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">설계결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" rowspan="2" style="overflow:hidden;width:106px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${d.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[요구사항 : ${d.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">${d.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[설계결정사항]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table>
        </p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        `
          ))
          :
          `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
          
        }

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="line-height:80%;"><span style="position:relative;letter-spacing:0.000000em">3.7.2 내․외부 인터페이스 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="line-height:120%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.filter((d) => key_value[1].find((key) => key === d.req_assort_code) ).length ?
          data.filter((d) => key_value[1].find((key) => key === d.req_assort_code)).map((d, i) => (
            `<p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3" style="line-height:50%;"><p class="HStyle3" style="line-height:50%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>

        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 xx 내․외부 인터페이스 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:106px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항식별자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:436px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">설계결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" rowspan="2" style="overflow:hidden;width:106px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${d.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[요구사항 : ${d.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">${d.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[설계결정사항]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table>
        </p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        `
          ))
          :
          `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
          
        }

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="line-height:110%;"><span style="position:relative;letter-spacing:0.000000em">3.7.3 데이터 처리 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="line-height:80%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.filter((d) => key_value[2].find((key) => key === d.req_assort_code)).length ?
          data.filter((d) => key_value[2].find((key) => key === d.req_assort_code)).map((d, i) => (
            `
            <p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3" style="line-height:50%;"><p class="HStyle3" style="line-height:50%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>

        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 xx 데이터 처리 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:106px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항식별자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:436px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">설계결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" rowspan="2" style="overflow:hidden;width:106px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${d.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[요구사항 : ${d.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">${d.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[설계결정사항]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table>
        </p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        `
          ))
          :
          `
          <p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
          
        }

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.7.4 안전․보안 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="line-height:110%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.filter((d) => key_value[3].find((key) => key === d.req_assort_code) ).length ?
          data.filter((d) => key_value[3].find((key) => key === d.req_assort_code)).map((d, i) => (
            `<p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3" style="line-height:50%;"><p class="HStyle3" style="line-height:50%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>

        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 xx 안전․보안 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:106px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항식별자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:436px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">설계결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" rowspan="2" style="overflow:hidden;width:106px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${d.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[요구사항 : ${d.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">${d.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[설계결정사항]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table>
        </p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        `
          ))
          :
          `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
          
        }

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.7.5 환경․컴퓨터자원 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.filter((d) => key_value[4].find((key) => key === d.req_assort_code) ).length ?
          data.filter((d) => key_value[4].find((key) => key === d.req_assort_code)).map((d, i) => (
            `<p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3" style="line-height:50%;"><p class="HStyle3" style="line-height:50%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>

        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 xx 환경․컴퓨터자원 요구 결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>

        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:106px;height:28px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항식별자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:436px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">설계결정사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" rowspan="2" style="overflow:hidden;width:106px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${d.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[요구사항 : ${d.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">${d.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:436px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="margin-left:3.0pt;margin-right:3.0pt;text-indent:0.0pt;line-height:180%;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:180%">[설계결정사항]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table>
        </p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
        `
          ))
          :
          `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
          
        }
        `
        :
        `<p class="HStyle2"><span style="position:relative">해당 사항 없음</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
<p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>`
      }
    </div>
  )
}

export default SDDTable0307
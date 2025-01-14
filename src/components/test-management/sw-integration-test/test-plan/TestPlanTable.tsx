import { ITestPlanTableData } from "pages/test-management/sw-integration-test/test-plan/testPlanEditorData"
import { useEffect, useState } from "react"

interface IProps {
  testPlanTableData: ITestPlanTableData[]
}

const TestPlanTable = ({testPlanTableData}:IProps) => {
  const [data, setData] = useState<ITestPlanTableData[]>([])
    
  useEffect(() => {    
    if(testPlanTableData.length) {
      setData(testPlanTableData)
    }
  }, [testPlanTableData])
  
  return (
    <div id="test_plan_tables" className="hidden">
      {
        data.map((table, index_st) => (
          `
          <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">6.2.1.${index_st+1} ${table.req_title}(${table.req_number})</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" style="overflow:hidden;width:574px;height:283px;border-left: #000000 0.425250pt dotted;border-right: #000000 0.425250pt dotted;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 5.1pt 1.4pt 5.1pt">
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;line-height:180%">○ 사업 고유 식별자로 시험을 식별하고 그 시험과 관계된 아래 정보를 제시한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 시험 목적</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 시험 수준</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 시험 분류</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 요구사항 명세서에서 명세된 자격부여 방법</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:28.6pt;text-indent:-28.6pt;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 본 시험이 적용되는 CSCI 요구사항과 소프트웨어 체계 요구사항의 식별자(이 정보는 6절에서 제시될 수도 있다.)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:29.5pt;text-indent:-29.5pt;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 특수 요구사항(예를 들면, 48시간 동안 연속적으로 시설사용(48 hours of continuous facility time), 무기 시뮬레이션, 시험 확장, 특수 입력이나 데이터베이스 사용</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 기록될 자료 종류</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 사용할 자료 기록/축적/분석 종류</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:27.7pt;text-indent:-27.7pt;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 가정 및 제약사항, 체계나 시험 조건에 예정된 시험 한계타이밍, 인터페이스, 장비, 요원, 데이터베이스 등</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">&nbsp;&nbsp;&nbsp;&nbsp;- 시험과 관련된 안전, 보안, 그리고 프라이버시 고려사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;line-height:180%">○&nbsp; 필요시 4.1절의 일반 정보 참조 가능</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 ${20 + index_st} ${table.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:200px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">항&nbsp; 목</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:353px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">설&nbsp;&nbsp; 명</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">시험목적</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.req_title}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">시험수준</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#0000ff;line-height:150%">${table.stp_detail_level || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">시험분류</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.stp_detail_type || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">요구사항 만족 자격부여 방법</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">속도별 에러 문자 전송시 에러 정정기능 확인</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">요구사항 식별</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">특수한 요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.stp_detail_special || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">기록될 자료 종류</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.stp_detail_record_type || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">사용할 자료 기록/축적/분석 종류</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.stp_detail_data_type || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:37px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">가정 및 제한사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:37px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.stp_detail_constraint || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:200px;height:37px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">안전, 보안등에 관한 고려 사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:37px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${table.stp_detail_safety || "해당사항없음"}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
          `
        ))
      }
    </div>
  )
}

export default TestPlanTable
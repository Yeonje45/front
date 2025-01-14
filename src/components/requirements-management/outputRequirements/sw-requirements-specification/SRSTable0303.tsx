import { IRequirementsTableData } from "pages/requirements-management/output-requirements/sw-requirements-specification/requirementSpecificationEditorData"
import { useEffect, useState } from "react"

interface IProps {
  requirementsTableData: IRequirementsTableData[]
}
const SRSTable0303 = ({requirementsTableData}: IProps) => {
  const [data, setData] = useState<IRequirementsTableData[]>([])

  useEffect(() => {
    if(requirementsTableData && requirementsTableData.length) {
      setData(requirementsTableData.sort((a, b) => a.req_number > b.req_number ? 1 : -1))      
    }
  }, [requirementsTableData])
    
  return (
    <div id="srs_table0303" className="hidden">
      {
        data.length ?
        `
        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.3.1 인터페이스의 식별 및 관계도</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:right;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" style="overflow:hidden;width:574px;height:113px;border-left: #000000 0.425250pt dotted;border-right: #000000 0.425250pt dotted;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 5.1pt 1.4pt 5.1pt">
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;line-height:180%">○ CSCI에서 요구되는 외부 인터페이스를 식별하여 식별자와 함께 기술한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;line-height:180%">○ 각 인터페이스의 식별을 위해 인터페이스 대상 개체(체계, 형상항목, 사용자 등)의 이름, 번호,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 버전, 참조문서를 기술한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;line-height:180%">○ 확정된 인터페이스 특성, 개발 또는 수정될 인터페이스를 구분하여 식별한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;line-height:180%;"><span style="position:relative;font-size:9.0pt;line-height:180%">○ 인터페이스를 나타내기 위해 하나이상의 다이어그램을 제공한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle1" style="text-align:right;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.3.1.1 외부 인터페이스 식별</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:center;">
        <caption align="top">
        <p class="HStyle3"><p class="HStyle3"><span style="position:relative;letter-spacing:0.000000em">표 10 외부 인터페이스 요구목록</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span>
        </p>
        </caption>
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td rowspan="2" valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:106px;height:52px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식별자명</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">(식별자)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td colspan="5" valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:430px;height:25px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">대상체계</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:68px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">체계명</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:136px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">연동관련항목</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:64px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">사용자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:53px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">버전</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:109px;height:28px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">참조문서</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        ${
          data.map((item, index_st) => (
            `<tr>
            <td valign="middle" style="overflow:hidden;width:106px;height:52px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_title}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">(${item.req_number})</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:68px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:136px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:64px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:53px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="text-align:center;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:109px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 1.134000pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6" style="text-align:center;"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
          </tr>
        `
          ))
        }
        </table></p>
        <p class="HStyle1" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.3.1.2 외부 인터페이스 관계도</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.3.2 ${data[0].req_title}(${data[0].req_number})</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:right;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" style="overflow:hidden;width:574px;height:864px;border-left: #000000 0.425250pt dotted;border-right: #000000 0.425250pt dotted;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 5.1pt 1.4pt 5.1pt">
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;"><span style="position:relative;font-size:9.0pt;line-height:160%">○ 인터페이스하는 개체 및 인터페이스를 위해 CSCI에 부과된 요구사항을 기술한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;"><span style="position:relative;font-size:9.0pt;line-height:160%">○ 인터페이스에 포함된 다른 개체의 인터페이스의 특성은 가정 또는 개체가 이것을 반영할 때는&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; “CSCI는 ...... 한다” 로 기술한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;"><span style="position:relative;font-size:9.0pt;line-height:160%">○ 다른 문서(자료사전, 통신프로토콜 표준, 사용자 인터페이스 표준) 참조 가능하다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle2" style="margin-left:3.0pt;margin-right:3.0pt;"><span style="position:relative;font-size:9.0pt;line-height:160%">○ 요구사항에 적합한 순서로 제시하며, 인터페이스하는 개체의 관점으로부터 이러한 특성(크기, 빈도,&nbsp;&nbsp;&nbsp;&nbsp; 다른 자료요소의 특성)의 차이점을 기술한다.</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;- 체계가 할당해야 하는 인터페이스 우선순위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;- </span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.030000em;line-height:160%">구현될 인터페이스 타입에 대한 요구사항 (예 : Real-time data transfer, Storage-and-retrieval&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; of data 등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:27.7pt;text-indent:-27.7pt;line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;- </span><span style="position:relative;font-size:9.0pt;line-height:160%">CSCI가 제공(Provide), 저장(Store), 송신(Send), 접근(Access), 수신(Receive)해야 하는 인터페이스 각각의</span><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%"> 자료요소(Individual data element)에서 요구되는 특성 </span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 이름/식별자: 비 기술적(자연어) 이름, 국방 표준자료요소 이름, 기술적 이름</span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.050000em;line-height:160%">(코드 또는 DB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 에서 변수명, 필드명), 약어나 동의어</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 자료타입(Alphanumeric, Integer.)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 크기와 형식(length and punctuation of character string)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 측정단위(미터, 달러 등) </span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.050000em;line-height:160%">&nbsp; </span><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">• 가능한 값의 범위(0-99)&nbsp;&nbsp;&nbsp;&nbsp; • 정확도(유효숫자 자리수)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 우선순위, 시기, 빈도, 양, 순서, 제약사항 (예 : 자료요소의 수정 또는 업무규칙 적용 등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 보안고려사항&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 근원지(작성/송신 개체)와 수령지(사용/수신)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:80%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:27.7pt;text-indent:-27.7pt;line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;- CSCI가 제공(Provide), 저장(Store), 송신(Send), 접근(Access), 수신(Receive)해야 하는 데이터 집합체(data element assembly : 레코드, 메시지, 파일, 배열, 디스플레이, 레포트)에서 요구&nbsp; 되는 특성</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 이름/식별자: 비 기술적(자연어) 이름, 국방 표준자료요소 이름, 기술적 이름</span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.050000em;line-height:160%">(코드 또는 DB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 에서 변수명, 필드명), 약어나 동의어</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 포함하는 자료요소와 그 구조(Number, Order, Grouping등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 매체(디스크 등)와 그 매체에서의 자료요소/집합체의 구조</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 디스플레이와 출력의 시청각적 특징&nbsp; (색깔, 폰트, 아이콘 및 밝기, 경고음 등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 정렬, 접근특성과 같은 집합체 사이의 관계</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 우선순위, 시기, 빈도, 양, 순서, 제약사항&nbsp; (예 : 자료요소의 수정 또는 업무규칙 적용 등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 보안고려사항,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 근원지(작성/송신 개체)와 수령지(사용/수신 개체)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:80%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:27.7pt;text-indent:-27.7pt;line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;- </span><span style="position:relative;font-size:9.0pt;letter-spacing:-0.030000em;line-height:160%">CSCI가 인터페이스를 위해 사용하는 통신방법(Communication Methods)에서 요구되는 특성</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 식별자,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 통신 링크/밴드/주파수/매체와 그 특성</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 메세지 포맷팅,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 흐름제어(순서 번호 매김, 버퍼할당)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 자료 전달율, 전송하는 간격(정기적/비정기적)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 라우팅, 어드레싱, 명명규칙</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 우선순위, 등급을 포함하는 통신 서비스</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:43.0pt;text-indent:-43.0pt;line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• </span><span style="position:relative;font-size:9.0pt;line-height:160%">안전/보안/우선순위 암호화(Encryption), 사용자 자격부여(User&nbsp; Authentication), 감사(Auditing) 구획화</span><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%"> (Compartmentalization)&nbsp; 등의 고려사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:43.0pt;text-indent:-43.0pt;line-height:80%;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:27.7pt;text-indent:-27.7pt;line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;- CSCI가 인터페이스에서 사용하는 프로토콜 요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 식별자,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 프로토콜의 우선순위/층</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 단편화(Packeting), 재조립 등을 포함하는 패갯팅, 라우팅, 어드레싱</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 규약준수검사, 에러통제, 회복절차,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 연결설정, 유지, 종료를 포함한 동기화</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 상태, 식별, 그 외 레포팅 기능</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle13" style="margin-left:41.3pt;text-indent:-41.3pt;line-height:160%;"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:160%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• 인터페이스 실체의 물리적 호환성, 전압 등과 같은 기타 요구되는 특성(부피, 허용치, 로드, 전압, 플러그 호환성)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle1" style="text-align:right;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle2" style="text-align:center;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식 별 자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">[${data[0].req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">우선순위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">1등급(5개 등급 중)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:33px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">인터페이스 타입</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:33px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">실시간 데이터 전송</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:216px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">자료요소</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:216px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">1. 위치자료(IEIR-DATA-0001)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">구 분</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">내&nbsp;&nbsp;&nbsp; 용</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">자료타입</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">자료타입(Char, Number 등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">크기와 양식</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">자료 크기와 양식</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">측정단위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">측정단위(미터, 달러 등)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">값의 범위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">가능한 값의 범위(0 ～ 99)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">정확도</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">정확도(유효숫자 자리수)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">우선순위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">우선순위, 시기, 빈도, 양, 순서, 제약사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">보안사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">보안고려 사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">송신/수신</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">근원지(작성/송신 개체)와 수령지(사용/수신)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle6"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">2. … …자료(IEIR-DATA-00xx)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:201px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">통신방법</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:201px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">1. 국방망(LAN)(IEIR-COM-0001)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:89px;height:18px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">구 분</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:353px;height:18px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">내&nbsp;&nbsp;&nbsp; 용</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">통신 링크</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">통신 링크/밴드/주파수/매체와 특성</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">메지시 포맷</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">메시지 포맷팅</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">흐름제어</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">흐름제어(순서, 버퍼할당)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">자료전송</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">자료 전달율, 전송 간격</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">전송경로</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">라우팅, 어드레싱, 명명규칙</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">우선순위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">우선순위, 등급을 포함하는 통신 서비스</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">보안사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">안전/보안/우선순위 암호화, 사용자 자격부여, … …</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle6"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">2. … …(IEIR-COM-000x)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:184px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">프로토콜</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:184px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">1. 국방망(LAN)(IEIR-PRO-0001)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:89px;height:18px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">구 분</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:353px;height:18px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">내&nbsp;&nbsp;&nbsp; 용</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">우선순위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">프로토콜의 우선순위/계층</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">전송경로</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">단편화, 재조립 등을 포함하는 패킷팅, 라우팅, 어드레싱</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">검사</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">규약준수 검사, 에러통제, 회복절차</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">동기화</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">연결설정, 유지, 종료를 포함한 동기화</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">레포팅</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">상태, 식별, 그 외 레포팅 기능</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="overflow:hidden;width:89px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">기타특성</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:353px;height:17px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">인터페이스 실체의 물리적 호환성, 전압 등… …</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle6"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">2. … …(IEIR-COM-000x)</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">출&nbsp;&nbsp;&nbsp; 처</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${data[0].parent_req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1" style="text-align:right;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" style="overflow:hidden;width:567px;height:36px;border-left: #000000 0.425250pt dotted;border-right: #000000 0.425250pt dotted;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 5.1pt 1.4pt 5.1pt">
            <p class="HStyle14"><span style="position:relative;font-size:9.0pt;letter-spacing:0.000000em;line-height:150%">＊ 상기 표의 연동에 대한 표시방법은 해당 사업에 적절하게 변경 가능함</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle1" style="text-align:right;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        <p class="HStyle1"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>

        ${
          data.slice(1).map((item, index_st) => (
          `
            <p class="HStyle1"><span style="position:relative;letter-spacing:0.000000em">3.3.${index_st + 3} ${item.req_title}(${item.req_number})</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            
            <p class="HStyle2" style="text-align:center;">
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;table-layout:fixed;">
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">식 별 자</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">요구사항</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:52px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">[${item.req_title}]</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.req_content}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">우선순위</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:33px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">인터페이스 타입</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:33px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:92px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">자료요소</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:92px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            </td>
        </tr>
        <tr>
          <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:92px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
          <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">통신방법</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
          </td>
          <td valign="middle" style="overflow:hidden;width:464px;height:92px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">

          </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:92px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">프로토콜</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:92px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">

            </td>
        </tr>
        <tr>
            <td valign="middle" bgcolor="#d6d6d6"  style="overflow:hidden;width:82px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%">출&nbsp;&nbsp;&nbsp; 처</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:464px;height:32px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle6"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%">${item.parent_req_number}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        </table></p>
        <p class="HStyle2" style="text-align:center;"><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>  
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

export default SRSTable0303
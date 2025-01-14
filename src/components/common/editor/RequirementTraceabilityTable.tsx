import { AccessAxios } from "models";
import { STP_08_tableHeaderfields } from "pages/test-management/sw-integration-test/test-plan/testPlanEditorData";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface IProps {
  id: number | null;
  doc_type: string;
  className?: string;
  headerFields: string[];
}

const RequirementTraceabilityTable = ({id, doc_type, className, headerFields}: IProps) => {
  const [data, setData] = useState<string[][]>([]);

  const postReqTraceabilityData = async () => {
    try {
      await AccessAxios.post(`/documents/version/`, {
        [`${doc_type}_id`]: id,
        doc_type: doc_type
      }).then((res) => {
        if(res.status === 200) {
          res.data.data.map((d:string[]) => {
            d.push(...Array((headerFields.length - d.length)).fill("추후 결정"))
          })          
          setData(res.data.data);
        }
      })
    }
    catch(e:any) {
      console.log(e.message);

      Swal.fire({
        icon: 'error',
        title: '요구사항 추적성 조회 실패',
      })
    }
  }

  useEffect(() => {
    if(id) {
      postReqTraceabilityData();
    }
  }, [id])

  return (
    <div className={`w-full h-[600px] overflow-y-auto ${className}`}>
      <div id="req_traceability_table" className="hidden">
        {`
          <table style="text-align:center;">
            <thead>
              <tr>
                ${
                  headerFields.map((th, index_st) => (
                    `<th valign="middle" bgcolor="#d6d6d6" style="overflow:hidden;width:${550 / headerFields.length}px;height:32px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                     <p class="HStyle4"><span style="position:relative;font-size:10.0pt;letter-spacing:0.000000em;line-height:150%;text-align:center;">${th}</span></p>
                    </th>`
                  )).flat()
                }
              </tr>
            </thead>
            <tbody>
                ${
                  data.length ? data.map((tr, index_st) => (
                    `<tr>
                      ${
                        tr.map((td, index_td) => (
                          `<td valign="middle" style="overflow:hidden;height:44px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                              <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%;text-align:center;">${td}</span></p>
                            </td>`
                        )).flat()
                      }
                    </tr>`
                  )).flat()
                  :
                  `<tr>
                    <td colSpan="3" valign="middle" style="overflow:hidden;height:44px;border-left: #000000 1.134000pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 1.134000pt solid;border-bottom: #000000 1.134000pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
                      <p class="HStyle5"><span style="position:relative;font-size:10.0pt;letter-spacing:-0.030000em;color:#282828;line-height:150%;text-align:center;">요구사항 추적성 데이터가 없습니다.</span></p>
                    </td>
                  </tr>`
                }
            </tbody>
          </table>
        `}
      </div>


      <table className='w-full table-border'>
        <thead>
          <tr>
            {
              headerFields.map((th, index_st) => (
                <th key={index_st}>{th}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            data.length ? data.map((tr, index_st) => (
              <tr key={index_st}>
                {
                  tr.map((td, index_td) => (
                    <td key={index_td}>{td}</td>
                  ))
                }
              </tr>
            ))
            :
            <tr>
              <td colSpan={headerFields.length} className="h-[550px]">
                요구사항 추적성 데이터가 없습니다.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default RequirementTraceabilityTable;
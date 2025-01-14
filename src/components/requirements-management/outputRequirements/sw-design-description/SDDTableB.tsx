import { IClassifData } from "pages/requirements-management/output-requirements/sw-design-description/designDescriptionEditorData"
import { useEffect, useState } from "react"

interface IProps {
  IClassifData: IClassifData[]
}
const SDDTableB = ({ IClassifData }: IProps) => {
  const [data, setData] = useState<IClassifData[]>([])

  useEffect(() => {
    if(IClassifData && IClassifData.length) {
      setData(IClassifData.sort((a, b) => a.classif_id - b.classif_id))
    }
  }, [IClassifData])
    
  return (
    <div id="sdd_tableB" className="hidden">
      {
        data.length ?
          data.map((d) => (
            `
              <tr>
            <td valign="middle" style="overflow:hidden;width:33px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_id}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:78px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_code}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:70px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_csci_name}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_csc_name}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:41px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_unit_identify}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:49px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_unit_category}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:81px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_system_name}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:86px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_part_code}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:54px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_csci_as}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_csc_as}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_sw_type}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_serial_num}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:82px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_tech_doc}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_security}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:46px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_sw_version}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:78px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">${d.classif_update_code}</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
            `
          ))
        :
        `
        <tr>
            <td valign="middle" style="overflow:hidden;width:33px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%">1</span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:78px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:70px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:41px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:49px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:81px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:86px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:54px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:82px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:50px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:46px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
            <td valign="middle" style="overflow:hidden;width:78px;height:42px;border-left: #000000 0.425250pt solid;border-right: #000000 0.425250pt solid;border-top: #000000 0.425250pt solid;border-bottom: #000000 0.425250pt solid;padding:1.4pt 1.4pt 1.4pt 1.4pt">
            <p class="HStyle2" style="text-align:center;"><span style="position:relative;font-size:10.0pt;line-height:160%"></span><span class="hnc_page_break" style="display:relative;word-spacing:-0.5em;">&nbsp;</span></p>
            </td>
        </tr>
        `
      }
    </div>
  )
}

export default SDDTableB
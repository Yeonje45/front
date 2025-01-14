import React from 'react'

import Input from 'tailwindElement/Input'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { inputRequirementsImportData, IinputRequirementsImportContentData } from 'constant/requirement_manage/inputRequirementsFields'

interface IProps {
	tableHead: string[]
	tableBody: string[][]
}

// 요구사항 선택에 따라 추출항목이 달라짐
// 자격부여 방법, 구분은 SRS에만 적용
// 드롭다운 목록 ( 전체, 체계 요구사항, SW 요구사항, SW설계, SW 테스트, 구현)
// 드롭다운 추출할 파일 형식은 ( 엑셀, 한글 )
// 요구사항이 선택이 "전체"이면 엑셀로 추출
const InputRequirementWizardModal = ({ tableHead, tableBody }: IProps) => {
	const [data, setData] = React.useState<IinputRequirementsImportContentData[]>(inputRequirementsImportData.content); // 엑셀 데이터로 변경하고, 변수 명도 수정 해야합니다.

  return (
    <div className="flex flex-col px-4 mx-auto">
      <PanelContainer>
        <PanelHeader title="불러올 데이터 미리보기" />
        <PanelBody>
			    <div className="overflow-x-auto">
				    <table className="w-full">
					    <thead>
						    <tr className="text-center">
							    {tableHead.map((col, index) => (
								    <th key={index} className="p-2 bg-gray-100">
									    {col}
								    </th>
							    ))}
						    </tr>
					    </thead>
					    <tbody>
						    {tableBody.map((row, index) => (
							    <tr key={index} className="text-center even:bg-gray-100 odd:bg-white">
								    {row.map((row_item, index_nd) => (
									    <td key={index_nd} className="p-2 break-words break-all">
										    {row_item}
									    </td>
								    ))}
							    </tr>
						    ))}
					    </tbody>
				    </table>
			    </div>
        </PanelBody>
      </PanelContainer>
    </div>
  )
}

export default InputRequirementWizardModal

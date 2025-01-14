import React, { useEffect, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "app/store"
import { AccessAxios } from "models"

import { IRankIdentificationInputFields, ISaveListData, rankIdentificationDynamicSelectControllabilityFields, rankIdentificationDynamicSelectExposureFields, rankIdentificationDynamicSelectSeverityFields } from "constant/test_manage/sw-reliability-test-plan/rankIdentificationFields"

import PanelBody from "components/common/panels/PanelBody"
import PanelContainer from "components/common/panels/PanelContainer"
import PanelHeader from "components/common/panels/PanelHeader"
import Button from "tailwindElement/Button"
import Input from "tailwindElement/Input"
import Swal from "sweetalert2"
import Modal from "tailwindElement/Modal"
import AppendingFileModal from "./AppendingFileModal"
import SaveListModal from "./SaveListModal"
import { radioClickHandler } from "components/common/util/TableData"

interface IProps {
  rankTableData: IRankIdentificationInputFields[]
  reliability_plan_index: string
  postActiveSaveListData: (reliability_plan_index: string) => void
}

const ReliabilityTestPlanResultTable = ({ rankTableData, reliability_plan_index, postActiveSaveListData }: IProps) => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const [tableData, setTableData] = useState<IRankIdentificationInputFields[]>(rankTableData)
  
  // 등급 식별 데이터 저장 모달 상태
  const [rankSaveModalState, setRankSaveModalState] = useState<boolean>(false)

  // 등급 식별 데이터 저장 모달 데이터
  const [rankModalData, setRankModalData] = useState<{
    reliability_plan_title: string,
    reliability_plan_content: string,
  }>({
    reliability_plan_title: '',
    reliability_plan_content: '',
  })

  // 삭제할 행 데이터
  const [deleteRow, setDeleteRow] = useState<string[]>([])

  // 신뢰성 저장 계획에서 불러온 데이터 상태
  const [saveListData, setSaveListData] = useState<ISaveListData>({
    reliability_plan_index: "",
    reliability_plan_title: "",
    reliability_plan_content: "",
    user_id: "",
    user_name: '',
    reliability_test_plan_update_date: "",
  })

  // 등급 식별 데이터 저장 모달 열기
  const handleRankSaveModal = () => {
    setRankSaveModalState(!rankSaveModalState)

    setRankModalData({
      reliability_plan_title: '',
      reliability_plan_content: '',
    })
  }

  // 신뢰성시험 계획 테이블 데이터 행 삭제 핸들러
  const deleteRowData = () => {
    if(deleteRow.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '삭제할 행을 선택해주세요.',
        timer: 2000,
      })
      return
    }
    else {
      Swal.fire({
        title: '행을 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      }).then((result) => {
        if(result.isConfirmed) {
          console.log(deleteRow);
          
          setTableData((prev) => prev.filter((data) => !deleteRow.includes(data.reliability_test_index.toString())))
          setDeleteRow([])
        }
      })
    }
  }
  
  // 신뢰성시험 계획 테이블 체크박스 핸들러
  const handleDeleteRowCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if(checked) {
      setDeleteRow((prev) => [...prev, name])
    }
    else {
      setDeleteRow((prev) => prev.filter((data) => data !== name))
    }
  }

  // 동적시험 드롭다운 데이터 핸들러
  const hanldeDydamicSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const [name, index] = e.target.name.split('_')

    setTableData((prev) => {
      const setData = [...prev]
      setData[parseInt(index)][name] = value

      const dynamicData = setData[parseInt(index)]

      // 결함 영향도, 결함 발생 빈도, 결함 제어 가능성 값이 모두 존재할 때 동적시험 레벨 데이터를 가져옴
      if(dynamicData.severity && dynamicData.exposure && dynamicData.controllability) {
        getDynamicLevelData(parseInt(index))
      }

      return setData
    })
  }

  // 등급 식별 모달 박스 핸들러
  const handleSaveModalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setRankModalData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 목표값 Input 박스 핸들러
  const handleTargetValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setTableData((prev) => {
      const setData = [...prev]
      setData[parseInt(name)].target_value = parseInt(value) > 100 ? '100' : parseInt(value) < 0 ? '0' : value
      return setData
    })
  }

  // 동적시험 레벨 데이터 호출
  const getDynamicLevelData =  async (index: number) => {
    try {
      const {severity, exposure, controllability} = tableData[index]
      
      await AccessAxios.post('reliability/grade/', {
        severity: severity,
        exposure: exposure,
        controllability: controllability,
      }).then((res) => {
        setTableData((prev) => {
          const setData = [...prev]
          setData[index].dynamic_test_level = res.data.data.dynamic_test_level
          return setData
        })
      })
    }
    catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '동적시험 레벨 데이터를 불러오는데 실패했습니다.',
        timer: 2000,
      })
    }
  }

  // 등급 식별 테이블 데이터 저장 핸들러
  const putRankTypeData = async () => {
    try {
      if(rankModalData.reliability_plan_title === "") {
        Swal.fire({
          icon: 'warning',
          title: '제목을 입력해주세요.',
          timer: 2000,
        })
        return
      }
      
      if(rankModalData.reliability_plan_content === "") {
        Swal.fire({
          icon: 'warning',
          title: '내용을 입력해주세요.',
          timer: 2000,
        })
        return
      }
      
      if(tableData.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '저장된 대상식별 및 등급식별 데이터가 존재하지 않습니다.',
          timer: 2000,
        })
        return
      }

      await AccessAxios.put('/reliability/grade/', {
        project_id: projectID,
        reliability_plan_title: rankModalData.reliability_plan_title,
        reliability_plan_content: rankModalData.reliability_plan_content,
        reliability_tests: tableData,
      }).then((res) => {        
        handleRankSaveModal()
        
        Swal.fire({
          icon: 'success',
          title: '등급 식별 데이터를 저장했습니다.',
          timer: 2000,
        })
      })
    }
    catch(error) {
      Swal.fire({
        icon: 'error',
        title: '등급 식별 데이터를 저장하는데 실패했습니다.',
        timer: 2000,
      })
      console.error(error)
    }
  }

  // 신뢰성 시험 계획 목록에서 불러올 때마다 불러온 목록의 저장 데이터 핸들러
  const handleSaveListData = (data: ISaveListData) => {
    setSaveListData(data)
  }  
  
  useEffect(() => {
    if(rankTableData) {
      setTableData(rankTableData)
    }
  }, [rankTableData])

  return (
    <React.Fragment>
      <Modal isOpen={rankSaveModalState} size='md'>
        <Modal.Head>신뢰성 시험 계획 저장</Modal.Head>
        <Modal.Body>
          <Input.InputLabel value={rankModalData.reliability_plan_title} label="제목" name="reliability_plan_title" onChange={handleSaveModalInputChange} />
          <Input.Textarea value={rankModalData.reliability_plan_content} label="내용" name="reliability_plan_content" onChange={handleSaveModalInputChange} rows={5} className='overflow-hidden resize-none'/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={putRankTypeData}>저장</Button>
          <Button onClick={handleRankSaveModal}>취소</Button>
        </Modal.Footer>
      </Modal>
      <PanelContainer>
        <PanelHeader title="3. 결과" />
        <PanelBody>
        <div>
          <div className="flex justify-between py-2">
            <div className="flex gap-5">
              <h3 className="text-xl">제목 : { saveListData.reliability_plan_title || "-"}</h3>
              <h3 className="text-xl">일시 : { saveListData.reliability_test_plan_update_date ? `${saveListData.reliability_test_plan_update_date.slice(0, 10)} ${saveListData.reliability_test_plan_update_date.slice(11, 19)}` : "-" }</h3>
            </div>
            <div className="flex gap-2">
              <Button variant="danger" onClick={deleteRowData}>삭제</Button>
              <Button onClick={handleRankSaveModal}>저장</Button>
              <AppendingFileModal reliability_plan_index={reliability_plan_index}/>
              <SaveListModal postActiveSaveListData={postActiveSaveListData} handleSaveListData={handleSaveListData}/>
            </div>
          </div>
          <div className="h-[500px] overflow-y-auto">
            <table className="w-full table-border text-lg">
              <thead>
                <tr>
                  <th rowSpan={3}>
                    삭제
                  </th>
                  <th rowSpan={3}>
                    시험 단위명
                  </th>
                  <th rowSpan={3}>출처</th>
                  <th rowSpan={3}>언어</th>
                  <th colSpan={9}>정적시험</th>
                  <th colSpan={7}>동적시험</th>
                </tr>
                <tr>
                  <th colSpan={3}>코딩규칙</th>
                  <th colSpan={3}>취약점 점검</th>
                  <th colSpan={3}>코드 메트릭</th>
                  <th rowSpan={2}>
                    결함 영향도
                  </th>
                  <th rowSpan={2}>
                    결함 발생빈도
                  </th>
                  <th rowSpan={2}>결함 제어 가능성</th>
                  <th rowSpan={2}>동적시험 레벨</th>
                  <th rowSpan={2}>목표값</th>
                  <th rowSpan={2}>도구</th>
                  <th rowSpan={2}>버전</th>
                </tr>
                <tr>
                  <th>적용기준</th>
                  <th>도구</th>
                  <th>버전</th>
                  <th>적용기준</th>
                  <th>도구</th>
                  <th>버전</th>
                  <th>적용기준</th>
                  <th>도구</th>
                  <th>버전</th>
                </tr>
              </thead>
              <tbody>
                { 
                  tableData.length ?
                  (
                    tableData.map((data, index_st) => (
                      <tr key={data.reliability_test_index}>
                        <td onClick={radioClickHandler}>
                          <Input.Checkbox name={data.reliability_test_index} onChange={handleDeleteRowCheckBoxChange} />
                        </td>
                        <td>{data.reliability_test_unit_name}</td>
                        <td>{data.target_sw}</td>
                        <td>{data.reliability_test_language}</td>
                        <td>{data.coding_rule_name || "N/A"}</td>
                        <td>{data.coding_rule_tool || "N/A"}</td>
                        <td>{data.coding_rule_version || "N/A"}</td>
                        <td>{data.secure_name || "N/A"}</td>
                        <td>{data.secure_tool || "N/A"}</td>
                        <td>{data.secure_version || "N/A"}</td>
                        <td>{data.code_metric_name || "N/A"}</td>
                        <td>{data.code_metric_tool || "N/A"}</td>
                        <td>{data.code_metric_version || "N/A"}</td>
                        <td>
                          <Input.SelectGroup>
                            <Input.Select value={data.severity || ""} name={`severity_${index_st}`} onChange={hanldeDydamicSelectChange}>
                              <Input.Option value="">N/A</Input.Option>
                              {
                                rankIdentificationDynamicSelectSeverityFields.map((option, index_op) => (
                                  <Input.Option key={index_op} value={option}>{option}</Input.Option>
                                ))
                              }
                            </Input.Select>
                          </Input.SelectGroup>
                        </td>
                        <td>
                          <Input.SelectGroup>
                            <Input.Select value={data.exposure || ""} name={`exposure_${index_st}`} onChange={hanldeDydamicSelectChange}>
                              <Input.Option value="">N/A</Input.Option>
                              {
                                rankIdentificationDynamicSelectExposureFields.map((option, index_op) => (
                                  <Input.Option key={index_op} value={option}>{option}</Input.Option>
                                ))
                              }
                            </Input.Select>
                          </Input.SelectGroup>
                        </td>
                        <td>
                          <Input.SelectGroup>
                            <Input.Select value={data.controllability || ""} name={`controllability_${index_st}`} onChange={hanldeDydamicSelectChange}>
                              <Input.Option value="">N/A</Input.Option>
                              {
                                rankIdentificationDynamicSelectControllabilityFields.map((option, index_op) => (
                                  <Input.Option key={index_op} value={option}>{option}</Input.Option>
                                ))
                              }
                            </Input.Select>
                          </Input.SelectGroup>
                        </td>
                        <td>{data.dynamic_test_level || "N/A"}</td>
                        <td>
                          <div className='flex items-center gap-1'>
                          <Input className='!w-16' value={data.target_value} name={index_st.toString()} type='number' onChange={handleTargetValueInputChange} />%
                          </div>
                        </td>
                        <td>
                          {data.dynamic_test_tool|| "N/A"}
                        </td>
                        <td>
                          {data.dynamic_test_version|| "N/A"}
                        </td>
                      </tr>
                    ))
                  )
                  :
                  (<tr>
                    <td colSpan={20} className='w-full h-[300px] text-gray-500'>대상 식별 데이터가 존재하지 않습니다.<br/>대상 식별 데이터를 입력해주세요.</td>
                  </tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
        </PanelBody>
      </PanelContainer>
    </React.Fragment>
  )
}

export default ReliabilityTestPlanResultTable
import { useEffect, useState } from 'react'

import PanelBody from 'components/common/panels/PanelBody'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import {
  ITestExecutionTargets,
  ITestRequirement,
  testExecutionRecordsTableHeaderFields,
  testHistoryAppendSelectFields,
} from 'constant/test_manage/test-execution-records/testExecutionRecordsFields'
import Button from 'tailwindElement/Button'
import Container from 'tailwindElement/Container'
import Input from 'tailwindElement/Input'
import ExecutionReliabilityResultModal from 'components/test-management/test-execution-records/ExecutionReliabilityResultModal'
import ExecutionRequirementResultModal from 'components/test-management/test-execution-records/ExecutionRequirementResultModal'
import ExecutionTestDataModal from 'components/test-management/test-execution-records/ExecutionTestDataModal'
import TestExecutionRecordsAppendModal from 'components/test-management/test-execution-records/TestExecutionRecordsAppendModal'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { TestExecutionRecordsSrcVersionList, TestExecutionRecordsStdVersionList } from 'constant/test_manage/testImportTableFields'
import { radioClickHandler } from 'components/common/util/TableData'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { PlayFill } from 'react-bootstrap-icons'
import { useLocation } from 'react-router-dom'

export interface TestExecutionRecordsTableColumnsFields {
  baseline_id: number
  baseline_number: string
  src_version_id: number
  src_version_name: number
  std_id: number
  std_name: number // 시험 산출물 버전 넘버 ex) STP_V1
  test_exe_id: number // PK
  test_exe_category: string
  test_exe_name: string
  test_exe_date: string
  test_exe_location: string
  test_performer_name: string
  test_performer_id: string
  test_observer_id: string
  test_execution_targets: ITestExecutionTargets[]
}

export interface TestExecutionRecordsPerformerList {
  user_id: string
  user_name: string
}

const TestExecutionRecordsPage = () => {
  const location = useLocation();

  const project_id = useSelector((state: RootState) => state.project.project.project_id)
  const user = useSelector((state: RootState) => state.user)
  
    // step 단계 추출
    const searchParams = new URLSearchParams(location.search)
    const step = searchParams.get('step')

  // 시험 수행 기록 목록
  const [tableData, setTableData] = useState<TestExecutionRecordsTableColumnsFields[]>(
    [],
  )

  // 시험 수행자 목록
  const [performerList, setPerformerList] = useState<TestExecutionRecordsPerformerList[]>([])

  // 소스코드 버전 목록
  const [srcVersionList, setSrcVersionList] = useState<TestExecutionRecordsSrcVersionList[]>([])

  // 시험 절차 목록
  const [stdVersionList, setStdVersionList] = useState<TestExecutionRecordsStdVersionList[]>([])

  // 삭제할 시험 수행 기록 목록
  const [delTableData, setDelTableData] = useState<number[]>([])

  const getTestExecutionRecords = async () => {
    try {
      await AccessAxios.get('/integration/execute/?project_id=' + project_id).then((res) => {
        // 시험 수행 기록 목록
        setTableData(res.data.data.test_execution_list)
        
        // 시험 수행자 목록
        setPerformerList(res.data.data.user_list)
        
        // 소스코드 버전 목록
        setSrcVersionList(res.data.data.src_version_list)

        // 시험 절차 목록
        
        
        setStdVersionList(() => {
          const disabledData = res.data.data.test_execution_list.map((d:any) => ({baseline_id: d.baseline_id, std_id: d.std_id}))
          return res.data.data.std_version_list.map((d:any) => {
            const isDisabled = disabledData.find((data:any) => data.baseline_id === d.baseline_id && data.std_id === d.std_id) ? true : false
            return({
              ...d,
              isDisabled: isDisabled
            })
          })
        })
        
      })
    }
    catch(error:any) {
      console.log(error.message);

      Swal.fire({
        icon: 'error',
        title: '시험 수행 기록 목록 조회 실패',
      })      
    }
  }

  const delTableDataHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    
    if(e.target.checked) {
      setDelTableData([...delTableData, Number(name)])
    }
    else {
      setDelTableData(delTableData.filter((d) => d !== Number(name)))
    }
  }

  const delTestExecutionRecords = async () => {
    try {
      if(delTableData.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '삭제할 시험 수행 기록을 선택해주세요',
        })
        return
      }

      await AccessAxios.delete('/integration/execute/', {
        data: {
          exe_del_list: delTableData
        }
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '시험 수행 기록 삭제 성공',
          })

          getTestExecutionRecords()
          setDelTableData([])
        }
      })
    }
    catch(error:any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: '시험 수행 기록 삭제 실패',
      })
    }
  }

  const handleTestProcedureClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name
    const res = await AccessAxios.get(`/documents/editmode/?project_id=${project_id}&edit_doc_type=std`)
    
    if(res.data.data.user_id === user.user.user_id || res.data.data.user_id === null) {
      if(res.data.data.user_id === null) {
        await AccessAxios.patch(`/documents/editmode/`, {
          project_id: project_id,
          edit_doc_type: 'std',
          is_edit: true,
        })
      }

      Swal.fire({
        icon: 'info',
        title: '시험 대상 목록에 대한 시험을 시작합니다.',
        text: '※시험 도중 페이지 이동 및 로그아웃 등이 제한됩니다.※',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',      
      }).then((res) => {
        if(res.isConfirmed) {        
          const test_execution_data = {
            test_exe_id: Number(name),
            test_exe_name: tableData.find((d) => d.test_exe_id === Number(name))!.test_exe_name,
            baseline_id: tableData.find((d) => d.test_exe_id === Number(name))!.baseline_id,
            baseline_number: tableData.find((d) => d.test_exe_id === Number(name))!.baseline_number,
            std_id: tableData.find((d) => d.test_exe_id === Number(name))!.std_id,
            std_name: tableData.find((d) => d.test_exe_id === Number(name))!.std_name,
          }
  
          localStorage.setItem('test_execution_data', JSON.stringify(test_execution_data))
          window.location.href = `/test-management/sw-integration-test/test-description?${project_id}&step=${step}`
        }
      })
    }
    else {
      Swal.fire({
        icon: 'info',
        title: '시험 대상 목록에 대한 시험을 시작할 수 없습니다.',
        text: '다른 사용자가 문서를 편집 중입니다.',
      })
    }

  }

  useEffect(() => {
    getTestExecutionRecords()
  }, [])

  return (
    <PanelContainer>
      <PanelHeader
        title="시험 결과 관리"
        className="flex justify-between items-center"
        rightElement={
          <Input.SelectGroup className="flex justify-between gap-2">
            <Input.Select>
              <Input.Option value="">전체</Input.Option>
              {testExecutionRecordsTableHeaderFields.map((option, index_st) => (
                <Input.Option key={index_st} value={index_st}>
                  {option}
                </Input.Option>
              ))}
            </Input.Select>
            <Input placeholder="검색어를 입력하세요." />
            <Button className="w-1/4">찾기</Button>
          </Input.SelectGroup>
        }
      />

      <PanelBody>
        <Container fluid className="flex flex-col gap-3">
          <div className="flex justify-end items-center gap-2">
            <TestExecutionRecordsAppendModal getTestExecutionRecords={getTestExecutionRecords} performerList={performerList} stdVersionList={stdVersionList} srcVersionList={srcVersionList}/>
            <Button onClick={delTestExecutionRecords}>삭제</Button>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-border">
              <thead>
                <tr>
                  {testExecutionRecordsTableHeaderFields.map((th, index_st) => (
                    <th className='whitespace-pre' key={index_st}>
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {
                  tableData.length ?
                    tableData.sort((a, b) =>  new Date(a.test_exe_date).getTime() -new Date(b.test_exe_date).getTime()).map((tr, index_st) => (
                    <tr key={index_st}>
                      <td onClick={radioClickHandler} className='!w-4'>
                        <Input.Checkbox name={`${tr.test_exe_id}`} onChange={delTableDataHandler} />
                      </td>
                      <td>
                        {tr.test_execution_targets.length ?
                          <button className='w-full text-green-600 flex items-center justify-center' name={tr.test_exe_id.toString()} onClick={handleTestProcedureClick}>
                            <PlayFill size={30} className='!p-0' />
                          </button>
                            :
                          "준비중"
                        }
                      </td>
                      <td>{tr.test_exe_category ? testHistoryAppendSelectFields.find((d) => d.value === tr.test_exe_category)?.label : ""}</td>
                      <td>{tr.test_exe_name}</td>
                      <td>V{tr.std_name}</td>
                      <td>{tr.baseline_number}</td>
                      <td>{tr.src_version_name}</td>
                      <td>{tr.test_exe_date}</td>
                      <td>{tr.test_exe_location}</td>
                      <td>{tr.test_performer_name}</td>
                      <td>{tr.test_observer_id}</td>
                      <td>
                        <ExecutionRequirementResultModal test_exe_id={tr.test_exe_id.toString()} getTestExecutionRecords={getTestExecutionRecords}/>
                      </td>
                      <td>
                        <ExecutionReliabilityResultModal test_exe_id={tr.test_exe_id.toString()} />
                      </td>
                      <td>
                        <ExecutionTestDataModal test_exe_id={tr.test_exe_id.toString()} />
                      </td>
                      {/* <td>
                        <ExecutionIssueModal index={index_st.toString()} />
                      </td> */}
                    </tr>
                  ))
                  :
                  (
                    <tr>
                      <td colSpan={testExecutionRecordsTableHeaderFields.length} className="text-center h-56">
                      현재 추가된 시험 데이터가 없습니다.
                      <br/>
                      시험 데이터를 등록해주세요.
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </Container>
      </PanelBody>
    </PanelContainer>
  )
}

export default TestExecutionRecordsPage

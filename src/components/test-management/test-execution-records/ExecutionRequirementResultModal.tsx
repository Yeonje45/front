import { radioClickHandler } from 'components/common/util/TableData'
import { ITestRequirement, testResultFields } from 'constant/test_manage/test-execution-records/testExecutionRecordsFields'
import { AccessAxios } from 'models'
import { ITestProcedure } from 'pages/test-management/sw-integration-test/test-description/testDescriptionEditorData'
import { useEffect, useState } from 'react'
import { CaretLeftFill, CaretRightFill } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import Modal from 'tailwindElement/Modal'

interface IExecutionRequirementResultModal {
  test_exe_id: string
  getTestExecutionRecords: () => void
}

const ExecutionRequirementResultModal = ({
  test_exe_id,
  getTestExecutionRecords
}: IExecutionRequirementResultModal) => {
  // 해당하는 id를 가진 Modal만 열기 위한 상태
  const [isOpen, setIsOpen] = useState<string>('')
  
  // 시험 요구사항 식별자 데이터 : 시험 요구사항 테이블 데이터
  const [testRequirement, setTestRequirement] = useState<ITestRequirement[]>([])
  // 선택한 요구사항 시험 식별자 데이터
  const [selectedTestRequirement, setSelectedTestRequirement] = useState<number[]>([])

  // 시험 대상 목록 식별자 데이터 : 시험 대상 목록 테이블 데이터
  const [testTargetList, setTestTargetList] = useState<ITestRequirement[]>([])

  // 시험 대상 목록 테이블 체크박스 선택 후 삭제할 데이터
  const [delTestTargetList, setDelTestTargetList] = useState<number[]>([])

  // 선택한 시험 대상목록 식별자 데이터
  const [selectedTestTarget, setSelectedTestTarget] = useState<ITestRequirement | null>(null)

  // 시험 절차 미리보기 데이터
  const [testProcedurePreview, setTestProcedurePreview] = useState<ITestProcedure[]>([])

  // 시험 요구사항 식별자 테이블 클릭 이벤트
  const testRequirementClickHandler = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const {id} = e.currentTarget
    
    if(selectedTestRequirement.includes(parseInt(id))) {
      setSelectedTestRequirement(selectedTestRequirement.filter((item) => item !== parseInt(id)))
    }
    else {
      setSelectedTestRequirement([...selectedTestRequirement, parseInt(id)])
    }
  }

  // 시험 요구사항 식별자 데이터 선택 후 시험 대상 목록 테이블에 추가하는 이벤트 핸들러
  const testTargetListAddBtnClickHandler = () => {
    if(selectedTestRequirement.length) {
      const tempTestTargetList = testRequirement.filter((item) => selectedTestRequirement.includes(item.req_id))
      setTestTargetList((prev) => {
        let setData = [...prev, ...tempTestTargetList]
        setData = setData.filter((item, index, self) => self.findIndex((t) => t.req_id === item.req_id) === index)

        return setData
      })

      setSelectedTestRequirement([])
    }
    else {
      Swal.fire({
        icon: 'info',
        title: '시험 요구사항 식별자를 선택해주세요.',
      })
    }
  }

  // 시험 대상 목록 테이블 체크박스 선택 후 삭제 이벤트 핸들러
  const testTargetListDelBtnClickHandler = () => {
    if(delTestTargetList.length) {
      setTestTargetList(testTargetList.filter((item) => !delTestTargetList.includes(item.req_id)))
      setDelTestTargetList([])
    }
    else {
      Swal.fire({
        icon: 'info',
        title: '삭제할 시험 대상 목록을 선택해주세요.',
      })
    }
  }

  // 시험 대상 목록 체크박스 이벤트 핸들러
  const testTargetListCheckBoxChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target
    
    if(checked) {
      setDelTestTargetList([...delTestTargetList, parseInt(name)])
    }
    else {
      setDelTestTargetList(delTestTargetList.filter((item) => item !== parseInt(name)))
    }
  }

  // 시험 절차 미리보기 선택 식별자 아이디 이벤트 핸들러
  const getTestProcedurePreview = async (e: React.MouseEvent<HTMLTableCellElement>) => {
    try {
      const req_id = e.currentTarget.id
      setSelectedTestTarget(testTargetList.find((item) => item.req_id === parseInt(req_id)) || null)

      await AccessAxios.get(`/integration/target/?test_exe_id=${test_exe_id}&req_id=${req_id}`).then((res) => {
        setTestProcedurePreview(() => {
          let setData = res.data.data
          return setData.sort((a: ITestProcedure, b: ITestProcedure) => a.std_procedure_order - b.std_procedure_order) || []
        })

        if(res.data.data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: '해당 식별자의 시험 절차 미리보기 데이터가 존재하지 않습니다.',
          })
        }
      })
    }
    catch(error:any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: '시험 절차 미리보기 조회 실패',
      })
    }
  }

  const testProcedurePreviewHandleShow = () => {
    setTestProcedurePreview([])
  }

  const handleShow = () => {
    setIsOpen(isOpen ? '' : test_exe_id)
  }

  const getTestRequirement = async () => {
    try {
      await AccessAxios.post('/integration/target/', {
        test_exe_id: test_exe_id
      }).then((res) => {
        setTestRequirement(res.data.data.sort((a:ITestRequirement, b:ITestRequirement) => a.req_number > b.req_number ? 1 : -1))
      })
    }
    catch(error:any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: '시험대상 요구사항 식별자 조회 실패',
      })
    }
  }

  const editTestProcedure = async () => {
    try {
      await AccessAxios.patch('/integration/target/', {
        test_exe_id: test_exe_id,
        req_target_list: testTargetList.map((item, i) => ({
          req_id: item.req_id,
          test_target_order: i + 1
        }))
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '시험 대상 목록 편집 성공',
          })

          getTestExecutionRecords()
        }
      })
    }
    catch(e:any) {
      console.log(e.message);

      Swal.fire({
        icon: 'error',
        title: '시험 대상 목록 편집 실패',
      })      
    }
  }

  const getTestProcedure = async () => {
    try {
      await AccessAxios.get(`/integration/run/?test_exe_id=${test_exe_id}`).then((res) => {
        if(res.status === 200) {
          if(res.data.data.length) {
            setTestTargetList(() => res.data.data)
          }          
        }
      })
    }
    catch(e:any) {
      console.log(e.message);

      Swal.fire({
        icon: 'error',
        title: '시험 대상 목록 조회 실패',
      })      
    }
  }

  useEffect(() => {
    if(isOpen) {
      getTestRequirement()
      getTestProcedure()
    }
    if(!isOpen) {
      setTestTargetList([])
      testProcedurePreviewHandleShow()
    }
  }, [isOpen])

  return (
   <div>
      <Button onClick={handleShow}>입력</Button>

     <Modal isOpen={isOpen === test_exe_id} size={testProcedurePreview.length ? "xl" : 'lg'} >
      <Modal.Head>시험대상 요구사항 편집</Modal.Head>
      <Modal.Body className='flex justify-center gap-4'>
        <div className='flex justify-center gap-4'>
          <div className='flex flex-col gap-14 border p-4 rounded-md'>
            <h1 className='font-bold text-xl'>시험 요구사항</h1>
            <div className='h-[500px] overflow-y-auto'>
              <table className='table table-border'>
                <thead>
                  <tr>
                    <th>
                      시험 식별자
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    testRequirement.map((iden, index_st) => (
                      <tr key={index_st}>
                        <td 
                          className={`!text-start hover:bg-gray-100 cursor-pointer
                            ${selectedTestRequirement.includes(iden.req_id) ? "!bg-[#dddddd]" : ""} 
                            ${testTargetList.find((d) => d.req_id === iden.req_id) ? "!bg-gray-200" : ""}
                          
                          `}
                          id={iden.req_id.toString()}
                          onClick={testRequirementClickHandler}
                        >
                        [{iden.req_number}] {iden.req_title}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className='flex items-center'>
            <Button
              className="mt-[10%] h-14 hover:bg-gray-200 border"
              variant="light"
              onClick={testTargetListAddBtnClickHandler}
            >
              <CaretRightFill size={30} />
            </Button>
          </div>
          <div className='flex flex-col gap-2 !m-0 border p-4 rounded-md'>
            <h1 className='font-bold text-xl'>시험 대상 목록</h1>
            <div className='w-full flex justify-end gap-2'>
              <Button variant='danger' onClick={testTargetListDelBtnClickHandler}>삭제</Button>
            </div>
            <div className='h-[500px] overflow-y-auto'>
              <table className='table table-border'>
                <thead className="whitespace-nowrap">
                  <tr>
                    <th>
                      선택
                    </th>
                    <th>
                      시험 순서
                    </th>
                    <th>
                      시험 식별자
                    </th>
                    <th>
                      시험 결과
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testTargetList.length ?
                    testTargetList.map((iden, index_st) => (
                      <tr key={index_st}>
                        <td onClick={radioClickHandler}>
                          <Input.Checkbox name={iden.req_id.toString()} checked={delTestTargetList.includes(iden.req_id)} onChange={testTargetListCheckBoxChangeHandler} />
                        </td>
                        <td>
                          {index_st + 1}
                        </td>
                        <td className='!text-start cursor-pointer hover:bg-gray-100' id={iden.req_id.toString()} onClick={getTestProcedurePreview}>
                        [{iden.req_number}] {iden.req_title}
                        </td>
                        <td>
                          {testResultFields[`${iden.test_target_result}`]}
                        </td>
                      </tr>
                    ))
                    :
                    <tr>
                      <td colSpan={4} className='h-[450px]'>
                        현재 시험 대상 목록 데이터가 없습니다.
                        <br/>
                        시험 요구사항에서 시험 식별자를 추가해주세요.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div className='w-full flex justify-start'>
              <Button onClick={editTestProcedure}>편집 내용 저장</Button>
            </div>
          </div>
        </div>
        {
          testProcedurePreview.length ? 
          <div className='w-1/3 flex flex-col gap-3.5 !m-0 border p-4 rounded-md'>
            <h1 className='font-bold text-xl'>시험 절차 미리보기</h1>
            <h2>
              {
                `[${selectedTestTarget?.req_number}] ${selectedTestTarget?.req_title}`
              }
            </h2>
            <div className='w-full flex justify-between'>
              <div className='flex items-center -ms-4 pe-2'>
                <Button
                  onClick={testProcedurePreviewHandleShow}
                  className="hover:bg-gray-200 border flex justifty-center items-center !p-0 rounded-s-none"
                  variant="light"
                >
                  <CaretLeftFill size={30} className='my-10' />
                </Button>
              </div>
              <div className='w-full h-[500px] overflow-y-auto'>
                <table className='w-full table table-border'>
                <thead>
                  <tr className='whitespace-nowrap'>
                    <th>
                      시험 절차
                    </th>
                    <th>
                      결과
                    </th>
                    <th>
                      이슈
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    testProcedurePreview.map((iden, index_st) => (
                      <tr key={index_st}>
                        <td className='!text-start'>
                          {iden.std_procedure_content}
                        </td>
                        <td>
                          {testResultFields[`${iden.std_procedure_result}`]}
                        </td>
                        <td>
                          {iden.std_procedure_issue}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
                </table>
              </div>
            </div>
          </div>
          :
          <></>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleShow}>닫기</Button>
      </Modal.Footer>
    </Modal>
   </div>
  )
}

export default ExecutionRequirementResultModal

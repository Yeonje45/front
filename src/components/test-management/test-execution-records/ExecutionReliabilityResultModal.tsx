import { testResultDynamicToolReportDynamicTableHeaderFields, testResultDynamicToolReportStaticTableHeaderFields, testResultReasonTableHeaderFields } from 'constant/test_manage/test-execution-records/testExecutionRecordsFields'
import { AccessAxios } from 'models'
import React, { useEffect, useRef, useState } from 'react'
import { X } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import Modal from 'tailwindElement/Modal'

interface IExecutionReliabilityResultModal {
  test_exe_id: string
}

interface IExecutionReliabilityTestResultData {
  [index: string]: any
  test_result_id: number
  coderule_array: string[]
  coderule_result: "미달" | "충족" | null
  coderule_error: number
  coderule_fake: number
  secure_array: string[]
  secure_result: "미달" | "충족" | null
  secure_error: number
  secure_fake: number
  codemetric_array: string[] 
  codemetric_result: "미달" | "충족" | null
  codemetric_error: number
  codemetric_fake: number
  dynamic_array: string[]
  dynamic_result: "미달" | "충족" | null
  dynamic_measure: number
  dynamic_faile: number
  coderule_reason_file: string
  secure_reason_file: string
  codemetric_reason_file: string
  dynamic_reason_file: string
  test_exe_id: number
  reliability_test_index: number
}

interface ITestUnit {
  reliability_test_index: number
  reliability_test_unit_name: string
  is_reliability_static: number
  is_reliability_dynamic: number
}

const ExecutionReliabilityResultModal = ({
  test_exe_id,
}: IExecutionReliabilityResultModal) => {
  const [isOpen, setIsOpen] = useState<string>('')

  // 파일 인풋 데이터 이대로 저장
  const [testResultData, setTestResultData] = useState<IExecutionReliabilityTestResultData[]>([])
  
  // 입력 데이터
  const [inputData, setInputData] = useState<IExecutionReliabilityTestResultData>({
    test_result_id: 0,
    coderule_array: [],
    coderule_result: null,
    coderule_error: 0,
    coderule_fake: 0,
    secure_array: [],
    secure_result: null,
    secure_error: 0,
    secure_fake: 0,
    codemetric_array: [],
    codemetric_result: null,
    codemetric_error: 0,
    codemetric_fake: 0,
    dynamic_array: [],
    dynamic_result: null,
    dynamic_measure: 0,
    dynamic_faile: 0,
    coderule_reason_file: "",
    secure_reason_file: "",
    codemetric_reason_file: "",
    dynamic_reason_file: "",
    test_exe_id: 0,
    reliability_test_index: 0,
  })

  // 시험 단위 목록
  const [testUnitList, setTestUnitList] = useState<ITestUnit[]>([])
  // 선택한 시험 단위
  const [selectedTestUnit, setSelectedTestUnit] = useState<ITestUnit | null>(null)

  const handleShow = () => {
    setIsOpen(isOpen ? '' : test_exe_id)
  }

  const submitHandler = async () => {
    try {      
      await AccessAxios.put('/integration/result/', {
        test_exe_id: test_exe_id,
        reliability_plan_index: selectedTestUnit!.reliability_test_index,
        coderule_result: inputData.coderule_result,
        coderule_error: inputData.coderule_error,
        coderule_fake: inputData.coderule_fake,
        secure_result: inputData.secure_result,
        secure_error: inputData.secure_error,
        secure_fake: inputData.secure_fake,
        codemetric_result: inputData.codemetric_result,
        codemetric_error: inputData.codemetric_error,
        codemetric_fake: inputData.codemetric_fake,
        dynamic_result: inputData.dynamic_result,
        dynamic_measure: inputData.dynamic_measure,
        dynamic_faile: inputData.dynamic_faile,
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '시험 결과 저장 성공',
          })
        }
      })
    }
    catch(e:any) {
      console.log(e.message);
      Swal.fire({
        icon: 'error',
        title: '시험 결과 저장 실패',
      })      
    }
  }

  const getIfTestResultHandler = async () => {
    try {
      await AccessAxios.get('/integration/result/?test_exe_id=' + test_exe_id).then((res) => {
        if(res.status === 200) {
        const resData = res.data.data.test_results.find((data:IExecutionReliabilityTestResultData) => data.reliability_test_index === selectedTestUnit!.reliability_test_index)
        if(resData) {
          setInputData({
            ...inputData,
            coderule_array: resData.coderule_array,
            dynamic_array: resData.dynamic_array,
            codemetric_array: resData.codemetric_array,
            secure_array: resData.secure_array,
            coderule_reason_file: resData.coderule_reason_file,
            secure_reason_file: resData.secure_reason_file,
            codemetric_reason_file: resData.codemetric_reason_file,
            dynamic_reason_file: resData.dynamic_reason_file,  
          })
        }
        }
      })
    } catch (e:any) {
      console.log(e.message)
      Swal.fire({
        icon: 'error',
        title: '시험 결과 조회 실패',
      })

      setIsOpen('')
    }
  }

  const getTestResultHandler = async () => {
    try {
      await AccessAxios.get('/integration/result/?test_exe_id=' + test_exe_id).then((res) => {
        if(res.status === 200) {
          setTestResultData(res.data.data.test_results)
          setTestUnitList(res.data.data.reliability_test_list)
          
          if(res.data.data.reliability_test_list.length === 0) {
            Swal.fire({
              icon: 'info',
              title: '선택한 신뢰성 시험 계획이 없습니다.',
              text: '버전 확인 후 통합시험절차(STD)의 부록 B에서 신뢰성 시험 계획을 선택해주세요.',
              confirmButtonText: '확인',
              allowOutsideClick: false,
            }).then((res) => {
              if(res.isConfirmed) {
                setIsOpen('')
              }
            })
          }
          
        }
      })
    } catch (e:any) {
      console.log(e.message)
      Swal.fire({
        icon: 'error',
        title: '시험 결과 조회 실패',
      })

      setIsOpen('')
    }
  }

  const handleTestFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target        

    if (files && files[0]) {
      try {
        
        const formData = new FormData()
        formData.append("reliability_test_index", selectedTestUnit!.reliability_test_index.toString())
        formData.append("test_exe_id", test_exe_id.toString())
        formData.append("field", name.split("_").slice(0, -1).join("_"))
        formData.append("file", files[0]);
        
        await AccessAxios.put('/integration/file/', formData).then((res) => {
          if(res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: '파일 업로드 성공',
            })
            if(name.includes("reason")) {
              setInputData({
                ...inputData,
                [name]: files[0].name
              })
            }
            else {
              setInputData({
                ...inputData,
                [name.split("_").slice(0, -1).join("_") + "_array"]: [...inputData[name.split("_").slice(0, -1).join("_") + "_array"], files[0].name]
              })
            }
          }

          getIfTestResultHandler()
        })
      }
      catch(e: any) {
        console.log(e.message)
        Swal.fire({
          icon: 'error',
          title: '파일 업로드 실패',
        })
      }
    }
  }

  const handleTestUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setSelectedTestUnit(testUnitList.find((unit) => unit.reliability_test_index === Number(value)) || null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    
    if(name.includes("result")) {
      setInputData({
        ...inputData,
        [name]: value === "" ? null : value
      })
    }
    else {
      setInputData({
        ...inputData,
        [name]: parseInt(value) < 0 ? 0 : (value.length >= 10 ? inputData[name] : parseInt(value) || 0)
      })
    }
  }

  const getTestFileDownloadHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget

    try {
      window.location.href = `${process.env.REACT_APP_BASE_URL}integration/file-down/?file_path=${name}`

      Swal.fire({
        icon: 'success',
        title: '파일 다운로드 성공',
      }).then(() => {
        getTestResultHandler()
      })      
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '파일 다운로드 실패',
      })
    }   
  }

  const delTestFileHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const field = e.currentTarget.name.split("_").slice(0, -1).join("_")
    const file_index = e.currentTarget.name.split("_").slice(-1)[0]
    
    try {
      Swal.fire({
        title: '파일을 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then((res) => {
        if(res.isConfirmed) {
          AccessAxios.delete(`/integration/file/?test_exe_id=${test_exe_id}&field=${field}&file_index=${file_index}&reliability_test_index=${selectedTestUnit!.reliability_test_index}`).then((res) => {
            if(res.status === 200) {
              getIfTestResultHandler()
            }
          })
          
          if(field.includes("reason")) {
            setInputData({
              ...inputData,
              [`${field}_file`]: ""
            })
          }
          else {
            setInputData({
              ...inputData,
              [field + "_array"]: inputData[field + "_array"].filter((_: IExecutionReliabilityTestResultData, index_st:number) => index_st !== parseInt(file_index))
            })
          }
        }
      })
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '파일 삭제 실패',
      })
    }
  }

  const FileUploader = ({ name }: { name: string }) => {
    const file_ref = useRef<HTMLInputElement>(null)

    const fileClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      if(file_ref.current) {
        file_ref.current.click()
      }
    }

    return (
      <Button name={name} onClick={fileClickHandler} className='whitespace-nowrap'>
        업로드
        <input type='file' name={name} className='hidden' ref={file_ref} onChange={handleTestFileChange}/>
      </Button>
    )
  }

  const FileNameContent = ({ data, name }: {data: string[], name: string }) => {
    return (
      data.length && data[0] ? 
      <div className='flex flex-col gap-2'>
        {
          data.map((href, index_st) => {
            const fileName = href.split("_")[0].length === 20 ? href.split("_").slice(1).join("_") : href
            
            return (
              <div className='whitespace-nowrap p-1 border flex justify-between items-center gap-2 rounded-md' key={index_st}>
                  <button className='hover:underline hover:cursor-pointer text-[rgb(0,0,255)]' onClick={getTestFileDownloadHandler} name={href}>{fileName.length === 0 ? href : fileName}</button>
                  <button className='rounded-full bg-gray-400 text-white hover:brightness-90' name={`${name}_${index_st}`} onClick={delTestFileHandler} >
                    <X  size={20} />
                  </button>
              </div>
            )
          })
        }
      </div>
      :
      <div className='min-w-[150px]'></div>
    )
  }

  const FileReasonLink = ({ url }: { url: string }) => {
    const getDoenloadFile = () => {
      try {
        window.location.href = `${process.env.REACT_APP_BASE_URL}integration/file-down/?file_path=${url}`
        Swal.fire({
          icon: 'success',
          title: '파일 다운로드 성공',
        })
      }
      catch(e:any) {
        console.log(e.message);
        
        Swal.fire({
          icon: 'error',
          title: '파일 다운로드 실패',
        })
      }
    }

    return (
      <a onClick={getDoenloadFile} className='text-[rgb(0,0,255)] hover:underline hover:cursor-pointer'>{url}</a>
    )
  }

  const FileAllSelectDownloadHandler = () => {
    try {
      const fileLength = [...inputData.coderule_array, ...inputData.secure_array, ...inputData.codemetric_array, ...inputData.dynamic_array].length
      if(fileLength) {
        window.location.href = `${process.env.REACT_APP_BASE_URL}integration/result-down/?test_exe_id=${test_exe_id}&reliability_test_index=${selectedTestUnit!.reliability_test_index}`

        Swal.fire({
          icon: 'success',
          title: '전체 저장 문서 다운로드 성공',
        })
      }
      else {
        Swal.fire({
          icon: 'info',
          title: '업로드된 레포트 파일이 없습니다.',
        })
      }      
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '전체 저장 문서 다운로드 실패',
      })
    }
  }

  useEffect(() => {
    if (isOpen === test_exe_id) {
      getTestResultHandler()
    }
  }, [isOpen])

  useEffect(() => {
    if(testUnitList.length && selectedTestUnit === null) {
      setSelectedTestUnit(testUnitList[0])
    }
  }, [testUnitList, testResultData])

  useEffect(() => {
    if(selectedTestUnit && testResultData.length) {      
      setInputData(testResultData.find((data) => data.reliability_test_index === selectedTestUnit.reliability_test_index) || {
        test_result_id: 0,
        coderule_array: [],
        coderule_result: null,
        coderule_error: 0,
        coderule_fake: 0,
        secure_array: [],
        secure_result: null,
        secure_error: 0,
        secure_fake: 0,
        codemetric_array: [],
        codemetric_result: null,
        codemetric_error: 0,
        codemetric_fake: 0,
        dynamic_array: [],
        dynamic_result: null,
        dynamic_measure: 0,
        dynamic_faile: 0,
        coderule_reason_file: "",
        secure_reason_file: "",
        codemetric_reason_file: "",
        dynamic_reason_file: "",
        test_exe_id: 0,
        reliability_test_index: 0,
      })
    }
  }, [selectedTestUnit])

  return (
    <>
      <Button
        onClick={handleShow}>
        입력
      </Button>

      <Modal isOpen={isOpen === test_exe_id} size='lg'>
        <Modal.Head>신뢰성 시험 결과</Modal.Head>
        <Modal.Body className="flex flex-col justify-center overflow-auto">
          <div className="flex justify-between items-center">
            <div className='flex whitespace-nowrap gap-2 items-center'>
              <h1>시험 단위 명 선택</h1>
              <Input.Select value={selectedTestUnit?.reliability_test_index} onChange={handleTestUnitChange}>
                <Input.Option value={""}>선택
                </Input.Option>
                {testUnitList.map((option, index_st) => (
                  <Input.Option value={option.reliability_test_index} key={index_st}>
                    {option.reliability_test_unit_name}
                  </Input.Option>
                ))}
              </Input.Select>
            </div>

            {/* 백엔드 진행 후 완료  */}
            <div><Button onClick={FileAllSelectDownloadHandler}>전체 저장 문서 다운</Button></div>
          </div>

          <div className='w-full flex flex-col justify-center gap-4 border p-3 rounded-md'>
            <h1 className='font-bold text-lg'>자동화 도구 레포트</h1>
            <div className='overflow-auto'>
              <table className="w-full">
                <thead>
                  <tr>
                    {
                      testResultDynamicToolReportStaticTableHeaderFields.map((th, index_st) => (
                        <th key={index_st}>{th}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={3}>정적시험</td>
                    <td>코딩규칙</td>
                    <td>
                      <FileUploader name={"coderule_result"} />
                    </td>
                    <td>
                      <FileNameContent data={inputData.coderule_array} name="coderule" />
                    </td>
                    <td>
                      <Input.Select name='coderule_result' value={inputData.coderule_result || ""} onChange={handleChange} className='min-w-[100px]'>
                        <Input.Option value="">선택</Input.Option>
                        <Input.Option value="충족">충족</Input.Option>
                        <Input.Option value="미달">미달</Input.Option>
                      </Input.Select>
                    </td>
                    <td>
                      <Input type='number' name='coderule_error' value={inputData.coderule_error} onChange={handleChange} />
                    </td>
                    <td>
                      <Input type='number' name='coderule_fake' value={inputData.coderule_fake} onChange={handleChange} />
                    </td>
                  </tr>
                  <tr>
                    <td>취약점 점검</td>
                    <td>
                      <FileUploader name={"secure_result"} />
                    </td>
                    <td>
                      <FileNameContent data={inputData.secure_array} name="secure" />
                    </td>
                    <td>
                      <Input.Select name='secure_result' value={inputData.secure_result || ""} onChange={handleChange}>
                        <Input.Option value="">선택</Input.Option>
                        <Input.Option value="충족">충족</Input.Option>
                        <Input.Option value="미달">미달</Input.Option>
                      </Input.Select>
                    </td>
                    <td>
                      <Input type='number' name='secure_error' value={inputData.secure_error} onChange={handleChange} />
                    </td>
                    <td>
                      <Input type='number' name='secure_fake' value={inputData.secure_fake} onChange={handleChange} />
                    </td>
                  </tr>
                  <tr>
                    <td>코드 메트릭</td>
                    <td>
                      <FileUploader name={"codemetric_result"} />
                    </td>
                    <td>
                      <FileNameContent data={inputData.codemetric_array} name="codemetric" />
                    </td>
                    <td>
                      <Input.Select name='codemetric_result' value={inputData.codemetric_result || ""} onChange={handleChange}>
                        <Input.Option value="">선택</Input.Option>
                        <Input.Option value="충족">충족</Input.Option>
                        <Input.Option value="미달">미달</Input.Option>
                      </Input.Select>
                    </td>
                    <td>
                      <Input type='number' name='codemetric_error' value={inputData.codemetric_error} onChange={handleChange} />
                    </td>
                    <td>
                      <Input type='number' name='codemetric_fake' value={inputData.codemetric_fake} onChange={handleChange} />
                    </td>
                  </tr>
                </tbody>
              </table>  
            </div>
            <div className='overflow-auto'>
              <table className='w-full'>
                  <thead>
                    <tr>
                      {
                        testResultDynamicToolReportDynamicTableHeaderFields.map((th, index_st) => (
                          <th key={index_st}>{th}</th>
                        ))
                      }
                    </tr>
                  </thead>            
                  <tbody>
                    <tr>
                      <td>
                        동적시험 (코드 실행률)
                      </td>
                      <td>
                        <FileUploader name={"dynamic_result"} />
                      </td>
                      <td>
                        <FileNameContent data={inputData.dynamic_array} name="dynamic" />
                      </td>
                      <td>
                        <Input.Select name='dynamic_result' value={inputData.dynamic_result || ""} onChange={handleChange} className='min-w-[100px]' >
                          <Input.Option value="">선택</Input.Option>
                          <Input.Option value="충족">충족</Input.Option>
                          <Input.Option value="미달">미달</Input.Option>
                        </Input.Select>
                      </td>
                      <td>
                        <Input type='number' name='dynamic_measure' value={inputData.dynamic_measure} onChange={handleChange} />
                      </td>
                      <td>
                        <Input type='number' name='dynamic_faile' value={inputData.dynamic_faile} onChange={handleChange} />
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>

          <div className='w-full flex flex-col justify-center gap-4 border p-3 rounded-md overflow-auto'>
            <h1 className='font-bold text-lg'>사유서</h1>
            <table>
              <thead>
                <tr>
                  {
                    testResultReasonTableHeaderFields.map((th, index_st) => (
                      <th key={index_st}>{th}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={3}>
                    정적시험 사유서
                  </td>
                  <td>
                    코딩규칙
                  </td>
                  <td>
                    <FileReasonLink url='SW 코딩규칙점검 FA 사유서.hwp' />
                  </td>
                  <td>
                    <FileUploader name={"coderule_reason_file"} />
                  </td>
                  <td>
                    <FileNameContent data={[inputData.coderule_reason_file]} name="coderule_reason" />
                  </td>
                </tr>
                <tr>
                  <td>취약점점검</td>
                  <td>
                    <FileReasonLink url='SW 취약점 점검 FA 사유서.hwp' />
                  </td>
                  <td>
                    <FileUploader name={"secure_reason_file"} />
                  </td>
                  <td>
                    <FileNameContent data={[inputData.secure_reason_file]} name="secure_reason" />
                  </td>
                </tr>
                <tr>
                  <td>코드메트릭</td>
                  <td>
                    <FileReasonLink url='SW 소스코드 메트릭 미달성 분석 보고서.hwp' />
                  </td>
                  <td>
                    <FileUploader name={"codemetric_reason_file"} />
                  </td>
                  <td>
                    <FileNameContent data={[inputData.codemetric_reason_file]} name="codemetric_reason" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>동적시험 사유서</td>
                  <td>
                    <FileReasonLink url='SW 동적시험 커버리지 미달성 분석 보고서.hwp' />
                  </td>
                  <td>
                    <FileUploader name={"dynamic_reason_file"} />
                  </td>
                  <td>
                    <FileNameContent data={[inputData.dynamic_reason_file]} name="dynamic_reason" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitHandler}>저장</Button>
          <Button onClick={handleShow}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ExecutionReliabilityResultModal

import { testHistoryAppendSelectFields } from 'constant/test_manage/test-execution-records/testExecutionRecordsFields'
import { TestExecutionRecordsPerformerList } from 'pages/test-management/test-execution-records/TestExecutionRecordsPage'
import { useState } from 'react'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import { TestExecutionRecordsSrcVersionList, TestExecutionRecordsStdVersionList } from 'constant/test_manage/testImportTableFields'
import { AccessAxios } from 'models'
import Modal from 'tailwindElement/Modal'
import TestSrcVersionImportModal from '../sw-integration-test/TestSrcVersionImportModal'
import TestStdVersionImportModal from '../sw-integration-test/TestStdVersionImportModal'


interface IAppendData {
  std_id: string
  src_version_id: string
  test_exe_category: string
  test_exe_name: string
  test_exe_date: string
  test_exe_location: string
  test_performer_id: string
  test_observer_id: string
}

interface IProps {
  getTestExecutionRecords: () => void
  performerList: TestExecutionRecordsPerformerList[]
  stdVersionList: TestExecutionRecordsStdVersionList[]
  srcVersionList: TestExecutionRecordsSrcVersionList[]
}

const TestExecutionRecordsAppendModal = ({ getTestExecutionRecords, performerList, stdVersionList, srcVersionList }: IProps ) => {
  const [show, setShow] = useState<boolean>(false)
  const [appendData, setAppendData] = useState<IAppendData>({
    std_id: '',
    src_version_id: '',
    test_exe_category: '',
    test_exe_name: '',
    test_exe_date: '',
    test_exe_location: '',
    test_performer_id: '',
    test_observer_id: ''
  })

  // 불러온 시험 버전
  const [selectedStdVersion, setSelectedStdVersion] = useState<TestExecutionRecordsStdVersionList | null>(null)

  // 불러온 소스코드 버전
  const [selectedSrcVersion, setSelectedSrcVersion] = useState<TestExecutionRecordsSrcVersionList | null>(null)

  // 시험 기록 등록 모달 show handler
  const testHistoryAppendModalShowHandler = () => {
    setShow(!show)
    if(show) {
      setAppendData({
        std_id: '',
        src_version_id: '',
        test_exe_category: '',
        test_exe_name: '',
        test_exe_date: '',
        test_exe_location: '',
        test_performer_id: '',
        test_observer_id: ''
      })

      setSelectedSrcVersion(null)
      setSelectedStdVersion(null)
    }
  }

  const testHistoryAppendChangeHandler = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {name, value} = e.target

    setAppendData((prev) => (
      {
        ...prev,
        [name]: value
      }
    ))
  }

  const getSelectedStdVersion = (testVersionList: TestExecutionRecordsStdVersionList) => {
    setSelectedStdVersion(testVersionList)

    setAppendData((prev) => (
      {
        ...prev,
        std_id: testVersionList.std_id
      }
    ))
  }

  const getSelectedSrcVersion = (srcVersionList: TestExecutionRecordsSrcVersionList) => {
    setSelectedSrcVersion(srcVersionList)
    setAppendData((prev) => (
      {
        ...prev,
        src_version_id: srcVersionList.src_version_id
      }
    ))
  }

  const putTestExecutionRecords = async () => {
    try {
      if(appendData.test_exe_category === "") {
        Swal.fire({
          icon: 'warning',
          title: '시험 구분을 선택해주세요',
        })
        return
      }
      else if(appendData.test_exe_name === "") {
        Swal.fire({
          icon: 'warning',
          title: '시험 이름을 입력해주세요',
        })
        return
      }
      else if(appendData.std_id === "") {
        Swal.fire({
          icon: 'warning',
          title: '시험 절차를 선택해주세요',
        })
        return
      }
      else if(appendData.test_exe_location === "") {
        Swal.fire({
          icon: 'warning',
          title: '시험 장소를 입력해주세요',
        })
        return
      }
      else if(appendData.test_performer_id === "") {
        Swal.fire({
          icon: 'warning',
          title: '시험 수행자를 선택해주세요',
        })
        return
      }
      else if(appendData.test_observer_id === "") {
        Swal.fire({
          icon: 'warning',
          title: '시험 입회자를 입력해주세요',
        })
        return
      }
      const yy = new Date().getFullYear().toString()
      const mm = ('0' + (new Date().getMonth() + 1).toString()).slice(-2)
      const dd = ('0' + new Date().getDate().toString()).slice(-2)
      const date = `${yy}-${mm}-${dd}`
      
      await AccessAxios.put('/integration/execute/', {
        ...appendData,
        src_version_id: appendData.src_version_id || null,
        test_exe_date: date
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '시험 수행 기록 목록 등록 성공',
          })          

          testHistoryAppendModalShowHandler()
          getTestExecutionRecords()
        }
      })
    }
    catch(error: any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: '사험 수행 기록 목록 등록 실패',
      })
    }
  }

  return (
    <>
      <Button onClick={testHistoryAppendModalShowHandler}>등록</Button>
      <Modal isOpen={show} size='md'>
        <Modal.Head>신규 시험 등록</Modal.Head>
        <Modal.Body className="flex justify-center">
          <div className="w-full mt-5 flex flex-col gap-5 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
            <div className="flex gap-2">
              <Input.Select
                label="시험 구분"
                name="test_exe_category"
                value={appendData.test_exe_category}
                onChange={testHistoryAppendChangeHandler}>
                <Input.Option value="">선택</Input.Option>
                {testHistoryAppendSelectFields.map((option, index_st) => (
                  <Input.Option key={index_st} value={option.value}>
                    {option.label}
                  </Input.Option>
                ))}
              </Input.Select>
              {appendData.test_exe_category === "others" && (
                <div className="w-full flex items-end">
                  <Input placeholder="(기타 선택 시)" />
                </div>
              )}
            </div>
            <Input.InputLabel label="시험 이름" name='test_exe_name' value={appendData.test_exe_name} onChange={testHistoryAppendChangeHandler} />
            <div className='flex gap-2 items-end whitespace-nowrap'>
              <Input.InputLabel label="시험 절차" disabled name="std_id" value={selectedStdVersion ? `소프트웨어통합시험절차서(STD)_V${stdVersionList.find((d) => d.std_id === selectedStdVersion.std_id)!.std_name}` : ""} />
              <TestStdVersionImportModal stdVersionList={stdVersionList} title={"불러오기"} getSelectedStdVersion={getSelectedStdVersion} />
            </div>

            <div className='flex gap-2 items-end whitespace-nowrap'>
              <Input.InputLabel label="소스코드 버전" disabled name="src_version_name" value={selectedSrcVersion ? selectedSrcVersion.src_version_name : ""} />
              <TestSrcVersionImportModal srcVersionList={srcVersionList} title="불러오기" getSelectedSrcVersion={getSelectedSrcVersion}/>
            </div>
            <Input.InputLabel label="시험 장소" name="test_exe_location" value={appendData.test_exe_location} onChange={testHistoryAppendChangeHandler} />

            <Input.Select
              label='시험 수행자'
              name='test_performer_id'
              value={appendData.test_performer_id}
              onChange={testHistoryAppendChangeHandler}
            >
              <Input.Option value={""}>선택</Input.Option>
              {
                performerList.map((option, index_st) => (
                  <Input.Option key={index_st} value={option.user_id}>
                    {option.user_name}
                  </Input.Option>
                ))
              }
            </Input.Select>
            <Input.InputLabel label="시험 입회자" name="test_observer_id" value={appendData.test_observer_id} onChange={testHistoryAppendChangeHandler}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={putTestExecutionRecords}>저장</Button>
          <Button onClick={testHistoryAppendModalShowHandler}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default TestExecutionRecordsAppendModal

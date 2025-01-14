import { useEffect, useState } from 'react'

import Modal from "tailwindElement/Modal"
import Button from "tailwindElement/Button"
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'

interface TestHistoryType {
  tc_version_id: number
  test_exe_id: number
  test_exe_category: string
  test_exe_name: string
} 

const TestReportTestHistoryImportModal = () => {
	const [show, setShow] = useState<boolean>(false)

  const [testHistoryList, setTestHistoryList] = useState<TestHistoryType[]>([])

  const [activeTestHistory, setActiveTestHistory] = useState<TestHistoryType | null>(null);

	const handleShow = () => {
		setShow(prev => !prev)
	}

  const getTestHistoryList = async () => {
    try {
      const res = await AccessAxios.get('/integration/report/?tc_version_id=7')

      setTestHistoryList(res.data)
    }
    catch (error:any) {
      console.log(error.message)

      Swal.fire({
        icon: 'error',
        title: '시험 수행 기록 목록 조회 실패',
      })
    }
  }

	const submitRegisterRequest = () => {
    if(!activeTestHistory) {
      Swal.fire({
        icon: 'error',
        title: '시험 절차를 선택해주세요',
      })
      return
    }

    Swal.fire({
      icon: 'question',
      title: "전체 시험 식별자에 시험 절차 및 결과를 추가하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오',
    }).then((res) => {
      if(res.isConfirmed) {
        handleShow()
        // TODO : 시험 수행 기록 불러오기 Request
        // 모든 요구사항에 시험 절차 추가
        // 순서, 시험절차, 결과 순으로 텍스트 형태 추가
        Swal.fire({
          icon: 'success',
          title: '시험 수행 기록 불러오기 성공',
        })
      }
    })
	}

  useEffect(() => {
    if(show) {
      getTestHistoryList()
    }
  }, [show])

	return (
		<div>
			<Button variant="primary" onClick={handleShow}>시험 수행 기록 불러오기</Button>

			<Modal
				isOpen={show}
				size="lg">
				<Modal.Head>시험 수행 기록 불러오기</Modal.Head>
				<Modal.Body>
					<table className='w-full table table-border'>
            <thead>
              <tr>
                <th>
                  선택
                </th>
                <th>
                  시험 구분
                </th>
                <th>
                  시험 이름
                </th>
                <th>
                  시험 계획 버전
                </th>
                <th>
                  소스코드 버전
                </th>
                <th>
                  시험 일시
                </th>
                <th>
                  시험 장소
                </th>
                <th>
                  시험 수행자
                </th>
                <th>
                  시험 입회자
                </th>
              </tr>
            </thead>
            <tbody>
              {testHistoryList.length && testHistoryList.map((td, index_st) => (
                <tr key={index_st}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))

              }
            </tbody>
          </table>
				</Modal.Body>
				<Modal.Footer className='w-full flex items-center'>
					<Button onClick={submitRegisterRequest}>불러오기</Button>
          <Button onClick={handleShow}>취소</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default TestReportTestHistoryImportModal

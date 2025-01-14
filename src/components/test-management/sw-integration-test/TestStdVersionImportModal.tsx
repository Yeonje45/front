import { useEffect, useState } from 'react'

import Modal from "tailwindElement/Modal"
import Button from "tailwindElement/Button"
import Swal from 'sweetalert2'
import Input from 'tailwindElement/Input'
import { radioClickHandler } from 'components/common/util/TableData'
import { TestExecutionRecordsStdVersionList, TestExecutionRecordsStdVersionListTableHeaderFields } from 'constant/test_manage/testImportTableFields'

interface IProps {
  stdVersionList: TestExecutionRecordsStdVersionList[]
  title: string
  getSelectedStdVersion: (selectedTestVersion: TestExecutionRecordsStdVersionList) => void
}

const TestStdVersionImportModal = ({ stdVersionList, title, getSelectedStdVersion}: IProps) => {
	const [show, setShow] = useState<boolean>(false)
  // 선택한 시험 절차서
  const [selectedStd, setSelectedStd] = useState<TestExecutionRecordsStdVersionList | null>(null)

	const handleShow = () => {
		setShow(prev => !prev)
	}

  const handleSelectedTestVersion = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setSelectedStd(stdVersionList.find((item) => item.std_id == e.target.value) || null)
  }

	const submitRegisterRequest = () => {
    if(selectedStd === null) {
      Swal.fire({
        icon: 'error',
        title: '시험 절차서를 선택해주세요.',
      })
      
      return
    }

    handleShow()
    getSelectedStdVersion(selectedStd!)

    Swal.fire({
      icon: 'success',
      title: '시험 절차서 불러오기 성공',
    })
	}

  useEffect(() => {
    if(!show) {
      setSelectedStd(null)
    }
  }, [show])

	return (
		<div>
			<Button variant="primary" onClick={handleShow}>{title}</Button>

			<Modal
				isOpen={show}
				size="lg">
				<Modal.Head>시험 절차서 불러오기</Modal.Head>
				<Modal.Body className='w-full flex justify-center p-5'>
					<div className='w-full h-[500px] overflow-y-auto'>
            <table className='w-full table table-border'>
              <thead>
                <tr>
                {
                  TestExecutionRecordsStdVersionListTableHeaderFields.map((th, index_st) => (
                    <th key={index_st}>
                      {th}
                    </th>
                  ))
                }
                </tr>
              </thead>
              <tbody>
                {
                  stdVersionList.length ?
                    stdVersionList.sort((a, b) => a.std_date > b.std_date ? -1 : 1).map((tr, index_st) => (
                      <tr key={index_st}  className={`${tr.isDisabled ? "pointer-events-none text-gray-200" : ""}`}>
                        <td onClick={radioClickHandler}>
                          <Input.Radio
                            disabled={tr.isDisabled}
                            name="std_id"
                            value={tr.std_id}
                            checked={(selectedStd && selectedStd.std_id) == tr.std_id}
                            onChange={handleSelectedTestVersion}
                          />
                        </td>
                        <td>
                          V{tr.std_name}
                        </td>
                        <td>
                          {tr.std_info}
                        </td>
                        <td>
                          {tr.baseline_number}
                        </td>
                        <td>
                          {tr.std_uploader_name}
                        </td>
                        <td>
                          {tr.std_date.slice(0, 10)}
                        </td>
                      </tr>
                    ))
                    :
                  <tr>
                    <td colSpan={6} className='h-56'>
                    현재 추가된 시험 절차 데이터가 없습니다.
                    <br/>
                    통합시험절차(STD)에서 식별자의 시험 절차 데이터를 추가해주세요.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
				</Modal.Body>
				<Modal.Footer className='w-full flex items-center'>
					<Button onClick={submitRegisterRequest}>불러오기</Button>
          <Button onClick={handleShow}>취소</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default TestStdVersionImportModal

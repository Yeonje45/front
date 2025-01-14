import { useEffect, useState } from 'react'

import Modal from "tailwindElement/Modal"
import Button from "tailwindElement/Button"
import Swal from 'sweetalert2'
import { TestImportTableStatus, TestSrcVersionImportTableHeaderFields, TestExecutionRecordsSrcVersionList } from 'constant/test_manage/testImportTableFields'
import Input from 'tailwindElement/Input'
import { radioClickHandler } from 'components/common/util/TableData'

interface IProps {
  srcVersionList: TestExecutionRecordsSrcVersionList[]
  title: string
  getSelectedSrcVersion: (selectedTestVersion: TestExecutionRecordsSrcVersionList) => void
}

const TestSrcVersionImportModal = ({ srcVersionList, title, getSelectedSrcVersion}: IProps) => {
	const [show, setShow] = useState<boolean>(false)
  // 선택한 소스코드 버전
  const [selectedSrcVersion, setSelectedSrcVersion] = useState<TestExecutionRecordsSrcVersionList | null>(null)

	const handleShow = () => {
		setShow(prev => !prev)
	}

  const handleSelectedTestVersion = (e: React.ChangeEvent<HTMLInputElement>) => {    
    setSelectedSrcVersion(srcVersionList.find((item) => item.src_version_id == e.target.value) || null)
  }
	const submitRegisterRequest = () => {
    if(selectedSrcVersion === null) {
      Swal.fire({
        icon: 'error',
        title: '소스코드 버전을 선택해주세요.',
      })
      
      return
    }

    handleShow()
    getSelectedSrcVersion(selectedSrcVersion!)

    Swal.fire({
      icon: 'success',
      title: '소스코드 버전 불러오기 성공',
    })
	}

  useEffect(() => {
    if(!show) {
      setSelectedSrcVersion(null)
    }
  }, [show])

	return (
		<div>
			<Button variant="primary" onClick={handleShow}>{title}</Button>

			<Modal
				isOpen={show}
				size="lg">
				<Modal.Head>소스코드 버전 불러오기</Modal.Head>
				<Modal.Body className='w-full flex justify-center p-5'>
					<div className='w-full h-[500px] overflow-y-auto'>
            <table className='w-full table table-border'>
              <thead>
                <tr>
                {
                  TestSrcVersionImportTableHeaderFields.map((th, index_st) => (
                    <th key={index_st}>
                      {th}
                    </th>
                  ))
                }
                </tr>
              </thead>
              <tbody>
                {
                  srcVersionList.length ?
                  srcVersionList.sort((a, b) => a.requester_date > b.requester_date ? -1 : 1).map((tr, index_st) => (
                    <tr key={index_st}>
                      <td onClick={radioClickHandler}>
                        <Input.Radio
                          name="src_version_id"
                          value={tr.src_version_id}
                          checked={(selectedSrcVersion && selectedSrcVersion.src_version_id) == tr.src_version_id}
                          onChange={handleSelectedTestVersion}
                        />
                      </td>
                      <td>
                        {tr.src_version_name}
                      </td>
                      <td>
                        {tr.approver_date ? tr.approver_date.slice(0, 10) : ""}
                      </td>
                      <td>
                        {tr.src_version_content}
                      </td>
                      <td>
                        {TestImportTableStatus[tr.src_version_status]}
                      </td>
                      <td>
                        {tr.requester_user_id}
                      </td>
                      <td>
                        {tr.requester_date.slice(0, 10)}
                      </td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan={TestSrcVersionImportTableHeaderFields.length} className='h-[450px]'>
                    현재 추가된 소스코드 버전 데이터가 없습니다.
                    <br/>
                    형상관리에 버전 및 산출물 관리에서 소스코드 버전 데이터를 추가해주세요.
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

export default TestSrcVersionImportModal

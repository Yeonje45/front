import { useEffect, useState } from 'react'

import Modal from "tailwindElement/Modal"
import Button from "tailwindElement/Button"
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { TestVersionImportTableHeaderFields, ITestImportTableData } from 'constant/test_manage/testImportTableFields'
import Input from 'tailwindElement/Input'
import { radioClickHandler } from 'components/common/util/TableData'
import { IReqVersion } from './RequirementImportModal'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'

interface IProps {
  output_name: string
  reqVersion?: IReqVersion | null
  testVersionHandler: (selectedTestVersion: { id: number, name: number }) => void
}

const TestVersionImportModal = ({ output_name, reqVersion, testVersionHandler }: IProps) => {
  const project_id = useSelector((state: RootState) => state.project.project).project_id

	const [show, setShow] = useState<boolean>(false)

  // 산출물 버전 목록
  const [testVersionList, setTestVersionList] = useState<ITestImportTableData[]>([])
  
  // 선택한 산출물 버전
  const [selectedTestVersion, setSelectedTestVersion] = useState<ITestImportTableData | null>(null)

  // 시험 산출물 불러오기 모달 열기 / 닫기
	const handleShow = () => {
		setShow(prev => !prev)
	}

  const getTestVersionList = async () => {
    try {
      const url = output_name === "sdp" ? `/documents/version/?project_id=${project_id}`
        :
        `/integration/version/?doc_type=${output_name}&baseline_id=${reqVersion?.baseline_id || ""}`

      await AccessAxios.get(url).then((res) => {        
        if(res.status === 200) {          
          setTestVersionList(res.data.data.map((d: any) => ({
            id: d[`${output_name}_id`],
            name: d[`${output_name}_name`],
            baseline_id: d.baseline_id,
            beseline_number: d.baseline_number,
            date: d[`${output_name}_date`],
            info: d[`${output_name}_info`],
            progress_rate: d[`${output_name}_progress_rate`],
            uploader: d[`${output_name}_uploader`],
            uploader_name: d[`${output_name}_uploader_name`]
          })))
        }
      })
    }
    catch (error:any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: '산출물 목록 조회 실패',
      })
    }
  }

	const submitRegisterRequest = () => {
    if(selectedTestVersion === null) {
      Swal.fire({
        icon: 'error',
        title: '산출물을 선택해주세요.',
      })
      
      return
    }

    testVersionHandler(selectedTestVersion)

    handleShow()

    Swal.fire({
      icon: 'success',
      title: '산출물 불러오기 성공',
    })
	}

  const handleSelectedTestVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(testVersionList) {
      setSelectedTestVersion(testVersionList.find((d) => d.id === Number(e.target.value)) || null)
    }
  }

  useEffect(() => {
    if(output_name === "sdp") {
      getTestVersionList()
    }
    else {
      reqVersion && reqVersion.baseline_id && getTestVersionList()
    }
    if(!show) {
      setSelectedTestVersion(null)
    }
  }, [show, reqVersion])

	return (
		<div>
			<Button variant="primary" onClick={handleShow}>변경</Button>

			<Modal
				isOpen={show}
				size="lg">
				<Modal.Head>산출물 불러오기</Modal.Head>
				<Modal.Body className='w-full flex justify-center p-5'>
					<div className='w-full max-h-[500px] overflow-y-auto'>
            <table className='w-full table table-border'>
              <thead>
                <tr>
                {
                  TestVersionImportTableHeaderFields.map((th, index_st) => (
                    <th key={index_st}>
                      {th}
                    </th>
                  ))
                }
                </tr>
              </thead>
              <tbody>
                {
                  testVersionList.length ?
                    testVersionList.sort((a, b) => b.id - a.id ).map((tr, index_st) => (
                      <tr key={index_st}>
                        <td onClick={radioClickHandler}>
                          <Input.Radio
                            value={tr.id}
                            checked={(selectedTestVersion && selectedTestVersion.id) === tr.id}
                            onChange={handleSelectedTestVersion}
                          />
                        </td>
                        <td>
                          {output_name.toUpperCase()}_V{tr.name}
                        </td>
                        <td>
                          {tr.info}
                        </td>
                        <td>
                          {tr.progress_rate}%
                        </td>
                        <td>
                          {tr.date.slice(0, 10)}
                        </td>
                        <td>
                          {tr.uploader_name}
                        </td>
                      </tr>
                    ))
                  :
                  <tr>
                    <td colSpan={TestVersionImportTableHeaderFields.length} className='text-center h-56'>
                      업로드된 산출물이 존재하지 않습니다.
                      <br/>
                      산출물을 업로드 해주세요.
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

export default TestVersionImportModal

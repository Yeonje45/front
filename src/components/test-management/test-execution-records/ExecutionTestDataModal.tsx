import { AccessAxios } from 'models'
import { useEffect, useRef, useState } from 'react'
import { X } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'
import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'

interface IExecutionTestDataModal {
  test_exe_id: string
}

interface ITestData {
  test_exe_id: string
  test_data_id: number
  test_data_name: string
  test_data_file: string
}

const ExecutionTestDataModal = ({ test_exe_id }: IExecutionTestDataModal) => {
  const [isOpen, setIsOpen] = useState<string>('')
  
  const file_ref = useRef<HTMLInputElement>(null)

  const [testDataList, setTestDataList] = useState<ITestData[]>([])

  const handleShow = () => {
    setIsOpen(isOpen ? '' : test_exe_id)
  }

  const getTestDataHandler = async () => {
    try {
      await AccessAxios.get(`/integration/data/?test_exe_id=${test_exe_id}`).then((res) => {
        if(res.status === 200) {
          setTestDataList(res.data.data)
        }
      })
    }
    catch(e:any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: '시험 자료 조회 실패',
      })
    }
  }

  const fileClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(file_ref.current) {
      file_ref.current.click()
    }
  }

  const handleTestFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if(files && files[0]) {
      try {
        const formData = new FormData()
        formData.append('test_exe_id', test_exe_id)
        formData.append('file', files[0])

        await AccessAxios.put('/integration/data/', formData).then((res) => {
          if(res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: '시험 자료 업로드 성공',
            })
            getTestDataHandler()
          }
        })
      }
      catch(e:any) {
        console.error(e)
        Swal.fire({
          icon: 'error',
          title: '시험 자료 업로드 실패',
        })
      }
    }
  }

  const delTestDataHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name

    try {
      Swal.fire({
        icon: 'warning',
        title: '시험 자료를 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      }).then(async (result) => {
        if(result.isConfirmed) {
          await AccessAxios.delete(`/integration/data/?test_data_id=${name}`).then((res) => {
            if(res.status === 200) {
              Swal.fire({
                icon: 'success',
                title: '시험 자료 삭제 성공',
              })
              getTestDataHandler()
            }
          })
        }
      })
    }
    catch(e:any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: '시험 자료 삭제 실패',
      })
    }
  }

  const getTestDataDownloadHandler = async () => {
    try {
      if(testDataList.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '업로드된 시험 자료가 없습니다.',
        })

        return
      }
      else {
        window.location.href = `${process.env.REACT_APP_BASE_URL}integration/data-down/?test_exe_id=${test_exe_id}`

        Swal.fire({
          icon: 'success',
          title: '시험 자료 전체 다운로드 성공',
        })
      }
    }
    catch(e: any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: '시험 자료 전체 다운로드 실패',
      })
    }
  }

  useEffect(() => {
    if(isOpen === test_exe_id) {
      getTestDataHandler()
    }
  }, [isOpen])

  return (
    <ActiveModal
      size="md"
      isOpen={isOpen === test_exe_id}
      buttonElement={
        <Button
          onClick={handleShow}
          name={`requirement_${test_exe_id}`}>
          입력
        </Button>
      }>
      <ActiveModal.Head>시험 자료</ActiveModal.Head>
      <ActiveModal.Body className="flex flex-col justify-center p-4">
        <div className="flex justify-end gap-2">
          <Button onClick={fileClickHandler}>
            업로드
            <input type='file' className='hidden' ref={file_ref} onChange={handleTestFileChange}/>
          </Button>

          <Button onClick={getTestDataDownloadHandler}>전체 다운로드</Button>
        </div>
        <table>
          <thead>
            <tr>
              <th>시험 결과</th>
            </tr>
          </thead>
          <tbody>
            {
              testDataList.length ?
                testDataList.map((data, index_st) => (
                  <tr key={index_st}>
                    <td>
                      <div className='whitespace-nowrap p-1 border flex justify-between items-center gap-2 rounded-md' key={index_st}>
                        <div className='w-full'>{data.test_data_name}</div>
                        <button className='rounded-full bg-gray-400 text-white hover:brightness-90' name={data.test_data_id.toString()} onClick={delTestDataHandler} >
                          <X  size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              :
              <tr>
                <td>업로드된 시험 자료가 없습니다.</td>
              </tr>
            }
          </tbody>
        </table>
      </ActiveModal.Body>
      <ActiveModal.Footer>
        <Button
          onClick={handleShow}>
          닫기
        </Button>
      </ActiveModal.Footer>
    </ActiveModal>
  )
}

export default ExecutionTestDataModal

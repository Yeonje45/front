import { IFileData } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields'
import { AccessAxios } from 'models'
import { useState } from 'react'
import Swal from 'sweetalert2'
import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

interface IProps {
  reliability_plan_index: string
}

const AppendingFileModal = ({reliability_plan_index}: IProps) => {
  const [show, setShow] = useState<boolean>(false)

  // 신뢰성 시험 계획 file 데이터
  const [fileData, setFileData] = useState<IFileData[]>([])

  const [activeFile, setActiveFile] = useState<number[]>([])
  // const [activeFile, setActiveFile] = useState<number>(0)


  // 신뢰성 시험 계획 파일 다운
  const getInputFileData = async () => {   
    try {      
      const res = await AccessAxios.get('/reliability/file/?reliability_plan_index=' + reliability_plan_index)
      setFileData(() => (
        res.data.data.map((col: IFileData) => {
          return ({
            reliability_test_index: col.reliability_test_index,
            reliability_test_language: col.reliability_test_language,
            coding_rule: col.coding_rule.split('_').slice(2).join("_"),
            secure: col.secure.split('_').slice(2).join("_"),
            code_metric: col.code_metric.split('_').slice(2).join("_"),
          })
        })
      ))
      if(res.data.data.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '신뢰성 시험계획 파일이 없습니다.',
        })

        setShow(false)

        return
      }
    }
    catch(error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '신뢰성 시험계획 파일을 다운로드하는데 실패했습니다.',
      })
    }
  }

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {checked, id} = e.target
    if(checked) {
      setActiveFile([...activeFile, parseInt(id)])
    } else {
      setActiveFile(activeFile.filter((file) => file !== parseInt(id)))
    }
    // setActiveFile(parseInt(id))
    
  }

  const appendingFileModalShowHandler = () => {
    setShow(!show)

    if(!show) {
      getInputFileData()
    }
  }

  const fileDownloadHandler = async () => {
    try {
      // if(activeFile === 0) {
      if(activeFile.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '다운로드 받을 파일을 선택해주세요.',
        })

        return
      } 
      
      // TODO : 파일 다운로드 안 됨 수정 필요
      await AccessAxios.post('/reliability/file/', {
        reliability_test_index: [133],
      }).then((res) => {

        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '파일 다운로드에 성공했습니다.',
          })
          appendingFileModalShowHandler()
        }
      })
    }
    catch(error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '파일 다운로드에 실패했습니다.',
      })
    }
  }

  return (
    <ActiveModal
      isOpen={show}
      buttonElement={
        <Button onClick={appendingFileModalShowHandler}>
          첨부파일 다운
        </Button>
      }>
      <ActiveModal.Head>신뢰성시험 계획 첨부파일 조회</ActiveModal.Head>
      <ActiveModal.Body>
        <div className='w-full max-h-[400px] overflow-auto'>
          <table className="w-full table-border">
            <thead>
              <tr>
                <th>선택</th>
                <th>언어</th>
                <th>코딩규칙</th>
                <th>취약점점검</th>
                <th>코드매트릭</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((col, index_st) => (
                <tr key={index_st}>
                  <td>
                    <Input.Checkbox id={col.reliability_test_index} onChange={handleCheckBoxChange}/>
                  </td>
                  <td>{col.reliability_test_language}</td>
                  <td>{col.coding_rule}</td>
                  <td>{col.secure}</td>
                  <td>{col.code_metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ActiveModal.Body>
      <ActiveModal.Footer>
        <Button onClick={fileDownloadHandler}>다운</Button>
        <Button onClick={appendingFileModalShowHandler}>닫기</Button>
      </ActiveModal.Footer>
    </ActiveModal>
  )
}

export default AppendingFileModal

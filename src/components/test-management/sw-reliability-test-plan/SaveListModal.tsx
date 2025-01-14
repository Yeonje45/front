import { RootState } from 'app/store'
import { radioClickHandler } from 'components/common/util/TableData'
import { ISaveListData } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields'
import { AccessAxios } from 'models'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

interface IProps {
  postActiveSaveListData: (reliability_plan_index: string) => void
  handleSaveListData: (data: ISaveListData) => void
}

const SaveListModal = ({ postActiveSaveListData, handleSaveListData }:IProps) => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const [show, setShow] = useState<boolean>(false)

  const [saveListData, setSaveListData] = useState<ISaveListData[]>([])

  const [activeSaveListData, setActiveSaveListData] = useState<ISaveListData>({
    reliability_plan_index: '',
    reliability_plan_title: '',
    reliability_plan_content: '',
    user_id: '',
    user_name: '',
    reliability_test_plan_update_date: '',
  })

  const showHandler = () => {
    setShow(!show)
    if(!show) {
      setActiveSaveListData({
        reliability_plan_index: '',
        reliability_plan_title: '',
        reliability_plan_content: '',
        user_id: '',
        user_name: '',
        reliability_test_plan_update_date: '',
      });
    }
  }

  const getSaveListHandler = () => {
    if(activeSaveListData.reliability_plan_index === '') {
      Swal.fire({
        icon: 'error',
        title: '불러드릴 신뢰성시험 계획을 선택해주세요.',
      })

      return
    }
    postActiveSaveListData(activeSaveListData.reliability_plan_index)

    Swal.fire({
      icon: 'success',
      title: '신뢰성시험 계획을 불러왔습니다.',
    })

    handleSaveListData(activeSaveListData)
    showHandler()
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target    
    setActiveSaveListData(saveListData.find(data => data.reliability_plan_index.toString() === value) as ISaveListData)
  }

  const getSaveListData = async () => {
    try {
      const res = await AccessAxios.get('/reliability/plan/?project_id=' + projectID)
      
      setSaveListData(res.data.data)  
    }
    catch(error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '신뢰성시험 계획 저장내역을 불러오는데 실패했습니다.',
      })
    }
  }

  useEffect(() => {
    if(show) {
      getSaveListData()
    }
  }, [show])

  return (
    <ActiveModal
      isOpen={show}
      buttonElement={<Button onClick={showHandler}>저장 내역 조회</Button>}>
      <ActiveModal.Head>신뢰성시험 계획 저장 내역 조회</ActiveModal.Head>
      <ActiveModal.Body>
        <div className='max-h-[500px] overflow-auto'>
          <table className="w-full table-border">
            <thead>
              <tr>
                <th>선택</th>
                <th>제목</th>
                <th>설명</th>
                <th>작성자</th>
                <th>일시</th>
              </tr>
            </thead>
            <tbody>
              {
                saveListData.length ? 
                saveListData.map((data, index_st) => (
                  <tr key={index_st}>
                    <td onClick={radioClickHandler}>
                      <Input.Radio name="save_list_radio" value={data.reliability_plan_index} checked={data.reliability_plan_index === activeSaveListData.reliability_plan_index} onChange={handleRadioChange} />
                    </td>
                    <td>{data.reliability_plan_title}</td>
                    <td>{data.reliability_plan_content}</td>
                    <td>{data.user_name}</td>
                    <td>{data.reliability_test_plan_update_date.slice(0, 10)} {data.reliability_test_plan_update_date.slice(11, 19)} </td>
                  </tr>
                ))
                :
                <tr>
                    <td colSpan={5} className='w-full h-[300px]'>저장된 신뢰성시험 계획 데이터가 존재하지 않습니다.<br/>신뢰성시험 계획 데이터를 입력해주세요.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </ActiveModal.Body>
      <ActiveModal.Footer>
        <Button onClick={getSaveListHandler}>불러오기</Button>
        <Button onClick={showHandler}>취소</Button>
      </ActiveModal.Footer>
    </ActiveModal>
  )
}

export default SaveListModal

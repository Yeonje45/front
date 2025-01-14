import React, { useEffect, useState } from 'react'

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';
import Swal from 'sweetalert2';
import { AccessAxios } from 'models';
import { ISaveListData } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { radioClickHandler } from 'components/common/util/TableData';

interface IProps {
  reliabilityTestPlanHandle: (data: ISaveListData) => void
  outputData: {
    id: number,
    name: number
  } | null
}

const TestDescriptionSaveHistoryModal = ({reliabilityTestPlanHandle, outputData}: IProps) => {
	const projectID = useSelector((state: RootState) => state.project).project.project_id 

	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const [saveListData, setSaveListData] = useState<ISaveListData[]>([])

	const [activeSaveListData, setActiveSaveListData] = useState<ISaveListData>({
    reliability_plan_index: '',
    reliability_plan_title: '',
    reliability_plan_content: '',
    user_id: '',
    user_name: '',
    reliability_test_plan_update_date: '',
  })

	const handleIsOpen = (): void => {
		setIsOpen(prev => !prev);
		return;
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

	const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target    
    setActiveSaveListData(saveListData.find(data => data.reliability_plan_index.toString() === value) as ISaveListData)
  }
	
  const putSubmitSaveHistory = async () => {
    try {
      await AccessAxios.put('/integration/std-plan/', {
        std_id: outputData?.id || "",
        reliability_plan_index: activeSaveListData.reliability_plan_index,
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '신뢰성시험 계획 저장 내역을 불러왔습니다.',
          })

          reliabilityTestPlanHandle(activeSaveListData)
          handleIsOpen()
        }
      })
    } 
    catch(error: any) {
      console.log(error.message);

      Swal.fire({
        icon: 'error',
        title: '신뢰성시험 계획 저장 내역 불러오기에 실패했습니다.',
      })      
    }
  }

	useEffect(() => {
		if(isOpen) {
			getSaveListData();
		}
	}, [isOpen])

	return (
		<div>
			<Button variant="primary" onClick={handleIsOpen}>변경</Button>
			<Modal isOpen={isOpen} size="lg">
				<Modal.Head>신뢰성시험 계획 저장 내역 조회</Modal.Head>
				<Modal.Body>
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
                saveListData.sort((a, b) => a.reliability_test_plan_update_date > b.reliability_test_plan_update_date ? -1 : 1).map((data, index_st) => (
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
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={putSubmitSaveHistory}>불러오기</Button>
					<Button variant="primary" onClick={handleIsOpen}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default TestDescriptionSaveHistoryModal

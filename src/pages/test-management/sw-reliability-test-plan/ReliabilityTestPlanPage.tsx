import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { AccessAxios } from 'models'

import { IProjectTypeData, IRankIdentificationInputFields } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields'

import ReliabilityTestPlanResultTable from 'components/test-management/sw-reliability-test-plan/ReliabilityTestPlanResultTable'
import GradeIdentification from '../../../components/test-management/sw-reliability-test-plan/grade/GradeIdentification'
import TargetIdentification, { ITargetTableData } from '../../../components/test-management/sw-reliability-test-plan/target/TargetIdentification'

import Swal from 'sweetalert2'
import { targetIdentificationSelectDevLangFields } from 'constant/test_manage/sw-reliability-test-plan/targetIdentificationFields'

const ReliabilityTestPlanPage = () => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id

	useEffect(() => {
		// URL 중에 'dash_2'가 있으면 해당 id로 이동
		const url = window.location.href;

		const index = url.indexOf('dash_2');
		if (index !== -1) {
			window.location.hash = '2';
			return
		}
		
		const index_1 = url.indexOf('dash_1');
		if (index_1 !== -1) {
			window.location.hash = '1';
			return
		}
	}, [window.location.href]);

  // 사업유형 데이터
  const [projectTypeData, setProjectTypeData] = useState<IProjectTypeData>({
    std_business_type_index: '',
    custom_business_type_name: '',
  })

  // 등급 식별 테이블 데이터
  const [rankTableData, setRankTableData] = useState<IRankIdentificationInputFields[]>([])

  // 대상 식별 데이터
  const [targetTableData, setTargetTableData] = useState<ITargetTableData[]>([])

  // 신뢰성 계획 식별 번호
  const [reliabilityPlanIndex, setReliabilityPlanIndex] = useState<string>('')

  // 백엔드에서 사업유형 데이터 가져옴
  const getTargetTypeData = async () => {
    try {
      const res = await AccessAxios.get(`/projects/manage/get/?project_id=${projectID}`)
      setProjectTypeData({
        std_business_type_index: res.data.data.std_business_type_index,
        custom_business_type_name: res.data.data.custom_business_type_name,
      })
    }
    catch (error) {
      Swal.fire({
        icon: 'error',
        title: '사업유형 데이터를 가져오는데 실패했습니다.',
        confirmButtonText: '확인',
      })
    }
  }

  // 등급 식별 테이블 최신 데이터 호출
  const getRankTypeData = async () => {
    try {
      await AccessAxios.get('/reliability/grade/?project_id=' + projectID)
      .then((res) => {
        if(res.status === 200) {
          setRankTableData(() => res.data.data)
          if(res.data.data && res.data.data.length) {
            setReliabilityPlanIndex(res.data.data[0].reliability_plan_index)  
          }
        }
      })
      
    }
    catch (error){
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: '등급 식별 데이터를 불러오는데 실패했습니다.',
        confirmButtonText: '확인',
      })
    }
  }

  // 신뢰성시험 계획 목록에서 선택한 신뢰성 시험계획 목록 불러오기
  const postActiveSaveListData = async (reliability_plan_index: string) => {
    try {
      await AccessAxios.post('/reliability/plan/', {
        reliability_plan_index: reliability_plan_index,
      }).then((res) => {
        setRankTableData(res.data.data) 
        setReliabilityPlanIndex(reliability_plan_index)
      })
    }
    catch(error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '신뢰성 시험계획 목록을 불러오는데 실패했습니다.',
      })
    }
  }

  useEffect(() => {    
    getTargetTypeData()
    getRankTypeData()
  }, [])

  useEffect(() => {
    if(rankTableData && rankTableData.length) {
      const is_test_target_list = ["X", "○", "△"]
    
      setTargetTableData(rankTableData.map((d) => {
        return ({
          reliability_test_index: d.reliability_test_index,
          testUnit: '',
          unitName: d.reliability_test_unit_name,
          devLang: d.reliability_test_language.includes("기타") ? "4" : targetIdentificationSelectDevLangFields.findIndex((lang) => lang === d.reliability_test_language).toString(),
          langEtc: d.reliability_test_language.includes("기타") ? d.reliability_test_language : '', 
          applySW: d.target_sw,
          isAlreadyDevel: ['', '', ''],
          targetTest: { static: is_test_target_list[d.is_reliability_static] , dynamic: is_test_target_list[d.is_reliability_dynamic] },
        })
      }))
    }
  }, [rankTableData])

  return (
    <div className="flex flex-col gap-3">
      <TargetIdentification targetTableData={targetTableData} projectTypeData={projectTypeData} getRankTypeData={getRankTypeData} />

      <GradeIdentification rankTableData={rankTableData} reliability_plan_index={reliabilityPlanIndex} getRankTypeData={getRankTypeData} postActiveSaveListData={postActiveSaveListData} />

      <ReliabilityTestPlanResultTable rankTableData={rankTableData} reliability_plan_index={reliabilityPlanIndex} postActiveSaveListData={postActiveSaveListData}/>
    </div>
  )
}

export default ReliabilityTestPlanPage

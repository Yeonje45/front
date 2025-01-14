import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import BarChart from 'components/common/charts/BarChart'
import PieChart from 'components/common/charts/PieChart'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import Container from 'tailwindElement/Container'

import { RootState } from 'app/store'
import { GetProjectSteps, IProjectStepsModel } from 'models/Layout'

const DashboardProgressPage = () => {
	const project = useSelector((state: RootState) => state.project).project

  const [pieClickData, setPieClickData] = useState<number>(0)
	const [step, setStep] = useState<IProjectStepsModel | null>(null)

	useEffect(() => {
		GetProjectStepsHandler()
	}, [])
	
	const GetProjectStepsHandler = async (): Promise<void> => {
		const project_id = project.project_id
		const res = await GetProjectSteps(project_id)
		if (!res.success || !res.data) {
			return
		} 

		setStep(() => res.data)
		return
	}

  return (
    <Container fluid>
      <PanelContainer>
        <PanelHeader
          title={'진행상태'}
          className="flex items-center justify-between"
        />
        {step && Object.values(step).some((value) => value > 0) ? (
          <div className="flex justify-around p-10">
            <PieChart setPieClickData={setPieClickData} step={step}/>
            <BarChart pieClickData={pieClickData} />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-96 bg-gray-100">
            <span className="text-2xl text-gray-500">현재 진행된 단계가 존재하지 않습니다.</span>
          </div>
        )
      }
      </PanelContainer>
    </Container>
  )
}

export default DashboardProgressPage

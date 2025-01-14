import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import NavbarStepItem from './NavbarStepItem'

import { GetProjectSteps, IProjectStepsModel } from 'models/Layout'
import { RootState } from 'app/store'

const NavbarBottom = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
	const project = useSelector((state: RootState) => state.project).project

	const [step, setStep] = React.useState<IProjectStepsModel>()

	React.useEffect(() => {
		GetProjectStepsHandler()
	}, [searchParams.get('step')])
	
	const GetProjectStepsHandler = async (): Promise<void> => {
		const res = await GetProjectSteps(project.project_id)
		if (!res.success || !res.data) {
			return
		} 
		setStep(() => res.data!)
		return
	}

  return (
    <div className={`p-0 bg-white`}>
			<ul 
				className="items-center p-0 m-0 text-white bg-gray-500 grid grid-rows-1 grid-flow-col"
			>
				{step &&  Object.keys(step).map((stepItem, index) => (
					<NavbarStepItem key={index} text={stepItem} value={step[stepItem].toString()} />
				))}


			</ul>
    </div>
  )
}

export default NavbarBottom

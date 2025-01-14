import React, { useState, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import DashboardFormContainer from 'components/dashboard/DashboardFormContainer'
import DashboardSingleActivePanels from 'components/dashboard/activePanels/DashboardSingleActivePanels'
import DashboardDoubleActivePanels from 'components/dashboard/activePanels/DashboardDoubleActivePanels'
import DashboardTripleActivePanels from 'components/dashboard/activePanels/DashboardTripleActivePanels'
import DashboardQuadActivePanels from 'components/dashboard/activePanels/DashboardQuadActivePanels'

import { dashboardframes, IDashboardFrameFields } from 'constant/dashboard/frameFields'
import DashboardArchitecturalOverview from 'components/dashboard/panels/DashboardArchitecturalOverview'
import DashboardParticipatingOrganizations from 'components/dashboard/panels/DashboardParticipatingOrganizations'
import DashboardDevelopmentTimeline from 'components/dashboard/panels/DashboardDevelopmentTimeline'
import DashboardSystemArchitecture from 'components/dashboard/panels/DashboardSystemArchitecture'
import DashboardNoticeBoard from 'components/dashboard/panels/DashboardNoticeBoard'

export interface IDashboardPanelState extends IDashboardFrameFields {
  frameKey: string
  frameName: string
  index: number
  isActive: boolean
}

export const getActivePanelsElement = (panelKey: string) => {
  switch (panelKey) {
    case 'Architectural-Overview': // 체계 개요
      return <DashboardArchitecturalOverview />
    case 'Development-Timeline': // 개발 일정
      return <DashboardDevelopmentTimeline />
    case 'Participating-Organizations': // 참여 기관
      return <DashboardParticipatingOrganizations />
    case 'System Architecture': // 체계 구조
			return <DashboardSystemArchitecture />
    // case 'Notice-Board': // 공지사항
			// return <DashboardNoticeBoard />
  }
}

const DashboardOverviewPage = () => {
  const [isActivePanels, setIsActivePanels] = useState<IDashboardPanelState[]>(
    dashboardframes.map((dashboardframe, index) => ({
      ...dashboardframe, // frameKey, frameName
      isActive: true,
      index: index,
    })),
  )

  const moveFrame = (dragIndex: number, hoverIndex: number) => {
    const draggedFrame = isActivePanels[dragIndex]
    const newFrames = [...isActivePanels]
    newFrames.splice(dragIndex, 1)
    newFrames.splice(hoverIndex, 0, draggedFrame)
    setIsActivePanels(newFrames.map((frame, index) => ({ ...frame, index })))
  }

	// 페이지 하단에 있는 버튼을 클릭 시에 실행되는 함수 입니다. ( 패널을 오픈하거나 닫을 때 사용 )
  const ChangeActivePanelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget

    setIsActivePanels(prev =>
      prev.map(panel =>
        panel.frameKey === name ? { ...panel, isActive: !panel.isActive } : panel,
      ),
    )
    return
  }

	// 패널 Head 부분을 더블클릭 했을 때 해당 패널을 제외하고 모든 패널을 닫는 함수입니다. 
	const CloseAllPanelsExcept = (e: React.MouseEvent<HTMLDivElement>) => {
		const { id } = e.currentTarget

		setIsActivePanels(prev =>
			prev.map(panel =>
				panel.frameKey === id ? { ...panel, isActive: true } : { ...panel, isActive: false },
			),
		)
	}

  const getCountOfActivePanels = () => {
    let activePanels = isActivePanels.filter(isActivePanel => isActivePanel.isActive)
    switch (isActivePanels.filter(isActivePanel => isActivePanel.isActive).length) {
      case 1:
        return (
          <DashboardSingleActivePanels
            moveFrame={moveFrame}
            isActivePanels={activePanels}
						getActivePanelsElement={getActivePanelsElement}
          />
        )
      case 2:
        return (
          <DashboardDoubleActivePanels
            moveFrame={moveFrame}
            isActivePanels={activePanels}
						CloseAllPanelsExcept={CloseAllPanelsExcept}
						getActivePanelsElement={getActivePanelsElement}
          />
        )
      case 3:
        return (
          <DashboardTripleActivePanels
            moveFrame={moveFrame}
            isActivePanels={activePanels}
						CloseAllPanelsExcept={CloseAllPanelsExcept}
						getActivePanelsElement={getActivePanelsElement}
          />
        )
      case 4:
        return (
          <DashboardQuadActivePanels
            moveFrame={moveFrame}
            isActivePanels={activePanels}
						CloseAllPanelsExcept={CloseAllPanelsExcept}
						getActivePanelsElement={getActivePanelsElement}
          />
        )
      default:
        return (
          <div className="w-3/4 p-2 mx-auto text-lg text-white bg-blue-300 shadow-md rounded-md">
            하단 버튼을 클릭하여 패널 오픈
          </div>
        )
    }
  }

  return (
		<React.Fragment>
			<DashboardFormContainer
				isActivePanels={isActivePanels}
				ChangeActivePanelHandler={ChangeActivePanelHandler}>
				<DndProvider backend={HTML5Backend}>{getCountOfActivePanels()}</DndProvider>
			</DashboardFormContainer>
		</React.Fragment>
  )
}

export default DashboardOverviewPage

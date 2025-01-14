import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import ConfigurationFormContainer from 'components/config-management/configuration-identification/ConfigurationFormContainer';
import ClassificationIdentification from 'components/config-management/configuration-identification/panels/ClassificationIdentification/Classification-Identification';
import ClassificationIdentificationDocument from 'components/config-management/configuration-identification/panels/ConfigurationIdentificationDocument/ConfigurationIdentificationDocument';
import ConfigurationItemStructure from 'components/config-management/configuration-identification/panels/ConfigurationItemStructure/ConfigurationItemStructure';
import RequirementIdentifierRules from 'components/config-management/configuration-identification/panels/RequirementIdentifierRules/RequirementIdentifierRules';
import DashboardSingleActivePanels from 'components/dashboard/activePanels/DashboardSingleActivePanels'
import DashboardDoubleActivePanels from 'components/dashboard/activePanels/DashboardDoubleActivePanels'
import DashboardTripleActivePanels from 'components/dashboard/activePanels/DashboardTripleActivePanels'
import DashboardQuadActivePanels from 'components/dashboard/activePanels/DashboardQuadActivePanels'

import { configurationframes, IConfigurationFrameFields } from 'constant/config-management/frameFields'

interface IConfigurationPanelState extends IConfigurationFrameFields {
  frameKey: string
  frameName: string
  index: number
  isActive: boolean
}

export const getActivePanelsElement = (panelKey: string) => {
  switch (panelKey) {
		case 'Classification-Identification': // 분류체계 식별자
				return <ClassificationIdentification />
		case 'Configuration-Item-Composition': // 형상항목 구성
				return <ConfigurationItemStructure />
		case 'Configuration-Identification-Document': // 형상식별서
				return <ClassificationIdentificationDocument />
		case 'Requirement-Identification-Rule': // 요구사항 식별자 부여규칙
				return <RequirementIdentifierRules />
  }
}

const ConfigurationIdentification = () => {
  const [isActivePanels, setIsActivePanels] = React.useState<IConfigurationPanelState[]>(
    configurationframes.map((configurationFrame, index) => ({
      ...configurationFrame, // frameKey, frameName
      isActive: true,
      index: index,
    })),
  )

  const ChangeActivePanelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget

    setIsActivePanels(prev =>
      prev.map(panel =>
        panel.frameKey === name ? { ...panel, isActive: !panel.isActive } : panel,
      ),
    )
    return
  }

  const moveFrame = (dragIndex: number, hoverIndex: number) => {
    const draggedFrame = isActivePanels[dragIndex]
    const newFrames = [...isActivePanels]
    newFrames.splice(dragIndex, 1)
    newFrames.splice(hoverIndex, 0, draggedFrame)
    setIsActivePanels(newFrames.map((frame, index) => ({ ...frame, index })))
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
			<ConfigurationFormContainer
				isActivePanels={isActivePanels}
				ChangeActivePanelHandler={ChangeActivePanelHandler}>
				<DndProvider backend={HTML5Backend}>{getCountOfActivePanels()}</DndProvider>
			</ConfigurationFormContainer>
		</React.Fragment>
	);
};

export default ConfigurationIdentification;

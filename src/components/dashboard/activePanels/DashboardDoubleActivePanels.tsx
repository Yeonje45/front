import DashboardPanel from './DashboardActivePanel'
import PanelBody from 'components/common/panels/PanelBody'

import {
  IDashboardPanelState,
} from 'pages/dashboard/overview/DashboardOverviewPage'

interface IProps {
  moveFrame: (dragIndex: number, hoverIndex: number) => void
  isActivePanels: IDashboardPanelState[]
	CloseAllPanelsExcept: (e: React.MouseEvent<HTMLDivElement>) => void
	getActivePanelsElement: (panelKey: string) => JSX.Element | undefined
}

const DashboardDoubleActivePanels = ({ moveFrame, isActivePanels, CloseAllPanelsExcept, getActivePanelsElement }: IProps) => {
  return (
    <div className="grid grid-cols-1 gap-2 pb-14 h-screen">
      <DashboardPanel
        className="w-full"
        index={0}
        moveFrame={moveFrame}
        isActivePanel={isActivePanels[0]}
				onDoubleClick={CloseAllPanelsExcept}>
        <PanelBody className="max-h-[500px] min-h-[500px]">
          {getActivePanelsElement(isActivePanels[0].frameKey)}
        </PanelBody>
      </DashboardPanel>
      <DashboardPanel
        className="w-full"
        index={1}
        moveFrame={moveFrame}
        isActivePanel={isActivePanels[1]}
				onDoubleClick={CloseAllPanelsExcept}>
        <PanelBody className="max-h-[500px] min-h-[500px]">
          {getActivePanelsElement(isActivePanels[1].frameKey)}
        </PanelBody>
      </DashboardPanel>
    </div>
  )
}

export default DashboardDoubleActivePanels

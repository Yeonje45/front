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

const DashboardQuadActivePanels = ({ moveFrame, isActivePanels, CloseAllPanelsExcept, getActivePanelsElement }: IProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-14 h-screen">
			{ isActivePanels.map((panelItem, index) => (
				<DashboardPanel
					key={panelItem.frameKey}
					className="w-full"
					index={index}
					moveFrame={moveFrame}
					isActivePanel={panelItem}
					onDoubleClick={CloseAllPanelsExcept}>
					<PanelBody className="max-h-[500px]">
						{getActivePanelsElement(panelItem.frameKey)}
					</PanelBody>
				</DashboardPanel>
			)) }
    </div>
  )
}

export default DashboardQuadActivePanels

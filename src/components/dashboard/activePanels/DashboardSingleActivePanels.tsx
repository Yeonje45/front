import PanelBody from 'components/common/panels/PanelBody'
import DashboardPanel from './DashboardActivePanel'

import {
  IDashboardPanelState,
} from 'pages/dashboard/overview/DashboardOverviewPage'

interface IProps {
  moveFrame: (dragIndex: number, hoverIndex: number) => void
  isActivePanels: IDashboardPanelState[]
	getActivePanelsElement: (panelKey: string) => JSX.Element | undefined
}

const DashboardSingleActivePanels = ({ moveFrame, isActivePanels, getActivePanelsElement }: IProps) => {
  return (
    <DashboardPanel
      className="col-lg-12 col-md-12 col-12"
      index={0}
      moveFrame={moveFrame}
      isActivePanel={isActivePanels[0]}>
      <PanelBody className="h-full pb-14">
        {getActivePanelsElement(isActivePanels[0].frameKey)}
      </PanelBody>
    </DashboardPanel>
  )
}

export default DashboardSingleActivePanels

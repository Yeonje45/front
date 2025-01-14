import { useDrag, useDrop } from 'react-dnd'

import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'

import { IDashboardPanelState } from 'pages/dashboard/overview/DashboardOverviewPage'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  moveFrame: (dragIndex: number, hoverIndex: number) => void
  isActivePanel: IDashboardPanelState
}

const DashboardPanel = ({
  className,
  children,
	onDoubleClick,
  index,
  moveFrame,
  isActivePanel,
}: IProps) => {
  const [, drag] = useDrag({
    type: 'DASHBOARD_FRAME',
    item: { index },
  })

  const [, drop] = useDrop({
    accept: 'DASHBOARD_FRAME',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveFrame(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  return (
    <div className={`${className} h-full`}>
      <PanelContainer className="h-full">
        <PanelHeader title={isActivePanel.frameName} id={isActivePanel.frameKey} onDoubleClick={onDoubleClick} drag={drag} drop={drop}/>
        {children}
      </PanelContainer>
    </div>
  )
}

export default DashboardPanel

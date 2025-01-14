import Button from 'tailwindElement/Button'

import styles from './dashboard.module.scss'
import { dashboardframes } from 'constant/dashboard/frameFields'
import { IDashboardPanelState } from 'pages/dashboard/overview/DashboardOverviewPage'
import DashboardNoticeBoard from 'components/dashboard/panels/DashboardNoticeBoard'

interface IProps {
  isActivePanels: IDashboardPanelState[]
  ChangeActivePanelHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const DashboardBottomPanels = ({ isActivePanels, ChangeActivePanelHandler }: IProps) => {
  return (
    <div className="fixed bottom-0 left-0 lg:left-60 z-50">
      <div className={styles.dashboard_bottom_buttons}>
        {dashboardframes.map(dashboardframeItem => (
          <Button
            className="panels_active_btn"
            key={dashboardframeItem.frameKey}
            name={dashboardframeItem.frameKey}
            // 액티브된 패널 배열 중에서 프래임키에 해당하는 인덱스를 찾고, 해당 인댁스에 해당하는 isActive가 True인지 확인
            variant={`${
              isActivePanels[
                isActivePanels.findIndex(
                  isActivePanelItem =>
                    isActivePanelItem.frameKey == dashboardframeItem.frameKey,
                )
              ].isActive
                ? 'secondary'
                : 'light'
            }`}
            onClick={ChangeActivePanelHandler}>
            {dashboardframeItem.frameName}
          </Button>
        ))}
        <DashboardNoticeBoard />
      </div>
    </div>
  )
}

export default DashboardBottomPanels

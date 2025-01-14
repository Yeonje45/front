import Button from 'tailwindElement/Button'

import styles from 'components/dashboard/dashboard.module.scss'
import { configurationframes } from 'constant/config-management/frameFields'
import { IDashboardPanelState } from 'pages/dashboard/overview/DashboardOverviewPage'

interface IProps {
  isActivePanels: IDashboardPanelState[]
  ChangeActivePanelHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ConfigurationBottomPanels = ({ isActivePanels, ChangeActivePanelHandler }: IProps) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 lg:left-60">
      <div className={styles.dashboard_bottom_buttons}>
        {configurationframes.map(configframeItem => (
          <Button
            key={configframeItem.frameKey}
            name={configframeItem.frameKey}
            // 액티브된 패널 배열 중에서 프래임키에 해당하는 인덱스를 찾고, 해당 인댁스에 해당하는 isActive가 True인지 확인
            variant={`${
              isActivePanels[
                isActivePanels.findIndex(
                  isActivePanelItem =>
                    isActivePanelItem.frameKey == configframeItem.frameKey,
                )
              ].isActive
                ? 'secondary'
                : 'light'
            }`}
            onClick={ChangeActivePanelHandler}>
            {configframeItem.frameName}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default ConfigurationBottomPanels

import Container from 'tailwindElement/Container'

import ConfigurationBottomPanels from './ConfigurationBottomPanels'

import { IDashboardPanelState } from 'pages/dashboard/overview/DashboardOverviewPage'

interface IProps {
  children: React.ReactNode
  isActivePanels: IDashboardPanelState[]
  ChangeActivePanelHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

// 로그인 상태 시에만 접근이 가능한 페이지에서만 사용합니다.
const ConfigurationFormContainer = ({
  children,
  isActivePanels,
  ChangeActivePanelHandler,
}: IProps) => {
  return (
    <Container fluid className="relative w-full min-h-full pb-8">
      {children}
      <ConfigurationBottomPanels
        isActivePanels={isActivePanels}
        ChangeActivePanelHandler={ChangeActivePanelHandler}
      />
    </Container>
  )
}

export default ConfigurationFormContainer

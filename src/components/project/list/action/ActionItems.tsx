import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'
import Accordion from 'tailwindElement/Accordion'

import styles from './actionItems.module.scss'

interface IActionItem {
  [key: string]: string
}

const ActionItems = () => {
  const actionItem: IActionItem[] = [
    {
      title: '(검토요청) 설계 요구사항',
      text: '각 설계 요구사항이 소프트웨어 설계 표준을 준수하는지 검토 요청',
    },
    {
      title: '(검토요청) 통합 테스트 계획서',
      text: '개발 및 검증 엔지니어가 계획을 따를 수 있도록 충분히 명확하고 상세하고 있는지?',
    },
    {
      title: '(승인요청) 소스코드 등록',
      text: '소스코드 등록 후 설계 요구사항과 관련 내용을 연결하기 위함',
    },
    {
      title: '(승인요청) 베이스라인 등록',
      text: 'CDR 검토를 위한 산출물 베이스라인입니다.',
    },
    {
      title: '(승인요청) 형상변경',
      text: '체계 운용개념 변경으로 인한 영향 받는 요구사항이 변경되어야 합니다.',
    },
  ]

  return (
    <PanelContainer className="w-3/4 mt-10">
      <PanelHeader title="Action Item" />
      <PanelBody className={`flex overflow-x-auto ${styles.scrollbar}`}>
        {actionItem &&
          actionItem.map((item, index_st) => (
            <Accordion key={index_st} className="m-2 min-w-96">
              <Accordion.Header>{item.title}</Accordion.Header>
              <Accordion.Body className="max-h-52 min-w-16">
                {item.text}
              </Accordion.Body>
            </Accordion>
          ))}
      </PanelBody>
    </PanelContainer>
  )
}

export default ActionItems

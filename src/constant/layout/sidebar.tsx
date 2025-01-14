// 일반 이동 버튼과 드롭다운 버튼을 구분하기 위한 타입
// isCollapse: 드롭다운 버튼인지 아닌지
// isLink: 일반 이동 버튼인지 아닌지
// isCollapse가 true면 isLink는 false
// isCollapse가 false면 isLink는 true
// 이렇게 구분하는 이유는 드롭다운 버튼은 클릭 시 이동하지 않고 드롭다운 메뉴를 펼치기 위함

import {
  BarChart,
  Box,
	Git,
  ListCheck,
  People,
  Share,
	GraphUpArrow,
	JournalCheck
} from 'react-bootstrap-icons'
import { Fragment } from 'react' // Import React package

// 반면 일반 이동 버튼은 클릭 시 이동하기 위함
export interface INavItem {
  isCollapse: boolean
  isLink: boolean
  to?: string
  toggleText: JSX.Element
  collapseItems?: INavItemCollapse[]
}

interface INavItemCollapse {
  toggleText: string
  to: string
  collapseItems?: { toggleText: string; to: string; id?: string }[]
}

// 임시로 사용하는 임시 데이터
export const GlobalLayoutOutletNavItems: INavItem[] = [
  {
    isCollapse: true,
    isLink: false,
    toggleText: (
      <Fragment>
        <BarChart />
        대시보드
      </Fragment>
    ),
    collapseItems: [
      {
        toggleText: '대시보드 개요',
        to: '/dashboard/overview',
      },
      {
        toggleText: '진행상태',
        to: '/dashboard/progress',
      },
    ],
  },
  {
    isCollapse: true,
    isLink: false,
    toggleText: (
      <Fragment>
        <Box /> 산출물 관리
      </Fragment>
    ),
    collapseItems: [
      {
        toggleText: '테일러링',
        to: '/product/tailoring',
      },
      {
        toggleText: '단계별 산출물 목록',
        to: '/product/list',
      },
      {
        toggleText: '단계별 산출물 작성현황',
        to: '/product/condition',
      },
			{
				toggleText: 'SW 개발 계획서(SDP) 작성',
				to: '/product/output-product/sw-development-plan',
			},
			{
				toggleText: 'SW 산출물 명세서(SPS) 작성',
				to: '/product/output-product/sw-output-specification',
			},
    ],
  },
  {
    isCollapse: true,
    isLink: false,
    toggleText: (
      <Fragment>
        <Share />
        요구사항 관리
      </Fragment>
    ),
    collapseItems: [
      {
        toggleText: '요구사항 항목 편집',
        to: '/requirements-management/input-requirement',
      },
      {
        toggleText: '요구사항 산출물 작성',
        to: '/requirements-management/output-requirement',
        collapseItems: [
          {
            toggleText: 'SW 요구사항 명세서(SRS)',
            to: '/requirements-management/output-requirement/sw-requirement-specification',
          },
          {
            toggleText: 'SW 설계 기술서(SDD)',
            to: '/requirements-management/output-requirement/sw-design-description',
          },
        ],
      },
    ],
  },
  {
    isCollapse: true,
    isLink: true,
    toggleText: (
      <Fragment>
        <ListCheck />
        시험 관리
      </Fragment>
    ),
    collapseItems: [
      // {
      //   toggleText: '시험 산출물 작성현황',
      //   to: '/test-management/condition',
      // },
      {
        toggleText: '신뢰성 시험 계획',
        to: '/test-management/sw-reliability-test-plan/',
        collapseItems: [
          {
            toggleText: '대상 식별',
            to: '/test-management/sw-reliability-test-plan/dash_1/',
          },
          {
            toggleText: '등급 식별',
            to: '/test-management/sw-reliability-test-plan/dash_2/',
          },
        ],
      },
      {
        toggleText: '통합 시험 계획',
        to: '/test-management/sw-integration-test',
        collapseItems: [
          {
            toggleText: '통합시험계획(STP)',
            to: '/test-management/sw-integration-test/test-plan',
          },
          {
            toggleText: '통합시험절차(STD)',
            to: '/test-management/sw-integration-test/test-description',
          },
        ],
      },
			{
				toggleText: '통합 시험 결과',
				to: '',
				collapseItems: [
					{
						toggleText: '시험 수행 기록',
						to: '/test-management/test-execution-records',
					},
					{
						toggleText: '통합시험결과(STR)',
						to: '/test-management/sw-integration-test/test-report',
					},
				]
			}
    ],
  },
	{
		isCollapse: true,
		isLink: false,
		toggleText: (
			<Fragment>
				<Git /> 형상관리
			</Fragment>
		),
		collapseItems: [
			{
				toggleText: '형상식별',
				to: '/config-management/configuration-identification',
			},
			{
				toggleText: '버전 및 산출물 관리',
				to: '/config-management/version-deliverable-management',
			},
			{
				toggleText: '베이스라인 관리',
				to: '/config-management/baseline-management',
			},
		]
	},
	{
		isCollapse: true,
		isLink: false,
		toggleText: (
			<Fragment><JournalCheck /> 품질관리</Fragment>
		),
		collapseItems: [
			{
				toggleText: 'SW 검증',
				to: '/quality-management/verification',
			},
			{
				toggleText: 'SW 검토',
				to: '/quality-management/review',
			},
			{
				toggleText: 'SW 결함관리대장',
				to: '/quality-management/defect-management-log',
			},
		]
	},
  {
    isCollapse: true,
    isLink: false,
    toggleText: (
      <Fragment>
				<GraphUpArrow /> 신뢰도 관리
      </Fragment>
    ),
    collapseItems: [
      {
        toggleText: '요구사항 분석(SRR)',
        to: '/reliability-management/SRR',
      },
      {
        toggleText: '기본설계(PDR)',
        to: '/reliability-management/PDR',
      },
      {
        toggleText: '상세설계(CDR)',
        to: '/reliability-management/CDR',
      },
      {
        toggleText: '구현(Implementation)',
        to: '/reliability-management/Implementation',
      },
    ],
  },
]

// 사용자 관리 페이지에서 사용하는 임시 데이터
// 사용자 정보 수정
// 사용자 알림 관리
// 사용자 정보 조회/관리
// collapese 로 관리하지 않음
export const UserSettingNavItems: INavItem[] = [
  {
    isCollapse: false,
    isLink: true,
    to: '/user-setting/info',
    toggleText: (
      <Fragment>
        <People />
        사용자 정보 관리
      </Fragment>
    ),
  },
  /*
  {
    isCollapse: false,
    isLink: true,
    to: '/user-setting/notification',
    toggleText: (
      <Fragment>
        <People />
        사용자 알림 관리
      </Fragment>
    ),
  },
  */
]


// 신뢰도 관리 데이터 따로 관리
export const ReliabilityManagementNavItems: INavItem[] = [
  {
    isCollapse: true,
    isLink: false,
    toggleText: (
      <Fragment>
				<GraphUpArrow /> 신뢰도 관리
      </Fragment>
    ),
    collapseItems: [
      {
        toggleText: '요구사항 분석(SRR)',
        to: '/reliability-management/SRR',
      },
      {
        toggleText: '기본설계(PDR)',
        to: '/reliability-management/PDR',
      },
      {
        toggleText: '상세설계(CDR)',
        to: '/reliability-management/CDR',
      },
      {
        toggleText: '구현(Implementation)',
        to: '/reliability-management/Implementation',
      },
    ],
  },
]

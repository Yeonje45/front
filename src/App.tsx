import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Outlets
import GlobalLayoutOutlet from './outlets/GlobalLayoutOutlet'
import SidebarLayoutOutlet from './outlets/SidebarLayoutOutlet'
import { GlobalLayoutOutletNavItems, ReliabilityManagementNavItems, UserSettingNavItems } from 'constant/layout/sidebar'

// Pages
import ProjectCreatePage from 'pages/project/create/ProjectCreatePage'
import ProjectListPage from 'pages/project/list/ProjectListPage'
import ProjectUpdatePage from 'pages/project/update/ProjectUpdatePage'
import UserLoginPage from 'pages/user/login/UserLoginPage'
import UserSignupPage from 'pages/user/signup/UserSignupPage'
import UserSettingPage from 'pages/user/setting/UserSettingPage'
import UserNotificationPage from 'pages/user/setting/UserNotificationPage'
import UserManagePage from 'pages/user/setting/UserManagePage'
import DashboardOverviewPage from 'pages/dashboard/overview/DashboardOverviewPage'
import DashboardProgressPage from 'pages/dashboard/progress/DashboardProgressPage'

import ProductListPage from 'pages/product/list/ProductListPage'
import ProductConditionPage from 'pages/product/condition/ProductConditionPage'
import InputRequirementsPage from 'pages/requirements-management/input-requirements/InputRequirementsPage'
import RequirementSpecificationPage from 'pages/requirements-management/output-requirements/sw-requirements-specification/RequirementSpecificationPage'
import DesignDescriptionPage from 'pages/requirements-management/output-requirements/sw-design-description/DesignDescriptionPage'

import TestConditionPage from 'pages/test-management/condition/TestConditionPage'
import ReliabilityTestPlanPage from 'pages/test-management/sw-reliability-test-plan/ReliabilityTestPlanPage'

import ConfigurationIdentificationPage from 'pages/config-management/ConfigurationIdentificationPage'
import VersionAndDeliverableManagementPage from 'pages/config-management/VersionAndDeliverableManagementPage'
import BaselineManagementPage from 'pages/config-management/BaselineManagementPage'

import DefectManagementLog from 'pages/quality-management/DefectManagementLog'
import ReviewPage from 'pages/quality-management/ReviewPage'
import VerificationPage from 'pages/quality-management/VerificationPage'

// Feature, Actions
import { logoutUser } from 'features/user/userSlice'
import { getCookieByName, removeCookie } from 'utils/cookie'
import TestPlanPage from 'pages/test-management/sw-integration-test/test-plan/TestPlanPage'
import TestDescriptionPage from 'pages/test-management/sw-integration-test/test-description/TestDescriptionPage'
import TestReportPage from 'pages/test-management/sw-integration-test/test-report/TestReportPage'
import TestExecutionRecordsPage from 'pages/test-management/test-execution-records/TestExecutionRecordsPage'
import ProductTailoringPage from 'pages/product/tailoring/ProductTailoringPage'

///////////////////////////////// RADC /////////////////////////////////
import InputTableForm from 'reliability-management/InputTableForm'
import DevelopmentPlanPage from 'pages/product/output-product/sw-development-plan/DevelopmentPlanPage'
import OutputSpecificationPage from 'pages/product/output-product/sw-output-specification/OutputSpecificationPage'
///////////////////////////////// RADC /////////////////////////////////

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!getCookieByName('access_token') || !getCookieByName('user_id')) {
      dispatch(logoutUser())
    }
  }, [getCookieByName('access_token'), getCookieByName('user_id')])

  return (
    <Routes>
			<Route path="/reliability-management" element={
          <SidebarLayoutOutlet
            NavItems={ReliabilityManagementNavItems}
          />
        }>
				<Route path="SRR" element={<InputTableForm step="SRR"/>}/>
        <Route path="PDR" element={<InputTableForm step="PDR"/>}/>
        <Route path="CDR" element={<InputTableForm step="CDR"/>}/>
        <Route path="Implementation" element={<InputTableForm step="Implementation"/>}/>
			</Route>

      {/* 로그인 상태가 아닐 때만 접근이 가능 */}
      <Route path="/">
        <Route index element={<UserLoginPage />} />
        <Route path="/user">
          <Route path="signup" element={<UserSignupPage />} />
        </Route>
      </Route>
      {/* 로그인 상태에만 접근이 가능 */}
      <Route
        path="/product"
        element={
          <GlobalLayoutOutlet
            NavItems={GlobalLayoutOutletNavItems}
            navbarTop={true}
            navbarBottom={true}
            projectName="AAA 프로젝트"
          />
        }>
        <Route path="tailoring" element={<ProductTailoringPage />} />
        <Route path="list" element={<ProductListPage />} />
        <Route path="condition" element={<ProductConditionPage />} />
        <Route path="output-product">
          <Route path="sw-development-plan" element={<DevelopmentPlanPage/>} />
          <Route path="sw-output-specification" element={<OutputSpecificationPage />} />
        </Route>
      </Route>
      {/* 로그인 상태에만 접근이 가능 */}
      <Route
        path="/project"
        element={
          <GlobalLayoutOutlet navbarTop={true} navbarBottom={false} projectName="" />
        }>
        <Route path="create" element={<ProjectCreatePage />} />
        <Route path="list" element={<ProjectListPage />} />
        <Route path="update/:id" element={<ProjectUpdatePage />} />
      </Route>
      {/* 로그인 상태에만 접근이 가능 */}
      <Route
        path="/user-setting"
        element={
          <GlobalLayoutOutlet
            NavItems={UserSettingNavItems}
            navbarTop={true}
            navbarBottom={false}
            projectName=""
          />
        }>
        {/* Navbar 프로젝트 이름 없는 버전 OUTLET 추가 */}
        <Route path="info" element={<UserSettingPage />} /> {/* 사용자 정보 관리 */}
        <Route path="manage" element={<UserManagePage />} /> {/* 권한 관리/조회 */}
        <Route path="notification" element={<UserNotificationPage />} />
      </Route>
      {/* 로그인 상태에만 접근이 가능 */}
      <Route
        path="/dashboard"
        element={
          <GlobalLayoutOutlet
            NavItems={GlobalLayoutOutletNavItems}
            navbarTop={true}
            navbarBottom={true}
            projectName="AAA 프로젝트"
          />
        }>
        <Route path="overview" element={<DashboardOverviewPage />} />
        <Route path="progress" element={<DashboardProgressPage />} />
      </Route>
      {/* 로그인 상태에만 접근이 가능 */}
      <Route
        path="/requirements-management"
        element={
          <GlobalLayoutOutlet
            NavItems={GlobalLayoutOutletNavItems}
            navbarTop={true}
            navbarBottom={true}
            projectName="AAA 프로젝트"
          />
        }>
        <Route path="input-requirement" element={<InputRequirementsPage />} />

        <Route
          path="output-requirement">
          <Route path="sw-requirement-specification" element={<RequirementSpecificationPage />} />
          <Route path="sw-design-description" element={<DesignDescriptionPage />} />
        </Route>
      </Route>
      {/* 로그인 상태에만 접근이 가능 */}
      <Route
        path="/test-management"
        element={
          <GlobalLayoutOutlet
            NavItems={GlobalLayoutOutletNavItems}
            navbarTop={true}
            navbarBottom={true}
            projectName="AAA 프로젝트"
          />
        }>
        {/* <Route path="condition" element={<TestConditionPage />} /> */}

        <Route path="sw-integration-test">
          <Route path="test-plan" element={<TestPlanPage />} />
          <Route path="test-description" element={<TestDescriptionPage />} />
          <Route path="test-report" element={<TestReportPage />} />
        </Route>

        <Route path="sw-reliability-test-plan/dash_1" element={<ReliabilityTestPlanPage />} />
        <Route path="sw-reliability-test-plan/dash_2" element={<ReliabilityTestPlanPage />} />
        <Route path="test-execution-records" element={<TestExecutionRecordsPage />} />
      </Route>
			{/* 로그인 상태에만 접근이 가능 */}
			<Route
				path="/config-management"
				element={
					<GlobalLayoutOutlet
						NavItems={GlobalLayoutOutletNavItems}
						navbarTop={true}
						navbarBottom={true}
						projectName="AAA 프로젝트"
					/>
				}>
				<Route path="configuration-identification" element={<ConfigurationIdentificationPage />} />
				<Route path="version-deliverable-management" element={<VersionAndDeliverableManagementPage />} />
				<Route path="baseline-management" element={<BaselineManagementPage />} />
			</Route>
			{/* 로그인 상태에만 접근이 가능 */}
			<Route
				path="/quality-management"
				element={
					<GlobalLayoutOutlet
						NavItems={GlobalLayoutOutletNavItems}
						navbarTop={true}
						navbarBottom={true}
						projectName="AAA 프로젝트"
					/>
				}>
				<Route path="defect-management-log" element={<DefectManagementLog />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="verification" element={<VerificationPage />} />
			</Route>
    </Routes>
  )
}
export default App

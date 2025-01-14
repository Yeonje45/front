import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import RequirementsManagementCommendLineContainer from 'components/requirements-management/containers/CommendLineContainer'
import InputRequirementTree from 'components/requirements-management/InputRequirements/InputRequirementTree'
import InputRequirementTable from 'components/requirements-management/InputRequirements/InputRequirementTable'
import { InputRequirementFileHeadTop, InputRequirementFileHeadBottom } from 'components/requirements-management/InputRequirements/InputRequirementFileHead'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { RequirementProvider } from 'context/requirementContext'

import { RootState } from 'app/store'
import { getEditModeState, changeEditModeState } from 'models/RequirementModel';

// 이 페이지는 요구사항 입력 페이지입니다.
// 요구사항 입력 페이지는 요구사항 탐색기와 체계요구사항(테이블)으로 구성되어 있습니다.
// 요구사항 탐색기는 트리구조로 구성되어 있습니다.
// 체계요구사항은 엑셀 칸으로 구성되어 있습니다.
const InputRequirementsPage = () => {
  const project_state = useSelector((state: RootState) => state.project).project;
  const user_state = useSelector((state: RootState) => state.user).user;

	const [editingUser, setEditingUser] = useState<string>('')
	const [editModeState, setEditModeState] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      const editModeStateResponse = await getEditModeState(project_state.project_id, 'requirement');
      if (!editModeStateResponse.success || !editModeStateResponse.data) {
        Swal.fire({
          icon: 'error',
          title: '편집 모드 조회 실패',
          text: editModeStateResponse.message,
        });
        return;
      }
      if (editModeStateResponse.data.user_id) {
        setEditingUser(editModeStateResponse.data.user_id);
        if (editModeStateResponse.data.user_id === user_state.user_id) {
          setEditModeState(true);
        }
      }
    };
    init();
  }, [])

	const handleEditModeState = async (): Promise<void> => {
    const editModeStateResponse = await getEditModeState(project_state.project_id, 'requirement');
    if (!editModeStateResponse.success || !editModeStateResponse.data) {
      Swal.fire({
        icon: 'error',
        title: '편집 모드 조회 실패',
        text: editModeStateResponse.message,
      });
      return;
    }
    // 편집 중인 사용자가 있는데 해당 사용자가 현재 사용자가 아닌 경우 경고 메시지를 출력
    if (editModeStateResponse.data.user_id && editModeStateResponse.data.user_id !== user_state.user_id) {
      Swal.fire({
        icon: 'error',
        title: '편집 중',
        text: '다른 사용자가 요구사항을 편집 중입니다.',
      });
      return;
    }
    // 편집 중인 경우 편집 모드를 해제하고 편집 중인 사용자를 초기화
    if (editModeState) {
      const changeEditModeStateResponse = await changeEditModeState(project_state.project_id, 'requirement', false);
      if (!changeEditModeStateResponse.success) {
        Swal.fire({
          icon: 'error',
          title: '편집 모드 해제 실패',
          text: changeEditModeStateResponse.message,
        });
        return;
      }
      setEditingUser(() => "");
		  setEditModeState(() => false)
    }

    // 편집 중이지 않은 경우 편집 모드를 활성화하고 편집 중인 사용자를 현재 사용자로 설정
    if (!editModeState) {
      const changeEditModeStateResponse = await changeEditModeState(project_state.project_id, 'requirement', true);
      if (!changeEditModeStateResponse.success) {
        Swal.fire({
          icon: 'error',
          title: '편집 모드 활성화 실패',
          text: changeEditModeStateResponse.message,
        });
        return;
      }
      setEditingUser(user_state.user_id);
		  setEditModeState(() => true)
    }
	}

	return (
		<RequirementProvider>
			<RequirementsManagementCommendLineContainer>
				<PanelContainer>
					<PanelHeader>
						{/* 파일 관련 Import, Export, Download Template, CSC Struct ... */}
						<InputRequirementFileHeadTop
							editModeState={editModeState}
							handleEditModeState={handleEditModeState}
						/>
					</PanelHeader>
					<PanelHeader>
						{/* 추적성 관련 */}
						<InputRequirementFileHeadBottom
							editModeState={editModeState}
							handleEditModeState={handleEditModeState}
						/>
					</PanelHeader>
					<PanelBody className="min-h-full">
						<div className="flex h-full flex-nowrap">
							{/* 요구사항 탐색기 */}
							<InputRequirementTree />
							{/* SW요구사항 테이블 */}
							<InputRequirementTable
								editingUser={editingUser}
								editModeState={editModeState}
								handleEditModeState={handleEditModeState}
							/>
						</div>
					</PanelBody>
				</PanelContainer>
			</RequirementsManagementCommendLineContainer>
		</RequirementProvider>
	)
}

export default InputRequirementsPage

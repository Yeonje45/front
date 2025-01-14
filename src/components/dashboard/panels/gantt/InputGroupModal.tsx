import { useEffect, useState } from 'react'
import sweetAlert2 from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import { ICustomDataGroup } from '../DashboardDevelopmentTimeline'

import { useSelector } from "react-redux";
import { RootState } from "app/store";
import { DashboardGanttGroupModel } from 'models/DashboardModel'
import { on } from 'events'

interface IProps {
	inputGroupModalState: boolean
	handleInputGroup: () => void
  everyDataGroup: ICustomDataGroup[]
  onGroupCreateFront: (createdGroup:ICustomDataGroup) => void
  onGroupCreateBack: (createdGroup:ICustomDataGroup) => void
  onCreatedGroupID: number | null
}

interface NestedData {
  id: number
  content: string
}

const InputGroupModal = ({ inputGroupModalState, handleInputGroup, everyDataGroup, onGroupCreateFront, onGroupCreateBack, onCreatedGroupID }: IProps) => {
  const project_state = useSelector((state: RootState) => state.project)
	// Group 기본 정보
  const [newGroupContent, setNewGroupContent] = useState(''); //새로 생성할 그룹 이름
  // Group 연계 관련 정보
  const [newTargetGroup, setNewTargetGroup] = useState({ id: '', content: '' }); //리스트에서 선택된 nest 예비 그룹 정보
  const [nestedGroups, setNestedGroups] = useState<NestedData[]>([]); //새로 구성된 하부 그룹 정보
  // Group 생성 Meta 정보
  const [nextGroupIndex, setNextGroupIndex] = useState(0); //새로 생성할 그룹의 ID 값
  const tempKeyID = -12345; // 임시 음수 ID -  연계 관계 설정용도
  
  const handleGroupContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupContent(e.target.value);
  }
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedContent = everyDataGroup.find(column => column.id.toString() === selectedId)?.content?.toString() || '';
    setNewTargetGroup({ id: selectedId, content: selectedContent });
  };

  const handleAddGroup = () => {
    if (newTargetGroup.id && newTargetGroup.content) {
      setNestedGroups(prevGroups => [
        ...prevGroups,
        {
          id: parseInt(newTargetGroup.id, 10),
          content: newTargetGroup.content
        }
      ]);
      setNewTargetGroup({ id: '', content: '' }); // 추가 후 선택 초기화
    }
  };

  const handleDeleteGroup = (id: number) => {
    setNestedGroups(prevGroups => prevGroups.filter(group => group.id !== id));
  };

  const handleCreateGroupDataBack = () => {
    if (!newGroupContent) {
      sweetAlert2.fire({
        icon: "error",
        title: "생성 오류",
        text: "그룹 이름을 입력해주세요.",
      });
      return;
    }

    // section for backend update
    // backend에 데이터 등록을 마친 후에 프론트엔드에 데이터를 추가하는 방식으로 진행 - id를 받아오기 위함
    // 현재 선택하여 생성중인 그룹의 정보를 createdGroup로 정리하고 onGroupCreateBack 호출
    const createdGroup = {
      id: 0, // 자동 생성값 사용할거라 0넣고 보냄 - 안넣으면 틀에 안맞아서 오류남
      content: newGroupContent,
      showNested: true,
      nestedGroups: nestedGroups.length > 0 ? nestedGroups.map(group => group.id) : undefined,
      project: project_state.project.project_id
    }

    // call onGroupUpdate for updated group
    onGroupCreateBack(createdGroup);
  }

  const handleCreateGroupDataFront = () => {
    // section for frontend update
    // frontend에 데이터를 등록 할 때 backend에서 받아온 id를 사용하여 등록
    // 현재 추가된 하부 그룹들을 추가
    const addedGroup = nestedGroups.map(nestedGroup => nestedGroup.id);
    // addedGroup에 의해 nest 관계가 삭제된 그룹들을 찾아 그들이 보유한 nestedGroups 에서 해당 항목 삭제 처리하고 nestedDeleteObjects로 저장
    const nestDeletedObjects = everyDataGroup
      .filter(group => group.nestedGroups && group.nestedGroups.some(id => addedGroup.includes(id as number))) //선택 그룹의 nestedGroups에 기록된 그룹 데이터 목록을 가져옴
      .map(group => { // 모든 항목중에서 검사해서 해당하는 Group을 찾아서 반환
        const updatedNestedGroups = group.nestedGroups!.filter(id => !addedGroup.includes(id as number)); // 이 안에는 addedGroup에 없는 것만 남게 됨
        
        if(updatedNestedGroups.length === 0) {
          return { ...group, nestedGroups: undefined, showNested:undefined }; // nestedGroups가 빈 배열이면 undefined로 업데이트 후 반환
        } else {
          return { ...group, nestedGroups: updatedNestedGroups }; // nestedGroups가 빈 배열이 아니면 업데이트 후 반환
        }
      });

    // addedGroup을 이용하여 addedObjects를 생성하고 각 항목에 대해 onGroupCreateFront를 호출 - 하부 항목을 추가하는 경우에 적용
    const addedObjects = addedGroup.map(added => {
      return {
        ...everyDataGroup.find(group => group.id === added),
        nestedInGroup: onCreatedGroupID, //백엔드에서 요청해서 받아오기
        treeLevel: 1
      }
    })

    // call onGroupCreateFront for each addedGroup
    addedObjects.forEach(addedObject => {
      onGroupCreateFront(addedObject as ICustomDataGroup);
    })

    // call onGroupCreateFront for nestDeletedObject
    nestDeletedObjects.forEach(nestDeletedObject => {
      if(nestDeletedObject) onGroupCreateFront(nestDeletedObject as ICustomDataGroup); // 링크 정보는 나중에 select 된 항목이 업데이트 되며 같이 처리
    })

    // call onGroupCreateFront for createdGroup
    const createdGroup = {
      id: onCreatedGroupID, // 받아온 자동 생성값 사용
      content: newGroupContent,
      showNested: true,
      nestedGroups: nestedGroups.length > 0 ? nestedGroups.map(group => group.id) : undefined,
      project: project_state.project.project_id
    }
    onGroupCreateFront(createdGroup as ICustomDataGroup);

    // close the modal
    handleInputGroup();
  }

  const callNextID = async (): Promise<void> => {
    try {
      // 서버로 데이터를 전송
      const res = await DashboardGanttGroupModel.requestGroupNextID();
      
      if (res.statusCode !== 200) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: res.message || '데이터 조회 중 오류가 발생했습니다.',
        });
        return;
      }
      const lastIndex = res.data?.next_id;
      setNextGroupIndex(lastIndex as number);

    } catch (error) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버와의 통신에 실패했습니다.",
        });
        //console.error('Error posting group data:', error);
    }
  }

  useEffect(() => {
    setNewTargetGroup({ id: '', content: '' });
    setNewGroupContent('');
    setNestedGroups([]);
    
    // callNextID(); // 다음 그룹 ID를 가져옴 from server - 이제 자동 생성값 사용함

  }, [inputGroupModalState])

  useEffect(() => {
    // 여기서 프론트엔드 그룹추가 처리를 진행
    if(onCreatedGroupID) {
      handleCreateGroupDataFront();
    }
  }, [onCreatedGroupID])


  return (
    <Modal isOpen={inputGroupModalState} size="lg">
      <Modal.Head>간트 그룹 추가</Modal.Head>
      <Modal.Body>
        <div className="flex flex-col items-center gap-4 mb-10">
          {/* 그룹 이름 */}
          <div className="flex flex-wrap items-center w-full gap-1">
            <div className="flex items-center flex-1 w-full md:w-1/3">
              <label htmlFor="existlabel" className="whitespace-pre">
                {'그룹 이름 입력'}
              </label>
            </div>
            <div className="flex items-center flex-1 w-full md:w-1/3">
              <Input
                id="identifier"
                name="identifier"
                value={newGroupContent}
                onChange={handleGroupContentChange}
              />
            </div>
          </div>
        </div>
        
        <div className='flex space-x-4'>
          {/* 리스트 출력 내용 */}
          <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
            <h1>하부 그룹 목록</h1>
            <div>
              {nestedGroups.map(nestedGroup => (
                <div key={nestedGroup.id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-200">
                  <div>
                    <span className="font-semibold">{nestedGroup.content}</span>
                  </div>
                    <Button onClick={() => handleDeleteGroup(nestedGroup.id)}>
                      삭제
                    </Button>
                </div>
              ))} 
            </div>
          </div>
          {/* 리스트 추가 내용 */}
          <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
            <div>
              <Input.Select
                name="addGroup"
                value={newTargetGroup.id.toString()}
                onChange={handleSelectChange}
                >
                <Input.Option value="">선택</Input.Option>
                {/* 프로젝트->그룹목록으로 필터링해서 보여주던지 백에서 걸러와야 함 */}
                {everyDataGroup // 그룹은 다른 그룹의 하부 항목을 가져오는 동작이 허용 됨
                  .filter(column => // 현재 선택한 그룹 본인은 제외
                    !nestedGroups.find(group => group.id === column.id) // 이미 추가된 그룹은 제외
                    && !(column.nestedGroups && column.nestedGroups.length > 0) // 다른 그룹을 추가한 그룹도 제외 (상부 그룹은 하부 그룹으로 추가 불가)
                  )
                  .map(column => (
                    //console.log('nestTargetGroup', nestTargetGroup),
                  <Input.Option key={column.id} value={column.id.toString()}>
                    {column.content as string}
                  </Input.Option>
                ))}
              </Input.Select>
            </div>
            <div>
              {/* 이 부분에 선택한 값 출력 */}
              {newTargetGroup.id && (
                <p>선택된 그룹 id : {newTargetGroup.id as string}</p>
              )}
              {newTargetGroup.content && (
                <p>선택된 그룹 내용 : {newTargetGroup.content as string}</p>
              )}
            </div>
            <div>
              <Button className="w-full" onClick={handleAddGroup}>
                하부 그룹 추가
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateGroupDataBack}>
          생성
        </Button>
        <Button variant="primary" onClick={handleInputGroup}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InputGroupModal

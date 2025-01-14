import { useEffect, useState } from 'react'
import sweetAlert2 from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import { ICustomDataGroup } from '../DashboardDevelopmentTimeline'


interface IProps {
	editGroupModalState: boolean,
	handleEditGroup: () => void,
  selectedDataGroup: ICustomDataGroup,
  everyDataGroup: ICustomDataGroup[],
  onGroupUpdateFront: (updatedGroup:ICustomDataGroup) => void,
  onGroupUpdateBack: (updatedGroup:ICustomDataGroup) => void
  onGroupDeleteFront: (deletedGroup:ICustomDataGroup) => void,
  onGroupDeleteBack: (deletedGroup:ICustomDataGroup) => void
}

interface NestedData {
  id: number;
  content: string;
}

const EditGroupModal = ({ editGroupModalState, handleEditGroup, selectedDataGroup, everyDataGroup, onGroupUpdateFront, onGroupUpdateBack, onGroupDeleteFront, onGroupDeleteBack}: IProps) => {
  // Group 연계 관련 정보
  const [newTargetGroup, setNewTargetGroup] = useState({ id: '', content: '' }); //리스트에서 선택된 nest 예비 그룹 정보
  const [nestedGroups, setNestedGroups] = useState<NestedData[]>([]); //새로 구성된 하부 그룹 정보
  const [newGroupContent, setNewGroupContent] = useState(''); //수정할 항목 - 이름
  // Group 수정 Meta 정보
  const [isChanged, setIsChanged] = useState(false); //데이터 변경 여부 확인용 - 안되어있으면 저장 스킵함

  const handleGroupContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupContent(e.target.value);
    setIsChanged(true);
  };

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
      setIsChanged(true);
    }
  };

  const handleDeleteGroup = (id: number) => {
    setNestedGroups(prevGroups => prevGroups.filter(group => group.id !== id));
    setIsChanged(true);
  };

  const handleUpdateGroupData = async () => {
    if (!isChanged) {
      // 변경된 내용이 없으면 저장하지 않음
      return;
    }

    // 그룹의 원본 정보에서 현재 편집중인 그룹을 찾아서 relatedGroup 으로 저장
    const relatedGroup = everyDataGroup.find(group => group.id === selectedDataGroup.id);
    // relatedGroup 의 정보를 기준으로 하여 보유한 nestedGroups 내부에서 삭제된 그룹을 찾아서 deletedGroup 으로 저장
    const deletedGroup = relatedGroup?.nestedGroups?.filter(targetGroup => !nestedGroups.find(group => group.id === targetGroup)); //기존 그룹에서 찾는것과 일치하지 않는 것이 삭제된 것으로 간주
    // relatedGroup 의 정보를 기준으로 하여 보유한 nestedGroups 내부에서 추가된 그룹을 찾아서 addedGroup 으로 저장
    const addedGroup = nestedGroups
                      .filter(nestedGroup => !relatedGroup?.nestedGroups?.includes(nestedGroup.id)) //새 그룹에서 찾는 것과 일치하지 않는 것이 추가된 것으로 간주 
                      .map(nestedGroup => nestedGroup.id) //(id만 추출) [1, 2, 3] or undefined
    // relatedGroup에 의해 nest 관계가 삭제된 그룹들을 찾아서 그들이 보유한 nestedGroups 에서 해당 항목 삭제 처리하고 nestedDeletedObjects로 저장
    const nestDeletedObjects = everyDataGroup
      .filter(group => group.nestedGroups && group.nestedGroups.some(id => addedGroup.includes(id as number))) //선택 그룹의 nestedGroups에 기록된 그룹 데이터 목록을 가져옴
      .map(group => { //모든 항목중에서 검사해서 해당하는 Group을 찾아서 반환
        const updatedNestedGroups = group.nestedGroups!.filter(id => !addedGroup.includes(id as number)); //이 안에는 addedGroup에 없는 것만 남게 됨

        if (updatedNestedGroups.length === 0) {
          return { ...group, nestedGroups: undefined, showNested: undefined }; //nestedGroups가 빈 배열이면 undefined로 업데이트 후 반환
        } else {
          return { ...group, nestedGroups: updatedNestedGroups }; //nestedGroups가 빈 배열이 아니면 업데이트 후 반환
        }
      });

    // deletedGroup을 이용하여 deletedObjects를 생성하고 각 그룹에 대해 onGroupUpdateFront 호출  - 하부 항목을 잃어버린 경우에 적용
    const deletedObjects = deletedGroup?.map(deleted => {
      const targetData =
      {
        ...everyDataGroup.find(group => group.id === deleted),
        visible: true, // reset to default
        nestedGroups: undefined, // reset to default
        nestedInGroup: undefined, // reset to default
        treeLevel: undefined // reset to default
      }
      return targetData;
    });
    // call onGroupUpdate for each deleted group
    deletedObjects?.forEach(deletedObject => {
      onGroupUpdateFront(deletedObject as ICustomDataGroup);
    });
    
    // addedGroup을 이용하여 addedObjects를 생성하고 각 addedObject에 대해 onGroupUpdate 호출 - 하부 항목을 추가하는 경우에 적용
    const addedObjects = addedGroup.map(added => {
      return {
        ...everyDataGroup.find(group => group.id === added),
        nestedGroups: undefined, // reset to default
        nestedInGroup: selectedDataGroup.id as number, // nestedInGroup을 현재 선택한 그룹으로 설정
        treeLevel: 1, // reset to default
      }
    });
    // call onGroupUpdate for each added group
    addedObjects.forEach(addedObject => {
      onGroupUpdateFront(addedObject as ICustomDataGroup); 
    });
    

    // call onGroupUpdate for nestDeletedObjects
    nestDeletedObjects.forEach(nestDeletedObject => { // nestDeletedObject에 대해 각각 onGroupUpdate 호출
      if(nestDeletedObject) {
        onGroupUpdateFront(nestDeletedObject as ICustomDataGroup); // 링크 정보는 나중에 select 된 항목이 업데이트 되며 같이 처리
      }
    });

    // 현재 선택하여 편집중인 그룹의 정보를 updatedObjects로 정리하고 onGroupUpdate 호출
    const updatedObjects = {
      ...selectedDataGroup,
      content: newGroupContent,
      showNested: nestedGroups.length > 0 ? selectedDataGroup.showNested : true,  // 기존 유지 or 길이 0 되면 펼치기
      nestedGroups: nestedGroups.length > 0 ? nestedGroups.map(group => group.id) : undefined
    };

    // 백엔드 데이터 갱신 + 프론트엔드 데이터 갱신
    onGroupUpdateBack(updatedObjects as ICustomDataGroup);

    // Close the modal
    handleEditGroup();
  };

  const handleDeleteGroupData = () => {
    // 삭제 확인 팝업 띄우기
    sweetAlert2.fire({
      title: '삭제 확인',
      text: '정말로 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 처리 시작
        const relatedGroup = everyDataGroup.find(group => group.id === selectedDataGroup.id); // [1, 2, 3] or undefined

        // 삭제 대상의 nestedGroups 정보를 가져와서 프론트엔드에서 관계 삭제
        const updatedNestedGroupsObjects = everyDataGroup
          .filter(group => relatedGroup?.nestedGroups?.includes(group.id)) // 선택 그룹의 nestedGroups에 기록된 그룹 데이터 목록을 가져옴
          .map(nestedGroup => ({
            ...nestedGroup,
            visible: true, // reset to default
            nestedInGroup: undefined, // reset to default
            treeLevel: undefined, // reset to default
          }));
        // call onGroupUpdateFront for each nestedGroups
        updatedNestedGroupsObjects.forEach(updatedObject => {
          onGroupUpdateFront(updatedObject as ICustomDataGroup); // todo 백엔드 연결 후 갱신 필요
        });

        // 삭제 대상의 nestedInGroup 정보를 가져와서 프론트엔드에서 관계 삭제
        const updatedNestedInGroup = everyDataGroup.find(group => group.id === relatedGroup?.nestedInGroup) // 선택 그룹의 nestedInGroup에 기록된 그룹 데이터를 가져옴
        if (updatedNestedInGroup) {
          const deletedNestedGroups = updatedNestedInGroup.nestedGroups?.filter(id => id !== relatedGroup?.id);
          const updatedNestedInGroupObject = {
            ...updatedNestedInGroup,
            nestedGroups: deletedNestedGroups?.length === 0? undefined : deletedNestedGroups, // nestedGroups가 빈 배열이면 undefined로 업데이트
          };
          onGroupUpdateFront(updatedNestedInGroupObject as ICustomDataGroup); // todo 백엔드 연결 후 갱신 필요
        }

        // 백엔드 데이터 갱신 + 프론트엔드 데이터 갱신
        onGroupDeleteBack(relatedGroup as ICustomDataGroup);
        
        // Close the modal
        handleEditGroup();
      }
    });
  }

  useEffect(() => {
    setNewTargetGroup({ id: '', content: '' });
    setNewGroupContent(selectedDataGroup.content as string)

    if (selectedDataGroup.nestedGroups?.length) {
      // Map nestedGroups IDs to corresponding data
      const updatedNestedData:NestedData[] = selectedDataGroup.nestedGroups.map(nestedGroupId => {
        // Find the group with the corresponding ID
        const group = everyDataGroup.find(group => group.id === nestedGroupId);
        return group  // matching format to nestedGroups
          ? { id: group.id as number, content: group.content as string} // If the group exists, return the group
          : { id: nestedGroupId as number, content: 'Unknown' as string }; // Default value if not found
      });
      setNestedGroups(updatedNestedData); // 상태 업데이트
    }
  }, [editGroupModalState]);


  return (
    <Modal isOpen={editGroupModalState} size="lg">
      <Modal.Head>간트 그룹 편집</Modal.Head>
      <Modal.Body>
        <div className="flex flex-col items-center gap-4 mb-10">
          {/* 그룹 이름 */}
          <div className="flex flex-wrap items-center w-full gap-1">
            <div className="flex items-center flex-1 w-full md:w-1/3">
              <label htmlFor="existlabel" className="whitespace-pre">
                {'기존 그룹 이름 : '}
              </label>
                <div className="flex-1">
                  <label htmlFor="category" className="whitespace-pre">
                    {selectedDataGroup.content as string}
                  </label>
                </div>
            </div>
            <div className="flex items-center flex-1 w-full md:w-1/3">
              <label htmlFor="identifier" className="whitespace-nowrap">
                {'변경 명칭'}
              </label>
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
                {everyDataGroup
                  .filter(column => column.id !== selectedDataGroup.id // 현재 선택한 그룹 본인은 제외
                    && ((column.nestedInGroup === undefined) || (column.nestedInGroup === null) || (column.nestedInGroup !== selectedDataGroup.id )) // 현재 선택한 그룹이 하부 그룹이면 본인은 제외 (하부 그룹은 하부 그룹을 추가 불가)
                    && !(selectedDataGroup.nestedInGroup) // 현재 선택한 그룹이 하부 그룹이면 본인은 제외 (하부 그룹은 하부 그룹을 추가 불가)
                    && !nestedGroups.find(group => group.id === column.id) // 이미 추가된 그룹은 제외
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
        <Button variant="danger" onClick={handleDeleteGroupData}>
          삭제
        </Button>
        <Button onClick={handleUpdateGroupData}>
          저장
        </Button>
        <Button variant="primary" onClick={handleEditGroup}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditGroupModal

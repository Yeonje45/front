import React, {useEffect, useRef, useState} from "react";
import sweetAlert2 from 'sweetalert2'

import moment from "moment";
import 'moment/locale/ko'; // 한국어 로케일 불러오기

import { DataSet, DataItem, Timeline, TimelineOptions, DataGroup, IdType  } from 'vis-timeline/standalone';
import '../panels/gantt/DashBoardGanttStyle.scss';

import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import Arrow, { ArrowSpec } from "timeline-arrows";

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'

import { useSelector } from "react-redux";
import { RootState } from "app/store";

import EditGroupModal from "./gantt/EditGroupModal"
import InputGroupModal from "./gantt/InputGroupModal"
import EditItemModal from "./gantt/EditItemModal"
import InputItemModal from "./gantt/InputItemModal"
import { DashboardGanttItemModel, DashboardGanttGroupModel, DashboardGanttAssigneeModel} from "models/DashboardModel";
import { useNavigate } from "react-router-dom";


export interface ICustomDataGroup extends DataGroup {
  // 기본 그룹
  // className?: string;  //그룹에 지정 가능한 클래스 스타일 이름 - 사용 X
  // content: string | HTMLElement; // 그룹의 내용(외부에 보이는 텍스트)
  // id: IdType;  //그룹의 고유 식별자
  // style?: string;  //그룹의 스타일 - 사용 X
  // order?: number;  //그룹의 정렬 순서 - 사용 X
  // subgroupOrder?: TimelineOptionsGroupOrderType; // 하위 그룹의 정렬 순서
  // title?: string;  // 그룹의 제목 - 사용 X
  // visible?: boolean; // 그룹의 가시성 - 저장 X
  // nestedGroups?: IdType[]; // 하위 그룹 정보 목록 (ID)
  // showNested?: boolean;  // 하위 그룹 표시 여부 - 저장 X
  // subgroupVisibility?: SubGroupVisibilityOptions;  // 하위 그룹 가시성 설정 - 저장 X
  treeLevel?: number; // Custom property - 트리 레벨  // 1: 상위 그룹, 2: 하위 그룹, undefined: 관계 없음
  nestedInGroup?: number; // Custom property - 소속된 상부 그룹 - ID
  project?: string; // Custom property - 프로젝트 ID
}

//timeline item interface과 그대로 호환이 되지 않으므로 별도의 배열 데이터로 관리? TODO
export interface ICustomDataItem extends DataItem {
  // 기본 항목
  // className?: string;  //항목에 지정 가능한 클래스 스타일 이름
  // content: string; // 항목의 내용(외부에 보이는 텍스트)
  // end?: DateType;  // 항목의 종료 시간
  // group?: any; // 항목이 속한 그룹
  // id?: IdType; // 항목의 고유 식별자
  // start: DateType; // 항목의 시작 시간
  // style?: string; // 항목의 스타일(range or point)
  // subgroup?: SubgroupType; // 하위 그룹 정보 - 사용 X
  // title?: string;  // 항목의 제목 - 사용 X
  // type?: string; // 항목의 타입 (point or range)
  // editable?: TimelineItemEditableType; // 항목의 편집 가능 여부 - 사용 X
  // selectable?: boolean;  // 항목의 선택 가능 여부 - 사용 X
  // limitSize?: boolean; // 항목의 크기 제한 여부 - 사용 X
  nextedItems?: IdType[]; // Custom property - 하부 항목
  nextedInItem?: number; // Custom property - 소속된 상부 항목 - 저장 X
  id: IdType;
  assignee?: string; // Custom property - 특정 사용자 할당 (ID)
  progress?: number; // Custom property - 진행률
  project?: string; // Custom property - 프로젝트 ID
}

export interface ICustomDataAssignee{
  id: string;   //DB상의 ID
  name: string; //사용자 이름
}

export interface ICustomDataArrow extends ArrowSpec {
  id: number;
  id_item_1: number;
  id_item_2: number;
  title?: string;
} // item의 링크 정보에만 사용 - group은 배열로 내부에 포함하면 알아서 만들어져서 필요 X


const TimelineComponent:React.FC = () => {
  // 프로젝트 상태 정보의 존재를 확인하고 존재하면 가져오고 아니면 화면을 useNavigate로 이동
	const project_state = useSelector((state: RootState) => state.project || {});
  const navigate = useNavigate();

  // 타임라인 컴포넌트에서 사용할 상태 - useRef로 참조할 수 있도록 설정
  const timelineRef = useRef<Timeline|null>(null);  // Timeline 참조 - 타임라인 컴포넌트의 인스턴스
  const arrowRef = useRef<Arrow|null>(null);        // Arrow 참조 - 화살표 컴포넌트의 인스턴스
  // 타임라인 컴포넌트에서 사용할 데이터 상태 - core data
  const [groups, setGroups] = useState<DataSet<ICustomDataGroup>>(new DataSet<ICustomDataGroup>()); // group 정보 - from gantt_group
  const [items, setItems] = useState<DataSet<ICustomDataItem>>(new DataSet<ICustomDataItem>()); // item 정보 - from gantt_item
  const [arrows, setArrows] = useState<ICustomDataArrow[]>([]); // item 간의 연결 정보 - from gantt_item_link
  const [assignees, setAssignees] = useState<ICustomDataAssignee[]>([]); // 사용자 정보 (id, name) - from user_info
  // 타임라인 컴포넌트에서 항목 혹은 그룹을 선택했을 때 변경되는 상태
  const [selectedGroup, setSelectedGroup] = useState<ICustomDataGroup | null>(null);
  const [selectedItem, setSelectedItem] = useState<ICustomDataItem | null>(null);
  // 타임라인 컴포넌트에서 사용하는 제어용 상태
  const [loading, setLoading] = useState(true); // todo - 데이터 로딩 상태
  // 타임라인 컴포넌트에서 사용하는 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [searchResults, setSearchResults] = useState<ICustomDataItem[]>([]);  // 검색 결과
  const [searchCurrentIndex, setSearchCurrentIndex] = useState<number | null>(null);  // 검색 결과 중 현재 선택된 인덱스
  const [newAddedItem, setNewAddedItem] = useState<ICustomDataItem | null>(null); // 새로 추가된 항목 - 화면 이동용
	// 타임라인에서 실행되는 모달 출력 제어용 상태
	const [editGroupModalState, setEditGroupModalState] = useState<boolean>(false)    // 그룹 수정 모달
	const [inputGroupModalState, setInputGroupModalState] = useState<boolean>(false)  // 그룹 추가 모달
	const [editItemModalState, setEditItemModalState] = useState<boolean>(false)      // 항목 수정 모달
	const [inputItemModalState, setInputItemModalState] = useState<boolean>(false)    // 항목 추가 모달
  const [onCreatedGroupID, setOnCreatedGroupID] = useState<number | null>(null); // 새로 생성된 그룹 ID
  const [onCreatedItemID, setOnCreatedItemID] = useState<number | null>(null); // 새로 생성된 항목 ID
  // 모달 출력 제어용 상태를 실행 합니다
  const handleEditGroupModalState = () => 
    {setEditGroupModalState(!editGroupModalState)}
  const handleInputGroupModalState = () => 
    {setInputGroupModalState(!inputGroupModalState)}
  const handleEditItemModalState = () => 
    {setEditItemModalState(!editItemModalState)}
  const handleInputItemModalState = () => 
    {setInputItemModalState(!inputItemModalState)}

  // section for group
  const handleGroupUpdate = (updatedGroup: ICustomDataGroup) => { // 백엔드에서 처리할 때 사용
    // Update the DataSet with the new group data
    setGroups(prevGroups => {
      // Find and update the existing group
      const updatedGroups = new DataSet<ICustomDataGroup>(prevGroups.get()); // Create a new DataSet with current data
      updatedGroups.update(updatedGroup); // Update the group data

      return updatedGroups; // Return the updated DataSet
    });
  };

  const handleGroupUpdateBack = async (updatedGroup: ICustomDataGroup): Promise<void> => {
    try {
        // 서버로 데이터를 전송
        const res = await DashboardGanttGroupModel.requestPatchGroup(updatedGroup);

        if (res.statusCode !== 200 || !res.data) {
            sweetAlert2.fire({
                icon: "error",
                title: "수정 실패",
                text: res.message || '데이터 저장 중 오류가 발생했습니다.',
            });
            return;
        }

        // 상태 업데이트: 기존 그룹 목록에서 수정된 그룹 데이터를 업데이트
        handleGroupUpdate(updatedGroup);
        
        sweetAlert2.fire({
            icon: "success",
            title: "수정 성공",
            text: "Gantt 그룹이 성공적으로 저장되었습니다.",
        });
    } catch (error) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버와의 통신에 실패했습니다.",
        });
        //console.error('Error updating group data:', error);
    }
  };

  const handleGroupCreate = (createdGroup: ICustomDataGroup) => {
    // Update the DataSet with the new group data
    setGroups(prevGroups => {
      const updatedGroups = new DataSet(prevGroups.get()); // Create a new DataSet with current data
      updatedGroups.update(createdGroup); // Add the new group
      return updatedGroups; // Return the updated DataSet
    });
  }

  const handleGroupCreateBack = async (createdGroup: Omit<ICustomDataGroup, 'id'>): Promise<void> => {

    // 1. 즉각적으로 UI 업데이트 (프론트엔드에 먼저 추가)
    // const tempId = `temp-${Date.now()}`; // 임시 ID 생성
    // const tempGroup = { ...createdGroup, id: tempId };

    // setGroups(prevGroups => {
    //     const updatedGroups = new DataSet(prevGroups.get());
    //     updatedGroups.add(tempGroup); // 프론트엔드에 임시 데이터 추가
    //     return updatedGroups;
    // });

    try {
        // 2. 서버로 데이터를 전송
        const res = await DashboardGanttGroupModel.requestPostGroup(createdGroup);

        if (res.statusCode !== 201 || !res.data) {
            sweetAlert2.fire({
                icon: "error",
                title: "추가 실패",
                text: res.message || '데이터 저장 중 오류가 발생했습니다.',
            });
            return;
        }

        // 3. 서버 응답 데이터를 UI에 반영 - 그룹은 하부 그룹과의 등록 순서 때문에 하->상으로 등록해야 제대로 출력 되어 여기서 UI 업데이트는 사용하지 않음
        const newGroup = res.data.group; // 새로 생성된 그룹 데이터
        // setGroups(prevGroups => {
        //   const updatedGroups = new DataSet(prevGroups.get());
        //   // updatedGroups.remove(tempId); // 임시 데이터 제거
        //   if (newGroup) {
        //     updatedGroups.add(newGroup); // 서버 응답 데이터를 추가
        //   }
        //   return updatedGroups;
        // });
        
        // 4. 서버에 데이터가 성공적으로 저장되었을 경우 해당 id의 값을 반환
        if (newGroup) {
          setOnCreatedGroupID(newGroup.id as number); // 새로 생성된 그룹 ID 저장
        }

        sweetAlert2.fire({
            icon: "success",
            title: "추가 성공",
            text: "Gantt 그룹이 성공적으로 저장되었습니다.",
        });
    } catch (error) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버와의 통신에 실패했습니다.",
        });
        //console.error('Error posting group data:', error);
    }
  };

  const handleGroupDelete = (deletedGroup: ICustomDataGroup) => { // 백엔드에서 처리할 때 사용
    // Update the DataSet with the new group data
    setGroups(prevGroups => {
      // Find and update the existing group
      const updatedGroups = new DataSet(prevGroups.get()); // Create a new DataSet with current data
      updatedGroups.remove(deletedGroup.id); // Remove the group
      return updatedGroups;
    });
  }

  const handleGroupDeleteBack = async (deletedGroup: ICustomDataGroup): Promise<void> => {
    try {
        // 서버로 데이터를 전송
        const res = await DashboardGanttGroupModel.requestDeleteGroup(deletedGroup.id as number, deletedGroup.project as string);
        
        if (res.statusCode !== 204) {
          sweetAlert2.fire({
              icon: "error",
              title: "삭제 실패",
              text: res.message || '데이터 삭제 중 오류가 발생했습니다.',
          });
          return;
        }

        // 상태 업데이트: 기존 그룹 목록에서 삭제된 그룹 데이터를 제거
        handleGroupDelete(deletedGroup);

        sweetAlert2.fire({
          icon: "success",
          title: "삭제 성공",
          text: "Gantt 그룹이 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버와의 통신에 실패했습니다.",
        });
        //console.error('Error posting group data:', error);
    }
  }

  //section for item
  const handleItemUpdate = (updatedItem: ICustomDataItem) => {
    // Update the DataSet with the new item data
    setItems(prevItems => {
      // Find and update the existing item
      const updatedItems = new DataSet(prevItems.get()); // Create a new DataSet with current data
      updatedItems.update(updatedItem);

      return updatedItems;
    });
  }
  
  const handleItemUpdateBack = async (updatedItem: ICustomDataItem): Promise<void> => {
    
    // 1. 즉각 프론트엔드 UI를 업데이트 - 처리 안함
    // setItems(prevItems => {
    //   const updatedItems = new DataSet(prevItems.get());
    //   updatedItems.update(updatedItem); // 사용자 입력 기반 업데이트
    //   return updatedItems;
    // });

    // 2. 서버와 통신하여 동기화
    try {
        // 서버로 데이터를 전송
        const res = await DashboardGanttItemModel.requestPatchItem(updatedItem);

        if (res.statusCode !== 200 || !res.data) {
            sweetAlert2.fire({
                icon: "error",
                title: "수정 실패",
                text: res.message || '데이터 저장 중 오류가 발생했습니다.',
            });
            return;
        }

        // 3. 서버 응답에 따라 상태를 최종 동기화
        const newItem = res.data.item;
        if (newItem) {
            setItems(prevItems => {
                const updatedItems = new DataSet(prevItems.get());
                updatedItems.update(newItem); // 서버 응답 데이터로 업데이트
                return updatedItems;
            });
        }

        sweetAlert2.fire({
            icon: "success",
            title: "수정 성공",
            text: "Gantt 항목이 성공적으로 저장되었습니다.",
        });
    } catch (error) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버와의 통신에 실패했습니다.",
        });
        //console.error('Error updating item data:', error);
    }
  }

  const handleArrowUpdate = (updatedArrows: ICustomDataArrow[]) => {
    // Update the DataSet with the new arrow data
    setArrows(updatedArrows);
  }

  const handleItemDelete = (deletedItem: ICustomDataItem) => { // 백엔드에서 처리할 때 사용
    // Update the DataSet with the new item data
    setItems(prevItems => {
      // Find and update the existing item
      const updatedItems = new DataSet(prevItems.get()); // Create a new DataSet with current data
      updatedItems.remove(deletedItem.id); // Remove the group
      return updatedItems;
    });
  }

  const handleItemDeleteBack = async (deletedItem: ICustomDataItem): Promise<void> => {
    try {
        // 서버로 데이터를 전송
        const res = await DashboardGanttItemModel.requestDeleteItem(deletedItem.id as number, deletedItem.project as string);
        
        if (res.statusCode !== 204) {
          sweetAlert2.fire({
              icon: "error",
              title: "삭제 실패",
              text: res.message || '데이터 삭제 중 오류가 발생했습니다.',
          });
          return;
        }

        // 상태 업데이트: 기존 항목 목록에서 삭제된 항목 데이터를 제거
        handleItemDelete(deletedItem);

        sweetAlert2.fire({
          icon: "success",
          title: "삭제 성공",
          text: "Gantt 항목이 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: "서버와의 통신에 실패했습니다.",
        });
        //console.error('Error posting group data:', error);
    }
  }

  const handleItemCreate = (createdItem: ICustomDataItem) => {
    // Update the DataSet with the new item data
    setItems(prevItems => {
      // Find and update the existing item
      const updatedItems = new DataSet(prevItems.get()); // Create a new DataSet with current data
      updatedItems.update(createdItem); // Add the new item
      //updatedItems.add(createdItem); // 여기서는 add만 쓰려고 했으나 nest 관계 데이터를 추가하려면 update를 써야함
      return updatedItems;
    });
  }

  const handleItemCreateBack = async (createdItem: Omit<ICustomDataItem, 'id'>): Promise<void> => {

    // 1. 즉각적으로 UI 업데이트 (프론트엔드에 먼저 추가)
    // const tempId = `temp-${Date.now()}`; // 임시 ID 생성
    // const tempItem = { ...createdItem, id: tempId };

    // setItems(prevItems => {
    //     const updatedItems = new DataSet(prevItems.get());
    //     updatedItems.add(tempItem); // 프론트엔드에 임시 데이터 추가
    //     return updatedItems;
    // });

    try {
      // 2. 서버로 데이터 전송
      const res = await DashboardGanttItemModel.requestPostItem(createdItem);

      if(res.statusCode !== 201 || !res.data) {
        sweetAlert2.fire({
          icon: "error",
          title: "추가 실패",
          text: res.message,
        });
        return;
      }

      // 3. 서버 응답 데이터를 UI에 반영
      const newItem = res.data.item; // 새로 생성된 항목 데이터
      setItems(prevItems => {
        const updatedItems = new DataSet(prevItems.get());
        // updatedItems.remove(tempId); // 임시 데이터 제거
        if (newItem) {
          updatedItems.add(newItem); // 서버 응답 데이터를 추가
        }
        return updatedItems;
      });

      // 4. 서버에 데이터가 성공적으로 저장되었을 경우 해당 id의 값을 반환
      if (newItem) {      
        setOnCreatedItemID(newItem.id as number); // 새로 생성된 항목 ID 저장
      }

      sweetAlert2.fire({
        icon: "success",
        title: "추가 성공",
        text: "Gantt 항목이 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: "서버와의 통신에 실패했습니다.",
      });
      //console.error('Error posting item data:', error);
    }
  }

  // section for arrow
  const handleArrowCreate = (createdArrows: ICustomDataArrow[]) => {
    // Update the DataSet with the new arrow data
    setArrows(createdArrows);
  }

  const arrowOption = {
    followRelationships: false, //arrow enable backward pointing default false
    strokeWidth: 2, //arrow width default 3
    color: "#04a3c7", //arrow color
    hideWhenItemsNotVisible: true, //hide arrow when items not visible default true
    //tooltip is auto by default - use value from title in ArrowSpec
  }

	// section for fetching data from server
  // 서버로부터 그룹 정보를 가져오는 함수입니다.
  const getGroupData = async (): Promise<void> => {
    const res = await DashboardGanttGroupModel.requestGetGroups(project_state.project.project_id)
    if (res.statusCode !== 200) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message,
      })
      return
    }
    setGroups(new DataSet<ICustomDataGroup>(res.data?.groups || [])); // 비어있는 데이터를 받아올 수 있습니다.
  }

  // 서버로부터 항목 정보를 가져오는 함수입니다.
	const getItemData = async (): Promise<void> => {
		const res = await DashboardGanttItemModel.requestGetItems(project_state.project.project_id)
		if (res.statusCode !== 200) {
			sweetAlert2.fire({
				icon: "error",
				title: "서버 오류",
				text: res.message,
			})
			return
		}
		setItems(new DataSet<ICustomDataItem>(res.data?.items || [])); // 비어있는 데이터를 받아올 수 있습니다.
    setArrows(res.data?.item_links || []); // 비어있는 데이터를 받아올 수 있습니다.
    return 
	}

  // 서버로부터 사용자 정보를 가져오는 함수입니다.
  const getAssigneeData = async (): Promise<void> => {
    const res = await DashboardGanttAssigneeModel.requestGetAssignees(project_state.project.project_id)
    if (res.statusCode !== 200) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message,
      })
      return
    }
    setAssignees(res.data?.assignees || []); // 비어있는 데이터를 받아올 수 있습니다.
  }


  useEffect(() => {
    // project_state가 존재하지 않으면 프로젝트 페이지로 이동하고 useEffect 종료
    if (project_state.project.project_id === undefined) {
      sweetAlert2.fire({
        icon: "error",
        title: "프로젝트 정보 없음",
        text: "잘못된 경로의 접속으로 인해 대상 프로젝트 정보가 입력되지 않았습니다.",
      });
      navigate('/project/list');
      return;
    }

    // 타임라인 컴포넌트가 처음 렌더링될 때 실행되는 함수
    const containerBase = document.getElementById('timeline-board');

    getItemData() //fetch item data + arrow data
    getGroupData()  //fetch group data
    getAssigneeData()  //fetch user data

    const handleGroupClick = (props: any) => {
      setSelectedGroup(props.group);
      handleEditGroupModalState();
    };

    const handleItemClick = (props: any) => {
      setSelectedItem(props.item);
      handleEditItemModalState();
    }
            
    // vis-timeline에서 moment 설정을 명시적으로 적용
    //moment.locale('ko'); // 한국어 로케일 적용 - 인데 불러오기로 대체 - 불러오기의 방법 => import 'moment/locale/ko';
    const customMoment = (date: any) => {
      return moment(date).locale('ko');// moment 객체 반환
    };

    const options: TimelineOptions = {
      // 그룹과 항목 옵션값 설정
      moment: customMoment, // 내가 만든 moment 설정을 타임라인에 적용
      showMajorLabels: true, // 일자 구분 주요 레이블 표시
      format: {
        majorLabels: {
          month: 'YYYY년',  // 년도만 표시
          day: 'YYYY년 M월',  // 요일/일/월 순서로 설정
          week: 'YYYY년 M월', // 주 단위도 일로 설정
          weekday: 'YYYY년 M월', // 요일/일/월 순서로 설정
          hour: 'YYYY년 M월 D일 dddd', // 초 단위도 일로 설정
        },
        minorLabels: {
          day: 'D일(dd) ',  // 일/요일 순서로 설정
          week: 'D일(dd) ', // 주 단위도 일로 설정
          weekday:'D일(dd) ', // 요일/일 순서로 설정
        }
      },
      groupOrder: 'id',
      order: customItemOrder,
      stack: false, // 아이템을 스택 방식으로 쌓기 - 항목이 겹칠시 적당하게 조절하는 기능
      orientation: 'both', // top, bottom, both
      selectable: true,
      zoomable: true,
      zoomMin: 1000 * 60 * 60 * 24 * 7, // Minimum zoom level: 1 day * 7 = 1 week
      zoomMax: 1000 * 60 * 60 * 24 * 31 * 12, // Maximum zoom level: 1 year
      start: new Date(project_state.project.project_start_date), // 시작 시간 from project
      end: new Date(project_state.project.project_end_date), // 종료 시간 from project
      min: new Date(project_state.project.project_start_date), // 최소 시간 from project
      max: new Date(project_state.project.project_end_date), // 최대 시간 from project
      verticalScroll:true,
      editable: { //편집 기능 전부 비활성화
        //add: false,
        //updateTime: false,
        //updateGroup: false,
        //remove: false,
      },
      margin: {
        item: 5, // 아이템 사이의 간격을 조정
      },

      onUpdate: (item, callback) => { // 아이템을 더블클릭하여 수정할 때 실행되는 함수
        // 선택한 아이템의 정보를 수정할 수 있는 모달창을 띄우는 함수
        const customItem = item as ICustomDataItem;
        setSelectedItem(customItem);
        handleEditItemModalState();
        callback(item);
      },

      // snap: (date, scale, step) => {
      //   // 가장 가까운 일자 단위로 스냅
      //   return moment(date).startOf('day').toDate();
      // },
      // 그룹 템플릿 설정
      groupTemplate: (group: ICustomDataGroup) => {
        const container = document.createElement('div');
        container.innerHTML = `${group.content}`;
        container.style.cursor = 'pointer';       
        container.addEventListener('dblclick', () => handleGroupClick({ group }));
        return container;
      },
      
      // 항목 템플릿 설정
      template: function (item: ICustomDataItem) {
        const container = document.createElement('div');

        // 컨테이너 스타일 설정
        container.style.cursor = 'pointer';

        const progress = item.progress || 0;
        const title = item.content || '';
        const todate = new Date();  //todo 느릴것같음
        const enddate = new Date(item.end!); // 최대 시간 from project
        // 아이템의 타입과 진행률과 오늘 날자에 따라 다른 스타일 적용
        item.className = (item.type === 'point')? 'point' : // 아이템의 타입에 따라 클래스 이름 설정 - 'point' or 'range' - 
          progress === 100? 'range done' : // 진행률이 100%인 경우 - 'range done' 클래스 적용
            (enddate < todate)? 'range overdue' : 'range' // 진행률이 100%가 아니고 종료일이 오늘보다 이전인 경우 - 'range overdue' 클래스 적용

        let innerHtml = '';
        if (item.type === 'point') {
          innerHtml = `
            <div>
              <div>${title}</div>
            </div>
          `;
        } else {
          innerHtml = `
            <div>
              <div>${title}</div>
              <div>진행률:${progress}%</div>
            </div>
          `;
        }

        container.innerHTML = innerHtml;
        container.addEventListener('dblclick', (event) => {
          event.preventDefault();  // 기본 동작 방지
          event.stopPropagation();  // 이벤트 버블링 방지
          handleItemClick({ item });
        });
        return container;
      },
    };

    // 아이템 정렬 함수
    function customItemOrder(a: ICustomDataItem, b: ICustomDataItem) {
      // type을 기준으로 정렬 (point -> range)
      if (a.type === 'point' && b.type === 'range') return 1;
      else if (a.type === 'range' && b.type === 'point') return -1;
      // type이 같은 경우 id를 기준으로 정렬
      else if (a.type === b.type) return (a.id as number) - (b.id as number);
      else return 0;
    }

    // containerBase가 존재하면 타임라인과 화살표 생성
    if(containerBase)
    {
      timelineRef.current = new Timeline(containerBase, items, groups, options);
      arrowRef.current = new Arrow(timelineRef.current, arrows, arrowOption);
    }
    
  }, []);

  // Handle group updates
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.setGroups(groups);
    }
  }, [groups]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.setItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (timelineRef.current && arrowRef.current) {
      // reset by arrowRef
      const arrowList = arrowRef.current.getIdArrows();
      arrowList.map((arrowId) => {
        arrowRef.current?.removeArrow(arrowId);
      });
      // add by arrowRef
      arrows.map((arrow) => {
        arrowRef.current?.addArrow(arrow);
      });
    }
  }, [arrows]);

  const searchAndMove = (searchTerm: string) => {
    if (timelineRef.current) {
      const allItems = items.get();
      const results = allItems.filter(item =>
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (results.length > 0) {
        setSearchResults(results);
        setSearchCurrentIndex(0);
        timelineRef.current.moveTo(results[0].start, { animation: true });
      } else {
        alert('검색어에 해당하는 항목이 없습니다.');
      }
    }
  };

  // 다음 검색 결과로 이동
  const moveToNext = () => {
    if (timelineRef.current && searchResults.length > 0 && searchCurrentIndex !== null) {
      const nextIndex = (searchCurrentIndex + 1) % searchResults.length;
      setSearchCurrentIndex(nextIndex);
      timelineRef.current.moveTo(searchResults[nextIndex].start, { animation: true });
    }
  };

  // 이전 검색 결과로 이동
  const moveToPrevious = () => {
    if (timelineRef.current && searchResults.length > 0 && searchCurrentIndex !== null) {
      const prevIndex = (searchCurrentIndex - 1 + searchResults.length) % searchResults.length;
      setSearchCurrentIndex(prevIndex);
      timelineRef.current.moveTo(searchResults[prevIndex].start, { animation: true });
    }
  };
  
  // 검색 초기화
  const resetSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchCurrentIndex(null);
    if (timelineRef.current) {
      timelineRef.current.moveTo(new Date(), { animation: true }); // 현재 시점으로 이동
    }
  };

  // 생성된 항목으로 화면 이동
  const moveItem = (item: ICustomDataItem) => {
    if (timelineRef.current) {
      if (item) {
        timelineRef.current.moveTo(item.start, { animation: true });
      }
    }
  };

  // 모달창에 데이터 보내주기 위한 함수
  const groupsArray = groups.get();
  const itemsArray = items.get();
  const arrowsArray = arrows;
  const usersArray = assignees;

  return (
    <div>
      <div>
        <div className="flex flex-wrap justify-between px-3">
          <div className="flex py-2 space-x-2 whitespace-nowrap">
            <Input
              type="text"
              className="flex-grow max-w-[30%]"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={() => searchAndMove(searchTerm)}>검색</Button>
            <Button variant="primary" onClick={moveToPrevious} disabled={searchResults.length === 0 || searchCurrentIndex === null}>이전</Button>
            <Button variant="primary" onClick={moveToNext} disabled={searchResults.length === 0 || searchCurrentIndex === null}>다음</Button>
            <Button variant="secondary" onClick={resetSearch}>검색 초기화</Button>
          </div>
          <div className="flex py-2 space-x-2 whitespace-nowrap">
            <Button variant="primary" onClick={handleInputGroupModalState}>그룹 추가</Button>
            <Button variant="primary" onClick={handleInputItemModalState}>그룹 내 항목 추가</Button>
          </div>
        </div>
        <div id="timeline-board"></div>
      </div>
      <div>
        {/* 모달 렌더링 */}
        {editGroupModalState && selectedGroup && (
          <EditGroupModal
            editGroupModalState={editGroupModalState}
            handleEditGroup={handleEditGroupModalState}
            selectedDataGroup={selectedGroup}
            everyDataGroup={groupsArray}
            onGroupUpdateFront={handleGroupUpdate}
            onGroupUpdateBack={handleGroupUpdateBack}
            onGroupDeleteFront={handleGroupDelete}
            onGroupDeleteBack={handleGroupDeleteBack}
          />
        )}
        <InputGroupModal
          inputGroupModalState={inputGroupModalState}
          handleInputGroup={handleInputGroupModalState} //todo - 값 갱신 함수 or 값 종료 함수
          everyDataGroup={groupsArray}
          onGroupCreateFront={handleGroupCreate}
          onGroupCreateBack={handleGroupCreateBack}
          onCreatedGroupID={onCreatedGroupID}
        />
        {editItemModalState && selectedItem && (
          <EditItemModal
            editItemModalState={editItemModalState}
            handleEditItem={handleEditItemModalState}
            selectedDataItem={selectedItem}
            everyDataItem={itemsArray}
            everyDataGroup={groupsArray}
            everyDataArrow={arrowsArray}
            everyDataUser={usersArray}
            onItemUpdateFront={handleItemUpdate}
            onItemUpdateBack={handleItemUpdateBack}
            onArrowUpdate={handleArrowUpdate}
            onItemDeleteFront={handleItemDelete}
            onItemDeleteBack={handleItemDeleteBack}
          />
        )}
        <InputItemModal
          inputItemModalState={inputItemModalState}
          handleInputItem={handleInputItemModalState}
          everyDataItem={itemsArray}
          everyDataGroup={groupsArray}
          everyDataArrow={arrowsArray}
          everyDataUser={usersArray}
          onItemCreateFront={handleItemCreate}
          onItemCreateBack={handleItemCreateBack}
          onArrowCreateFront={handleArrowCreate}
          onCreatedItemID={onCreatedItemID}
        />
      </div>
    </div>
  );
};

export default TimelineComponent;

import { useEffect, useRef, useState } from 'react'
import sweetAlert2 from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import { CalendarCheck } from 'react-bootstrap-icons'
import { ICustomDataArrow, ICustomDataGroup, ICustomDataItem, ICustomDataAssignee } from '../DashboardDevelopmentTimeline'

import { useSelector } from "react-redux";
import { RootState } from "app/store";
import { DashboardGanttItemModel } from 'models/DashboardModel'

interface IProps {
	inputItemModalState: boolean
	handleInputItem: () => void
  everyDataItem: ICustomDataItem[]
  everyDataGroup: ICustomDataGroup[]
  everyDataArrow: ICustomDataArrow[]
  everyDataUser: ICustomDataAssignee[]
  onItemCreateFront: (createdItem:ICustomDataItem) => void
  onItemCreateBack: (createdItem:ICustomDataItem) => void
  onArrowCreateFront: (createdArrow:ICustomDataArrow[]) => void
  onCreatedItemID: number | null
}

interface NextedData {
  id: number;
  content: string;
}

interface NextedArrow {
  id: number;
  id_item_1: number;
  id_item_2: number;
  title?: string;
}

const InputItemModal = ({ inputItemModalState, handleInputItem, everyDataItem, everyDataGroup, everyDataArrow, everyDataUser, onItemCreateFront, onItemCreateBack, onArrowCreateFront, onCreatedItemID }: IProps) => {
	const project_state = useSelector((state: RootState) => state.project)
  // Item 기본 정보
  const [newItemContent, setNewItemContent] = useState(''); //수정할 항목 - 이름 
  const [newTargetGroup, setNewTargetGroup] = useState({ id: '', content: '' }); //선택된 그룹 관리 정보
  const [newItemType, setNewItemType] = useState({type:''}); //구분 항목 - 타입 // type: point(event) or range(item)
  // Item 날짜 정보
  const [newFullStartDate, setNewFullStartDate] = useState(''); //시작일+시간 선택용 정보 - 백엔드 전송용
  const [newFullEndDate, setNewFullEndDate] = useState(''); //종료일+시간 선택용 정보 - 백엔드 전송용
    // 신규 날짜 입력 필드 제어용
  const [twinTextStartDate, setTwinTextStartDate] = useState(''); //문자 필드용 시작일 - 컴포넌트 표시용
  const [twinTextEndDate, setTwinTextEndDate] = useState(''); //문자 필드용 종료일 - 컴포넌트 표시용
  const [twinCalendarStartDate, setTwinCalendarStartDate] = useState(''); //달력 필드용 시작일 - 컴포넌트 표시용
  const [twinCalendarEndDate, setTwinCalendarEndDate] = useState(''); //달력 필드용 종료일 - 컴포넌트 표시용
  const [isTwinStartComplete, setIsTwinStartComplete] = useState(false); // 시작일 입력 완료 여부
  const [isTwinEndComplete, setIsTwinEndComplete] = useState(false); // 종료일 입력 완료 여부
  const startDateInputRef = useRef<HTMLInputElement | null>(null); // 시작일 입력 필드 참조 - 피커 호출용
  const endDateInputRef = useRef<HTMLInputElement | null>(null); // 종료일 입력 필드 참조 - 피커 호출용
  // Item 상세 정보 (task와 event에 따라 다름)
  const [newItemProgress, setNewItemProgress] = useState(0); //수정할 항목 - 진행률 
  const [newTargetAssignee, setNewTargetAssignee] = useState({ id: '', content: '' }); //선택된 담당자 관리 정보
  // Item 연계 관련 정보
  const [newTargetItem, setNewTargetItem] = useState({ id: '', content: '', group: '' }); //리스트에서 선택된 next 예비 항목 정보
  const [nextedItems, setNextedItems] = useState<NextedData[]>([]); //항목 추가를 수행할시 프론트엔드에 갱신할 항목 정보 묶음 관리
  const [nextedArrows, setNextedArrows] = useState<NextedArrow[]>([]); //항목 추가를 수행할시 프론트엔드에 갱신할 Arrow 정보 묶음 관리
  // Item 생성 Meta 정보
  const [nextItemIndex, setNextItemIndex] = useState(0); //새로 생성할 항목의 ID 값 - 서버에서 가져옴 - 이제 자동 생성값 사용함
  const [isDateError, setIsDateError] = useState(false); // 날짜 오류 발생 여부 - 시작일이 종료일보다 늦은 경우
  const tempKeyID = -12345; // 임시 음수 ID - 연계 관계 설정용도


  const handleItemContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 항목 제목 선택
    setNewItemContent(e.target.value);
  }

  const initTwinStartDate = () => {
    // 날짜까지만 관리하는 newDate로 상태를 업데이트 하고 시간이 포함된 newDateTime을 selectedDataItem.start에 저장
    const newDate = formatDateToYYYYMMDD(new Date()); // Date를 씌워서 들어오기 때문에 날짜값만 추출
    const newDateTime = combineDateAndTime(newDate, '00:00:00'); // 시간값을 00:00:00으로 설정

    // 문자 필드 업데이트
    setTwinTextStartDate(formatOrDefault(newDate.replace(/-/g, ''))); // 문자 필드 업데이트

    // 달력 필드 업데이트
    setTwinCalendarStartDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullStartDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용
  }

  const initTwinEndDate = () => {
    // 날짜까지만 관리하는 newDate로 상태를 업데이트 하고 시간이 포함된 newDateTime을 selectedDataItem.end에 저장
    const newDate = formatDateToYYYYMMDD(new Date()); // Date를 씌워서 들어오기 때문에 날짜값만 추출
    const newDateTime = combineDateAndTime(newDate, '23:45:00'); // 시간값을 23:45:00 설정
    
    // 문자 필드 업데이트
    setTwinTextEndDate(formatOrDefault(newDate.replace(/-/g, ''))); // 문자 필드 업데이트

    // 달력 필드 업데이트
    setTwinCalendarEndDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullEndDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용
  }

  const isValidDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day); // TypeScript의 월은 0부터 시작
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const formatOrDefault = (input: string) => {
    if(input.length<8) return input;

    // 올해 1월 1일을 기본값으로 설정
    const today = new Date();
    const currentYear = today.getFullYear();
    const defaultDate = `${currentYear}0101`; // YYYYMMDD 형식으로 반환 //'19700101';

    const year = parseInt(input.slice(0, 4), 10);
    const month = parseInt(input.slice(4, 6), 10);
    const day = parseInt(input.slice(6, 8), 10);

    if (isValidDate(year, month, day)) {
      return `${String(year)}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    }
    return defaultDate;
  };

  const checkTwinDateError = (dateValue:Date, dateType:string) => {
    const newDate = formatDateToYYYYMMDD(dateValue); // Date를 씌워서 들어오기 때문에 날짜값만 추출

    // dateType이 start인 경우 시작일을, end인 경우 종료일을 비교하여 오류 여부를 상태에 반환
    const [varStartDate, varEndDate] = dateType === 'start' 
      ? [newDate, formatDateToYYYYMMDD(new Date(twinCalendarEndDate.toString()))] 
      : [formatDateToYYYYMMDD(new Date(twinCalendarStartDate.toString())), newDate];

    // 오류 여부 판단
    setIsDateError(varStartDate > varEndDate); // 시작일이 종료일보다 늦으면 true, 아니면 false
  }

  const convertTextToDateString = (text: string) => {
    const year = text.slice(0, 4); //parseInt
    const month = text.slice(4, 6);
    const day = text.slice(6, 8);
    // return formatDateToYYYYMMDD(new Date(year, month - 1, day));
    // return (new Date(year, month - 1, day));
    return `${year}-${month}-${day}`;
  };

  const handleStartTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 필드는 숫자만 입력 가능하고 최대 8자리까지 입력 가능
    let input = e.target.value.replace(/\D/g, ''); // 숫자만 입력
    if (input.length > 8) input = input.slice(0, 8); // 최대 8자리까지 입력 가능

    // 문자 필드 업데이트
    const formattedInput = formatOrDefault(input);//.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    setTwinTextStartDate(formattedInput);

    // 숫자 8자리가 입력되면 날짜 형식으로 변환
    if (formattedInput.length === 8) {
      const newDate = convertTextToDateString(formattedInput);
      const newDateTime = combineDateAndTime(newDate, '00:00:00');
      setTwinCalendarStartDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
      setNewFullStartDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용
      //checkTwinDateError(new Date(newDate), 'start'); // 날짜 오류 체크
      setIsTwinStartComplete(true);
    }
    else if (formattedInput.length < 8) {
      setIsTwinStartComplete(false);
    }
  };

  const handleEndTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 필드는 숫자만 입력 가능하고 최대 8자리까지 입력 가능
    let input = e.target.value.replace(/\D/g, ''); // 숫자만 입력
    if (input.length > 8) input = input.slice(0, 8); // 최대 8자리까지 입력 가능

    // 문자 필드 업데이트
    const formattedInput = formatOrDefault(input);//.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    setTwinTextEndDate(formattedInput);

    // 숫자 8자리가 입력되면 날짜 형식으로 변환
    if (formattedInput.length === 8) {
      const newDate = convertTextToDateString(formattedInput);
      const newDateTime = combineDateAndTime(newDate, '23:45:00');
      setTwinCalendarEndDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
      setNewFullEndDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용
      //checkTwinDateError(new Date(newDate), 'end'); // 날짜 오류 체크
      setIsTwinEndComplete(true);
    }
    else if (formattedInput.length < 8) {
      setIsTwinEndComplete(false);
    }
  };

  const handleTwinStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 날짜 입력 필드에서 날짜가 변경되면 상태를 업데이트하고 시간을 00:00:00으로 설정
    const newDate = e.target.value // 날짜값만 사용
      ? e.target.value  // 값이 있으면 그대로 사용
      : formatDateToYYYYMMDD(new Date()); // 값이 없으면 기존 값으로 복원 (삭제 버튼 눌렀을 때)
    const newDateTime = combineDateAndTime(newDate, '00:00:00');

    // 달력 필드 업데이트
    setTwinCalendarStartDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullStartDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용

    // 문자 필드 업데이트
    const formattedInput = formatOrDefault(newDate.replace(/-/g, ''));
    setTwinTextStartDate(formattedInput);

    // 입력 확인 상태 업데이트
    setIsTwinStartComplete(true);
  };

  const handleTwinEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 날짜 입력 필드에서 날짜가 변경되면 상태를 업데이트하고 시간을 23:45:00으로 설정
    const newDate = e.target.value // 날짜값만 사용
      ? e.target.value  // 값이 있으면 그대로 사용
      : formatDateToYYYYMMDD(new Date()); // 값이 없으면 기존 값으로 복원 (삭제 버튼 눌렀을 때)
    const newDateTime = combineDateAndTime(newDate, '23:45:00');

    // 달력 필드 업데이트
    setTwinCalendarEndDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullEndDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용

    // 문자 필드 업데이트
    const formattedInput = formatOrDefault(newDate.replace(/-/g, ''));
    setTwinTextEndDate(formattedInput);

    // 입력 확인 상태 업데이트
    setIsTwinEndComplete(true);
  };

  const openStartDatePicker = () => {
    startDateInputRef.current?.showPicker();
  };

  const openEndDatePicker = () => {
    endDateInputRef.current?.showPicker();
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseInt(e.target.value, 10))) { // 숫자가 아닌 경우 0으로 설정
      setNewItemProgress(0);
      return;
    }

    const progress = parseInt(e.target.value, 10); // ID를 숫자로 변환
    if(progress < 0 ) { // 0 ~ 100 사이의 값만 허용
      setNewItemProgress(0);
    }
    else if(progress > 100) {
      setNewItemProgress(100);
    }
    else {
      setNewItemProgress(parseInt(e.target.value, 10)); // 상태 업데이트
    }
  }

  const handleCreateItemDataBack = () => {
    if(!newItemContent // 이름이 없는 경우
      || !newTargetGroup.id // 그룹이 없는 경우
      || !newFullStartDate // 시작일이 없는 경우
      || !newFullEndDate // 종료일이 없는 경우
      || !isTwinStartComplete // 날짜 입력 필드가 완료되지 않은 경우 (start)
      || !isTwinEndComplete // 날짜 입력 필드가 완료되지 않은 경우 (end)
    ) {
      sweetAlert2.fire({
        icon: "error",
        title: "생성 오류",
        text: "항목 필수 정보를 전부 입력해주세요. (이름, 그룹, 시작일, 종료일)",
      });
      return;
    }
    else if(isDateError) {
      sweetAlert2.fire({
        icon: "error",
        title: "날짜 오류",
        text: "종료일이 시작일보다 이전일 수 없습니다.",
      });
      return;
    }

    // section for backend update
    // backend에 데이터 등록을 마친 후에 프론트엔드에 데이터를 추가하는 방식으로 진행 - id를 받아오기 위함
    // 현재 선택하여 생성중인 항목의 정보를 createdItem으로 정리하고 onItemUpdateBack 호출
    const createdItem = {
      id : 0, // 자동 생성값 사용할거라 0넣고 보냄 - 안넣으면 틀에 안맞아서 오류남
      content: newItemContent,
      group: parseInt(newTargetGroup.id, 10),
      start: newFullStartDate,
      end: newFullEndDate,
      type: newItemType.type,
      progress: newItemProgress,
      assignee: newTargetAssignee.id? newTargetAssignee.id : undefined,
      nextedItems: nextedItems.length > 0 ? nextedItems.map((nextedItem) => nextedItem.id) : undefined,
      project: project_state.project.project_id
    };
    // call onItemUpdate for updated item
    onItemCreateBack(createdItem); 
  }

  const handleCreateItemDataFront = () => {
    // section for arrow update 
    // 기존에 nextedArrows에는 ID값이 tempKeyID인 Arrow가 추가되어 있어 해당 ID값을 찾아 새로 받은 onCreatedItemID로 업데이트 필요
    // 1. id_item_1과 id_item_2가 tempKeyID인 것을 찾아서 onCreatedItemID로 업데이트
    // 2. id_item_1과 id_item_2가 숫자가 아닌 경우 tempKeyID로 업데이트 (onCreatedItemID가 지정되어있지않는 경우가 있어서 null 이 허용되기 때문)
    const cleanedArrows = nextedArrows.map((arrow) => ({
      ...arrow,
      id_item_1: arrow.id_item_1 === tempKeyID || typeof arrow.id_item_1 !== "number" ? onCreatedItemID ?? tempKeyID : arrow.id_item_1,
      id_item_2: arrow.id_item_2 === tempKeyID || typeof arrow.id_item_2 !== "number" ? onCreatedItemID ?? tempKeyID : arrow.id_item_2,
    }));
    // 3. 상태를 갱신
    setNextedArrows(cleanedArrows);
    // 4. onArrowUpdate 호출
    onArrowCreateFront(cleanedArrows); // 백엔드 갱신은 item에 관계된 arrow를 같이 갱신하는 방식으로 진행

    // section for front update
    // frontend에 데이터를 등록 할 때 backend에서 받아온 id를 사용하여 등록
    // 현재 추가된 하부 항목들을 추가
    const addedItem = nextedItems 
                      .map(nextedItem=> nextedItem.id); //(id만 추출) [1, 2, 3] or undefined - create는 기존 항목이 없음 - 추가된 항목만 추출
    // addedItem에 의해 next 관계가 삭제된 항목들을 찾아 그들이 보유한 nextedItems에서 해당 항목 삭제 처리하고 nextDeletedObjects로 저장
    const nextDeletedObjects = everyDataItem
      .filter(item => item.nextedItems && item.nextedItems.some(id => addedItem.includes(id as number))) //선택 항목의 nextedItems에 기록된 항목 데이터 목록을 가져옴
      .map(item => { // 모든 항목중에서 검사해서 해당하는 Item을 찾아서 반환)
        const updatedNextedItems = item.nextedItems!.filter(id => !addedItem.includes(id as number)); // addedItem에 포함된 항목들을 제외한 새로운 nextedItems 배열을 생성
        
        if(updatedNextedItems.length === 0) { // nextedItems가 빈 배열이면 undefined로 업데이트 후 반환
          return {...item, nextedItems: undefined};
        } else { // nextedItems가 빈 배열이 아니면 업데이트 후 반환
          return {...item, nextedItems: updatedNextedItems};
        }
      });
    
    // addedItem을 이용하여 addedObjects를 생성하고 각 항목에 대해 onItemUpdate를 호출 - 하부 항목을 추가하는 경우에 적용
    const addedObjects = addedItem?.map((added) => {
      return {
        ...everyDataItem.find((item) => item.id === added),
        nextedInItem: onCreatedItemID as number // nextedInItem을 현재 선택한 항목으로 설정
      }
    });
    // call onItemUpdateFront for each added item
    addedObjects?.forEach((addedObject) => {
      onItemCreateFront(addedObject as ICustomDataItem); 
    });

    // call onItemUpdateFront for each nextDeletedObjects
    nextDeletedObjects.forEach((nextDeletedObject) => { // nextDeletedObjects에 대해 각각 onItemUpdate 호출
      if(nextDeletedObject) {
        onItemCreateFront(nextDeletedObject as ICustomDataItem); 
      }
    });
    
    // set isDateError to false
    setIsDateError(false); // 날짜 오류 해제
    
    // close the modal
    handleInputItem();
  }

  const handleSelectChangeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => { // 항목 그룹 선택 용도
    // 항목 그룹 선택
    const selectedId = e.target.value;
    const selectedContent = everyDataGroup.find(column => column.id.toString() === selectedId)?.content?.toString() || '';
    setNewTargetGroup({ id: selectedId, content: selectedContent });
  }
  
  const handleSelectChangeItem = (e: React.ChangeEvent<HTMLSelectElement>) => { // 항목 하부 선택 용도
    // next에 등록될 정보 선택
    const selectedId = e.target.value;
    const selectedContent = everyDataItem.find(column => column.id.toString() === selectedId)?.content?.toString() || '';
    const selectedGroupContent = // 선택한 항목이 가지고 있는 group 정보와 id가 같은 group의 content를 찾아서 반환
      everyDataGroup.find(column => column.id === everyDataItem.find(column => column.id.toString() === selectedId)?.group)?.content?.toString() || '';
    setNewTargetItem({ id: selectedId, content: selectedContent, group: selectedGroupContent });
  }

  const handleSelectChangeAssignee = (e: React.ChangeEvent<HTMLSelectElement>) => { // 항목 담당자 선택 용도
    // assignee에 등록될 정보 선택
    const selectedId = e.target.value;
    const selectedContent = everyDataUser.find(column => column.id.toString() === selectedId)?.name?.toString() || '';
    setNewTargetAssignee({ id: selectedId, content: selectedContent });
  }

  const handleSelectChangeType = (e: React.ChangeEvent<HTMLInputElement>) => { // 항목 타입 선택 용도
    // 항목 타입 선택
    const selectedType = e.target.value;
    setNewItemType({type:selectedType});  
  }

  const handleAddItem = () => {
    if(newTargetItem.id && newTargetItem.content) {
      setNextedItems(prevItems => [
        ...prevItems, 
        {
          id: parseInt(newTargetItem.id, 10),
          content: newTargetItem.content,
          group: newTargetItem.group
        }
      ]);

      setNewTargetItem({ id: '', content: '', group: '' }); // 추가 후 선택 초기화

      // 관계 변경에 따른 Arrow 항목 추가 
      const lastIndex = nextedArrows.length > 0 ? nextedArrows[nextedArrows.length-1].id : 0;
      const newArrow = {
        id: lastIndex + 1,
        id_item_1: tempKeyID as number,
        id_item_2: parseInt(newTargetItem.id, 10)
      }
      setNextedArrows(prevArrows => [...prevArrows, newArrow]);
    }
  }

  const handleDeleteItem = (id:number) => {
    setNextedItems(prevItems => prevItems.filter(item => item.id !== id));

    // 관계 변경에 따른 Arrow 항목 삭제
    // 삭제 할 Arrow를 찾아서 정보 저장 - id_item_1과 id_item_2가 일치하는 것을 찾아서 삭제 - 백엔드 연결 후 전송 용도로 별도 저장함
    const deletedArrow = nextedArrows.find((arrow) => arrow.id_item_1 === tempKeyID && arrow.id_item_2 === id);
    // 전체 Arrow에서 삭제할 Arrow를 제외한 정보를 저장
    setNextedArrows(prevArrows => prevArrows.filter(arrow => arrow.id !== deletedArrow?.id));

    setNextedArrows(prevArrows => { // 배열 데이터라서 전체 항목을 탐색해 제거 조건에 맞는것만 제외하고 반환
      const updatedArrows = prevArrows.filter((arrow) => {
        // 보유한 모든 arrows를 탐색해서 deletedArrow가 아닌 것만 반환하기
        const keepArrow = !(arrow.id_item_1 === tempKeyID && arrow.id_item_2 === id);
        return keepArrow; // to updatedArrows
      })
      return updatedArrows; // to setNextedArrows
    })
  }

  const formatDateToYYYYMMDD = (date:Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜와 시간을 결합하는 함수 - T를 구분자로 사용 - 합치고 나면 Date형 객체가 되니 주의
  const combineDateAndTime = (date: string, time: string) => {
    return `${date}T${time}`;
  };

  const callNextID = async (): Promise<void> => {
    try {
      // 서버로 데이터를 전송
      const res = await DashboardGanttItemModel.requestItemNextID();
      
      if (res.statusCode !== 200) {
        sweetAlert2.fire({
            icon: "error",
            title: "서버 오류",
            text: res.message || '데이터 조회 중 오류가 발생했습니다.',
        });
        return;
      }
      const lastIndex = res.data?.next_id;
      setNextItemIndex(lastIndex as number);

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
    // new item 초기화
    setNewItemContent('');
    initTwinStartDate(); // 결합 컴포넌트 날짜 입력 필드 초기화
    initTwinEndDate(); // 결합 컴포넌트 날짜 입력 필드 초기화
    setIsTwinStartComplete(true); // 결합 컴포넌트 날짜 입력 필드 완료 여부 초기화 - 처음에는 오늘 날짜 입력되어있으므로 들어오자마자 true
    setIsTwinEndComplete(true); // 결합 컴포넌트 날짜 입력 필드 완료 여부 초기화 - 처음에는 오늘 날짜 입력되어있으므로 들어오자마자 true
    setNewItemProgress(0);
    setNewItemType({type:'range'});

    setNewTargetItem({id:'', content:'', group:''});
    setNewTargetGroup({id:'', content:''});
    setNextedItems([]);
    setNewTargetAssignee({id:'', content:''});

    setNextedArrows(everyDataArrow);

    // callNextID(); // 다음 항목 ID를 가져옴 from server - 이제 자동 생성값 사용함

  }, [inputItemModalState])

  useEffect(() => {
    if (twinCalendarStartDate) {
      checkTwinDateError(new Date(twinCalendarStartDate), 'start');
    }
  }, [twinCalendarStartDate]);

  useEffect(() => {
    if (twinCalendarEndDate) {
      checkTwinDateError(new Date(twinCalendarEndDate), 'end');
    }
  }, [twinCalendarEndDate]);

  useEffect(() => {
    // 여기서 프론트엔드 항목추가 처리를 진행
    if(onCreatedItemID) {
      handleCreateItemDataFront();
    }
  }, [onCreatedItemID])


  return (
    <Modal isOpen={inputItemModalState} size="lg">
      <Modal.Head>간트 항목 추가</Modal.Head>
      <Modal.Body>
        <div>
          {/* <div className="flex flex-col items-center gap-4 "> */}
          <div className="flex space-x-4">
            {/* 항목 이름 */}
            {/* <div className="flex flex-wrap items-center w-full gap-4"> */}
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              <div className="flex items-center flex-1 w-full md:w-1/3">
                <label htmlFor="existlabel" className="whitespace-pre">
                  {'항목 이름 입력'}
                </label>
              </div>
            </div>
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              <div className="flex items-center">
                <Input
                  id="identifier"
                  name="identifier"
                  value={newItemContent}
                  onChange={handleItemContentChange}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4"> 
            {/* 항목 그룹 */}
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              <div className='flex items-center flex-1 w-full md:w-1/3'>
                <label htmlFor="existlabel" className="whitespace-pre">
                {'항목 그룹 선택'}
                </label>
              </div>
            </div>
            <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
              <div>
                <Input.Select
                  name="groupSelect"
                  value={newTargetGroup.id.toString()}
                  onChange={handleSelectChangeGroup}
                  >
                  <Input.Option value="">선택</Input.Option>
                  {/* 프로젝트->그룹목록으로 필터링해서 보여주던지 백에서 걸러와야 함 */}
                  {everyDataGroup
                    .map(column => (
                    <Input.Option key={column.id} value={column.id.toString()}>
                      {column.content as string}
                    </Input.Option>
                  ))}
                </Input.Select>
              </div>
              {/* 그룹은 선택시 id와 이름 보여주는게 필요 없음 */}
            </div>
          </div>
        
          <div className="flex space-x-4">
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              <label htmlFor="existlabel" className="whitespace-pre">
                {'항목 유형 선택'}
              </label>
            </div>
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              {/* 항목 유형 선택 */}
              <div className="flex items-center">
                <div className='flex items-center flex-1 w-full md:w-1/3'>
                  <Input.Radio
                    name='typeSelect'
                    value='range'
                    onChange={handleSelectChangeType}
                    checked={newItemType.type === 'range'}
                    >
                  </Input.Radio>
                  <label htmlFor="existlabel" className="whitespace-pre">
                    {'항목'}
                  </label>
                </div>
                <div className='flex items-center flex-1 w-full md:w-1/3'>
                  <Input.Radio
                    name='typeSelect'
                    value='point'
                    onChange={handleSelectChangeType}
                    checked={newItemType.type === 'point'}
                    >
                  </Input.Radio>
                  <label htmlFor="existlabel" className="whitespace-pre">
                    {'이벤트'}
                  </label>
                </div> 
              </div>
            </div>
          </div>

          {/* 테스트 중인 신규 날짜 입력 필드 */}
          <div className='flex space-x-4'>
            <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
            <div className="flex items-center flex-1 w-full">
              <label className='me-1'>{`시작 날짜 선택 (YYYYMMDD)`}</label>
              <input
                ref={startDateInputRef}
                type="date"
                value={twinCalendarStartDate}
                onChange={handleTwinStartDateChange}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} // 화면에 보이지 않도록 설정
              />
              <Input
                type="text"
                value={twinTextStartDate}
                onChange={handleStartTextInputChange}
                placeholder="YYYYMMDD"
                // className="flex items-center flex-1 w-full md:w-1/3"
                className="flex flex-1 items-center w-full md:w-1/3 "
                maxLength={8}
              />
              <button onClick={openStartDatePicker}><CalendarCheck className='text-2xl ml-1'/></button>
              </div>
            </div>


            <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
              <div className="flex items-center flex-1 w-full">
                <label className='me-1'>{`종료 날짜 선택 (YYYYMMDD)`}</label>
                <input
                  ref={endDateInputRef}
                  type="date"
                  value={twinCalendarEndDate}
                  onChange={handleTwinEndDateChange}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} // 화면에 보이지 않도록 설정
                />
                <Input
                  type="text"
                  value={twinTextEndDate}
                  onChange={handleEndTextInputChange}
                  placeholder="YYYYMMDD"
                  // className="flex items-center flex-1 w-full md:w-1/3"
                  className="flex flex-1 items-center w-full md:w-1/3 "
                  maxLength={8}
                />
                <button onClick={openEndDatePicker}><CalendarCheck className='text-2xl ml-1'/></button>
              </div>
            </div>
          </div>

        </div> 

        {/* typeOfItem에 따른 조건부 렌더링 */}
        {newItemType.type === 'range' ? (
          <div>
            {/* range 타입에 대한 내용 */}
            <h2>항목 유형 - task</h2><br/>
            <div className="flex space-x-4">
              {/* 항목 진행도 */}
              <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
                <div className="flex items-center flex-1 w-full md:w-1/3">
                  <label htmlFor="progresslabel" className="whitespace-pre">
                    {'항목 진행도 입력'}
                  </label>
                </div>
              </div>
              <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
                <div className="flex items-center">
                  <label htmlFor="progress" className="w-1/6 whitespace-nowrap">
                    {'진행도'}
                  </label>
                  <Input
                    id="progress"
                    name="progress"
                    value={newItemProgress}
                    onChange={handleProgressChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4"> 
              <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
                {/* 기존 항목 담당자 출력 */}
                <div className='flex items-center flex-1 w-full md:w-1/3'>
                  <label htmlFor="existlabel" className="whitespace-pre">
                    {'항목 담당자 선택'}
                  </label>
                </div>
              </div>
              <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
                {/* 항목 담당자 변경 */}
                <div>
                  <Input.Select
                    name="asigneeSelect"
                    value={newTargetAssignee.id.toString()}
                    onChange={handleSelectChangeAssignee}
                    >
                    <Input.Option value="">선택</Input.Option>
                      {/* 프로젝트->유저목록으로 필터링해서 보여주던지 백에서 걸러와야 함 */}
                      {everyDataUser
                        .map(column => (
                        <Input.Option key={column.id} value={column.id.toString()}>
                          {column.name as string}
                        </Input.Option>
                    ))}
                  </Input.Select>
                </div>
                <div>
                  {/* 이 부분에 선택한 값 출력 */}
                  {newTargetAssignee.id && (
                    <p>선택된 사용자의 id : {newTargetAssignee.id as string}</p>
                  )}
                  {newTargetAssignee.content && (
                    <p>선택된 사용자의 이름 : {newTargetAssignee.content as string}</p>
                  )}
                </div>
              </div>
            </div>

            <div className='flex space-x-4'>
              {/* 항목 다음에 연계될 항목의 목록을 출력 */}
              <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
                <h1>연계 항목 목록</h1>
                <div>
                  {nextedItems.map((nextedItem) => (
                    <div key={nextedItem.id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-200">
                      <div>
                        <span className="font-semibold">{nextedItem.content}</span>
                      </div>
                        <Button onClick={() => handleDeleteItem(nextedItem.id)}>
                          삭제
                        </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* 항목 다음에 연결될 항목을 선택 */}
              <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
                <div>
                  <Input.Select
                    name="addGroup"
                    value={newTargetItem.id.toString()}
                    onChange={handleSelectChangeItem}
                    >
                    <Input.Option value="">선택</Input.Option>
                    {/* 프로젝트->항목목록으로 필터링해서 보여주던지 백에서 걸러와야 함 */}
                    {everyDataItem  // 항목은 다른 항목의 하위 항목을 가져오는 동작이 허용되지않음
                      .filter(column => // 현재 선택한 항목 본인은 제외
                        ((column.nextedInItem === null) || (column.nextedInItem === undefined)) // nextedInItem에 값을 가지고 있는 항목은 제외 (한번에 하나의 상부 항목만 가질 수 있음)
                        && !nextedItems.find(item => item.id === column.id) // 이미 추가된 항목은 제외
                        // && !(column.nextedItems && column.nextedItems.length > 0) // 다른 항목을 추가한 항목도 제외 (상부 항목은 하부 항목으로 추가 불가)
                        && !(column.type === 'point') // point 타입은 하부 항목으로 추가 불가
                        && !(nextedItems.length > 0)       // 한번에 하나의 항목만 가질 수 있게
                      ) // todo end가 start보다 이전인 경우 제외 - 역방향 설정 못하게 - 오류 방지
                      .map(column => (
                      <Input.Option key={column.id} value={column.id.toString()}>
                        {column.content as string}
                      </Input.Option>
                    ))}
                  </Input.Select>
                </div>
                <div>
                {/* 이 부분에 선택한 값 출력 */}
                {newTargetItem.id && (
                  <p>선택된 항목 내용 : {newTargetItem.content as string}</p>
                )}
                {newTargetItem.id && (
                  <p>선택한 항목 소속 : {newTargetItem.group as string}</p>
                )}
                </div>
                <div>
                  <Button className="w-full" onClick={handleAddItem}>
                    연계 항목 추가
                  </Button>
                </div>
              </div>
            </div>  

          </div>
        ) : newItemType.type === 'point' ? (
          <div>
              {/* point 타입에 대한 내용 */}
            <h2>항목 유형 - event</h2><br/>
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateItemDataBack}>
          생성
        </Button>
        <Button variant="primary" onClick={handleInputItem}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InputItemModal

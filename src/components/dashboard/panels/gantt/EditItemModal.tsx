import { useEffect, useState, useRef } from 'react'
import sweetAlert2 from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import { CalendarCheck } from 'react-bootstrap-icons'
import { ICustomDataArrow, ICustomDataGroup, ICustomDataItem, ICustomDataAssignee } from '../DashboardDevelopmentTimeline'
import { IdType } from 'vis-timeline/standalone'


interface IProps {
	editItemModalState: boolean
	handleEditItem: () => void
  selectedDataItem: ICustomDataItem
  everyDataItem: ICustomDataItem[]
  everyDataGroup: ICustomDataGroup[]
  everyDataUser: ICustomDataAssignee[]
  everyDataArrow: ICustomDataArrow[]
  onItemUpdateFront: (updatedItem: ICustomDataItem) => void
  onItemUpdateBack: (updatedItem: ICustomDataItem) => void
  onArrowUpdate: (updatedArrow: ICustomDataArrow[]) => void
  onItemDeleteFront: (deletedItem: ICustomDataItem) => void
  onItemDeleteBack: (deletedItem: ICustomDataItem) => void
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

const EditItemModal = ({ editItemModalState, handleEditItem, selectedDataItem, everyDataItem, everyDataGroup, everyDataArrow, everyDataUser, onItemUpdateFront, onItemUpdateBack, onArrowUpdate, onItemDeleteFront, onItemDeleteBack }: IProps) => {
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
  const [newItemProgress, setNewItemProgress] = useState(0); //수정할 항목 - 진행률 // 
  const [newTargetAssignee, setNewTargetAssignee] = useState({ id: '', content: '' }); //선택된 담당자 관리 정보
  const [newItemAssignee, setNewItemAssignee] = useState<string | null>(null); //기존 담당자 정보 - newTargetAssignee에 의해 대체됨
  // Item 연계 관련 정보
  const [newTargetItem, setNewTargetItem] = useState({ id: '', content: '', group: '' }); //리스트 생성용 하부 항목 정보
  const [nextedItems, setNextedItems] = useState<NextedData[]>([]); //새로 구성된 하부 항목 정보 리스트
  const [nextedArrows, setNextedArrows] = useState<NextedArrow[]>([]); //확인 누를시 갱신될 하부 화살표 정보 리스트
  // Item 생성 meta 정보
  const [isDataChanged, setIsDataChanged] = useState(false); //데이터 변경 여부 확인용 - 안되어있으면 저장 스킵함
  const [isDateError, setIsDateError] = useState(false); //날짜 오류 여부 확인용 - 시작일이 종료일보다 늦으면 저장 불가
  const [isAssigneeDelete, setIsAssigneeDelete] = useState(false); //담당자 삭제 여부 확인용 - 삭제 버튼 누르면 true로 설정

  const handleItemContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemContent(e.target.value);
    setIsDataChanged(true);
  }

  const initTwinStartDate = () => {
    // 날짜까지만 관리하는 newDate로 상태를 업데이트 하고 시간이 포함된 newDateTime을 selectedDataItem.start에 저장
    const newDate = formatDateToYYYYMMDD(new Date(selectedDataItem.start)); // Date를 씌워서 들어오기 때문에 날짜값만 추출
    const newDateTime = combineDateAndTime(newDate, '00:00:00'); // 시간값을 00:00:00으로 설정

    // 문자 필드 업데이트
    setTwinTextStartDate(formatOrDefault(newDate.replace(/-/g, ''))); // 문자 필드 업데이트

    // 달력 필드 업데이트
    setTwinCalendarStartDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullStartDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용
  }

  const initTwinEndDate = () => {
    // 날짜까지만 관리하는 newDate로 상태를 업데이트 하고 시간이 포함된 newDateTime을 selectedDataItem.end에 저장
    const newDate = formatDateToYYYYMMDD(new Date(selectedDataItem.end? selectedDataItem.end : '')); // Date를 씌워서 들어오기 때문에 날짜값만 추출
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
      setIsTwinStartComplete(true);
    }
    else if (formattedInput.length < 8) {
      setIsTwinStartComplete(false);
    }
    // 편집 여부 상태 업데이트
    setIsDataChanged(true);
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
      setIsTwinEndComplete(true);
    }
    else if (formattedInput.length < 8) {
      setIsTwinEndComplete(false);
    }
    // 편집 여부 상태 업데이트
    setIsDataChanged(true);
  };

  const handleTwinStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 날짜 입력 필드에서 날짜가 변경되면 상태를 업데이트하고 시간을 00:00:00으로 설정
    const newDate = e.target.value // 날짜값만 사용
      ? e.target.value  // 값이 있으면 그대로 사용
      : formatDateToYYYYMMDD(new Date(selectedDataItem.start)); // 값이 없으면 기존 값으로 복원 (삭제 버튼 눌렀을 때)
    const newDateTime = combineDateAndTime(newDate, '00:00:00');

    // 달력 필드 업데이트
    setTwinCalendarStartDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullStartDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용

    // 문자 필드 업데이트
    const formattedInput = formatOrDefault(newDate.replace(/-/g, ''));
    setTwinTextStartDate(formattedInput);

    // 입력 확인 상태 업데이트
    setIsTwinStartComplete(true);

    // 편집 여부 상태 업데이트
    setIsDataChanged(true);
  };

  const handleTwinEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 날짜 입력 필드에서 날짜가 변경되면 상태를 업데이트하고 시간을 23:45:00으로 설정
    const newDate = e.target.value // 날짜값만 사용
      ? e.target.value  // 값이 있으면 그대로 사용
      : formatDateToYYYYMMDD(new Date(selectedDataItem.end? selectedDataItem.end : '')); // 값이 없으면 기존 값으로 복원 (삭제 버튼 눌렀을 때)
    const newDateTime = combineDateAndTime(newDate, '23:45:00');

    // 달력 필드 업데이트
    setTwinCalendarEndDate(newDate); // 상태 업데이트 - 날짜만 - 컴포넌트 표시용
    setNewFullEndDate(newDateTime); // 상태 업데이트 - 날짜와 시간 - 백엔드 전송용

    // 문자 필드 업데이트
    const formattedInput = formatOrDefault(newDate.replace(/-/g, ''));
    setTwinTextEndDate(formattedInput);

    // 입력 확인 상태 업데이트
    setIsTwinEndComplete(true);
    
    // 편집 여부 상태 업데이트
    setIsDataChanged(true);
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
    setIsDataChanged(true);
  }

  const handleUpdateItemData = () => {
    if (!isDataChanged) {
      // 변경된 내용이 없으면 저장하지 않음
      return;
    }
    else if(!newItemContent) { // 이름이 없으면 저장하지 않음
      sweetAlert2.fire({
        icon: "error",
        title: "이름 오류",
        text: "이름을 제대로 입력해 주세요",
      });
      return;
    }
    else if(isDateError) { // 날짜 오류가 있으면 저장하지 않음
      sweetAlert2.fire({
        icon: "error",
        title: "날짜 오류",
        text: "종료일이 시작일보다 이전일 수 없습니다.",
      });
      return;
    }
    else if(!isTwinStartComplete // 날짜 입력 필드가 완료되지 않은 경우 (start)
      || !isTwinEndComplete // 날짜 입력 필드가 완료되지 않은 경우 (end)
    ) {
      sweetAlert2.fire({
        icon: "error",
        title: "날짜 오류",
        text: "날짜를 제대로 입력해 주세요",
      });
      return;
    }
    

    // 항목의 원본 정보에서 현재 편집중인 항목을 찾아서 relatedItem 으로 저장
    const relatedItem = everyDataItem.find((item) => item.id === selectedDataItem.id); // [1, 2, 3] or undefined
    // relatedItem 의 정보를 기준으로 하여 보유한 nextedItems 내부에서 삭제된 항목을 찾아서 deletedItem 으로 저장
    const deletedItem = relatedItem?.nextedItems?.filter((item) => !nextedItems.find((nextedItem) => nextedItem.id === item));  //기존 그룹에서 찾는것과 일치하지 않는 것이 삭제된 것으로 간주 [1, 2, 3] or undefined
    // relatedItem 의 정보를 기준으로 하여 보유한 nextedItems 내부에서 추가된 항목을 찾아서 addedItem 으로 저장
    const addedItem = nextedItems 
                      .filter(nextedItem=> !relatedItem?.nextedItems?.includes(nextedItem.id)) // 새 항목에서 찾는 것과 일치하지 않는 것이 추가된 것으로 간주
                      .map(nextedItem=> nextedItem.id); //(id만 추출) [1, 2, 3] or undefined
    // addedItem에 의해 next 관계가 삭제된 항목들을 찾아 그들이 보유한 nextedItems에서 해당 항목 삭제 처리하고 nextDeletedObjects로 저장
    const nextDeletedObjects = everyDataItem
      .filter(item => item.nextedItems && item.nextedItems.some(id => addedItem.includes(id as number))) //선택 항목의 nextedItems에 기록된 항목 데이터 목록을 가져옴
      .map(item => { // 모든 항목중에서 검사해서 해당하는 Item을 찾아서 반환)
        const updatedNextedItems = item.nextedItems!.filter(id => !addedItem.includes(id as number)); // 이 안에는 addedItem에 없는 것만 남게 됨

        if(updatedNextedItems.length === 0) { // nextedItems가 빈 배열이면 undefined로 업데이트 후 반환
          return {...item, nextedItems: undefined};
        } else { // nextedItems가 빈 배열이 아니면 업데이트 후 반환
          return {...item, nextedItems: updatedNextedItems};
        }
      });

    // deletedItem을 이용하여 deletedObjects를 생성하고 각 항목에 대해 onItemUpdate를 호출
    const deletedObjects = deletedItem?.map((deleted) => {
      return {
        ...everyDataItem.find((item) => item.id === deleted),
        nextedInItem: undefined // nextedItems를 undefined로 설정
      }
    });
    // call onItemUpdate for each deleted item
    deletedObjects?.forEach((deletedObject) => {
      onItemUpdateFront(deletedObject as ICustomDataItem);
    });

    // addedItem을 이용하여 addedObjects를 생성하고 각 항목에 대해 onItemUpdate를 호출
    const addedObjects = addedItem?.map((added) => {
      return {
        ...everyDataItem.find((item) => item.id === added),
        nextedInItem: selectedDataItem.id as number // nextedInItem을 현재 선택한 항목으로 설정
      }
    });
    // call onItemUpdate for each added item
    addedObjects?.forEach((addedObject) => {
      onItemUpdateFront(addedObject as ICustomDataItem); // todo 백엔드 연결 후 갱신 필요
    });

    // call onItemUpdate for each nextDeletedObjects
    nextDeletedObjects.forEach((nextDeletedObject) => { // nextDeletedObjects에 대해 각각 onItemUpdate 호출
      if(nextDeletedObject) {
        onItemUpdateFront(nextDeletedObject as ICustomDataItem); // todo 백엔드 연결 후 갱신 필요
      }
    });
    
    // 현재 선택하여 편집중인 항목의 정보를 updatedItem으로 정리하고 onItemUpdate 호출
    const updatedItem = {
      ...selectedDataItem,
      content: newItemContent,
      group: newTargetGroup.id? parseInt(newTargetGroup.id, 10) : selectedDataItem.group,
      start: newFullStartDate,
      end: newFullEndDate,
      progress: newItemProgress,
      assignee: newTargetAssignee.id?
                  newTargetAssignee.id : newItemAssignee?
                    newItemAssignee : undefined,
      nextedItems: nextedItems.length > 0 ? nextedItems.map((nextedItem) => nextedItem.id) : undefined
    };

    // 백엔드 데이터 갱신 + 프론트엔드 데이터 갱신
    onItemUpdateBack(updatedItem); 

    // 화살표 데이터 갱신
    onArrowUpdate(nextedArrows); // item의 백엔드 업데이트 처리시에 링크도 같이 처리되게 했으므로 따로 처리할 필요 없음

    // set isChanged to false
    setIsDataChanged(false); // 변경된 데이터가 없으므로 false로 설정

    // set isAssgineeDelete to false
    setIsAssigneeDelete(false); // 담당자 삭제 여부 플래그를 false로 설정

    // close the modal
    handleEditItem();
  }

  const handleDeleteItemData = () => {
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
        const relatedItem = everyDataItem.find(item => item.id === selectedDataItem.id); // [1, 2, 3] or undefined

        // 삭제 대상의 nextedItems 정보를 가져와서 프론트엔드에서 관계 삭제
        const updatedNextedItemsObjects = everyDataItem
          .filter(item => relatedItem?.nextedItems?.includes(item.id)) // 선택 항목의 nextedItems에 기록된 항목 데이터 목록을 가져옴
          .map(nextedItem => ({
            ...nextedItem,
            nextedInItem: undefined, // reset to default
          }));
        // call onItemUpdateFront for each nextedItems
        updatedNextedItemsObjects.forEach(updatedObject => {
          onItemUpdateFront(updatedObject as ICustomDataItem);
        });

        // 삭제 대상의 nextedItems 정보를 가져와서 프론트엔드에서 관계 삭제
        const updatedNextedInItem = everyDataItem.find(item => item.id === relatedItem?.nextedInItem) // 선택 항목의 nextedInItem에 기록된 항목 데이터를 가져옴
        if (updatedNextedInItem) {
          const deletedNextedItems = updatedNextedInItem.nextedItems?.filter(id => id !== relatedItem?.id);
          const updatedNextedInItemObject = {
            ...updatedNextedInItem,
            nextedItems: deletedNextedItems?.length === 0? undefined : deletedNextedItems, // nextedItems가 빈 배열이면 undefined로 업데이트
          };
          onItemUpdateFront(updatedNextedInItemObject as ICustomDataItem);
        }

        // 백엔드 데이터 갱신 + 프론트엔드 데이터 갱신
        onItemDeleteBack(relatedItem as ICustomDataItem);
        
        // close the modal
        handleEditItem();
      }
    });
  }

  const handleSelectChangeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => { // 항목 그룹 선택 용도
    // group에 등록될 정보 선택
    const selectedId = e.target.value;
    const selectedContent = everyDataGroup.find(column => column.id.toString() === selectedId)?.content?.toString() || '';
    setNewTargetGroup({ id: selectedId, content: selectedContent });
    setIsDataChanged(true);
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
    setIsDataChanged(true);
  }

  const handleRemoveAssignee = () => {
    setNewItemAssignee('');
    setNewTargetAssignee({ id: '', content: '' });
    setIsDataChanged(true);
    setIsAssigneeDelete(true); // 플래그 변경
  }

  const handleAddItem = () => {
    if(newTargetItem.id && newTargetItem.content) {
      setNextedItems(prevItems => [
        ...prevItems, 
        {
          id: parseInt(newTargetItem.id, 10),
          content: newTargetItem.content
        }
      ]);

      setNewTargetItem({ id: '', content: '', group:'' }); // 추가 후 선택 초기화
      setIsDataChanged(true);
      
      // 관계 변경에 따른 Arrow 항목 추가 
      const lastIndex = nextedArrows.length > 0 ? nextedArrows[nextedArrows.length-1].id : 0;
      const newArrow = {
        id: lastIndex + 1,
        id_item_1: selectedDataItem.id as number,
        id_item_2: parseInt(newTargetItem.id, 10)
      }
      setNextedArrows(prevArrows => [...prevArrows, newArrow]);
    }
  }

  const handleDeleteItem = (id:number) => {
    setNextedItems(prevItems => prevItems.filter(item => item.id !== id));
    setIsDataChanged(true);

    // 관계 변경에 따른 Arrow 항목 삭제
    // 삭제 할 Arrow를 찾아서 정보 저장 - id_item_1과 id_item_2가 일치하는 것을 찾아서 삭제 - 백엔드 연결 후 전송 용도로 별도 저장함
    const deletedArrow = nextedArrows.find((arrow) => arrow.id_item_1 === selectedDataItem.id && arrow.id_item_2 === id);
    // 전체 Arrow에서 삭제할 Arrow를 제외한 정보를 저장
    setNextedArrows(prevArrows => prevArrows.filter(arrow => arrow.id !== deletedArrow?.id));

    setNextedArrows(prevArrows => { // 배열 데이터라서 전체 항목을 탐색해 제거 조건에 맞는것만 제외하고 반환
      const updatedArrows = prevArrows.filter((arrow) => {
        // 보유한 모든 arrows를 탐색해서 deletedArrow가 아닌 것만 반환하기
        const keepArrow = !(arrow.id_item_1 === selectedDataItem.id && arrow.id_item_2 === id);
        return keepArrow; // to updatedArrows
      })
      return updatedArrows; // to setNextedArrows
    })
  }

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수 - Input type="date"에서 사용
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

  // isAncestor 함수 정의 - 최상위 항목인지 확인
  const isAncestor = (
    everyDataItem: ICustomDataItem[], // 전체 항목 리스트
    item: ICustomDataItem,            // 현재 선택한 항목
    targetId: IdType           // 상위 항목인지 확인할 대상 ID
  ): boolean => { // boolean 타입 반환 - 상위 항목인지 확인
    // 최상위 항목에 도달하면 false 반환
    if (!item.nextedInItem) return false;
    // 상위 항목이 targetId와 일치하면 true 반환
    if (item.nextedInItem === targetId) return true;

    // 상위 항목을 재귀적으로 탐색하여 확인
    const parentItem = everyDataItem.find(parent => parent.id === item.nextedInItem);
    return parentItem ? isAncestor(everyDataItem, parentItem, targetId) : false;
  };

  useEffect(() => {
    // new item 초기화
    setNewItemContent(selectedDataItem.content as string);  // 선택된 항목의 이름을 설정
    initTwinStartDate(); // 결합 컴포넌트 날짜 입력 필드 초기화
    initTwinEndDate(); // 결합 컴포넌트 날짜 입력 필드 초기화
    setIsTwinStartComplete(true); // 결합 컴포넌트 날짜 입력 필드 완료 여부 초기화 - 처음에는 오늘 날짜 입력되어있으므로 들어오자마자 true
    setIsTwinEndComplete(true); // 결합 컴포넌트 날짜 입력 필드 완료 여부 초기화 - 처음에는 오늘 날짜 입력되어있으므로 들어오자마자 true
    setNewItemProgress(selectedDataItem.progress as number);  // 선택된 항목의 진행률을 설정
    setNewItemType({type: selectedDataItem.type as string}); // 선택된 항목의 타입을 설정 (point or range)

    setNewTargetItem({ id: '', content: '', group: ''});  // 하부 항목 선택 초기화
    setNewTargetGroup({ id: '', content: ''});  // 그룹 선택 초기화
    if(selectedDataItem.nextedItems?.length) {
      // Map nextedItems IDs to corresponding data
      const updatedNextedData:NextedData[] = selectedDataItem.nextedItems.map((nextedItemId) => {
        // Find the item with the corresponding ID
        const item = everyDataItem.find((item) => item.id === nextedItemId);
        return item   // matching format to nextedItems
          ? { id: item.id as number, content: item.content as string } // If the item exists, return the item
          : { id: nextedItemId as number, content: 'Unknown' as string }; // Default value if not fount
    });
    setNextedItems(updatedNextedData);
    }
    setNewTargetAssignee({ id: '', content: ''});  // 담당자 선택 초기화
    setNewItemAssignee(selectedDataItem.assignee as string);  // 선택된 항목의 담당자를 설정

    setNextedArrows(everyDataArrow); // Arrow 정보를 설정 후 변경 예정 - 원본은 유지
  
    
    // 이렇게 쓰면 Date 타입으로 다루게 되어서 그대로 다시 저장시 UTC로 변환되어서 저장됨 - 동작에 문제는 없는데 약간 헷갈림
    // setNewCalendarStartDate(formatDateToYYYYMMDD(new Date(selectedDataItem.start)));  // 선택된 항목의 시작일을 설정 (date)
    // setNewCalendarEndDate(formatDateToYYYYMMDD(new Date(selectedDataItem.end? selectedDataItem.end : ''))); // 선택된 항목의 종료일을 설정 (date)
    // setNewFullStartDate(selectedDataItem.start as string); // 선택된 항목의 시작일을 설정 (datetime)
    // setNewFullEndDate(selectedDataItem.end as string); // 선택된 항목의 종료일을 설정 (datetime)
    
  }, [editItemModalState])

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

  return (
    <Modal isOpen={editItemModalState} size="lg">
      <Modal.Head>간트 항목 편집</Modal.Head>
      <Modal.Body>
        <div>
          {/* <div className="flex flex-col items-center gap-4 "> */}
          <div className="flex space-x-4">
            {/* 항목 이름 */}
            {/* <div className="flex flex-wrap items-center w-full gap-4"> */}
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              <div className="flex items-center flex-1 w-full md:w-1/3">
                <label htmlFor="existlabel" className="whitespace-pre">
                {'기존 항목 이름 : '}
                </label>
                  <div className="flex-1">
                    <label htmlFor="category" className="whitespace-pre">
                      {selectedDataItem.content as string}
                    </label>
                  </div>
              </div>
            </div>
            <div className="w-full max-h-[300px] mb-3 overflow-y-auto">
              <div className="flex items-center">
                <label htmlFor="identifier" className="w-1/6 whitespace-nowrap">
                  {'이름'}
                </label>
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
                {'기존 항목 그룹 : '}
                </label>
                  <div className="flex-1">
                    <label htmlFor="group" className="whitespace-pre">
                      {everyDataGroup.filter(group=> group.id === selectedDataItem.group as string)
                      .map(group => group.content as string)}
                    </label>
                  </div>
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
                    .filter(column => column.id !== selectedDataItem.group // 현재 선택한 그룹 본인은 제외
                    )
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
                    {'기존 항목 진행도 : '}
                  </label>
                    <div className="flex-1">
                      <label htmlFor="category" className="whitespace-pre">
                        {selectedDataItem.progress as number}
                      </label>
                    </div>
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
                <div className="flex justify-between items-center ">
                  <div className="flex items-center">
                    <label htmlFor="existlabel" className="whitespace-pre">
                      {'기존 항목 담당자 : '}
                    </label>
                    <div>
                      {isAssigneeDelete ?
                        (
                          <label htmlFor="group" className="whitespace-pre">삭제되었습니다</label>
                        ) : (
                          <label htmlFor="group" className="whitespace-pre">
                            {selectedDataItem.assignee ?
                              (
                                everyDataUser.some(user => user.id === selectedDataItem.assignee as string)
                                  ? everyDataUser
                                    .filter(user => user.id === selectedDataItem.assignee as string)
                                    .map(user => `${user.name as string} (${user.id as string})`)
                                  : "기존 담당자가 프로젝트에서 제거되었습니다"
                              ) : (
                                "담당자 없음"
                              )}
                          </label>
                      )}
                    </div>
                  </div>
                  <div style={{ visibility:newItemAssignee ? 'visible' : 'hidden'}}>
                    <Button onClick={handleRemoveAssignee}>
                      삭제
                    </Button>
                  </div>
                </div>
              </div>

              <div className='w-full max-h-[300px] mb-3 overflow-y-auto'>
                {/* 항목 담당자 선택 */}
                <div>
                  <Input.Select
                    name="asigneeSelect"
                    value={newTargetAssignee.id.toString()}
                    onChange={handleSelectChangeAssignee}
                    >
                    <Input.Option value="">선택</Input.Option>
                      {/* 프로젝트->유저목록으로 필터링해서 보여주던지 백에서 걸러와야 함 */}
                      {everyDataUser
                        .filter(column => column.id !== newItemAssignee // 현재 선택한 담당자 본인은 제외
                        )
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
                    <div key={nextedItem.id} className="flex justify-between items-center mb-2 border-b border-gray-200">
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
                    {everyDataItem
                      .filter(column => column.id !== selectedDataItem.id // 현재 선택한 항목 본인은 제외
                        //&& !(selectedDataItem.nextedInItem) // 현재 선택한 그룹이 하부 항목이면 본인은 제외 (하부 항목은 하부 항목을 추가 불가)
                        && ((column.nextedInItem === undefined) || (column.nextedInItem === null)) // nextedInItem에 값을 가지고 있는 항목은 제외 (한번에 하나의 상부 항목만 가질 수 있음)
                        && !nextedItems.find(item => item.id === column.id) // 이미 추가된 항목은 제외
                        // && !(column.nextedItems && column.nextedItems.length > 0) // 다른 항목을 추가한 항목도 제외 (상부 항목은 하부 항목으로 추가 불가)
                        && !(column.type === 'point') // point 타입은 하부 항목으로 추가 불가
                        && !(nextedItems.length > 0)       // 한번에 하나의 항목만 가질 수 있게
                        && !(isAncestor(everyDataItem, selectedDataItem, column.id)) // 선택한 항목의 최상위 항목은 하부 항목으로 추가 불가
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
                  <p>선택된 항목 소속 : {newTargetItem.group as string}</p>
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
        <Button variant="danger" onClick={handleDeleteItemData}>
          삭제
        </Button>
        <Button onClick={handleUpdateItemData}>
          저장
        </Button>
        <Button variant="primary" onClick={handleEditItem}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditItemModal

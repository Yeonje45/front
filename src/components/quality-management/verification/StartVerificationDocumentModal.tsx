import React from 'react';
import Swal from 'sweetalert2';
import { CaretRightFill, SquareFill, PauseFill } from 'react-bootstrap-icons';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import Modal from 'tailwindElement/Modal';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import {
  StartVerificationDocument, IGetShowVerificationHistoryModel,
  EndVerificationDocument, IEndVerificationDocumentProps
} from 'models/QualityManagement';

interface IStartVerificationDocumentModalProps {
  std_output_id: number
  getRemoteData: () => Promise<void>
}

const StartVerificationDocumentModal = ({std_output_id, getRemoteData}: IStartVerificationDocumentModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [selectedContextMenu, setSelectedContextMenu] = React.useState<string>("");

  // 테이블 데이터
  const [document, setDocument] = React.useState<IGetShowVerificationHistoryModel[] | null>(null);

  // 타이머 기록 
  const [start, setStart] = React.useState<Date | null>(null); // 시작 시간
  const [end, setEnd] = React.useState<Date | null>(null); // 종료 시간
  const [pause, setPause] = React.useState<Date | null>(null); // 일시정지 시간
  const [duration, setDuration] = React.useState<Date>(new Date(0)); // 경과 시간 (Date 타입)

  /* 모달 열릴 시에 체크리스트 항목 가져오는 함수 실행 */
  React.useEffect(() => {
    if (isOpen) {
      handleStartVerificationDocument();
      setDocument(() => null);
      setStart(() => null);
      setEnd(() => null);
      setPause(() => null);
      setDuration(() => new Date(0));
    }
  }, [isOpen])

  /* 모달 열어주기 */
  const handleOpen = () => {
    setIsOpen(() => true);
  }

  /* 모달 닫아주기 */
  const handleClose = () => {
    setIsOpen(() => false);
  }

  /* 체크리스트 항목 가져오기 */
  const handleStartVerificationDocument = async () => {
    const res = await StartVerificationDocument({std_output_id});
    if (!res.success) {
      Swal.fire({ icon: 'error',
        title: '검증 오류',
        text: res.message || '검증을 시작할 수 없습니다.'
      })
      return 
    }
    if (res.data === null || res.data.length === 0) {
		  setDocument([
        {
          verification_chapter: "",
          verification_content: "",
          verification_result: "Fail",
          verification_comment: ""
        }
      ])
      return
    }
    setDocument(() => res.data);
  }

	/* 우클릭 이벤트 ( 팝업 행추가/행삭제 ) 를 관리*/
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		const { id } = event.currentTarget
		if (selectedContextMenu === id) {
			setSelectedContextMenu("");
			return
		}
		setSelectedContextMenu(id);
	}

	/* key, value, index를 받아와 데이터를 수정해주는 함수 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		if (!document) {
			return
		}
		// id = key, value = value, name = index
		const { id, value, name } = e.target;
    
    setDocument(document.map((row, index) => {
      if (index.toString() === name) {
        return {
          ...row,
          [id]: value
        }
      }
      return row
    }))
		return
	}

	/* 행 삭제 */
	const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
		const { id } = event.currentTarget
		setSelectedContextMenu("");
		if (!document) {
			return
		}
		setDocument(document.filter((_, index) => index.toString() !== id))
		return
	}

	/* 행 추가 */
	const handleAddRow = () => {
		setSelectedContextMenu("");
		if (!document) {
			return
		}
		setDocument([
      ...document,
      {
        verification_chapter: "",
        verification_content: "",
        verification_result: "Fail",
        verification_comment: ""
      }
    ])
		return
	}
  
  const handleSubmitSave = async () => {
    if (!start || !end || !document) {
      Swal.fire({
        icon: 'error',
        title: '검증 오류',
        text: '검증을 시작하고 종료해야 합니다.'
      })
      return
    }
    const endProps: IEndVerificationDocumentProps = {
      std_output_id,
      verification_start_date: start,
      verification_end_date: end,
      verification_duration: duration,
      check_results: document
    };
    const res = await EndVerificationDocument(endProps);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '검증 오류',
        text: res.message || '검증을 종료할 수 없습니다.'
      })
      return 
    }
    await Swal.fire({
      icon: 'success',
      title: '검증 완료',
      text: res.message || '검증이 완료되었습니다.'
    })
    await getRemoteData();
    handleClose();
  }

  // ##### TIMER #####
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (start && !end && !pause) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - start.getTime();
        setDuration(new Date(elapsed));
      }, 1000); // 1초마다 업데이트
    }

    return () => {
      if (interval) clearInterval(interval); // 정리
    };
  }, [start, end, pause]);

  // 타이머 시작 시에 사용하는 함수
  const handleStart = async () => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: '검증 시작',
      text: '검증을 시작하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });
    if (confirm.isDismissed) {
      return
    }

    const now = new Date();

    if (pause) {
      // 일시정지 상태에서 재개
      const pausedDuration = now.getTime() - pause.getTime(); // 일시정지 시간만큼 보상
      setStart(new Date((start?.getTime() || now.getTime()) + pausedDuration));
      setPause(null); // 일시정지 상태 해제
    } else {
      // 새로운 타이머 시작
      setStart(now);
      setEnd(null);
      setPause(null);
      setDuration(new Date(0)); // 경과 시간 초기화
    }
  };

  // 타이머 시작 이후에 사용되는 함수이며, 시간을 일시정지 하는 역할
  const handlePause = async () => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: '검증 일시정지',
      text: '검증을 일시정지하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });
    if (confirm.isDismissed) {
      return
    }
    if (start && !pause) {
      setPause(new Date()); // 일시정지 시간 기록
    }
  };

  // 타이머 시작 이후에 사용되는 함수이며, 시간을 종료하는 역할
  const handleStop = async () => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: '검증 종료',
      text: '검증을 종료하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
    });

    if (confirm.isDismissed) {
      return
    }
    if (start) {
      const now = new Date();
      setEnd(now);
      setPause(null);

      const finalDuration = pause
        ? pause.getTime() - start.getTime()
        : now.getTime() - start.getTime();
      setDuration(new Date(finalDuration)); // 최종 경과 시간 계산
    }
  };

  const formatDuration = (date: Date): string => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>시작</Button>
      <Modal isOpen={isOpen} size='lg'>
        <Modal.Head>검증</Modal.Head>
        <Modal.Body>
          <PanelContainer>
            <PanelHeader>
              <div className="flex flex-wrap justify-between items-center w-full">
							  <div className="flex flex-wrap gap-3 items-center text-lg">
                  <button onClick={handleStart} disabled={!pause && !!start && !end} className="text-gray-700">
								    <CaretRightFill />
								  </button>
                  <button onClick={handlePause} disabled={!start || !!end || !!pause} className="text-gray-400">
                    <PauseFill />
                  </button>
                  <button onClick={handleStop} disabled={!start || !!end} className="text-red-500">
								    <SquareFill />
								  </button>
                  <h2>{formatDuration(duration!)}</h2>
							  </div>
							  <div className="space-x-1">
									<Button onClick={handleAddRow}>행 추가</Button>
								  <Button onClick={handleSubmitSave}>결과 저장하기</Button>
							  </div>
              </div>
            </PanelHeader>
            <PanelBody>
              <div className="overflow-y-auto max-h-[700px]">
                {
                  document &&
					        <div className="w-full h-full grid grid-cols-1 grid-flow-row mb-14">
						        <div className={`row-span-1 border bg-[#efefef] grid grid-rows-1 grid-cols-5`}>
								      <div className="col-span-1 text-md font-bold w-full text-center border p-2 py-3">장절</div>
								      <div className="col-span-2 text-md font-bold w-full text-center border p-2 py-3">점검 항목</div>
								      <div className="col-span-1 text-md font-bold w-full text-center border p-2 py-3">점검 결과</div>
								      <div className="col-span-1 text-md font-bold w-full text-center border p-2 py-3">점검 의견</div>
								    </div>
						        <div className="row-span-1 border grid grid-cols-4">
								      { document && document.map((documentItem, index) => (
									      <div 
										      key={index} 
										      id={index.toString()}
										      className="col-span-4 grid grid-cols-5 relative" 
										      onContextMenu={handleContextMenu}>

										      {/* Add Row, Remove Row */}
										      <div className="absolute left-1/2 top-8">
											      <input
												      type="checkbox"
												      className="hidden peer"
												      onChange={() => {}}
												      checked={selectedContextMenu === index.toString()}
											      />
											      <div className="absolute z-50 flex-col hidden p-1 text-center text-black border shadow-md bg-gray-100 space-y-1 right-1/2 translate-x-[50%] rounded-md peer-checked:flex whitespace-nowrap">
												      <Button onClick={handleAddRow} variant='unset' className="hover:bg-gray-200">행 추가</Button>
												      <Button onClick={handleRemoveRow} variant='unset' className="hover:bg-gray-200" id={index.toString()}>행 삭제</Button>
											      </div>
										      </div>
										      
										      {/* Table Rows */}
										      <div className="thin col-span-1"> <InputElement value={documentItem.verification_chapter} id="verification_chapter" onChange={handleInputChange} name={index.toString()} /> </div>
										      <div className="thin col-span-2"> <TextAreaElement value={documentItem.verification_content} id="verification_content" onChange={handleInputChange} name={index.toString()} /> </div>
										      <div className="thin col-span-1"> <SelectElement value={documentItem.verification_result} id="verification_result" onChange={handleInputChange} name={index.toString()} /> </div>
										      <div className="thin col-span-1"> <TextAreaElement value={documentItem.verification_comment} id="verification_comment" onChange={handleInputChange} name={index.toString()} /> </div>
									      </div>
								      )) }
						        </div>
					        </div>
                }
              </div>
							<p className="text-sm text-gray-500 mt-1">우클릭으로 행 추가/삭제 가능</p>
            </PanelBody>
          </PanelContainer>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleClose}>취소</Button>
        </Modal.Footer>
      </Modal>

    </React.Fragment>
  );
}

/* td 안에 Input  */
const InputElement = ({value, id, onChange, name}: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<input 
			id={id}
			value={value}
			name={name}
			type="text"
			className="p-2 outline-none b-0 w-full border h-full text-center"
			onChange={onChange}
		/>
	)
}

// select box [ Pass, Fail ]
const SelectElement = ({value, id, onChange, name}: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      id={id}
      value={value}
      name={name}
      className="p-2 outline-none b-0 w-full border h-full text-center cursor-pointer bg-gray-50"
      onChange={onChange}
    >
      <option value="Fail">Fail</option>
      <option value="Pass">Pass</option>
    </select>
  )
}

const TextAreaElement = ({value, id, onChange, name}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      id={id}
      rows={4}
      value={value}
      name={name}
      className="p-2 outline-none b-0 w-full border h-full"
      onChange={onChange}
    />
  )
}

export default StartVerificationDocumentModal

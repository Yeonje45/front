import React, { useState, useEffect } from 'react'
import sweetalert from 'sweetalert2'

import Modal from 'tailwindElement/Modal'
import Tabs from 'tailwindElement/Tabs'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  closeHandler: () => void
}

interface IResetPWProps extends React.HTMLAttributes<HTMLDivElement> {
	closeHandler: () => void
}

// ID/PW 찾기 버튼 클릭 시에 나오는 컴포넌트입니다.

// ID찾기의 경우 이름/생일/이메일 입력이 있으며
// PW찾기의 경우 이메일인증 -> ID/Email 입력 -> 재설정
// * 위오 같은 과정을 거칩니다.

const FindID = () => {
  return (
    <div className="flex flex-col items-center justify-center m-auto mt-2 sm:w-full md:w-full lg:w-3/4">
      <Input.InputLabel label="이름" placeholder="이름을 입력해주세요" />
      <Input.InputLabel
        label="생년월일"
        placeholder="생년월일을 입력해주세요"
        type="date"
      />
      <Input.InputLabel label="이메일" placeholder="이메일을 입력해주세요" />
      <Button className="w-full mt-2">ID 찾기</Button>
    </div>
  )
}

const ResetPW = ({ closeHandler }: IResetPWProps) => {
  const [isValidID, setIsValidID] = useState<boolean>(false);
  const [isEmailSend, setIsEmailSend] = useState<{ is_send: boolean, valid_time: number }>({ is_send: false, valid_time: 0 });
  const [isValidation, setIsValidation] = useState<boolean>(false);

  // 1초마다 valid_time이 3분 00초 -> 2분 59초 -> ... -> 0분 00초로 감소하는 로직이 필요
  const handleTime = (): void => {
    setIsEmailSend((prevState) => {
      if (prevState.is_send) {
        if (prevState.valid_time === 0) {
          return { is_send: false, valid_time: 0 };
        } else {
          return { is_send: true, valid_time: prevState.valid_time - 1 };
        }
      }
      return prevState;
    });
  };

  // 1초마다 실행 되는데, 만약 is_send가 True가 되면 실행되는 함수
  useEffect(() => {
    if (isEmailSend.is_send) {
      const interval = setInterval(() => {
        handleTime();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isEmailSend.is_send]);

  // 유효한 ID인지 확인하는 로직이 필요
  const handleIDCheck = (): void => {
    setIsValidID(true);
  };

  // 이메일을 전송하는 로직이 필요
  const handleEmailSend = (): void => {
    setIsEmailSend({ is_send: true, valid_time: 180 });
  };

  // 올바른 인증번호인지 확인하는 로직이 필요
  // 아래 로직은 인증번호 확인에서, 이메일로 임시 랜덤 비밀번호를 보내는 로직으로 대체 될 수 있음
  const handleValidation = async (): Promise<void> => {
    setIsValidation(true);
    await sweetalert.fire({
      icon: 'success',
      title: '비밀번호 재설정이 완료되었습니다.',
      text: '새로운 비밀번호로 로그인해주세요.',
      confirmButtonText: '확인',
    }).then(() => {
      setIsValidation(false);
      setIsEmailSend({ is_send: false, valid_time: 0 });
      setIsValidID(false);
      closeHandler();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center m-auto mt-2 sm:w-full md:w-full lg:w-3/4">
      {!isValidID && (
        <div className="flex flex-col items-center justify-center w-full mt-4 gap-2">
          <span className="font-bold text-md">비밀번호를 찾고자하는 아이디를 입력해주세요.</span>
          <Input.InputLabel label="ID" />
          <Button variant="primary" onClick={handleIDCheck} disabled={isValidID} className="w-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">확인</Button>
        </div>
      )}

      {isValidID && (
        <div className="flex flex-col items-center justify-center w-full mt-4 gap-2">
          <span className="font-bold text-md">비밀번호 재설정을 위해 이메일을 입력해주세요.</span>
          <Input.InputLabel label="이메일" />
          <Button variant="primary" onClick={handleEmailSend} disabled={isEmailSend.is_send} className="w-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">인증번호 전송</Button>
        </div>
      )}

      {isEmailSend.is_send && (
        <div className="flex flex-col items-center justify-center w-full mt-10 gap-2">
          <Input.InputLabel label="인증번호" />
          <Button variant="primary" onClick={handleValidation} disabled={isEmailSend.valid_time == 0} className="w-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">확인</Button>
          <span className="w-full text-xs text-red-700 text-start">
            인증번호 입력 시간이 {isEmailSend.valid_time}초 남았습니다.
          </span>
        </div>
      )}
    </div>
  );
};

const UserResetInfoModal = ({ isOpen, closeHandler }: IProps) => {
  return (
    <Modal isOpen={isOpen} size="md">
      <Modal.Head>ID/PW 찾기</Modal.Head>
      <Modal.Body>
        <Tabs defaultTab="ID 찾기">
          <Tabs.Tab label="ID 찾기" className="flex">
            <FindID />
          </Tabs.Tab>
          <Tabs.Tab label="PW 찾기" className="flex">
            <ResetPW closeHandler={closeHandler} />
          </Tabs.Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeHandler} variant="primary">
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserResetInfoModal

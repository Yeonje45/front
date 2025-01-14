import React from "react";
import Swal from "sweetalert2";

import Button from "tailwindElement/Button";
import Modal from "tailwindElement/Modal";
import Input from "tailwindElement/Input";

import { CheckPassword, ChangePassword } from 'models/UserInfoModel'

interface IChangePasswordModalProps {
  user_id: string;
};

const ChangePasswordModal = ({user_id}: IChangePasswordModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Record<string, string>>({
    password: "",
    new_password: "",
    check_new_password: "",
  });

  const handleOpen = () => {
    setIsOpen(() => true)
  };

  const handleClose = () => {
    setIsOpen(() => false)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  
  const handleSubmit = async () => {
    // 빈 값 있는 지 확인
    if (Object.values(data).some((value) => value === "")) {
      Swal.fire({
        icon: "error",
        title: "입력되지 않은 값이 있습니다.",
      });
      return;
    }

    if (data.new_password !== data.check_new_password) {
      Swal.fire({
        icon: "error",
        title: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    if (!CheckPassword(data.new_password)) {
      Swal.fire({
        icon: "error",
        title: "PW는 ( A-Z, a-z, 0~9, 특수문자 32개 중 3종류 이상의 조합과 최소 9글자 이상이어야 합니다.",
      });
      return;
    }
    
    const res = await ChangePassword(user_id, data.password, data.new_password) 
    if (!res.success) {
      Swal.fire({
        icon: "error",
        title: res.message,
      });
      return
    }
    await Swal.fire({
      icon: "success",
      title: res.message,
    });
    handleClose();
    return
  }

  return (
    <React.Fragment>
      <Button onClick={handleOpen} variant="secondary">비밀번호 변경</Button>

      <Modal isOpen={isOpen} size="sm">
        <Modal.Head>비밀번호 변경</Modal.Head>
        <Modal.Body>
          <div>
            <label>현재 비밀번호</label>
            <Input name="password" type="password" placeholder="현재 비밀번호" value={data.password} onChange={handleChange} />
          </div>
          <div>
            <label>변경할 비밀번호</label>
            <Input name="new_password" type="password" placeholder="변경할 비밀번호" value={data.new_apssword} onChange={handleChange} />
          </div>
          <div>
            <label>비밀번호 확인</label>
            <Input name="check_new_password" type="password" placeholder="비밀번호 확인" value={data.check_new_password} onChange={handleChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>변경</Button>
          <Button onClick={handleClose}>취소</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ChangePasswordModal;
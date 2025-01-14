import React from "react"
import Swal from "sweetalert2"
import { PencilSquare } from "react-bootstrap-icons"

import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal"
import Input from "tailwindElement/Input"



import { IFilterdProjectModel } from "pages/user/setting/UserManagePage" 
import { ResetPassword } from "models/UserInfoModel" 

interface IUserInfoModalProps {
  user: IFilterdProjectModel
};

const UserInfoModal = ({user}: IUserInfoModalProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(() => true);
  };
  
  const handleClose = () => {
    setIsOpen(() => false);
  };

  // 비밀번호를 초기화 해주는 함수
  const handleResetPassword = async () => {
    const is_confirm = await Swal.fire({
      icon: 'question',
      title: '비밀번호 초기화',
      text: '비밀번호를 초기화 하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소'
    })
    if (!is_confirm.isConfirmed) {
      return
    }

    const res = await ResetPassword(user.user_id);
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message || '비밀번호 초기화에 실패하였습니다.'
      })
      return
    }
    await Swal.fire({
      icon: 'success',
      title: '비밀번호 초기화에 성공하였습니다.',
      text: '비밀번호가 초기화 되었습니다. 임시 비밀번호는 ' + res.data + ' 입니다.'
    })
    handleClose();
  }

  return (
    <React.Fragment>
      <button onClick={handleOpen}>
        <PencilSquare size={20} />
      </button>

      <Modal isOpen={isOpen} size="md">
        <Modal.Head>사용자 정보 조회</Modal.Head>
        <Modal.Body>
          <div className="overflow-x-auto">
            <table className="w-full table table-border">
              <tr>
                <th>이름</th>
                <td>{user.user_name}</td>
              </tr>
              <tr>
                <th>부서</th>
                <td>{user.user_dept}</td>
              </tr>
              <tr>
                <th>회사</th>
                <td>{user.user_company}</td>
              </tr>
              <tr>
                <th>휴대전화</th>
                <td>{user.user_contact[0]}</td>
              </tr>
              <tr>
                <th>연락처</th>
                <td>{user.user_contact[1]}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{user.user_email}</td>
              </tr>
              <tr>
                <th>비밀번호 초기화</th>
                <td>
                  <Button onClick={handleResetPassword}>비밀번호 초기화</Button>
                </td>
              </tr>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

export default UserInfoModal
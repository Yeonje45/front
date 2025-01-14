import { useState } from "react"
import Button from "tailwindElement/Button"
import Input from "tailwindElement/Input"
import Modal from "tailwindElement/Modal"

const RequirementVersionRegisterRequestModal = () => {
  const [show, setShow] = useState<boolean>(false)

	const handleShow = () => {
		setShow(prev => !prev)
	}

	const submitRegisterRequest = async (): Promise<void> => {
		return
	}

  return (
    <div>
			<Button variant="primary" onClick={handleShow}>요구사항 버전 등록 요청</Button>

			<Modal
				isOpen={show}
				size="lg">
				<Modal.Head>요구사항 버전 등록 요청</Modal.Head>
				<Modal.Body>
					<div className="flex flex-col gap-3">
						<p>현재 시험 내용으로 버전(v0.1)을 등록 하시겠습니까?</p>
						<Input.Textarea rows={5} placeholder="설명을 입력하세요."/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={submitRegisterRequest}>확인</Button>
					<Button onClick={handleShow}>취소</Button>
				</Modal.Footer>
			</Modal>
		</div>
  )  
}

export default RequirementVersionRegisterRequestModal
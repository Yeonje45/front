import React from 'react'

import Modal from 'tailwindElement/Modal'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

const HEAD_FIELDS: string[] = ['', '시험 버전', '설명', '연결된 요구사항 버전', '상태', '요청자', '요청일']
const BODY_FIELDS: string[][] = [
	// Index:0 => Input(radio) Field 
	['T.0.1', 'STP 완료', 'R.0.1', '등록 완료', '홍길동', '2024.03.01'],
	['T.0.2', 'STP 완료', 'R.0.2', '등록 완료', '홍길동', '2024.03.01'],
	['T.0.3', 'STP 완료', 'R.0.3', '등록 완료', '홍길동', '2024.03.01'],
	['T.0.4', 'STP 완료', 'R.0.3', '등록 완료', '홍길동', '2024.03.01'],
	['T.0.5', 'STP 완료', 'R.0.3', '등록 완료', '홍길동', '2024.03.01'],
]

const TestPlanVersionImportModal = () => {
	const [show, setShow] = React.useState<boolean>(false)

	const handleShow = () => {
		setShow(prev => !prev)
	}

	const submitImport = async (): Promise<void> => {

		return
	}

	return (
		<div>
			<Button variant="primary" onClick={handleShow}>변경</Button>
			<Modal
				isOpen={show}
				size="lg">
				<Modal.Head>시험 버전 불러오기</Modal.Head>
				<Modal.Body>
					<div className="overflow-y-auto">
						<table className="w-full table-border">
							<thead>
								<tr>
									{HEAD_FIELDS.map((th, index_st) => (
										<th key={index_st}>{th}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{BODY_FIELDS.map((tr, index_tr) => (
									<tr key={index_tr} className="text-center even:bg-gray-100 odd:bg-white">
										<td><Input type="radio" name="selected"/></td>
										{tr.map((td, index_td) => (
											<td key={index_td}>{td}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={submitImport}>불러오기</Button>
					<Button onClick={handleShow}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default TestPlanVersionImportModal

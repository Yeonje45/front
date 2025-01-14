import React from 'react'
import SweetAlert from 'sweetalert2'
import { useSelector } from 'react-redux'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'

import { RequirementModel, UpdateRequirementModel, UpdateRequirement, CheckDuplicateReqNumber } from 'models/RequirementModel'
import { RootState } from 'app/store'

interface IProps {
	editedRequirementModel: RequirementModel
	editRequirementModalState: boolean
	submitEditRequirementSubHandler: () => void
	closeEditRequirementModal: () => void
}

const EditRequirementModal = ({ editedRequirementModel, editRequirementModalState, submitEditRequirementSubHandler, closeEditRequirementModal }: IProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [editedRequirement, setEditedRequirement] = React.useState<UpdateRequirementModel>({
		req_assort_code: editedRequirementModel.req_assort_code,
		req_number: editedRequirementModel.req_number,
		req_title: editedRequirementModel.req_title,
		req_content: editedRequirementModel.req_content,
		req_tvm_code: editedRequirementModel.req_tvm_code,
		req_update_content: "",
		req_id: editedRequirementModel.req_id
	})
	const [isDuplicate, setIsDuplicate] = React.useState<boolean>(editedRequirement.req_number == editedRequirementModel.req_number)

	React.useEffect(() => {
		setEditedRequirement(() => editedRequirementModel)
	}, [editedRequirementModel])

	// 중복 체크는 기존 식별자가 변경되었을 때만 가능하도록 설정해야합니다. 그렇기에 아래와 같은 로직을 추가해줍니다.
	React.useEffect(() => {
		setIsDuplicate(() => editedRequirement.req_number == editedRequirementModel.req_number)
	}, [editedRequirement.req_number])

  // 임시...
  const [updateFiles, setUpdateFiles] = React.useState<FileList | null>(null)
  const [sourceCodeFiles, setSourceCodeFiles] = React.useState<FileList | null>(null)

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target
		setEditedRequirement({
			...editedRequirement,
			[name]: value,
		})
		return
	}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList) setUpdateFiles(fileList)
  }

  const handleSourceCodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList) setSourceCodeFiles(fileList)
  }

	const CheckIsDuplicateHandler = async (): Promise<void> => {
		const res = await CheckDuplicateReqNumber(editedRequirement.req_number, project.project_id)
		if (!res.success) {
			SweetAlert.fire({
				icon: 'error',
				title: '중복 확인 실패',
				text: res.message
			})
			return
		}

		if (res.data) {
			SweetAlert.fire({
				icon: 'error',
				title: '중복 확인 실패',
				text: '중복된 식별자가 있습니다.'
			})
			return
		}

		SweetAlert.fire({
			icon: 'success',
			title: '중복 확인 성공',
			text: '중복된 식별자가 없습니다.'
		})
		setIsDuplicate(() => true)
	}

	const submitEditRequirement = async (): Promise<void> => {
		const res = await UpdateRequirement(editedRequirement)
		if (!res.success) {
			SweetAlert.fire({
				icon: 'error',
				title: '요구사항 수정 실패',
				text: res.message,
			})
			return
		}

		await SweetAlert.fire({
			icon: 'success',
			title: '요구사항 수정 성공',
			text: res.message,
		})
		submitEditRequirementSubHandler()
		return
	}

  return (
		<Modal isOpen={editRequirementModalState} size="lg">
			<Modal.Head>SW요구사항 {'>'} 요구사항 편집</Modal.Head>
			<Modal.Body>
				<div className="flex flex-col items-center gap-4">

					{/* 구분 식별자 */}
					<div className="flex flex-wrap items-center w-full gap-1">
						<div className="flex items-center flex-1 w-full md:w-1/3">
							<label htmlFor="category" className="w-1/6 whitespace-nowrap">
								구분
							</label>
							<Input.Select 
								id="req_assort_code" 
								name="req_assort_code" 
								className="w-full" 
								value={editedRequirement.req_assort_code}
								onChange={handleInputChange}
							>
								<Input.Option value=""></Input.Option>
								<Input.Option value="user_interface_requirements">상태 및 모드 요구사항</Input.Option>
								<Input.Option value="performance">성능 요구사항</Input.Option>
								<Input.Option value="external_interface">외부 인터페이스 요구사항</Input.Option>
								<Input.Option value="internal_interface">내부 인터페이스 요구사항</Input.Option>
								<Input.Option value="state_and_mode_requirements">사용자 인터페이스 요구사항</Input.Option>
								<Input.Option value="internal_data">내부 데이터 요구사항</Input.Option>
								<Input.Option value="safety">안전 요구사항</Input.Option>
								<Input.Option value="security">보안 요구사항</Input.Option>
								<Input.Option value="environment">환경 요구사항</Input.Option>
								<Input.Option value="resources">자원 요구사항</Input.Option>
								<Input.Option value="sw_quality_factors">소프트웨어 품질요소</Input.Option>
								<Input.Option value="restriction">설계 및 구현 제한사항</Input.Option>
								<Input.Option value="personnel_requirements">인원과 관련된 요구사항</Input.Option>
								<Input.Option value="training_requirements">교육훈련과 관련된 요구사항</Input.Option>
								<Input.Option value="military_support_requirements">군수지원 관련된 요구사항</Input.Option>
								<Input.Option value="other">기타 요구사항</Input.Option>
								<Input.Option value="packaging">포장 요구사항</Input.Option>
							</Input.Select>
						</div>
						<div className="flex items-center flex-1 w-full md:w-1/3">
							<label htmlFor="identifier" className="w-1/6 whitespace-nowrap">
								식별자
							</label>
							<Input defaultValue={editedRequirement.req_number} id="req_number" name="req_number" onChange={handleInputChange} />
						</div>
						<div className="flex items-center w-full md:w-1/4">
							<Button className="w-full" onClick={CheckIsDuplicateHandler} disabled={editedRequirement.req_number == editedRequirementModel.req_number}>중복조회</Button>
						</div>
					</div>

					{/* 요구사항명 */}
					<div className="flex flex-col items-start justify-center w-full gap-1">
						<label htmlFor="requirement_name" className="whitespace-nowrap">
							요구사항명
						</label>
						<Input id="req_title" name="req_title" value={editedRequirement.req_title} onChange={handleInputChange} />
					</div>

					{/* 내용 */}
					<div className="flex flex-col w-full">
						<label htmlFor="comment" className="">
							내용
						</label>
						<Input.Textarea id="req_content" name="req_content" rows={7} value={editedRequirement.req_content} onChange={handleInputChange} />
					</div>

					{/* 변경내용 요약 */}
					<div className="flex flex-col items-start justify-center w-full gap-1">
						<label htmlFor="edited_comment" className="whitespace-nowrap">
							변경내용 요약
						</label>
						<Input id="req_update_content" name="req_update_content" value={editedRequirement.req_update_content} onChange={handleInputChange} />
					</div>

					{/* 첨부파일 & 소스코드 */}
					<div className="flex flex-wrap items-center justify-between w-full gap-2">
						{sourceCodeFiles && sourceCodeFiles.length > 0 && (
							<React.Fragment>
								<div className="flex items-center gap-2">
									<label htmlFor="file" className="text-2xl w-72">
										소스코드 ({sourceCodeFiles.length}개)
									</label>
									<Input.File
										name="file"
										id="file"
										multiple
										onChange={handleSourceCodeFileChange}
									/>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="primary">삭제</Button>
									<Button variant="primary">다운로드</Button>
									<Button variant="primary">목록 펴기</Button>
								</div>
								<div className="w-full overflow-y-auto max-h-64">
									<table className="w-full h-full border">
										<thead className="sticky top-0 border">
											<tr className="text-center bg-gray-100">
												<th className="p-2 border">전체 선택</th>
												<th className="p-2 border">파일명</th>
												<th className="p-2 border">파일 크기</th>
												<th className="p-2 border">첵섬</th>
												<th className="p-2 border">생성일자</th>
												<th className="p-2 border">라인수</th>
												<th className="p-2 border">기능 설명</th>
											</tr>
										</thead>
										<tbody>
											{updateFiles &&
												updateFiles.length > 1 &&
												Array.from(updateFiles).map((updateFileItem, index) => (
													<tr key={index} className="text-center border">
														<td className="p-2 border">
															<Input.Checkbox />
														</td>
														<td className="p-2 border">{updateFileItem.name}</td>
														{/* Byte로 표기 */}
														<td className="p-2 border">{updateFileItem.size} Byte</td>
														<td className="p-2 border"></td>
														<td className="p-2 border">
															{new Date(updateFileItem.lastModified).toLocaleString()}
														</td>
														<td className="p-2 border"></td>
														<td className="p-2 border"></td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</React.Fragment>
						)}
						<div className="flex items-center gap-2">
							<label htmlFor="file" className="text-2xl w-72">
								첨부파일
							</label>
							<Input.File name="file" id="file" multiple onChange={handleFileChange} />
						</div>
						<div className="flex items-center gap-2">
							<Button variant="primary">삭제</Button>
							<Button variant="primary">다운로드</Button>
							<Button variant="primary">목록 펴기</Button>
						</div>
					</div>

					{/* 시험 검증 방법 */}
					<div className="flex flex-wrap items-center w-full gap-4">
						<div className="flex items-center w-full md:flex-1">
							<label htmlFor="test_category" className="w-1/2">
								시험/검증방법
							</label>
							<Input.Select 
								id="req_tvm_code" 
								name="req_tvm_code" 
								className="w-full" 
								value={editedRequirement.req_tvm_code} 
								onChange={handleInputChange}
							>
								<Input.Option value=""></Input.Option>
								<Input.Option value="tvm_demo">데모</Input.Option>
								<Input.Option value="tvm_test">시험</Input.Option>
								<Input.Option value="tvm_inspection">검사</Input.Option>
								<Input.Option value="tvm_analysis">분석</Input.Option>
								<Input.Option value="tvm_specific">특수</Input.Option>
							</Input.Select>
						</div>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" disabled={!isDuplicate} onClick={submitEditRequirement}>
					확인
				</Button>
				<Button variant="secondary" onClick={closeEditRequirementModal}>취소</Button>
			</Modal.Footer>
		</Modal>
  )
}

export default EditRequirementModal

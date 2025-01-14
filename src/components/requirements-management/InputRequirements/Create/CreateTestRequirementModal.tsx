import React from 'react'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'

import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import Input from 'tailwindElement/Input'

import { CreateTestRequirement, CreateTestRequirementModel, CheckDuplicateReqNumber } from 'models/RequirementModel'
import { RootState } from 'app/store'

interface IProps {
	isOpen: boolean
	req_group_code: string
	handleCreateTestRequirementModalState: () => void
	req_classification_code: string
	getRequirementsHandler: () => void
}

const CreateTestRequirementModal = ({ isOpen, req_group_code, handleCreateTestRequirementModalState, getRequirementsHandler, req_classification_code }: IProps) => {
	const project = useSelector((state: RootState) => state.project).project

	const [requirementInpState, setRequirementInpState] = React.useState<CreateTestRequirementModel>({
		req_group_code: req_group_code,
		req_assort_code : "", // 요구사항 분류 PK
		req_number: "",// 요구사항 식별자
		req_title: "", // 요구사항 제목
		req_content: "", // 요구사항 내용
	})	
	const [updateFiles, setUpdateFiles] = React.useState<File[]>()
	const [isDuplicate, setIsDuplicate] = React.useState<boolean>(false)

	// 추가 모달 상태 변경 시에 데이터 초기화
	React.useEffect(() => {
		if (!isOpen) {
			setRequirementInpState({
				req_group_code: req_group_code,
				req_assort_code : "", // 요구사항 분류 PK
				req_number: "",// 요구사항 식별자
				req_title: "", // 요구사항 제목
				req_content: "", // 요구사항 내용
			})
			setUpdateFiles([])
			setIsDuplicate(false)
		}
	}, [isOpen])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = e.target.files
		let files: File[] = []

		if (fileList) {
			for (let i = 0; i < fileList.length; i++) {
				files.push(fileList.item(i) as File)
			}
		}

		setUpdateFiles(files)
	}

	// 요구사항 식별자 중복 체크
	const handleDuplicateCheck = async (): Promise<void> => {
		if (!requirementInpState.req_number) {
			return
		}

		const res = await CheckDuplicateReqNumber(requirementInpState.req_number, project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '중복 확인 실패',
				text: res.message
			})
			return
		}

		if (res.data) {
			Swal.fire({
				icon: 'error',
				title: '중복 확인 실패',
				text: '중복된 식별자가 있습니다.'
			})
			return
		}

		Swal.fire({
			icon: 'success',
			title: '중복 확인 성공',
			text: '중복된 식별자가 없습니다.'
		})
		setIsDuplicate(() => true)
		return
	}

	const changeRequirementInpStateHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.currentTarget

		setRequirementInpState(() => {
			return {
				...requirementInpState,
				[name]: value
			}
		})
	}

	const submitCreateTestRequirement = async (): Promise<void> => {
		if (requirementInpState.req_assort_code === "" || requirementInpState.req_number === "" || requirementInpState.req_title === "" || requirementInpState.req_content === "") {
			Swal.fire({
				icon: 'error',
				title: '입력 오류',
				text: '모든 항목을 입력해주세요.'
			})
			return
		}

		// 초기화 된 데이터를 다시 초기화합니다.
		requirementInpState.req_group_code = req_group_code

		const res = await CreateTestRequirement(requirementInpState, req_classification_code)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 추가 실패',
				text: res.message
			})
			return
		}

		Swal.fire({
			icon: 'success',
			title: '요구사항 추가 성공',
			text: res.message
		})
		getRequirementsHandler()
		handleCreateTestRequirementModalState()
		return
	}
	return (
		<Modal isOpen={isOpen} size="lg">
			<Modal.Head>SW 설계 요구사항  {'>'} 요구사항 추가</Modal.Head>
			<Modal.Body>
				<div className="flex flex-col items-center gap-4">
					{/* 구분 식별자 */}
					<div className="flex flex-wrap items-center w-full gap-1">
						<div className="flex items-center flex-1 w-full md:w-1/3">
							<label htmlFor="req_assort_code" className="w-1/6 whitespace-nowrap">
								구분
							</label>
							<Input.Select 
								id="req_assort_code" 
								name="req_assort_code" 
								className="w-full" 
								value={requirementInpState.req_assort_code}
								onChange={changeRequirementInpStateHandler}
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
						{/* 식별자 */}
						<div className="flex items-center flex-1 w-full md:w-1/3">
							<label htmlFor="req_number" className="w-1/6 whitespace-nowrap">
								식별자
							</label>
							<Input
								id="req_number"
								name="req_number"
								autoComplete="off"
								value={requirementInpState.req_number}
								onChange={changeRequirementInpStateHandler}
							/>
						</div>
						<div className="flex items-center w-full md:w-1/4">
							<Button className="w-full" onClick={handleDuplicateCheck}>중복조회</Button>
						</div>
					</div>

					{/* 요구사항 제목 */}
					<div className="flex flex-col items-start justify-center w-full gap-1">
						<label htmlFor="req_title" className="whitespace-nowrap">
							요구사항 제목
						</label>
						<Input 
							id="req_title" 
							name="req_title" 
							value={requirementInpState.req_title} 
							onChange={changeRequirementInpStateHandler}
						/>
					</div>

					{/* 내용 */}
					<div className="flex flex-col w-full">
						<label htmlFor="req_content" className="">
							내용
						</label>
						<Input.Textarea 
							rows={7} 
							id="req_content" 
							name="req_content" 
							value={requirementInpState.req_content} 
							onChange={changeRequirementInpStateHandler}
						/>
					</div>

					{/* 첨부파일 & 소스코드 */}
					<div className="flex flex-wrap items-center justify-between w-full gap-2">
						{updateFiles && updateFiles.length > 1 && (
							<React.Fragment>
								<div className="flex items-center gap-2">
									<label htmlFor="file" className="text-2xl min-w-48">
										소스코드
									</label>
									<Input.File
										name="file"
										id="file"
										multiple
										onChange={() => {}}
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
												<th className="p-2 border">
													<div className="flex items-center justify-center">
														<p>파일명</p>
													</div>
												</th>
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
							<label htmlFor="file" className="text-2xl min-w-48">
								첨부파일 { updateFiles && `${updateFiles.length}개` }
							</label>
							<Input.File name="file" id="file" multiple onChange={handleFileChange} />
						</div>
						<div className="flex items-center gap-2">
							<Button variant="primary">삭제</Button>
							<Button variant="primary">다운로드</Button>
							<Button variant="primary">목록 펴기</Button>
						</div>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" disabled={!isDuplicate} onClick={submitCreateTestRequirement}>추가</Button>
				<Button variant="secondary" onClick={handleCreateTestRequirementModalState}>취소</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateTestRequirementModal

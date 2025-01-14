import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'

import Container from 'tailwindElement/Container'
import Input from 'tailwindElement/Input'
import Modal from 'tailwindElement/Modal'
import Button from 'tailwindElement/Button'

import { ExportRequirementList } from "models/RequirementModel"
import { RootState } from 'app/store'

const InputRequirementExportElement = () => {
	const project = useSelector((state: RootState) => state.project).project

  const [exportFileState, setExportFileState] = useState<boolean>(false)

	const [exportRequirement, setExportRequirement] = useState<string>('all') // 요구사항 선택
	const [exportExtension, setExportExtension] = useState<string>('xlsx') // 추출할 파일 형식 선택

	useEffect(() => {
		setExportRequirement(() => 'all')
		setExportExtension(() => 'xlsx')
	}, [exportFileState])

  const handleExportFileModal = () => {
    setExportFileState(prev => !prev)
  }

	const handleExportRequirement = (e: React.ChangeEvent<HTMLSelectElement>) => {
		switch(e.target.value) {
			case 'all':
				setExportExtension(() => 'xlsx')
				break
			case 'system':
				setExportExtension(() => 'xlsx')
				break
			case 'test':
				setExportExtension(() => 'xlsx')
				break
		}
		setExportRequirement(() => e.target.value)
		setExportExtension(() => 'xlsx')
	}

	const handleExportExtension = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setExportExtension(() => e.target.value)
	}
	
	const submitExportFileModal = async () => {
		if (!project) {
			return
		}
		const res = await ExportRequirementList({project_id: project.project_id})
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 추출 실패',
				text: res.message,
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '요구사항 추출 성공',
			text: '요구사항 추출이 완료되었습니다.',
		})
		handleExportFileModal();
		return 
	}
	
  return (
		<div>
			<Button variant="primary" className="rounded-md" onClick={handleExportFileModal}>내보내기</Button>

			<Modal isOpen={exportFileState} size="sm">
				<Modal.Head>추출 항목 선택</Modal.Head>
				<Modal.Body>
					<Container fluid className="py-2">
						<div className="flex flex-wrap items-center justify-center">
							<div className="w-3/4 mx-2 mb-3">
								<Input.SelectGroup className="flex flex-wrap items-center w-full">
									<label htmlFor="requirement_box" className="w-1/4">
										요구사항 선택
									</label>
									<Input.Select id="requirement_box" className="w-3/4" onChange={handleExportRequirement} disabled>
										<Input.Option value="all">전체</Input.Option>
										<Input.Option value="system">체계 요구사항</Input.Option>
										<Input.Option value="sw">SW 요구사항</Input.Option>
										<Input.Option value="design">SW 설계 요구사항</Input.Option>
										<Input.Option value="test">SW 테스트 요구사항</Input.Option>
									</Input.Select>
								</Input.SelectGroup>
							</div>
							<div className="w-3/4 mx-2 mb-3">
								<Input.SelectGroup className="flex flex-wrap items-center w-full">
									<label htmlFor="exportFileExtensions_box" className="w-1/4">
										추출할 파일 형식 선택
									</label>
									{/* 요구사항 선택이 [전체, 체계, 테스트] 이라면 엑셀만 나와야합니다.  */}
									<Input.Select id="exportFileExtensions_box" className="w-3/4" onChange={handleExportExtension} disabled>
										<Input.Option value="xlsx">엑셀</Input.Option>
									</Input.Select>
								</Input.SelectGroup>
							</div>
						</div>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitExportFileModal}>확인</Button>
					<Button variant="secondary" onClick={handleExportFileModal}>닫기</Button>
				</Modal.Footer>
			</Modal>
		</div>
  )
}

export default InputRequirementExportElement

import React from 'react'
import SweetAlert from 'sweetalert2'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Modal from "tailwindElement/Modal";
import Button from 'tailwindElement/Button'

import InputRequirementWizardModal from './InputRequirementWizardModal'

import { ImportRequirements, SendImportRequirementsFile } from "models/RequirementModel";
import { RootState } from 'app/store'

interface IProps {
}

const InputRequirementSelectFileElement = ({}: IProps) => {
	const navigate = useNavigate()
	const project = useSelector((state: RootState) => state.project).project

  const [fileState, setFileState] = React.useState<boolean>(false) // 불러오기 
  const [fileWizardState, setFileWizardState] = React.useState<boolean>(false) // 불러오기 마법사

	const [importFile, setImportFile] = React.useState<File | null>(null)
	const [importData, setImportData] = React.useState<string[][]>()

	React.useEffect(() => {
		if (fileState) {
			setFileWizardState(() => false)
			setImportFile(() => null)
		}
	}, [fileState])

	// 파일 업로드 시에 사용되는 함수 
	const handleFileUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files) {
			setImportFile(files[0])
		}
		return
	}

  const handleOpenFileSelectModal = () => {
    setFileState(prev => !prev)
		setFileWizardState(() => false)
		setImportFile(() => null)
  }

  const submitFileSelectModal = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		// 파일 유효성 검사 ( 파일 이름, 파일 용량 )
		if (!importFile) {
			SweetAlert.fire({
				icon: 'error',
				title: '파일을 선택해주세요.'
			})
			return 
		}

		// 파일 유효성 검사 ( 파일 확장자 )
		// -> .hwp, .xlsx 확장자만 허용합니다.
		if (importFile.name.split('.').pop() !== 'hwp' && importFile.name.split('.').pop() !== 'xlsx') {
			SweetAlert.fire({
				icon: 'error',
				title: '지원하지 않는 파일 형식입니다.'
			})
			return
		}

		const formBody = new FormData()
		formBody.append('file', importFile)
		const response = await ImportRequirements(project.project_id, formBody)

		if (!response.success) {
			SweetAlert.fire({
				icon: 'error',
				title: '요구사항 불러오기 실패',
				text: response.message
			})
			return
		}

		if (!response || !response.data) {
			SweetAlert.fire({
				icon: 'error',
				title: '요구사항 불러오기 실패',
				text: '요구사항 데이터가 존재하지 않습니다.'
			})
			return
		}

		setImportData(() => response.data!)
    setFileState(() => false)
    setFileWizardState(() => true)
    return 
  }

  const submitFileWizardModal = async () => {
    if (!importFile) {
      SweetAlert.fire({
        icon: 'error',
        title: '파일을 찾을 수 없습니다.',
        text: '파일을 다시 선택해주세요.',
      })
		  setFileState(() => false)
      setFileWizardState(() => false)
		  setImportFile(() => null)
		  setImportData(() => undefined)
      return
    }
    const res = await SendImportRequirementsFile({project_id: project.project_id, file: importFile})
    if (!res.success) {
      SweetAlert.fire({
        icon: 'error',
        title: '요구사항 불러오기 실패',
        text: res.message
      })
      setFileState(() => false)
      setFileWizardState(() => false)
      setImportFile(() => null)
      setImportData(() => undefined)
      return
    }

		SweetAlert.fire({
			icon: 'success',
			title: '요구사항 불러오기 완료',
			text: '요구사항 불러오기가 완료되었습니다.'
		})

		setFileState(() => false)
    setFileWizardState(() => false)
		setImportFile(() => null)
		setImportData(() => undefined)
		// 새로 고침 시작 
		navigate(0)
    return
  }

  const cancleFileWizardModal = () => {
		setFileState(() => false)
    setFileWizardState(() => false)
		setImportFile(() => null)
		setImportData(() => undefined)
    return
  }

  return (
    <div>
			<Button variant="primary" className="rounded-md" onClick={handleOpenFileSelectModal}>불러오기</Button>

			{/* 요구사항 불러오기 */}
			<Modal
				size="md"
				isOpen={fileState}>
				<Modal.Head>요구사항 불러오기</Modal.Head>
				<Modal.Body>
					<label className="flex items-center border border-gray-300 cursor-pointer" htmlFor="file">
						<div className="p-1.5 px-3 bg-gray-100 rounded-sm border-e border-gray-300">파일 선택</div>
						<span className="ml-2">{ importFile ? importFile.name : <p>파일 업로드</p> }</span>
					</label>
					<input type="file" className="hidden" name="file" id="file" accept=".hwp, .xlsx" onChange={handleFileUploadHandler}/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitFileSelectModal}>
						확인
					</Button>
					<Button variant="secondary" onClick={handleOpenFileSelectModal}>
						닫기
					</Button>
				</Modal.Footer>
			</Modal>

      {/* 요구사항 불러오기 마법사 */}
      <Modal isOpen={fileWizardState} size="lg">
        <Modal.Head>
          <h3>요구사항 파일 마법사</h3>
        </Modal.Head>
        <Modal.Body>
					{ importData && importData.length &&  
						<InputRequirementWizardModal 
							tableHead={importData[0]}
							tableBody={importData.slice(1)}
						/>
					}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitFileWizardModal}>
            완료
          </Button>
          <Button variant="primary" onClick={cancleFileWizardModal}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default InputRequirementSelectFileElement

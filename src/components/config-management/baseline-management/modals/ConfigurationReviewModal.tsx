import React from 'react'
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Input from 'tailwindElement/Input';

import { DownloadConfigurationTemplateFile } from 'models/ConfigManagement';

interface IConfigurationReviewModalProps {
  handleApproval: (conf_version_approval_comment: string, is_ccb: boolean, config_ccb_file: File | null) => void
  handleReject: (conf_version_approval_comment: string, is_ccb: boolean, config_ccb_file: File | null) => void
}

// 형상변경 승인 요청 모달 / ccb 상태 
// status가 null이 아니면서 file 2개가 null 상태가 아니면 보여지는 UI
const ConfigurationReviewModal = ({handleApproval, handleReject}: IConfigurationReviewModalProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const [isCCB, setIsCCB] = React.useState<boolean>(false)
	const [file, setFile] = React.useState<File | null>(null)
	const [data, setData] = React.useState<Record<string, string>>({
    conf_version_approval_comment: ''
	})
  const [fileType, setFileType] = React.useState<string>('single') // single, multiple [ 단일/다수 ]

	const handleOpen = () => {
		setData(() => ({
			conf_version_approval_comment: '',
		}))
		setIsCCB(() => false);
		setFile(() => null);
		setFileType(() => 'single');
		setIsOpen(() => true)
	}

	const handleClose = () => {
		setIsOpen(() => false)
	}
  
  {/* ccb 체크박스 클릭 시에 */}
  const handleCCB = () => {
    setIsCCB((prev) => !prev)
  }
	
  {/* 의견 입력에 대한 이벤트 핸들링 함수 */}
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	{/* file 입력에 대한 핸들 함수 */}
	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files && files.length > 0) {
			setFile(() => files[0])
		}
	}
  
  // 단일/다수 radio 버튼 클릭 시에
  const handleCheckFileType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFileType(() => value)
  }

  // 형식 다운로드 함수
  const handleDownloadTemplate = async () => {
    const fetchType = fileType === 'single' ? 'ccb_file_single_template' : 'ccb_file_multi_template'
    const res = await DownloadConfigurationTemplateFile(fetchType)
    if (!res.success) {
      Swal.fire({
        icon: 'error',
        title: '다운로드 실패',
        text: res.message,
      })
      return
    };
    Swal.fire({
      icon: 'success',
      title: '다운로드 성공',
      text: '다운로드가 완료되었습니다.',
    })
    return
  }

  // 승인 시에
  const submitApprovalHandler = () => {
    if (!data['conf_version_approval_comment']) {
      Swal.fire({
        icon: 'error',
        title: '의견을 작성해주세요.',
        text: '의견을 작성해주세요.',
      })
      return
    }
    handleApproval(data['conf_version_approval_comment'], isCCB, file)
    handleClose()
  }

  // 반려 시에
  const submitRejectHandler = () => {
    if (!data['conf_version_approval_comment']) {
      return
    }
    handleReject(data['conf_version_approval_comment'], isCCB, file)
    handleClose()
  }

  return (
		<React.Fragment>
			<Button onClick={handleOpen}>승인 요청 검토</Button>

			<Modal isOpen={isOpen} size="md">
				<Modal.Head>형상 변경 승인 요청 검토</Modal.Head>

				<Modal.Body>
          <div className="flex items-center justify-start gap-2">
            <label htmlFor="ccb">CCB 진행 필요</label>
            <input
              type="checkbox"
              id="ccb"
              name="ccb"
              onChange={handleCCB}
              checked={isCCB}
              className="mt-[1px]"
            />
          </div>
          {
            isCCB && 
            <div className="flex items-center justify-start gap-2">
              <label htmlFor="single">단일 안건</label>
              <input
                type="radio"
                id="single"
                name="fileType"
                value="single"
                checked={fileType === 'single'}
                onChange={handleCheckFileType}
              />
              <label htmlFor="multiple">다수 안건</label>
              <input
                type="radio"
                id="multiple"
                name="fileType"
                value="multiple"
                checked={fileType === 'multiple'}
                onChange={handleCheckFileType}
              />
            </div>
          }
          { // ccb가 체크 상태라면 
            isCCB &&
            <div>
              <div className="space-x-2 mb-3">
                <span className="text-lg">형상통제심의 의결서({fileType == 'single' ? '단일' : '다수'})</span>
                <Button onClick={handleDownloadTemplate}>형식다운</Button>
                <Button>
                  <label htmlFor="file" className="cursor-pointer">업로드</label>
                </Button>
              </div>
              <Input.File name="file" id="file" onChange={handleChangeFile} />
            </div>
          }

          {/* 기본적으로 보여지는 UI */}
					<div>
						<label htmlFor='conf_version_approval_comment'>의견 작성</label>
						<Input.Textarea
							name="conf_version_approval_comment"
							value={data['conf_version_approval_comment']}
							onChange={handleChange}
							rows={5}
              placeholder="의견을 작성해주세요."
						/>
						</div>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={submitApprovalHandler}>승인</Button>
					<Button onClick={submitRejectHandler}>반려</Button>
					<Button onClick={handleClose}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
  )
}

export default ConfigurationReviewModal 

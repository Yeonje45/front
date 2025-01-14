import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

interface IAddPanelProps {
	modalState: boolean; // useEffect를 사용하여 modalState가 변경되면 초기화

	src_version_name?: string;
	file?: File;
	include_children_folder?: boolean;
	src_version_content?: string;
	submitHandler: (data: Record<string, string | boolean | File>) => Promise<void>
}

const AddPanel = ({ modalState, src_version_name, file, include_children_folder, src_version_content, submitHandler }: IAddPanelProps) => {
	const [submitData, setSubmitData] = React.useState<Record<string, string | boolean | File>>({
		src_version_name: '',
		file: '', // must be file or folder ( name ) 
		include_children_folder: false,
		src_version_content: '',
	})

	/** 컴포넌트 마운트 시에 */
	React.useEffect(() => {
		if (modalState) {
			setSubmitData(() => ({
				src_version_name: src_version_name || '',
				file: file || '',
				include_children_folder: include_children_folder || false,
				src_version_content: src_version_content || '',
			}))
			return
		} else {
			setSubmitData(() => ({
				src_version_name: '',
				file: '',
				include_children_folder: false,
				src_version_content: '',
			}))
		}
	}, [modalState])

	/** 문자열 형식의 입력 값을 다룹니다. */
	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		if (name === 'include_children_folder') {
			setSubmitData((prev) => ({
				...prev,
				[name]: !prev.include_children_folder,
			}))
			return
		}

		setSubmitData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	/** 파일 또는 폴더 경로 ( 파일 ) 입력 값을 다룹니다. */
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, files } = event.target;
		if (!files) {
			return
		}
		setSubmitData((prev) => ({
			...prev,
			[name]: files[0],
		}))
	}

	/** 좌측 패널 저장 버튼 클릭 시에 */
	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		await submitHandler(submitData)
	}
	
  return (
		<div className="flex flex-wrap w-full gap-2">
			<div className="block w-full lg:flex-1">
				<PanelContainer>
					<PanelHeader title="소스코드 등록" />
					<PanelBody>
						<div className="flex flex-col flex-wrap w-full gap-1">
							{/* 소스 코드 명칭 */}
							<div className="mb-3">
								<label htmlFor="src_version_name">소스코드 명칭</label>
								<Input 
									id="src_version_name" 
									name="src_version_name" 
									value={submitData['src_version_name'] as string}
									onChange={handleChange}/>
							</div>

							{/* 파일 또는 폴더 경로 선택 */}
							<label htmlFor="file">파일 또는 폴더 경로 선택</label>
							<div className="flex flex-col p-1 mb-3 border-2 rounded-md">
								<div className="flex gap-1">
									<Input.File 
										className="w-5/6" 
										id="file" 
										name="file"
										accept=".zip"
										onChange={handleFileChange} />
									<label htmlFor="file" className="w-1/6 flex justify-center items-center p-1.5 px-3 rounded-lg bg-gray-700 text-white cursor-pointer">불러오기</label>
								</div>
								<div className="flex flex-wrap items-center justify-start gap-1">
									<Input.Checkbox 
										id="include_children_folder"
										name="include_children_folder"
										checked={submitData['include_children_folder'] as boolean}
										onChange={handleChange} />
									<label htmlFor="include_children_folder">하위 폴더 포함</label>
								</div>
							</div>

							{/* 설명 */}
							<div className="mb-3">
								<label htmlFor="src_version_content">설명</label>
								<Input.Textarea 
									rows={6}
									id="src_version_content" 
									name="src_version_content"
									value={submitData['src_version_content'] as string}
									onChange={handleChange} />
							</div>

							{/* 저장 */}
							<Button variant="primary" onClick={handleSubmit}>저장</Button>
						</div>
					</PanelBody>
				</PanelContainer>
			</div>
		</div>
  )
}

export default AddPanel

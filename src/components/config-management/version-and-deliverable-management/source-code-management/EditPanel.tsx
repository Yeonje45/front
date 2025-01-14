import React from 'react';
import Swal from 'sweetalert2';

import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

import { 
	IGetSourceCodeManagementTableEditFileListDataModel,
} from 'models/ConfigManagement'

interface IEditPanelProps {
	modalState: boolean; // useEffect를 사용하여 modalState가 변경되면 초기화

	src_version_name: string;
	src_version_content: string;
	files: IGetSourceCodeManagementTableEditFileListDataModel[] | null
	filterDelteFiles: (filteredFiles: number[]) => void
	submitHandler: (filteredFiles: number[], editedComment: { src_file_id: number, src_file_content: string }[] | null) => Promise<void>
}

const EditPanel = ({modalState, src_version_name, src_version_content, files, filterDelteFiles, submitHandler}:IEditPanelProps) => {
	const [submitData, setSubmitData] = React.useState<Record<string, string>>({
		src_version_name: '',
		file: '', // must be file or folder ( name ) 
		src_version_content: '',
	})
	const [seletedDeleteFiles, setSelectedDeleteFiles] = React.useState<number[]>([]); // 임시 체크 박스 ID 저장
	const [deleteFiles, setDeleteFiles] = React.useState<number[]>([]); // 실제 삭제할 파일 ID 저장
	const [editedFilesComment, setEditedFilesComment] = React.useState<{ src_file_id: number, src_file_content: string }[] | null>(null);

	/** 컴포넌트 마운트 시에 */
	React.useEffect(() => {
		if (modalState) {
			setSubmitData(() => ({
				src_version_name: src_version_name || '',
				src_version_content: src_version_content || '',
			}))
			setEditedFilesComment(() => {
				if (!files) return null
				const comments = files.map((file) => ({ src_file_id: file.src_file_id, src_file_content: file.src_file_content }))
				return comments
			})
			return
		}
		// false => Null 
		setSubmitData(() => ({
			src_version_name: '',
			file: '',
			src_version_content: '',
		}))
		setSelectedDeleteFiles(() => [])
		setDeleteFiles(() => [])
		setEditedFilesComment(() => null)
	}, [modalState, files])

	/** 문자열 형식의 입력 값을 다룹니다. */
	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setSubmitData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	/** 테이블의 checkbox 체크 시에 특정 행의 id 추가 및 filter*/
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id } = event.target

		setSelectedDeleteFiles((prev) => {
			if (prev.includes(+id)) {
				return prev.filter((file) => file !== +id)
			} else {
				return [...prev, +id]
			}
		})
		return
	}

	/** 기능 설명 입력 시에 ID, Comment를 저장 */
	const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let { id, value } = event.target;

		setEditedFilesComment((prev) => {
			if (!prev) return [{ src_file_id: +id, src_file_content: value }];

			// 상태를 복사하여 새로운 배열로 만들어 불변성을 유지
			const updatedComments = [...prev];
			const index = updatedComments.findIndex((comment) => comment.src_file_id === +id);

			if (index === -1) {
				return [...updatedComments, { src_file_id: +id, src_file_content: value }];
			}

			// 새로운 객체로 수정
			updatedComments[index] = { ...updatedComments[index], src_file_content: value };

			return updatedComments;
		});
	};

	const handleDeleteSubmit = () => {
		if (seletedDeleteFiles.length === 0) {
			Swal.fire({
				icon: 'warning',
				title: '경고',
				text: '삭제할 파일을 선택해주세요.'
			})
			return
		}

		// selectedDeleteFiles를 Append, push 하는 방식으로 추가 
		setDeleteFiles((prev) => [...prev, ...seletedDeleteFiles])

		// editedFilesComment에서도 seletedDeleteFiles id로 작성 된 comment를 삭제
		setEditedFilesComment((prev) => {
			if (!prev) return null
			// 현재 filter을 하면 데이터가 삭제는 되나 comment가 밀리는 문제가 있음, 0번째 인덱스 삭제 시에 1번째 인덱스에 기존 0번째 인덱스 데이터가 들어감
			// 따라서, filter를 사용하여 삭제된 데이터를 제외하고 다시 저장

			// 아래는 해결 코드
			const filteredComment = prev.filter((comment) => !seletedDeleteFiles.includes(comment.src_file_id))
			return filteredComment
		})

		// filterDelteFiles를 사용하여 삭제된 파일을 제거
		filterDelteFiles(seletedDeleteFiles)

		// selectedDeleteFiles 초기화
		setSelectedDeleteFiles(() => [])
	}

	const handleSubmit = async () => {
		submitHandler(deleteFiles, editedFilesComment)
	}

  return (
		<div className="flex flex-wrap w-full gap-2">
			<div className="block w-full">
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
									disabled
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
										disabled
										accept=".zip" />
									<label htmlFor="file" className="w-1/6 flex justify-center items-center p-1.5 px-3 rounded-lg bg-gray-700 text-white cursor-pointer">불러오기</label>
								</div>
								<div className="flex flex-wrap items-center justify-start gap-1">
									<Input.Checkbox 
										id="include_children_folder"
										name="include_children_folder"
										disabled
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
									disabled
									onChange={handleChange} />
							</div>
						</div>
					</PanelBody>
				</PanelContainer>
			</div>

			<div className="block w-full">
				<PanelContainer>
					<PanelHeader title="파일 목록">
						<div className="flex flex-wrap items-center justify-end gap-3">
							<Button variant='primary' onClick={handleDeleteSubmit}>삭제</Button>
						</div>
					</PanelHeader>
					<PanelBody className="overflow-y-auto max-h-[500px]">
						<div className="flex flex-col flex-wrap w-full h-full overflow-y-auto gap-1">
							<table className="table w-full table-border">
								<thead className="whitespace-nowrap">
									<tr>
										<th>선택</th>
										<th>파일명</th>
										<th>파일경로</th>
										<th>크기(Byte)</th>
										<th>첵섬</th>
										<th>생성일자</th>
										<th>라인수</th>
										<th>기능 설명</th>
									</tr>
								</thead>
								<tbody>
									{ files && files.map((file, index) => (
										// deleteFiles 열에 포함되어 있으면 삭제 hidden
										<tr key={index} className={`${deleteFiles.includes(file.src_file_id) ? 'hidden' : ''}`}>
											<td>
												<input 
													type="checkbox" 
													id={file.src_file_id.toString()} 
													checked={seletedDeleteFiles.includes(file.src_file_id)}
													onChange={handleCheckboxChange}/>
											</td>
											<td>{file.src_file_name}</td>
											<td>{file.src_file_path}</td>
											<td>{file.src_file_byte}</td>
											<td>{file.src_file_checksum.slice(0, 8)}</td>
											<td>{new Date(file.src_file_create_at).toLocaleDateString()}</td>
											<td>{file.src_file_line}</td>
											<td>
												<input 
													className="w-full h-full border-0 border-none focus:outline-none"
													id={file.src_file_id.toString()}
													value={editedFilesComment?.find((comment) => comment.src_file_id === file.src_file_id)?.src_file_content || ''}
													onChange={handleCommentChange} />
											</td>
										</tr>
									)) }
								</tbody>
							</table>
						</div>
					</PanelBody>
				</PanelContainer>
			</div>
			{/* 저장 */}
			<div className="flex items-center justify-end w-full m-3">
				<Button variant="primary" onClick={handleSubmit}>저장</Button>
			</div>
		</div>
  )
}

export default EditPanel

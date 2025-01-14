import { useEffect, useState } from 'react'

import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal' 
import Input from 'tailwindElement/Input' 
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { useLocation } from 'react-router-dom'

export interface IReqVersion {
	baseline_id: number
	baseline_number: string
}

interface IIdentification {
	req_number: string
	req_title: string
}

interface IProps {
	reqVersionHandler: (reqVersion: IReqVersion) => void
}

const RequirementImportModal = ({ reqVersionHandler}: IProps) => {
  const location = useLocation()
  const project_id = useSelector((state: RootState) => state.project).project.project_id

  const searchParams = new URLSearchParams(location.search)
  const step = searchParams.get('step')

	const [isOpen, setIsOpen] = useState<boolean>(Boolean)

	// 베이스라인 목록
	const [reqVersionList, setReqVersionList] = useState<IReqVersion[]>([])
  // 선택한 베이스라인
	const [selectedReqVersion, setSelectedReqVersion] = useState<IReqVersion | null>(null)

	// 요구사항 버전 식별자 목록
	const [identificationList, setIdentificationList] = useState<IIdentification[]>([])	

	// 요구사항 버전 모달 열기 닫기
	const handleRequirementImportModal = () => {
		setIsOpen(!isOpen)
	}

	const submitRequirementImport = async (): Promise<void> => {
		if(selectedReqVersion) {
			reqVersionHandler(selectedReqVersion)
			setIsOpen(false)
			
			Swal.fire({
				icon: 'success',
				title: '요구사항 버전 불러오기 성공',
			})

		}
	}

	const handleReqVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target
		
		setSelectedReqVersion(reqVersionList.find((reqData) => reqData.baseline_id === parseInt(value)) || null)		
	}

	const getReqVersionListHandler = async () => {
		try {
			await AccessAxios.post('/integration/r-version/', {
				project_id: project_id
			}).then((res) => {
				if(res.status == 200) {					
					if(res.data.data.length){
						setReqVersionList(res.data.data)
					}
					else {
						setReqVersionList([])

						Swal.fire({
							icon: 'info',
							title: '요구사항 버전이 없습니다.',
							html: `요구사항 편집 페이지에서 요구사항 버전 등록 확인 후 다시시도 해주세요.<br/><p style="color:red;">※ 승인 완료된 요구사항 버전만 표시됩니다. ※</p>`,
							confirmButtonText: '확인',
							allowOutsideClick: false,
						}).then((res) => {
							if(res.isConfirmed) {
								window.location.href = `/requirements-management/input-requirement?project_id=${project_id}&step=${step}`
							}
						})
					}
				}
			})
		}
		catch(e:any) {
			console.error(e)

			Swal.fire({
				icon: 'error',
				title: '요구사항 버전 불러오기 실패',
			})
		}
	}

	const getIdentificationListHandler = async () => {
		try {
		  await AccessAxios.get(`/integration/r-version/?baseline_id=${selectedReqVersion?.baseline_id}`).then((res) => {
				if(res.status === 200) {
					setIdentificationList(res.data.data.sort((a:IIdentification, b:IIdentification) => a.req_number > b.req_number ? 1 : -1))
				}
			})
		}
		catch(e:any) {
			console.error(e)

			Swal.fire({
				icon: 'error',
				title: '시험 식별자 목록 불러오기 실패',
			})
		}
	}

	useEffect(() => {
		getReqVersionListHandler()

		if(selectedReqVersion) {
			getIdentificationListHandler()
		}
	}, [isOpen, selectedReqVersion])

	return (
		<div>
			<Button variant="primary" onClick={handleRequirementImportModal}>변경</Button>

			{/* 요구사항 버전 불러오기 모달 */}
			<Modal isOpen={isOpen} size="md">
				<Modal.Head>
					요구사항 버전 불러오기
				</Modal.Head>
				<Modal.Body>
					<div className="flex flex-col gap-4">
						<div className="flex flex-wrap items-center gap-2">
							<Input.Select label='요구사항 버전' value={selectedReqVersion?.baseline_id || ""} onChange={handleReqVersionChange}>
								<Input.Option value="">선택</Input.Option>
								{
									reqVersionList.sort((a, b) => b.baseline_id - a.baseline_id).map((reqData, index_st) => (
										<Input.Option key={index_st} value={reqData.baseline_id}>{reqData.baseline_number}</Input.Option>
									))
								}
							</Input.Select>
						</div>
						<div className="w-full max-h-[500px] overflow-y-auto">
							<table className="w-full table-border">
								<thead>
									<tr>
										<th>시험 식별자</th>
										<th>시험 목적</th>
									</tr>
								</thead>
								<tbody>
									{
										selectedReqVersion ?
										identificationList.length ?
											identificationList.map((reqData, index_st) => 
											(
												<tr key={index_st}>
													<td>{reqData.req_number}</td>
													<td>{reqData.req_title}</td>
												</tr>
											))
											: 
											<tr>
												<td colSpan={2} className='h-56'>
													선택한 요구사항 버전에 대한 시험 식별자가 없습니다.
													<br/>
													시험 식별자를 추가해주세요.
												</td>
											</tr>
										:
										<tr>
											<td colSpan={2} className='h-56'>
												선택한 요구사항 버전이 없습니다.
												<br />
												요구사항을 선택해주세요.
											</td>
										</tr>
									}
								</tbody>
							</table>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitRequirementImport}>불러오기</Button>
					<Button variant="secondary" onClick={handleRequirementImportModal}>취소</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default RequirementImportModal

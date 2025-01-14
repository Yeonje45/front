import React from 'react'
import Swal from 'sweetalert2'

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';

import { 
	GetBaselineHistoryData,
	IBaselineManagementDetailOutputsModel,
} from 'models/ConfigManagement';

interface IHistoryModalProps {
	conf_base_id: number
}

interface IHistoryRequirementTestList {
	conf_version_name: string // 버전
	baseline_number: string // 요구사항 ㅅㅂ 
	src_version_name: string // 소스코드 버전
}

interface IHistoryOutputList {
	conf_version_name: string // 버전
	baseline_outputs: IBaselineManagementDetailOutputsModel[]
}

const HistoryModal = ({conf_base_id}: IHistoryModalProps) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)
	const [baselineDetailOutputList, setBaselineDetailOutputList] = React.useState<IHistoryOutputList[] | null>(null)
	const [baselineDetailRequirementTestList, setBaselineDetailRequirementTestList] = React.useState<IHistoryRequirementTestList[] | null>(null)

	const getBaselineHistoryData = async () => {
		const res = await GetBaselineHistoryData(conf_base_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message
			})
			return
		}
		if (!res.data) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: '데이터가 없습니다.'
			})
			handleClose()
			return 
		}
		// conf_version_name과 baseline_outputs만 뽑아 저장
		setBaselineDetailOutputList(res.data.map((item) => {
			if (!item.baseline_outputs) {
				return {
					conf_version_name: item.conf_version_name,
					baseline_outputs: []
				}
			}
			return {
				conf_version_name: item.conf_version_name,
				baseline_outputs: item.baseline_outputs
			}
		}))
		// 요구사항
		setBaselineDetailRequirementTestList(res.data.map((item) => {
			return {
				conf_version_name: item.conf_version_name || '',
				baseline_number: item.baseline_number || '',
	      src_version_name: item.src_version_name || '',
			}
		}))
	}

	const handleOpen = () => {
		setBaselineDetailOutputList(() => null)
		setBaselineDetailRequirementTestList(() => null)
		setIsOpen(() => true)
		getBaselineHistoryData()
	}

	const handleClose = () => {
		setIsOpen(() => false)
	}

	return (
		<React.Fragment>
			<Button onClick={handleOpen}>이력(History)</Button>

			<Modal isOpen={isOpen} size="xl">
				<Modal.Head>History</Modal.Head>

				<Modal.Body>
					<div className="grid grid-cols-1 grid-flow-row gap-10 overflow-x-auto">

						{/* 산출물 목록 */}
						<table className="w-full table table-border">
							<caption className="text-start text-xl font-bold">산출물 목록</caption>
							<thead className="whitespace-nowrap">
								<tr>
									<th rowSpan={2}>Type</th>
									{ baselineDetailOutputList && baselineDetailOutputList.map((item, index) => (
										<th key={index}>V{ item.conf_version_name }</th>
									)) }
								</tr>
								<tr>
									{ baselineDetailOutputList && baselineDetailOutputList.map((_, index) => (
										<th key={index}>파일명</th>
									)) }
								</tr>
							</thead>
							<tbody>
								{ baselineDetailOutputList && baselineDetailOutputList.map((_, index_st) => (
									<tr key={index_st}>
										<td>
											{  // Type 열에는 output name이 들어가야 하기에 filter로 빈 값을 제외하고 하나의 데이터만을 가져와 output을 지정 ( 모든 output은 동일하기 때문에 filter 이후 하나의 데이터만을 사용하도록 설계 )
												baselineDetailOutputList.filter((baseFilterItem) => baseFilterItem.baseline_outputs?.length != 0) && 
												baselineDetailOutputList.filter((baseFilterItem) => baseFilterItem.baseline_outputs?.length != 0)[0] && 
												baselineDetailOutputList.filter((baseFilterItem) => baseFilterItem.baseline_outputs?.length != 0)[0].baseline_outputs[index_st] &&
												baselineDetailOutputList.filter((baseFilterItem) => baseFilterItem.baseline_outputs?.length != 0)[0].baseline_outputs[index_st].std_output_name || ''
											}
										</td>
										{ // 각 열에 맞는 데이터를 한 줄로 ( 세로 ) 방향으로 출력 
											baselineDetailOutputList.map((_, index_nd) => (
												<td key={index_nd}>
													{ 
														baselineDetailOutputList[index_nd] && 
														baselineDetailOutputList[index_nd].baseline_outputs && 
														baselineDetailOutputList[index_nd].baseline_outputs[index_st] && 
														baselineDetailOutputList[index_nd].baseline_outputs[index_st].output_content_file || ''
													}
												</td>
											))
										}
									</tr>
								)) }
							</tbody>
						</table>

						{/* 요구사항 버전 */}
						<table className="table w-full table-border">
							<caption className="text-start text-xl font-bold">요구사항 버전</caption>
							<thead className="">
								{/* 각 열에는 버전 정보가 한 열씩 하나씩 들어가야 하는데 이전 모달 Open 시에 데이터를 정제 하였기 때문에 다른 로직 생략 */}
									<tr> 
										{ 
											baselineDetailRequirementTestList &&  
											baselineDetailRequirementTestList.map((requirementItem, index) => (
												<th key={index}>V{requirementItem.conf_version_name}</th> 
											)) 
										}
									</tr>
									<tr>
										{ // 각 버전이 있는 만큼 요구사항 버전
											baselineDetailRequirementTestList &&
											Array.from({length: baselineDetailRequirementTestList.length || 0}, (_, index) => index).map((_, index) => (
												<React.Fragment key={index}>
													<th>요구사항 버전</th>
												</React.Fragment>
											))
										}
									</tr>
							</thead>
							<tbody>
								<tr>
									{
										baselineDetailRequirementTestList && 
										baselineDetailRequirementTestList.map((requirementItem, index) => (
											<React.Fragment key={index}>
												<td>{requirementItem.baseline_number}</td>
											</React.Fragment>
										))
									}
								</tr>
							</tbody>
						</table>

						{/* 소스코드 버전 */}
						<table className='w-full table table-border'>
							<caption className="text-start text-xl font-bold">소스코드 버전</caption>
							<thead className="whitespace-nowrap">
								<tr>
									{
										baselineDetailRequirementTestList && 
										baselineDetailRequirementTestList.map((requirementItem, index) => (
											<React.Fragment key={index}>
												<th>V{requirementItem.conf_version_name}</th>
											</React.Fragment>
										))
									}
								</tr>
							</thead>
							<tbody>
								<tr>
									{
										baselineDetailRequirementTestList && 
										baselineDetailRequirementTestList.map((item, index) => (
											<td key={index}>{item.src_version_name}</td>
										))
									}
								</tr>
							</tbody>
						</table>
					</div>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={handleClose}>취소</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	)
}

export default HistoryModal

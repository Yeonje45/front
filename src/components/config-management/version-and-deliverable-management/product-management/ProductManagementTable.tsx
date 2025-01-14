import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from "react-redux"

// UI
import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';

// Components
import Categories from 'components/config-management/version-and-deliverable-management/Categories';
import TableWrapper from 'components/config-management/version-and-deliverable-management/TableWrapper';
import DetailModal from 'components/config-management/version-and-deliverable-management/product-management/DetailModal';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

// Constants 
import { GetProductManagementTableData, IProductManagementModel, IProductManagementPanelModel, GetProductManagementPanelData, DownloadProductManagementTableData, GetStatusByStatusCode } from 'models/ConfigManagement';
import { RootState } from "app/store"

const getStatus = (status: string) => {
	switch (status) {
		case "done":
			return "완료"
		default:
			return "진행중"
	}
}

// 산출 관리 테이블
const ProductManagementTable = () => {
	const project = useSelector((state: RootState) => state.project).project

	// 테이블 데이터
	const [productManagementData, setProductManagementData] = React.useState<IProductManagementModel[] | null>();
	// 선택 된 테이블 데이터
	const [selectedProductManagementData, setSelectedProductManagementData] = React.useState<number | null>(null);
	// 좌측 패널 데이터
	const [category, setCategory] = React.useState<IProductManagementPanelModel[] | null>([])
	// 선택 된 좌측 패널 데이터
	const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);

	/** 페이지 로드 시 좌측 카테고리 데이터를 가져옴 */
	React.useEffect(() => {
		getProductManagementPanelData()
	}, [])

	/** 좌측 카테고리가 변경 될 때마다 데이터를 가져옴 */
	React.useEffect(() => {
		if (selectedCategories.length === 0) {
			setProductManagementData(() => [])
			setSelectedProductManagementData(() => null)
			return
		}
		getProductManagementData()
	}, [selectedCategories])

	/** 좌측 카테고리 변경을 해주는 함수
	 * 없는 카테고리면 추가, 있는 카테고리면 삭제
	 */
	const handleChangeCategory = async (event: React.MouseEvent<HTMLButtonElement>):Promise<void> => {
		const { name } = event.currentTarget;
		const category = parseInt(name);
		const index = selectedCategories.indexOf(category);
		if (index === -1) {
			setSelectedCategories((prev) => [...prev, category])
		} else {
			const newCategories = selectedCategories.filter((value) => value !== category)
			setSelectedCategories(() => newCategories)
		}
		setSelectedProductManagementData(() => null)
	}

	/** 카테고리 데이터를 가져오는 함수 */
	const getProductManagementPanelData = async ():Promise<void> => {
		const res = await GetProductManagementPanelData(project.project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '산출물 관리 페이지 데이터 조회 실패',
				text: res.message,
			})
		}

		if (!res.data) {
			setCategory(() => [])
			return
		}
		setCategory(() => res.data!)
	}

	/** 카테고리에 해당하는 데이터를 가져오는 함수 */
	const getProductManagementData = async ():Promise<void> => {
		const res = await GetProductManagementTableData(selectedCategories);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '산출물 관리 페이지 데이터 조회 실패',
				text: res.message,
			})
		}
		setProductManagementData(() => res.data)
	}

	/** 테이블 행의 특정 Radio 를 클릭하면 ID를 가져와 저장하는 함수 */
	const handleRadioChange = async (event: React.ChangeEvent<HTMLInputElement>):Promise<void> => {
		const { value } = event.currentTarget;
		setSelectedProductManagementData(() => parseInt(value))
	}
	
	/** 다운로드 핸들러 */
	const downloadHandler = async (): Promise<void> => {
    if (!selectedProductManagementData) {
      await Swal.fire({
        icon: 'error',
        title: '산출물 관리 페이지 데이터 다운로드 실패',
        text: '다운로드 할 데이터를 선택해주세요',
      })
      return
    }
		const filterdData = productManagementData?.filter((data) => data.output_version_id === selectedProductManagementData)
		if (!filterdData) {
			await Swal.fire({
				icon: 'error',
				title: '산출물 관리 페이지 데이터 다운로드 실패',
				text: '다운로드 할 데이터를 찾을 수 없습니다',
			})
			return
		}
		// output_content_file_name는 파일 이름이며 확장자까지 포함되어 있음 
		// 만약 파일에 확장자가 없다면 파일을 다운받을 수 없는 파일이라고 판단되어 다운로드를 막아놔야 함
		if (!filterdData[0].output_content_file_name?.includes('.')) {
			await Swal.fire({
				icon: 'error',
				title: '산출물 관리 페이지 데이터 다운로드 실패',
				text: '다운로드 할 수 없는 파일입니다',
			})
			return
		}
		await DownloadProductManagementTableData(selectedProductManagementData);
	}

	return (
		<React.Fragment>
			<div className="w-2/12">
				<Categories 
					selectedCategories={selectedCategories}
					categories={category}
					changeCategoryHandler={handleChangeCategory}
				/>
			</div>
			<div className="flex flex-col w-8/12">
				<PanelContainer>
					<PanelHeader rightElement={
						<div className="flex items-center justify-end w-full">
							<DetailModal 
								output_version_id={selectedProductManagementData} />
							<Button className="ml-1" onClick={downloadHandler}>다운로드</Button>
						</div>
					}/>
					<PanelBody>
						<TableWrapper>
							<div className="relative flex flex-col w-full">
								<table className="table w-full h-full table-border">
									<thead className="whitespace-nowrap">
										<tr>
											<th>선택</th>
											<th>산출물 종류</th>
											<th>파일명</th>
											<th>파일 저장 경로</th>
											<th>완료상태</th>
											<th>업로드 일시</th>
											<th>올린이</th>
											<th>상세업무</th>
											<th>장절</th>
											<th>변경사항</th>
										</tr>
									</thead>
									<tbody>
										{productManagementData && productManagementData.map((productManagementItem, index) => (
											<tr key={index}>
												<td>
													<Input.Radio 
														name="radio" 
														onChange={handleRadioChange}
														value={productManagementItem.output_version_id} 
														id={productManagementItem.output_version_id?.toString() || ''}
														checked={selectedProductManagementData === productManagementItem.output_version_id} />
													</td>
												<td>{productManagementItem.std_output_name}</td>
												<td>{productManagementItem.output_content_file_name}</td>
												<td>{productManagementItem.output_content_file}</td>
												<td>{getStatus(productManagementItem.output_content_state)}</td>
												<td>{new Date(productManagementItem.output_content_update_date).toLocaleString()}</td>
												<td>{productManagementItem.output_content_update_person_name || ''}</td>
												<td>{productManagementItem.latest_output_content_name}</td>
												<td>{productManagementItem.latest_output_content_chapter}</td>
												<td>{productManagementItem.latest_output_content_work}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</TableWrapper>
					</PanelBody>
				</PanelContainer>
			</div>
		</React.Fragment>
	)
}

export default ProductManagementTable;

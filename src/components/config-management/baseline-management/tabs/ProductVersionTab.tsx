import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from "react-redux"

// UI
import Button from 'tailwindElement/Button';
import Input from 'tailwindElement/Input';

// Components
import Categories from 'components/config-management/version-and-deliverable-management/Categories';
import TableWrapper from 'components/config-management/version-and-deliverable-management/TableWrapper';
import PanelContainer from 'components/common/panels/PanelContainer';
import PanelHeader from 'components/common/panels/PanelHeader';
import PanelBody from 'components/common/panels/PanelBody';

// Constants 
import { GetProductManagementTableData, IProductManagementModel, IProductManagementPanelModel, GetProductManagementPanelData } from 'models/ConfigManagement';
import { RootState } from "app/store"

interface IProps {
	handleAddProduct: (productList: IProductManagementModel[]) => void
}

// 산출 관리 테이블
const ProductVersionTab = ({handleAddProduct}: IProps) => {
	const project = useSelector((state: RootState) => state.project).project

	// 좌측 패널 데이터
	const [category, setCategory] = React.useState<IProductManagementPanelModel[] | null>([])
	// 선택 된 좌측 패널 데이터
	const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);
	// 테이블 데이터
	const [productManagementData, setProductManagementData] = React.useState<IProductManagementModel[] | null>();
	// 선택 된 테이블 데이터
	const [selectedProductManagementData, setSelectedProductManagementData] = React.useState<IProductManagementModel[] | null>(null);
	
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
		if (res.data) {
			const filteredData = Object.values(
				res.data.reduce((acc, curr) => {
					if (
						!acc[curr.std_output_id] || 
						acc[curr.std_output_id].output_version_id! < curr.output_version_id!
					) {
						acc[curr.std_output_id] = curr;
					}
					return acc;
				}, {} as Record<number, IProductManagementModel>)
			);
			setProductManagementData(() => filteredData)
		}
	}

	/** 테이블 행의 특정 Checkbox 를 클릭하면 ID를 가져와 저장하는 함수 */
	const handleTableRowCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>):Promise<void> => {
		if (!productManagementData) {
			return
		}
		const id = +event.currentTarget.id;
		const filtered = productManagementData.filter((item) => item.std_output_id === id)[0]
		if (!filtered) {
			return
		}
		// 데이터가 이미 있으면 제거, 없으면 추가 
		setSelectedProductManagementData((prev) => {
			if (!prev) {
				return [filtered]
			}
			const index = prev.findIndex((item) => item.std_output_id === id)
			if (index === -1) {
				return [...prev, filtered]
			}
			const newSelected = prev.filter((item) => item.std_output_id !== id)
			return newSelected
		})
	}
	
	const submitAddProductList = () => {
		if (!selectedProductManagementData) {
			Swal.fire({
				icon: 'error',
				title: '선택된 산출물이 없습니다.',
			})
			return
		}
		handleAddProduct(selectedProductManagementData)
		Swal.fire({
			icon: 'success',
			title: '선택된 산출물이 추가되었습니다.',
		})
		setSelectedProductManagementData(() => null)
	}

	return (
		<div className="grid grid-rows-1 md:grid-cols-8 relative">
			<div className="md:col-span-2">
				<Categories 
					selectedCategories={selectedCategories}
					categories={category}
					changeCategoryHandler={handleChangeCategory}
				/>
			</div>

			<div className="md:col-span-6 overflow-x-auto relative">
				<PanelContainer>
					<PanelHeader>산출물 버전</PanelHeader>
					<PanelBody>
						<TableWrapper>
							<div className="relative flex flex-col w-full">
								<table className="table w-full h-full table-border">
									<thead className="whitespace-nowrap">
										<tr>
											<th>선택</th>
											<th>산출물 종류</th>
											<th>파일명</th>
											<th>업로드 일시</th>
											<th>올린이</th>
										</tr>
									</thead>
									<tbody>
										{productManagementData && productManagementData.map((productManagementItem, index) => (
											<tr key={index}>
												<td>
													<Input.Checkbox 
														name="checkbox" 
														onChange={handleTableRowCheckboxChange}
														id={productManagementItem.std_output_id.toString()}
														checked={selectedProductManagementData?.some(item => item.std_output_id === productManagementItem.std_output_id) || false}
													/>
													</td>
												<td>{productManagementItem.std_output_name}</td>
												<td>{productManagementItem.output_content_file_name}</td>
												<td>{productManagementItem.output_content_update_date}</td>
												<td>{productManagementItem.output_content_update_person_name || ''}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</TableWrapper>
					</PanelBody>
				</PanelContainer>
				<Button className="absolute right-5 top-4" onClick={submitAddProductList}>선택항목 추가</Button>
			</div>
		</div>
	)
}

export default ProductVersionTab;

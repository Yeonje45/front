// Constants 
import { ManagementCategory } from 'constant/config-management/categories';
import { IProductManagementPanelModel } from 'models/ConfigManagement';

type Props = {
	selectedCategories: number[],
	categories: IProductManagementPanelModel[] | null,
	changeCategoryHandler: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// 카테고리 클릭 및 변경을 위한 컴포넌트
const Categories = ({ selectedCategories, categories, changeCategoryHandler }: Props) => {
	return (
		<section className="flex flex-col items-center w-full">
			<div className="flex flex-col items-center border rounded-lg bg-white shadow-sm text-left m-2 w-full max-h-[600px] overflow-y-auto">
				{categories && categories.map((category, index) => (
					<button 
						key={index} 
						name={category.std_output_id.toString()} 
						className={`w-full px-2 py-5 border text-start ${ selectedCategories.includes(category.std_output_id) ? 'bg-gray-200' : 'bg-gray-50' }`} 
						onClick={changeCategoryHandler}
					>
						{category.std_output_name}
					</button>
				))}
			</div>
		</section>
	)
}

export default Categories;

import { VersionDeliverableManagementPageCategory } from 'constant/config-management/categories';

type Props = {
	versionDeliverableManagementPageCategories: VersionDeliverableManagementPageCategory[];
	pageCategory: string;
	handlePageCategory: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SelectCategories = ({ versionDeliverableManagementPageCategories, pageCategory, handlePageCategory }: Props) => {
	return (
		<div className="w-10/12">
			<ul className="flex items-center justify-center w-full">
				{versionDeliverableManagementPageCategories.map((category) => (
					<li key={category.value} className="flex-1 text-center border border-1">
						<button
							name={category.value}
							onClick={handlePageCategory}
							className={`py-4 px-4 text-lg font-bold w-full h-full ${
								pageCategory === category.value
									? 'text-blue-500'
									: 'text-gray-500'
							} hover:text-blue-500`}
						>
							{category.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default SelectCategories;

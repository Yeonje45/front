import React from 'react';

// Components
import SelectCategories from 'components/config-management/version-and-deliverable-management/SelectCategories';
import ProductManagementTable from 'components/config-management/version-and-deliverable-management/product-management/ProductManagementTable';
import RequirementManagementTable from 'components/config-management/version-and-deliverable-management/requirement-management/RequirementManagementTable';
import SourceCodeManagementTable from 'components/config-management/version-and-deliverable-management/source-code-management/SourceCodeManagementTable';

// Constants
import { VersionDeliverableManagementPageCategories } from 'constant/config-management/categories';

const VersionandAndDeliverableManagementPage = () => {
	const [pageCategory, setPageCategory] = React.useState<string>('Product-Management');

	const handlePageCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
		const { name } = event.currentTarget;
		setPageCategory(() => name);
	}

	const getTableElement = (): JSX.Element => {
		switch (pageCategory) {
			case 'Product-Management': return ( <ProductManagementTable />)
			case 'Requirements-Management': return ( <RequirementManagementTable />)
			case 'Source-Code-Management': return ( <SourceCodeManagementTable />)
			default: return ( <React.Fragment> </React.Fragment>)
		}
	}

	return (
		<React.Fragment>
			<div className="relative flex items-start justify-center m-1">
				<SelectCategories 
					versionDeliverableManagementPageCategories={VersionDeliverableManagementPageCategories}
					pageCategory={pageCategory}
					handlePageCategory={handlePageCategory}
				/>
			</div>
			<div className="flex items-start justify-center m-1">
				{getTableElement()}
			</div>
		</React.Fragment>
	)
}

export default VersionandAndDeliverableManagementPage;

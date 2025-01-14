import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
}

const TableWrapper = ({children}: IProps) => {
	return (
		<section className="border rounded-lg bg-white shadow-sm text-left w-full max-h-[535px] overflow-y-auto">
			{children}
		</section>
	)
}

export default TableWrapper;

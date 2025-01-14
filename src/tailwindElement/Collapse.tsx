interface ICollapse {
	isOpen: boolean
	children: React.ReactNode
	className?: string
}

const Collapse = ({ isOpen, children, className }: ICollapse) => {
	return (
		<div
			className={`transition-all duration-300 ease-in-out overflow-hidden ${
				isOpen ? 'max-h-screen' : 'max-h-0'
			}`}>
			{children}
		</div>
	)
}

export default Collapse

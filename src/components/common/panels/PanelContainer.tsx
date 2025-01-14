interface IProps {
  className?: string
  children: React.ReactNode
	id?: string
}

// 패널의 타이틀과 내용을 포함하는 컴포넌트입니다.
const PanelContainer = ({ className, children, id }: IProps) => {
  return (
    <div
			id={id}
      className={`block border rounded-lg bg-white shadow-sm text-left m-2 ${className}`}>
      {children}
    </div>
  )
}

export default PanelContainer

interface IProps {
  className?: string
  children: React.ReactNode
}

// 패널의 내용 부분에 해당하는 컴포넌트입니다.
const PanelBody = ({ className="", children }: IProps) => {
  return (
    <div className={`p-2 text-base text-black relative overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

export default PanelBody

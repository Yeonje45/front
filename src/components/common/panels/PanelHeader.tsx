type DivPropsWithoutTitle = Omit<React.HTMLAttributes<HTMLHeadElement>, 'title'>;

interface IProps extends DivPropsWithoutTitle {
  // title을 string | JSX.Element로 받게 만듦
  title?: string | JSX.Element;
  rightElement?: React.ReactNode; // 패널 Head에 오른쪽에 들어갈 컴포넌트를 받습니다.
	drag?: any; // any Type으로 설정한 경우는 너무 많은 컴포넌트를 받을 수 있기 때문에 any로 설정합니다.
	drop?: any; // ...
}

// title과 children이 같이 들어올 수 있습니다.
// 혹은 children만 들어올 수 있습니다.
// 혹은 title만 들어올 수 있습니다.

// 패널의 타이틀 부분에 해당하는 컴포넌트입니다.
const PanelHeader = ({ className="", title, children, onDoubleClick, rightElement, id, drag, drop }: IProps) => {
  return (
    <header ref={ drag && drop && (node => drag(drop(node)))} className={`flex items-center justify-between border-b-2 border-bg-gray-500 p-3 bg-gray-100 ${className}`} id={id && id} onDoubleClick={onDoubleClick}>
			{title && 
				<h5 className="mr-1 whitespace-nowrap">
					<span className="fs-5">{title}</span>
				</h5> 
			}
      {children}
      {rightElement}
    </header>
  )
}

export default PanelHeader

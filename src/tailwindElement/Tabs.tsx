import React, { useEffect, useState } from 'react'

// div 태그로부터 상속
interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  children: React.ReactNode
  changeTab?: (label: string) => void
  isActive?: boolean
}

const Tab = ({ label, children, changeTab, isActive, className="" }: TabProps) => {
  return (
    <button
      className={`px-4 py-2 ${ isActive ? 'bg-gray-500 text-white' : '' } rounded-t-md border-x border-t ${className}`}
      onClick={() => changeTab && changeTab(label)}
      type="button">
      {label}
    </button>
  )
}

const Tabs = ({
  children,
  defaultTab,
  className,
}: {
  defaultTab: string
  children: React.ReactNode
  className?: string
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const onClick = (tab: string) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap border-b">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === Tab) {
            return React.cloneElement(child as React.ReactElement<TabProps>, {
              changeTab: onClick,
              isActive: child.props.label === activeTab,
            })
          }
          return child
        })}
      </div>
      <div className="flex flex-col">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.props.label === activeTab) {
            return <div>{child.props.children}</div>
          }
          return null
        })}
      </div>
    </div>
  )
}

// `displayName` 속성을 설정하여 컴포넌트를 명시적으로 식별할 수 있도록 합니다.
Tab.displayName = 'Tab'

// `Tab` 컴포넌트를 `Tabs` 컴포넌트에 첨부하여 내보냅니다.
Tabs.Tab = Tab

export default Tabs

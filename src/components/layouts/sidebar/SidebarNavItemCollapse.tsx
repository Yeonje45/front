import { useState } from 'react'
import { ArrowDown } from 'react-bootstrap-icons'

interface IProps {
  toggleText: JSX.Element
  children: React.ReactNode
}

const SidebarNavItemCollapse = ({ toggleText, children }: IProps) => {
  const [openNavItems, setOpenNavItems] = useState<boolean>(true)

  const toggleNavItemsHandler = () => {
    setOpenNavItems(!openNavItems)
  }

  return (
    <div className="sidebar_nav_item_collapse w-full">
      <button
        className="flex items-center gap-2 text-xl no-underline text-start w-full ps-2 py-2 hover:bg-gray-500 text-white font-bold"
        onClick={toggleNavItemsHandler}>
        {toggleText}
      </button>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          openNavItems ? 'max-h-screen' : 'max-h-0'
        }`}>
        <ul className="grid w-full">{children}</ul>
      </div>
    </div>
  )
}

export default SidebarNavItemCollapse

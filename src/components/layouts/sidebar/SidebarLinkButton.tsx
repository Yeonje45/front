import { NavLink } from 'react-router-dom'

interface IProps {
  children: React.ReactNode
  to: any
}

const SidebarLinkButton = ({ children, to }: IProps) => {
  return (
    <button className="w-full text-lg text-start">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 text-xl w-full h-full py-2 px-2 ${
            isActive ? 'bg-gray-500' : ''
          } hover:bg-gray-500`
        }>
        {children}
      </NavLink>
    </button>
  )
}

export default SidebarLinkButton

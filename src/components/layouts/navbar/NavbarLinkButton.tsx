import { NavLink } from 'react-router-dom'

interface IProps {
  children: React.ReactNode
  to: string
}

const SidebarLinkButton = ({ children, to }: IProps) => {
  return (
    <button className="text-lg w-full text-start">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block w-full h-full py-2 px-2 ${isActive ? 'bg-gray-100' : ''}`
        }>
        {children}
      </NavLink>
    </button>
  )
}

export default SidebarLinkButton

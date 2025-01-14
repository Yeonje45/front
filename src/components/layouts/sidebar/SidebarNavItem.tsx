import { NavLink } from 'react-router-dom'

interface IProps {
  to: string
  children: React.ReactNode
}

const SidebarNavItem = ({ to, children }: IProps) => (
  <li className="text-base w-full h-full">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `before:content-['_-'] block w-full h-full ps-4 py-2 hover:bg-slate-100 ${
          isActive ? 'bg-gray-100' : ''
        }`
      }>
      {children}
    </NavLink>
  </li>
)

export default SidebarNavItem

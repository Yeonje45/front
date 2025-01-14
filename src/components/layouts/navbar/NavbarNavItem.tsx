import { NavLink } from 'react-router-dom'

interface IProps {
  to: string
  children: React.ReactNode
  className?: string
}

const NavbarNavItem = ({ to, children, className }: IProps) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) => `block w-full h-full p-2 bg-gray-100 underline`}>
      {children}
    </NavLink>
  </li>
)

export default NavbarNavItem

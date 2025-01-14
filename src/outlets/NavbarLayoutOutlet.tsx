import Container from 'tailwindElement/Container'
import { Outlet } from 'react-router-dom'

import NavbarWrapper from '../components/layouts/navbar/NavbarWrapper'

interface IProps {
  navbarTop: boolean
  navbarBottom: boolean
}

const NavbarLayoutOutlet = ({ navbarTop, navbarBottom }: IProps) => {
  const marginTop =
    navbarTop && navbarBottom
      ? '126px'
      : navbarTop
      ? '58px'
      : navbarBottom
      ? '58px'
      : '0'

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Main Content */}
      <NavbarWrapper navbarTop={navbarTop} navbarBottom={navbarBottom} projectName="" />
      <main className="" style={{ marginTop }}>
        <Outlet />
      </main>
    </div>
  )
}

export default NavbarLayoutOutlet

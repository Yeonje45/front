import { useSelector } from 'react-redux/es/hooks/useSelector'

import NavbarBottom from './NavbarBottom'
import NavbarTop from './NavbarTop'

import { RootState } from 'app/store'

interface IProps {
  navbarTop: boolean
  navbarBottom: boolean
  projectName: string
}

const NavbarWrapper = ({ navbarTop, navbarBottom }: IProps) => {
  const project = useSelector((state: RootState) => state.project).project

  return (
    <div className="static left-0 right-0 top-0 w-full h-16 bg-gray-100 z-[10] lg:flex-wrap lg:pl-60">
      {navbarTop && <NavbarTop projectName={project.project_name} />}
      {navbarBottom && <NavbarBottom />}
    </div>
  )
}

export default NavbarWrapper

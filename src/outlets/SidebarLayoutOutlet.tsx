import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layouts/sidebar/Sidebar'
import { INavItem } from 'constant/layout/sidebar'

interface IProps {
  NavItems?: INavItem[]
}

const GlobalLayoutOutlet = ({ NavItems }: IProps) => {
  return (
    <div className="w-full">
      <header>
        <Sidebar NavItems={NavItems} />
      </header>
      {/* Content Area */}
      <main className="h-screen lg:pl-60">
        <Outlet />
      </main>
    </div>
  )
}

export default GlobalLayoutOutlet

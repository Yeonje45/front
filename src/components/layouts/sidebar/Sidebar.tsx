import { NavLink, useLocation } from 'react-router-dom'

import SidebarLogo from './SidebarLogo'
import SidebarNavItem from './SidebarNavItem'
import SidebarNavItemCollapse from './SidebarNavItemCollapse'
import SidebarLinkButton from './SidebarLinkButton'

import { INavItem } from 'constant/layout/sidebar'

interface IProps {
  NavItems?: INavItem[]
}

const Sidebar = ({ NavItems }: IProps) => {
  const location = useLocation()

  // 현재 쿼리에서 project_id와 step 추출
  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get('project_id') ?? ''
  const step = searchParams.get('step') ?? ''

  return (
    <nav className="scrollbar-hide fixed left-0 top-0 z-[15] h-screen w-0 lg:w-60 text-white bg-gray-700 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out">
      <div className="w-full h-full">
        <SidebarLogo />
        <div>
          {NavItems &&
            NavItems.map((item, index_st) => {
              if (item.isCollapse) {
                return (
                  <SidebarNavItemCollapse key={index_st} toggleText={item.toggleText}>
                    {item.collapseItems!.map((item, index_nd) =>
                      item.collapseItems ? (
                        <SidebarNavItemCollapse
                          key={index_nd}
                          toggleText={
                            <div className="text-base ps-2">- {item.toggleText}</div>
                          }>
                          {item.collapseItems.map((item, index_th) => (
                            <li key={index_th} className="w-full h-full">
                              <NavLink
                                to={{
                                  pathname: item.to,
                                  search: `?project_id=${projectId}&step=${step}`,
                                }}
                                className={({ isActive }) =>
                                  `before:content-['_•__'] block w-full h-full ps-8 py-2 hover:bg-gray-500 ${
                                    isActive ? 'bg-gray-500' : ''
                                  }`
                                }>
                                {item.toggleText}
                              </NavLink>
                            </li>
                          ))}
                        </SidebarNavItemCollapse>
                      ) : (
                        <li key={index_nd} className="w-full h-full text-base">
                          <NavLink
                            to={{
                              pathname: item.to,
                              search: `?project_id=${projectId}&step=${step}`,
                            }}
                            className={({ isActive }) => {
															return `before:content-['_-__'] block w-full h-full ps-4 py-2 hover:bg-gray-500 ${ isActive ? 'bg-gray-500' : '' }`
															} }>
                            {item.toggleText}
                          </NavLink>
                        </li>
                      ),
                    )}
                  </SidebarNavItemCollapse>
                )
              } else {
                return (
                  <SidebarLinkButton
                    key={index_st}
                    to={{
                      pathname: item.to!,
                      search: `?project_id=${projectId}&step=${step}`,
                    }}>
                    {item.toggleText}
                  </SidebarLinkButton>
                )
              }
            })}
        </div>
      </div>
    </nav>
  )
}

export default Sidebar

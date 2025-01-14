import { NavLink, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import { GetStepName } from 'models/Layout'

interface IProps {
  text: string
	value: string
}

const NavbarStepItem = ({ text, value }: IProps) => {
  const location = useLocation()
  const isQuery = location.search.includes(text || '')

  // 현재 쿼리에서 project_id와 step 추출
  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get('project_id')

  const linkClass = classNames('block w-full h-full p-2 hover:bg-gray-400', {
    'bg-gray-600': isQuery,
  })

  return (
    <li className="w-full text-center">
      <NavLink
        to={{
          search: `?project_id=${projectId}&step=${text}`
        }}
        className={`${linkClass} whitespace-nowrap`}>
        {GetStepName(text)}
        <br />
				{value}%
      </NavLink>
    </li>
  )
}

export default NavbarStepItem

import { Link, NavLink, useLocation } from 'react-router-dom'

interface IProps {
  to: string
  children: React.ReactNode
  className?: string
}

// 특정 페이지로 이동하는 컴포넌트입니다.
const ActiveLink = ({ to, children, className }: IProps) => {
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get('project_id')
  const step = searchParams.get('step')

  const targetLink = `${to}?project_id=${projectId}&step=${step}`
  return (
    <Link to={targetLink} className={`${className}`}>
      {children}
    </Link>
  )
}

export default ActiveLink

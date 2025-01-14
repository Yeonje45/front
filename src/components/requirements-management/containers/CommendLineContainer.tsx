import Container from 'tailwindElement/Container'

interface IProps {
  children: React.ReactNode
}

// 로그인 상태 시에만 접근이 가능한 페이지에서만 사용합니다.
const RequirementsManagementCommendLineContainer = ({ children }: IProps) => {
  return (
    <Container fluid className="h-screen mb-10">
      {children}
    </Container>
  )
}

export default RequirementsManagementCommendLineContainer

// LinkPoint 페이지 - 사용자가 앱에 연결되는 지점을 나타냅니다. 서버 연결 시도와 로그인이 이루어지는 중요한 링크 지점입니다.
import Container from 'tailwindElement/Container'

interface IProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

// 비로그인 상태 시에만 접근이 가능한 페이지에서만 사용합니다.
const UserLinkPointFormContainer = ({ children, onSubmit }: IProps) => {
  return (
    <Container fluid className="h-full">
      <form
        className="flex flex-col items-center justify-center w-full h-full px-6 py-4 lg:px-4"
        onSubmit={onSubmit}>
        {children}
      </form>
    </Container>
  )
}

export default UserLinkPointFormContainer

import Container from 'tailwindElement/Container'

interface IProps {
  page_title: string
  children: React.ReactNode
  submitHandler?: (e: React.FormEvent<HTMLFormElement>) => void
}

// 로그인 상태 시에만 접근이 가능한 페이지에서만 사용합니다.
const UserAccessPointFormContainer = ({
  page_title,
  children,
  submitHandler,
}: IProps) => {
  return (
    <Container fluid className="h-full">
      <form
        className="flex flex-col w-full h-full px-6 py-4 lg:px-4"
        onSubmit={submitHandler}>
        {children}
      </form>
    </Container>
  )
}

export default UserAccessPointFormContainer

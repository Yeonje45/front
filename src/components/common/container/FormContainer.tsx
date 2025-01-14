import Container from 'tailwindElement/Container'

interface IProps {
  children: React.ReactNode
  className?: string
  submitHandler?: (e: React.FormEvent<HTMLFormElement>) => void
}
const FormContainer = ({ children, className, submitHandler }: IProps) => {
  return (
    <Container fluid className="flex justify-center items-center">
      <form
        className={`${className} w-full h-full sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl bg-white px-10 py-4`}
        onSubmit={submitHandler}>
        {children}
      </form>
    </Container>
  )
}

export default FormContainer

interface IContainer {
  children: React.ReactNode
  className?: string
  fluid?: boolean
}

const Container = ({ children, fluid, className }: IContainer) => {
  if (fluid) {
    return <div className={`w-full px-2 ${className}`}>{children}</div>
  }

  return <div className={`container mx-auto ${className}`}>{children}</div>
}

export default Container

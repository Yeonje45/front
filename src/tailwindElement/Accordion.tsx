interface IAccordion {
  children: React.ReactNode
  className?: string
}

const Header = ({ children, className }: IAccordion) => {
  return (
    <div className={`${className} text-xl border-b border-gray-300 p-3 `}>
      {children}
    </div>
  )
}

const Body = ({ children, className }: IAccordion) => {
  return <div className={`${className} p-3`}>{children}</div>
}

const Accordion = ({ children, className }: IAccordion) => {
  return (
    <div className={`${className} border border-gray-300 rounded-md`}>{children}</div>
  )
}

Accordion.Header = Header
Accordion.Body = Body

export default Accordion

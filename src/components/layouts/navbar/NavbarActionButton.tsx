interface IProps {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

const NavbarActionButton = ({ children, onClick, className }: IProps) => {
  return (
    <li>
      <button
        onClick={onClick}
        className="block w-full h-full py-2 px-2 bg-gray-100 underline">
        {children}
      </button>
    </li>
  )
}

export default NavbarActionButton

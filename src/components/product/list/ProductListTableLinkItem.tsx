interface IProps {
  link: string
  className?: string
  children: React.ReactNode
}

const ProductListTableLinkItem = ({ link, className, children }: IProps) => {
  return (
    <li className={`p-1 ${className}`}>
      {link ? <a href={link}>{children}</a> : <a>{children}</a>}
    </li>
  )
}

export default ProductListTableLinkItem

interface IProps {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  popup: React.ReactNode
}

const ProductTailoringContent = ({ className, title, popup, children }: IProps) => {
  return (
    <div className={`${className} px-5`}>
      <h5 className={`bg-gray-200 flex justify-between mx-5 mb-5 p-2 border`}>
        <div className="w-full text-center">{title}</div>
        {popup}
      </h5>
      {children}
    </div>
  )
}

export default ProductTailoringContent

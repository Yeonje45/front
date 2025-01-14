import {
  ChevronDoubleLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDoubleRight,
} from 'react-bootstrap-icons'

interface IPagination {
  presentPage: number
  maxPage: number
  presentHandler: (presentData: number) => void
}

interface IPageItem {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  icon?: 'first' | 'last'
}

const PageItem = ({ children, onClick, active, icon }: IPageItem) => {
  return active ? (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 bg-gray-700 text-white text-lg font-semibold border focus:z-20 focus:outline-offset-0`}>
      {children}
    </button>
  ) : (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-blue-500 text-lg font-semibold border focus:z-20 focus:outline-offset-0 hover:bg-gray-50
      ${icon === 'first' && 'rounded-l-md'}
      ${icon === 'last' && 'rounded-r-md'}
      `}>
      {children}
    </button>
  )
}

// 페이지에 갯수에 따른 Pagination 컴포넌트
const Pagination = ({ presentPage, maxPage, presentHandler }: IPagination) => {
  return (
    <div className="flex">
      <PageItem
        icon="first"
        onClick={() => {
          presentHandler(1)
        }}>
        <ChevronDoubleLeft />
      </PageItem>

      <PageItem
        onClick={() => {
          presentHandler(presentPage - 1 < 1 ? 1 : presentPage - 1)
        }}>
        <ChevronLeft />
      </PageItem>

      {Array(maxPage)
        .fill(1)
        .map((d, i) => (
          <PageItem
            key={i}
            active={presentPage === i + 1}
            onClick={() => {
              presentHandler(i + 1)
            }}>
            {i + 1}
          </PageItem>
        ))}

      <PageItem
        onClick={() => {
          presentHandler(presentPage + 1 > maxPage ? maxPage : presentPage + 1)
        }}>
        <ChevronRight />
      </PageItem>

      <PageItem
        icon="last"
        onClick={() => {
          presentHandler(maxPage)
        }}>
        <ChevronDoubleRight />
      </PageItem>
    </div>
  )
}

export default Pagination

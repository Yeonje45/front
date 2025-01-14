import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'
import ProductConditionRepositoryTable from './repository/ProductConditionRepositoryTable'

interface IProps {
  repositoryModalShow: boolean
  repositoryOpenModalHandler: () => void
  repositoryCloseModalHandler: () => void
  repositoryModalHandler: () => void
}

const ProductConditionPanelButtonGroup = ({
  repositoryModalShow,
  repositoryOpenModalHandler,
  repositoryCloseModalHandler,
  repositoryModalHandler,
}: IProps) => {
  return (
    <div className="flex justify-end">
      <ActiveModal
        isOpen={repositoryModalShow}
        buttonElement={
          <Button className="mx-2" onClick={repositoryOpenModalHandler}>
            산출물 저장소
          </Button>
        }>
        <ActiveModal.Head>산출물 저장소</ActiveModal.Head>
        <ActiveModal.Body>
          <ProductConditionRepositoryTable />
        </ActiveModal.Body>
        <ActiveModal.Footer>
          <Button onClick={repositoryModalHandler} variant="primary">
            확인
          </Button>
          <Button onClick={repositoryCloseModalHandler} variant="secondary">
            닫기
          </Button>
        </ActiveModal.Footer>
      </ActiveModal>
    </div>
  )
}

export default ProductConditionPanelButtonGroup

import Button from 'tailwindElement/Button'
import BusinessProductModalTable from '../table/BusinessProductModalTable'
import ActiveModal from 'tailwindElement/ActiveModal'
import {
  IProductTailoringBusinessAddData,
  IProductTailoringBusinessContentFields,
  IProductTailoringStandardContentFields,
} from 'constant/product/productTailoring'

interface IProps {
  allActiveHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
  businessDocument: IProductTailoringBusinessContentFields[]
  activeBusiness: number[]
  businessProductDeleteHandler?: () => void
  productAddModalShow: boolean
  productAddOpenModalHandler: () => void
  productAddCloseModalHandler: () => void
  productAddModalHandler: () => void
  productAddDataInputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  productAddData: IProductTailoringBusinessAddData
  standardDocument: IProductTailoringStandardContentFields[]
  productAddDataSelectHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  productAddDataClickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const BusinessButtonGroup = ({
  allActiveHandler,
  businessDocument,
  activeBusiness,
  businessProductDeleteHandler,
  productAddModalShow,
  productAddOpenModalHandler,
  productAddCloseModalHandler,
  productAddModalHandler,
  productAddDataInputHandler,
  productAddData,
  standardDocument,
  productAddDataSelectHandler,
  productAddDataClickHandler,
}: IProps) => {
  return (
    <div className="flex justify-between">
      <Button
        onClick={allActiveHandler}
        name="business"
        variant={activeBusiness.length === businessDocument.length ? 'danger' : ''}>
        {activeBusiness.length === businessDocument.length ? '전체 해제' : '전체 선택'}
      </Button>
      <div>
        <ActiveModal
          size="md"
          isOpen={productAddModalShow}
          buttonElement={
            <Button className="mx-2" onClick={productAddOpenModalHandler}>
              산출물 추가
            </Button>
          }>
          <ActiveModal.Head>산출물 작성 목록 추가</ActiveModal.Head>
          <ActiveModal.Body>
            <BusinessProductModalTable
              productAddDataInputHandler={productAddDataInputHandler}
              productAddData={productAddData}
              standardDocument={standardDocument}
              productAddDataSelectHandler={productAddDataSelectHandler}
              productAddDataClickHandler={productAddDataClickHandler}
            />
          </ActiveModal.Body>
          <ActiveModal.Footer>
            <Button onClick={productAddModalHandler} variant="primary">
              저장
            </Button>
            <Button onClick={productAddCloseModalHandler} variant="secondary">
              닫기
            </Button>
          </ActiveModal.Footer>
        </ActiveModal>

        <Button onClick={businessProductDeleteHandler} variant="danger">
          산출물 삭제
        </Button>
      </div>
    </div>
  )
}

export default BusinessButtonGroup

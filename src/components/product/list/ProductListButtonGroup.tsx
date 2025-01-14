import { IProductListFormContentFields } from 'pages/product/list/ProductListPage'
import ProductListUploadModalTable from './template/ProductListUploadModalTable'
import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'
import { useState } from 'react'

interface IProps {
  templateUploadModalShow: boolean
  templateUploadModalHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
  templateUploadModalSubmitHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
  productList: IProductListFormContentFields
  uploadSelectChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  uploadFileChangeandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadData: {
    step: string
    output_index: string
    file: File
  }
  downloadTemplateHandler: () => void
  defaultDownloadTemplateHandler: () => void
}

const ProductListButtonGroup = ({
  templateUploadModalShow,
  templateUploadModalHandler,
  templateUploadModalSubmitHandler,
  productList,
  uploadSelectChangeHandler,
  uploadFileChangeandler,
  uploadData,
  downloadTemplateHandler,
  defaultDownloadTemplateHandler,
}: IProps) => {
  const [templateDownloadShow, setTemplateDownloadShow] = useState<boolean>(false)

  const templateDownloadShowHandler = () => {
    setTemplateDownloadShow(!templateDownloadShow)
  }

  return (
    <div className={`flex justify-between py-2`}>
      <span>※ 템플릿을 개별로 다운로드 받고 싶을 경우 산출물을 클릭해주세요. ※</span>
      <div className="flex gap-2">
        {/* <Button type={'button'} onClick={downloadTemplateHandler}>
          템플릿 전체 다운로드
        </Button> */}
        {/*
        <ActiveModal
          size="md"
          isOpen={templateDownloadShow}
          buttonElement={
            <Button onClick={templateDownloadShowHandler}>템플릿 전체 다운로드</Button>
          }>
          <ActiveModal.Head>템플릿 다운로드 형식 선택</ActiveModal.Head>
          <ActiveModal.Body>
            <div className="flex justify-center gap-5">
              <Button onClick={downloadTemplateHandler}>
                사용자 정의 템플릿
              </Button>
              <Button onClick={defaultDownloadTemplateHandler}>
                기본 템플릿 전체 다운로드
              </Button>
            </div>
          </ActiveModal.Body>
          <ActiveModal.Footer>
            <Button onClick={templateDownloadShowHandler} variant="secondary">
              닫기
            </Button>
          </ActiveModal.Footer>
        </ActiveModal>
        */}
        <ActiveModal
          size="md"
          isOpen={templateUploadModalShow}
          buttonElement={
            <Button type={'button'} onClick={templateUploadModalHandler}>
              템플릿 업로드
            </Button>
          }>
          <ActiveModal.Head>템플릿 업로드</ActiveModal.Head>
          <ActiveModal.Body>
            <ProductListUploadModalTable
              productList={productList}
              uploadSelectChangeHandler={uploadSelectChangeHandler}
              uploadFileChangeandler={uploadFileChangeandler}
              uploadData={uploadData}
            />
          </ActiveModal.Body>
          <ActiveModal.Footer>
            <Button onClick={templateUploadModalSubmitHandler} variant="primary">
              확인
            </Button>
            <Button onClick={templateUploadModalHandler} variant="secondary">
              닫기
            </Button>
          </ActiveModal.Footer>
        </ActiveModal>
      </div>
    </div>
  )
}

export default ProductListButtonGroup

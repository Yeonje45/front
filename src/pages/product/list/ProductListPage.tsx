import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { productListFormTitleFields } from '../../../constant/product/productListFormFields'
import ProductListTable from 'components/product/list/ProductListTable'
import ProductListButtonGroup from 'components/product/list/ProductListButtonGroup'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { RootState } from 'app/store'
import { useSelector } from 'react-redux'

import { DownloadAllTemplate, DownloadAllCustomTemplate } from 'models/Product'

export interface IProductListFormContentFields {
  [key: string]: {
    custom_output_history_index: number
    custom_output_name: string
    custom_output_template: boolean
  }[]
}

const ProductListPage = () => {
  const location = useLocation()
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const searchParams = new URLSearchParams(location.search)
  const step = searchParams.get('step')

  const [productList, setProductList] = useState<IProductListFormContentFields>({
    '': [
      {
        custom_output_history_index: 0,
        custom_output_name: '',
        custom_output_template: false,
      },
    ],
  })

  const [uploadData, setUploadData] = useState<{
    step: string
    output_index: string
    file: File
  }>({
    step: 'KOM',
    output_index: '',
    file: new File([''], ''),
  })

  // 템플릿 업로드 모달창 상태
  const [templateUploadModalShow, setTemplateUploadModalShow] = useState<boolean>(false)

  // 템플릿업로드 모달창 On/Off 버튼 핸들러
  const templateUploadModalHandler = (): void => {
    setTemplateUploadModalShow(prev => !prev)

    setUploadData({
      step: 'KOM',
      output_index: '',
      file: new File([''], ''),
    })
  }
  // 템플릿업로드 모달창 확인 버튼 핸들러
  const templateUploadModalSubmitHandler = (): void => {
    try {
      if (uploadData.output_index === '') {
        Swal.fire({
          icon: 'error',
          title: '산출물 종류를 선택해주세요.',
        })
        return
      } else if (uploadData.file.name === '') {
        Swal.fire({
          icon: 'error',
          title: '템플릿 파일을 선택해주세요.',
        })
        return
      }

      const reqData = new FormData()
      reqData.append('custom_output_history_index', uploadData.output_index)
      reqData.append('file', uploadData.file)

      const res = AccessAxios.post('/outputs/template/', reqData).then(() => {
        Swal.fire({
          icon: 'success',
          title: '템플릿 업로드에 성공했습니다.',
        }).then(() => {
          window.location.reload()
        })
      })
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: '템플릿 업로드에 실패했습니다.',
      })
    }

    templateUploadModalHandler()
  }

  const getTemplateList = async () => {
    try {
      const res = (await AccessAxios.get('/outputs/custom/?project_id=' + projectID))
        .data
      setProductList(res.data)

      const listData = Object.keys(res.data)
        .map(key => res.data[key].length)
        .filter(d => d > 0).length

      if (listData === 0) {
        Swal.fire({
          icon: 'info',
          title: '저장된 산출물이 없습니다.',
          text: '테일러링 페이지에서 산출물 저장 후 다시 시도해주세요.',
          confirmButtonText: '확인',
          allowOutsideClick: false,
        }).then((res) => {
          if(res.isConfirmed) {
            window.location.href = `/product/tailoring?project_id=${projectID}&step=${step}`
          }
        })
      }
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: '산출물 조회 실패',
      })
    }
  }

  const uploadSelectChangeHandler = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target

    if (name === 'step') {
      setUploadData(prev => ({
        ...prev,
        step: value,
        output_index: '',
      }))
    } else if (name === 'output_index') {
      setUploadData(prev => ({
        ...prev,
        output_index: value,
      }))
    }
  }

  const uploadFileChangeandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (files) {
      setUploadData(prev => ({
        ...prev,
        file: files[0],
      }))
    }
  }

  // 템플릿 전체 다운로드
  const downloadTemplateHandler = async () => {
    try {
			DownloadAllCustomTemplate(projectID)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '사용자 정의 템플릿에 실패했습니다.',
      })
    }
  }

  // 기본 템플릿 전체 다운로드
  const defaultDownloadTemplateHandler = async () => {
    try {
			await DownloadAllTemplate(projectID)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '기본 템플릿 전체 다운로드에 실패했습니다.',
      })
    }
  }

  useEffect(() => {
    getTemplateList()
  }, [])

  return (
    <div className="mx-12">
      <ProductListTable header={productListFormTitleFields} column={productList} />
      <ProductListButtonGroup
        productList={productList}
        templateUploadModalShow={templateUploadModalShow}
        templateUploadModalHandler={templateUploadModalHandler}
        templateUploadModalSubmitHandler={templateUploadModalSubmitHandler}
        uploadSelectChangeHandler={uploadSelectChangeHandler}
        uploadFileChangeandler={uploadFileChangeandler}
        uploadData={uploadData}
        downloadTemplateHandler={downloadTemplateHandler}
        defaultDownloadTemplateHandler={defaultDownloadTemplateHandler}
      />
    </div>
  )
}

export default ProductListPage

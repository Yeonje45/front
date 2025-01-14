import { useEffect, useState } from 'react'

import ProductConditionPanelButtonGroup from 'components/product/condition/ProductConditionPanelButtonGroup'

import ProductConditionPanel from 'components/product/condition/ProductConditionPanel'
import {
  IProduct,
  testConditionTableHeaders,
} from 'constant/condition/conditionTableFormFields'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { AccessAxios } from 'models'
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom'

const TestConditionPage = () => {
  const location = useLocation()
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const searchParams = new URLSearchParams(location.search)
  const step = searchParams.get('step')

  const [product, setProduct] = useState<IProduct[]>([])

  // 산출물저장소 모달창 상태
  const [repositoryModalShow, setRepositoryModalShow] = useState<boolean>(false)

  // 산출물 및 상세업무 불러오기
  const getDocumentData = async () => {
    try {
      const res = await AccessAxios.get('/reliability/history/?project_id=' + projectID)
      setProduct(() => res.data.data)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: '산출물 조회 실패',
        text: '테일러링 페이지에서 저장된 산출물을 확인해주세요.',
      }).then(() => {
        window.location.href = `/product/tailoring?project_id=${projectID}&step=${step}`
      })
    }
  }

  // 산출물저장소 모달창 열기 버튼 핸들러
  const repositoryOpenModalHandler = () => {
    setRepositoryModalShow(true)
  }

  // 산출물저장소 모달창 닫기 버튼 핸들러
  const repositoryCloseModalHandler = () => {
    setRepositoryModalShow(false)
  }

  // 산출물저장소 모달창 확인 버튼 핸들러
  const repositoryModalHandler = async () => {
    repositoryCloseModalHandler()
  }

  const testConditionUploadHandler = async (reqData: FormData) => {
    await AccessAxios.post("/outputs/history/", reqData).then(() => {
      Swal.fire({
        icon: 'success',
        title: '업로드 성공',
        text: '산출물이 업로드 되었습니다.',
      })
    })
  }

  // 상태 체크 Fatch 요청 Handler
  const testConditionCheckHandler = async (
    output_content_history_index: number,
    output_content_history_state: string,
  ) => {
    await AccessAxios.patch('/outputs/content/', {
      output_content_history_index: output_content_history_index,
      output_content_history_state: output_content_history_state,
    })
  }

  useEffect(() => {
    getDocumentData()
  }, [])

  return (
    <div className="py-2">
      {/* <ProductConditionPanelButtonGroup
        repositoryModalShow={repositoryModalShow}
        repositoryOpenModalHandler={repositoryOpenModalHandler}
        repositoryCloseModalHandler={repositoryCloseModalHandler}
        repositoryModalHandler={repositoryModalHandler}
      />

      <ProductConditionPanel
        panelData={product}
        headers={testConditionTableHeaders}
        uploadHandler={testConditionUploadHandler}
        checkHandler={testConditionCheckHandler}
      /> */}
    </div>
  )
}

export default TestConditionPage

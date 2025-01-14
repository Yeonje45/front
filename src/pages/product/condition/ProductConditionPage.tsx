import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import ProductConditionPanel from 'components/product/condition/ProductConditionPanel'
import {
  IProduct,
  productConditionTableHeaders,
} from 'constant/condition/conditionTableFormFields'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { AccessAxios } from 'models'
import Swal from 'sweetalert2'

const ProductConditionPage = () => {
  const location = useLocation()
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const searchParams = new URLSearchParams(location.search)
  const step = searchParams.get('step')

  const [product, setProduct] = useState<IProduct[]>([])

  // 산출물 및 상세업무 불러오기
  const getDocumentData = async () => {
    try {
      const res = await AccessAxios.get(`/outputs/history/?project_id=${projectID}&current_project_stage_code=${step}`)
      
      if(res.data.data && res.data.data.length === 0) {
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
      setProduct(() => res.data.data)
    } catch (e: any) {
      console.log(e.message)

      Swal.fire({
        icon: 'error',
        title: '산출물 조회 실패',
      })
    }
  }

  // 산출물 상세업무 업로드 Post 요청 Handler
  const productConditionUploadHandler = async (reqData: FormData) => {
    await AccessAxios.post('/outputs/history/', reqData).then(() => {
      Swal.fire({
        icon: 'success',
        title: '산출물 저장소 업로드에 성공했습니다.',
      })
    })
  }

  // 상태 체크 Fatch 요청 Handler
  const productConditionCheckHandler = async (
    output_content_history_index: number,
    output_content_history_state: string,
  ) => {
    await AccessAxios.patch('/outputs/content/', {
      output_content_history_index: output_content_history_index,
      output_content_history_state: output_content_history_state,
    })
  }

  // 해당여부 변경시 API 통신 함수
  const patchCheckHandler = async (output_content_history_index: number, output_content_check: boolean ) => {
    try {
      await AccessAxios.patch('/outputs/history/', {
        output_content_history_index: output_content_history_index,
        output_content_check: output_content_check,
      })
    }
    catch(error: any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: '산출물 해당여부 변경 실패',
      })
    }
  }

  useEffect(() => {
    getDocumentData()
  }, [step])

  return (
    <ProductConditionPanel
      panelData={product}
      headers={productConditionTableHeaders}
      uploadHandler={productConditionUploadHandler}
      checkHandler={productConditionCheckHandler}
      patchCheckHandler={patchCheckHandler}
    />
  )
}

export default ProductConditionPage

import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { CaretRightFill, InfoCircleFill } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'

import {
  IProductTailoringBusinessAddData,
  IProductTailoringBusinessContentFields,
  IProductTailoringFinalContentFields,
  IProductTailoringStandardContentFields,
  productTailoringBusinessTitleFields,
  productTailoringFinalTitleFields,
  productTailoringStandardTitleFields,
} from 'constant/product/productTailoring'

import ProductTailoringContent from 'components/product/tailoring/ProductTailoringContent'

import Button from 'tailwindElement/Button'
import Container from 'tailwindElement/Container'
import Input from 'tailwindElement/Input'
import Popover from 'tailwindElement/Popover'

import { AccessAxios } from 'models'
import ProductTailoringStdTable from 'components/product/tailoring/table/ProductTailoringStdTable'
import ProductTailoringBusinessTable from 'components/product/tailoring/table/ProductTailoringBusinessTable'
import ProductTailoringFinalTable from 'components/product/tailoring/table/ProductTailoringFinalTable'
import BusinessButtonGroup from 'components/product/tailoring/button/BusinessButtonGroup'
import { SaveAsHTMLFileByProudct } from 'components/common/editor/formmat'

const ProductTailoringPage = () => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  // 표준 요구 산출물 목록 데이터
  const [standardDocument, setStandardDocument] = useState<
    IProductTailoringStandardContentFields[]
  >([])
  // 선택한 표준요구 산출물 목록 데이터
  const [activeStandard, setActiveStandard] = useState<number[]>([])

  // 업체 작성 산출물 목록 데이터
  const [businessDocument, setBusinessDocument] = useState<
    IProductTailoringBusinessContentFields[]
  >([])

  // 선택한 업체 작성 산출물 목록 데이터
  const [activeBusiness, setActiveBusiness] = useState<number[]>([])
  // 사업유형 데이터
  const [businessTypeData, setBusinessTypeData] = useState<{
    business_type_index: number
    business_type_name: string
  }>({ business_type_index: 0, business_type_name: '' })

  // 최종 제출 산출물 목록 데이터
  const [finalDocument, setFinalDocument] = useState<
    IProductTailoringFinalContentFields[]
  >([])

  // 산출물 추가 모달창 상태
  const [productAddModalShow, setProductAddModalShow] = useState<boolean>(false)

  // 산출물 작성 목록 추가 데이터
  const [productAddData, setProductAddData] = useState<IProductTailoringBusinessAddData>(
    {
      output_name: '',
      alter_output: 0,
      custom_output_stage: [],
      std_output_alias: '',
    },
  )

  //페이지 렌더링시 기본 데이터 get 함수 호출
  useEffect(() => {
    getStandardDocumentHandler()
    getBusindessDocumentHandler()
  }, [])

  const allActiveHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget

    if (name === 'standard') {
      if (activeStandard.length === standardDocument.length) {
        setActiveStandard([])
      } else {
        setActiveStandard(standardDocument.map(data => data.std_output_index))
      }
    } else if (name === 'business') {
      if (activeBusiness.length === businessDocument.length) {
        setActiveBusiness([])
      } else {
        setActiveBusiness(businessDocument.map(data => data.std_output_index))
      }
    }
  }

  // 테이블 데이터 클릭시 선택된 데이터 state에 저장
  const documentClickHandler = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    activeState: number[],
    setActiveState: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    const id = Number(e.currentTarget.id)

    if (!activeState.includes(id)) {
      setActiveState([...activeState, id])
    } else {
      setActiveState(activeState.filter(data => data !== id))
    }
  }
  const standardDocumentClickHandler = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
  ) => {
    documentClickHandler(e, activeStandard, setActiveStandard)
  }
  const businessDocumentClickHandler = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
  ) => {
    documentClickHandler(e, activeBusiness, setActiveBusiness)
  }

  // 화살표 버튼 클릭시 state에 저장된 document를 가져와서 업체 작성 산출물 목록 페이지에 이동
  const clickMoveDocumentHandler = () => {
    if (activeStandard.length > 0) {
      setBusinessDocument(prev => {
        let setData = [...prev]        

        activeStandard.map(doc => {
          if (!prev.find(d => d.std_output_index === doc)) {
            setData.push({
              std_output_index: doc,
              // 표준 요구 산출물 목록에서 선택한 산출물 이름 가져오기
              std_output_name: standardDocument.find(d => d.std_output_index === doc)!
                .std_output_name,
              // 산출물에 따라 독립문서여부 체크 8,9 SDD, 18,25 SPS
              replacement_output:
                doc === 8 || doc === 9 ? 7 : doc === 18 || doc === 25 ? 19 : null,
              separate_output: [8, 9, 18, 25].includes(doc) ? false : true,
            })
          }
        })

        return setData
      })

      setActiveStandard([])
    } else {
      Swal.fire({
        icon: 'warning',
        title: '표준 요구 산출물을 선택해주세요.',
      })
    }
  }

  // 업체 작성 산출물 목록 독립 문서 여부 체크 함수
  const changeCheckHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setBusinessDocument(prev => {
      let setData = [...prev]

      setData[Number(name)].separate_output = value === 'yes' ? true : false

      return setData
    })
  }

  // 업체 작성 산출물 목록 독립 문서 여부 선택 함수
  const changeSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    setBusinessDocument(prev => {
      let setData = [...prev]

      setData = setData.map(data => ({
        ...data,
        replacement_output:
          Number(name) === data.std_output_index
            ? Number(value)
            : data.replacement_output,
      }))

      return setData
    })
  }

  // 업체 작성 산출물 목록 삭제 함수
  const businessProductDeleteHandler = () => {
    // 선택된 데이터 삭제
    activeBusiness.map(data => {
      setBusinessDocument(prev => {
        let setData = [...prev]
        setData = setData.filter(doc => doc.std_output_index !== data)
        return setData
      })
    })

    Swal.fire({
      icon: activeBusiness.length ? 'success' : 'warning',
      title: activeBusiness.length
        ? '산출물이 삭제되었습니다.'
        : '삭제할 산출물을 선택해주세요.',
      showConfirmButton: false,
      timer: 1500,
    })
    setActiveBusiness([])
  }

  // 산출물 추가 모달창 열기 버튼 핸들러
  const productAddOpenModalHandler = (): void => {
    setProductAddData({
      output_name: '',
      alter_output: 0,
      custom_output_stage: [],
      std_output_alias: '',
    })

    setProductAddModalShow(true)
  }

  // 산출물 추가 모달창 닫기 버튼 핸들러
  const productAddCloseModalHandler = (): void => {
    setProductAddModalShow(false)
  }

  // 산출물 추가 모달창 입력 핸들러
  const productAddDataInputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setProductAddData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // 산출물 추가 모달창 대체 산출물 선택 핸들러
  const productAddDataSelectHandler = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setProductAddData(prev => ({
      ...prev,
      alter_output: Number(e.target.value),
    }))
  }

  // 산출물 추가 모달창 저장 버튼 핸들러
  const productAddModalHandler = (): void => {
    if (productAddData.output_name === '') {
      Swal.fire({
        icon: 'warning',
        title: '산출물 종류를 입력해주세요.',
      })
    } else if (productAddData.alter_output === 0) {
      Swal.fire({
        icon: 'warning',
        title: '대체되는 산출물을 선택해주세요.',
      })
    } else if (productAddData.custom_output_stage.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '개발단계를 선택해주세요.',
      })
    } else if (productAddData.std_output_alias.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '표준 산출물을 선택해주세요.',
      })
    } else {
      if (businessDocument.find(d => d.std_output_name === productAddData.output_name)) {
        Swal.fire({
          icon: 'warning',
          title: '중복되는 산출물입니다.',
        })
        return
      } else {
        Swal.fire({
          icon: 'success',
          title: '산출물이 추가되었습니다.',
          showConfirmButton: false,
          timer: 1500,
        })

        setBusinessDocument(prev => [
          ...prev,
          {
            std_output_index: Number(`999` + prev.length),
            std_output_name: productAddData.output_name,
            output_name: productAddData.output_name,
            replacement_output: null,
            separate_output: true,
            alter_output: productAddData.alter_output,
            custom_output_stage: productAddData.custom_output_stage,
            std_output_alias: productAddData.std_output_alias,
          },
        ])

        setProductAddModalShow(false)
      }
    }
  }

  // 최종 제출 산출물 저장
  const productHistoryOpenModalHandler = (): void => {
    if (finalDocument.find(d => d.separate_output !== undefined)) {
      Swal.fire({
        icon: 'question',
        title: '최종 제출 산출물을 저장하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '저장',
        cancelButtonText: '취소',
      }).then(result => {
        if (result.isConfirmed) {
          postFinalDocumentHandler()
        }
      })
    } else {
      Swal.fire({
        icon: 'warning',
        title: '최종 제출 산출물 작성 대상이 없습니다.',
      })
    }
  }

  // 산출물 추가 모달창 개발단계 선택 핸들러
  const productAddDataClickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { name } = e.currentTarget

    if (productAddData.custom_output_stage.includes(name)) {
      setProductAddData(prev => ({
        ...prev,
        custom_output_stage: prev.custom_output_stage.filter(d => d !== name),
      }))
    } else {
      setProductAddData(prev => ({
        ...prev,
        custom_output_stage: [...prev.custom_output_stage, name],
      }))
    }
  }

  // 최종 제출 산출물 조회 버튼 클릭했을 때 최종 제출 산출물 계산하는 함수
  const finalDocumentHandler = () => {
    // 업체 작성 산출물 목록에서 독립 문서 여부가 아니오인 문서 작성 내용
    const separateData = businessDocument.filter(
      d => d.separate_output !== true && d.replacement_output === null,
    )

    if (separateData.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '독립 문서 여부에 포함 문서를 선택해주세요.',
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      setFinalDocument(prev => {
        let businessData = [...businessDocument]

        // 최종제출산출물 목록 기본 산출물의 Index 값
        const finalDoc = finalDocument.filter(d =>
          standardDocument.find(data => data.std_output_name === d.std_output_name),
        )

        // 추가된 산출물에 (테일러링)표시 추가
        const newData = businessData
          // 기본 산출물에 포함되어 있지 않은 경우
          .filter(
            d =>
              finalDoc.find(data => data.std_output_index === d.std_output_index) ===
              undefined,
          )
          .map(d => ({
            ...d,
            std_output_name: `${d.std_output_name}(테일러링)`,
          }))

        let setData = [...prev]

        setData = [...finalDoc, ...newData]

        setData = setData.map(d => {
          const data = businessData.find(
            data => data.std_output_index === d.std_output_index,
          )
          return {
            ...d,
            replacement_output: data?.replacement_output || null,
            separate_output: data?.separate_output
              ? true
              : data?.replacement_output
              ? false
              : 'NA',
          }
        })

        return setData
      })

      Swal.fire({
        icon: 'success',
        title: '최종 제출 산출물이 조회되었습니다.',
        showConfirmButton: false,
        timer: 1500,
      })

      setActiveBusiness([])
    }
  }

  // 표준 요구 산출물 목록 데이터 호출 함수
  const getStandardDocumentHandler = async () => {
    try {
      const res = await AccessAxios.get('/outputs/standard/').then(res => res.data)
      setStandardDocument(res.data)

      // 최종 제출 산출물 데이터 정의
      const finalIndexs = [
        2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 16, 17, 18, 19, 23, 24, 25, 26, 30, 31, 32,
        34, 35, 36, 37,
      ]

      const finalData = res.data.filter((d: any) =>
        finalIndexs.includes(d.std_output_index),
      )

      setFinalDocument(
        finalData.map((d: any) => ({
          std_output_index: d.std_output_index,
          std_output_name: d.std_output_name,
        })),
      )
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '표준 요구 산출물 목록 데이터를 가져오는데 실패했습니다.',
      })
    }
  }
  // 업체 작성 산출물 목록 데이터 호출 함수
  const getBusindessDocumentHandler = async () => {
    try {
      const res = await AccessAxios.post('/outputs/standard/', {
        project_id: projectID,
      }).then(res => res.data)

      // business_type_index
      // business_type_name
      setBusinessTypeData({
        business_type_index: res.data.business_type_index,
        business_type_name: res.data.business_type_name,
      })
      
      setBusinessDocument(res.data.write_output_list)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '업체 작성 산출물 목록 데이터를 가져오는데 실패했습니다.',
      })
    }
  }

  // 최종 제출 산출물 데이터 저장 함수
  const postFinalDocumentHandler = async () => {
    try {
      Swal.fire({
        icon: 'info',
        title: '최종 제출 산출물 저장 중입니다.',
        showConfirmButton: false,
        allowOutsideClick: false,
      })
      
      await AccessAxios.post('/outputs/custom/', {
        std_business_type_index: businessTypeData.business_type_index,
        custom_business_type_name: businessTypeData.business_type_name,
        project_id: projectID,
        custom_outputs: finalDocument,
      }).then(res => {
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '최종 제출 산출물이 저장되었습니다.',
            showConfirmButton: false,
            timer: 1500,
          })
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '최종 제출 산출물 저장에 실패했습니다.',
      })
    }
  }

	const createResultHWPFile = async (): Promise<void> => {
		const result_table = document.getElementById('product_tailoring_result_table')!.outerHTML.toString()
		SaveAsHTMLFileByProudct(result_table, '테일러링 산출물 파일')
	}

  return (
    <Container className="flex justify-between bg-[#fbfdff] border p-3">
      <ProductTailoringContent
        title={'표준 요구 산출물 목록'}
        popup={
          <Popover button={<InfoCircleFill size={18} />} placement="bottom">
            <Popover.Body>
              방위사업청 매뉴얼 제2022-6호(개정 : 2022. 12. 2.)
            </Popover.Body>
          </Popover>
        }>
        <ProductTailoringStdTable
          header={productTailoringStandardTitleFields}
          column={standardDocument}
          activeDocument={activeStandard}
          documentClickHandler={standardDocumentClickHandler}
          businessDocument={businessDocument}
        />
        <Button
          onClick={allActiveHandler}
          name="standard"
          variant={activeStandard.length === standardDocument.length ? 'danger' : ''}>
          {activeStandard.length === standardDocument.length ? '전체 해제' : '전체 선택'}
        </Button>
      </ProductTailoringContent>
      <Button
        onClick={clickMoveDocumentHandler}
        className="mt-[10%] h-20 hover:bg-gray-200 border"
        variant="light">
        <CaretRightFill size={50} />
      </Button>

      <ProductTailoringContent
        title="업체 작성 산출물 목록"
        popup={
          <Popover button={<InfoCircleFill size={18} />} placement="bottom">
            <Popover.Body>
              <div>• 사업 유형 및 사업 공고에 따라 업체 작성 산출물이 다름</div>
              <br />
              <div>
                • 매뉴얼에서 명확히 나와있는 무기체계 연구개발(탐색개발/체계개발)
                사업유형을 제외하고 <br /> 나머지 사업유형은 규격화 대상 산출물을 기본
                산출물로 도시함
              </div>
              <br />
              <div>
                • 규격화 대상 산출물은 ‘표준화 업무규정[시행 2023. 8. 3.] <br />
                [방위사업청훈령 제805호, 2023. 8. 3]’ 제 46조(소프트웨어 규격화) 참고
              </div>
            </Popover.Body>
          </Popover>
        }>
        <div className="flex items-center py-2 gap-5 whitespace-nowrap">
          <label>사업 유형</label>
          <Input disabled value={`${businessTypeData.business_type_name}`} />
        </div>

        <ProductTailoringBusinessTable
          header={productTailoringBusinessTitleFields}
          column={businessDocument}
          activeDocument={activeBusiness}
          clickDocumentHandler={businessDocumentClickHandler}
          changeCheckHandler={changeCheckHandler}
          changeSelectHandler={changeSelectHandler}
          standardDocument={standardDocument}
        />
        <BusinessButtonGroup
          allActiveHandler={allActiveHandler}
          businessDocument={businessDocument}
          activeBusiness={activeBusiness}
          businessProductDeleteHandler={businessProductDeleteHandler}
          productAddModalShow={productAddModalShow}
          productAddOpenModalHandler={productAddOpenModalHandler}
          productAddCloseModalHandler={productAddCloseModalHandler}
          productAddModalHandler={productAddModalHandler}
          productAddDataInputHandler={productAddDataInputHandler}
          productAddData={productAddData}
          standardDocument={standardDocument}
          productAddDataSelectHandler={productAddDataSelectHandler}
          productAddDataClickHandler={productAddDataClickHandler}
        />
      </ProductTailoringContent>
      <Button
        onClick={finalDocumentHandler}
        className="mt-[10%] h-20 hover:bg-gray-200 border"
        variant="light">
        <CaretRightFill size={50} />
      </Button>

      <ProductTailoringContent
        title="최종 제출 산출물"
        popup={
          <Popover button={<InfoCircleFill size={18} />} placement="bottom">
            <Popover.Body>
              방위사업청 매뉴얼 제2022-6호(개정 : 2022. 12.2.) <br />
              5. 테일러링 지침 참고
            </Popover.Body>
          </Popover>
        }>
        <ProductTailoringFinalTable
          header={productTailoringFinalTitleFields}
          column={finalDocument}
          standardDocument={standardDocument}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={createResultHWPFile}>한글화</Button>
          <Button onClick={productHistoryOpenModalHandler}>저장</Button>
        </div>
      </ProductTailoringContent>
    </Container>
  )
}

export default ProductTailoringPage

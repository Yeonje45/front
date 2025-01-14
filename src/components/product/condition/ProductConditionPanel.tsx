import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import {
  IActiveOutput,
  IProduct,
  IUploadData,
} from 'constant/condition/conditionTableFormFields'
import ProductCondiitonWorkEditModal from './ProductConditionWorkEditModal'
import ProductConditionUploadModal from './ProductCondiitonUploadModal'
import PanelBody from 'components/common/panels/PanelBody'
import Input from 'tailwindElement/Input'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'

interface IProps {
  panelData: IProduct[]
  headers: string[]
  uploadHandler: (reqData: FormData) => void
  checkHandler: (
    output_content_history_index: number,
    output_content_history_state: string,
  ) => void
  patchCheckHandler: (output_content_history_index: number, output_content_check: boolean) => void
}

const ProductConditionPanel = ({
  panelData,
  headers,
  uploadHandler,
  checkHandler,
  patchCheckHandler
}: IProps) => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id
  const searchParams = new URLSearchParams(window.location.search)
  const step = searchParams.get('step')
  
  // 전체 데이터
  const [product, setProduct] = useState<IProduct[]>([])

  // 하단 탭 데이터
  const [productTab, setProductTab] = useState<string[]>([])

  // 선택된 산출물의 상세업무 저장
  const [activeOutput, setActiveOutput] = useState<IActiveOutput[]>([])

  // 업로드 모달창 상태
  const [uploadModalShow, setUploadModalShow] = useState<string>('')

  const [uploadData, setUploadData] = useState<IUploadData>({
    output_index: '',
    chapter_items: [],
    file: new File([''], ''),
  })

  // 업로드 모달창 열기 버튼 핸들러
  const uploadOpenModalHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = e.currentTarget.name

    if (activeOutput.filter(d => d.output_index == index).length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '산출물 상세업무를 선택해주세요.',
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      setUploadModalShow(index)

      setUploadData({
        output_index: index,
        chapter_items: [
          ...activeOutput
            .filter(d => d.output_index == index)
            .map(d => ({
              work_index: d.output_content.output_work_index,
              work_name: d.output_content.output_work_name,
              chapter: '',
              update: '',
            })),
        ],
        file: new File([''], ''),
      })
    }
  }

  // 업로드 모달창 닫기 버튼 핸들러
  const uploadCloseModalHandler = () => {
    setUploadModalShow('')

    setUploadData({
      output_index: '',
      chapter_items: [],
      file: new File([''], ''),
    })
  }

  // 업로드 모달창 확인 버튼 핸들러
  const uploadModalHandler = async () => {
    try {
      const items = uploadData.chapter_items.map(d => ({
        output_content_history_index: d.work_index,
        chapter: d.chapter,
        update: d.update,
      }))

      const reqData = new FormData()
      reqData.append('content_items', JSON.stringify(items))
      reqData.append('file', uploadData.file)
      
      if (uploadData.file.name === '') {
        Swal.fire({
          icon: 'error',
          title: '템플릿 파일을 선택해주세요.',
        })

        return
      }
      uploadHandler(reqData)

    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: '산출물 저장소 업로드에 실패했습니다.',
      })
    }
    
    uploadCloseModalHandler()
    localStorage.removeItem('output_content')
  }

  // 업로드 모달창 핸들러
  const uploadInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const [name, index] = e.target.name.split('_')

    let setData = [...uploadData.chapter_items]

    if (name === 'chapter') {
      setData[Number(index)].chapter = value
    } else if (name === 'update') {
      setData[Number(index)].update = value
    }

    setUploadData(prev => ({
      ...prev,
      chapter_items: setData,
    }))
  }

  const uploadFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    
    if (files) {
      setUploadData(prev => ({
        ...prev,
        file: files[0],
      }))
    }
  }

  // 클릭된 상세업무와 그 산출물 종류를 저장하는 함수
  const documentClickHandler = (e: React.MouseEvent<any>) => {
    const [index_st, index_nd] = e.currentTarget.ariaLabel.split('_').map(Number) // 산출물 번호, 상세 업무 번호
    // 상세업무 데이터

    const work = product
      .filter(d => Number(d.custom_output_history_index) === index_st)[0]
      .output_contents.filter(
        d => Number(d.output_content_history_index) === index_nd,
      )[0]

    // 상세 업무 번호가 같으면 이미 있는 상세업무
    const checkItem =
      activeOutput.filter(
        d => d.output_content.output_work_index === index_nd.toString(),
      ).length > 0

    if (!checkItem) {
      setActiveOutput(prev =>
        [
          ...prev,
          {
            output_index: index_st.toString(),
            output_content: {
              output_work_index: index_nd.toString(),
              output_work_name: work.output_content_name,
            },
          },
        ].sort((a, b) => Number(a.output_index) - Number(b.output_index)),
      )
    } else {
      setActiveOutput(
        activeOutput.filter(
          d => d.output_content.output_work_index !== index_nd.toString(),
        ),
      )
    }
  }

  // 해당 여부 클릭 핸들러
  const checkChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [product_index, content_index] = e.target.name.split("_")
    
    setProduct((prev) => {
      const setData = [...prev]
      
      const product_content = setData.find((d) => d.custom_output_history_index == product_index)
      const output_content = product_content!.output_contents.find((d) => d.output_content_history_index == content_index)
      output_content!.output_content_check = e.target.checked
      
      return setData
    })    

    patchCheckHandler(parseInt(content_index), e.target.checked)
  }

  // 상태 Radio 버튼 State 핸들러
  const stateChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const [index_st, index_nd, history_index] = e.target.name.split('_').map(Number)

    checkHandler(history_index, e.target.value)

    setProduct(() => {
      let setData = [...product]

      setData[index_st].output_contents[index_nd].output_content_state = e.target.value

      return setData
    })
  }

  // 하단 Tab 클릭 핸들러
  const tabClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (productTab.includes(e.currentTarget.name)) {
      setProductTab(productTab.filter(d => d != e.currentTarget.name))
    } else {
      setProductTab([...productTab, e.currentTarget?.name])
    }
  }

  useEffect(() => {
    if (panelData.length > 0) {
      setProduct(panelData)
    }
  }, [panelData])

  useEffect(() => {
    if (activeOutput) {
      setActiveOutput([])
    }
  }, [step])

  return (
    <div className="flex flex-col gap-5">
      {panelData.map((col, index_st) => (
        <PanelContainer
          key={index_st}
          className={`${
            productTab.includes(col.custom_output_history_index.toString()) && 'hidden'
          }`}>
          <PanelHeader
            title={col.output_name}
            className="flex justify-between items-center"
            rightElement={
              <div>
                <ProductCondiitonWorkEditModal
                  data={col.output_contents}
                  index={col.custom_output_history_index}
                  name={col.output_name}
                />
                <ProductConditionUploadModal
                  uploadModalShow={uploadModalShow}
                  uploadModalHandler={uploadModalHandler}
                  uploadOpenModalHandler={uploadOpenModalHandler}
                  uploadCloseModalHandler={uploadCloseModalHandler}
                  uploadInputChangeHandler={uploadInputChangeHandler}
                  uploadFileChangeHandler={uploadFileChangeHandler}
                  col={col}
                  activeOutput={activeOutput}
                  uploadData={uploadData}
                  setUploadData={setUploadData}
                />
              </div>
            }
          />
          <PanelBody className="table-border">
            <table className="w-full h-full text-lg">
              <thead>
                <tr>
                  {headers.map((head, index_st) => (
                    <th key={index_st} className="text-center p-3 border">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {col.output_contents.map((row, index_nd) => {
                  return (
                    <tr key={index_nd}>
                      <td
                        onClick={documentClickHandler}
                        aria-label={
                          col.custom_output_history_index +
                          '_' +
                          row.output_content_history_index
                        }
                        className={`w-[25%] !text-start hover:bg-[rgba(0,0,0,0.075)] ${
                          activeOutput.filter(
                            d =>
                              Number(d.output_content.output_work_index) ===
                              Number(row.output_content_history_index),
                          ).length === 1 && '!bg-[#dddddd]'
                        }`}>
                        {row.output_content_name}
                      </td>
                      <td className="w-[10%]">
                        <Input.Checkbox
                          defaultChecked={row.output_content_check}
                          name={`${col.custom_output_history_index}_${row.output_content_history_index}`}
                          onChange={checkChangeHandler}
                        />
                      </td>
                      <td
                        className={`w-[15%] ${ !row.output_content_check && '!text-gray-400'}`}>
                        <div className="flex justify-center gap-2">
                          <Input.Radio
                            label="진행"
                            name={
                              index_st.toString() +
                              '_' +
                              index_nd.toString() +
                              '_' +
                              row.output_content_history_index.toString()
                            }
                            value={'prcs'}
                            checked={row.output_content_state === 'prcs'}
                            disabled={!row.output_content_check}
                            onChange={stateChangeHandler}
                          />
                          <Input.Radio
                            label="완료"
                            name={
                              index_st.toString() +
                              '_' +
                              index_nd.toString() +
                              '_' +
                              row.output_content_history_index.toString()
                            }
                            value={'done'}
                            checked={row.output_content_state === 'done'}
                            disabled={!row.output_content_check}
                            onChange={stateChangeHandler}
                          />
                        </div>
                      </td>
                      <td
                        className={`w-[10%] ${ !row.output_content_check && '!text-gray-400'}`}>
                        {row.output_content_update_date}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </PanelBody>
        </PanelContainer>
      ))}

      <div className="fixed bottom-0 lg:left-60">
        {panelData.map((data, index_st) => (
          <Button
            key={index_st}
            name={data.custom_output_history_index}
            onClick={tabClickHandler}
            variant={`${
              !productTab.includes(data.custom_output_history_index.toString())
                ? 'secondary'
                : 'light'
            }`}
            className={`min-w-[100px] rounded-l-none rounded-tr-[20px] rounded-br-none text-gray-700`}>
            {data.output_name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default ProductConditionPanel

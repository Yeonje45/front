import { RootState } from 'app/store'
import PanelBody from 'components/common/panels/PanelBody'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import { radioClickHandler } from 'components/common/util/TableData'
import { IProjectTypeData, IRankIdentificationInputFields } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields'
import {
  targetIdentificationSelectApplySWFields,
  targetIdentificationSelectDevLangCommentFields,
  targetIdentificationSelectDevLangFields,
  targetIdentificationSelectTestUnitFields,
  targetIdentificationSelectTypeCommentFields,
  targetIdentificationSelectTypeFields,
  targetIdentificationTableHeaderFields,
} from 'constant/test_manage/sw-reliability-test-plan/targetIdentificationFields'
import { AccessAxios } from 'models'
import { useEffect, useRef, useState } from 'react'
import { CaretRightFill, XSquareFill } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'
import Container from 'tailwindElement/Container'
import Input from 'tailwindElement/Input'

interface IProps {
  targetTableData: ITargetTableData[]
  projectTypeData: IProjectTypeData
  getRankTypeData: () => void
}

export interface ITargetTableData {
  [key: string]: string | string[] | undefined | { static: string; dynamic: string } | null
  reliability_test_index: string | null
  testUnit: string
  unitName?: string
  devLang: string
  langEtc?: string
  applySW: string
  isAlreadyDevel: string[]
  targetTest?: { static: string; dynamic: string }
}

const TargetIdentification = ({ targetTableData, projectTypeData, getRankTypeData }: IProps) => {
  const projectID = useSelector((state: RootState) => state.project).project.project_id

  const [colData, setColData] = useState<ITargetTableData[]>([])

  // 사업 유형 및 시험 단위는 다른 페이지에서 값을 가져옴
  const [inputData, setInputData] = useState<ITargetTableData>({
    reliability_test_index: null,
    testUnit: '',
    unitName: '',
    devLang: '',
    langEtc: '',
    applySW: '',
    isAlreadyDevel: ['', '', ''],
    targetTest: { static: '', dynamic: '' },
  })

  const [delData, setDelData] = useState<number[]>([])
  const scrollRef = useRef<HTMLTableElement | null>(null)

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'testUnit') {
      setInputData({
        ...inputData,
        testUnit: value,
        unitName: '',
      })
    } else if (name === 'devLang') {
      setInputData({
        ...inputData,
        devLang: value,
        langEtc: '',
      })
    }
    else {
      setInputData({
        ...inputData,
        [name]: value,
      })
    }
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'unitName') {
      setInputData({
        ...inputData,
        unitName: value,
      })
    } else if (name === 'langEtc') { 
      setInputData({
        ...inputData,
        langEtc: value,
      })
    } else if (name.split('-')[1] === 'radio') {
      // radio
      let setAlreadyDevelData = inputData.isAlreadyDevel
      let setTargetTestData = inputData.targetTest
      setAlreadyDevelData[Number(name.split('-')[2])] = value

      if (!setAlreadyDevelData.includes('')) {
        if (setAlreadyDevelData[0] === 'yes' || setAlreadyDevelData[1] === 'yes') {
          if (setAlreadyDevelData[2] === 'no') {
            setTargetTestData = { static: 'X', dynamic: 'X' }
          } else {
            setTargetTestData = { static: '○', dynamic: '○' }
          }
        } else {
          setTargetTestData = { static: '○', dynamic: '○' }
        }
      }

      setInputData({
        ...inputData,
        isAlreadyDevel: setAlreadyDevelData,
        targetTest: setTargetTestData,
      })
    }
  }

  const handleSaveData = () => {
    if (inputData.testUnit === '') {
      Swal.fire({
        icon: 'error',
        title: '시험단위를 선택하세요.',
      })
    } else if (inputData.unitName === '') {
      Swal.fire({
        icon: 'error',
        title: `${
          targetIdentificationSelectTestUnitFields[Number(inputData.testUnit)]
        }를(을) 입력하세요.`,
      })
    } else if (inputData.devLang === '') {
      Swal.fire({
        icon: 'error',
        title: '개발언어를 선택하세요.',
      })
    } else if (inputData.devLang === '4' && inputData.langEtc === '') {
      Swal.fire({
        icon: 'error',
        title: '개발언어를 입력하세요.',
      })
    } else if (inputData.applySW === '') {
      Swal.fire({
        icon: 'error',
        title: '적용대상 SW를 선택하세요.',
      })
    } else if (inputData.applySW === 'legacy' && inputData.isAlreadyDevel.includes('')) {
      Swal.fire({
        icon: 'error',
        title: '적용 대상 SW 유형 아래 항목을 선택해주세요.',
      })
    } else {      
      Swal.fire({
        icon: 'success',
        title: '입력 완료',
        text: '입력 결과를 확인해주세요.',
      }).then(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollBy({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
          })
        }
      })

      setColData([...colData, {
        ...inputData,
       langEtc: inputData.langEtc?.includes("기타(") ? inputData.langEtc : `기타(${inputData.langEtc})`
      }])
      setInputData({
        reliability_test_index: null,
        testUnit: '',
        unitName: '',
        devLang: '',
        langEtc: '',
        applySW: '',
        isAlreadyDevel: ['', '', ''],
      })
    }
  }

  const handleRemoveData = () => {
    if(delData.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '선택하신 대상 식별 데이터가 없습니다.',
        confirmButtonText: '확인',
      })

      return
    }
    Swal.fire({
      icon: 'warning',
      title: '선택하신 대상 식별 데이터를 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        setColData(prev => prev.filter((_, index) => !delData.includes(index)))
        Swal.fire({
          icon: 'success',
          title: '삭제 완료되었습니다.',
          confirmButtonText: '확인',
        })

        setDelData([])
      }
    })
  }

  const delDataChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.currentTarget

    if(checked){
      setDelData([...delData, Number(e.currentTarget.name)])
    }
    else {
      setDelData(delData.filter((data) => data !== Number(name)))
    }
  }

  const handleSaveBtn = () => {
    try {
      AccessAxios.post('/reliability/target/', {
        project_id: projectID,
        reliability_tests: colData.map((d) => ({
          reliability_test_index: d.reliability_test_index,
          reliability_test_unit_type: targetIdentificationSelectTestUnitFields[Number(d.testUnit)],
          reliability_test_unit_name: d.unitName,
          reliability_test_language: d.devLang === "4" ? d.langEtc : targetIdentificationSelectDevLangFields[Number(d.devLang)],
          target_sw: d.applySW,
          is_reliability_static: d.targetTest?.static === "X" ? "0" : d.targetTest?.static === "○" ? "1" : "2",
          is_reliability_dynamic: d.targetTest?.dynamic === "X" ? "0" : d.targetTest?.dynamic === "○" ? "1" : "2"
        }))
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '저장 완료',
            confirmButtonText: '확인',
          }).then(() => {
            getRankTypeData()
            setColData([])
          })
        }
      })
    }
    catch(e: any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: '대상 식별 데이터를 저장하는데 실패했습니다.',
      })
    }
  }

  useEffect(() => {
    if (inputData.applySW !== '1') {
      if (projectTypeData.std_business_type_index === '1' || projectTypeData.std_business_type_index === '5' || projectTypeData.std_business_type_index === '6') {
        setInputData({
          ...inputData,
          targetTest: { static: '○', dynamic: '○' },
        })
      } else {
        setInputData({
          ...inputData,
          targetTest: { static: '△', dynamic: '△' },
        })
      }
    }
  }, [projectTypeData, inputData.applySW])

  useEffect(() => {
    if(targetTableData.length) {
      setColData(targetTableData)
    }
  }, [targetTableData])

  return (
    <PanelContainer id="1">
      <PanelHeader title="1. 대상 식별" />
      <PanelBody>
        <Container fluid className='flex w-full gap-5 justify-between'>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <Input.InputLabel label='사업 유형' value={targetIdentificationSelectTypeFields[Number(projectTypeData.std_business_type_index) - 1] || ""} disabled />
              {projectTypeData.custom_business_type_name ? (
                <Input value={projectTypeData.custom_business_type_name} disabled />
              )
                : null
              }
              <div className="text-sm text-red-500 whitespace-pre-line">
                {targetIdentificationSelectTypeCommentFields[Number(projectTypeData.std_business_type_index) - 1]}
              </div>
            </div>
            <div className="flex flex-col">
              신뢰성 시험 단위를 선택하세요.
              <div className="flex gap-2">
                <Input.SelectGroup className="w-full">
                  <Input.Select
                    value={inputData.testUnit}
                    label="시험단위"
                    name="testUnit"
                    onChange={handleChangeSelect}>
                    <Input.Option value={""}>선택</Input.Option>
                    {targetIdentificationSelectTestUnitFields.map((unit, index_st) => (
                      <Input.Option key={index_st} value={index_st}>
                        {unit}
                      </Input.Option>
                    ))}
                  </Input.Select>
                </Input.SelectGroup>
                {inputData.testUnit && (
                  <div className="flex items-end w-full gap-2">
                    <Input.InputLabel
                      label={
                        targetIdentificationSelectTestUnitFields[
                          Number(inputData.testUnit)
                        ]
                      }
                      name="unitName"
											value={inputData.unitName}
                      onChange={handleChangeInput}
                      placeholder={`${
                        targetIdentificationSelectTestUnitFields[
                          Number(inputData.testUnit)
                        ]
                      }를(을) 입력하세요.`}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <Input.SelectGroup className="w-full">
                  <Input.Select
                    value={inputData.devLang}
                    label="개발 언어를 선택하세요."
                    name="devLang"
                    onChange={handleChangeSelect}>
                    <Input.Option value={""}>선택</Input.Option>
                    {targetIdentificationSelectDevLangFields.map((lang, index_st) => (
                      <Input.Option key={index_st} value={index_st}>
                        {lang}
                      </Input.Option>
                    ))}
                  </Input.Select>
                </Input.SelectGroup>
                {inputData.devLang === '4' && (
                  <div className="w-full">
                    <Input
                      placeholder="개발언어를 입력하세요."
                      name="langEtc"
											value={inputData.langEtc}
                      onChange={handleChangeInput}
                    />
                  </div>
                )}
              </div>

              {inputData.devLang && (
                <div className="text-red-500">
                  {
                    targetIdentificationSelectDevLangCommentFields[
                      Number(inputData.devLang)
                    ]
                  }
                </div>
              )}
            </div>
            <div className="flex">
              <Input.SelectGroup className="w-full">
                <Input.Select
                  value={inputData.applySW}
                  label="적용 대상 SW 유형"
                  name="applySW"
                  onChange={handleChangeSelect}>
                  <Input.Option value={""}>선택</Input.Option>
                  {targetIdentificationSelectApplySWFields.map((sw, index_st) => (
                    <Input.Option key={index_st} value={sw.value}>
                      {sw.name}
                    </Input.Option>
                  ))}
                </Input.Select>
              </Input.SelectGroup>
            </div>
            {inputData.applySW === 'legacy' && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  1. 과거에 신뢰성 시험을 수행하였는가?
                  <div className="flex gap-2">
                    <Input.Radio
                      label="예"
                      name="target-radio-0"
                      value="yes"
                      onChange={handleChangeInput}
                    />
                    <Input.Radio
                      label="아니오"
                      name="target-radio-0"
                      value="no"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  2.기규격화 SW인가?
                  <div className="flex gap-2">
                    <Input.Radio
                      label="예"
                      name="target-radio-1"
                      value="yes"
                      onChange={handleChangeInput}
                    />
                    <Input.Radio
                      label="아니오"
                      name="target-radio-1"
                      value="no"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  3.수정하였는가?
                  <div className="flex gap-2">
                    <Input.Radio
                      label="예"
                      name="target-radio-2"
                      value="yes"
                      onChange={handleChangeInput}
                    />
                    <Input.Radio
                      label="아니오"
                      name="target-radio-2"
                      value="no"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={handleSaveData}
            className="mt-[10%] h-14 hover:bg-gray-200 border"
            variant="light">
            <CaretRightFill size={30} />
          </Button>
          <div className="w-3/4 px-10 py-2 bg-gray-100 border rounded-lg">
            <div className="h-[400px] overflow-y-auto" ref={scrollRef}>
              <table className="w-full text-lg table-border">
                <thead>
                  <tr>
                    {targetIdentificationTableHeaderFields.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colData.length ? colData.map((data, index_st) => (
                    <tr key={index_st}>
                      <td onClick={radioClickHandler}>
                        <Input.Checkbox checked={delData.findIndex((d) => index_st === d) >= 0} onChange={delDataChangeHandler} name={index_st.toString()} />
                      </td>
                      <td>{data.unitName}</td>
                      <td>
                        {targetIdentificationSelectApplySWFields.find((d) => d.value === data.applySW)?.name}
                      </td>
                      <td>
                        {data.devLang === '4'
                          ? data.langEtc
                          : targetIdentificationSelectDevLangFields[
                              Number(data.devLang)
                            ]}
                      </td>
                      <td>{data.targetTest?.static}</td>
                      <td>{data.targetTest?.dynamic}</td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan={6} className="h-[340px] text-gray-500">대상식별 데이터가 존재하지 않습니다.</td>
                  </tr>
                }
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-2 gap-2">
              <Button variant={'danger'} onClick={handleRemoveData}>
                삭제
              </Button>

              <Button onClick={handleSaveBtn}>저장</Button>
            </div>
          </div>
        </Container>
      </PanelBody>
    </PanelContainer>
  )
}

export default TargetIdentification

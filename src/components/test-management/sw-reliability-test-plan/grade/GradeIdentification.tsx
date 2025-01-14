import PanelBody from 'components/common/panels/PanelBody'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import Button from 'tailwindElement/Button'
import Container from 'tailwindElement/Container'

import { Fragment, useEffect, useRef, useState } from 'react'
import Input from 'tailwindElement/Input'
import { IFileData, IRankIdentificationInputDataSelect, IRankIdentificationInputFields, IRankIdentificationStaticInput, rankIdentificationInputDataErrorMessages, rankIdentificationStaticInputFields, rankIdentificationStaticSelectFileNameFields } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'

interface IProps {
  rankTableData: IRankIdentificationInputFields[]
  reliability_plan_index: string
  getRankTypeData: () => void
  postActiveSaveListData: (reliability_plan_index: string) => void
}

interface IInputData {
  [index: string]: string | IRankIdentificationInputDataSelect | File
  reliability_test_language: string
  coding_rule_name: IRankIdentificationInputDataSelect,
  coding_rule: File,
  coding_rule_tool: IRankIdentificationInputDataSelect
  coding_rule_version: string
  secure_name: IRankIdentificationInputDataSelect,
  secure: File,
  secure_tool: IRankIdentificationInputDataSelect
  secure_version: string,
  code_metric_name: IRankIdentificationInputDataSelect,
  code_metric: File,
  code_metric_tool: IRankIdentificationInputDataSelect
  code_metric_version: string
  dynamic_test_tool: IRankIdentificationInputDataSelect
  dynamic_test_version: string
}

const GradeIdentification = ({ rankTableData, reliability_plan_index, getRankTypeData, postActiveSaveListData }: IProps) => {
  // 입력 데이터
  const [inputData, setInputData] = useState<IInputData>({
    reliability_test_language: '',
    coding_rule_name: {
      name: '',
      text: '',
    },
    coding_rule: new File([''], ''),
    coding_rule_tool: {
      name: '',
      text: '',
    },
    coding_rule_version: '',
    secure_name: {
      name: '',
      text: '',
    },
    secure: new File([''], ''),
    secure_tool: {
      name: '',
      text: '',
    },
    secure_version: '',
    code_metric_name: {
      name: '',
      text: '',
    },
    code_metric: new File([''], ''),
    code_metric_tool: {
      name: '',
      text: '',
    },
    code_metric_version: '',
    dynamic_test_tool: {
      name: '',
      text: '',
    },
    dynamic_test_version: '',
  })
  
  const [selectLanguageOptions, setSelectLanguageOptions] = useState<string[]>([])

  // 정적시험 언어가 기타일 때 라디오 박스 체크 여부
  const [checkRadio, setCheckRadio] = useState<string>('yes')

  const fileInputListRef = useRef<(HTMLInputElement | null)[]>([])

  // Input 데이터 Input change 핸들러
  const handleInputDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target
    const [name, type] = e.target.name.split('-')
     
    if(name === 'checkRadio') {
      setCheckRadio(value)
    }
    else if(name === 'reliability_test_language') {
      setInputData(prev => ({
        ...prev,
        [name]: value
      }))

      setCheckRadio('yes')      
    }
    else if (type === "select") {
      setInputData(prev => ({
        ...prev,
        [name]: {
          ...prev[name] as IRankIdentificationInputDataSelect,
          name: value,
        }
      }))
    }
    else if(type === 'text') {
      setInputData(prev => ({
        ...prev,
        [name]: {
          ...prev[name] as IRankIdentificationInputDataSelect,
          text: value,
        }
      }))
    }
    else if (type === 'file') {
      const {files} = e.target as HTMLInputElement
      if(files) {
        setInputData(prev => ({
          ...prev,
          [name]: files[0]
        }))
      }
    }
    else {
      setInputData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // 등급 식별 입력 데이터 저장 핸들러
  const putRankInputData = async () => {    
    try {
      Object.keys(rankIdentificationInputDataErrorMessages).map((key) => {
        if(typeof inputData[key] === "object") { // File, Object
          const object_data = inputData[key] as IRankIdentificationInputDataSelect
          const object_key = rankIdentificationInputDataErrorMessages[key] as IRankIdentificationInputDataSelect

          // name
          if(object_data.name === '' && object_data.text === '') {
            Swal.fire({
              icon: 'warning',
              title: object_key.name,
            })
            throw key
          }
          // text
          else if(object_data.name === '기타' && object_data.text === '' ) {
            Swal.fire({
              icon: 'warning',
              title: object_key.text,
            })
            throw key
          }
          else if(object_data.size == "0") {
            Swal.fire({
              icon: 'warning',
              title: object_key,
            })
            throw key
          }
        }
        else { // String === version 
          if(inputData[key] === '') {
            Swal.fire({
              icon: 'warning',
              title: rankIdentificationInputDataErrorMessages[key]
            })
            throw key 
          }
        }
      })
    }
    catch {
      return
    }    
    try {
      const formData = new FormData()

      formData.append('reliability_plan_index', reliability_plan_index)
      formData.append('reliability_test_language', inputData.reliability_test_language)
      formData.append('coding_rule_name', inputData.coding_rule_name.name === "기타" ? inputData.coding_rule_name.text : inputData.coding_rule_name.name)
      formData.append('coding_rule', inputData.coding_rule)
      formData.append('coding_rule_tool', inputData.coding_rule_tool.name === "기타" ? inputData.coding_rule_tool.text : inputData.coding_rule_tool.name)
      formData.append('coding_rule_version', inputData.coding_rule_version)
      formData.append('secure_name', inputData.secure_name.name === "기타" ? inputData.secure_name.text : inputData.secure_name.name)
      formData.append('secure', inputData.secure)
      formData.append('secure_tool', inputData.secure_tool.name === "기타" ? inputData.secure_tool.text : inputData.secure_tool.name)
      formData.append('secure_version', inputData.secure_version)
      formData.append('code_metric_name', inputData.code_metric_name.name === "기타" ? inputData.code_metric_name.text : inputData.code_metric_name.name)
      formData.append('code_metric', inputData.code_metric)
      formData.append('code_metric_tool', inputData.code_metric_tool.name === "기타" ? inputData.code_metric_tool.text : inputData.code_metric_tool.name)
      formData.append('code_metric_version', inputData.code_metric_version)
      formData.append('dynamic_test_tool', inputData.dynamic_test_tool.name === "기타" ? inputData.dynamic_test_tool.text : inputData.dynamic_test_tool.name)
      formData.append('dynamic_test_version', inputData.dynamic_test_version)

      await AccessAxios.put('reliability/target/', formData).then((res) => {
        Swal.fire({
          icon: 'success',
          title: '등급 식별 입력 데이터가 추가되었습니다.',
          timer: 2000,
        })

        if(reliability_plan_index === "") {
          getRankTypeData()
        }
        else {
          postActiveSaveListData(reliability_plan_index)
        }
				// 입력 데이터 모두 초기화
				setInputData({
					reliability_test_language: '',
					coding_rule_name: {
						name: '',
						text: '',
					},
					coding_rule: new File([''], ''),
					coding_rule_tool: {
						name: '',
						text: '',
					},
					coding_rule_version: '',
					secure_name: {
						name: '',
						text: '',
					},
					secure: new File([''], ''),
					secure_tool: {
						name: '',
						text: '',
					},
					secure_version: '',
					code_metric_name: {
						name: '',
						text: '',
					},
					code_metric: new File([''], ''),
					code_metric_tool: {
						name: '',
						text: '',
					},
					code_metric_version: '',
					dynamic_test_tool: {
						name: '',
						text: '',
					},
					dynamic_test_version: '',
				})

        fileInputListRef.current.map((el) => {
          if(el) {
            el.value = ''
          }
        })
      })     
    }
    catch(error: any) {
      console.log(error.message);

      Swal.fire({
        icon: 'error',
        title: '등급 식별 입력 데이터를 추가하는데 실패했습니다.',
        timer: 2000,
      })
    }
  }

  // 등급 식별 입력 테이블 드롭다운 기타 박스 엘리먼트 핸들러
  const getInputDataSelectBox = (input: IRankIdentificationStaticInput): React.ReactNode => {
    const data = inputData[input.name] as IRankIdentificationInputDataSelect     
    const inputLanguageOptions = (rankIdentificationStaticSelectFileNameFields[input.name] || rankIdentificationStaticSelectFileNameFields.tool)[inputData.reliability_test_language.includes("기타") ? "기타" : inputData.reliability_test_language]
    const nameList = ["coding_rule_name", "secure_name", "code_metric_name"]

    return (
      <div className='!w-1/4 flex flex-col gap-2'>
        <Input.SelectGroup>
          <Input.Select value={data.name} label={input.label} name={`${input.name}-select`} onChange={handleInputDataChange}>
            <Input.Option value="">선택</Input.Option>
            {
              inputData.reliability_test_language ? (
                inputLanguageOptions.map((option, index_st)=> (
                  <Input.Option key={index_st} value={option}>{option}</Input.Option>
                ))
              )
              : null
            }
            <Input.Option value='기타'>기타</Input.Option>
          </Input.Select>
        </Input.SelectGroup>
        {
          data.name === '기타' ?
          <Input 
            type='text'
            name={`${input.name}-text`}
            value={data.text}
            onChange={handleInputDataChange}
          />
          : null
        }

        {
          input.type === "file" ? 
          <Input.File
            name={`${input.name.slice(0, -5)}-file`}
            ref={el => fileInputListRef.current[nameList.indexOf(input.name)] = el}
            type={'file'}
            onChange={handleInputDataChange}
          />
        : null
        }
      </div>
    )
  }

  // 무기체계 매뉴얼 코딩 규칙 다운로드 함수
  const codingDownloadHandler = async () => {
    try {
      const url = `${process.env.REACT_APP_BASE_URL}reliability/content/`

      window.open(url, '_blank')

      Swal.fire({
        icon: 'success',
        title: '무기체계 매뉴얼 코딩 규칙 다운로드에 성공했습니다.',
        confirmButtonText: '확인',
      })
    }
    catch(e:any){
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '무기체계 매뉴얼 코딩 규칙 다운로드에 실패했습니다.',
      })
    }
  }

  useEffect(() => {
    if(rankTableData) {
      setSelectLanguageOptions(rankTableData.map((data) => data.reliability_test_language).sort().filter((value, index, array) => array.indexOf(value) === index))
      setInputData({
        ...inputData,
        reliability_test_language: "",
      })      
    }
  }, [rankTableData])

  useEffect(() => {
    if(rankTableData && inputData) {
      const prevInputData = rankTableData.filter((d) => d.reliability_test_language === inputData.reliability_test_language)[0] || []
      const prevLanguage = prevInputData.reliability_test_language
      
      // TODO: 여기서 파일 받아온 데이터 입력 데이터에 저장

      // 테이블 데이터 내에 적용된 인풋 데이터가 없을 경우
      if(prevInputData.code_metric_version === null || prevLanguage === undefined) {
        setInputData({
          reliability_test_language: prevLanguage || "",
          coding_rule_name: {
            name: '',
            text: '',
          },
          coding_rule: new File([''], ''),
          coding_rule_tool: {
            name: '',
            text: '',
          },
          coding_rule_version: '',
          secure_name: {
            name: '',
            text: '',
          },
          secure: new File([''], ''),
          secure_tool: {
            name: '',
            text: '',
          },
          secure_version: '',
          code_metric_name: {
            name: '',
            text: '',
          },
          code_metric: new File([''], ''),
          code_metric_tool: {
            name: '',
            text: '',
          },
          code_metric_version: '',
          dynamic_test_tool: {
            name: '',
            text: '',
          },
          dynamic_test_version: '',
        })
      }
      // 기타이며 테이블 내에 인풋 데이터가 있을 경우
      else if(prevLanguage.includes('기타')) {
        setInputData({
          reliability_test_language: prevLanguage,
          // file 백엔드에서 불러와야함
          coding_rule_name: {
            name: "기타",
            text: prevInputData.coding_rule_name,
          },
          // coding_rule: fileData.find((d) => d.reliability_test_language === prevLanguage)!.coding_rule,
          coding_rule: new File([''], ''),
          coding_rule_tool: {
            name: "기타",
            text: prevInputData.coding_rule_tool
          },
          coding_rule_version: prevInputData.coding_rule_version,
          secure_name: {
            name: "기타",
            text: prevInputData.secure_name,
          },
          secure: new File([''], ''),
          secure_tool: {
            name: "기타",
            text: prevInputData.secure_tool
          },
          secure_version: prevInputData.secure_version,
          code_metric_name: {
            name: "기타",
            text: prevInputData.code_metric_name,
          },
          code_metric: new File([''], ''),
          code_metric_tool: {
            name: "기타",
            text: prevInputData.code_metric_tool
          },
          code_metric_version: prevInputData.code_metric_version,
          dynamic_test_tool: {
            name: "기타",
            text: prevInputData.dynamic_test_tool
          },
          dynamic_test_version: prevInputData.dynamic_test_version          
        })
      }
      // C, C++, C#, JAVA 일 경우와 테이블 내에 인풋 데이터도 있을 경우
      else {
        // 파일 또는 이름 추가 해야됨      

        setInputData({
          reliability_test_language: prevLanguage,
          coding_rule_name: {
            name: rankIdentificationStaticSelectFileNameFields.coding_rule_name[prevLanguage].includes(prevInputData.coding_rule_name) ? prevInputData.coding_rule_name : '기타',
            text: rankIdentificationStaticSelectFileNameFields.coding_rule_name[prevLanguage].includes(prevInputData.coding_rule_name) ? "" : prevInputData.coding_rule_name,
          },
          coding_rule: new File([''], ''),
          coding_rule_tool: {
            name: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.coding_rule_tool) ? prevInputData.coding_rule_tool : '기타',
            text: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.coding_rule_tool) ? "" : prevInputData.coding_rule_tool,
          },
          coding_rule_version: prevInputData.coding_rule_version,
          secure_name: {
            name: rankIdentificationStaticSelectFileNameFields.secure_name[prevLanguage].includes(prevInputData.secure_name) ? prevInputData.secure_name : '기타',
            text: rankIdentificationStaticSelectFileNameFields.secure_name[prevLanguage].includes(prevInputData.secure_name) ? "" : prevInputData.secure_name,
          },
          secure: new File([''], ''),
          secure_tool: {
            name: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.secure_tool) ? prevInputData.secure_tool : '기타',
            text: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.secure_tool) ? "" : prevInputData.secure_tool,
          },
          secure_version: prevInputData.secure_version,
          code_metric_name: {
            name: rankIdentificationStaticSelectFileNameFields.code_metric_name[prevLanguage].includes(prevInputData.code_metric_name) ? prevInputData.code_metric_name : '기타',
            text: rankIdentificationStaticSelectFileNameFields.code_metric_name[prevLanguage].includes(prevInputData.code_metric_name) ? "" : prevInputData.code_metric_name,
          },
          code_metric: new File([''], ''),
          code_metric_tool: {
            name: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.code_metric_tool) ? prevInputData.code_metric_tool : '기타',
            text: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.code_metric_tool) ? "" : prevInputData.code_metric_tool,
          },
          code_metric_version: prevInputData.code_metric_version,
          dynamic_test_tool: {
            name: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.dynamic_test_tool) ? prevInputData.dynamic_test_tool : '기타',
            text: rankIdentificationStaticSelectFileNameFields['tool'][prevLanguage].includes(prevInputData.dynamic_test_tool) ? "" : prevInputData.dynamic_test_tool,
          },
          dynamic_test_version: prevInputData.dynamic_test_version,
        })
      }
    }
  }, [rankTableData, inputData.reliability_test_language])

  return (
    <PanelContainer id="2">
      <PanelHeader title="2. 등급 식별" />
      <PanelBody>
        <Container fluid>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col p-5 bg-gray-100 border rounded-lg gap-5">
              <div className="flex items-start justify-between gap-20">
                <div className="flex flex-col w-1/4 gap-2">
                  <h2 className='text-xl'>개발 언어 선택</h2>
                  <Input.SelectGroup>
                    <Input.Select
                      name="reliability_test_language"
                      value={inputData.reliability_test_language}
                      onChange={handleInputDataChange}>
                      <Input.Option value={''}>
                        선택
                      </Input.Option>
                      {selectLanguageOptions.map(
                        (option, index_st) => (
                          <Input.Option key={index_st} value={option}>
                            {option}
                          </Input.Option>
                        ),
                      )}
                    </Input.Select>
                  </Input.SelectGroup>
                  <div className='flex flex-col gap-3'>
                    {inputData.reliability_test_language.includes('기타') && (
                      <div className="flex flex-col gap-2">
                        <label>
                          기타 언어의 신뢰성 시험을 지원하는 자동화 도구가 있습니까?
                        </label>
                        <div className='flex w-full gap-2'>
                          <Input.Radio
                            label="예"
                            name={'checkRadio'}
                            checked={checkRadio === 'yes'}
                            value={'yes'}
                            onChange={handleInputDataChange}
                          />
                          <Input.Radio
                            label="아니요"
                            name={'checkRadio'}
                            checked={checkRadio === 'no'}
                            value={'no'}
                            onChange={handleInputDataChange}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <Button onClick={codingDownloadHandler}>
                        무기체계 매뉴얼 코딩 규칙 다운로드
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-5">
                  {checkRadio !== 'no' && (
                    <div className="flex flex-col w-full gap-3">
                      <h2 className='text-xl'>정적시험</h2>
                      {
                        Object.values(rankIdentificationStaticInputFields).map((value, index_st) => (
                          <div key={index_st} className="flex w-full gap-16">
                            {
                              value.map((input, index_nd) => (
                                input.type === "text" ?
                                  <Input.InputLabel
                                    key={`${index_st}_${index_nd}`}
                                    value={inputData[input.name] as string}
                                    className='!w-1/4'
                                    label={input.label}
                                    name={input.name}
                                    onChange={handleInputDataChange}
                                  />
                                :
                                <Fragment key={`${index_st}_${index_nd}`}>
                                  {getInputDataSelectBox(input)}
                                </Fragment>
                              ))
                            }
                          </div>
                        ))
                      }
                      <hr/>

                      <h2 className='text-xl'>동적시험</h2>
                      
                      <div className='flex w-full gap-16'>
                          {getInputDataSelectBox({label: "도구", name: "dynamic_test_tool", type: "select"})}
                        <Input.InputLabel
                          className='!w-1/4'
                          value={inputData.dynamic_test_version as string}
                          label="버전"
                          name="dynamic_test_version"
                          onChange={handleInputDataChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-start">
                <Button onClick={putRankInputData}>입력</Button>
              </div>
            </div>
          </div>
        </Container>
      </PanelBody>
    </PanelContainer>
  )
}

export default GradeIdentification

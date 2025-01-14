import React, { useState, useEffect, ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { ArrowLeftCircleFill, ArrowRightCircleFill, LockFill, PauseCircleFill, PlayCircleFill, StopCircleFill, UnlockFill } from 'react-bootstrap-icons'
import { useLocation } from 'react-router-dom'

import Button from 'tailwindElement/Button'

import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { RootState } from 'app/store'
import { SaveAsHTMLFile } from 'components/common/editor/formmat'

import EditorXinha from 'components/common/editor/EditorXinha'
import EditorCategorySideBar from 'components/common/editor/EditorCategorySideBar'

import RequirementImportModal, { IReqVersion } from 'components/test-management/sw-integration-test/RequirementImportModal'

import { TestDescriptionCoverData, TestDescriptionChildrenCategoryList, TestDescriptionCategoryModel, TestDescriptionIdentifier, ITestDescriptionIdentifier, table_06_header, table_06_footer, STD_06_tableHeaderfields, ITestProcedure } from './testDescriptionEditorData'
import TestDescriptionSaveHistoryModal from 'components/test-management/sw-integration-test/test-description/TestDescriptionSaveHistoryModal'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { ISaveListData } from 'constant/test_manage/sw-reliability-test-plan/rankIdentificationFields'
import { outputContentUploadHandler } from 'components/common/editor/OutputContent'

import PeerReview from 'components/common/peer-review/PeerReview' // for peer-review
import TestVersionImportModal from 'components/test-management/sw-integration-test/TestVersionImportModal'
import RequirementTraceabilityTable from 'components/common/editor/RequirementTraceabilityTable'
import TestDescriptionProcedureTable from 'components/test-management/sw-integration-test/test-description/TestDescriptionProcedureTable'
import { ITestExecutionId, ITestExecutionTargets } from 'constant/test_manage/test-execution-records/testExecutionRecordsFields'
import TestDescriptionProcedureResultTableModal from 'components/test-management/sw-integration-test/test-description/TestDescriptionProcedureResultTableModal'
import { TestExecutionRecordsTableColumnsFields } from 'pages/test-management/test-execution-records/TestExecutionRecordsPage'

const TestDescriptionPage = () => {
  const location = useLocation();

  // 문서 타입 변수 동적
  const doc_type = 'std'
  const tables = ["시험 절차", "6. 요구사항 추적성"]

  const project_id = useSelector((state: RootState) => state.project.project).project_id	

  const user = useSelector((state: RootState) => state.user)
  // step 단계 추출
  const searchParams = new URLSearchParams(location.search)
  const step = searchParams.get('step')

  const [editorContentWrapper, setEditorContentWrapper] = useState<
  TestDescriptionCategoryModel[]
  >([])
  const [editModeState, setEditModeState] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // 요구사항 식별자
  const [identifiers, setIdentifiers] = useState<ITestDescriptionIdentifier[]>([])

  // 신뢰성 시험 계획 데이터
  const [activeSaveListData, setActiveSaveListData] = useState<ISaveListData>({
    reliability_plan_index: '',
    reliability_plan_title: '',
    reliability_plan_content: '',
    user_id: '',
    user_name: '',
    reliability_test_plan_update_date: '',
  })
  
  // 산출물 버전
  const [outputData, setOutputData] = useState<{
    id: number,
    name: number
  } | null>(null)

  const [editUserName, setEditUserName] = useState<string>("")  // 편집중인 사용자 이름

  // 요구사항 버전
  const [reqVersion, setReqVersion] = useState<IReqVersion | null>(null)

  // 현재 식별자의 시험 절차 데이터
  const [testProcedure, setTestProcedure] = useState<ITestProcedure[]>([])

  const [selectedIdentifier, setSelectedIdentifier] = useState<string>("")  // 식별자의 시험절차 사이드바 이름 // for peer-review

  // 시험수행 기록 진행 데이터
  // 시험 기본 데이터
  const [testExecutionId, setTestExecutionId] = useState<ITestExecutionId | null>(null)
  // 시험의 식별자 데이터
  const [testExecutionData, setTestExecutionData] = useState<ITestExecutionTargets[]>([])
  // 현재 시험 수행중인 식별자 데이터 순서
  const [testExecutionOrder, setTestExecutionOrder] = useState<number>(1)

  // for peer-review
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState<boolean>(false)  // peer-review 창을 열고 닫는 상태 // for peer-review
  const [selectedChapter, setSelectedChapter] = useState<string>("")  // 선택된 카테고리의 장절 코드 문자열 // for peer-review
  const handleButtonPeerReview = () => {
    setIsPeerReviewOpen(!isPeerReviewOpen)
  }
  const getChapterFromCategory = (category: string): string => {  // 문서의 장절 코드는 절대 변경이 없을것이기 때문에 이렇게 처리해도 무방하다
    const key_list = ["std_overview", "std_related_doc", "std_test_overview", "std_preparation", "std_test_detail", "test_item_list", "std_req", "std_note", "std_appendix_A", "std_appendix_B"]
    const value_index_list = ["1. 개요", "2. 관련 문서", "3. 시험 개요", "4. 시험 준비", "5. 시험 세부사항", "5.1 시험 항목 목록", "6. 요구사항 추적성", "7. 참고사항", "부록 A", "부록 B"]
    // 키 식별 후 값이 존재하면 해당 인덱스 반환 존재하지 않으면 swtest_requirement 고정 사용
    const index = value_index_list.findIndex(item => item === category)
    return key_list[index] || "swtest_requirement"
  }

  // STD 식별자 제외한 나머지 HTML 파일
  const getEditorHTML = async () => {
    try {
      const res = await AccessAxios.get(`/integration/${doc_type}/?${doc_type}_id=${outputData?.id || ""}&project_id=${project_id}`)
      
      const side_bar = document.getElementsByClassName("scrollbar-hide")[0] as HTMLSpanElement
      const navbar_top = document.getElementsByClassName("navbar-top")[0] as HTMLDivElement

      if(testExecutionId) {
        side_bar.style.pointerEvents = "none"
        navbar_top.style.pointerEvents = "none"
      }
      else {
        side_bar.style.pointerEvents = "auto"
        navbar_top.style.pointerEvents = "auto"
      }

      if(res.data.data && outputData === null && testExecutionId === null) {        
        setOutputData({
          id: res.data.data[`${doc_type}_id`],
          name: res.data.data[`${doc_type}_name`],
        })
      }

      if(res.data.data && reqVersion === null && testExecutionId === null) {
        setReqVersion({
          baseline_id: res.data.data.baseline_id,
          baseline_number: res.data.data.baseline_number,
        })
      }
      
      const res_detail = res.data.data.std_detail.sort((a:ITestDescriptionIdentifier, b:ITestDescriptionIdentifier) => a.req_number > b.req_number ? 1 : -1)
      
      setIdentifiers(res_detail)        
      
      let identifierContent = [...TestDescriptionIdentifier(res_detail).flat()].map((d) => {
        if(res_detail.length) {            
          const std_detail_id = res_detail.find((iden: ITestDescriptionIdentifier) => d.CategoryTitle.includes(iden.req_number))?.std_detail_id
          if(std_detail_id) {
            getSTDIdentifierHTML(std_detail_id)
          }
        }    
        return ( // 초기값 선언
          {
            CategoryTitle: d.CategoryTitle,
            content: "",
          }
        )
      })       

      const newContent: TestDescriptionCategoryModel[] = [
        { CategoryTitle: "1. 개요", content: res.data.data.std_overview },
        { CategoryTitle: "2. 관련 문서", content: res.data.data.std_related_doc },
        { CategoryTitle: "3. 시험 개요", content: res.data.data.std_test_overview },
        { CategoryTitle: "4. 시험 준비", content: res.data.data.std_preparation },
        { CategoryTitle: "5. 시험 세부사항", content: res.data.data.std_test_detail },
        { CategoryTitle: "5.1 시험 항목 목록", content: res.data.data.test_item_list },
        { CategoryTitle: "6. 요구사항 추적성", content: res.data.data.std_req },
        { CategoryTitle: "7. 참고사항", content: res.data.data.std_note },
        { CategoryTitle: "부록 A", content: res.data.data.std_appendix_A },
        { CategoryTitle: "부록 B", content: res.data.data.std_appendix_B },
      ]
      
      const test_execution_get = localStorage.getItem('test_execution_data')
      
      
      // 시험수행기록중 진행 코드
      if(test_execution_get) {          
        const req_execution_id = JSON.parse(test_execution_get)
        if(reqVersion === null && outputData === null) {
          setReqVersion({
            baseline_id: req_execution_id.baseline_id,
            baseline_number: req_execution_id.baseline_number,
          })
  
          setOutputData({
            id: req_execution_id.std_id,
            name: req_execution_id.std_name,
          })     
        }
    
        const target_req = testExecutionData.find((d) => d.test_target_order === testExecutionOrder)?.req_number
        
        if(target_req) {
          // result 값이 모두 있으면  
          
          const target_category = identifierContent.find((d) => d.CategoryTitle.includes(target_req))?.CategoryTitle || ""
          
          setSelectedCategory(target_category)
          setSelectedIdentifier(`${target_category.split(" ")[0]}.6 시험 절차`)
        }
      }
      else {        
        setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정
      }
      
      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow && editorContentWrapper.length === 0) {
        iframe.contentWindow.document.body.innerHTML = res.data.data[`${doc_type}_overview`]
      }

      setEditorContentWrapper(() => {
        newContent.splice(6, 0, ...identifierContent)
        return newContent
      })
    }
    catch (error: any) {
      console.log(error.message);
      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 문서 불러오기 실패`,
      })      
    }
  }
  

  // STD 식별자 제외한 나머지 HTML 파일
  const patchEditorHTML = async () => {
    try {
      const key_list = ["std_overview", "std_related_doc", "std_test_overview", "std_preparation", "std_test_detail", "test_item_list", "std_req", "std_note", "std_appendix_A", "std_appendix_B"]
      const value_index_list = ["1. 개요", "2. 관련 문서", "3. 시험 개요", "4. 시험 준비", "5. 시험 세부사항", "5.1 시험 항목 목록", "6. 요구사항 추적성", "7. 참고사항", "부록 A", "부록 B"]

      const categoryIndex = value_index_list.findIndex(
        item => item === selectedCategory,
      )      

      if (categoryIndex === -1) {
        return
      }      
      
      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow) {
        const editorContent = iframe.contentWindow.document.body.innerHTML
        await AccessAxios.patch(`/integration/${doc_type}/`, {
          [`${doc_type}_id`]: outputData?.id,
          [key_list[categoryIndex]]: editorContent,
        }).then((res) => {
          if(res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: `${doc_type.toUpperCase()} 문서 저장 성공`,
            })

            getEditorHTML()
          }
        })
      }
    }
    catch(error:any) {
      console.log(error.message);
      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 문서 저장 실패`,
      })
    }
  }

  // STD 시험 식별자 HTML 데이터 불러오기
  // Side Bar 클릭시 식별자에 해당하는 HTML 데이터만 불러옴
  const getSTDIdentifierHTML = async (std_detail_id: number) => {
    try {
      await AccessAxios.get(`/integration/std-detail/?std_detail_id=${std_detail_id}`).then((res) => {
        if(res.status === 200) {
          const key_list = ["std_detail_overview", "std_detail_req", "std_detail_prepare", "std_detail_input", "std_detail_expected", "std_detail_eval", "std_detail_procedure", "std_detail_constraint"]
          
          setEditorContentWrapper((prev) => {
            const newContent = [...prev]            
            const categoryIndex = newContent.findIndex((d) => {
              const categoryData = d.CategoryTitle.split(" ")[1]
              return categoryData === res.data.data.req_number
            }) 

            if(newContent[categoryIndex]) {
              key_list.map((d, i) => {
                const chapter = newContent[categoryIndex].CategoryTitle.split(" ")[0].split(".")[1]    
                newContent[categoryIndex + i].content = res.data.data[d].replaceAll("${chapter}", chapter)
              })
            }
            
            return newContent
          })
        }
      })
    }
    catch(error: any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'STD 식별자의 HTML 데이터 불러오기 실패',
      })
    }
  }

  // STD 시험 식별자 HTML 데이터 저장
  const patchSTDIdentifierHTML = async () => {
    try {
      const key_list = ["std_detail_overview", "std_detail_req", "std_detail_prepare", "std_detail_input", "std_detail_expected", "std_detail_eval", "std_detail_procedure", "std_detail_constraint"]
      const value_list = [`${identifiers.find((d) => d.req_number === selectedCategory.split(" ")[1])?.req_number || "식별자"}`, "요구사항", "선행조건", "시험 입력자료", "시험 예상결과", "결과 평가를 위한 기준", "시험 절차", "가정 및 제약사항"]
      
      const categoryIndex = value_list.findIndex((d) => selectedIdentifier ?selectedIdentifier.includes(d) : selectedCategory.includes(d))
      
      if (categoryIndex === -1) {
        return
      }                                                           
      
      const categoryId = identifiers.find((d) => d.req_number === selectedCategory.split(" ")[1])!.std_detail_id

      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow) {        
        const editorContent = iframe.contentWindow.document.body.innerHTML
        
        await AccessAxios.patch('/integration/std-detail/', {
          std_detail_id: categoryId,
          [key_list[categoryIndex]]: editorContent
        }).then((res) => {
          if(res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'STD 문서 저장 성공',
            })
          }
        })
      }
    }
    catch(error: any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'STD 식별자의 HTML 데이터 저장 실패',
      })
    }
  }

  const handlePanelCategoryClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLTableHeaderCellElement>,
  ): void => {
    const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
    const { id } = event.currentTarget
    const category = editorContentWrapper.find(item => item.CategoryTitle === id)
    
    outputData && outputData.id && id.includes("시험 절차") && getTestDescriptionProcedure()

    if(selectedCategory === id) {
      return
    }

    if (!category) {
      return
    }    

    // 변경된 사항 state에 저장
    if(iframe && iframe.contentWindow) {
      const prevContent = `${editorContentWrapper.find(item => item.CategoryTitle === selectedCategory)?.content}`
      const currentContent = `${iframe.contentWindow.document.body.innerHTML}`

      if(editModeState && (prevContent !== currentContent  && testExecutionId === null)) {
        Swal.fire({
          icon: 'warning',
          title: '변경사항을 저장하시겠습니까?',
          showDenyButton: true,
          confirmButtonText: `저장`,
          denyButtonText: `저장 안 함`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            patchEditorHTML()
            patchSTDIdentifierHTML()
          }

          if(TestDescriptionChildrenCategoryList.findIndex((d) => id.split(" ").slice(1).join(" ") === d ) === -1) {
            setSelectedCategory(() => id)
            setSelectedIdentifier("")
          }
          else {
            setSelectedIdentifier(() => id)
          }
          
          setSelectedChapter(getChapterFromCategory(id)) // 선택된 카테고리의 이름을 통해 얻은 장절 코드

          if(iframe && iframe.contentWindow) {
            iframe.contentWindow.document.body.innerHTML = category.content
          }
        })
      }
      else {
        if(TestDescriptionChildrenCategoryList.findIndex((d) => id.split(" ").slice(1).join(" ") === d ) === -1) {
          setSelectedCategory(() => id)
          setSelectedIdentifier("")
        }
        else {
          setSelectedIdentifier(() => id)
        }

        setSelectedChapter(getChapterFromCategory(id)) // 선택된 카테고리의 이름을 통해 얻은 장절 코드

        if(iframe && iframe.contentWindow) {
          iframe.contentWindow.document.body.innerHTML = category.content
        }
      }
    }
  }

  // 문서 변환 Handler
  const submitEditorContent = async (): Promise<void> => {
    Swal.fire({
      icon: 'info',
      title: `${doc_type.toUpperCase()} 문서 변환`,
      html: `<div><p>${doc_type.toUpperCase()} 문서 변환 전</p><p>수정사항을 저장하시길 바랍니다.<p/><br/><p>문서 변환을 계속 진행하시겠습니까?</p></div>`,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((res) => {
      if(res.isConfirmed) {
        // 6. 요구사항 추적성
        const table_06 = document.getElementById('req_traceability_table')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "")

        const join_editor_content =
          TestDescriptionCoverData.flat() +
          editorContentWrapper.map(item => {
            if(item.CategoryTitle === "6. 요구사항 추적성") {
              return table_06_header + table_06 + table_06_footer
            }
            return item.content
          }).join('')
        
        SaveAsHTMLFile(join_editor_content, doc_type.toUpperCase())
      }
    })
  }

  // 신뢰성시험 게획 데이터
  const reliabilityTestPlanHandle = (data: ISaveListData) => {
    setActiveSaveListData(data)
  }

  // Print Now Editor Content
  const printEditorContent = (): void => {    
    const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
    if(iframe && iframe.contentWindow) {
      console.log(iframe.contentWindow.document.body.innerHTML);
    }
  }
  
  const patchSaveHandle = () => {
    const value_list = ["요구사항", "선행조건", "시험 입력자료", "시험 예상결과", "결과 평가를 위한 기준", "시험 절차", "가정 및 제약사항"]       
    
    if(identifiers.find((d) => selectedCategory.includes(d.req_number)) || value_list.find((d) => selectedIdentifier.includes(d))) {
      if(selectedIdentifier.includes("시험 절차")) {
        patchTestProcedure()
      }
      else {
        patchSTDIdentifierHTML()
      }
    }
    else {      
      patchEditorHTML()
    }
  }

  const tableBEditHandle = () => {
    Swal.fire({
      title: "신뢰성 시험 계획 페이지 이동",
      html: "<p class='whitespace-pre-wrap'>신뢰성 시험 계획 관련 파일은 신뢰성 시험 계획 페이지에서 수정할 수 있습니다.\n해당 페이지로 이동하시겠습니까?</p>",
      icon: "info",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오"
    }).then((res) => {
      if(res.isConfirmed) {
        window.location.href = `/test-management/sw-reliability-test-plan/dash_2?project_id=${project_id}&step=${step}`
      }
    })
  }

  const testVersionHandler = (testVersionList: {id: number, name: number } ) => {
    setOutputData(testVersionList)
    setIsPeerReviewOpen(false)  // for peer-review // 새로운 버전을 불러오면 리뷰창을 닫는다
  }

  const reqVersionHandler = async (reqData: IReqVersion) => {
    setReqVersion(reqData)

    const res = await AccessAxios.get(`/integration/version/?doc_type=${doc_type}&baseline_id=${reqData?.baseline_id}`)
    
    const newData = res.data.data.sort((a: any, b: any) => b[`${doc_type}_id`] - a[`${doc_type}_id`])
    
    if(newData.length) {
      setOutputData({
        id: newData[0][`${doc_type}_id`],
        name: newData[0][`${doc_type}_name`]
      })
    }
  }

  const outputContentModalHandler = () => {
    const join_editor_content =
      TestDescriptionCoverData.flat() +
      editorContentWrapper.map(item => item.content).join('')

    Swal.fire({
      icon: 'info',
      title: '산출물 업로드',
      html: `<div><p>산출물 업로드 전</p><p>수정사항을 저장하시길 바랍니다.<p/><br/><p>업로드를 계속 진행하시겠습니까?</p></div>`,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((res) => {
      if(res.isConfirmed) {
        outputContentUploadHandler(JSON.stringify(join_editor_content), {
          output_name: doc_type.toUpperCase(),
          output_number: outputData!.name
        })
      }
    })
  }

  // 현재 식별자의 시험 절차 데이터 불러오기
  const getTestDescriptionProcedure = async () => {
    try {
      const req_id = identifiers.find((d) => selectedCategory.includes(d.req_number))?.req_id
      if(req_id) {
        await AccessAxios.get(`/integration/std-procedure/?std_id=${outputData?.id}&req_id=${req_id}`).then((res) => {
          if(res.status === 200) {
            if(res.data.data) {
              setTestProcedure(res.data.data)              
            }
            else {
              setTestProcedure([])
            }
          }
        })
      }
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 식별자 시험 절차 데이터 조회 실패`,
      })
    }
  }

  const [delTestProcedure, setDelTestProcedure] = useState<number[]>([])

  const checkBoxChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.currentTarget
    
    if(checked) {
      setDelTestProcedure((prev) => [...prev, parseInt(name)])
    }
    else {
      setDelTestProcedure((prev) => prev.filter((d) => d !== parseInt(name)))
    }
  }

  const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value }  = e.target
    const name = e.target.name.split("_").slice(0, -1).join("_")
    const order = e.target.name.split("_").slice(-1).join("_")

    setTestProcedure(testProcedure.map((d) => (d.std_procedure_order === parseInt(order) ? { ...d, [name]: value === "" ? null : value } : d)))
  }

  const delTestProcedureHandler = () => {
    setTestProcedure((prev) => {
      const setData = prev.filter((d, i) => !delTestProcedure.includes(i))

      setData.map((d, index_st) => {
        d.std_procedure_order = index_st + 1
      })

      return setData
    })
  }

  const appendTestProcedureHandler = () => {
    setTestProcedure((prev) => {
      return [...prev, {
        req_id: identifiers.find((d) => selectedCategory.includes(d.req_number))?.req_id || 0,
        std_id: outputData!.id,
        std_procedure_content: "",
        std_procedure_order: prev.length + 1,
        std_procedure_result: null,
        std_procedure_issue: null,
      }]
    }
    )
  }

  const patchTestProcedure = async () => {
    try {
      if(testProcedure.length === 0) {
        Swal.fire({
          icon: 'info',
          title: '저장할 시험 절차 데이터가 존재하지 않습니다.',
        })
      }
      else if(testProcedure.find((d) => d.std_procedure_content === "")) {
        Swal.fire({
          icon: 'info',
          title: '비어있는 시험 절차 내용을 입력 후 저장해주세요.',
        })
      }
      else {
        await AccessAxios.patch(`/integration/std-procedure/`, {
          test_exe_id: testExecutionId?.test_exe_id || null,
          test_target_time: start ? duration.toString() : "",
          std_procedure: testProcedure
        }).then((res) => {
          if(res.status === 200) {
            setDelTestProcedure([])
            getTestExecutionRecords()

                    
            Swal.fire ({
              icon: 'success',
              title: `${doc_type.toUpperCase()} 식별자 시험 절차 데이터 저장 성공`,
              confirmButtonText: '확인',
              allowOutsideClick: false,              
            })
          }
        })
      }
    }
    catch(e:any) {
      console.log(e.message);

      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 식별자 시험 절차 데이터 저장 실패`,
      })      
    }
  }

  const onDrop = (drag: number, dragOver: number) => {    
    setTestProcedure((prev) => {
      let setData = [...prev]
      
      const dragData = prev.find((d) => d.std_procedure_order === drag+1)
      const dragOverData = prev.find((d) => d.std_procedure_order === dragOver+1)

      setData = setData.map((d) => {
        if(d.std_procedure_order === drag+1) {
          return {
            ...dragOverData!,
            std_procedure_order: d.std_procedure_order
          }
        }
        else if(d.std_procedure_order === dragOver+1) {
          return {
            ...dragData!,
            std_procedure_order: d.std_procedure_order
          }
        }
        else {
          return d
        }
      })

      return setData
    })

    setDelTestProcedure([])
  }

  const editModeHandler = async () => {
    const res = await AccessAxios.get(`/documents/editmode/?project_id=${project_id}&edit_doc_type=${doc_type}`)    
    setEditUserName(res.data.data.user_name || "")

    if(res.data.data.user_id === user.user.user_id) {
      setEditModeState(true)
    }
    else {
      setEditModeState(false)
    }
  }
  
  const handleEditModeState = async () => {
    if(!editModeState) {
      const res = await AccessAxios.get(`/documents/editmode/?project_id=${project_id}&edit_doc_type=${doc_type}`)
      
      if(res.data.data.user_id !== null && res.data.data.user_id !== user.user.user_id) {
        Swal.fire({
          icon: 'info',
          title: `편집중인 사용자가 존재합니다.`,
          text: `${res.data.data.user_name}님이 편집중입니다.`,
        })
      }
      else if(res.data.data.user_id === null) {
        await AccessAxios.patch(`/documents/editmode/`, {
          project_id: project_id,
          edit_doc_type: doc_type,
          is_edit: true,
        })
      }    
    }
    else {
      await AccessAxios.patch(`/documents/editmode/`, {
        project_id: project_id,
        edit_doc_type: doc_type,
        is_edit: false,
      })
    }

    editModeHandler()
  }

  useEffect(() => {
    setSelectedCategory("1. 개요")
    setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정
  }, [reqVersion, outputData])

  useEffect(() => {
    editModeHandler()
  }, [editModeState])

  useEffect(() => {
    getEditorHTML()
  }, [reqVersion, outputData, testExecutionData, testExecutionOrder])

  useEffect(() => {
    if(identifiers.length) {
      getTestDescriptionProcedure()
    }
  }, [identifiers, selectedCategory])

  useEffect(() => {
    getTestExecutionRecords()
    const test_execution_get = localStorage.getItem('test_execution_data')

    if(test_execution_get) {
      Swal.fire({
        icon: 'success',
        title: '시험 절차 데이터 불러오기 성공',
        html: `<p>시험 수행 기록을 시작합니다.</p><p>타이머가 작동됩니다.</p>`,
        confirmButtonText: '확인',
        allowOutsideClick: false,
      }).then((res) => {
        if(res.isConfirmed) {
          setPause((prev) => {
            if(prev) {
              const pausedDuration = new Date().getTime() - prev.getTime(); // 일시정지 시간만큼 보상
              setStart(new Date((start?.getTime() || new Date().getTime()) + pausedDuration));
              setPause(null); // 일시정지 상태 해제
            }
            else {
              setStart(new Date())
            }
            
            return null
          })
        }
      })
    }
  }, [])

  const getTestExecutionRecords = async () => {
    const test_execution_get = localStorage.getItem('test_execution_data')
    if(test_execution_get) {
      try {
        if(test_execution_get) {
          const testExecutionData = JSON.parse(test_execution_get)
          setTestExecutionId(testExecutionData)

          await AccessAxios.get('/integration/execute/?project_id=' + project_id).then((res) => {
            // 시험 수행 기록 목록
            if(res.data.data && res.data.data.test_execution_list.length) {
              setTestExecutionData(res.data.data.test_execution_list.find((d: TestExecutionRecordsTableColumnsFields) => d.test_exe_id === testExecutionData.test_exe_id).test_execution_targets)
            }
          })
        }

      }
      catch(error:any) {
        console.log(error.message);

        Swal.fire({
          icon: 'error',
          title: '시험 수행 기록 목록 조회 실패',
        })      
      }
    }
  }

  // timer 관련 함수
  const [start, setStart] = useState<Date | null>(null); // 시작 시간
  const [end, setEnd] = useState<Date | null>(null); // 종료 시간
  const [pause, setPause] = useState<Date | null >(null); // 일시정지 시간
  const [duration, setDuration] = useState<Date>(new Date(0)); // 경과 시간 (Date 타입)
  
  const clickTimerHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const {name} = e.currentTarget;
    
    if(name === "start") {
      setPause(null)
      const now = new Date();

      if(pause) {
        const pausedDuration = now.getTime() - pause.getTime(); // 일시정지 시간만큼 보상
        setStart(new Date((start?.getTime() || now.getTime()) + pausedDuration));
        setPause(null); // 일시정지 상태 해제
      }
      else {
        // 새로운 타이머 시작
        setStart(now);
        setEnd(null);
        setPause(null);
        setDuration(new Date(0)); // 경과 시간 초기화
      }
    }
    else if(name === "pause") {
      if(start && !end && !pause) {
        setPause(new Date())
      }
    }
    else if(name === "stop") {
      Swal.fire({
        icon: 'info',
        title: '시험 수행 기록을 종료합니다.',
        html: '타이머 종료 후 시험 수행 기록 페이지로 이동합니다.',
        confirmButtonText: '확인',
        showDenyButton: true,
        denyButtonText: '취소',
        allowOutsideClick: false,
      }).then((res) =>{
        if(res.isConfirmed) {
          setEnd(new Date())
          setPause(new Date())
          handleEditModeState()
          localStorage.removeItem('test_execution_data')
          window.location.href = `/test-management/test-execution-records?project_id=${project_id}&step=${step}`
        }
      })
    }
  }
  
  const formatDuration = (date: Date): string => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };
  
  const clickTestExecutionOrderHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [name, nameOrder] = e.currentTarget.name.split("_")
    
    // 이전 식별자로 이동
    if(name === "prev" && testExecutionOrder <= 1) {
      Swal.fire({
        icon: 'info',
        title: '현재 선택된 식별자가 첫번째 식별자입니다.',
        confirmButtonText: '확인',
        allowOutsideClick: false,
      })
  
      return
    }
    else if(name === "next" && testExecutionOrder === testExecutionData.length) {
      Swal.fire({
        icon: 'info',
        title: '현재 선택된 식별자가 마지막 식별자입니다.',
        confirmButtonText: '확인',
        allowOutsideClick: false,
      })
  
      return 
    }

    const reqOrder = name === "prev" ? testExecutionOrder - 1 : name === "next" ? testExecutionOrder + 1 : parseInt(nameOrder)

    if(testProcedure.length) {
      Swal.fire({
        icon: 'info',
        title: '변경사항을 저장하시겠습니까?',
        showDenyButton: true,
        confirmButtonText: '저장',
        denyButtonText: '저장 안 함',
        allowOutsideClick: false,
      }).then((res) => {
        if(res.isConfirmed) {
          patchTestProcedure()
        }
        setTestExecutionOrder(reqOrder)
      })
    }
    else {
      setTestExecutionOrder(reqOrder)
    }
  } 

  // 시험 수행기록 진행 중 타이머 데이터 업데이트
  useEffect(() => {
    if(testExecutionData) {
      let interval: NodeJS.Timeout | null = null;
  
      if (start && !end && !pause) {
        interval = setInterval(() => {
          const now = new Date();
          const elapsed = now.getTime() - start.getTime();
          
          setDuration(new Date(elapsed));
        }, 10); // 1초마다 업데이트
      }
      
      return () => {
        if (interval) clearInterval(interval); // 정리
      };
    }
  }, [testExecutionData, start, end, pause]);

  return (
    <PanelBody className="min-h-full">
      <div className="flex items-start m-1 ml-20">
        {/* <Button variant="primary" onClick={printEditorContent}>
          Test Button
        </Button> */}

        <EditorCategorySideBar
          editModeState={editModeState}
          title={doc_type.toUpperCase()}
          editorContentWrapper={editorContentWrapper}
          handlePanelCategoryClick={testExecutionId ? (e)=>{} : handlePanelCategoryClick}
          selectedCategory={selectedCategory}
          submitEditorContent={submitEditorContent}
          hiddenButtons={TestDescriptionChildrenCategoryList}
        >
          <p>요구사항 버전 ({reqVersion?.baseline_number})</p>

          <div className={`${testExecutionId ? "pointer-events-none" : ""}`}>
            <RequirementImportModal reqVersionHandler={reqVersionHandler} />
          </div>
        </EditorCategorySideBar>

        <div className="w-7/12">
          <PanelContainer className="min-h-inherit">
            {/* Panel Actions ( IMPORT & REGISTER ) */}
            <PanelHeader className={`flex !justify-between gap-2 ${testExecutionId ? "pointer-events-none" : ""}`}>
                <div className='flex items-center gap-2'>
                  {
                    outputData ?
                    <span>{doc_type.toUpperCase()}_V{outputData!.name}</span>
                    :
                    ""
                  }
                  <TestVersionImportModal output_name={doc_type} reqVersion={reqVersion} testVersionHandler={testVersionHandler} />
                </div>
                <div className='flex gap-2'>
                  <Button onClick={outputContentModalHandler}>산출물 업로드</Button>
                </div>
            </PanelHeader>
            {/* Panel Actions ( EDIT MODE & STATE) */}
            <PanelHeader
              title={selectedCategory}
              className="flex items-center justify-between"
              rightElement={
                <div className="flex items-center justify-center gap-3">
                  <Button variant="primary" onClick={handleButtonPeerReview}>
                    <span className="font-bold">{isPeerReviewOpen ? '리뷰 닫기' : '리뷰 열기'}</span>
                  </Button>              
                  {editModeState || editUserName ? <LockFill /> : <UnlockFill />}
                  {editModeState || editUserName ? (
                    <span className="text-blue-600 me-2">
                      {editUserName} 편집중
                    </span>
                    )
                  :
                    <></>
                  }
                  <Button variant="primary" className={`${testExecutionId ? "pointer-events-none" : ""}`} onClick={handleEditModeState}>
                    Edit Mode
                    <span className="ml-2 font-bold">{editModeState ? 'ON' : 'OFF'}</span>
                  </Button>
                  {
                    selectedIdentifier.includes("시험 절차") && editModeState && <>
                      <Button onClick={appendTestProcedureHandler}>행 추가</Button>
                      <Button onClick={delTestProcedureHandler}>행 삭제</Button>
                    </>
                  }
                  {editModeState && 
                    <Button variant="primary" onClick={patchSaveHandle}>저장</Button>
                  }
                </div>
              }
            />
            { selectedCategory === "부록 B" &&
              <PanelHeader>
                <div className="flex items-center justify-start w-full h-full gap-2">
                  <label className="whitespace-nowrap">신뢰성시험 계획</label>
                  <div className='min-w-[100px] rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300'>
                    {activeSaveListData.reliability_plan_title || "제목"}
                  </div>
                  <TestDescriptionSaveHistoryModal reliabilityTestPlanHandle={reliabilityTestPlanHandle} outputData={outputData}/>
                </div>
              </PanelHeader>
            }
          <div className="w-full h-full gap-3">
            {identifiers.find((d) => selectedCategory.includes(d.req_number))
            ||
            TestDescriptionChildrenCategoryList.find((d) => selectedCategory.split(" ").splice(1).join(" ") === d)
              ? (
                <table className="table w-full text-center">
                  <thead>
                    <tr>
                      {TestDescriptionChildrenCategoryList.map(
                        (category_sub_item, index) => {
                          const id =`${(selectedCategory.split(" ")[0].split(".").slice(0,2)).flat().join(".")}.${index+1} ${category_sub_item}` 
                          return (
                            <th
                              key={index}
                              id={id}
                              className={`${id.includes("시험 절차") ? "test-procedure" : ""} p-3 border border-gray-300 cursor-pointer ${selectedIdentifier === id ? "bg-gray-200" : "bg-gray-100"}`}
                              onClick={handlePanelCategoryClick}>
                              {id}
                            </th>
                          )
                        }
                      )}
                    </tr>
                  </thead>
                </table>
              ) : (
                <></>
              )}

              <div className={`${!editModeState && "pointer-events-none"}`}>
                <EditorXinha className={`${tables.find((d) => selectedIdentifier.includes(d)) || tables.includes(selectedCategory)  ? "hidden" : "block"}`}>
                  {editorContentWrapper.length ? `${editorContentWrapper[0].content}` : ""}
                </EditorXinha>

                {/* 6. 요구사항 추적성 */}
                <RequirementTraceabilityTable headerFields={STD_06_tableHeaderfields} id={outputData?.id || null} doc_type='std' className={selectedCategory === "6. 요구사항 추적성" ? "block" : "hidden"} />

                {/* 식별자 시험 절차 */}
                {selectedIdentifier.includes("시험 절차") ? 
                  <TestDescriptionProcedureTable testExecutionId={testExecutionId} testProcedure={testProcedure} delTestProcedure={delTestProcedure} checkBoxChangeHandler={checkBoxChangeHandler} inputChangeHandler={inputChangeHandler} onDrop={onDrop} />
                :
                  <></>
                }
              </div>

              {testExecutionId ?
                <div className='flex justify-between items-center border p-2'>
                  <div>{testExecutionId.test_exe_name}</div>
                  
                  <div className='flex items-center gap-10'>
                    <div className='flex items-center gap-2'>
                      <button name={`prev_${testExecutionOrder}`} onClick={clickTestExecutionOrderHandler}>
                        <ArrowLeftCircleFill className='text-gray-500 hover:brightness-75' size={30} />
                      </button>
                      
                      {
                        pause ?
                        <button onClick={clickTimerHandle} name="start"><PlayCircleFill className='text-green-600 hover:brightness-75' size={30} /></button>
                        :
                        <button onClick={clickTimerHandle} name="pause"><PauseCircleFill className='text-yellow-600 hover:brightness-75' size={30} /></button>
                      }

                      <button onClick={clickTimerHandle} name="stop"><StopCircleFill className='text-red-600 hover:brightness-75' size={30} /></button>

                      <button name={`next_${testExecutionOrder}`} onClick={clickTestExecutionOrderHandler}>
                        <ArrowRightCircleFill className='text-gray-500 hover:brightness-75' size={30} />
                      </button>
                    </div>
                    <div>시험 {pause ? "일시정지" : "진행중"} {formatDuration(duration)}</div>
                  </div>
          
                  { 
                    <TestDescriptionProcedureResultTableModal  testExecutionTargets={testExecutionData} selectedCategory={selectedCategory} clickTestExecutionOrderHandler={clickTestExecutionOrderHandler}/>
                  }
                </div>
              :
                <></>
              }
            </div>
          </PanelContainer>
        </div>
        
        <div className="flex flex-col ml-2">
          <div>
            {/* Peer Review */}
            {isPeerReviewOpen && (
              <PeerReview
                isOpen={isPeerReviewOpen}
                className={''}
                headerContent={selectedCategory}  // 선택된 카테고리의 이름 문자열 (1. 개요, 2. 관련 문서, ...)
                project_id={project_id}
                peer_comment_key={outputData ? outputData?.id : -1} // 문서에서 사용중인 버전의 id를 사용 - 저장 등 갱신하면 id가 바뀌기 때문에 구분이 필요 (33, 34, 35, ...)
                peer_chapter={selectedChapter}  // 선택된 장절의 코드 (sdp_overview, sdp_related_doc, ...)
              />
            )}
          </div>
        </div>

      </div>
    </PanelBody>
  )
}

export default TestDescriptionPage
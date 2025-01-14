import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LockFill, UnlockFill } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button'

import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { RootState } from 'app/store'
import { SaveAsHTMLFile } from 'components/common/editor/formmat'

import EditorXinha from 'components/common/editor/EditorXinha'
import EditorCategorySideBar from 'components/common/editor/EditorCategorySideBar'

import RequirementImportModal, { IReqVersion } from 'components/test-management/sw-integration-test/RequirementImportModal'

import { DesignDescriptionCategoryModel, DesignDescriptionCoverData, IClassifData, SDD_06_tableHeaderfields, table_06_footer, table_06_header } from './designDescriptionEditorData'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { outputContentUploadHandler } from 'components/common/editor/OutputContent'

import PeerReview from 'components/common/peer-review/PeerReview' // for peer-review
import TestVersionImportModal from 'components/test-management/sw-integration-test/TestVersionImportModal'
import RequirementTraceabilityTable from 'components/common/editor/RequirementTraceabilityTable'
import SDDTableB from 'components/requirements-management/outputRequirements/sw-design-description/SDDTableB'
import SDDTable0307 from 'components/requirements-management/outputRequirements/sw-design-description/SDDTable0307'
import { IRequirementsTableData } from '../sw-requirements-specification/requirementSpecificationEditorData'

interface IReqParent {
  req_group_code_child: number
  req_group_name: string
  req_group_division: "csu"
}

interface IReqGroup {
  req_group_code: number
  req_group_name: string
  req_group_division: "csc"
  req_group_code_parent: IReqParent[]
}

const DesignDescriptionPage = () => {
  // 문서 타입 변수 동적
  const doc_type = 'sdd'
  const tables = ["6. 요구사항 추적성"]

  const project_id = useSelector((state: RootState) => state.project.project).project_id
  const user = useSelector((state: RootState) => state.user)

  const [editorContentWrapper, setEditorContentWrapper] = useState<
  DesignDescriptionCategoryModel[]
  >([])

  const [classifData, setClassifData] = useState<IClassifData[]>([])

  const [requirementsTableData, setRequirementsTableData] = useState<IRequirementsTableData[]>([])

  const [editModeState, setEditModeState] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // 요구사항 식별자
  const [reqGroups, setReqGroups] = useState<IReqGroup[]>([])

  const [identifiers, setIdentifiers] = useState<{
    CategoryTitle: string    
    content: string
    id: number
  }[]>([])
  
  // 산출물 버전
  const [outputData, setOutputData] = useState<{
    id: number,
    name: number
  } | null>(null)

  const [editUserName, setEditUserName] = useState<string>("")  // 편집중인 사용자 이름

  // 요구사항 버전
  const [reqVersion, setReqVersion] = useState<IReqVersion | null>(null)

  // for peer-review
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState<boolean>(false)  // peer-review 창을 열고 닫는 상태 // for peer-review
  const [selectedChapter, setSelectedChapter] = useState<string>("")  // 선택된 카테고리의 장절 코드 문자열 // for peer-review
  const handleButtonPeerReview = () => {
    setIsPeerReviewOpen(!isPeerReviewOpen)
  }
  const getChapterFromCategory = (category: string): string => {  // 문서의 장절 코드는 절대 변경이 없을것이기 때문에 이렇게 처리해도 무방하다
    const key_list = [
      "sdd_overview",
      "sdd_related_doc",
      "sdd_design_consideration",
      "sdd_design_policy",
      "sdd_state_mode",
      "sdd_COTS_usage",
      "sdd_security",
      "sdd_msg_error",
      "sdd_reusability",
      "sdd_req_decision",
      "sdd_interface_decision",
      "sdd_design_rule",
      "sdd_resource_plan",
      "sdd_design_structure",
      "sdd_design_csci",
      "sdd_design_csc",
      "sdd_interface_concept",
      "sdd_database_design",
      "sdd_design_detail",
      "sdd_interface_target",
      "sdd_req_trace",
      "sdd_references",
      "sdd_appendix_A",
      "sdd_appendix_B",
      "sdd_appendix_C"
    ]
    const value_index_list = [
      "1. 개요",
      "2. 관련 문서",
      "3. 소프트웨어 설계시 고려사항",
      "3.1 설계 정책",
      "3.2 상태와 모드",
      "3.3 상용제품 활용방안",
      "3.4 보안방안",
      "3.5 시스템 메시지관리 및 오류 대처방안",
      "3.6 재활용방안",
      "3.7 요구사항에 대한 결정사항",
      "3.8 인터페이스 설계 결정사항",
      "3.9 설계규칙",
      "3.10 자원활용 계획",
      "4. 소프트웨어 형상항목 구조설계",
      "4.1 소프트웨어 형상항목",
      "4.2 소프트웨어 구성요소간 실행개념",
      "4.3 인터페이스간 연동개념",
      "4.4 데이터베이스 설계",
      "5. 소프트웨어 형상항목 상세설계",
      "5.X 인터페이스 대상과 상호연동 내역",
      "6. 요구사항 추적성",
      "7. 참고사항",
      "부록A",
      "부록B",
      "부록C 설계식별자 별 변수·함수설명 결과파일 추적목록"
    ]
    // 키 식별 후 값이 존재하면 해당 인덱스 반환 존재하지 않으면 swdesign_requirement 고정 사용
    const index = value_index_list.findIndex(item => item === category)
    return key_list[index] || "swdesign_requirement"
  }

  const getEditorHTML = async () => {
    try {
      const res = await AccessAxios.get(`/documents/${doc_type}/?${doc_type}_id=${outputData?.id || ""}&project_id=${project_id}`)            
      setClassifData(res.data.data.classif)

      let design_req:any[] = []

      res.data.data.csc_group.map((d: any) => {
        design_req.push(...d.design_requirements, ...d.req_group_code_parent.map((d:any) => d.design_requirements).flat())
      })

      setRequirementsTableData(design_req)
      

      if(res.data.data && outputData === null) {        
        setOutputData({
          id: res.data.data[`${doc_type}_id`],
          name: res.data.data[`${doc_type}_name`],
        })
      }

      if(res.data.data && reqVersion === null) {
        setReqVersion({
          baseline_id: res.data.data.baseline_id,
          baseline_number: res.data.data.baseline_number,
        })
      }

      let identifierContent:any[] = []

      if(res.data.data && res.data.data.csc_group) {
        setReqGroups(res.data.data.csc_group)

        identifierContent = res.data.data.csc_group.map((csc: IReqGroup, index_st: number) => (
          {
            CategoryTitle: `5.${index_st + 1} ${csc.req_group_name}`,
            content: "",
            id: csc.req_group_code
          }
        ))
        
        let csuLength = res.data.data.csc_group.length - 1
        res.data.data.csc_group.map((csc: IReqGroup, index_st: number) => {
          const csuItem = csc.req_group_code_parent.map((csu: IReqParent, index_nd: number) => {
            return (
              {
                CategoryTitle: `5.${index_st + 1}.${index_nd + 1} ${csu.req_group_name}`,
                content: "",
                id: csu.req_group_code_child
              }
            )
          })        
          identifierContent.splice(identifierContent.length - csuLength, 0, ...csuItem)
          csuLength = csuLength - 1;
        });      

        setIdentifiers(identifierContent)

        identifierContent = identifierContent.map((iden: any) => {
          outputData && getIdentifierHTML(iden.id)
          return(
            {
              CategoryTitle: iden.CategoryTitle,
              content: ""
            }
          )
        })
      }

      // image
      // const table_0301 = document.getElementById('srs_table0301')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "").replaceAll("amp;", "").replace("$base64_0301_1", base64_0301_1)

      // 3.7, 4.1, 4.2, 4.3, 5, csu
      const table_B = document.getElementById('sdd_tableB')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "").replaceAll("amp;", "")
      const table_0307 = document.getElementById('sdd_table0307')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "").replaceAll("amp;", "")
      

      const newContent = [
        { CategoryTitle: "1. 개요", content: res.data.data.sdd_overview },
        { CategoryTitle: "2. 관련 문서", content: res.data.data.sdd_related_doc },
        { CategoryTitle: "3. 소프트웨어 설계시 고려사항", content: res.data.data.sdd_design_consideration },
        { CategoryTitle: "3.1 설계 정책", content: res.data.data.sdd_design_policy },
        { CategoryTitle: "3.2 상태와 모드", content: res.data.data.sdd_state_mode },
        { CategoryTitle: "3.3 상용제품 활용방안", content: res.data.data.sdd_COTS_usage },
        { CategoryTitle: "3.4 보안방안", content: res.data.data.sdd_security },
        { CategoryTitle: "3.5 시스템 메시지관리 및 오류 대처방안", content: res.data.data.sdd_msg_error },
        { CategoryTitle: "3.6 재활용방안", content: res.data.data.sdd_reusability },
        { CategoryTitle: "3.7 요구사항에 대한 결정사항", content: res.data.data.sdd_req_decision.replaceAll("${sdd_table0307}", table_0307)},
        { CategoryTitle: "3.8 인터페이스 설계 결정사항", content: res.data.data.sdd_interface_decision },
        { CategoryTitle: "3.9 설계규칙", content: res.data.data.sdd_design_rule },
        { CategoryTitle: "3.10 자원활용 계획", content: res.data.data.sdd_resource_plan },
        { CategoryTitle: "4. 소프트웨어 형상항목 구조설계", content: res.data.data.sdd_design_structure },
        { CategoryTitle: "4.1 소프트웨어 형상항목", content: res.data.data.sdd_design_csci },
        { CategoryTitle: "4.2 소프트웨어 구성요소간 실행개념", content: res.data.data.sdd_design_csc },
        { CategoryTitle: "4.3 인터페이스간 연동개념", content: res.data.data.sdd_interface_concept },
        { CategoryTitle: "4.4 데이터베이스 설계", content: res.data.data.sdd_database_design },
        { CategoryTitle: "5. 소프트웨어 형상항목 상세설계", content: res.data.data.sdd_design_detail },
        { CategoryTitle: `5.${res.data.data.csc_group && res.data.data.csc_group.length + 1} 인터페이스 대상과 상호연동 내역`, content: res.data.data.sdd_interface_target.replaceAll("${chapter}", (res.data.data.csc_group && res.data.data.csc_group.length + 1)) },
        { CategoryTitle: "6. 요구사항 추적성", content: res.data.data.sdd_req_trace },
        { CategoryTitle: "7. 참고사항", content: res.data.data.sdd_references },
        { CategoryTitle: "부록A", content: res.data.data.sdd_appendix_A },
        { CategoryTitle: "부록B", content: res.data.data.sdd_appendix_B.replaceAll("${sdd_tableB}", table_B) },
        { CategoryTitle: "부록C 설계식별자 별 변수·함수설명 결과파일 추적목록", content: res.data.data.sdd_appendix_C }
      ];
    
      setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정

      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow && editorContentWrapper.length === 0) {
        iframe.contentWindow.document.body.innerHTML = res.data.data[`${doc_type}_overview`]
      }

      setEditorContentWrapper(() => {
        newContent.splice(19, 0, ...identifierContent || [])
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

  const patchEditorHTML = async () => {
    try {
      const key_list = [
        "sdd_overview",
        "sdd_related_doc",
        "sdd_design_consideration",
        "sdd_design_policy",
        "sdd_state_mode",
        "sdd_COTS_usage",
        "sdd_security",
        "sdd_msg_error",
        "sdd_reusability",
        "sdd_req_decision",
        "sdd_interface_decision",
        "sdd_design_rule",
        "sdd_resource_plan",
        "sdd_design_structure",
        "sdd_design_csci",
        "sdd_design_csc",
        "sdd_interface_concept",
        "sdd_database_design",
        "sdd_design_detail",
        "sdd_interface_target",
        "sdd_req_trace",
        "sdd_references",
        "sdd_appendix_A",
        "sdd_appendix_B",
        "sdd_appendix_C"
    ]

      const value_index_list = [
        "1. 개요",
        "2. 관련 문서",
        "3. 소프트웨어 설계시 고려사항",
        "3.1 설계 정책",
        "3.2 상태와 모드",
        "3.3 상용제품 활용방안",
        "3.4 보안방안",
        "3.5 시스템 메시지관리 및 오류 대처방안",
        "3.6 재활용방안",
        "3.7 요구사항에 대한 결정사항",
        "3.8 인터페이스 설계 결정사항",
        "3.9 설계규칙",
        "3.10 자원활용 계획",
        "4. 소프트웨어 형상항목 구조설계",
        "4.1 소프트웨어 형상항목",
        "4.2 소프트웨어 구성요소간 실행개념",
        "4.3 인터페이스간 연동개념",
        "4.4 데이터베이스 설계",
        "5. 소프트웨어 형상항목 상세설계",
        `5.${reqGroups.length + 1} 인터페이스 대상과 상호연동 내역`,
        "6. 요구사항 추적성",
        "7. 참고사항",
        "부록A",
        "부록B",
        "부록C 설계식별자 별 변수·함수설명 결과파일 추적목록"
    ]

      const categoryIndex = value_index_list.findIndex(
        item => item === selectedCategory,
      )      

      if (categoryIndex === -1) {
        return
      }      
      
      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow) {
        const editorContent = iframe.contentWindow.document.body.innerHTML
        await AccessAxios.patch(`/documents/${doc_type}/`, {
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

  const getIdentifierHTML = async (req_group_code: number) => {
    try {
      const res = await AccessAxios.post(`/documents/${doc_type}/`, {
        [`${doc_type}_id`]: outputData?.id,
        req_group_code: req_group_code
      })

      setEditorContentWrapper((prev) => {
        const newContent = [...prev]
        
        const categoryIndex = newContent.findIndex((d) => {
          const [ _, ...categoryData] = d.CategoryTitle.split(" ")
          
          return categoryData.join(" ") === res.data.data.sdd_group_name
        })

        const chapter = newContent[categoryIndex].CategoryTitle.split(" ")[0].split(".").slice(1).join(".")

        if(categoryIndex !== -1) {
          newContent[categoryIndex].content = res.data.data.sdd_group_text.replaceAll("${chapter}", chapter)
        }

        return newContent
      })
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 식별자의 HTML 데이터 불러오기 실패`,
      })
    }
  }

  const patchIdentifierHTML = async () => {
    try {
      const req_group_code = identifiers.find((d) => d.CategoryTitle === selectedCategory)?.id
      
      if(req_group_code === -1) {
        return
      }

      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow) {        
        const editorContent = iframe.contentWindow.document.body.innerHTML
        
        await AccessAxios.put(`/documents/${doc_type}/`, {
          [`${doc_type}_id`]: outputData?.id,
          req_group_code: req_group_code,
          sdd_group_text: editorContent
        }).then((res) => {
          if(res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: `${doc_type.toUpperCase()} 문서 저장 성공`,
            })
          }
        })
      }
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 식별자의 HTML 데이터 저장 실패`,
      })
    }
  }

  const patchSaveHandle = () => {
    const selectedIndex = editorContentWrapper.findIndex((d) => d.CategoryTitle === selectedCategory)        
    if((selectedIndex >= 19) && (selectedIndex <= (editorContentWrapper.length - 7))) {
      patchIdentifierHTML()
    }
    else {
      patchEditorHTML()
    }
  }

  const handlePanelCategoryClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {

    const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
    const { id } = event.currentTarget
    const category = editorContentWrapper.find(item => item.CategoryTitle === id)

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
      
      if(editModeState && (prevContent !== currentContent)) {
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
          }

          setSelectedCategory(() => id)
          setSelectedChapter(getChapterFromCategory(id)) // 선택된 카테고리의 이름을 통해 얻은 장절 코드

          if(iframe && iframe.contentWindow) {
            iframe.contentWindow.document.body.innerHTML = category.content
          }
        })
      }
      else {
        setSelectedCategory(() => id)
        setSelectedChapter(getChapterFromCategory(id)) // 선택된 카테고리의 이름을 통해 얻은 장절 코드

        if(iframe && iframe.contentWindow) {
          iframe.contentWindow.document.body.innerHTML = category.content
        }
      }
    }
  }

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
          DesignDescriptionCoverData.flat() +
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

  // Print Now Editor Content
  const printEditorContent = (): void => {    
    const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
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
      DesignDescriptionCoverData.flat() +
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
    getEditorHTML()

    setSelectedCategory("1. 개요")
    setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정
  }, [reqVersion, outputData])

  useEffect(() => {
    editModeHandler()
  }, [editModeState])

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
          handlePanelCategoryClick={handlePanelCategoryClick}
          selectedCategory={selectedCategory}
          submitEditorContent={submitEditorContent}
        >
          <p>요구사항 버전 ({reqVersion?.baseline_number})</p>
          <RequirementImportModal reqVersionHandler={reqVersionHandler} />
        </EditorCategorySideBar>

        <div className="w-7/12">
          <PanelContainer className="min-h-inherit">
            {/* Panel Actions ( IMPORT & REGISTER ) */}
            <PanelHeader className="flex !justify-between gap-2">
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
                  <Button variant="primary" onClick={handleEditModeState}>
                    Edit Mode
                    <span className="ml-2 font-bold">{editModeState ? 'ON' : 'OFF'}</span>
                  </Button>
                  {editModeState && 
                  <Button variant="primary" onClick={patchSaveHandle}>저장</Button>
                  }
                </div>
              }
            />
            <div className={`${!editModeState && "pointer-events-none"}`}>
              <EditorXinha className={`${!tables.includes(selectedCategory) ? "block" : "hidden"}`}>
                {editorContentWrapper.length ? `${editorContentWrapper[0].content}` : ""}
              </EditorXinha>

              <SDDTableB IClassifData={classifData} />
              <SDDTable0307 requirementsTableData={requirementsTableData} />

              <RequirementTraceabilityTable headerFields={SDD_06_tableHeaderfields} id={outputData?.id || null} doc_type='sdd' className={selectedCategory === "6. 요구사항 추적성" ? "block" : "hidden"} />
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

export default DesignDescriptionPage

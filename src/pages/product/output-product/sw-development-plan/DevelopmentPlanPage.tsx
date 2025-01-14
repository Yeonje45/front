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

import { DevelopmentPlanCategoryModel, DevelopmentPlanCoverData } from './developmentPlanEditorData'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { outputContentUploadHandler } from 'components/common/editor/OutputContent'

import PeerReview from 'components/common/peer-review/PeerReview' // for peer-review
import TestVersionImportModal from 'components/test-management/sw-integration-test/TestVersionImportModal'

const DevelopmentPlanPage = () => {
  // 문서 타입 변수 동적
  const doc_type = 'sdp'

  const project_id = useSelector((state: RootState) => state.project.project).project_id
  const user = useSelector((state: RootState) => state.user)

  const [editorContentWrapper, setEditorContentWrapper] = useState<
    DevelopmentPlanCategoryModel[]
  >([])
  const [editModeState, setEditModeState] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")  // 선택된 카테고리의 이름 문자열

  // 산출물 버전
  const [outputData, setOutputData] = useState<{
    id: number
    name: number
  } | null>(null)

  const [editUserName, setEditUserName] = useState<string>("")  // 편집중인 사용자 이름

  // for peer-review
  // peer_comment_key - 버전에 의해서 문서 번호가 바뀌기 때문에 현재 열어놓은 문서의 버전을 가져와서 사용하는것이다 sdp_data?.id = 현재 sdp 문서의 id = 버전에종속
  // peer_comment_key 추적 방법 - peer_chapter_id를 확인하기 위해 /documents/sdp/?project_id=' + project_id로 sdp 문서를 가져온다 그리고 sdp_id를 파싱하여 사용한다
  // peer_chapter_id - 선택한 장절에 의해서 구분 코드가 바뀌기 때문에 현재 누른 장절의 이름으로 식별 코드를 역산하여 사용한다 (문제 발생시 DB를 통한 작업으로 변경함)
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState<boolean>(false)  // peer-review 창을 열고 닫는 상태 // for peer-review
  const [selectedChapter, setSelectedChapter] = useState<string>("")  // 선택된 카테고리의 장절 코드 문자열 // for peer-review
  const handleButtonPeerReview = () => {
    setIsPeerReviewOpen(!isPeerReviewOpen)
  }
  const getChapterFromCategory = (category: string): string => {  // 문서의 장절 코드는 절대 변경이 없을것이기 때문에 이렇게 처리해도 무방하다
    const key_list = ["sdp_overview", "sdp_related_doc", "sdp_req_overview", "sdp_req_system_software", "sdp_req_document", "sdp_req_system_position", "sdp_req_program_strategy", "sdp_req_schedule", "sdp_req_other", "sdp_develop_plan", "sdp_develop_process", "sdp_develop_plan_docs", "sdp_develop_plan_detail", "sdp_plan_oversight", "sdp_dev_env_setup", "sdp_review", "sdp_req_analysis", "sdp_design", "sdp_implementation", "sdp_integration_test", "sdp_system_integration", "sdp_dev_test_eval", "sdp_ops_test_support", "sdp_readiness", "sdp_transition_ready", "sdp_config_management", "sdp_deliverable_eval", "sdp_quality_assurance", "sdp_correction", "sdp_other_activity", "sdp_schedule_plan", "sdp_org_resource", "sdp_reference", "sdp_appendix_A"]
    const value_index_list = ["1. 개요", "2. 관련 문서", "3. 요구사항에 대한 개요", "3.1 시스템과 소프트웨어상의 요구사항과 제약사항", "3.2 문서화상의 요구사항과 제약사항", "3.3 체계 수명주기에서 사업의 위치", "3.4 채택된 프로그램/획득전략 또는 그에 대한 요구사항이나 제약사항", "3.5 사업일정계획과 자원상의 요구사항과 제약사항", "3.6 기타 요구사항과 제약사항", "4. 소프트웨어 개발 계획", "4.1 소프트웨어 개발과정", "4.2 소프트웨어 개발계획", "5 소프트웨어 개발 세부계획", "5.1 사업계획과 감독", "5.2 소프트웨어 개발환경의 구축", "5.3 운용개념, 체계 요구사항 및 설계에 대한 검토", "5.4 소프트웨어 요구사항분석", "5.5 소프트웨어 설계", "5.6 소프트웨어 구현", "5.7 소프트웨어 통합 및 시험", "5.8 체계통합 및 시험", "5.9 개발시험평가", "5.10 운용시험평가지원", "5.11 소프트웨어 사용준비",
      "5.12 소프트웨어 전이준비", "5.13 소프트웨어 형상관리", "5.14 소프트웨어 산출물 평가", "5.15 소프트웨어 품질보증", "5.16 수정활동", "5.17 기타 소프트웨어 개발활동", "6. 일정계획 및 활동계획표", "7. 개발조직과 자원", "8. 참고사항", "부록 A"
    ]
    const index = value_index_list.indexOf(category);
    return index !== -1 ? key_list[index] : "";
  }


  const getEditorHTML = async () => {
    try {
      const res = await AccessAxios.get(`/documents/${doc_type}/?${doc_type}_id=${outputData?.id || ""}&project_id=${project_id}`)   

      if(res.data.data && outputData === null) {        
        setOutputData({
          id: res.data.data[`${doc_type}_id`],
          name: res.data.data[`${doc_type}_name`],
        })
      }

      const newContent = [
        { CategoryTitle: "1. 개요", content: res.data.data.sdp_overview },
        { CategoryTitle: "2. 관련 문서", content: res.data.data.sdp_related_doc },
        { CategoryTitle: "3. 요구사항에 대한 개요", content: res.data.data.sdp_req_overview },
        { CategoryTitle: "3.1 시스템과 소프트웨어상의 요구사항과 제약사항", content: res.data.data.sdp_req_system_software },
        { CategoryTitle: "3.2 문서화상의 요구사항과 제약사항", content: res.data.data.sdp_req_document },
        { CategoryTitle: "3.3 체계 수명주기에서 사업의 위치", content: res.data.data.sdp_req_system_position },
        { CategoryTitle: "3.4 채택된 프로그램/획득전략 또는 그에 대한 요구사항이나 제약사항", content: res.data.data.sdp_req_program_strategy },
        { CategoryTitle: "3.5 사업일정계획과 자원상의 요구사항과 제약사항", content: res.data.data.sdp_req_schedule },
        { CategoryTitle: "3.6 기타 요구사항과 제약사항", content: res.data.data.sdp_req_other },
        { CategoryTitle: "4. 소프트웨어 개발 계획", content: res.data.data.sdp_develop_plan },
        { CategoryTitle: "4.1 소프트웨어 개발과정", content: res.data.data.sdp_develop_process },
        { CategoryTitle: "4.2 소프트웨어 개발계획", content: res.data.data.sdp_develop_plan_docs },
        { CategoryTitle: "5 소프트웨어 개발 세부계획", content: res.data.data.sdp_develop_plan_detail },
        { CategoryTitle: "5.1 사업계획과 감독", content: res.data.data.sdp_plan_oversight },
        { CategoryTitle: "5.2 소프트웨어 개발환경의 구축", content: res.data.data.sdp_dev_env_setup },
        { CategoryTitle: "5.3 운용개념, 체계 요구사항 및 설계에 대한 검토", content: res.data.data.sdp_review },
        { CategoryTitle: "5.4 소프트웨어 요구사항분석", content: res.data.data.sdp_req_analysis },
        { CategoryTitle: "5.5 소프트웨어 설계", content: res.data.data.sdp_design },
        { CategoryTitle: "5.6 소프트웨어 구현", content: res.data.data.sdp_implementation },
        { CategoryTitle: "5.7 소프트웨어 통합 및 시험", content: res.data.data.sdp_integration_test },
        { CategoryTitle: "5.8 체계통합 및 시험", content: res.data.data.sdp_system_integration },
        { CategoryTitle: "5.9 개발시험평가", content: res.data.data.sdp_dev_test_eval },
        { CategoryTitle: "5.10 운용시험평가지원", content: res.data.data.sdp_ops_test_support },
        { CategoryTitle: "5.11 소프트웨어 사용준비", content: res.data.data.sdp_readiness },
        { CategoryTitle: "5.12 소프트웨어 전이준비", content: res.data.data.sdp_transition_ready },
        { CategoryTitle: "5.13 소프트웨어 형상관리", content: res.data.data.sdp_config_management },
        { CategoryTitle: "5.14 소프트웨어 산출물 평가", content: res.data.data.sdp_deliverable_eval },
        { CategoryTitle: "5.15 소프트웨어 품질보증", content: res.data.data.sdp_quality_assurance },
        { CategoryTitle: "5.16 수정활동", content: res.data.data.sdp_correction },
        { CategoryTitle: "5.17 기타 소프트웨어 개발활동", content: res.data.data.sdp_other_activity },
        { CategoryTitle: "6. 일정계획 및 활동계획표", content: res.data.data.sdp_schedule_plan },
        { CategoryTitle: "7. 개발조직과 자원", content: res.data.data.sdp_org_resource },
        { CategoryTitle: "8. 참고사항", content: res.data.data.sdp_reference },
        { CategoryTitle: "부록 A", content: res.data.data.sdp_appendix_A },
      ]

      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow && editorContentWrapper.length === 0) {
        iframe.contentWindow.document.body.innerHTML = res.data.data[`${doc_type}_overview`]
      }

      setEditorContentWrapper(() => newContent)
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
      const key_list = ["sdp_overview", "sdp_related_doc", "sdp_req_overview", "sdp_req_system_software", "sdp_req_document", "sdp_req_system_position", "sdp_req_program_strategy", "sdp_req_schedule", "sdp_req_other", "sdp_develop_plan", "sdp_develop_process", "sdp_develop_plan_docs", "sdp_develop_plan_detail", "sdp_plan_oversight", "sdp_dev_env_setup", "sdp_review", "sdp_req_analysis", "sdp_design", "sdp_implementation", "sdp_integration_test", "sdp_system_integration", "sdp_dev_test_eval", "sdp_ops_test_support", "sdp_readiness", "sdp_transition_ready", "sdp_config_management", "sdp_deliverable_eval", "sdp_quality_assurance", "sdp_correction", "sdp_other_activity", "sdp_schedule_plan", "sdp_org_resource", "sdp_reference", "sdp_appendix_A"]
      const value_index_list = ["1. 개요", "2. 관련 문서", "3. 요구사항에 대한 개요", "3.1 시스템과 소프트웨어상의 요구사항과 제약사항", "3.2 문서화상의 요구사항과 제약사항", "3.3 체계 수명주기에서 사업의 위치", "3.4 채택된 프로그램/획득전략 또는 그에 대한 요구사항이나 제약사항", "3.5 사업일정계획과 자원상의 요구사항과 제약사항", "3.6 기타 요구사항과 제약사항", "4. 소프트웨어 개발 계획", "4.1 소프트웨어 개발과정", "4.2 소프트웨어 개발계획", "5 소프트웨어 개발 세부계획", "5.1 사업계획과 감독", "5.2 소프트웨어 개발환경의 구축", "5.3 운용개념, 체계 요구사항 및 설계에 대한 검토", "5.4 소프트웨어 요구사항분석", "5.5 소프트웨어 설계", "5.6 소프트웨어 구현", "5.7 소프트웨어 통합 및 시험", "5.8 체계통합 및 시험", "5.9 개발시험평가", "5.10 운용시험평가지원", "5.11 소프트웨어 사용준비",
        "5.12 소프트웨어 전이준비", "5.13 소프트웨어 형상관리", "5.14 소프트웨어 산출물 평가", "5.15 소프트웨어 품질보증", "5.16 수정활동", "5.17 기타 소프트웨어 개발활동", "6. 일정계획 및 활동계획표", "7. 개발조직과 자원", "8. 참고사항", "부록 A"
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
    catch (error: any) {
      console.log(error.message);
      Swal.fire({
        icon: 'error',
        title: `${doc_type.toUpperCase()} 문서 저장 실패`,
      })
    }
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
        setSelectedCategory(() => id) // 선택된 카테고리의 이름 문자열
        setSelectedChapter(getChapterFromCategory(id))  // 선택된 카테고리의 이름을 통해 얻은 장절 코드

        if(iframe && iframe.contentWindow) {
          iframe.contentWindow.document.body.innerHTML = category.content
        }
      }
    }
  }

  // 문서 변환 Handler
  const submitEditorContent = async (): Promise<void> => {
    setEditorContentWrapper(prev => {
      const newContent = [...prev]

      return newContent
    })


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
        const join_editor_content =
          DevelopmentPlanCoverData.flat() +
          editorContentWrapper.map(item => item.content).join('')
        
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

  const outputContentModalHandler = () => {
    const join_editor_content =
      DevelopmentPlanCoverData.flat() +
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

  useEffect(() => {
    getEditorHTML()
    
    setSelectedCategory("1. 개요")
    setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정
  }, [outputData])

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
        />

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
                  <TestVersionImportModal output_name={doc_type} testVersionHandler={testVersionHandler} />
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
                    <Button variant="primary" onClick={patchEditorHTML}>저장</Button>
                  }
                </div>
              }
            />
            <div className={`${!editModeState && "pointer-events-none"}`}>
              <EditorXinha>
                {editorContentWrapper.length ? `${editorContentWrapper[0].content}` : ""}
              </EditorXinha>
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

export default DevelopmentPlanPage

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

import { OutputSpecificationCategoryModel, OutputSpecificationCoverData, SPS_05_tableHeaderfields, table_05_footer, table_05_header } from './outputSpecificationEdtorData'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import RequirementImportModal, { IReqVersion } from 'components/test-management/sw-integration-test/RequirementImportModal'
import { outputContentUploadHandler } from 'components/common/editor/OutputContent'

import PeerReview from 'components/common/peer-review/PeerReview' // for peer-review
import TestVersionImportModal from 'components/test-management/sw-integration-test/TestVersionImportModal'
import RequirementTraceabilityTable from 'components/common/editor/RequirementTraceabilityTable'

const OutputSpecificationPage = () => {
  // 문서 타입 변수 동적
  const doc_type = 'sps'
  const tables = ["5. 요구사항 추적성"]

  const project_id = useSelector((state: RootState) => state.project.project).project_id
  const user = useSelector((state: RootState) => state.user)

  const [editorContentWrapper, setEditorContentWrapper] = useState<
  OutputSpecificationCategoryModel[]
  >([])
  const [editModeState, setEditModeState] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")  // 선택된 카테고리 이름 문자열
  
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
      "sps_overview",
      "sps_related_doc",
      "sps_output_list",
      "sps_execute_file",
      "sps_HDEV",
      "sps_FDEV",
      "sps_LDEV",
      "sps_raw_file",
      "sps_HDEV_raw",
      "sps_FDEV_raw",
      "sps_other_file",
      "sps_packaging_req",
      "sps_process",
      "sps_process_create",
      "sps_process_modify",
      "sps_traceability",
      "sps_reference",
      "sps_appendix_A",
      "sps_appendix_B"
    ]
    const value_index_list = [
      "1. 개요",
      "2. 관련 문서",
      "3. 산출물 목록",
      "3.1 실행 파일",
      "3.1.1 컴퓨터탑재형(HDEV)",
      "3.1.2 마이크로프로세서탑재형(FDEV)",
      "3.1.3 논리회로 탑재형(LDEV)",
      "3.2 원시 파일",
      "3.2.1 컴퓨터탑재형(HDEV)",
      "3.2.2 마이크로프로세서탑재형(FDEV)",
      "3.3 기타 파일",
      "3.4 패키징 요구사항",
      "4. 소프트웨어 생성 및 수정절차",
      "4.1 생성 절차",
      "4.2 수정 절차",
      "5. 요구사항 추적성",
      "6. 참고사항",
      "A 부록",
      "B 부록"
    ]
    const index = value_index_list.findIndex(item => item === category)
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

      if(res.data.data && reqVersion === null) {
        setReqVersion({
          baseline_id: res.data.data.baseline_id,
          baseline_number: res.data.data.baseline_number,
        })
      }

      const newContent = [
          { CategoryTitle: "1. 개요", content: res.data.data.sps_overview },
          { CategoryTitle: "2. 관련 문서", content: res.data.data.sps_related_doc },
          { CategoryTitle: "3. 산출물 목록", content: res.data.data.sps_output_list },
          { CategoryTitle: "3.1 실행 파일", content: res.data.data.sps_execute_file },
          { CategoryTitle: "3.1.1 컴퓨터탑재형(HDEV)", content: res.data.data.sps_HDEV },
          { CategoryTitle: "3.1.2 마이크로프로세서탑재형(FDEV)", content: res.data.data.sps_FDEV },
          { CategoryTitle: "3.1.3 논리회로 탑재형(LDEV)", content: res.data.data.sps_LDEV },
          { CategoryTitle: "3.2 원시 파일", content: res.data.data.sps_raw_file },
          { CategoryTitle: "3.2.1 컴퓨터탑재형(HDEV)", content: res.data.data.sps_HDEV_raw },
          { CategoryTitle: "3.2.2 마이크로프로세서탑재형(FDEV)", content: res.data.data.sps_FDEV_raw },
          { CategoryTitle: "3.3 기타 파일", content: res.data.data.sps_other_file },
          { CategoryTitle: "3.4 패키징 요구사항", content: res.data.data.sps_packaging_req },
          { CategoryTitle: "4. 소프트웨어 생성 및 수정절차", content: res.data.data.sps_process },
          { CategoryTitle: "4.1 생성 절차", content: res.data.data.sps_process_create },
          { CategoryTitle: "4.2 수정 절차", content: res.data.data.sps_process_modify },
          { CategoryTitle: "5. 요구사항 추적성", content: res.data.data.sps_traceability },
          { CategoryTitle: "6. 참고사항", content: res.data.data.sps_reference },
          { CategoryTitle: "A 부록", content: res.data.data.sps_appendix_A },
          { CategoryTitle: "B 부록", content: res.data.data.sps_appendix_B }
      ];

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
      const key_list = [
        "sps_overview",
        "sps_related_doc",
        "sps_output_list",
        "sps_execute_file",
        "sps_HDEV",
        "sps_FDEV",
        "sps_LDEV",
        "sps_raw_file",
        "sps_HDEV_raw",
        "sps_FDEV_raw",
        "sps_other_file",
        "sps_packaging_req",
        "sps_process",
        "sps_process_create",
        "sps_process_modify",
        "sps_traceability",
        "sps_reference",
        "sps_appendix_A",
        "sps_appendix_B"
    ]

      const value_index_list = [
        "1. 개요",
        "2. 관련 문서",
        "3. 산출물 목록",
        "3.1 실행 파일",
        "3.1.1 컴퓨터탑재형(HDEV)",
        "3.1.2 마이크로프로세서탑재형(FDEV)",
        "3.1.3 논리회로 탑재형(LDEV)",
        "3.2 원시 파일",
        "3.2.1 컴퓨터탑재형(HDEV)",
        "3.2.2 마이크로프로세서탑재형(FDEV)",
        "3.3 기타 파일",
        "3.4 패키징 요구사항",
        "4. 소프트웨어 생성 및 수정절차",
        "4.1 생성 절차",
        "4.2 수정 절차",
        "5. 요구사항 추적성",
        "6. 참고사항",
        "A 부록",
        "B 부록"
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

        // 5. 요구사항 추적성
        const table_05 = document.getElementById('req_traceability_table')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "")

        const join_editor_content =
          OutputSpecificationCoverData.flat() +
          editorContentWrapper.map(item => {
            if(item.CategoryTitle === "5. 요구사항 추적성") {
              return table_05_header + table_05 + table_05_footer
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
    if(iframe && iframe.contentWindow) {
      const editorContent = iframe.contentWindow.document.body.innerHTML
      console.log(editorContent)
    }    
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
      OutputSpecificationCoverData.flat() +
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
                    <Button variant="primary" onClick={patchEditorHTML}>저장</Button>
                  }
                </div>
              }
            />
            <div className={`${!editModeState && "pointer-events-none"}`}>
              <EditorXinha className={`${!tables.includes(selectedCategory) ? "block" : "hidden"}`}>
                {editorContentWrapper.length ? `${editorContentWrapper[0].content}` : ""}
              </EditorXinha>

              <RequirementTraceabilityTable headerFields={SPS_05_tableHeaderfields} id={outputData?.id || null} doc_type='sps' className={selectedCategory === "5. 요구사항 추적성" ? "block" : "hidden"} />
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

export default OutputSpecificationPage

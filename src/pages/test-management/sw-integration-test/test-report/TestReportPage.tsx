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

import { TestReportChildrenCategoryList, TestReportCategoryModel, TestReportCoverData, ITestReportIdentifier } from './testReportEditorData'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { outputContentUploadHandler } from 'components/common/editor/OutputContent'


import PeerReview from 'components/common/peer-review/PeerReview' // for peer-review
import TestVersionImportModal from 'components/test-management/sw-integration-test/TestVersionImportModal'

const TestReportPage = () => {
  // 문서 타입 변수 동적
  const doc_type = 'str'

	const project_id = useSelector((state: RootState) => state.project.project).project_id	
  const user = useSelector((state: RootState) => state.user)

  const [editorContentWrapper, setEditorContentWrapper] = useState<
  TestReportCategoryModel[]
  >([])
  const [editModeState, setEditModeState] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const [identifiers, setIdentifiers] = useState<ITestReportIdentifier[]>([])

  // 산출물 버전
  const [outputData, setOutputData] = useState<{
    id: number
    name: number
  } | null>(null)

  const [editUserName, setEditUserName] = useState<string>("")  // 편집중인 사용자 이름

  // 요구사항 버전
  const [reqVersion, setReqVersion] = useState<IReqVersion | null>(null)

  const [selectedIdentifier, setSelectedIdentifier] = useState<string>("") 

  // for peer-review
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState<boolean>(false)  // peer-review 창을 열고 닫는 상태 // for peer-review
  const [selectedChapter, setSelectedChapter] = useState<string>("")  // 선택된 카테고리의 장절 코드 문자열 // for peer-review
  const handleButtonPeerReview = () => {
    setIsPeerReviewOpen(!isPeerReviewOpen)
  }
  const getChapterFromCategory = (category: string): string => {  // 문서의 장절 코드는 절대 변경이 없을것이기 때문에 이렇게 처리해도 무방하다
    const key_list = ["str_overview", "str_related_doc", "str_integration_result", "str_integration_overview", "str_result_overview", "str_result_test_result", "str_completion", "str_record", "str_note", "str_appendix_A", "str_appendix_B"]
    const value_index_list = ["1. 개요", "2. 관련 문서", "3. 소프트웨어 통합 결과", "4.소프트웨어 통합시험 개요", "5. 소프트웨어 통합시험결과 개요", "6. 세부 시험결과", "7. 요구사항기반 시험 완료여부", "8. 소프트웨어 통합시험 일지", "9. 참고사항", "부록 A 소프트웨어 통합시험일지", "부록 B 소프트웨어 신뢰성시험/보안성시험 세부결과(자동화도구 출력자료 등)"]
    // 키 식별 후 값이 존재하면 해당 인덱스 반환 존재하지 않으면 swtest_requirement 고정 사용
    const index = value_index_list.findIndex(item => item === category)
    return key_list[index] || "swtest_requirement"
  } 


  const getEditorHTML = async () => {
    try {
      const res = await AccessAxios.get(`/integration/${doc_type}/?${doc_type}_id=${outputData?.id || ""}&project_id=${project_id}`)            
      
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

      const res_detail = res.data.data.str_detail.sort((a:ITestReportIdentifier, b:ITestReportIdentifier) => a.req_number > b.req_number ? 1 : -1)

      setIdentifiers(res_detail)
        
      const idenHTMLs: TestReportCategoryModel[] = res_detail.map((data: ITestReportIdentifier, index_st: number) => {
        const chapter = index_st + 1
        return [
          { CategoryTitle: `6.${chapter} ${data.req_number}`, content: "" },
          ...TestReportChildrenCategoryList.map((category_sub_item, i) => (
            { CategoryTitle: `6.${chapter}.${i+1} ${category_sub_item}`, content: "" }
          ))  
        ]
      })        
      
      let identifierContent = idenHTMLs.flat().map((d) => {
        if(res_detail.length) {            
          const str_detail_id = res_detail.find((iden: ITestReportIdentifier) => d.CategoryTitle.includes(iden.req_number))?.str_detail_id
          if(str_detail_id) {
            getSTRIdentifierHTML(str_detail_id)
          }
        }    
        return ( // 초기값 선언
          {
            CategoryTitle: d.CategoryTitle,
            content: "",
          }
        )
      }) 

      const newContent: TestReportCategoryModel[] = [
        { CategoryTitle: "1. 개요", content: res.data.data.str_overview },
        { CategoryTitle: "2. 관련 문서", content: res.data.data.str_related_doc },
        { CategoryTitle: "3. 소프트웨어 통합 결과", content: res.data.data.str_integration_result },
        { CategoryTitle: "4.소프트웨어 통합시험 개요", content: res.data.data.str_integration_overview },
        { CategoryTitle: "5. 소프트웨어 통합시험결과 개요", content: res.data.data.str_result_overview },
        { CategoryTitle: "6. 세부 시험결과", content: res.data.data.str_result_test_result },
        { CategoryTitle: "7. 요구사항기반 시험 완료여부", content: res.data.data.str_completion },
        { CategoryTitle: "8. 소프트웨어 통합시험 일지", content: res.data.data.str_record },
        { CategoryTitle: "9. 참고사항", content: res.data.data.str_note },
        { CategoryTitle: "부록 A 소프트웨어 통합시험일지", content: res.data.data.str_appendix_A },
        { CategoryTitle: "부록 B 소프트웨어 신뢰성시험/보안성시험 세부결과(자동화도구 출력자료 등)", content: res.data.data.str_appendix_B },
      ]

      setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정

      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow && editorContentWrapper.length === 0) {
        iframe.contentWindow.document.body.innerHTML = res.data.data[`${doc_type}_overview`]
      }

      setEditorContentWrapper(() => {
        newContent.splice(6, 0, ...identifierContent.flat())
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
      const key_list = ["str_overview", "str_related_doc", "str_integration_result", "str_integration_overview", "str_result_overview", "str_result_test_result", "str_completion", "str_record", "str_note", "str_appendix_A", "str_appendix_B"]
      const value_index_list = ["1. 개요", "2. 관련 문서", "3. 소프트웨어 통합 결과", "4.소프트웨어 통합시험 개요", "5. 소프트웨어 통합시험결과 개요", "6. 세부 시험결과", "7. 요구사항기반 시험 완료여부", "8. 소프트웨어 통합시험 일지", "9. 참고사항", "부록 A 소프트웨어 통합시험일지", "부록 B 소프트웨어 신뢰성시험/보안성시험 세부결과(자동화도구 출력자료 등)"]
      
      const categoryIndex = value_index_list.findIndex(
        item => item === selectedCategory
      )

      if(categoryIndex === -1) {
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

  const getSTRIdentifierHTML = async (str_detail_id: number) => {
    try {
      await AccessAxios.get(`/integration/str-detail/?str_detail_id=${str_detail_id}`).then((res) => {
        if(res.status === 200) {
          const key_list = ["str_detail_overview", "str_detail_result", "str_detail_problem", "str_detail_deviation"]

          setEditorContentWrapper((prev) => {
            const newContent = [...prev]            
            const categoryIndex = newContent.findIndex((d) => {
              const categoryData = d.CategoryTitle.split(" ")[1]
              return categoryData === res.data.data.req_number
            })            
            
            
            key_list.map((d, i) => {             
              if(newContent[categoryIndex + i]) {
                newContent[categoryIndex + i].content = res.data.data[d]
              }
            })
            
            return newContent
          })
        }
      })

    }
    catch(error:any) {
      console.log(error.message);

      Swal.fire({
        icon: 'error',
        title: 'STR 식별자의 HTML 데이터 불러오기 실패',
      })
    }
  }

  // STR 시험 식별자 HTML 데이터 저장
  const patchSTRIdentifierHTML = async () => {
    try {
      const key_list = ["str_detail_overview", "str_detail_result", "str_detail_problem", "str_detail_deviation"]
      const value_list = [`${identifiers.find((d) => d.req_number === selectedCategory.split(" ")[1])?.req_number || "식별자"}`, "시험결과", "직면한 문제점", "시험사례/절차에서의 편차"]
      const categoryIndex = value_list.findIndex((d) => selectedIdentifier ? selectedIdentifier.includes(d) : selectedCategory.includes(d))
      
      if (categoryIndex === -1) {
        return
      }                                                           

      const categoryId = identifiers.find((d) => d.req_number === selectedCategory.split(" ")[1])!.str_detail_id
      
      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow) {        
        const editorContent = iframe.contentWindow.document.body.innerHTML

        await AccessAxios.patch('/integration/str-detail/', {
          str_detail_id: categoryId,
          [key_list[categoryIndex]]: editorContent
        }).then((res) => {
          if(res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'STR 문서 저장 성공',
            })
          }
        })
      }
    }
    catch(error: any) {
      console.log(error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'STR 식별자의 HTML 데이터 저장 실패',
      })
    }
  }

  const handlePanelCategoryClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLTableHeaderCellElement>,
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
            patchSaveHandle()
          }

          if(TestReportChildrenCategoryList.findIndex((d) => id.split(" ").slice(1).join(" ") === d ) === -1) {
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
        if(TestReportChildrenCategoryList.findIndex((d) => id.split(" ").slice(1).join(" ") === d ) === -1) {
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
        const join_editor_content =
          TestReportCoverData.flat() +
          editorContentWrapper.map(item => item.content).join('')
        
        SaveAsHTMLFile(join_editor_content, doc_type.toUpperCase())
      }
    })
  }

  // Print Now Editor Content
  const printEditorContent = (): void => {    
    const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
  }

  const patchSaveHandle = () => {
    if(identifiers.find((d) => selectedCategory.includes(d.req_number)) || (selectedIdentifier && TestReportChildrenCategoryList.find((d) => selectedCategory.includes(d)))) {
      patchSTRIdentifierHTML()
    }
    else {
      patchEditorHTML()
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
      TestReportCoverData.flat() +
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
          hiddenButtons={TestReportChildrenCategoryList}
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
              className="flex items-center"
              rightElement={
                <div className="flex items-center gap-3">
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
            <div className="w-full h-full gap-3">
              {identifiers.find((d) => selectedCategory.includes(d.req_number))
                ||
                TestReportChildrenCategoryList.find((d) => selectedCategory.split(" ").splice(1).join(" ") === d)
                ? (
                  <table className="table w-full text-center">
                    <thead>
                      <tr>
                        {TestReportChildrenCategoryList.map(
                          (category_sub_item, index) => {
                            const id = `${(selectedCategory.split(" ")[0].split(".").slice(0, 2)).flat().join(".")}.${index + 1} ${category_sub_item}`
                            return (
                              <th
                                key={index}
                                id={id}
                                className={`p-3 border border-gray-300 cursor-pointer ${selectedIdentifier === id ? "bg-gray-200" : "bg-gray-100"}`}
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
                  <EditorXinha>
                    {editorContentWrapper.length ? `${editorContentWrapper[0].content}` : ""}
                  </EditorXinha>
                </div>
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

export default TestReportPage
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LockFill, UnlockFill } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { RootState } from 'app/store'
import { SaveAsHTMLFile } from 'components/common/editor/formmat'

import EditorXinha from 'components/common/editor/EditorXinha'
import EditorCategorySideBar from 'components/common/editor/EditorCategorySideBar'

import RequirementImportModal, { IReqVersion } from 'components/test-management/sw-integration-test/RequirementImportModal'

import { ITestPlanTableData, TestPlan06TableHeaderFields, Table_08_Footer, Table_08_Header, STP_08_tableHeaderfields, TestPlanCategoryModel, TestPlanCoverData, Table_0602_Header, Table_0602_Footer } from './testPlanEditorData'
import Swal from 'sweetalert2'
import { AccessAxios } from 'models'
import { outputContentUploadHandler } from 'components/common/editor/OutputContent'

import PeerReview from 'components/common/peer-review/PeerReview' // for peer-review
import TestVersionImportModal from 'components/test-management/sw-integration-test/TestVersionImportModal'
import RequirementTraceabilityTable from 'components/common/editor/RequirementTraceabilityTable'
import TestPlanTable from 'components/test-management/sw-integration-test/test-plan/TestPlanTable'

const TestPlanPage = () => {
  // 문서 타입 변수 동적
  const doc_type = 'stp'
  const tables = ["6.2 시험 계획", "8. 요구사항 추적성"]

	const project_id = useSelector((state: RootState) => state.project.project).project_id	
  const user = useSelector((state: RootState) => state.user)

  const [editorContentWrapper, setEditorContentWrapper] = useState<
  TestPlanCategoryModel[]
  >([])
  const [editModeState, setEditModeState] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // 산출물 버전
  const [outputData, setOutputData] = useState<{
    id: number
    name: number
  } | null>(null)

  const [editUserName, setEditUserName] = useState<string>("")  // 편집중인 사용자 이름

  // 요구사항 버전
  const [reqVersion, setReqVersion] = useState<IReqVersion | null>(null)
  
  // 6.2 시험 계획 데이터
  const [testPlanTableData, setTestPlanTableData] = useState<ITestPlanTableData[]>([])

  // for peer-review
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState<boolean>(false)  // peer-review 창을 열고 닫는 상태 // for peer-review
  const [selectedChapter, setSelectedChapter] = useState<string>("")  // 선택된 카테고리의 장절 코드 문자열 // for peer-review
  const handleButtonPeerReview = () => {
    setIsPeerReviewOpen(!isPeerReviewOpen)
  }
  const getChapterFromCategory = (category: string): string => {  // 문서의 장절 코드는 절대 변경이 없을것이기 때문에 이렇게 처리해도 무방하다
    const key_list = ["stp_overview", "stp_related_doc", "stp_integration_plan", "stp_test_overview", "stp_environment", "stp_identification", "stp_general_info", "stp_schedule", "stp_traceability", "stp_note", "stp_appendix"]
    const value_index_list = ["1. 개요", "2. 관련 문서", "3. 소프트웨어 통합 계획", "4. 시험 개요", "5. 소프트웨어 통합시험 환경", "6. 시험 식별", "6.1 일반 정보","6.2 시험 계획", "7. 시험 일정", "8. 요구사항 추적성", "9. 참고사항", "부록 A"]
    const index = value_index_list.findIndex(item => item === category)
    return index !== -1 ? key_list[index] : "";
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

      const newContent = [
        { CategoryTitle: "1. 개요", content: res.data.data.stp_overview },
        { CategoryTitle: "2. 관련 문서", content: res.data.data.stp_related_doc },
        { CategoryTitle: "3. 소프트웨어 통합 계획", content: res.data.data.stp_integration_plan },
        { CategoryTitle: "4. 시험 개요", content: res.data.data.stp_test_overview },
        { CategoryTitle: "5. 소프트웨어 통합시험 환경", content: res.data.data.stp_environment },
        { CategoryTitle: "6. 시험 식별", content: res.data.data.stp_identification },
        { CategoryTitle: "6.1 일반 정보", content: res.data.data.stp_general_info },
        { CategoryTitle: "6.2 시험 계획", content: res.data.data.stp_plan}, // 제외
        { CategoryTitle: "7. 시험 일정", content: res.data.data.stp_schedule },
        { CategoryTitle: "8. 요구사항 추적성", content: res.data.data.stp_traceability },
        { CategoryTitle: "9. 참고사항", content: res.data.data.stp_note },
        { CategoryTitle: "부록 A", content: res.data.data.stp_appendix },
      ]

      setSelectedChapter(getChapterFromCategory("1. 개요") as string) // 초기 선택 카테고리의 장절 코드 설정

      const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement
      if(iframe && iframe.contentWindow && editorContentWrapper.length === 0) {
        iframe.contentWindow.document.body.innerHTML = res.data.data[`${doc_type}_overview`]
      }

      setEditorContentWrapper(() => newContent)

      if(!testPlanTableData.length) {
        outputData && outputData.id && getTestPlanDetail()
      }
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
      const key_list = ["stp_overview", "stp_related_doc", "stp_integration_plan", "stp_test_overview", "stp_environment", "stp_identification", "stp_general_info", "stp_schedule", "stp_traceability", "stp_note", "stp_appendix"]
      const value_index_list = ["1. 개요", "2. 관련 문서", "3. 소프트웨어 통합 계획", "4. 시험 개요", "5. 소프트웨어 통합시험 환경", "6. 시험 식별", "6.1 일반 정보", "7. 시험 일정", "8. 요구사항 추적성", "9. 참고사항", "부록 A"]

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
        
        // 8. 요구사항 추적성 
        const table_08 = document.getElementById('req_traceability_table')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "").replaceAll("amp;", "")
        const table_0602 = document.getElementById('test_plan_tables')!.innerHTML.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll(",", "").replaceAll("amp;", "")

        const join_editor_content =
          TestPlanCoverData.flat() +
          editorContentWrapper.map(item => {
            if(item.CategoryTitle === "8. 요구사항 추적성") {
              return Table_08_Header + table_08 + Table_08_Footer
            }
            if(item.CategoryTitle === "6.2 시험 계획") {
              return Table_0602_Header + table_0602 + Table_0602_Footer
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
      TestPlanCoverData.flat() +
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

  const getTestPlanDetail = async () => {
    try {
      await AccessAxios.get(`/integration/${doc_type}-detail/?${doc_type}_id=${outputData?.id}`).then((res) => {
        if(res.status === 200) {
          setTestPlanTableData(res.data.data)
        }
      })
    }
    catch(e: any) {
      console.log(e.message);

      Swal.fire({
        icon: 'error',
        title: '시험 계획 식별자 조회 실패',
      })      
    }
  }

  const handleTestPlanTableChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value } = e.target
    const [stp_detail_id, ...name] = e.target.name.split('_')
    
    setTestPlanTableData(testPlanTableData.map((item) => (item.stp_detail_id === parseInt(stp_detail_id) ? {...item, [`${name.join("_")}`]: value } : item)))
  }

  const patchTestPlanTableHandler = async () => {
    try {
      await AccessAxios.patch(`/integration/${doc_type}-detail/`, {
        [`${doc_type}_detail`]: testPlanTableData.map((item) => (
          {
            req_id: item.req_id,
            stp_detail_id: item.stp_detail_id,
            stp_detail_level: item.stp_detail_level,
            stp_detail_type: item.stp_detail_type,
            stp_detail_special: item.stp_detail_special,
            stp_detail_record_type: item.stp_detail_record_type,
            stp_detail_data_type: item.stp_detail_data_type,
            stp_detail_constraint: item.stp_detail_constraint,
            stp_detail_safety: item.stp_detail_safety,
            stp_body_array: item.stp_body_array
          }
        ))
      }).then((res) => {
        if(res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '시험 계획 저장 성공',
          })

          getTestPlanDetail()
        }
      })
      
    }
    catch(e:any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '시험 계획 저장 실패',
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
            className="flex items-center justify-between">
              <div className='flex gap-4'>
                {selectedCategory}
                {
                  selectedCategory === "6.2 시험 계획" ?
                  <p>시험 요구사항({testPlanTableData.length}개)</p> : null
                }
              </div>
              <div className='flex items-center gap-3'>
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
                    <Button variant="primary" onClick={selectedCategory === "6.2 시험 계획" ? patchTestPlanTableHandler : patchEditorHTML }>저장</Button>
                  }
              </div>
          </PanelHeader>
          <div className={`${!editModeState && "pointer-events-none"}`}>
            <EditorXinha className={`${!tables.includes(selectedCategory) ? "block" : "hidden"}`}>
              {editorContentWrapper.length ? `${editorContentWrapper[0].content}` : ""}
            </EditorXinha>

              <div className={`w-full h-[600px] text-sm overflow-y-auto ${selectedCategory === "6.2 시험 계획" ? "block" : "hidden"}`}>
                <table id='table-0602' className='w-full table-border'>
                  <thead>
                    <tr>
                      {
                        TestPlan06TableHeaderFields.map((th, index_st) => (
                          <th key={index_st}>
                            {th}
                          </th>
                        )) 
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      testPlanTableData.length? testPlanTableData.sort((a, b) => b.req_number > a.req_number ? -1 : 1 ).map((tr, index_tr) => (
                        <tr key={index_tr}>
                          <td>{tr.req_number}</td>
                          <td className='w-[150px]'>{tr.req_title}</td>
                          <td>
                            <Input.Select disabled={!editModeState} value={tr.stp_detail_level || ""} name={`${tr.stp_detail_id}_stp_detail_level`} onChange={handleTestPlanTableChange}>
                              <Input.Option value=''>선택</Input.Option>
                              <Input.Option value='소프트웨어 단위시험'>소프트웨어 단위시험</Input.Option>
                              <Input.Option value='통합시험'>통합시험</Input.Option>
                              <Input.Option value='체계 통합시험'>체계 통합시험</Input.Option>
                            </Input.Select>
                          </td>
                          <td>
                            <Input.Textarea rows={3} className='resize-none' type='text' disabled={!editModeState} defaultValue={tr.stp_detail_type} name={`${tr.stp_detail_id}_stp_detail_type`} onChange={handleTestPlanTableChange} />
                          </td>
                          <td>
                            <Input.Textarea rows={3} className='resize-none' type='text' disabled={!editModeState} defaultValue={tr.stp_detail_special} name={`${tr.stp_detail_id}_stp_detail_special`} onChange={handleTestPlanTableChange} />
                          </td>
                          <td>
                            <Input.Textarea rows={3} className='resize-none' type='text' disabled={!editModeState} defaultValue={tr.stp_detail_record_type} name={`${tr.stp_detail_id}_stp_detail_record_type`} onChange={handleTestPlanTableChange} />
                          </td>
                          <td>
                            <Input.Textarea rows={3} className='resize-none' type='text' disabled={!editModeState} defaultValue={tr.stp_detail_data_type} name={`${tr.stp_detail_id}_stp_detail_data_type`} onChange={handleTestPlanTableChange} />
                          </td>
                          <td>
                            <Input.Textarea rows={3} className='resize-none' type='text' disabled={!editModeState} defaultValue={tr.stp_detail_constraint} name={`${tr.stp_detail_id}_stp_detail_constraint`} onChange={handleTestPlanTableChange} />
                          </td>
                          <td>
                            <Input.Textarea rows={3} className='resize-none' type='text' disabled={!editModeState} defaultValue={tr.stp_detail_safety} name={`${tr.stp_detail_id}_stp_detail_safety`} onChange={handleTestPlanTableChange} />
                          </td>
                        </tr>
                      ))
                      :
                      <tr>
                        <td colSpan={TestPlan06TableHeaderFields.length} className='h-[560px]'>
                          시험 식별자 데이터가 없습니다.
                          <br/>
                          시험 식별자를 추가해주세요.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <TestPlanTable testPlanTableData={testPlanTableData} />

              <RequirementTraceabilityTable headerFields={STP_08_tableHeaderfields} id={outputData?.id || null} doc_type='stp' className={selectedCategory === "8. 요구사항 추적성" ? "block" : "hidden"} />

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
                peer_comment_key={outputData ? outputData?.id : -1} // 문서에서 사용중인 버전의 id를 사용 - 저장 등 갱신하면 id가 바뀌기 때문에 구분이 필요 (3, 34, 35, ...)
                peer_chapter={selectedChapter}  // 선택된 장절의 코드 (sdp_overview, sdp_related_doc, ...)
              />
            )}
          </div>
        </div>

      </div>
    </PanelBody>
  )
}

export default TestPlanPage

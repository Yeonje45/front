import React, { useState, useEffect }  from 'react'
import { useSelector } from 'react-redux'
import sweetAlert2 from 'sweetalert2'
import Pagination from 'components/common/pagination/Pagination'

import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import Input from 'tailwindElement/Input'

import { RootState } from "app/store"
import { 
  requestGetNoticeBoardData, INoticeBoardModels,
  requestGetDetailNoticeBoardData, UpdateNoticeBoardData,
  DeleteNoticeBoardData, CreateNoticeBoardData
} from "models/DashboardModel"

const DashboardNoticeBoard = () => {
  const project_state = useSelector((state: RootState) => state.project)
  
  const [isOpen, setIsOpen] = React.useState<boolean>(() => false)

  // 전체 목록 관련 데이터 ( 조회, 페이징 <테이블> )
  const [noticeBoardData, setNoticeBoardData] = React.useState<INoticeBoardModels[] | null>(null)
  const [presentPage, setPresentPage] = useState<number>(1)
  const [maxPage, setMaxPage] = useState<number>(0)
  const limit = 3

  // 상세보기 관련 데이터 ( 삭제, 수정 ) 
  const [detailID, setDetailID] = useState<string>("")
  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false)
  const [detailNotice, setDetailNotice] = useState<INoticeBoardModels | null>(null)

  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false)
  const [createState, setCreateState] = useState<Record<string, string>>({
    notice_title: "",
    notice_content: ""
  })

  const handleOpen = () => {
    presentHandler(1) // 최초 조회 시에 1 페이지 조회
    setIsOpen(() => true)
  }

  const handleClose = () => {
    setIsOpen(() => false)
  }

  // 데이터 조회 함수
  const getNoticeBoardData = async (presentData: number): Promise<void> => {
    setNoticeBoardData(() => null)
    const res = await requestGetNoticeBoardData(project_state.project.project_id, limit, (presentData - 1) * limit);

    if (!res.success || !res.data) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message,
      })
      return
    }
    const { count } = res.data
    setMaxPage(() => Math.ceil(count / limit))
    setNoticeBoardData(res.data.results)
  }

  // 페이징 처리 시에 사용되는 함수 ( 페이지 이동 )
  const presentHandler = async (presentData: number): Promise<void> => {
    setPresentPage(() => presentData)
    await getNoticeBoardData(presentData)
  }

  // 상세 보기 함수
  const handleDetail = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget
    const res = await requestGetDetailNoticeBoardData(+id)
    if (!res.success || !res.data) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message || "상세 조회 실패",
      })
      return
    }
    setDetailNotice(() => res.data)
    setDetailID(() => id)
    setIsOpenDetailModal(() => true)
  }

  // 상세보기 모달 닫기
  const handleDetailClose = () => {
    setDetailID(() => "")
    setIsOpenDetailModal(() => false)
  }

  // 상세보기 데이터 수정 
  const handleChangeDetail = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setDetailNotice((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value
      }
    })
  }

  // 수정/업데이트 요청 함수
  const handleUpdateNoticeBoard = async () => {
    if (!detailNotice) return
    const res = await UpdateNoticeBoardData(detailNotice)
    if (!res.success) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message || "수정 실패",
      })
      return
    }
    await sweetAlert2.fire({
      icon: "success",
      title: "수정 성공",
      text: res.message || "수정 성공",
    })
    await presentHandler(presentPage)
    handleDetailClose()
    return
  }

  // 삭제 요청 함수
  const handleDeleteNoticeBoard = async () => {
    if (!detailID) { return }

    const check_confirm = await sweetAlert2.fire({
      icon: "question",
      title: "삭제 확인",
      text: "정말로 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    })
    if (!check_confirm.isConfirmed) { return } // check confirm ( with window message )
    const res = await DeleteNoticeBoardData(+detailID)
    if (!res.success) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message || "삭제 실패",
      })
      return 
    }
    await sweetAlert2.fire({
      icon: "success",
      title: "삭제 성공",
      text: res.message || "삭제 성공",
    })
    await presentHandler(presentPage)
    handleDetailClose()
    return
  }

  // 공지사항 추가 모달 열기
  const handleCreateOpen = async () => {
    setCreateState(() => ({
      title: "",
      content: ""
    }))
    setIsOpenCreate(() => true)
  }

  // 공지사항 추가 모달 닫기
  const handleCreateClose = async () => {
    setIsOpenCreate(() => false)
  }

  // 공지사항 추가 데이터 변경
  const handleChangeCreate = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setCreateState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // 공지사항 추가 요청
  const handleCreateNoticeBoard = async () => {
    const res = await CreateNoticeBoardData({project_id: project_state.project.project_id, notice_title: createState.notice_title, notice_content: createState.notice_content})
    if (!res.success) {
      sweetAlert2.fire({
        icon: "error",
        title: "서버 오류",
        text: res.message || "추가 실패",
      })
      return
    }
    await sweetAlert2.fire({
      icon: "success",
      title: "추가 성공",
      text: res.message || "추가 성공",
    })
    await presentHandler(presentPage)
    handleCreateClose()
    return
  }

  return (
    <React.Fragment>
      <Button onClick={handleOpen} className="panels_active_btn" variant="secondary">공지사항</Button>


      {/* 전체 공지사항 테이블 조회 */}
      <Modal isOpen={isOpen} size="lg">
        <Modal.Head>
          공지사항
        </Modal.Head>
        <Modal.Body>
          <div className="w-full px-2 flex flex-col gap-3 overflow-x-auto">
            <div className="ms-auto space-x-3">
              <Button onClick={handleCreateOpen}>공지사항 추가</Button>
            </div>
            <div className="w-full">
              <table className="table table-border w-full">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th>no</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>상세보기</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    noticeBoardData && noticeBoardData.length > 0 && noticeBoardData.map((noticeData, index) => (
                      <tr key={index}>
                        <td>{noticeData.notice_id}</td>
                        <td>{noticeData.notice_title}</td>
                        <td>{noticeData.notice_writer}</td>
                        <td>{new Date(noticeData.notice_created_date).toLocaleDateString()}</td>
                        <td>{noticeData.notice_view}</td>
                        <td>
                          <Button variant="unset" className="underline text-blue-700" id={noticeData.notice_id.toString()} onClick={handleDetail}>상세보기</Button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="mx-auto">
              <Pagination
                presentHandler={presentHandler}
                presentPage={presentPage}
                maxPage={maxPage}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>


      {/* 전체 공지사항 테이블 조회 */}
      <Modal isOpen={isOpenDetailModal} size="md">
        <Modal.Head>공지사항 상세조회</Modal.Head>
        <Modal.Body>
          {
            detailNotice && 
            <div className="w-full grid grid-cols-1 grid-flow-row gap-3">
              <div>
                <label htmlFor="writer">작성자</label>
                <Input name="writer" id="writer" defaultValue={detailNotice.notice_writer} disabled />
              </div>
              <div>
                <label htmlFor="notice_title">제목</label>
                <Input name="notice_title" id="notice_title" value={detailNotice.notice_title} onChange={handleChangeDetail} />
              </div>
              <div>
                <label htmlFor="notice_content">공지사항</label>
                <Input.Textarea rows={6} name="notice_content" id="notice_content" value={detailNotice.notice_content} onChange={handleChangeDetail} />
              </div>
              <div>
                <label htmlFor="created_date">작성일</label>
                <Input type="date" name="created_date" id="created_date" defaultValue={new Date(detailNotice.notice_created_date).toISOString().slice(0, 10)} disabled />
              </div>
              <div>
                <label htmlFor="view">조회수: {detailNotice.notice_view}</label>
              </div>
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDeleteNoticeBoard} variant="danger">삭제</Button>
          <Button onClick={handleUpdateNoticeBoard} variant="secondary">수정</Button>
          <Button onClick={handleDetailClose}>닫기</Button>
        </Modal.Footer>
      </Modal>


      {/* 공지사항 추가 */}
      <Modal isOpen={isOpenCreate} size="md">
        <Modal.Head>공지사항 추가</Modal.Head>
        <Modal.Body>
          <div className="w-full grid grid-cols-1 grid-flow-row gap-3">
            <div>
              <label htmlFor="notice_title">제목</label>
              <Input name="notice_title" id="notice_title" value={createState.notice_title} onChange={handleChangeCreate} />
            </div>
            <div>
              <label htmlFor="notice_content">내용</label>
              <Input.Textarea rows={6} name="notice_content" id="notice_content" value={createState.notice_content} onChange={handleChangeCreate} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateNoticeBoard} variant="primary">추가</Button>
          <Button onClick={handleCreateClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>


  )
}



export default DashboardNoticeBoard

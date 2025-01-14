import React from 'react'
import Swal from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'

import { useSelector } from "react-redux";
import { RootState } from "app/store";

import { 
	IPeerReviewUser, GetPeerReviewUsers,
	GetPeerReviewCategories, IPeerReviewCategoryModel,
	CreatePeerReview, CreatePeerReviewReply, 
	UpdatePeerReview, UpdatePeerReviewReply,
	DeletePeerReview, DeletePeerReviewReply,
	SignupPeerReviewIssue, UpdatePeerReviewState
	
} from 'models/Editor';
import { get } from 'http'

interface IProps {
	isOpen: boolean // 패널이 보여지거나, 숨겨지는 상태 표시
	className: string // absolute position의 x, y 좌표 설정 
	headerContent: string // 목차의 제목을 표시

	project_id: string // 프로젝트 pk 값
	peer_comment_key: number // 현재 보고있는 문서의 pk값 (해당 문서 테이블에서 현재 불러온 행의 pk값 - 해당 리뷰가 해당 문서의 어떤 버전에 속하는지 구분하기 위함)
	peer_chapter: string // 현재 보고있는 문서의 목차에 해당하는 고유 식별 코드 (해당 리뷰가 어느 문서의 리뷰인지 구분하기 위함)
}

// 코멘트 - 리플 - 멘션 단계로 구분 지칭
const PeerReview = ({ isOpen, className="", headerContent, project_id, peer_comment_key, peer_chapter }: IProps) => {
	const project_state = useSelector((state: RootState) => state.project || {});	// 현재 프로젝트 정보
	// 각 코멘트 및 리플 및 멘션의 정보를 담는 상태
	const [peerReviewCategories, setPeerReviewCategories] = React.useState<IPeerReviewCategoryModel[] | null>(null)		// 피어 리뷰 카테고리 정보 (코멘트, 리플, 멘션)
	// 기본 정보 입력 컴포넌트 상태 관리
	const [commentTitle, setCommentTitle] = React.useState<string>('')			// 코멘트용 타이틀 관리 상태
	const [commentContent, setCommentContent] = React.useState<string>('')		// 코멘트용 내용 관리 상태
	const [replyContent, setReplyContent] = React.useState<string>('')			// 리플용 내용 관리 상태
	// 사용자 정보 관리 상태
	const [filterdSystemUserList, setFilterdSystemUserList] = React.useState<IPeerReviewUser[]>([]) 	// 프로젝트 소속의 모든 사용자 정보 (id, 이름)
	const [filterdAssignUserList, setFilterdAssignUserList] = React.useState<IPeerReviewUser[]>([]) 	// 해당 코멘트 및 리플의 멘션 대상 사용자 목록
	// 코멘트 및 리플의 멘션 대상 사용자 선택 상태
	const [selectedSystemUser, setSelectedSystemUser] = React.useState<IPeerReviewUser>({user_id:'', user_name: ''})	// 시스템 사용자 선택 상태 - Input.Select에서 사용
	// 코멘트 및 리플의 공용 현황 관리 상태 (open, inprogress, inreview, rejected, resolved, closed, reopened...)
	const [selectedState, setSelectedState] = React.useState<string>('Open')											// 선택한 상태를 저장하는 상태
	const stateArray = ['Open', 'InProgress', 'InReview', 'Rejected', 'Resolved', 'Closed', 'Reopened']					// 상태 레벨 목록 배열
	// 화면 컴포넌트 제어용 상태
	const [openCommentFlags, setOpenCommentFlags] = React.useState<boolean[]>([])										// 코멘트의 소속 댓글 화면 토글 상태 - 각 코멘트별로 댓글을 펼칠지 말지 결정
	const [commentViewMode, setCommentViewMode] = React.useState<'default' | 'create' | 'edit'| 'reply'>('default'); 	// 코멘트용 화면 관리 상태 - 화면 상태 기본(가림) / 추가 / 수정 / 댓글
	const [selectedCommentID, setSelectedCommentID] = React.useState<number | null>(null)								// 선택한 코멘트의 ID를 저장하는 상태
	const [replyViewMode, setReplyViewMode] = React.useState<'default' | 'create' | 'edit'>('default'); 				// 리플용 화면 관리 상태 - 화면 상태 기본(가림) / 추가 / 수정
	const [selectedReplyID, setSelectedReplyID] = React.useState<number | null>(null)									// 선택한 리플의 ID를 저장하는 상태

	// 상태 선택 핸들러
	const handleSelectStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedState(() => e.target.value)
	}

	// 사용자 선택 핸들러
	const handleSelectUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedUser: IPeerReviewUser = JSON.parse(e.target.value);	// 선택한 사용자 정보를 JSON 형태로 받아서 파싱
		setSelectedSystemUser(selectedUser);
	}

	// 사용자 추가 핸들러
	const handleInsertUser = () => {
		setFilterdAssignUserList(prevItems => [...prevItems, selectedSystemUser])
		setSelectedSystemUser({user_id: '', user_name: ''})
	}

	// 사용자 삭제 핸들러
	const handleDeleteItem = (user_id: string) => {
		setFilterdAssignUserList(prevItems => prevItems.filter(item => item.user_id !== user_id));
	}

	// 코멘트 타이틀 변경 핸들러
	const handleCommentTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentTitle(() => e.target.value)
	}

	// 코멘트 내용 변경 핸들러
	const handleCommentContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentContent(() => e.target.value)
	}

	// 리플 내용 변경 핸들러
	const handleReplyContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setReplyContent(() => e.target.value)
	}

	// 코멘트 - 댓글 토글 핸들러
	const handleToggleCommentView = (commentID: number) => {
		const flags = openCommentFlags.map((flag, idx) => {
			if (idx === commentID) {	// 보유한 인덱스가 클릭한 인덱스와 같다면
				return !flag	// 해당 인덱스의 상태를 반전
			}
			return flag			// 나머지는 그대로
		})
		setOpenCommentFlags(() => flags) // 각 리뷰가 가진 댓글 상태를 저장
	}

	// 코멘트 - 저장 버튼 핸들러 - 추가 및 수정 공통
	const handleCommentSubmit = () => {
		if (commentViewMode === 'create') {
			// 생성 요청 처리
			// back-front 양쪽 처리
			createPeerReviewComment()
		} else if (commentViewMode === 'edit') {
			// 수정 요청 처리
			// back-front 양쪽 처리
			updatePeerReviewComment()
		}
		setCommentViewMode('default'); // 저장 후 기본 화면으로 전환
		setReplyViewMode('default'); // 저장 후 기본 화면으로 전환
		resetComment() // 저장 및 수정 후 코멘트 정보 초기화
	};

	const handleCommentCancel = () => {	
		setCommentViewMode('default'); // 취소 후 기본 화면으로 전환
		setReplyViewMode('default'); // 저장 후 기본 화면으로 전환
		resetComment() // 저장 및 수정 후 코멘트 정보 초기화
	};
	
	// 리플 - 저장 버튼 핸들러 - 추가 및 수정 공통
	const handleReplySubmit = () => {
		if (replyViewMode === 'create' || commentViewMode === 'reply') {
			// 생성 요청 처리
			// back-front 양쪽 처리
			createPeerReviewReply()

		} else if (replyViewMode === 'edit') {
			// 수정 요청 처리
			// back-front 양쪽 처리
			updatePeerReviewReply()
		}
		setCommentViewMode('default'); // 저장 후 기본 화면으로 전환
		setReplyViewMode('default'); // 저장 후 기본 화면으로 전환
		resetReply() // 저장 및 수정 후 리플 정보 초기화
	};

	const handleReplyCancel = () => {
		setCommentViewMode('default'); // 취소 후 기본 화면으로 전환
		setReplyViewMode('default'); // 취소 후 기본 화면으로 전환
		resetReply() // 저장 및 수정 후 리플 정보 초기화
	}

	// 코멘트 - 신규 코멘트 작성창 토글 핸들러
	const handleToggleCommentInput = () => {
		// 신규 코멘트 작성창을 토글
		if (commentViewMode === 'create') {
			setCommentViewMode('default')
			setReplyViewMode('default')
			resetComment() // 코멘트 정보 초기화
		} 
		else {
			setCommentViewMode('create')
			setReplyViewMode('default')
			resetComment() // 코멘트 정보 초기화
		}
	}

	// 코멘트 - 신규 리플 작성창 토글 핸들러
	const handleToggleCommentAddReply = (commentID: number) => {
		// 신규 리뷰 작성창을 토글
		if (commentViewMode === 'reply') {
			// 코멘트에서 처음 추가되는 리플 작성창을 닫음
			setCommentViewMode('default')
			setReplyViewMode('default')
			setSelectedCommentID(null)	// 선택한 리뷰 ID를 초기화
			resetReply() // 리플 정보 초기화
		}
		else {
			// 코멘트에서 처음 추가되는 리플 작성창을 열음
			setCommentViewMode('reply')
			setReplyViewMode('default')
			setSelectedCommentID(commentID)	// 선택한 리뷰 ID를 저장
			resetReply() // 리플 정보 초기화
			setSelectedState(	// 선택한 리플의 상부 코멘트의 상태를 저장
				peerReviewCategories?.find((category) => category.peer_comment_id === commentID)?.peer_comment_state || 'Open'
			)
		}
	}

	// 코멘트 - 수정창 토글 핸들러
	const handleToggleCommentEdit = (commentID: number) => {
		// 선택 코멘트 수정창을 토글
		if (commentViewMode === 'edit') {
			setCommentViewMode('default')
			setReplyViewMode('default')
			setSelectedCommentID(null)	// 선택한 코멘트 ID를 초기화
			resetComment() // 코멘트 정보 초기화
		} 
		else {
			setCommentViewMode('edit')
			setReplyViewMode('default')
			setSelectedCommentID(commentID)	// 선택한 코멘트 ID를 저장
			// 선택한 코멘트 정보를 가져와서 입력창에 셋팅
			const selectedComment = peerReviewCategories?.find((category) => category.peer_comment_id === commentID)
			if (selectedComment) {
				setSelectedState(selectedComment.peer_comment_state)
				setCommentTitle(selectedComment.peer_comment_title)
				setCommentContent(selectedComment.peer_comment_content)
				// 멘션 대상 사용자 정보 설정  절차
				// 1. 해당 코멘트의 peer_mentions 정보를 통해 mention_user_id 목록을 추출
				const mentionUserIds = selectedComment.peer_mentions
					.filter((mention) => mention.peer_comment_id === commentID)  // 해당 commentID에 소속된 peer_mentions만 필터링
					.map((mention) => mention.mention_user_id);  // mention_user_id만 추출
				// 2. 추출된 mention_user_id 목록을 통해 사용자 정보를 필터링 
				const updatedAssignUserList = filterdSystemUserList.filter((user) =>
					mentionUserIds.includes(user.user_id)  // mention_user_id가 filterdSystemUserList의 user_id에 포함되는 사용자만 필터링
				);
				// 3. 필터링된 사용자 정보를 filterdAssignUserList에 저장
				setFilterdAssignUserList(updatedAssignUserList);
			}
		} 
	}

	// 코멘트 - 삭제 버튼 핸들러
	const handleCommentDeleteButton = (commentID: number) => {
		// 삭제 버튼 클릭 시 해당 리뷰를 삭제하는 알림창 출력
		Swal.fire({
			title: '삭제 확인',
			text: '해당 리뷰를 삭제하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '삭제',
			cancelButtonText: '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				// back-front 양쪽 처리
				deletePeerReviewComment(commentID)
				resetComment() // 삭제 후 코멘트 정보 초기화
			}
		})
	}

	// 리플 - 신규 작성창 토글 핸들러
	const handleToggleReplyInput = (commentID: number, replyID: number) => {
		// 신규 리뷰 작성창을 토글
		if (replyViewMode === 'create') {
			// 리플 작성창을 닫음
			setCommentViewMode('default')
			setReplyViewMode('default')
			setSelectedCommentID(null)	// 선택한 리뷰 ID를 초기화
			setSelectedReplyID(null)	// 선택한 리뷰 ID를 초기화
			resetReply() // 리플 정보 초기화
			setFilterdAssignUserList([])	// 멘션 대상 사용자 정보 초기화
		}
		else {
			// 리플 작성창을 열음
			setCommentViewMode('default')
			setReplyViewMode('create')
			setSelectedCommentID(commentID)	// 선택한 리뷰 ID를 저장
			setSelectedReplyID(replyID)	// 선택한 리뷰 ID를 저장
			resetReply() // 리플 정보 기본 셋팅
			setFilterdAssignUserList([])	// 멘션 대상 사용자 정보 초기화
			setSelectedState(	// 선택한 리플의 상부 코멘트의 상태를 저장
				peerReviewCategories?.find((category) => category.peer_comment_id === commentID)?.peer_comment_state || 'Open'
			)
		}
	}

	// 리플 - 수정창 토글 핸들러
	const handleToggleReplyEdit = (commentID: number, replyID: number) => {
		// 선택 리뷰 수정창을 토글
		if (replyViewMode === 'edit') {
			// 리플 수정창을 닫음
			setCommentViewMode('default')
			setReplyViewMode('default')
			setSelectedReplyID(null)	// 선택한 리뷰 ID를 초기화
			setFilterdAssignUserList([])	// 멘션 대상 사용자 정보 초기화
		} 
		else {
			// 리플 수정창을 열음
			setCommentViewMode('default')
			setReplyViewMode('edit')
			setSelectedCommentID(commentID)	// 선택한 리뷰 ID를 저장
			setSelectedReplyID(replyID)	// 선택한 리뷰 ID를 저장
			// 선택한 리플 정보를 불러와서 셋팅
			const selectedReply = peerReviewCategories?.find((category) => category.peer_comment_id === commentID)?.peer_replies.find((reply) => reply.peer_reply_id === replyID)
			if (selectedReply) {
				setSelectedState(selectedReply.peer_reply_state)
				setReplyContent(selectedReply.peer_reply_content)
				// 멘션 대상 사용자 정보 설정  절차
				// 1. 해당 리플의 peer_mentions 정보를 통해 mention_user_id 목록을 추출
				const mentionUserIds = selectedReply.peer_mentions
					.filter((mention) => mention.peer_reply_id === replyID)  // 해당 replyID에 소속된 peer_mentions만 필터링
					.map((mention) => mention.mention_user_id);  // mention_user_id만 추출
				// 2. 추출된 mention_user_id 목록을 통해 사용자 정보를 필터링 
				const updatedAssignUserList = filterdSystemUserList.filter((user) =>
					mentionUserIds.includes(user.user_id)  // mention_user_id가 filterdSystemUserList의 user_id에 포함되는 사용자만 필터링
				);
				// 3. 필터링된 사용자 정보를 filterdAssignUserList에 저장
				setFilterdAssignUserList(updatedAssignUserList);
			}
			setSelectedState(	// 선택한 리플의 상부 코멘트의 상태를 저장
				peerReviewCategories?.find((category) => category.peer_comment_id === commentID)?.peer_comment_state || 'Open'
			)
		}
	}

	// 리플 - 삭제 버튼 핸들러
	const handleReplyDeleteButton = (commentID: number, replyID: number) => {
		// 삭제 버튼 클릭 시 해당 답글을 삭제하는 알림창 출력
		Swal.fire({
			title: '삭제 확인',
			text: '해당 답글을 삭제하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '삭제',
			cancelButtonText: '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				// back-front 양쪽 처리
				deletePeerReviewReply(replyID)
			}
		})
	}

	const handleCommentSignupIssue = (commentID: number) => {
		// 해당 코멘트를 이슈로 등록하는 알림창 출력
		Swal.fire({
			title: '이슈 등록 확인',
			text: '해당 리뷰를 이슈로 등록하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '등록',
			cancelButtonText: '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				// 이슈 등록 요청 처리
				// back-front 양쪽 처리
				signupPeerReviewIssue(commentID)
			}
		})
	}


	// 정보 초기화 함수

	// 코멘트 정보 초기화
	const resetComment = () => {
		setSelectedState('Open')
		setCommentTitle('')
		setCommentContent('')
		setFilterdAssignUserList([])	// 멘션 대상 사용자 정보 초기화
	}

	// 리플 정보 초기화
	const resetReply = () => {
		setSelectedState('Open')
		setReplyContent('')
		setFilterdAssignUserList([])	// 멘션 대상 사용자 정보 초기화
	}

	// 모든 정보 초기화 - 보통 카테고리 변경시 호출
	const resetAll = () => {
		setSelectedState('Open')
		setCommentViewMode('default')
		setReplyViewMode('default')
		setCommentTitle('')
		setCommentContent('')
		setReplyContent('')
		setSelectedSystemUser({user_id: '', user_name: ''})
		setFilterdAssignUserList([])	// 멘션 대상 사용자 정보 초기화
	}


	// 백엔드 호출 함수 

	// 사용자 정보 요청
	const getPeerReviewUserData = async (): Promise<void> => {
		const res = await GetPeerReviewUsers(project_state.project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: "error",
				title: "사용자 조회 실패",
				text: res.message,
			})
			return
		}
		setFilterdSystemUserList(() => res.data)
	}

	// 등록된 코멘트 및 리플 및 멘션 정보 요청
	const getPeerReviewCategories = async (): Promise<void> => {
		const res = await GetPeerReviewCategories({project_id, peer_comment_key, peer_chapter})
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '데이터 조회 실패',
				text: res.message,
			})
			return
		}
		setPeerReviewCategories(() => res.data)
	}

	// 코멘트 추가 요청
	const createPeerReviewComment = async (): Promise<void> => {
		const newPeer = filterdAssignUserList.map((user) => user.user_id)
        const res = await CreatePeerReview(
			{
				peer_chapter: peer_chapter,
				peer_comment_state: selectedState,
				peer_comment_title: commentTitle,
				peer_comment_content: commentContent,
				peer_comment_key: peer_comment_key,
				mention_user_id_list: newPeer
			}	
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '등록 실패',
				text: res.message,
			})
			return
		}
		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// 코멘트 수정 요청
	const updatePeerReviewComment = async (): Promise<void> => {
		const newPeer = filterdAssignUserList.map((user) => user.user_id)
		const res = await UpdatePeerReview(
			{
				peer_comment_id: selectedCommentID as number,
				peer_comment_state: selectedState,
				peer_comment_title: commentTitle,
				peer_comment_content: commentContent,
				mention_user_id_list: newPeer
			}	
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '수정 실패',
				text: res.message,
			})
			return
		}
		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// 코멘트 삭제 요청
	const deletePeerReviewComment = async (commentID: number): Promise<void> => {
		const res = await DeletePeerReview(
			{
				peer_comment_id: commentID
			}
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '삭제 실패',
				text: res.message,
			})
			return
		}
		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// 리플 추가 요청
	const createPeerReviewReply = async (): Promise<void> => {
		const newPeer = filterdAssignUserList.map((user) => user.user_id)
		const res = await CreatePeerReviewReply(
			{
				peer_comment_id: selectedCommentID as number,
				peer_reply_state: 'Open', //selectedState, - 리플은 상태 변경이 없음
				peer_reply_content: replyContent,
				mention_user_id_list: newPeer
			}	
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '등록 실패',
				text: res.message,
			})
			return
		}

		// comment backend 단 상태 정보 갱신
		const resComment = await UpdatePeerReviewState(
			{
				peer_comment_id: selectedCommentID as number,
				peer_comment_state: selectedState
			}	
		);
		if (!resComment.success) {
			Swal.fire({
				icon: 'error',
				title: '코멘트 상태 수정 실패',
				text: resComment.message,
			})
			return
		}

		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// 리플 수정 요청
	const updatePeerReviewReply = async (): Promise<void> => {
		const newPeer = filterdAssignUserList.map((user) => user.user_id)
		const res = await UpdatePeerReviewReply(
			{
				peer_reply_id: selectedReplyID as number,
				peer_comment_id: selectedCommentID as number,
				peer_reply_state: 'Open', //selectedState, - 리플은 상태 변경이 없음
				peer_reply_content: replyContent,
				mention_user_id_list: newPeer
			}	
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '수정 실패',
				text: res.message,
			})
			return
		}

		// comment backend 단 상태 정보 갱신
		const resComment = await UpdatePeerReviewState(
			{
				peer_comment_id: selectedCommentID as number,
				peer_comment_state: selectedState
			}	
		);
		if (!resComment.success) {
			Swal.fire({
				icon: 'error',
				title: '코멘트 상태 수정 실패',
				text: resComment.message,
			})
			return
		}

		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// 리플 삭제 요청
	const deletePeerReviewReply = async (replyID: number): Promise<void> => {
		const res = await DeletePeerReviewReply(
			{
				peer_reply_id: replyID
			}
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '삭제 실패',
				text: res.message,
			})
			return
		}
		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// 이슈 등록 요청 (코멘트만)
	const signupPeerReviewIssue = async (commentID: number): Promise<void> => {
		const res = await SignupPeerReviewIssue(
			{
				project_id: project_id,
				peer_comment_id: commentID
			}
		);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '이슈 등록 실패',
				text: res.message,
			})
			return
		}
		// frontend 단에 갱신
		getPeerReviewCategories()
	}

	// useEffect

	// 기본 정보 조회 - 창이 열릴 때마다 조회
	React.useEffect(() => {
		if (isOpen) {
			getPeerReviewUserData()	// 사용자 정보 조회
			getPeerReviewCategories()	// 피어 리뷰 카테고리 조회
			resetAll()	// 모든 정보 초기화
		}
	}, [isOpen])

	// peer-review 챕터가 변경되면 값을 다시 읽고 초기화 수행
	React.useEffect(() => {
		if(headerContent) {
			getPeerReviewCategories()
			resetAll()
		}
	}, [headerContent])

	// peer-review 카테고리가 변경되면 댓글 관리 상태를 초기화
	React.useEffect(() => {
		if (peerReviewCategories) {
			const flags = peerReviewCategories.map(() => false)	// 리뷰 개수만큼 false로 초기화
			setOpenCommentFlags(() => flags)	// 각 리뷰가 가진 댓글 상태를 저장
		}
	}, [peerReviewCategories])


	return (
		<React.Fragment>
			{isOpen && <div className={`w-[350px] min-h-[350px] max-h-[450px] shadow-lg z-40 absolute ${className}`}>
				<PanelContainer>
					<PanelHeader title="Peer Review" />
					<PanelBody className="px-0 py-0">
						{/* HEADER AREA */}
						<div className="py-1 px-2 bg-gray-100">
							{headerContent}
						</div>

						{/* BODY AREA */}
						<div className="py-1 px-2">
							{ 
								// 기존 항목 데이터 출력
								peerReviewCategories && peerReviewCategories.length != 0 && peerReviewCategories.map((category, index) => (
									<div key={index} className="grid grid-cols-1 grid-flow-row gap-2">
										<div className="p-1.5 mb-1.5 border-b-2 border-gray-300">

											{/* Peer-Review - Header */}
											<div className="grid grid-cols-1 md:grid-cols-4 items-center">
												<div className="md:col-span-3">
													<p className="font-bold text-lg inline-block">{
														filterdSystemUserList
														.find((user) => user.user_id === category.peer_comment_writer)
														?.user_name} ({category.peer_comment_writer})
													</p>
													<p className="ms-1 text-sm">{new Date(category.peer_comment_date).toLocaleString()}</p>
												</div>
												<div className="md:col-span-1">
													<p className="text-sm">상태:{category.peer_comment_state}</p>
												</div>
											</div>

											{/* Peer-Review - Body */}
											<div className="p-0.5 ps-1 border-s-2 flex justify-between">
												<div>
													<h1 className="text-lg font-bold">검토대상:{category.peer_comment_title}</h1>
													<p className="text-sm">의견:{category.peer_comment_content}</p>
												</div>
												<div>
													<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleCommentSignupIssue(category.peer_comment_id)}>+Issue</Button>
												</div>
											</div>
											
											{/* Peer-Review - Mention */}
											<div className="p-0.5 ps-1 border-s-2">
												{
													category.peer_mentions && category.peer_mentions.length != 0 && category.peer_mentions.map((mention, index_nd) => (
														<div key={index_nd} className="text-sm">
															@{filterdSystemUserList
															.find((user) => user.user_id === mention.mention_user_id)
															?.user_name || "Unknown User"} ({mention.mention_user_id})
														</div>
													))
												}
											</div>

											{/* Peer-Review - Footer */}
											<div className="p-0.5 mt-1 space-x-2">
												<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleToggleCommentAddReply(category.peer_comment_id)}>Comment</Button>
												<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleToggleCommentEdit(category.peer_comment_id)}>Edit</Button>
												<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleCommentDeleteButton(category.peer_comment_id)}>Delete</Button>
												{category.peer_replies.length > 0 && (
														<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleToggleCommentView(index)}>{openCommentFlags[index] ? "Hide Comments" : "Show Comments"}</Button>
													)}
											</div>

											{/* Peer-Review - Add Reply */}
											{commentViewMode === 'reply' && selectedCommentID === category.peer_comment_id &&
												<div className="p-0.5 ps-1 border-s-2">
													<div>
														<label htmlFor="existlabel" className="whitespace-pre">
															{'코멘트 상태 변경'}
														</label>
													</div>
													<div className='mb-3'>
														<Input.Select
															name="commentState"
															value={selectedState}
															onChange={handleSelectStateChange}
														// 이 부분은 Comment의 값을 변경시키기 위해서 사용됨
														>
															{/* 옵션 렌더링 */}
															{stateArray.map((state) => (
																<Input.Option key={state} value={state}>
																	{state}
																</Input.Option>
															))}
														</Input.Select>
													</div>

													<div>
														<label htmlFor="existlabel" className="whitespace-pre">
															{'의견'}</label>
													</div>
													<div className='mb-3'>
														<Input
															id="replyContent"
															name="replyContent"
															value={replyContent}
															onChange={handleReplyContentChange}
														/>
													</div>

													<div>
														<label htmlFor="existlabel" className="whitespace-pre">
															{'검토요청자'}
														</label>
													</div>

													<div className='mb-3'>
														<Input.Select
															name="replyUser"
															value={JSON.stringify(selectedSystemUser)}
															onChange={handleSelectUserChange}
														>
															{/* 옵션 렌더링 */}
															<Input.Option value="">대상 선택</Input.Option>
															{filterdSystemUserList
																.filter((user) => !filterdAssignUserList.some((assignUser) => assignUser.user_id === user.user_id))
																.map((user) => (
																	<Input.Option key={user.user_id} value={JSON.stringify(user)}>
																		{user.user_name} ({user.user_id})
																	</Input.Option>
																))}
														</Input.Select>
													</div>
													<div>
														{/* 이 부분에 선택한 값 출력 */}
														{selectedSystemUser.user_id && selectedSystemUser.user_name && (
															<div className='flex items-center justify-between space-x-2'>
																<p className='text-sm whitespace-nowrap'>선택 대상 : {selectedSystemUser.user_name} ({selectedSystemUser.user_id})</p>
																<Button className="text-sm p-0.5 px-1" onClick={handleInsertUser}>
																	대상 추가
																</Button>
															</div>
														)}
													</div>

													<div>
														{filterdAssignUserList
															.sort((a, b) => a.user_name.localeCompare(b.user_name)) // 이름 순 정렬
															.map((user) => (
																<div key={user.user_id} className="text-sm">
																	<div className='justify-between mb-1'>
																		<span className="font-semibold mr-5">{user.user_name}({user.user_id})</span>
																		<Button onClick={() => handleDeleteItem(user.user_id)}>
																			Del
																		</Button>
																	</div>
																</div>
															))}
													</div>

													<div className="mt-1 space-x-2">
														<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleReplySubmit()}>Confirm</Button>
														<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleReplyCancel()}>Cancel</Button>
													</div>
												</div>
											}

											{/* Peer-Review - Reply */}
											{openCommentFlags[index] &&
												<div className="ms-2 p-0.5 ps-1 border-s-2 grid grid-cols-1 grid-flow-row gap-2">
													{
														category.peer_replies && category.peer_replies.length != 0 && category.peer_replies.map((reply, index_nd) => (
															<div key={index_nd}>

																{/* Peer-Reply - Header */}
																<div className="grid grid-cols-1 md:grid-cols-4 items-center">

																	<div className="md:col-span-3">
																		<p className="font-bold text-lg inline-block">{
																		filterdSystemUserList
																		.find((user) => user.user_id === reply.peer_reply_writer)
																		?.user_name} ({reply.peer_reply_writer})
																		</p>
																		<p className="ms-1 text-sm">{new Date(reply.peer_reply_date).toLocaleString()}</p>
																	</div>
																	{/* <div className="md:col-span-1">
																		<p className="text-sm">상태:{reply.peer_reply_state}</p>
																	</div> */}
																</div>

																{/* Peer-Reply - Body */}
																<div className="p-0.5 ps-1 border-s-2">
																	<p className="text-sm">의견:{reply.peer_reply_content}</p>
																</div>

																{/* Peer-Reply - Mention */}
																<div className="p-0.5 ps-1 border-s-2">
																	{
																		reply.peer_mentions && reply.peer_mentions.length != 0 && reply.peer_mentions.map((mention, index_rd) => (
																			<div key={index_rd} className="text-sm">
																				@{filterdSystemUserList
																				.find((user) => user.user_id === mention.mention_user_id)
																				?.user_name || "Unknown User"} ({mention.mention_user_id})
																			</div> // todo - mention_user_id에 해당하는 사용자 정보를 가져와서 출력
																		))
																	}
																</div>

																{/* Peer-Reply - Footer */}
																<div className="p-0.5 mt-1 space-x-2">
																	<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleToggleReplyInput(category.peer_comment_id, reply.peer_reply_id)}>Comment</Button>
																	<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleToggleReplyEdit(category.peer_comment_id, reply.peer_reply_id)}>Edit</Button>
																	<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleReplyDeleteButton(category.peer_comment_id, reply.peer_reply_id)}>Delete</Button>
																</div>

																{/* Peer-Reply - Add Reply & Edit Reply */}
																{(replyViewMode === 'create' || replyViewMode === 'edit') && selectedReplyID === reply.peer_reply_id &&
																	<div className="p-0.5 ps-1 border-s-2">
																		<div>
																			<label htmlFor="existlabel" className="whitespace-pre">
																				{'코멘트 상태 변경'}
																			</label>
																		</div>
																		<div className='mb-3'>
																			<Input.Select
																				name="commentState"
																				value={selectedState}
																				onChange={handleSelectStateChange}
																				// 이 부분은 Comment의 값을 변경시키기 위해서 사용됨
																			>
																			{/* 옵션 렌더링 */}
																				{stateArray.map((state) => (
																					<Input.Option key={state} value={state}>
																						{state}
																					</Input.Option>
																				))}
																			</Input.Select>
																		</div>

																		<div>
																			<label htmlFor="existlabel" className="whitespace-pre">
																				{'의견'}
																			</label>
																		</div>
																		<div className='mb-3'>
																			<Input
																				id="replyContent"
																				name="replyContent"
																				value={replyContent}
																				onChange={handleReplyContentChange}
																			/>
																		</div>

																		<div>
																			<label htmlFor="existlabel" className="whitespace-pre">
																				{'검토요청자'}
																			</label>
																		</div>

																		<div className='mb-3'>
																			<Input.Select
																				name="replyUser"
																				value={JSON.stringify(selectedSystemUser)}
																				onChange={handleSelectUserChange}
																			>
																				{/* 옵션 렌더링 */}
																				<Input.Option value="">대상 선택</Input.Option>
																				{filterdSystemUserList
																					.filter((user) => !filterdAssignUserList.some((assignUser) => assignUser.user_id === user.user_id))
																					.map((user) => (
																						<Input.Option key={user.user_id} value={JSON.stringify(user)}>
																							{user.user_name} ({user.user_id})
																						</Input.Option>
																					))}
																			</Input.Select>
																		</div>
																		<div>
																			{/* 이 부분에 선택한 값 출력 */}
																			{selectedSystemUser.user_id && selectedSystemUser.user_name && (
																				<div className='flex items-center justify-between space-x-2'>
																					<p className='text-sm whitespace-nowrap'>선택 대상 : {selectedSystemUser.user_name} ({selectedSystemUser.user_id})</p>
																					<Button className="text-sm p-0.5 px-1" onClick={handleInsertUser}>
																						대상 추가
																					</Button>
																				</div>
																			)}
																		</div>

																		<div>
																			{filterdAssignUserList
																				.sort((a, b) => a.user_name.localeCompare(b.user_name)) // 이름 순 정렬
																				.map((user) => (
																					<div key={user.user_id} className="text-sm">
																						<div className='justify-between mb-1'>
																							<span className="font-semibold mr-5">{user.user_name}({user.user_id})</span>
																							<Button onClick={() => handleDeleteItem(user.user_id)}>
																								Del
																							</Button>
																						</div>
																					</div>
																				))}
																		</div>

																		<div className="mt-1 space-x-2">
																			<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleReplySubmit()}>Confirm</Button>
																			<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleReplyCancel()}>Cancel</Button>
																		</div>
																	</div>
																}
															</div>
														))
													}
												</div>
											}

										</div>

									</div>
								))
							}
							<div className="p-1.5 mt-1.5 border-t-2 flex justify-center items-center">
								<Button variant="unset" className='p-0.5 px-1' onClick={() => handleToggleCommentInput()}>신규 의견 작성</Button> 
							</div>

							{/* Peer-Review - Add Comment (mean create new comment) & Edit Comment */}
							{(commentViewMode === 'create' || commentViewMode === 'edit') &&
								<div className="p-0.5 ps-1 border-s-2">
									<div>
										<label htmlFor="existlabel" className="whitespace-pre">
											{'상태'}
										</label>
									</div>
									<div className='mb-3'>
										<Input.Select
											name="commentState"
											value={selectedState}
											onChange={handleSelectStateChange}
											disabled={commentViewMode === 'create'}
										>
										{/* 옵션 렌더링 */}
											{stateArray.map((state) => (
												<Input.Option key={state} value={state}>
													{state}
												</Input.Option>
											))}
										</Input.Select>
									</div>

									<div>
										<label htmlFor="existlabel" className="whitespace-pre">
											{'검토대상'}
										</label>
									</div>
									<div className='mb-3'>
										<Input
											id="commentTitle"
											name="commentTitle"
											value={commentTitle}
											onChange={handleCommentTitleChange}
										/>
									</div>

									<div>
										<label htmlFor="existlabel" className="whitespace-pre">
											{'의견'}
										</label>
									</div>
									<div className='mb-3'>
										<Input
											id="commentContent"
											name="commentContent"
											value={commentContent}
											onChange={handleCommentContentChange}
										/>
									</div>
									
									<div>
										<label htmlFor="existlabel" className="whitespace-pre">
											{'검토요청자'}
										</label>
									</div>
									<div className='mb-3'>
										<Input.Select
											name="commentUser"
											value={JSON.stringify(selectedSystemUser)}
											onChange={handleSelectUserChange}
										>
										{/* 옵션 렌더링 */}
										<Input.Option value="">대상 선택</Input.Option>
											{filterdSystemUserList
											.filter((user) => !filterdAssignUserList.some((assignUser) => assignUser.user_id === user.user_id))
											.map((user) => (
												<Input.Option key={user.user_id} value={JSON.stringify(user)}>
													{user.user_name} ({user.user_id})
												</Input.Option>
											))}
										</Input.Select>
									</div>
									<div>
										{/* 이 부분에 선택한 값 출력 */}
										{selectedSystemUser.user_id && selectedSystemUser.user_name && (
											<div className='flex items-center justify-between space-x-2'>
												<p className='text-sm whitespace-nowrap'>선택 대상 : {selectedSystemUser.user_name} ({selectedSystemUser.user_id})</p>
												<Button className="text-sm p-0.5 px-1" onClick={handleInsertUser}>
													대상 추가
												</Button>
											</div>
										)}
									</div>

									<div>
										{filterdAssignUserList
										.sort((a, b) => a.user_name.localeCompare(b.user_name)) // 이름 순 정렬
										.map((user) => (
											<div key={user.user_id} className="text-sm">
												<div className='justify-between mb-1'>
													<span className="font-semibold mr-5">{user.user_name}({user.user_id})</span>
													<Button onClick={() => handleDeleteItem(user.user_id)}>
														Del
													</Button>
												</div>
											</div>
										))}
									</div>

									<div className="mt-1 space-x-2">
										<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleCommentSubmit()}>Confirm</Button>
										<Button variant="unset" className='text-sm p-0.5 px-1' onClick={() => handleCommentCancel()}>Cancel</Button>
									</div>
								</div>
							}

						</div>
					</PanelBody>
				</PanelContainer>
			</div> }
		</React.Fragment>
	)
}

export default PeerReview

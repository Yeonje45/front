import { X } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	editModeState: boolean
	handleEditModeState: () => void
	handleCreateModeState: () => void	
	peerReviewAvailableState: boolean
	peerReviewModeState: boolean
	handlePeerReviewModeState: () => void

	tableColumns: string[]
}

const PanelOptionBar = ({
	editModeState,
	handleEditModeState,
	handleCreateModeState,
	peerReviewAvailableState,
	peerReviewModeState,
	handlePeerReviewModeState,
	tableColumns,
}: IProps) => {
	return (
		<div className="flex items-center gap-1">
			{/* Peer Review Mode ON/OFF */}
			{peerReviewAvailableState && (
				<Button variant="primary" onClick={handlePeerReviewModeState}>
					<span className="font-bold">{peerReviewModeState ? '리뷰 닫기' : '리뷰 열기'}</span>
				</Button>
			)}
			{/* Edit Mode ON/OFF */}
			<Button variant="primary" onClick={handleEditModeState}>
				Edit Mode
				<span className="ml-2 font-bold">{editModeState ? 'ON' : 'OFF'}</span>
			</Button>
			{/* Edit Mode가 ON 상태일 때만 볼 수 있는 UI */}
			{editModeState && (
				<div className="flex items-center justify-center gap-1">
					<Button variant="primary" onClick={handleCreateModeState}>
						추가
					</Button>
				</div>
			)}
		</div>
	)
}

export default PanelOptionBar

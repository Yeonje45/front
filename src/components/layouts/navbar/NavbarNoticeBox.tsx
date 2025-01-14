import React, { ReactElement } from 'react'

import Button from "../../../tailwindElement/Button"

type BtnEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>

// # TODO: 백엔드 개발 시에 완성
interface NoticeData {
	ActionItem: {
	}[]
	Notice: {
	}[]
}

const NavbarNoticeBox = () => {
	const [selectedTab, setSelectedTab] = React.useState<string>("ActionItem") // [ActionItem, Notice]
	const [noticeDataList, setNoticeDataList] = React.useState<NoticeData>()

	const handleSelectedTab = (event: BtnEvent): void => {
		const {name} = event.currentTarget
		setSelectedTab(name)
		return
	}

	// # TODO: 이후에 백엔드 ActionItem 개발 완료 시에 구현 
	const getActionItemHandle = async (event: BtnEvent): Promise<void> => {}

	// # TODO: 이후에 백엔드 Notice 개발 완료 시에 구현
	const getNoticeHandle = async (event: BtnEvent): Promise<void> => {}

	const getNoticeCategoryElement = (name: string): ReactElement<any, any> => {
		switch (name) {
			case "ActionItem":
				return (
					<main className="flex flex-col p-2 bg-gray-200 gap-2">
						<div className="relative px-2 py-2 text-sm bg-gray-50 rounded-md">
							Action Item 넣어주세요.
							{/*나중에 삭제/휴지통 아이콘으로 변경 예정*/}
							<Button variant="unset" className="absolute top-0 right-0 p-2">삭제</Button>
						</div>
					</main>
				)
			case "Notice":
				return (
					<main className="flex flex-col p-2 bg-gray-200 gap-2">
						<div className="relative px-2 py-2 text-sm bg-gray-50 rounded-md">
							공지 넣어주세요.
							{/*나중에 삭제/휴지통 아이콘으로 변경 예정*/}
							<Button variant="unset" className="absolute top-0 right-0 p-2">삭제</Button>
						</div>
					</main>
				)
			default:
				return (
					<>Error...</>
				)
		}
	}

	return (
		<div className="select-none me-4">
			<input type="checkbox" name="notice" id="notice" className="hidden peer" />
				<label htmlFor="notice" className="cursor-pointer select-none">알림(0건)</label>
				<div className="absolute hidden text-black bg-gray-300 border rounded-md peer-checked:flex flex-col right-[40px] top-[40px] w-[300px] shadow-md">
					<header className="flex items-center justify-center w-full">
						<Button onClick={handleSelectedTab} name="ActionItem" variant={selectedTab == "ActionItem" ? "secondary" : "light"} className="w-1/2 rounded-none">Action Item</Button>
						<Button onClick={handleSelectedTab} name="Notice" variant={selectedTab == "Notice" ? "secondary" : "light"} className="w-1/2 rounded-none">공지</Button>
					</header>
					<main className="flex flex-col p-2 bg-gray-200 gap-2">
						{getNoticeCategoryElement(selectedTab)}
					</main>
				</div>
		</div>
	)
}

export default NavbarNoticeBox

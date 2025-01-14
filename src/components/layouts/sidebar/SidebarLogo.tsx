import { useNavigate } from 'react-router'

import logoImage from '../../../assets/project_logo_white.svg'
import { List } from 'react-bootstrap-icons'
import { useState } from 'react'

const SidebarLogo = () => {
	const [openSetting, setOpenSetting] = useState<boolean>(false)
	const navigate = useNavigate()

	// 이미지 클릭 시에 "/"로 이동
	const onClickLogo = (): void => {
		navigate('/project/list')
		return
	}

	const handleOpenSetting = () => {
		setOpenSetting(!openSetting)
	}

	return (
		<div className="w-full py-4 text-center bg-gray-700 sidebar_logo">
			{/* <p className="text-3xl text-white">SDSP</p> */}
			<div className="flex items-center justify-center gap-2">
				<img src={logoImage} onClick={onClickLogo} className="cursor-pointer w-44" />
			</div>
		</div>
	)
}

export default SidebarLogo

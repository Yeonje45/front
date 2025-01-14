import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import userDefaultProfile from 'assets/user_default_profile_img.png'

import NavbarNavItem from './NavbarNavItem'
import NavbarActionButton from './NavbarActionButton'
import NavbarNoticeBox from './NavbarNoticeBox'

import { logoutUser } from 'features/user/userSlice'
import { RootState } from 'app/store'

interface IProps {
	projectName: string
}

const NavbarTop = ({ projectName }: IProps) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const user_state = useSelector((state: RootState) => state.user).user
	const project_state = useSelector((state: RootState) => state.project).project

	const logoutActionHandle = async () => {
		await Swal.fire({
			title: '로그아웃 성공',
			icon: 'success',
		}).then(async result => {
			dispatch(logoutUser())
			navigate('/', { replace: true })
		})
	}

	return (
		<div className="flex items-center justify-between p-2 navbar-top">
			<Link to="/project/list" className="text-3xl align-middle">
				{projectName && (
					<div>
						<span>프로젝트명:</span> <span className="font-bold">{projectName}</span>
					</div>
				)}
			</Link>
			<ul className="flex items-center justify-center bg-gray-100">
				<NavbarNavItem to="/user-setting/manage">설정</NavbarNavItem>
				<li className="w-[30px]">
					{user_state.user_profile === null ? (
						<img src={userDefaultProfile} className="w-full rounded-full" />
					) : (
						<img
							src={
								process.env.REACT_APP_BASE_URL + 'static/' + user_state.user_profile
							}
							className="w-full rounded-full"
						/>
					)}
				</li>
				<NavbarNavItem to="/user-setting/info">
					{project_state && project_state.project_manager_id === user_state.user_id && "[PM]"}
					{user_state.user_name}
				</NavbarNavItem>
				<NavbarActionButton onClick={logoutActionHandle}>로그아웃</NavbarActionButton>
			</ul>
		</div>
	)
}

export default NavbarTop

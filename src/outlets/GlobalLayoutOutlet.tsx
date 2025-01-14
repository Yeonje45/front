import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import Sidebar from '../components/layouts/sidebar/Sidebar'
import NavbarWrapper from '../components/layouts/navbar/NavbarWrapper'

import { INavItem } from 'constant/layout/sidebar'
import { getCookieByName, deleteUserCookie } from 'utils/cookie'
import { OutletTokenAxios } from 'models'
import { logoutUser } from 'features/user/userSlice'
import { clearProject } from 'features/project/projectSlice'
import { RootState } from 'app/store'

interface IProps {
  NavItems?: INavItem[]
  navbarTop: boolean
  navbarBottom: boolean
  projectName: string
}

const GlobalLayoutOutlet = ({
  NavItems,
  navbarTop,
  navbarBottom,
  projectName,
}: IProps) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.user)

  // path('auth/token-verify/', TokenVerifyView.as_view(), name='login_token_verify'), # access_token이 유효한지 확인
  // 현재 로그인 정보로 토큰이 만료 되었는지, 유효한지 확인 [GlobalLayoutOutlet]
  // 유효하지 않다면 로그인 페이지로 이동 [dispatch 지우기, 쿠키 지우기, 페이지 이동, Swal 메시지]
  // App.tsx에서 이미 토큰 존재 *유무는 확인이 되었기에 Get 요청으로 확인 하면 됨
  useEffect(() => {
    verifyToken()
  }, [getCookieByName('access_token'), getCookieByName('user_id'), window.location.pathname]) 

  const verifyToken = async () => {
		await OutletTokenAxios.post('/users/auth/token-verify/', {
			token: user.access_token || getCookieByName('access_token'),
		}).catch(() => {
			dispatch(logoutUser())
			dispatch(clearProject())
			deleteUserCookie()
			Swal.fire({
				title: '로그인 세션이 만료되었습니다.',
				text: '로그인이 필요합니다.',
				icon: 'error',
				confirmButtonText: '확인',
				confirmButtonColor: '#4B5563',
			})
			navigate('/')
		})
  }

  return (
    <div className="w-full text-sm">
      <header>
        <Sidebar NavItems={NavItems} />
        <NavbarWrapper
          navbarTop={navbarTop}
          navbarBottom={navbarBottom}
          projectName={projectName}
        />
      </header>
      {/* Content Area */}
      <main className="pt-20 lg:pl-60" id="main_wrapper" style={{ height: 'calc(100vh - 5rem)' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default GlobalLayoutOutlet

import { useEffect, useState } from 'react'
import IntroImg from '../../../assets/project_logo.png'
import Container from 'tailwindElement/Container'

// 특정 페이지에 입장 시에 0.85초 동안 보여지는 인트로입니다.
const PageIntro = () => {
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 850)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Container fluid className={`intro_container ${visible ? 'visible' : 'hidden'}`}>
      <div className="intro_content">
        <div className="logo_container">
          <img src={IntroImg} alt="sdsp_logo" className="m-auto" />
        </div>
        <h1>Moasoft - SDSP</h1>
      </div>
    </Container>
  )
}

export default PageIntro

import { useEffect, useState } from "react"
import { ArrowClockwise } from "react-bootstrap-icons"
import Swal from "sweetalert2"

interface IProps {
	children: React.ReactNode
  className?: string
}

const Loading = () => {
  return (
    <div className="absolute w-full h-[500px] flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <ArrowClockwise size={50} className="animate-spin" />
        <p className="text-2xl">loading...</p>
      </div>
    </div>
  )
}

const EditorXinha = ({children, className}: IProps) => {  
  // loading event state
  const [loading, setLoading] = useState<boolean>(true)
  const [time, setTime] = useState<number>(0)

  // IFrame 생성 이후 resize 될 때 동적으로 width 100%로 변경
  const iframe_box = document.getElementById('iframe_box')
  const iframe = document.getElementById('XinhaIFrame_0') as HTMLIFrameElement

  window.addEventListener('resize', () => {
    if(iframe && iframe_box) {
      (iframe_box.children[0] as HTMLTableElement).style.width = `100%`
      iframe.style.width = `100%`
    }
  })

  useEffect(() => {
    if(loading) {
      try {
        setTimeout(() => { // 0.001초 마다 loading 상태 확인
          if(iframe && iframe.contentWindow) {
            setLoading(false)
          }        
  
          setTime((prev)=> prev + 1)
          
          if(document.referrer !== document.location.href || time === 80){
            window.location.reload();
          }
        }, 10)
      }
      catch(e: any) {
        console.log(e.message);
        
        Swal.fire({
          icon: 'error',
          title: '알 수 없는 오류입니다. 다시 접속해주세요.',
        }).then((res) => {
          if(res.isConfirmed) {
            window.location.href = '/project/list'
          }
        })
      }
    }
  }, [time, loading])

  return (
    <div className={`relative flex flex-col ${className}`} id="iframe_box">
      {
        loading ?
          (<Loading />)
        : null
      }
    <textarea id="0" value={children!.toString()} readOnly className={`${loading ? "opacity-0" : "opacity-100"} w-full h-[600px] flex justify-center`}>
    </textarea>
    </div>
  )
}
export default EditorXinha  
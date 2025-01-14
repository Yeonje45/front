import { AccessAxios } from "models"
import { convertImagesToBase64InHTML, fileFooter, fileHeader } from "./formmat"
import Swal from "sweetalert2"


const location = window.location
const searchParams = new URLSearchParams(location.search)
const step = searchParams.get('step')
const project_id = searchParams.get('project_id')

export const outputContentUploadHandler = async (wrapper: string, output_data: {
  output_name: string,
  output_number: number,
}) => {
  
  // TODO: 산출물 업로드 직전 다른 사람이 수정 중인지 확인
  
  const output_name: {
    [key: string]: string
  } = {
    "SDP": "소프트웨어개발계획서(SDP)",
    "SPS": "소프트웨어산출물명세서(SPS)",
    "SRS": "소프트웨어요구사항명세서(SRS)",
    "SDD": "소프트웨어설계기술서(SDD)",
    "STP": "소프트웨어통합시험계획서(STP)",
    "STD": "소프트웨어통합시험절차서(STD)",
    "STR": "소프트웨어통합시험결과서(STR)",
  }

  const stepType: {
    [key: string]: string[]
  } = {
    "SDP": ["kom"],
    "SPS": ["trr"],
    "SRS": ["srr"],
    "SDD": ["pdr", "ddr"],
    "STP": ["ddr", "cdr"],
    "STD": ["cdr"],
    "STR": ["trr"],
  }

  const output_content = {
    "output_name": output_name[output_data.output_name],
    "output_number": output_data.output_number, 
  }

  Swal.fire({
    icon: 'info',
    title: '산출물 업로드',
    html: '<p>현재 산출물 업로드 진행 중입니다.</p> <p>잠시만 기다려주세요.</p>',
    showConfirmButton: false,
    allowOutsideClick: false,    
  })

  await AccessAxios.put(`/documents/version/`, {
    project_id: project_id,
    doc_type: output_data.output_name.toLowerCase(),
    output_content_wrapper: wrapper,
  }).then((res) => {
    if(res.status === 200) {
      Swal.fire({
        icon: 'success',
        title: '산출물 업로드',
        html: '<p>산출물 파일 생성이 완료되었습니다.</p> <p>단계별 산출물 작성현황에서 해당 문서를 업로드해주세요.</p>',
        showConfirmButton: true,
        confirmButtonText: '확인',
      }).then((res) => {
        if(res.isConfirmed) {
          localStorage.setItem('output_content', JSON.stringify(output_content))
    
          if(step) {
            window.location.href = `/product/condition?project_id=${project_id}&step=${stepType[output_data.output_name].includes(step) ? step : stepType[output_data.output_name][0]}`
          }
        }
      })
    }
  })
  .catch((error:any) => {
    Swal.fire({
      icon: 'error',
      title: '산출물 업로드',
      text: '산출물 업로드 중 오류가 발생했습니다. 다시 시도해주세요.',
      showConfirmButton: true,
      confirmButtonText: '확인',
    })
  })
}

export const outputContentConvertHandler = async () => {
  const output_content = localStorage.getItem('output_content')
  if(!output_content) return

  let output_name  = JSON.parse(output_content).output_name
  output_name = output_name.split('(')[1].split(')')[0]  

  const wrapper = await AccessAxios.get(`/outputs/content/?project_id=${project_id}&doc_type=${output_name.toLowerCase()}`).then((res) => {
    if(res.status === 200) {
      return res.data.data
    }
  })  

  const convertHTML = await convertImagesToBase64InHTML(wrapper)
  
  const blob = new Blob([fileHeader + convertHTML + fileFooter], {
    type: 'application/x-hwp',
  })

  return blob
}
import Swal from 'sweetalert2'

export const toolbalItems = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote'],
  ['ul', 'ol', 'task', 'indent', 'outdent'],
  ['table', 'image', 'link'],
]

export const EditorStyle = `
.HStyle0 {
			style-name:"바탕글";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:160%;
			font-size:11.0pt;
			font-family:한양신명조;
			letter-spacing:-2%;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle1 {
			style-name:"02_본문_항목제목";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:160%;
			font-size:11.0pt;
			font-family:고딕;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
		.HStyle2 {
			style-name:"03_본문_내용";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:160%;
			font-size:11.0pt;
			font-family:한양신명조;
			letter-spacing:-2%;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle3 {
			style-name:"04_도표그림_제목";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:160%;
			font-size:11.0pt;
			font-family:고딕;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle4 {
			style-name:"05_도표내용_항목제목";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:150%;
			font-size:10.0pt;
			font-family:고딕;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle5 {
			style-name:"06_도표내용_본문중앙";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:150%;
			font-size:10.0pt;
			font-family:한양신명조;
			letter-spacing:-3%;
			font-weight:normal;
			font-style:normal;
			font-stretch: condensed;
			color:#282828;
		}
		.HStyle6 {
			style-name:"07_도표내용_본문혼합";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:3.0pt;
			line-height:150%;
			font-size:10.0pt;
			font-family:한양신명조;
			letter-spacing:-3%;
			font-weight:normal;
			font-style:normal;
			font-stretch: condensed;
			color:#282828;
		}

		.HStyle7 {
			style-name:"08_표지_제목";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:160%;
			font-size:21.0pt;
			font-family:한양신명조;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
		.HStyle8 {
			style-name:"09_표지_장비명";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:160%;
			font-size:21.0pt;
			font-family:고딕;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
		.HStyle9 {
			style-name:"10_표지_작성자";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:160%;
			font-size:12.0pt;
			font-family:한양신명조;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle10 {
			style-name:"11_표지_목차";
			padding: 5px;
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:start;
			text-indent:0.0pt;
			line-height:160%;
			font-size:11.0pt;
			font-family:신명조체;
			letter-spacing:-5cm;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}

		.HStyle11 {
			style-name:"12_머리꼬리말";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:160%;
			font-size:11.0pt;
			font-family:한양신명조;
			letter-spacing:-2%;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle12 {
			style-name:"13_주석";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:140%;
			font-size:9.0pt;
			font-family:한양신명조;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle13 {
			style-name:"14_도움말_파란색";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:150%;
			font-size:9.0pt;
			font-family:한양신명조;
			letter-spacing:0;
			font-weight:normal;
			font-style:italic;
			color:#0000ff;
		}
		.HStyle14 {
			style-name:"15_도움말_빨간색";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:150%;
			font-size:9.0pt;
			font-family:고딕;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#ff0000;
		}
		.HStyle15 {
			style-name:"대제목";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:left;
			text-indent:0.0pt;
			line-height:127%;
			font-size:17.2pt;
			font-family:바탕체;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle16 {
			style-name:"본문";
			margin-left:15.0pt;
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:160%;
			font-size:10.0pt;
			font-family:바탕;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle17 {
			style-name:"개요 3";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:160%;
			font-size:13.0pt;
			font-family:HY신명조;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
		.HStyle18 {
			style-name:"항목";
			margin-left:15.0pt;
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:130%;
			font-size:10.0pt;
			font-family:휴먼명조;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle19 {
			style-name:"장절";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:center;
			text-indent:0.0pt;
			line-height:200%;
			font-size:15.0pt;
			font-family:돋움;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
		.HStyle20 {
			style-name:"목차 1";
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:left;
			text-indent:0.0pt;
			line-height:120%;
			font-size:10.0pt;
			font-family:돋움체;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
		.HStyle21 {
			style-name:"목차 2";
			margin-left:7.5pt;
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-align:justify;
			text-indent:0.0pt;
			line-height:120%;
			font-size:10.0pt;
			font-family:바탕;
			letter-spacing:0;
			font-weight:normal;
			font-style:normal;
			color:#000000;
		}
		.HStyle00 {
			style-name:"공백_줄바꿈";
			text-align: start;
			margin-top:0.0pt;
			margin-bottom:0.0pt;
			text-indent:0.0pt;
			line-height:160%;
			font-size:21.0pt;
			font-family:한양신명조;
			letter-spacing:0;
			font-weight:bold;
			font-style:normal;
			color:#000000;
		}
`

export const fileHeader = `
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>jhkim - settin utf, font, base html struct</title>
    <style type="text/css">
		${EditorStyle}
		</style>
  </head>
  <body>
`

export const fileFooter = `
	</body>
</html>`

// 이미지 URL을 Base64로 변환하는 함수
function convertImageToBase64(url: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      const reader = new FileReader()
      reader.onloadend = function () {
        resolve(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.onerror = function () {
      reject(new Error(`Failed to load image: ${url}`))
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  })
}

// HTML에서 모든 <img> 태그의 src를 Base64로 변환하는 함수
export const convertImagesToBase64InHTML = async (htmlContent: string): Promise<string> => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const imgTags = doc.querySelectorAll('img') // 모든 <img> 태그를 선택합니다.

  for (let img of Array.from(imgTags)) {
    const originalSrc = img.src

    try {
      // 이미지 URL을 Base64로 변환합니다.
      const base64Data = await convertImageToBase64(originalSrc)
      img.src = base64Data as string // Base64 데이터를 src에 다시 할당합니다.
    } catch (error) {
      console.error(`Failed to convert image: ${originalSrc}`, error)
    }
  }

  return doc.documentElement.outerHTML as string // 변환된 HTML 콘텐츠를 반환합니다.
}

// #TODO: Refactor FUCK - jhkim
export const SaveAsHTMLFileByProudct = async (
  htmlContent: string,
  fileName: string,
): Promise<void> => {
  if (!fileName.length) {
    return
  }

  const convertHTML = await convertImagesToBase64InHTML(htmlContent)

  // type: hwp 한글로 저장 되게 하려면 type: 'application/x-hwp' 로 설정
  const blob = new Blob([fileHeader + convertHTML + fileFooter], {
    type: 'application/x-hwp',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.hwp`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// #TODO: Refactor FUCK - jhkim
export const SaveAsHTMLFile = async (
  htmlContent: string,
  fileName: string,
): Promise<void> => {
  if (!fileName.length) {
    return
  }

  const yy = new Date().getFullYear().toString().slice(2)
  const mm = ('0' + (new Date().getMonth() + 1).toString()).slice(-2)
  const dd = ('0' + new Date().getDate().toString()).slice(-2)

  Swal.fire({
    icon: 'info',
    title: `${fileName} 문서를 한글 파일로 변환 중입니다.`,
    showConfirmButton: false,
    allowOutsideClick: false,
  })

  const convertHTML = await convertImagesToBase64InHTML(htmlContent)

  // type: hwp 한글로 저장 되게 하려면 type: 'application/x-hwp' 로 설정
  const blob = new Blob([fileHeader + convertHTML + fileFooter], {
    type: 'application/x-hwp',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}_${yy + mm + dd}.hwp`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  Swal.fire({
    icon: 'success',
    title: `한글 파일로 변환된 ${fileName} 문서가 다운로드 되었습니다.`,
    showConfirmButton: false,
    timer: 1500,
  })
}

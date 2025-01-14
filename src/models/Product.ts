import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from './Response'

/** 단계별 산출물 목록 페이지 - 기본 템플릿 전체 다운로드
 * @param project_id: string
 */
export const DownloadAllTemplate = async (project_id: string): Promise<void> => {
	const downloadUrl = `${process.env.REACT_APP_BASE_URL}outputs/template/?project_id=${project_id}&is_original=true`;

	fetch(downloadUrl)
		.then(response => response.blob()) // 파일 데이터를 Blob 형식으로 변환
		.then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'templates.zip';  // 여기서 원하는 파일 이름으로 설정
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url); // 메모리 해제
			document.body.removeChild(a);
		})
		.catch(err => console.error('Download failed', err));
}

/** 단계별 산출물 목록 페이지 - 사용자 정의 템플릿 다운로드
 * @param project_id: string
 */
export const DownloadAllCustomTemplate = async (project_id: string): Promise<void> => {
	const downloadUrl = `${process.env.REACT_APP_BASE_URL}outputs/template/?project_id=${project_id}&is_original=false`;

	fetch(downloadUrl)
		.then(response => response.blob()) // 파일 데이터를 Blob 형식으로 변환
		.then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'custom_templates.zip';  // 여기서 원하는 파일 이름으로 설정
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url); // 메모리 해제
			document.body.removeChild(a);
		})
		.catch(err => console.error('Download failed', err));
}

/*
  const location = useLocation()
  const isQuery = location.search.includes(text || '')

  // 현재 쿼리에서 project_id와 step 추출
  const searchParams = new URLSearchParams(location.search)
  const projectId = searchParams.get('project_id')
  const step = searchParams.get('step')
*/
// location을 과 이동하려는 URL을 parameter로 받으면 project_id, step을 추출하여 이동하려는 URL을 뱉어주는 식으로 함수를 구현
export const GetURLWithProjectIdAndStep = (location: any, url : string): string => {
	const searchParams = new URLSearchParams(location.search)
	const projectId = searchParams.get('project_id')
	const step = searchParams.get('step')
	return `${url}?project_id=${projectId}&step=${step}`
}

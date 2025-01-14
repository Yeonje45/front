import { RequirementGroupModel } from "models/RequirementModel"

const mapClassification: {[key: string]: string} = {
	'system_requirement': '체계 요구사항',
	'sw_requirement': 'SW 요구사항',
	'swdesign_requirement': 'SW 설계 요구사항',
	'swtest_requirement': 'SW 테스트 요구사항',
}

// classification에 따른 요구사항 Key ( Primary key )를 찾아주는 함수입니다.
export const getClassificationKeyID = (requirement: { [key: number]: RequirementGroupModel; }, classification: string): number => {
	const key = Object.keys(requirement).map((key) => {
		if (requirement[+key].group_name === mapClassification[classification]) {
			return key
		}
	}).filter((item) => {
		return item !== undefined
	})

	return +key
}

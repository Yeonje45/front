import React, { useState } from 'react'
import Modal from "tailwindElement/Modal"
import Button from "tailwindElement/Button"

import PanelContainer from "components/common/panels/PanelContainer"
import PanelHeader from "components/common/panels/PanelHeader"

import { AIRAMPAxios } from "models/index"

type Props = {
	putSelectedResult: (id: string) => void
}

const Shortcut_CHECKLIST_MODAL_FIELD = [
  {
    key: "measure01",
    title: "강점(Strengths)",
    fieldheader: ["Strengths", "Yes", "No", "Somewhat", "N/A"],
    fielddata: [
      {
        text: "We protect older code that shouldn't be modified.\n수정되지 않아야 하는 기존 코드를 보호한다.",
				type: "strengths_1"
      },
      {
        text: "The total schedule time in years is less than 1.\n총 개발 기간은 1년 미만이다.",
				type: "strengths_2"
      },
      {
        text: "The number of software people years for this release is less than 7.\n이 소프트웨어의 개발 인력은 7M/Y이하이다.",
				type: "strengths_3"
      },
      {
        text: "Domain knowledge required to develop this software application can be acquired via public domain in short period of time.\n이 소프트웨어 응용 프로그램을 개발하는데 필요한 도메인 지식은 짧은 기간 내에 획득할 수 있다.",
				type: "strengths_4"
      },
      {
        text: "This software application has imminent legal risks.\n이 소프트웨어 응용 프로그램은 법률적인 위험을 초래할 수 있다.",
				type: "strengths_5"
      },
      {
        text: "Operators have been or will be trained on the software.\n운영자들은 소프트웨어에 대해 훈련 받아왔거나 훈련 받을 것이다.",
				type: "strengths_6"
      },
      {
        text: "The software team members who are working on the same software system are geographically colocated.\n소프트웨어 시스템 구현에 참여하는 소프트웨어의 팀 멤버들은 지리적으로 가까이 있다.",
				type: "strengths_7"
      },
      {
        text: "Turnover rate of software engineers on this project is < 20% during course of project.\n이 프로젝트의 소프트웨어 엔지니어 이직률이 20% 미만이다.",
				type: "strengths_8"
      },
      {
        text: "This will be a maintenance release. (no major feature addition)\n이것은 주요기능의 추가가 없는 유지보수 출시(release)이다.",
				type: "strengths_9"
      },
      {
        text: "The software has been recently reconstrycted.\n(i.e. to update legacy design or code) \n소프트웨어가 최근에 재구성되었다.\n(ex : 레거시디자인 또는 코드 업데이트)",
				type: "strengths_10"
      },
      {
        text: "We have a small organization (<8 people) or there are team sizes that do not exceed 8 people per team.\n소규모 조직(8명 미만) 또는 팀당 8명을 초과하지 않는 팀이다.",
				type: "strengths_11"
      },
      {
        text: "We have a culture in which all software engineers value testing their own code. \n(as opposed to waiting for someone else to test it)\n개발조직은 모든 소프트웨어 엔지니어들이 자신의 코드를 테스트하는 것을 중요하게 여기는 문화를 가지고 있다. \n(다른 누군가가 그것을 테스트해주기를 기다리는 것과 반대로) ",
				type: "strengths_12"
      },
      {
        text: "We manage subcontractors - Outsource code that is not in our expertise, keep code that is our expertise in house.\n하청업체를 관리한다. 전문 기술이 없는 코드는 외주하고, 전문 기술이 있는 코드는 내부에 유지한다.",
				type: "strengths_13"
      },
      {
        text: "There have been at least 4 fielded releases prior to this one.\n이것에 앞서서 개발된 최소 4개의 fielded release가 있다.",
				type: "strengths_14"
      },
      {
        text: "The difference between the most and least educated end user is not more than 1 degree type. \n(i.e. bachelors/masters, high school/associates, etc.)\n가장 많이 교육받은 최종 사용자와 가장 적게 교육받은 최종사용자의 차이는 1 degree type이 넘지 않는다.\n(ex : 학사/석사, 고등학교/단기 대학 졸업생 등)",
				type: "strengths_15"
      },
    ],
  },
  {
    key: "measure02",
    title: "위험도(Risks)",
    fieldheader: ["Risks", "Yes", "No", "Somewhat", "N/A"],
    fielddata: [
      {
        text: "This is brand new release (version 1), or development language, or OS, or technology. (add one for each risk)\n이것은 새로운 릴리즈(첫번째 버전)이거나 개발언어 또는 OS 또는 기술이다.\n(각 risk에 하나씩 추가)",
				type: "risks_1"
      },
      {
        text: "Target hardware/system is accessible within (0.75) minutes (0.5) hours (0.25) days (0)weeks or months.\nTarget hardware/system의 접근하는데 걸리는 시간.\n(분(0.75점) 시간(0.5점) 일(0.25점) 주 혹은 개월(0점))",
				type: "risks_2"
      },
      {
        text: "Short term contractors (<1 year) are used for developing line of business code.\n단기 계약 업체(1년 이하)는 business code의 개발에 사용된다.",
				type: "risks_3"
      },
      {
        text: "Code isn't reused when it should be.\n코드가 재사용되어야 할 때, 재사용하지 않는다.",
				type: "risks_4"
			},
      {
        text: "We wait until all code is completed before starting the next level of testing.\n모든 코드가 완료된 이후, 다음 레벨의 테스트를 시작한다.",
				type: "risks_5"
      },
      {
        text: "Target hardware is brand new or evolving. (will not be finished until software is finished)\nTarget hardware는 신제품이거나 개선되고 있는 중이다.\n(소프트웨어가 종료될 때까지 끝내지 않는다.)",
				type: "risks_6"
      },
      {
        text: "Age of oldest part of code >10 years.\n코드에서 가장 오래된 부분이 10년 이상 되었다.",
				type: "risks_7"
      },
    ],
  },
];

const ShortCutModal = ({ putSelectedResult }: Props) => {
	const [shortCutModalState, setShortCutModalState] = useState<boolean>(false)

	// Ristk와 Strengths의 4개 Radio 선택 여부를 분리하여 관리
	const [shortcut_strengths, setShortcutStrengths] = React.useState<string[]>(Array.from({length: Shortcut_CHECKLIST_MODAL_FIELD[0].fielddata.length}, () => 'na'))
	const [shortcut_risks, setShortcutRisks] = React.useState<string[]>(Array.from({length: Shortcut_CHECKLIST_MODAL_FIELD[1].fielddata.length}, () => 'na'))

	const ShortCutModalStateHandler = () => {
		setShortCutModalState(prev => !prev)
	}


	React.useEffect(() => {
		getShortcutChecklistRows()
	}, [shortCutModalState])

	/**
	 * value: value, id: index
	 */
	const handleStrengthsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, id } = event.target

		setShortcutStrengths((prev) => {
			const newStrengths = [...prev]
			newStrengths[parseInt(id)] = value
			return newStrengths
		})
	}

	/**
	 * value: value, id: index
	 */
	const handleRisksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, id } = event.target

		setShortcutRisks((prev) => {
			const newRisks = [...prev]
			newRisks[parseInt(id)] = value
			return newRisks
		})
	}

	const getShortcutChecklistRows = async () => {
		const res: { data: { risks: string, strengths: string } } = await AIRAMPAxios.get('/shortcuts/2/')
		const strengths = res.data.strengths.split(',')
		let risks = res.data.risks.split(',')

		if (risks[1] == "Minutes") {
			risks[1] = "yes"
		} else if (risks[1] == "Hours") {
			risks[1] = "no"
		} else if (risks[1] == "Days") {
			risks[1] = "somewhat"
		} else {
			risks[1] = "na"
		}

		setShortcutStrengths(() => strengths)
		setShortcutRisks(() => risks)

		// risks의 1번째 index의 경우 Yes, No, Somewhat, N/A로 변경 되어야 함

	}

	const submitShortCutModel = async (): Promise<void> => {
		// risks의 1번째 index의 경우  Minutes, Hours, Days, Week_Months로 변경 되어야 함
		// 형태는 순서대로 Yes, No, Somewhat, N/A를 의미하는데 데이터를 변경해줘야 함 위의 형태로
		if (shortcut_risks[1] == "yes") {
			shortcut_risks[1] = "Minutes"
		} else if (shortcut_risks[1] == "no") {
			shortcut_risks[1] = "Hours"
		} else if (shortcut_risks[1] == "somewhat") {
			shortcut_risks[1] = "Days"
		} else {
			shortcut_risks[1] = "Week_Months"
		}
		// Strengths는 1차원 배열임. 이를 "yes,no,somewhat,na,yes,no" 형태의 문자열로 변환하여야함 
		const strengths = shortcut_strengths.join(',')
		const risks = shortcut_risks.join(',')
		// Request - AI-RAMP-Server
		await AIRAMPAxios.put('/shortcuts/2/', {
			csciID: 2,
			strengths: strengths,
			risks: risks,
		})
		putSelectedResult("Shortcut")
		ShortCutModalStateHandler()
	}

	return (
		<div>
			<Button onClick={ShortCutModalStateHandler}>Edit</Button>

			<Modal isOpen={shortCutModalState} size="md">
				<Modal.Head>
					<p>Shortcut CheckList</p>
				</Modal.Head>
				<Modal.Body className="max-h-[500px] overflow-y-auto">
					<PanelContainer>
						<PanelHeader title={Shortcut_CHECKLIST_MODAL_FIELD[0].title} className="overflow-hidden"/>
						<div className="overflow-hidden">
							<table className="w-full table-auto">
								<thead>
									<tr>
										{Shortcut_CHECKLIST_MODAL_FIELD[0].fieldheader.map((field_col, index_nd) => (
											<th key={index_nd} className="p-2 text-center bg-gray-100">
												{field_col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{Shortcut_CHECKLIST_MODAL_FIELD[0].fielddata.map((field_row, index_nd) => (
										<tr key={index_nd} className="text-center even:bg-gray-100 odd:bg-white">
											<td className="p-2">{field_row.text}</td>
											<td><input type="radio" value="yes" name={field_row.type} id={index_nd.toString()} onChange={handleStrengthsChange} checked={shortcut_strengths[index_nd] == "yes"}/></td>
											<td><input type="radio" value="no" name={field_row.type} id={index_nd.toString()} onChange={handleStrengthsChange} checked={shortcut_strengths[index_nd] == "no"} /></td>
											<td><input type="radio" value="somewhat" name={field_row.type} id={index_nd.toString()} onChange={handleStrengthsChange} checked={shortcut_strengths[index_nd] == "somewhat"} /></td>
											<td><input type="radio" value="na" name={field_row.type} id={index_nd.toString()} onChange={handleStrengthsChange} checked={shortcut_strengths[index_nd] == "na"} /></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</PanelContainer>
					<PanelContainer>
						<PanelHeader title={Shortcut_CHECKLIST_MODAL_FIELD[1].title} className="overflow-hidden"/>
						<div className="overflow-hidden">
							<table className="w-full table-auto">
								<thead>
									<tr>
										{Shortcut_CHECKLIST_MODAL_FIELD[1].fieldheader.map((field_col, index_nd) => (
											<th key={index_nd} className="p-2 text-center bg-gray-100">
												{field_col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{Shortcut_CHECKLIST_MODAL_FIELD[1].fielddata.map((field_row, index_nd) => (
										<tr key={index_nd} className="text-center even:bg-gray-100 odd:bg-white">
											<td className="p-2">{field_row.text}</td>
											<td><input type="radio" value="yes" name={field_row.type} id={index_nd.toString()} onChange={handleRisksChange} checked={shortcut_risks[index_nd] == "yes"}/></td>
											<td><input type="radio" value="no" name={field_row.type} id={index_nd.toString()} onChange={handleRisksChange} checked={shortcut_risks[index_nd] == "no"} /></td>
											<td><input type="radio" value="somewhat" name={field_row.type} id={index_nd.toString()} onChange={handleRisksChange} checked={shortcut_risks[index_nd] == "somewhat"} /></td>
											<td><input type="radio" value="na" name={field_row.type} id={index_nd.toString()} onChange={handleRisksChange} checked={shortcut_risks[index_nd] == "na"} /></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</PanelContainer>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='primary' onClick={submitShortCutModel}>Calculator</Button>
					<Button variant='primary' onClick={ShortCutModalStateHandler}>Close</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default ShortCutModal

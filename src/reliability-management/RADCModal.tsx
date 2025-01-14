import React, { useEffect, useState } from "react";

import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal";

import PanelContainer from "components/common/panels/PanelContainer"
import PanelHeader from "components/common/panels/PanelHeader"

import { AIRAMPAxios } from "models/index"
import Tabs from "tailwindElement/Tabs";

import { IFactor, IRADC_DFactor, IRADC_FieldData } from "reliability-management/ReliabilityFieldData";

import RADCModalTableRow from "./RADCModalTableRow";
import { useLocation } from "react-router-dom";
import Input from "tailwindElement/Input";
import Swal from "sweetalert2";
import { radioClickHandler } from "components/common/util/TableData";

type Props = {
	putSelectedResult: (id: string) => void
	RADC_MODAL_FIELD: IFactor[]
}

const RADCModal = ({ putSelectedResult, RADC_MODAL_FIELD }: Props) => {
	const step = useLocation().pathname.split('/')[2]

	const [radcModalState, setRADCModalState] = useState<boolean>(false)

	const [AFactorData, setAFactorData] = useState<string>("");
	const [DFactorData, setDFactorData]  = useState<IRADC_DFactor>({
		category: "",
		feature: "",
		D2Data: Array(43).fill("")
	});

	const [SAFactorData, setSAFactorData] = useState<(string)[]>([]);
	const [SQFactorData, setSQFactorData] = useState<(string)[]>([]);
	const [STFactorData, setSTFactorData] = useState<(string)[]>([]);

	
	const [SLFactorData, setSLFactorData] = useState<(string)[]>([]);
	const [SMFactorData, setSMFactorData] = useState<(string)[]>([]);
	const [SXFactorData, setSXFactorData] = useState<(string)[]>([]);
	const [SRFactorData, setSRFactorData] = useState<(string)[]>([]);

	// MODAL Show State Data
  const RADCModalStateHandler = () => {
		setRADCModalState(prev => !prev)
	}

	// RADC 체크리스트 데이터 불러오기
	const getRADCCheckListRows = async () => {
		const res = await AIRAMPAxios.get(`radc-${step.toLowerCase()}s/2/`);
		
		// 데이터가 없을 경우 : Factor 별 state가 빈값으로 초기화되지 않기 위함			
		if(Object.values(res.data).includes('') === false) {
			if(step === "SRR") {
				setAFactorData(res.data.AFactor)
				
				const [category, feature, ...D2Data] = res.data.DFactor.split(",");
				
				setDFactorData({
					category: category,
					feature: feature,
					D2Data: D2Data.includes('') ? Array(43).fill("") : D2Data
				})
				
				setSAFactorData(res.data.SAFactor.split(","))
				setSQFactorData(res.data.SQFactor.split(","))
				setSTFactorData(res.data.STFactor.split(","))	
			}
			else if(step === "Implementation") {
				setSLFactorData(res.data.SLFactor.split(","))
				setSMFactorData(res.data.SMFactor.split(","))
				setSXFactorData(res.data.SXFactor.split(","))
				setSRFactorData(res.data.SRFactor.split(","))
			}
			else if(step === "PDR" || step === "CDR") {
				setSAFactorData(res.data.SAFactor.split(","))
				setSQFactorData(res.data.SQFactor.split(","))
				setSTFactorData(res.data.STFactor.split(","))	
			}
		}
		else {
			if(step === "SRR") {
				setAFactorData("")
				setDFactorData({
					category: "",
					feature: "",
					D2Data: Array(43).fill("")
				})
				
				setSAFactorData(RADC_MODAL_FIELD[2].field[0].fielddata.map((d) => d.check).flat().map((d) => Object.keys(d as object).includes("input") ? "0" : "unknown"))
				setSQFactorData(RADC_MODAL_FIELD[3].field[0].fielddata.map((d) => d.check).flat().map((d) => Object.keys(d as object).includes("input") ? "0" : "unknown"))
				setSTFactorData(RADC_MODAL_FIELD[4].field[0].fielddata.map(() => "no"))
			}
			else if(step === "Implementation") {
				setSLFactorData(RADC_MODAL_FIELD[0].field[0].fielddata.map(() => "0"))
				setSMFactorData(RADC_MODAL_FIELD[1].field[0].fielddata.map(() => "0"))
				setSXFactorData(RADC_MODAL_FIELD[2].field[0].fielddata.map(() => "0"))
				setSRFactorData(RADC_MODAL_FIELD[3].field[0].fielddata.map((d) => d.check).flat().map((d) => Object.keys(d as object).includes("input") ? "0" : "unknown"))
			}
			else {
				setSAFactorData(RADC_MODAL_FIELD[0].field[0].fielddata.map((d) => d.check).flat().map((d) => Object.keys(d as object).includes("input") ? "0" : "unknown"))
				setSQFactorData(RADC_MODAL_FIELD[1].field[0].fielddata.map((d) => d.check).flat().map((d) => Object.keys(d as object).includes("input") ? "0" : "unknown"))
				setSTFactorData(RADC_MODAL_FIELD[2].field[0].fielddata.map(() => "no"))
			}
		}
	}

	const formulaIndex = (variable: string[], formula: string): string => {
		if(step === "SRR" || step === "PDR" || step === "CDR") {
			// fumula 계산시 앞글자에 0이 들어가면 계산이 안 됨
			// integer로 변환 후 다시 string으로 변환 0 제외
			const [A, B, NM] = variable.map((v) => parseFloat(v || "0")).map((i) => {
				return i.toString()
			})

			// 0이 있을 경우 unknown으로 처리 계산 오류
			if(parseFloat(A) === 0 || parseFloat(B) === 0) {
				return "unknown"
			}
			
			let returnFormula = ""
			
			// 수식 내에 NM 변수가 있을 경우 
			if(formula.includes("NM")) { // CDR
				returnFormula = new Function(`return ${formula.replaceAll('A', A).replaceAll('NM', NM)}`)()
			}
			else { // SRR, PDR 완료
				returnFormula = new Function(`return ${formula.replaceAll('B', B).replaceAll('A', A)}`)()
			}

			if(step === "SRR") {
				return B > A ? "unknown" : returnFormula ? "no" : "yes"
			}
			else {	
				return returnFormula ? "no" : "yes"
			}
		}
		else { // Implementation
			let place_formula = formula
			let returnFormula = ""
			const [A, B, NM, SLOC, TDD] = variable.map((v) => parseFloat(v || "0")).map((i) => {
				return i.toString()
			})

			if(formula.includes("A")) {
				place_formula = place_formula.replaceAll('A', A)
			}
			if(formula.includes("B")) {
				place_formula = place_formula.replaceAll('B', B)
			}
			if(formula.includes("NM")) {
				place_formula = place_formula.replaceAll('NM', NM)
			}
			if(formula.includes("SLOC")) {
				place_formula = place_formula.replaceAll('SLOC', SLOC)
			}
			if(formula.includes("TDD")) {
				place_formula = place_formula.replaceAll('TDD', TDD)
			}

			if(formula.includes("B/NM")) {
				if(parseFloat(A) === 0 || parseFloat(B) === 0) {
					return "unknown"
				}
				else {
					place_formula = formula.replaceAll('B/NM', (parseFloat(B) / parseFloat(A)).toString())
				}
			}
			else if(formula.includes("A/NM")) {
				if(parseFloat(A) === 0 || parseFloat(NM) === 0) {
					return "unknown"
				}
				else {
					place_formula = formula.replaceAll('A/NM', (parseFloat(A) / parseFloat(NM)).toString())
				}
			}
			else if(formula.includes("1-(B/A)")) {
				if(parseFloat(A) === 0 || parseFloat(B) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1-(B/A)', (1 - (parseFloat(B) / parseFloat(A))).toString())
				}
			}
			else if(formula.includes("B/A<=")) {
				if(parseFloat(A) === 0 || parseFloat(B) === 0) {
					return "unknown"
				}
				else {
					place_formula = formula.replaceAll("A", A).replaceAll("B", B)
				}
			}
			else if(formula.includes("B/A")) {
				if(parseFloat(A) === 0 || parseFloat(B) === 0) {
					return "0"
				}	
				else {
					return formula.replaceAll('B/A', (parseFloat(B) / parseFloat(A)).toString())
				}
			}
			else if(formula.includes("1-(B/SLOC)")) {				
				if(parseFloat(B) === 0 || parseFloat(SLOC) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1-(B/SLOC)', (1 - (parseFloat(B) / parseFloat(SLOC))).toString())
				}
			}
			else if(formula.includes("1-((A+B)/SLOC)")) {
				if(parseFloat(A) === 0 || parseFloat(B) === 0 || parseFloat(SLOC) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1-((A+B)/SLOC)', (1 - ((parseFloat(A) + parseFloat(B)) / parseFloat(SLOC))).toString())
				}
			}
			else if(formula.includes("1-(A/SLOC)")) {
				if(parseFloat(A) === 0 || parseFloat(SLOC) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1-(A/SLOC)', (1 - (parseFloat(A) / parseFloat(SLOC))).toString())
				}
			}
			else if(formula.includes("1/A")) {
				if(parseFloat(A) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1/A', (1 / parseFloat(A)).toString())
				}
			}
			else if(formula.includes("1/(1+A)")) {
				if(parseFloat(A) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1/(1+A)', (1 / (1 + parseFloat(A))).toString())
				}
			}
			else if(formula.includes("1-TDD/SLOC")) {
				if(parseFloat(TDD) === 0 || parseFloat(SLOC) === 0) {
					return "0"
				}
				else {
					return formula.replaceAll('1-TDD/SLOC', (1 - (parseFloat(TDD) / parseFloat(SLOC))).toString())
				}
			}

			returnFormula = new Function(`return ${place_formula}`)()
			
			return returnFormula ? "no" : "yes"
		}
	}

	// 데이터 입력 핸들러
	const handleFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value, id} = e.target;
		const [_, tab, index]  = e.target.name.split("_"); // 단계, 현재 Factor, index

		// Input 입력 데이터 계산
		if(id && value) {
			const [formula, index_nd] = id.split("_");
			const tabData = tab === "SA" ? SAFactorData : tab === "SQ" ? SQFactorData : SRFactorData;

			if(step === "Implementation") { // Implementation : NM, SLOC, TDD
				let B = '';
				let A = '';
				let NM = SRFactorData[1] || "0";
				let SLOC = SRFactorData[45] || "0"
				let TDD = SRFactorData[66] || "0"
				let tempIdx = 0;
				
				if(index_nd === "1") {
					B = value || "0"
					A = tabData[parseInt(index)-1] || "0"
					tempIdx = parseInt(index)+1
				}
				else {
					B = tabData[parseInt(index)+1] || "0"
					A = value || "0"
					tempIdx = parseInt(index)+2
				}
				
				if(formula.includes("B/NM")) {
					setSRFactorData((prev) => (
						prev.map((data, idx) => {
							if(idx === tempIdx - 1) {
								if(A === "0" || B === "0") {
									return "0"
								}
								else {
									return `${(parseFloat(B)/parseFloat(A)) || 0}`
								}
							}
							return data;
						})
					))

					tempIdx = tempIdx + 1
				}
				else if(formula.includes("A/NM")) {
					setSRFactorData((prev) => (
						prev.map((data, idx) => {
							if(idx === tempIdx - 1) {
								if(A === "0" || NM === "0") {
									return "0"
								}
								else {
									return `${(parseFloat(A)/parseFloat(NM)) || 0}`
								}
							}
							return data;
						})
					))
				}
				else if(formula === "1-(A/SLOC)" || formula === "1/A" || formula === "1/(1+A)") {
					tempIdx = parseInt(index)+1
				}

				const res = formulaIndex([A,B,NM,SLOC,TDD], formula)
				
				// 1 - ( TDD / SLOC )
				if(index === "45" || index === "66") {
					setSRFactorData((prev) => (
						prev.map((data, idx) => {							
							if(idx === 69) {
								return (1 - ((index === "66" ? parseFloat(value) : parseFloat(TDD)) / (index === "45" ? parseFloat(value) : parseFloat(SLOC)))).toString() // 상태 데이터 밀림
							}
							else if(idx === tempIdx && index === "66") {
								return res
							}
							return data;
						} )
					))
				}
				else {
					setSRFactorData((prev) => (
						prev.map((data, idx) => {
							if(idx === tempIdx) {
								return res
							}
							return data;
						} )
					))
				}
			}
			else { // SRR, PDR
				let NM = SQFactorData[3];
				let tempIdx= 0;
				let B = '';
				let A = '';
	
				if(index_nd === "1") { // B 입력 중일 때
					B = value || "0"
					A = tabData[parseFloat(index)-1] || "0"
					tempIdx = parseInt(index)+1
				}
				else { // A 입력 중일 때
					B = tabData[parseFloat(index)+1] || "0"
					A = value || "0"
					tempIdx = parseInt(index)+2
				}

				let res = "";
				if(step === "CDR") { // CDR : NM
				  res = formulaIndex([A,B,NM], formula)
					if(formula.includes("NM")) {
						tempIdx = parseInt(index)+1
					}
				}
				else {
  				res = formulaIndex([A,B], formula)
				}

				if(tab === "SA") {
					setSAFactorData((prev) => (
						prev.map((data, idx) => {
							if(idx === tempIdx) {
								return res
							}
							return data;
						})
					))
				}
				else if(tab === "SQ") {
					setSQFactorData((prev) => (
						prev.map((data, idx) => {
							if(idx === tempIdx) {
								return res
							}
							return data;
						})
					))
				}
			}
		}

		if(tab === "A") {
			setAFactorData(value);
		}
		else if(tab === "D") {
			if(index === "category" || index === "feature") {
				setDFactorData((prev) => (
					{
						...prev,
						[index]: value,
					}
				))	
			}
			else {				
				setDFactorData((prev) => (
					{
						...prev,
						D2Data: prev.D2Data.map((data, idx) => {
							if(idx === parseInt(index)) {
								return value;
							}
							return data;
						})
					}
				))
			}
		}
		else if(tab === "SA") {
			setSAFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {
						return value;
					}
					return data;
				})
			))
		}
		else if(tab === "SQ") {
			setSQFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {
						return value;
					}
					return data;
				})
			))
		}
		else if(tab === "ST") {
			setSTFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {
						return value;
					}
					return data;
				})
			))
		}
		else if(tab === "SL") {
			setSLFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {
						return value;
					}
					return data;
				})
			))
		}
		else if(tab === "SM") {
			setSMFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {
						return value;
					}
					return data;
				})
			))
		}
		else if(tab === "SX") {
			setSXFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {
						return value;
					}
					return data;
				})
			))
		}
		else if(tab === "SR") {
			setSRFactorData((prev) => (
				prev.map((data, idx) => {
					if(idx === parseInt(index)) {						
						return value;
					}
					return data;
				})
			))
		}
	}

	const returnFieldRowData = (field_row: IRADC_FieldData, tab: string): React.ReactNode => {
		if(tab === "A") {
			return (
				<tr className="even:bg-gray-100 odd:bg-white">
					<td className="p-2 text-center">{field_row.item}</td>
					<td className="p-2 text-center">{field_row.question}</td>
					<td className="p-2 text-center" onClick={radioClickHandler}><Input.Radio name={field_row.check[0].name} checked={AFactorData === field_row.check[0].value} value={field_row.check[0].value} onChange={handleFactorChange} /></td>
				</tr>
			)
		}
		else if(tab === "D") {
			return (
				<tr className="even:bg-gray-100 odd:bg-white">
				{field_row.item &&
					<td className="p-2 text-center">{field_row.item}</td>
				}

				<td className="p-2 text-start whitespace-pre-line">{field_row.question}</td>

				{
					field_row.result && <td className="p-2 text-start ">{ field_row.result}</td>
				}

				{
					field_row.check[0].name &&
					<td className="p-2 text-center" onClick={radioClickHandler}> 
					{/* category, feature */}
						<Input.Radio name={field_row.check[0].name} value={field_row.check[0].value} checked={DFactorData[field_row.check[0].name.split("_")[2]] === field_row.check[0].value} onChange={handleFactorChange}/>
					</td>
				}
				{
					field_row.check[0].yes &&
					<td className="p-2 text-center" onClick={radioClickHandler}>
						<Input.Radio name={field_row.check[0].yes} value={"yes"} checked={DFactorData.D2Data[parseInt(field_row.check[0].yes.split("_")[2])] === "yes"} onChange={handleFactorChange} />
					</td>
				}
				{
					field_row.check[0].no &&
					<td className="p-2 text-center" onClick={radioClickHandler}>
						<Input.Radio name={field_row.check[0].no} value={"no"} checked={DFactorData.D2Data[parseInt(field_row.check[0].no.split("_")[2])] === "no"} onChange={handleFactorChange} />
					</td>
				}
			</tr>
			)
		}
		else {
			return (
				// check 갯수만큼 반복 ( 질문 갯수 동일 )
				field_row.check.map((check, index_check) => {
					const value_handler = () => {
						if(check.input) {
							const radio_index = parseFloat(check.input.split("_")[2])
							if(tab === "SA") {
								return parseFloat(SAFactorData[radio_index])
							}
							else if(tab === "SQ") {
								return parseFloat(SQFactorData[radio_index])
							}
							else if(tab === "SL") {
								return parseFloat(SLFactorData[radio_index])
							}
							else if(tab === "SM") {
								return parseFloat(SMFactorData[radio_index])
							}
							else if(tab === "SX") {
								return parseFloat(SXFactorData[radio_index])
							}
							else if(tab === "SR") {
								return parseFloat(SRFactorData[radio_index])
							}
						}
					}

					const checked_handler = () => {
						if(check.yes) {
							const radio_index = parseInt(check.yes.split("_")[2])
							if(tab === "SA") {
								return SAFactorData[radio_index]
							}
							else if(tab === "SQ") {
								return SQFactorData[radio_index]
							}
							else if(tab === "ST") {
								return STFactorData[radio_index]
							}
							else if(tab === "SR") {
								return SRFactorData[radio_index]
							}
						}
					}
					return <RADCModalTableRow key={index_check} field_row={field_row} index_check={index_check} value={value_handler()} checked={checked_handler()} handleFactorChange={handleFactorChange} radioClickHandler={radioClickHandler} />
				})
			)
		}
	}

	// submit 핸들러 함수
	const submitRADCModel = async () => {
		// 필수 입력 데이터 체크
		let reqData;
		if(step === "SRR") {
			if(AFactorData === "") {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "AFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(DFactorData.category === "" || DFactorData.feature === "") {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "DFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(DFactorData.category === "D2" && DFactorData.D2Data.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "DFactor D2 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(SAFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SAFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(SQFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SQFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(STFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "STFactor 체크리스트를 입력해주세요."
				})
	
				return
			}

			reqData = {
				csciID: 2,
				AFactor: AFactorData,
				DFactor: `${DFactorData.category},${DFactorData.feature},${DFactorData.D2Data.join(",")}`,
				SAFactor: SAFactorData.join(","),
				SQFactor: SQFactorData.join(","),
				STFactor: STFactorData.join(",")
			}
		}
		else if(step === "Implementation") {
			if(SLFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SLFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(SMFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SMFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(SXFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SXFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(SRFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SRFactor 체크리스트를 입력해주세요."
				})
	
				return
			}

			reqData = {
				csciID: 2,
				SLFactor: SLFactorData.join(","),
				SMFactor: SMFactorData.join(","),
				SXFactor: SXFactorData.join(","),
				SRFactor: SRFactorData.join(",")
			}
		}
		else {
			if(SAFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SAFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(SQFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "SQFactor 체크리스트를 입력해주세요."
				})
	
				return
			}
			else if(STFactorData.includes("")) {
				Swal.fire({
					icon: "error",
					title: "체크리스트 입력 오류",
					text: "STFactor 체크리스트를 입력해주세요."
				})
	
				return
			}

			reqData = {
				csciID: 2,
				SAFactor: SAFactorData.join(","),
				SQFactor: SQFactorData.join(","),
				STFactor: STFactorData.join(",")
			}
		}

		await AIRAMPAxios.put(`radc-${step.toLowerCase()}s/2/`, reqData)

		putSelectedResult("RADC");

		RADCModalStateHandler();
	}

	// RADC Modal이 열릴 때마다 체크리스트 데이터 불러오기
  useEffect(() => {
			getRADCCheckListRows();
	}, [radcModalState])

	return (
		<div>
			<Button variant='primary' onClick={RADCModalStateHandler}>Edit</Button>
			<Modal isOpen={radcModalState} size="lg">
				<Modal.Head>
					<p>RADC CheckList</p>
				</Modal.Head>
				<Modal.Body className="max-h-[500px] overflow-y-auto">
					<Tabs defaultTab={RADC_MODAL_FIELD[0].tab}>
						{
							RADC_MODAL_FIELD.map((factor, index_st) => (
								<Tabs.Tab key={factor.key} label={factor.tab} className="flex">
									{
										factor.field.map((field_data, index_nd) => {
											// 개발환경에서 D2가 아닐 경우 D2 추가 체크리스트 제외
											if(DFactorData.category !== "D2" && index_nd > 1) { // D Factor만 index_nd > 1
												return 
											}

											return (
												<PanelContainer key={index_nd}>
													{field_data.title && <PanelHeader title={field_data.title} />}
													<table className="w-full table-auto">
														<thead>
															<tr>
																{
																	field_data.fieldheader.map((field_col, index_col) => (
																		<th key={index_col} className="p-2 text-center bg-gray-100 whitespace-nowrap">{field_col}</th>																																					
																	)) 
																}
															</tr>
														</thead>
														<tbody>
															{
																field_data.fielddata.map((field_row, index_row) => (
																	<React.Fragment key={index_row}>
																		{returnFieldRowData(field_row, factor.tab.split(" ")[0])}
																	</React.Fragment>
																))
															}
														</tbody>
													</table>
												</PanelContainer>
											)
										})
									}
								</Tabs.Tab>
							))
						}
					</Tabs>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='primary' onClick={submitRADCModel}>Calculator</Button>
					<Button variant='primary' onClick={RADCModalStateHandler}>Close</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default RADCModal

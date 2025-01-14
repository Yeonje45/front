import React from 'react';
import Swal from 'sweetalert2';
import { X } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button';
import Tooltip from 'tailwindElement/Tooltip';

import { classification_code_name, weapon_system_name, operating_military_branch, acquisition_type, acquisition_method, weapon_system_classification, prototype_developer, development_year, deployment_year, programming_language, operating_system, loc, development_management_tool, middleware, dbms, development_duration, number_of_personnel, development_cost, cost_estimation_method, deliverables_count, standardized_deliverables_count, csci_count } from 'utils/config-management/embedded-software-classification-system-master-data-list';
import { GetEmbeddedSoftwareClassificationSystemMasterDataListData, IEmbeddedSoftwareClassificationSystemMasterDataModel, UpdateEmbeddedSoftwareClassificationSystemMasterDataListData } from 'models/ConfigManagement';

interface IProps {
	project_id: string
}


const EmbeddedSoftwareClassificationSystemMasterDataListTable = ({project_id}: IProps) => {
	const [tableData, setTableData] = React.useState<IEmbeddedSoftwareClassificationSystemMasterDataModel[] | null>(null);

	React.useEffect(() => {
		getEmbeddedSoftwareClassificationSystemMasterDataListTableData()
	}, [])

	const getEmbeddedSoftwareClassificationSystemMasterDataListTableData = async (): Promise<void> => {
		const res = await GetEmbeddedSoftwareClassificationSystemMasterDataListData(project_id);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '내장형SW 분류체계 총괄자료 목록 조회 실패',
				text: res.message,
			})
			return
		}
		setTableData(() => res.data)
	}

	/* key, value, index를 받아와 데이터를 수정해주는 함수 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// id = key, value = value, name = index
		const { id, value, name } = e.target; 
		console.log(name)
		setTableData((prev) => {
			if (prev === null) return prev;

			const newTableData = [...prev];
			newTableData[+name][id as keyof IEmbeddedSoftwareClassificationSystemMasterDataModel ] = value;
			return newTableData;
		})
	}

	/* 행 추가  */
	const addRow = () => {
		setTableData((prev) => {
			if (prev === null) return prev;
			const newTableData = [...prev];
			newTableData.push({
				project_id: project_id,
				classif_code: "",
				emd_weapon_system_name: "",
				emd_optional_unit: "",
				emd_obtain_type: "",
				emd_obtain_method: "",
				emd_weapon_system: "",
				emd_prototype_vendor: "",
				emd_develop_year: "",
				emd_deploy_year: "",
				emd_develop_lang: "",
				emd_os: "",
				emd_loc: "",
				emd_manage_tool: "",
				emd_middleware: "",
				emd_dbms: "",
				emd_duration: "",
				emd_workforce: "",
				emd_cost: "",
				emd_cost_method: "",
				emd_output_count: "",
				emd_standard_count: "",
				emd_csci_count: "",
			})
			return newTableData;
		})
		return
	}

	/* 행 삭제*/
	const removeRow = async (e: React.MouseEvent<SVGSVGElement>): Promise<void> => {
		const { id } = e.currentTarget;

		const checkApr = await Swal.fire({
			title: '삭제하시겠습니까?',
			text: '삭제된 데이터는 복구할 수 없습니다.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '삭제',
			cancelButtonText: '취소',
		})
		if (!checkApr.isConfirmed) return;

		setTableData((prev) => {
			if (prev === null) return prev;
			const newTableData = [...prev];
			newTableData.splice(+id, 1);
			return newTableData;
		})
	}

	const submitHandler = async (): Promise<void> => {
		if (!tableData) {
			return
		}

		tableData.map((tableData) => {
			Object.keys(tableData).map((key) => {
				if (key === 'emd_id') return
				if (tableData[key as keyof IEmbeddedSoftwareClassificationSystemMasterDataModel] === "") {
					Swal.fire({
						icon: 'error',
						title: '분류체계 식별자 데이터 저장 실패',
						text: '빈 값을 입력해주세요.',
					})
					return
				}
			})
		})

		if (!tableData) {
			return
		}

		const res = await UpdateEmbeddedSoftwareClassificationSystemMasterDataListData(tableData, project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '분류체계 식별자 데이터 저장 실패',
				text: "분류체계 식별자 데이터 저장에 실패하였습니다.",
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '분류체계 식별자 데이터 저장 성공',
			text: "분류체계 식별자 데이터가 저장되었습니다.",
		})
		getEmbeddedSoftwareClassificationSystemMasterDataListTableData()
	}

	return (
		<React.Fragment>
			<div className="sticky top-0 left-0 space-x-1 z-10 w-full mb-3">
				<Button onClick={submitHandler}>내장형SW 분류체계 총괄자료 목록 데이터 저장</Button>
				<Button variant="secondary" onClick={addRow}>행 추가</Button>
			</div>
			<table className="table w-full table-border">
				<thead className="whitespace-nowrap">
					<tr>
						<th></th>
						<th><Tooltip text={classification_code_name} className="left-8">분류코드명칭</Tooltip></th>
						<th><Tooltip text={weapon_system_name} className="left-8">무기 체계명</Tooltip></th>
						<th><Tooltip text={operating_military_branch}>운용군</Tooltip></th>
						<th><Tooltip text={acquisition_type}>획득 유형</Tooltip></th>
						<th><Tooltip text={acquisition_method}>획득 방법</Tooltip></th>
						<th><Tooltip text={weapon_system_classification}>무기체계 분류</Tooltip></th>
						<th><Tooltip text={prototype_developer}>시제 업체</Tooltip></th>
						<th><Tooltip text={development_year}>개발년도</Tooltip></th>
						<th><Tooltip text={deployment_year}>배치년도</Tooltip></th>
						<th><Tooltip text={programming_language}>개발언어</Tooltip></th>
						<th><Tooltip text={operating_system}>적용O/S</Tooltip></th>
						<th><Tooltip text={loc}>LOC</Tooltip></th>
						<th><Tooltip text={development_management_tool}>개발 관리툴</Tooltip></th>
						<th><Tooltip text={middleware}>미들웨어</Tooltip></th>
						<th><Tooltip text={dbms}>DBMS</Tooltip></th>
						<th><Tooltip text={development_duration}>기간(월)</Tooltip></th>
						<th><Tooltip text={number_of_personnel}>인력 투입수(명)</Tooltip></th>
						<th><Tooltip text={development_cost}>SW개발비용(만원)</Tooltip></th>
						<th><Tooltip text={cost_estimation_method}>비용산정방법</Tooltip></th>
						<th><Tooltip text={deliverables_count}>산출물(총)</Tooltip></th>
						<th><Tooltip text={standardized_deliverables_count} className="-left-[300px]">규격화(총)</Tooltip></th>
						<th><Tooltip text={csci_count} className="-left-[250px]">CSCI수</Tooltip></th>
					</tr>
				</thead>
				<tbody>
					{ tableData && tableData.map((tableItme, index) => (
						<tr key={index}>
							<td> <X className="cursor-pointer text-red-700 font-bold" onClick={removeRow} id={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_code} id="classif_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_weapon_system_name} id="emd_weapon_system_name" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_optional_unit} id="emd_optional_unit" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_obtain_type} id="emd_obtain_type" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_obtain_method} id="emd_obtain_method" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_weapon_system} id="emd_weapon_system" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_prototype_vendor} id="emd_prototype_vendor" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_develop_year} id="emd_develop_year" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_deploy_year} id="emd_deploy_year" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_develop_lang} id="emd_develop_lang" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_os} id="emd_os" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_loc} id="emd_loc" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_manage_tool} id="emd_manage_tool" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_middleware} id="emd_middleware" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_dbms} id="emd_dbms" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_duration} id="emd_duration" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_workforce} id="emd_workforce" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_cost} id="emd_cost" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_cost_method} id="emd_cost_method" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_output_count} id="emd_output_count" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_standard_count} id="emd_standard_count" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_csci_count} id="emd_csci_count" onChange={handleInputChange} name={index.toString()} /> </td>
						</tr>
					))}
				</tbody>
			</table>
		</React.Fragment>
	)
}

/* td 안에 Input  */
const InputElement = ({value, id, onChange, name}: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<input 
			id={id}
			value={value}
			name={name}
			type="text"
			className="p-2 outline-none b-0"
			onChange={onChange}
		/>
	)
}

export default EmbeddedSoftwareClassificationSystemMasterDataListTable

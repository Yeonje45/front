import React from 'react';
import Swal from 'sweetalert2';
import { X } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button';
import Tooltip from 'tailwindElement/Tooltip';

import {
  classification_code_name,
  classification_system_code,
  weapon_system_name,
  acquisition_type,
  weapon_system_classification,
  cooperating_company,
  programming_language,
  development_tool,
  operating_system,
  loc,
  case_tool,
  middleware,
  dbms,
  development_duration,
  number_of_personnel,
  development_cost,
  cost_estimation_method,
  software_main_function,
  software_importance,
  reason_for_software_importance,
  reusable_design,
  drawing_number_to_technical_classification_code,
  deliverable_files
} from 'utils/config-management/classification-identification-document';
import { GetClassificationSystemAttributeDataListData, IClassificationSystemAttributeDataModel, UpdateClassificationSystemAttributeDataListData } from 'models/ConfigManagement';

interface IProps {
	project_id: string
}

const ClassificationSystemAttributeDataListTable = ({project_id}: IProps) => {
	const [tableData, setTableData] = React.useState<IClassificationSystemAttributeDataModel[] | null>(null);

	React.useEffect(() => {
		getClassificationSystemAttributeDataListTableData()
	}, [])

	const getClassificationSystemAttributeDataListTableData = async (): Promise<void> => {
		const res = await GetClassificationSystemAttributeDataListData(project_id);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '분류체계 속성자료 목록 조회 실패',
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
			newTableData[+name][id as keyof IClassificationSystemAttributeDataModel ] = value;
			return newTableData;
		})
	}

	/* 행 추가 */
	const addRow = () => {
		setTableData((prev) => {
			if (prev === null) return prev;
			const newTableData = [...prev];
			newTableData.push({
				project_id: project_id,
				classif_code: "",
				attr_classif_code: "",
				emd_weapon_system_name: "",
				emd_obtain_type: "",
				emd_weapon_system: "",
				attr_partner: "",
				emd_develop_lang: "",
				attr_develop_tool: "",
				emd_os: "",
				emd_loc: "",
				attr_case_tool: "",
				emd_middleware: "",
				emd_dbms: "",
				emd_duration: "",
				emd_workforce: "",
				emd_cost: "",
				emd_cost_method: "",
				attr_main_feat: "",
				attr_importance: "",
				attr_importance_reason: "",
				attr_reusable: "",
				attr_drawing_code: "",
				attr_spec_num: "",
				attr_stock_num: "",
				attr_device: "",
				attr_equip_code: "",
				attr_tech_code: "",
				attr_output_file: "",
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
				if (tableData[key as keyof IClassificationSystemAttributeDataModel] === "") {
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

		const res = await UpdateClassificationSystemAttributeDataListData(tableData, project_id);
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
		getClassificationSystemAttributeDataListTableData()
	}

  return (
		<React.Fragment>
			<div className="sticky top-0 left-0 space-x-1 z-10 w-full mb-3">
				<Button onClick={submitHandler}>분류체계 속성자료 목록 데이터 저장</Button>
				<Button variant="secondary" onClick={addRow}>행 추가</Button>
			</div>
			<table className="table w-full table-border">
				<thead className="whitespace-nowrap">
					<tr>
						<th></th>
						<th><Tooltip text={classification_code_name} className="left-8">분류 코드 명칭</Tooltip></th>
						<th><Tooltip text={classification_system_code} className="left-8">분류 체계 코드</Tooltip></th>
						<th><Tooltip text={weapon_system_name} className="left-8">무기체계명</Tooltip></th>
						<th><Tooltip text={acquisition_type}>획득유형</Tooltip></th>
						<th><Tooltip text={weapon_system_classification}>무기체계 분류</Tooltip></th>
						<th><Tooltip text={cooperating_company}>협력업체</Tooltip></th>
						<th><Tooltip text={programming_language}>개발언어</Tooltip></th>
						<th><Tooltip text={development_tool}>개발툴</Tooltip></th>
						<th><Tooltip text={operating_system}>적용O/S</Tooltip></th>
						<th><Tooltip text={loc}>LOC</Tooltip></th>
						<th><Tooltip text={case_tool}>CASE 툴</Tooltip></th>
						<th><Tooltip text={middleware}>미들웨어</Tooltip></th>
						<th><Tooltip text={dbms}>DBMS</Tooltip></th>
						<th><Tooltip text={development_duration}>기간(월)</Tooltip></th>
						<th><Tooltip text={number_of_personnel}>인력투입수(명)</Tooltip></th>
						<th><Tooltip text={development_cost}>SW개발비용(만원)</Tooltip></th>
						<th><Tooltip text={cost_estimation_method}>비용산정방법</Tooltip></th>
						<th><Tooltip text={software_main_function}>SW주요기능</Tooltip></th>
						<th><Tooltip text={software_importance}>SW중요도</Tooltip></th>
						<th><Tooltip text={reason_for_software_importance}>SW중요선정이유</Tooltip></th>
						<th><Tooltip text={reusable_design}>재사용 설계</Tooltip></th>
						<th><Tooltip text={drawing_number_to_technical_classification_code}>도면번호</Tooltip></th>
						<th><Tooltip text={drawing_number_to_technical_classification_code}>규격번호</Tooltip></th>
						<th><Tooltip text={drawing_number_to_technical_classification_code}>재고번호</Tooltip></th>
						<th><Tooltip text={drawing_number_to_technical_classification_code}>디바이스</Tooltip></th>
						<th><Tooltip text={drawing_number_to_technical_classification_code}>적용장비부호</Tooltip></th>
						<th><Tooltip text={drawing_number_to_technical_classification_code}>기술분류코드</Tooltip></th>
						<th><Tooltip text={deliverable_files} className="-left-[300px]">산출물파일</Tooltip></th>
					</tr>
				</thead>
				<tbody>
					{ tableData && tableData.map((tableItme, index) => (
						<tr key={index}>
							<td> <X className="cursor-pointer text-red-700 font-bold" onClick={removeRow} id={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_code} id="classif_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_classif_code} id="attr_classif_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_weapon_system_name} id="emd_weapon_system_name" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_obtain_type} id="emd_obtain_type" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_weapon_system} id="emd_weapon_system" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_partner} id="attr_partner" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_develop_lang} id="emd_develop_lang" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_develop_tool} id="attr_develop_tool" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_os} id="emd_os" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_loc} id="emd_loc" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_case_tool} id="attr_case_tool" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_middleware} id="emd_middleware" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_dbms} id="emd_dbms" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_duration} id="emd_duration" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_workforce} id="emd_workforce" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_cost} id="emd_cost" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.emd_cost_method} id="emd_cost_method" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_main_feat} id="attr_main_feat" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_importance} id="attr_importance" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_importance_reason} id="attr_importance_reason" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_reusable} id="attr_reusable" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_drawing_code} id="attr_drawing_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_spec_num} id="attr_spec_num" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_stock_num} id="attr_stock_num" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_device} id="attr_device" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_equip_code} id="attr_equip_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_tech_code} id="attr_tech_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.attr_output_file} id="attr_output_file" onChange={handleInputChange} name={index.toString()} /> </td>
						</tr>
					))}
				</tbody>
			</table>
		</React.Fragment>
  );
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

export default ClassificationSystemAttributeDataListTable;

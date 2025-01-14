import React from 'react';
import Swal from 'sweetalert2';
import { X } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button';
import Tooltip from 'tailwindElement/Tooltip';

import { PART_NUMBE, SW_EDIT_NUMBER, SW_SCE_LEVEL, SW_TYPE, SW_DOC_CATEGORY, SERIAL_NUMBER, SW_VERSION, CSCI_CSC_NAME } from 'utils/config-management/claaification-identification';
import { GetClassificationIdentificationData, IClassificationIdentificationModel, UpdateClassificationIdentificationData } from 'models/ConfigManagement';

interface IProps {
	project_id: string
}

const ClaaificationIdentificationTable = ({project_id}: IProps) => {
	const [tableData, setTableData] = React.useState<IClassificationIdentificationModel[]>([]);

	React.useEffect(() => {
		getClassificationIdentificationTableData()
	}, [])

	/* 테이블 데이터를 가져와주는 함수 */
	const getClassificationIdentificationTableData = async (): Promise<void> => {
		const res = await GetClassificationIdentificationData(project_id);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '분류체계 식별자 데이터 조회 실패',
				text: res.message,
			})
			return
		}
		if (res.data === null) {
			setTableData(() => [])
			return
		}
		setTableData(() => res.data as [])
	}

	/* key, value, index를 받아와 데이터를 수정해주는 함수 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// id = key, value = value, name = index
		const { id, value, name } = e.target; 
		console.log(name)
		setTableData((prev) => {
			if (prev === null) return prev;

			const newTableData = [...prev];
			newTableData[+name][id as keyof IClassificationIdentificationModel ] = value;
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
				classif_csci_name: "",
				classif_csc_name: "",
				classif_unit_identify: "",
				classif_unit_category: "",
				classif_system_name: "",
				classif_part_code: "",
				classif_csci_as: "",
				classif_csc_as: "",
				classif_sw_type: "",
				classif_serial_num: "",
				classif_tech_doc: "",
				classif_security: "",
				classif_sw_version: "",
				classif_update_code: "",
			})
			return newTableData;
		})
	}

	/* 행 삭제 */
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
		tableData.map((tableData) => {
			Object.keys(tableData).map((key) => {
				if (key === 'classif_id') return
				if (tableData[key as keyof IClassificationIdentificationModel] === "") {
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

		const res = await UpdateClassificationIdentificationData(tableData, project_id);
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
		getClassificationIdentificationTableData()
	}

	return (
		<React.Fragment>
			<div className="sticky top-0 left-0 space-x-1 z-10 w-full mb-3">
				<Button onClick={submitHandler}>분류체계 식별자 데이터 저장</Button>
				<Button variant="secondary" onClick={addRow}>행 추가</Button>
			</div>
			<table className="table w-full table-border">
				<thead className="whitespace-nowrap">
					<tr>
						<th rowSpan={3}></th>
						<th rowSpan={3}>순번</th>
						<th rowSpan={3}>분류코드 명칭</th>
						<th rowSpan={3}>CSCI명</th>
						<th rowSpan={3}>CSC명</th>
						<th colSpan={12}>분류체계 코드</th>
					</tr>
					<tr>
						<th colSpan={3}>1영역</th>
						<th colSpan={3}>2영역</th>
						<th colSpan={3}>3영역</th>
						<th colSpan={3}>4영역</th>
					</tr>
					<tr>
						<th>군식별</th>
						<th>군급분류</th>
						<th>하부체계명 및 체계명</th>
						<th>
							<Tooltip text={PART_NUMBE}>부품번호</Tooltip>
						</th>
						<th>
							<Tooltip text={CSCI_CSC_NAME}>CSCI 약어</Tooltip>
						</th>
						<th>
							<Tooltip text={CSCI_CSC_NAME}>CSC 약어</Tooltip>
						</th>
						<th>
							<Tooltip text={SW_TYPE}>SW유형</Tooltip>
						</th>
						<th>
							<Tooltip text={SERIAL_NUMBER}>일련번호</Tooltip>
						</th>
						<th>
							<Tooltip text={SW_DOC_CATEGORY}>SW문서구분</Tooltip>
						</th>
						<th>
							<Tooltip text={SW_SCE_LEVEL}>SW보안등급</Tooltip>
						</th>
						<th>
							<Tooltip text={SW_VERSION} className="-left-64">SW버전</Tooltip>
						</th>
						<th>
							<Tooltip text={SW_EDIT_NUMBER} className="-left-[350px]">SW수정번호</Tooltip>
						</th>
					</tr>
				</thead>
				<tbody>
					{ tableData && tableData.map((tableItme, index) => (
						<tr key={index}>
							<td> <X className="cursor-pointer text-red-700 font-bold" onClick={removeRow} id={index.toString()} /> </td>
							<td> { index + 1 } </td>
							<td className="thin"> <InputElement value={tableItme.classif_code} id="classif_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_csci_name} id="classif_csci_name" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_csc_name} id="classif_csc_name" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_unit_identify} id="classif_unit_identify" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_unit_category} id="classif_unit_category" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_system_name} id="classif_system_name" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_part_code} id="classif_part_code" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_csci_as} id="classif_csci_as" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_csc_as} id="classif_csc_as" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_sw_type} id="classif_sw_type" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_serial_num} id="classif_serial_num" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_tech_doc} id="classif_tech_doc" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_security} id="classif_security" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_sw_version} id="classif_sw_version" onChange={handleInputChange} name={index.toString()} /> </td>
							<td className="thin"> <InputElement value={tableItme.classif_update_code} id="classif_update_code" onChange={handleInputChange} name={index.toString()} /> </td>
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

export default ClaaificationIdentificationTable

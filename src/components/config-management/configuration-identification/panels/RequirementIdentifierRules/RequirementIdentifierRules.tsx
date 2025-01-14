// TODO : JHKim - 아니 흠냐링 코드 만들어 놓고 보니까 이거 그냥 테이블로 만들면 되는거 아닌가??
// 	- 흠냐흠냐흠냐링 신나는 노래 ~ 나도 한 번 불러볼까?
// 	* "-기능구분-" 분자열은 지워지면 안 됨 ( Rules[1] ) 

import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { LockFill, UnlockFill } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button';
import FunctionClassificationIdentifierModal from './FunctionClassificationIdentifierModal';

import { GetRequirementIdentificationRuleData, IRequirementIdentificationRuleModel, UpdateRequirementIdentificationRuleData } from 'models/ConfigManagement';

import {
} from 'models/ConfigManagement';
import { RootState } from 'app/store';

const RequirementIdentifierRules = () => {
	const user = useSelector((state: RootState) => state.user.user);
	const project = useSelector((state: RootState) => state.project.project);

	const [tableData, setTableData] = React.useState<IRequirementIdentificationRuleModel | null>(null)
	const [selectedContextMenu, setSelectedContextMenu] = React.useState<string>("");

	React.useEffect(() => {
		getRequirementIdentificationRuleData();
	}, [])

	const getRequirementIdentificationRuleData = async () => {
		const res = await GetRequirementIdentificationRuleData(project.project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message,
			});
		}
		setTableData(res.data);
	}
	
	// 데이블 행 데이터 입력
	// subIndex = rows[][index]
	const handleChangeTableRulesData = (index_row: string, value: string, subIndex: number) => {
		let placeValue = value
		if (index_row === "explain" && value === "") {
			placeValue = "-기능구분-"
		} else if (index_row === "example" && value === "") {
			placeValue = "ex)"
		}
		if (!tableData) {
			return
		}
		setTableData({
			...tableData,
			rows: tableData.rows.map((row, rowIndex) => {
				if (rowIndex === subIndex) {
					return {
						...row,
						[index_row]: placeValue
					}
				}
				return row
			})
		})
		return
	}

	/* 행 추가 */
	const handleAddRow = () => {
		if (!tableData) {
			return
		}
		setTableData({
			...tableData,
			rows: [...tableData.rows, {
				title: "",
				explain: "-기능구분-",
				example: "ex)"
			}]
		})
		setSelectedContextMenu("");
	}

	/* 행 삭제 */
	const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!tableData) {
			return
		}
		const { id } = event.currentTarget
		setTableData({
			...tableData,
			rows: tableData.rows.filter((_, rowIndex) => rowIndex !== +id)
		})
		setSelectedContextMenu("");
	}

	/* 우클릭 이벤트 ( 팝업 행추가/행삭제 ) 를 관리*/
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		const { id } = event.currentTarget
		if (selectedContextMenu === id) {
			setSelectedContextMenu("");
			return
		}
		setSelectedContextMenu(id);
	}

	const handleSubmit = async () => {
		if (!tableData) {
			return
		}
		/* title, explain, example 중에 빈 문자열이 존재한다면 경고 문구 And return */
		const emptyValue = tableData.rows.some(row => row.title === '' || row.example === '' || row.explain === '');
		if (emptyValue) {
			await Swal.fire({
				icon: 'warning',
				title: '경고',
				text: '빈 값을 입력해주세요.'
			});
			return
		}
		const res = await UpdateRequirementIdentificationRuleData(tableData, project.project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: res.message,
			});
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '수정 완료',
			text: res.message,
		});
		getRequirementIdentificationRuleData();
	}

	return (
		<section className="relative w-full overflow-x-auto overflow-y-auto">

			{/* ACTION HERE */}
			{/*
			<div className="sticky top-0 left-0 z-10 flex flex-wrap justify-end items-center my-2 gap-2">
				{editModeState ? <LockFill /> : <UnlockFill />}
				{editModeState && (
					<span className="text-blue-600">{getEditModeUserInfo()} 편집중</span>
				)}
				<Button variant="primary" onClick={handleEditMode}>
					Edit Mode
					<span className="ml-1 font-bold">{editModeState ? 'ON' : 'OFF'}</span>
				</Button>
				<Button variant="primary" onClick={handleSubmit}>저장</Button>
				<FunctionClassificationIdentifierModal 
					project_id={project.project_id}
				/>
			</div>
			*/}
			<div className="sticky top-0 left-0 z-10 flex flex-wrap justify-end items-center my-2 gap-2">
				<Button variant="primary" onClick={handleAddRow}>행 추가</Button>
        <Button variant="primary" onClick={handleSubmit}>저장</Button>
				<FunctionClassificationIdentifierModal 
					project_id={project.project_id}
				/>
			</div>
			<p className="text-sm text-gray-500 mt-1 text-end">우클릭으로 행 추가/삭제 가능</p>

			{/* VIEW HERE */}
			<div className="w-full h-full grid grid-cols-1 grid-flow-row pb-20">
				<div className={`row-span-1 border bg-[#efefef] grid grid-rows-1 grid-cols-${tableData && tableData.columns.length}`}>
					{tableData && tableData.columns.map((column, index) => (
						<div 
							key={index} 
							className="col-span-1 text-md font-bold w-full text-center border p-2 py-3"
						>{column}</div>
					))}
				</div>

				<div className={`row-span-1 border grid grid-cols-3`}>
					{ tableData && tableData.rows.map((tableItem, index) => (
						<div 
							key={index} 
							id={index.toString()}
							className="col-span-3 grid grid-cols-3 relative" 
							onContextMenu={handleContextMenu}>

							{/* Add Row, Remove Row */}
							<div className="absolute left-1/2 top-3">
								<input
									type="checkbox"
									className="hidden peer"
									onChange={() => {}}
									checked={selectedContextMenu === index.toString()}
								/>
								<div className="absolute z-50 flex-col hidden p-1 text-center text-black border shadow-md bg-gray-100 space-y-1 right-1/2 translate-x-[50%] rounded-md peer-checked:flex whitespace-nowrap">
									<Button onClick={handleAddRow} variant='unset' className="hover:bg-gray-200">행 추가</Button>
									<Button onClick={handleRemoveRow} variant='unset' className="hover:bg-gray-200" id={index.toString()}>행 삭제</Button>
								</div>
							</div>
							
							{/* Table Rows */}
							<div className="thin col-span-1"> 
									<InputElement value={tableItem.title} id="title" name={index.toString()} onChange={(e) => handleChangeTableRulesData(e.target.id, e.target.value, index)} /> 
							</div>
							<div className="thin col-span-1"> 
								<InputElement value={tableItem.explain} id="explain" name={index.toString()} onChange={(e) => handleChangeTableRulesData(e.target.id, e.target.value, index)} /> 
							</div>
							<div className="thin col-span-1"> 
								<InputElement value={tableItem.example} id="example" name={index.toString()} onChange={(e) => handleChangeTableRulesData(e.target.id, e.target.value, index)} /> 
							</div>
						</div>
					)) }
				</div>
			</div>
		</section>
	);
};

/* td 안에 Input  */
const InputElement = ({value, id, onChange, name}: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<input 
			id={id}
			value={value}
			name={name}
			type="text"
			className="p-2 outline-none b-0 w-full border"
			onChange={onChange}
		/>
	)
}

export default RequirementIdentifierRules;

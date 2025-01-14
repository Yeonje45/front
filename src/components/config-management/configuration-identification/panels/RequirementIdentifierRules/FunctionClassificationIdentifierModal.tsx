import React from 'react';
import Swal from 'sweetalert2';

import Modal from 'tailwindElement/Modal';
import Button from 'tailwindElement/Button';

import {
	GetIdentificationDocumentData, IIdentificationDocumentModel, UpdateIdentificationDocumentData
} from 'models/ConfigManagement';

interface IProps {
	project_id: string;
}

const FunctionClassificationIdentifierModal = ({project_id}: IProps) => {
	const [show, setShow] = React.useState(false);
	const [tableData, setTableData] = React.useState<IIdentificationDocumentModel | null>(null)
	const [selectedContextMenu, setSelectedContextMenu] = React.useState<string>("");

	React.useEffect(() => {
		getIdentificationDocumentData()
	}, [show])

	/* 기능 구분 모달 데이터 가져오는 함수 */
	const getIdentificationDocumentData = async () => {
		const res = await GetIdentificationDocumentData(project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '에러',
				text: '데이터를 불러오는데 실패했습니다.'
			});
		}
		setTableData(res.data);
	}

	const handleModalState = (): void => {
		setShow(prev => !prev);
	}

	/* key, value, index를 받아와 데이터를 수정해주는 함수 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!tableData) {
			return
		}
		// id = key, value = value, name = index
		const { id, value, name } = e.target; 
		setTableData({
			...tableData,
			rows: tableData.rows.map((row, index) => {
				if (index.toString() === name) {
					return {
						...row,
						[id]: value
					}
				}
				return row
			})
		})
		return
	}

	/* 행 삭제 */
	const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
		const { id } = event.currentTarget
		setSelectedContextMenu("");
		if (!tableData) {
			return
		}
		setTableData({
			...tableData,
			rows: tableData.rows.filter((row, index) => index.toString() !== id)
		})
		return
	}

	/* 행 추가 */
	const handleAddRow = () => {
		setSelectedContextMenu("");
		if (!tableData) {
			return
		}
		setTableData({
			...tableData,
			rows: [
				...tableData.rows,
				{
					title: '',
					code: '',
					note: ''
				}
			]
		})
		return
	}

	/* 저장 */
	const submitHandler = async () => {
		setSelectedContextMenu("");
		if (!tableData) {
			await Swal.fire({
				icon: 'error',
				title: '에러',
				text: '데이터가 없습니다.'
			});
			return
		}
		// rows 중에서 빈 값 "" 이 있나 확인
		const emptyValue = tableData.rows.some(row => row.title === '' || row.code === '' || row.note === '');
		if (emptyValue) {
			await Swal.fire({
				icon: 'error',
				title: '에러',
				text: '빈 값을 입력해주세요.'
			});
			return
		}
		const res = await UpdateIdentificationDocumentData(tableData, project_id);
		if (!res.success) {
			await Swal.fire({
				icon: 'error',
				title: '에러',
				text: '데이터를 저장하는데 실패했습니다.'
			});
		}
		await Swal.fire({
			icon: 'success',
			title: '성공',
			text: '데이터가 저장되었습니다.'
		});
		getIdentificationDocumentData();
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

	return (
		<div>

			{/* ACTION BUTTONS */}
			<Button variant="secondary" onClick={handleModalState}>기능구분</Button>

			{/* MODAL */}
			<Modal size="lg" isOpen={show}>
				<Modal.Head>기능구분 식별자</Modal.Head>
				<Modal.Body className="space-y-0">
					{/* if rows length == 0 Add Row*/}
					{ tableData && tableData.rows.length === 0 && <Button onClick={handleAddRow} variant='primary' className="hover:bg-gray-200">행 추가</Button> }
					<div className="flex flex-wrap justify-end items-center">
						<Button onClick={handleAddRow} variant='primary'>행 추가</Button>
					</div>
					<p className="text-sm text-gray-500 text-end">우클릭으로 행 추가/삭제 가능</p>
					<div className="w-full h-full grid grid-cols-1 grid-flow-row">
						<div className={`row-span-1 border bg-[#efefef] grid grid-rows-1 grid-cols-${tableData?.columns.length}`}>
							{ tableData && tableData.columns.map((tableItem, index) => (
								<div 
									key={index} 
									className="col-span-1 text-md font-bold w-full text-center border p-2 py-3">
									{tableItem}
								</div>
							)) }
						</div>
						<div className={`row-span-1 border grid grid-cols-3`}>
								{ tableData && tableData.rows.map((tableItem, index) => (
									<div 
										key={index} 
										id={index.toString()}
										className="col-span-3 grid grid-cols-3 relative" 
										onContextMenu={handleContextMenu}>

										{/* Add Row, Remove Row */}
										<div className="absolute left-1/2">
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
										<div className="thin col-span-1"> <InputElement value={tableItem.title} id="title" onChange={handleInputChange} name={index.toString()} /> </div>
										<div className="thin col-span-1"> <InputElement value={tableItem.code} id="code" onChange={handleInputChange} name={index.toString()} /> </div>
										<div className="thin col-span-1"> <InputElement value={tableItem.note} id="note" onChange={handleInputChange} name={index.toString()} /> </div>
									</div>
								)) }
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={submitHandler}>저장</Button>
					<Button variant="secondary" onClick={handleModalState}>닫기</Button>
				</Modal.Footer>
			</Modal>

		</div>
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
			className="p-2 outline-none b-0 w-full border"
			onChange={onChange}
		/>
	)
}

export default FunctionClassificationIdentifierModal;

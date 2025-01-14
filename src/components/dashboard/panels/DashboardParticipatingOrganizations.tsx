import { useState, useEffect, Fragment}  from 'react'
import { useSelector } from 'react-redux'
import sweetAlert2 from 'sweetalert2'
import { Plus, Dash } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

import { RootState } from "app/store"
import { IDashboardParticipatingOrganizationModels, DashboardParticipatingOrganizationModel, IDashboardParticipatingOrganizationRow } from "models/DashboardModel"

const DashboardParticipatingOrganizations = () => {
	const project_state = useSelector((state: RootState) => state.project)

	const [dashboardData, setDashboardData] = useState<IDashboardParticipatingOrganizationModels>({ project_id: project_state.project.project_id, columns: [], rows: [] })
	const [clickedLabel, setClickedLabel] = useState<string>("")

	useEffect(() => {
		getDashbaordData()
	}, [])

	// 서버로부터 데이터를 가져오는 함수입니다. 
	const getDashbaordData = async (): Promise<void> => {
		const res = await DashboardParticipatingOrganizationModel.requestGetParticipatingOrganization(project_state.project.project_id)

		if (res.statusCode != 200) {
			sweetAlert2.fire({
				icon: "error",
				title: "서버 오류",
				text: res.message,
			})
			return
		}

		setDashboardData(() => res.data!) // 비어있는 데이터를 받아올 수 있습니다.
		return 
	}
	
	// 데이터에 행을 추가하는 함수입니다.
	// 열에 공백이 있을 때는 공백을 "-"로 대체합니다.
	const changeRowHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name } = event.target
		const row = name.split(" ")[0]
		const column = name.split(" ").slice(1).join(" ")

		setDashboardData((prev) => {
			const newRows = [...prev.rows]
			newRows[parseInt(row)][column] = event.target.value
			return { project_id: project_state.project.project_id, columns: prev.columns, rows: newRows }
		})
	}

	// 데이터에 열을 추가하는 함수입니다.
	const changeColumnHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const index = parseInt(event.target.name)

		// Column 이름 수정이 있다면 기존 Column 이름에 행이 따라가게 구현합니다.
		setDashboardData((prev) => {
			const newColumns = [...prev.columns]
			newColumns[index] = event.target.value
			const newRows = [...prev.rows]
			prev.rows.forEach((row) => {
				if (row[prev.columns[index]]) {
					row[event.target.value] = row[prev.columns[index]]
					delete row[prev.columns[index]]
				}
			})
			return { project_id: project_state.project.project_id, columns: newColumns, rows: newRows }
		})
	}

	const removeClickedInpRow = (): void => {
		if ( clickedLabel == "" ) {
			return
		}
		const inpElement = document.getElementById(clickedLabel) as HTMLInputElement
		inpElement.click()
		setClickedLabel(() => "")
	}

	// 데이터에 행을 추가하는 함수입니다.
	const addRow = (): void => {
		removeClickedInpRow() 
		setDashboardData((prev) => { 
			const newRows = [...prev.rows] 
			const newRow: IDashboardParticipatingOrganizationRow = {}
			prev.columns.forEach((column) => {
				newRow[column] = ""
			})
			newRows.push(newRow)
			return { project_id: project_state.project.project_id, columns: prev.columns, rows: newRows }
		})
	}

	// 데이터에 행을 삭제하는 함수입니다.
	const deleteRow = (event: React.MouseEvent<HTMLButtonElement>): void => {
		const index = parseInt(event.currentTarget.id)

		setDashboardData((prev) => {
			const newRows = [...prev.rows]
			newRows.splice(index, 1)
			return { project_id: project_state.project.project_id, columns: prev.columns, rows: newRows }
		})
		removeClickedInpRow()
	}

	// 데이터에 열을 추가하는 함수입니다.
	const addColumn = async (): Promise<void> => { 
		removeClickedInpRow()
		setDashboardData((prev) => {
			const newColumns = [...prev.columns]
			newColumns.push(prev.columns.length.toString())
			const newRows = [...prev.rows]
			prev.rows.forEach((row) => {
				newColumns.forEach((column) => {
					if (!row[column]) {
						row[column] = ""
					}
				})
			})
			return { project_id: project_state.project.project_id, columns: newColumns, rows: newRows }
		}) 
	}

	// 데이터에 열을 삭제하는 함수입니다.
	// 또한 기존 열 데이터에 행 데이터도 같이 삭제합니다. 
	const deleteColumn = (event: React.MouseEvent<HTMLButtonElement>): void => {
		const index = parseInt(event.currentTarget.id)
		const columnName = event.currentTarget.name

		setDashboardData((prev) => {
			const newColumns = [...prev.columns]
			newColumns.splice(index, 1)
			const newRows = [...prev.rows]
			newRows.forEach((row) => {
				delete row[columnName]
			})
			return { project_id: project_state.project.project_id, columns: newColumns, rows: newRows }
		})
	}

	// 데이터를 서버로 전송하는 함수입니다.
	const submitDataHandler = async (): Promise<void> => {
		setDashboardData((prev) => {
			const newRows = prev.rows.map((row) => {
				Object.keys(row).forEach((key) => {
					if (!prev.columns.includes(key)) {
						delete row[key]
					}
				})
				return row
			})
			return { project_id: project_state.project.project_id, columns: prev.columns, rows: newRows }
		})
		const req = new DashboardParticipatingOrganizationModel(dashboardData)
    const res = await req.requestPostParticipatingOrganization()
    if (!res.success) {
      sweetAlert2.fire({
        icon: "error",
        title: "저장 실패",
        text: res.message,
      })
      return
    }
    sweetAlert2.fire({
      icon: "success",
      title: "저장 성공",
      text: "저장되었습니다.",
    })
	}

	// Column Label 우클릭 이벤트를 만들어 주는 함수입니다.
	const handleColumnContextMenu = (event: React.MouseEvent<HTMLLabelElement>): void => {
		event.preventDefault()
		const { htmlFor }  = event.currentTarget

		if ( clickedLabel != "" ) { 
			removeClickedInpRow()
		}

		const inpElement = document.getElementById(htmlFor) as HTMLInputElement
		inpElement.click()

		return
	}

	// Row label 우클릭 이벤트를 만들어 주는 함수입니다.
	const handleRowContextMenu = (event: React.MouseEvent<HTMLLabelElement>): void => {
		event.preventDefault()
		const { htmlFor }  = event.currentTarget

		// 동일한 row를 클릭 시에 대한 처리를 합니다.
		if ( clickedLabel == htmlFor ) {
			removeClickedInpRow()
			return
		}

		// 이전에 클릭 된 Label 있을 떄 초기화
		if ( clickedLabel != "" ) { 
			removeClickedInpRow()
		}


		const inpElement = document.getElementById(htmlFor) as HTMLInputElement
		inpElement.click()

		setClickedLabel(() => htmlFor)
		return
	}

  return (
    <div className="relative flex flex-col w-full gap-2 items-start">
			<div className="flex items-center justify-end w-full gap-3">
				{ dashboardData.columns.length == 0 && <Button variant="primary" onClick={addColumn}>열 추가</Button> }
				<Button variant="primary" onClick={addRow}>행 추가</Button>
				<Button variant="primary" onClick={submitDataHandler}>저장</Button>
			</div>
			<p className="text-sm text-gray-500 text-end ms-auto">우클릭으로 행 추가/삭제 가능</p>
			<table className="relative w-full h-full border border-collapse curosr-pointer">
				<thead>
					<tr className="text-center bg-gray-100 hx-1">
						{ dashboardData.columns && dashboardData.columns.length > 0 && dashboardData.columns.map((column, index_st) => (
							<th className="relative border" key={index_st}>
								<input
									type="checkbox"
									name={index_st.toString() + " " + column}
									id={index_st.toString() + " " + column}
									className="hidden peer"
								/>
								<label onContextMenu={handleColumnContextMenu} htmlFor={index_st.toString() + " " + column} className="w-full h-full">
									<input
										value={column}
										name={index_st.toString()}
										id={column}
										onChange={changeColumnHandler}
										autoComplete='off'
										className="w-full p-1 py-1.5 border-none rounded-none shadow-none outline-none text-center bg-transparent" />
								</label>
								<ul className="absolute z-50 flex-col hidden p-2 text-center text-black border shadow-md bg-white rg-gray-400 right-1/2 translate-x-[50%] rounded-md peer-checked:flex">
									<Button onClick={deleteColumn} id={index_st.toString()} name={column} variant='unset' className="hover:bg-gray-200">열 삭제</Button>
								</ul>
							</th>
						)) }
					</tr>
				</thead>
				<tbody>
						{ dashboardData.rows && dashboardData.rows.length > 0 && dashboardData.rows.map((row, index_st) => (
							<tr key={index_st} id={index_st.toString()} className="relative text-center cursor-pointer hx-1">
								{dashboardData.columns && dashboardData.columns.length > 0 && dashboardData.columns.map((column, index_nd) => (
									<td key={index_st + index_nd} className="px-2 border border-collapse cursor-pointer">
										<div className="relative">
											<input
												type="checkbox"
												name={index_st + " " + index_nd}
												id={index_st + " " + index_nd}
												className="hidden peer"
											/>
											<label onContextMenu={handleRowContextMenu} htmlFor={index_st + " " + index_nd} className="w-full h-full">
												<input
													value={row[column]}
													name={index_st.toString() + " " + column}
													onChange={changeRowHandler}
													autoComplete='off'
													className="w-full p-1 py-1.5 border-none rounded-none shadow-none outline-none text-center" />
											</label>
											<div className="absolute z-50 flex-col hidden p-2 text-center text-black border shadow-md bg-white rg-gray-400 right-1/2 translate-x-[50%] rounded-md peer-checked:flex whitespace-nowrap">
												<Button onClick={addRow} variant='unset' className="hover:bg-gray-200">행 추가</Button>
												<Button onClick={deleteRow} id={index_st.toString()} variant='unset' className="hover:bg-gray-200">행 삭제</Button>
												<Button onClick={addColumn} id={index_st.toString()} variant='unset' className="hover:bg-gray-200">열 추가</Button>
											</div>
										</div>
									</td>
								))}
							</tr>
						)) }
				</tbody>
			</table>
    </div>
  )
} 

export default DashboardParticipatingOrganizations

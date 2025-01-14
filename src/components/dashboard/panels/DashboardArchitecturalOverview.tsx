import { useState, useEffect }  from 'react'
import { useSelector } from 'react-redux'
import sweetAlert2 from 'sweetalert2'
import { Plus, Dash } from 'react-bootstrap-icons'

import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

import { RootState } from "app/store"
import { IDashboardArchitecturalModels, DashboardArchitecturalModel } from "models/DashboardModel"

const DashboardArchitecturalOverview = () => {
	const project_state = useSelector((state: RootState) => state.project)

	const [dashboardData, setDashboardData] = useState<IDashboardArchitecturalModels>({ project_id: project_state.project.project_id, outline: [] })

	useEffect(() => {
		getDashbaordData()
	}, [])

	// 서버로부터 데이터를 가져오는 함수입니다. 
	const getDashbaordData = async (): Promise<void> => {
		const res = await DashboardArchitecturalModel.requestGetArchitectural(project_state.project.project_id)

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
	const addRow = (): void => {
		if (!project_state.project || !project_state.project.project_id) {
			return
		}

		setDashboardData((prev) => {
			const newOutline = [...prev!.outline] // 초기 값이 비어있을 수 있기에 기존 데이터 + 새로운 행을 추가합니다.
			newOutline.push({ title: "", content: "" })
			return { project_id: project_state.project.project_id, outline: newOutline }
		})
	};

	// 데이터에 행을 삭제하는 함수입니다. 
	const deleteRow = (event: React.MouseEvent<HTMLButtonElement>): void => {
		const { name } = event.currentTarget
		const index = parseInt(name)

		setDashboardData((prev) => {
			const newOutline = [...prev!.outline]
			newOutline.splice(index, 1)
			return { project_id: project_state.project.project_id, outline: newOutline }
		})
	}

	// 데이터는 상시에 입력을 받을 수 있습니다. Index에 따라서 데이터를 변경할 수 있습니다. 
	const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		const index = parseInt(name)
		setDashboardData((prev) => {
			const newOutline = [...prev!.outline]
			newOutline[index].title = value
			return { project_id: project_state.project.project_id, outline: newOutline }
		})
	}

	// 데이터는 상시에 입력을 받을 수 있습니다. Index에 따라서 데이터를 변경할 수 있습니다.
	const changeContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const { name, value } = e.target
		const index = parseInt(name)
		setDashboardData((prev) => {
			const newOutline = [...prev!.outline]
			newOutline[index].content = value
			return { project_id: project_state.project.project_id, outline: newOutline }
		})
	}

	// 입력 된 [title/content] 중에 빈 값이 있는지 확인합니다.
	const checkInputData = (): boolean => {
		if (!dashboardData || !dashboardData.outline) {
			return false
		}

		for (let index = 0; index < dashboardData.outline.length; index++) {
			if (!dashboardData.outline[index].title || !dashboardData.outline[index].content) {
				return false
			}
		}
		return true
	}

	// 입력 된 데이터를 서버로 전송합니다. 
	const submitDataHandler = async (): Promise<void> => {
		if (!checkInputData()) {
			sweetAlert2.fire({
				icon: "error",
				title: "입력된 데이터를 확인해주세요.",
				text: "제목과 내용은 필수 항목입니다.",
			})
			return
		}

		if (!dashboardData) {
			return
		}


		const req = new DashboardArchitecturalModel(dashboardData)
		await req.requestPostArchitectural().then((res) => {
			// 동기 처리가 필요 없습니다.
			sweetAlert2.fire({
				icon: "success",
				title: "성공적으로 저장되었습니다.",
				text: res.message,
			})
			getDashbaordData()
		}).catch((err) => {
			if (err.response) {
				sweetAlert2.fire({
					icon: "error",
					title: "서버 오류",
					text: err.response.data.message,
				})
			}
		})

		return
	}

  return (
    <div className="relative flex flex-col w-full h-full gap-3">
			<div className="flex flex-wrap justify-end gap-3">
				<Button onClick={addRow} className="">행 추가</Button>
				<Button variant="primary" onClick={submitDataHandler}>저장</Button>
			</div>
      <div className="w-full">
        <div className="w-full">
					{ dashboardData && dashboardData.outline && dashboardData.outline.length > 0 && dashboardData.outline.map((outlineData, index_st) => (
						<div key={index_st} className="select-none grid grid-cols-5">
							<div className="flex items-start justify-start border col-span-1">
								<input
									value={outlineData.title} 
									name={index_st.toString()} 
									onChange={changeTitleHandler}
									autoComplete='off'
									className="w-full h-full p-2 font-bold border-0 rounded-none shadow-none outline-none" />
							</div>
							<div className="relative w-full border col-span-4">
								<textarea
									value={outlineData.content} 
									name={index_st.toString()} 
									onChange={changeContentHandler}
									autoComplete='off'
									className="w-full p-3 border-0 rounded-none outline-none text-md ring-white bg-none" 
									rows={outlineData.content.split('\n').length} />
								<button 
									name={index_st.toString()}
									onClick={deleteRow}
									className="absolute text-3xl font-bold text-red-700 top-2 right-5"><Dash /></button>
							</div>
						</div>
					)) }
        </div>
      </div>
    </div>
  )
}

export default DashboardArchitecturalOverview

import React from 'react';
import { LockFill, UnlockFill } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'

import Input from 'tailwindElement/Input';
import Button from 'tailwindElement/Button';

import ClassificationIdentificationTable from "components/config-management/configuration-identification/panels/ClassificationIdentification/Classification-IdentificationTable";
import EmbeddedSoftwareClassificationSystemMasterDataListTable from "components/config-management/configuration-identification/panels/ClassificationIdentification/EmbeddedSoftwareClassificationSystemMasterDataListTable";
import ClassificationSystemAttributeDataListTable from "components/config-management/configuration-identification/panels/ClassificationIdentification/ClassificationSystemAttributeDataListTable";

import { RootState } from 'app/store'

const ClassificationIdentification = () => {
	const user = useSelector((state: RootState) => state.user)
	const project = useSelector((state: RootState) => state.project).project

	const [editModeState, setEditModeState] = React.useState<boolean>(false);
	const [selectedTable, setSelectedTable] = React.useState<string>('ClassificationIdentificationTable');

	const handleSelectedTableRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSelectedTable(() => value);
	}

	const handleEditMode = () => {
		setEditModeState((prev) => !prev);
	}

	// 선택 된 Radio에 따른 테이블을 보여주기 위한 함수입니다.
	const getSelectedTable = (): JSX.Element => {
		switch (selectedTable) {
			case 'ClassificationIdentificationTable':
				return <ClassificationIdentificationTable 
					project_id={project.project_id} 
				/>;
			case 'EmbeddedSoftwareClassificationSystemMasterDataListTable':
				return <EmbeddedSoftwareClassificationSystemMasterDataListTable 
					project_id={project.project_id} 
				/>;
			case 'ClassificationSystemAttributeDataListTable':
				return <ClassificationSystemAttributeDataListTable 
					project_id={project.project_id} 
				/>;
			default:
				return <></>;
		}
	}

	// 편집중인 사용자 정보를 가져옵니다.
	const getEditModeUserInfo = (): string => {
		return user.user.user_name
	}

	return (
		<section className="relative w-full overflow-x-auto overflow-y-auto max-h-full min-h-full">

			{/* action buttons */}
			{/*
			<div className="sticky top-0 left-0 z-10 flex flex-wrap justify-start my-2 gap-2">
				<div className="flex flex-wrap items-center gap-2">
					{editModeState ? <LockFill /> : <UnlockFill />}
					{editModeState && (
						<span className="text-blue-600">{getEditModeUserInfo()} 편집중</span>
					)}
					<Button variant="primary" onClick={handleEditMode}>
						Edit Mode
						<span className="ml-1 font-bold">{editModeState ? 'ON' : 'OFF'}</span>
					</Button>
						</div>
				<Button variant="secondary">export</Button>
			</div>
			*/}
			

			{/* show table columns */}
			<div className="sticky top-0 left-0 z-10 flex flex-wrap justify-start my-2 gap-2">
				<Input.Radio 
					onChange={handleSelectedTableRadio} 
					id="r1" 
					label="분류체계 식별자" 
					name="show" 
					value="ClassificationIdentificationTable" 
					defaultChecked 
				/>
				<Input.Radio onChange={handleSelectedTableRadio}
					id="r2"
					label="내장형SW 분류체계 총괄자료 목록" 
					name="show" 
					value="EmbeddedSoftwareClassificationSystemMasterDataListTable"
				/>
				<Input.Radio onChange={handleSelectedTableRadio}
					id="r3"
					label="분류체계 속성자료 목록" 
					name="show" 
					value="ClassificationSystemAttributeDataListTable"
				/>
			</div>

			{/* show element here */}
			{ getSelectedTable() }
		</section>
	);
}

export default ClassificationIdentification;

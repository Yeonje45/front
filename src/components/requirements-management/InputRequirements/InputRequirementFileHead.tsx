import React, { Fragment, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'

import TraceabilityModal from './traceability/TraceabilityModal'
import InputRequirementHistoryModal from './History/InputRequirementHistoryModal'
import InputRequirementImportElement from './Import/InputRequirementSelectFileElement'
import InputRequirementExportElement from './Export/InputRequirementExportElement'


import { RequestBaselineVersion, GetRequirementVersion, IGetRequirementVersionModel, DownloadConfigurationFile } from 'models/RequirementModel';

import { useSelector } from 'react-redux'
import { RootState } from 'app/store'

interface IInputRequirementFileHeadTop {
  editModeState: boolean
  handleEditModeState: () => void
}

interface IButtonBottomFieldsProps {
  editModeState: boolean
  handleEditModeState: () => void
}

export const InputRequirementFileHeadTop = ({ editModeState, handleEditModeState }: IInputRequirementFileHeadTop) => {
	const project = useSelector((state: RootState) => state.project).project

  const [downloadTemplate, setDownloadTemplate] = useState<boolean>(false)

  // traceability, History, Baseline State 
	const [historyModalState, setHistoryModalState] = useState<boolean>(false)
	const [baselineModalState, setBaselineModalState] = useState<boolean>(false)

	const [baselineData, setBaselineData] = useState<string>('')
	const [baselineVersion, setBaselineVersion] = useState<IGetRequirementVersionModel | null>(null)	

	const getBaseline = async () => {
		const res = await GetRequirementVersion(project.project_id)
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: 'Baseline 버전 조회 실패',
				text: res.message,
			})
			return
		}
		setBaselineVersion(res.data)
	}

	const baselineDataChangehHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBaselineData(event.target.value)
	}

  // 템플릿 다운로드 버튼 클릭 시에 실행되는 함수
  const handleDownloadTemplate = () => {
    Swal.fire({
      title: '템플릿 다운로드',
      text: '템플릿을 다운로드 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니오',
    }).then(result => {
      if (result.isConfirmed) {
        DownloadConfigurationFile()
      }
    })
  }

  // 요구사항 history 확인 버튼 클릭 시에 실행되는 함수
  const handleCheckRequirementHistory = () => {
		setHistoryModalState(prev => !prev)
  }

	// Baseline 등록 버튼 클릭 시에 실행되는 함수 - Baseline 등록 모달 Open/Close
	const handleBaselineModal = async () => {
		if (baselineModalState) {
			setBaselineData('')
		} else {
			await getBaseline()
		}
		setBaselineModalState(prev => !prev)
	}

  // Baseline 등록 요청 버튼 클릭 시에 실행되는 함수
  const handleRequestBaseline = async () => {
		// 요청 시에 요청 중이라는 문구를 하나 띄어주기 
		Swal.fire({
			icon: 'info',
			title: '요구사항 버전 등록 요청 중',
			text: '요구사항 버전 등록 중입니다.',
			showConfirmButton: false,
		})
		const res = await RequestBaselineVersion(project.project_id, baselineData);
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 버전 등록 요청 실패',
				text: res.message,
			})
			return
		}
		// 성공 문구 
		Swal.fire({
			icon: 'success',
			title: '요구사항 버전 등록 요청 완료',
			text: '요구사항 버전 등록 요청이 완료되었습니다.',
		})
		handleBaselineModal() // Close Modal 
  }

  return (
    <Fragment>

			{/* Baseline Modal */}
			<Modal isOpen={baselineModalState} size="lg">
				<Modal.Head>요구사항 버전 등록 요청</Modal.Head>
				<Modal.Body>
					<div className="container px-4 mx-auto">
						<div className="mt-4">
							<h1 className="text-xl font-bold">현재 요구사항으로 {baselineVersion && baselineVersion.baseline_number}을 등록 하시겠습니까?</h1>
							<p className="mt-3">※ 요구사항의 상위항목(Parents), 하위항목(Children)을 포함하여 요구사항 버전에 등록합니다.</p>
							<Input.Textarea rows={10} className="mt-2" placeholder="의견" value={baselineData} onChange={baselineDataChangehHandler} />
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleRequestBaseline}>
						요청
					</Button>
					<Button variant="secondary" onClick={handleBaselineModal}>
						취소
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal isOpen={historyModalState} size="lg">
				<Modal.Head>요구사항 변경 이력</Modal.Head>
				<Modal.Body>
					<InputRequirementHistoryModal />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCheckRequirementHistory}>
						취소
					</Button>
				</Modal.Footer>
			</Modal>
			
			{/* 실제 UI에 보이는 버튼들 */}
      <div className="flex flex-col flex-wrap items-end justify-end whitespace-nowrap border-bottom gap-1">
				<div className="flex flex-wrap whitespace-nowrap border-bottom gap-1">
					<div className="flex align-items-cetner gap-1">
							<InputRequirementImportElement />
							<InputRequirementExportElement />
							<Button className="rounded-md" onClick={handleDownloadTemplate}> 
								템플릿 다운로드
							</Button>
					</div>
					{/*
					<Button variant="primary" onClick={handleCheckRequirementHistory}>
						요구사항 History
					</Button>
					*/}
					<Button variant="primary" onClick={handleBaselineModal}>요구사항 버전 등록 요청</Button>
				</div>
      </div>
    </Fragment>
  )
}

export const InputRequirementFileHeadBottom = ({ editModeState }: IButtonBottomFieldsProps) => {
	return (
		<Fragment>
			<div className="flex flex-wrap justify-end whitespace-nowrap border-bottom gap-1"> 
				<Button variant='primary' className="hidden">
					추적성 내보내기
				</Button>
				<TraceabilityModal editModeState={editModeState}/>
			</div>
		</Fragment>
	)
}


import React from 'react';

import Button from 'tailwindElement/Button';
import Modal from 'tailwindElement/Modal';
import Tabs from 'tailwindElement/Tabs';

const InfoModal = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);

	const handleOpen = () => {
		setIsOpen(() => true);
	}

	const handleClose = () => {
		setIsOpen(() => false);
	}

	return (
		<React.Fragment>
			<Button onClick={handleOpen}>Info</Button>

			<Modal 
				isOpen={isOpen}
				size="md"
			>
				<Modal.Head>신뢰도 예측</Modal.Head>
				<Modal.Body>

					<Tabs defaultTab='RADC01' >
						<Tabs.Tab label="RADC01">
							<table className="table w-full h-full table-border" >
								<tr>
									<th>No.</th>
									<th>RADC_01</th>
								</tr>
								<tr>
									<th>Metric Name</th>
									<td>Predicted Defect Density</td>
								</tr>
								<tr>
									<th>Definition</th>
									<td>구현 단계까지의 개발 단계별 예측되는 소프트웨어의 Testing 시점의 결함밀도를 나타낸다.</td>
								</tr>
								<tr>
									<th>SDLC</th>
									<td>요구사항 분석, 기본설계, 상세설계, 구현</td>
								</tr>
								<tr>
									<th>Aplicaion & Benefits</th>
									<td>소프트웨어의 무결성 (Integrity)을 나타내는 지표
        적용 모델(5): RADC, Shortcut, CMMI 모델, Industry/Application type 모델, Full-Scale 모델
        SLOC 단위: KLOC (1000 SLOC=1 KLOC)
        PDD(Predicted Defect Density) 단위: 결함/KLOC</td>
								</tr>
							</table>
						</Tabs.Tab>
						<Tabs.Tab label="RADC06">
							<table className="table w-full h-full table-border" >
								<tr>
									<th>No.</th>
									<th>RADC06</th>
								</tr>
								<tr>
									<th>Metric Name</th>
									<td>Residual Defect Count</td>
								</tr>
								<tr>
									<th>Definition</th>
									<td>Testing 시점의 소프트웨어의 내재된 총 결함수를 의미한다.</td>
								</tr>
								<tr>
									<th>SDLC</th>
									<td>요구사항 분석, 기본설계, 상세설계, 구현</td>
								</tr>
								<tr>
									<th>Aplicaion & Benefits</th>
									<td>결함 데이터를 기반으로 소프트웨어의 무결성을 나타내는 지표
        RADC, Shortcut, CMMI, Industry/Application type, Full-Scale 모델을 통해 에측 결함 밀도(SM03 Predictive Testing Defect Density)와 소스코드
        라인수(SLOC)를 이용하여 예측결함 수 계산
        </td>
								</tr>
							</table>
						</Tabs.Tab>
					</Tabs>





				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose}>닫기</Button>
				</Modal.Footer>
			</Modal>

		</React.Fragment>
	)
}

export default InfoModal; 

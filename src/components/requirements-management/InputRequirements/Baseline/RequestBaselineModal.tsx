import Input from "tailwindElement/Input"

const RequestBaselineModal = () => {
	return (
		<div className="container px-4 mx-auto">
			<div className="mt-4">
				<h1 className="text-xl font-bold">현재 요구사항으로 Baseline(v0.001)을 등록 하시겠습니까?</h1>
				{/* 추적성이 100%일 경우에 해당 문구 표시 */}
				{/* <p>요구사항 추적이 100%가 되지 않습니다.</p> */}
				<p className="mt-3">※ 요구사항의 상위항목(Parents), 하위항목(Children)을 포함하여 베이스라인에 등록합니다.</p>
				<Input.Textarea rows={10} className="mt-2" placeholder="의견" />
			</div>
		</div>
	)
}

export default RequestBaselineModal

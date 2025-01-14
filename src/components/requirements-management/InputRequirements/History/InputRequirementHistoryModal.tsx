import { useState, useEffect } from 'react'

import Button from "tailwindElement/Button"
import Tabs from "tailwindElement/Tabs"

// 전체, 체계 요구사항, SW 요구사항, SW 설계, SW 테스트
const InputRequirementHistoryModal = () => {
	return (
		<div className="container mx-auto">
			<Tabs defaultTab='전체'>

				<Tabs.Tab label='전체'>
					<table className="table w-full">
						<thead className="border">
							<tr className="border">
								<th rowSpan={2} className="p-2 font-bold text-center">식별자</th>
								<th rowSpan={2} className="p-2 text-center border">변경 구분</th>
								<th rowSpan={2} className="p-2 text-center border">요구사항 그룹</th>
								<th rowSpan={2} className="p-2 text-center border">제목</th>
								<th rowSpan={2} className="p-2 text-center border">내용</th>
								<th colSpan={4} className="p-2 text-center border">변경사항</th>
							</tr>
							<tr className="border">
								<th className="p-2 text-center border">일자</th>
								<th className="w-32 p-2 text-center border">편집자</th>
								<th colSpan={2} className="p-2 text-center border">변경내용 요약</th>
							</tr>
						</thead>
						<tbody className="border">
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-004</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-003</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-002</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-001</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
						</tbody>
					</table>
				</Tabs.Tab>

				<Tabs.Tab label="체계 요구사항">
					<table className="table w-full">
						<thead className="border">
							<tr className="border">
								<th rowSpan={2} className="p-2 font-bold text-center">식별자</th>
								<th rowSpan={2} className="p-2 text-center border">변경 구분</th>
								<th rowSpan={2} className="p-2 text-center border">요구사항 그룹</th>
								<th rowSpan={2} className="p-2 text-center border">제목</th>
								<th rowSpan={2} className="p-2 text-center border">내용</th>
								<th colSpan={4} className="p-2 text-center border">변경사항</th>
							</tr>
							<tr className="border">
								<th className="p-2 text-center border">일자</th>
								<th className="w-32 p-2 text-center border">편집자</th>
								<th colSpan={2} className="p-2 text-center border">변경내용 요약</th>
							</tr>
						</thead>
						<tbody className="border">
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-004</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-003</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-002</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-001</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
						</tbody>
					</table>
				</Tabs.Tab>

				<Tabs.Tab label="SW 요구사항">
					<table className="table w-full">
						<thead className="border">
							<tr className="border">
								<th rowSpan={2} className="p-2 font-bold text-center">식별자</th>
								<th rowSpan={2} className="p-2 text-center border">변경 구분</th>
								<th rowSpan={2} className="p-2 text-center border">요구사항 그룹</th>
								<th rowSpan={2} className="p-2 text-center border">제목</th>
								<th rowSpan={2} className="p-2 text-center border">내용</th>
								<th colSpan={4} className="p-2 text-center border">변경사항</th>
							</tr>
							<tr className="border">
								<th className="p-2 text-center border">일자</th>
								<th className="w-32 p-2 text-center border">편집자</th>
								<th colSpan={2} className="p-2 text-center border">변경내용 요약</th>
							</tr>
						</thead>
						<tbody className="border">
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-004</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-003</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-002</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-001</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
						</tbody>
					</table>
				</Tabs.Tab>

				<Tabs.Tab label="SW 설계">
					<table className="table w-full">
						<thead className="border">
							<tr className="border">
								<th rowSpan={2} className="p-2 font-bold text-center">식별자</th>
								<th rowSpan={2} className="p-2 text-center border">변경 구분</th>
								<th rowSpan={2} className="p-2 text-center border">요구사항 그룹</th>
								<th rowSpan={2} className="p-2 text-center border">제목</th>
								<th rowSpan={2} className="p-2 text-center border">내용</th>
								<th colSpan={4} className="p-2 text-center border">변경사항</th>
							</tr>
							<tr className="border">
								<th className="p-2 text-center border">일자</th>
								<th className="w-32 p-2 text-center border">편집자</th>
								<th colSpan={2} className="p-2 text-center border">변경내용 요약</th>
							</tr>
						</thead>
						<tbody className="border">
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-004</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-003</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-002</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-001</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
						</tbody>
					</table>
				</Tabs.Tab>

				<Tabs.Tab label="SW 테스트">
					<table className="table w-full">
						<thead className="border">
							<tr className="border">
								<th rowSpan={2} className="p-2 font-bold text-center">식별자</th>
								<th rowSpan={2} className="p-2 text-center border">변경 구분</th>
								<th rowSpan={2} className="p-2 text-center border">요구사항 그룹</th>
								<th rowSpan={2} className="p-2 text-center border">제목</th>
								<th rowSpan={2} className="p-2 text-center border">내용</th>
								<th colSpan={4} className="p-2 text-center border">변경사항</th>
							</tr>
							<tr className="border">
								<th className="p-2 text-center border">일자</th>
								<th className="w-32 p-2 text-center border">편집자</th>
								<th colSpan={2} className="p-2 text-center border">변경내용 요약</th>
							</tr>
						</thead>
						<tbody className="border">
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-004</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-003</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-002</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
							<tr>
								<td className="p-2 text-center border">R-XX-XXX-001</td>
								<td className="p-2 text-center border">변경/삭제/추가</td>
								<td className="p-2 text-center border">체계 요구사항</td>
								<td className="p-2 text-center border">변경된 제목</td>
								<td className="p-2 text-center border">변경된 내용</td>
								<td className="p-2 text-center border">2024.04.00.00:00:00</td>
								<td className="p-2 text-center border">홍길동</td>
								<td colSpan={2} className="p-2 text-center border">ex) 변경전: AA 변경후: BB</td>
							</tr>
						</tbody>
					</table>
				</Tabs.Tab>
			</Tabs>
		</div>
	)
}

export default InputRequirementHistoryModal

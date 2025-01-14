
export const testDescriptionTableHeaderFields:string[] = [
  "시험 식별자",
  "선행 조건",
  "시험 입력 자료",
  "시험 예상 결과",
  "결과 평가 기준",
  "시험 절차",
  "가정 및 제약사항"
]

export const testDescriptionModalTableHeaderFields: string[] = [
  "순서",
  "시험 절차",
  "결과"
]

export interface TestDescriptionTableColumnsFields {
  sequence: number
  testDescription: string
  result: string
}

export const testDescriptionModalTableCoulmnsFields: TestDescriptionTableColumnsFields[] = [
  {
    sequence: 1,
    testDescription: "전면판 LED에 “S2-9600\"이 표시되는지를 확인한다. (전송 속도 설정)",
    result: ""
  },
  {
    sequence: 2,
    testDescription: " 11. [기입] 키를 누른다. (세팅 완료)",
    result: ""
  },
  {
    sequence: 3,
    testDescription:  "12. \"기능\"스위치를 \"정상\" 에 놓는다.",
    result: ""
  },
  {
    sequence: 4,
    testDescription: "15. 메뉴의 [View] -> [Memory]를 클릭하고, Address란에 \"OX8A73\" , Page 란에 \"Data\" 를 기입하고, 창이 열리면, 0x8A73번지 하위 바이트가 0x00임을 확인한다. ",
    result: ""
  },
]
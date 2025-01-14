// 테이블 셀 클릭시 라디오 버튼 클릭 해주는 핸들러
export const radioClickHandler = (e: React.MouseEvent<HTMLTableCellElement>) => {
  const target = e.target as HTMLElement;
  
  if(target.tagName === "TD") {
    (target.children[0].children[0] as HTMLElement).click()
    return
  }
  else if (target.tagName === "DIV") {
    (target.children[0] as HTMLElement).click()
    return
  }
}
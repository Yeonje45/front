import { Fragment, useEffect, useRef, useState } from "react";

import { ITestProcedure, TestPlan0506TableHeaderFields } from "pages/test-management/sw-integration-test/test-description/testDescriptionEditorData";
import Input from "tailwindElement/Input";
import { radioClickHandler } from "components/common/util/TableData";
import { ITestExecutionId } from "constant/test_manage/test-execution-records/testExecutionRecordsFields";

interface IProps {
  testProcedure: ITestProcedure[]
  delTestProcedure: number[]
  checkBoxChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => void
  onDrop: (drag: number, dragOver: number) => void
  testExecutionId: ITestExecutionId | null
}

const TestDescriptionProcedureTable = ({ testProcedure, delTestProcedure, checkBoxChangeHandler, inputChangeHandler, onDrop, testExecutionId }: IProps) => {
  const dragRef = useRef<number>(0)
  const dragOverRef = useRef<number>(0)

  // Drag & Drop
  const onDragStart = (e: React.DragEvent<HTMLTableRowElement>) => {
    dragRef.current = Number(e.currentTarget.ariaLabel)
    e.currentTarget.style.opacity = '0.4'
  }

  const onDragEnter = (e: React.DragEvent<HTMLTableRowElement>) => {
    dragOverRef.current = Number(e.currentTarget.ariaLabel)
  }

  const onDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.opacity = '1'
  }

  const onDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault()
  }

  const onDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.scale = '1'
  }

  const onDrop2 = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.scale = '1'

    onDrop(dragRef.current, dragOverRef.current)
  }

  return (
    <div>
      <div className={`w-full h-[560px] overflow-y-auto`}>
        <table className='w-full table-border select-none'>
          <thead>
            <tr>
              {TestPlan0506TableHeaderFields.map((th, index_st) => 
                ((th === "시험 결과" || th === "해결/접근 방식") && testExecutionId === null) ?
                  <Fragment key={index_st}></Fragment>
                :
                (
                  <th key={index_st} className={`whitespace-nowrap`}>
                    {th}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {
              testProcedure.length ? testProcedure.map((tr, index_st) => (
                <tr key={index_st}
                  aria-label={index_st.toString()}
                  onDragStart={onDragStart}
                  onDragEnter={onDragEnter}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop2}
                  draggable               
                  >
                  <td onClick={radioClickHandler} className='w-[50px]'>
                    <Input.Checkbox name={index_st.toString()} checked={delTestProcedure.includes(index_st)} onChange={checkBoxChangeHandler}/>
                  </td>
                  <td className='w-[50px]'>
                    {tr.std_procedure_order}
                  </td>
                  <td className='!text-start flex items-start !p-0'>
                    <textarea className='w-full p-2 resize-none' rows={2} onChange={inputChangeHandler} name={`std_procedure_content_${tr.std_procedure_order}`} value={tr.std_procedure_content} />
                  </td>
                  
                  {
                    testExecutionId ?
                    <>
                      <td className="w-[200px]">
                        <Input.Select name={`std_procedure_result_${tr.std_procedure_order}`} value={tr.std_procedure_result || ""} onChange={inputChangeHandler}>
                          <Input.Option value={""}></Input.Option>
                          <Input.Option value={"pass"}>양호</Input.Option>
                          <Input.Option value={"conditional"}>조건부충족</Input.Option>
                          <Input.Option value={"fail"}>미충족</Input.Option>
                          <Input.Option value={"skip"}>생략</Input.Option>
                        </Input.Select>
                      </td>
                      <td className='!text-start flex items-start !p-0'>
                        <textarea className='w-full p-2 resize-none' rows={2} onChange={inputChangeHandler} name={`std_procedure_issue_${tr.std_procedure_order}`} value={tr.std_procedure_issue || ""} />
                      </td>
                    </>
                    :
                    <></>
                  }
                </tr>
              ))
              :
              <tr>
                <td colSpan={testExecutionId ? 5 : 3} className='h-[513px]'>
                  현재 선택한 식별자의 시험 절차 데이터가 없습니다.
                  <br/>
                  행 추가를 통해 시험 절차 데이터를 입력 및 추가해주세요.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TestDescriptionProcedureTable;
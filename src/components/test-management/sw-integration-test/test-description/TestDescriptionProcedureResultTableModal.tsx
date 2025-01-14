import { ITestExecutionTargets, testResultFields } from "constant/test_manage/test-execution-records/testExecutionRecordsFields"
import { useState } from "react"
import { List } from "react-bootstrap-icons"
import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal"

interface IProps {
  testExecutionTargets: ITestExecutionTargets[]
  selectedCategory: string
  clickTestExecutionOrderHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const TestDescriptionProcedureResultTableModal = ({testExecutionTargets, selectedCategory, clickTestExecutionOrderHandler}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleShow = () => {
    setIsOpen(!isOpen)
  }  

  return (
    <>
      <button onClick={handleShow}><List size={30} /></button>

      <Modal isOpen={isOpen} size="md">
        <Modal.Head>
          시험 결과 진행 상황
        </Modal.Head>
        <Modal.Body>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full table-border">
              <thead>
                <tr>
                  <th>순서</th>
                  <th>시험 식별자</th>
                  <th>시험 결과</th>
                  <th>진행 상태</th>
                </tr>
              </thead>
              <tbody>
                {
                  testExecutionTargets.sort((a, b) => a.test_target_order - b.test_target_order).map((tr, index_st) => (
                    <tr key={index_st}>
                      <td>
                        {tr.test_target_order}
                      </td>
                      <td className="!p-0 !m-0">
                        <button className="w-full p-3 hover:bg-gray-100" name={`_${tr.test_target_order}`} onClick={(e) => {
                          clickTestExecutionOrderHandler(e);
                          setIsOpen(false)
                        } }>
                          [{tr.req_number}] {tr.req_title}
                        </button>
                      </td>
                      <td>
                        {testResultFields[`${tr.test_target_result}`]}
                      </td>
                      <td>
                        {tr.test_target_result === "" || tr.test_target_result === null ? selectedCategory.split(' ')[1] === tr.req_number ? "진행중" : "미진행" : "완료"}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleShow}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TestDescriptionProcedureResultTableModal
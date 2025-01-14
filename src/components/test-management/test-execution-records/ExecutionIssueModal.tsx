import { useState } from 'react'
import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'

interface IExecutionIssueModal {
  index: string
}

const ExecutionIssueModal = ({ index }: IExecutionIssueModal) => {
  const [show, setShow] = useState<string>('')

  return (
    <ActiveModal
      size="lg"
      isOpen={show === index}
      buttonElement={
        <Button
          onClick={() => {
            setShow(index)
          }}
          name={`requirement_${index}`}>
          입력
        </Button>
      }>
      <ActiveModal.Head>시험 자료</ActiveModal.Head>
      <ActiveModal.Body className="flex flex-col justify-center p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>
                <Input.Checkbox />
              </th>
              <th className="w-full">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Input.Checkbox />
              </td>
              <td>000기능 000 미시현</td>
            </tr>
            <tr>
              <td>
                <Input.Checkbox />
              </td>
              <td>000기능 000 미시현</td>
            </tr>
            <tr>
              <td>
                <Input.Checkbox />
              </td>
              <td>000기능 000 미시현</td>
            </tr>
            <tr>
              <td>
                <Input.Checkbox />
              </td>
              <td>000기능 000 미시현</td>
            </tr>
            <tr>
              <td>
                <Input.Checkbox />
              </td>
              <td>000기능 000 미시현</td>
            </tr>
            <tr>
              <td>
                <Input.Checkbox />
              </td>
              <td>000기능 000 미시현</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-start">
          <Button>품질관리로 이동</Button>
        </div>
      </ActiveModal.Body>
      <ActiveModal.Footer>
        <Button>저장</Button>
        <Button
          onClick={() => {
            setShow('')
          }}>
          닫기
        </Button>
      </ActiveModal.Footer>
    </ActiveModal>
  )
}

export default ExecutionIssueModal

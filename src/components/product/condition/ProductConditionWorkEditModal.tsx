import { IOutput } from 'constant/condition/conditionTableFormFields'
import { AccessAxios } from 'models'
import React, { useEffect, useRef, useState } from 'react'
import { Check2Square, List, PencilSquare, Trash } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import Modal from 'tailwindElement/Modal'

export interface IProps {
  data: IOutput[]
  index: string
  name: string
}

const ProductCondiitonWorkEditModal = ({ data, index, name }: IProps) => {
  const [output, setOutput] = useState<IOutput[]>([])

  // modal show state
  const [show, setShow] = useState<boolean>(false)

  const [edit, setEdit] = useState<string>('')

  const [append, setAppend] = useState<string>('')

  const dragRef = useRef<number>(0)
  const dragOverRef = useRef<number>(0)

  const scrollRef = useRef<HTMLDivElement>(null)

  const addModalHandler = async () => {
    try {
      const url = window.location.pathname.split('/')[1] === "product" ? "/outputs/content/" : "/reliability/content/"
      await AccessAxios.post(url, {
        custom_ouput_history_index: index,
        output_contents: output,
      })

      Swal.fire({
        icon: 'success',
        title: '산출물 상세업무 편집이 완료되었습니다.',
      }).then(() => {
        addCloseModalHandler()
        editFalseClickHandler()
        window.location.reload()
      })
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: '산출물 상세업무 편집에 실패했습니다.',
      })
    }
  }

  const addOpenModalHandler = () => {
    setShow(true)
  }

  const addCloseModalHandler = () => {
    setShow(false)

    setEdit('')
    setOutput(() => JSON.parse(JSON.stringify(data)))
  }

  const editChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const [index_st] = name.split('_')

    let setData = [...output]

    setData[Number(index_st)].output_content_name = value

    setOutput(setData)
  }

  const appendChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setAppend(value)
  }

  const appendClickHandler = (): void => {
    if (output.map(d => d.output_content_name).includes(append)) {
      Swal.fire({
        icon: 'error',
        title: '이미 존재하는 상세업무입니다.',
      })
      return
    } else if (append == '') {
      Swal.fire({
        icon: 'error',
        title: '상세업무 이름을 입력해주세요.',
      })
      return
    }

    setOutput(prev => [
      ...prev,
      {
        output_content_history_index: `new_${Math.random()}`,
        output_content_name: append,
        output_content_state: 'new',
        output_content_update_date: 'new',
        output_content_check: true
      },
    ])

    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: scrollRef.current.scrollHeight + 10000,
        behavior: 'smooth',
      })
    }

    setAppend('')
  }

  const editTrueClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name
    setEdit(name)
  }

  const editFalseClickHandler = () => {
    setEdit('')
  }

  const deleteClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget

		if (output.length === 1) {
			Swal.fire({
				icon: 'error',
				title: '상세업무는 최소 1개 이상이어야 합니다.',
			})
			return
		}


    let setData = [...output]

    Swal.fire({
      icon: 'question',
      title: '상세업무를 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: `삭제`,
      cancelButtonText: `취소`,
    }).then(result => {
      if (result.isConfirmed) {
        setData = setData.filter(item => item.output_content_history_index != name)

        setOutput(setData)
      }
    })
  }

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
    e.currentTarget.style.scale = '1.1'
  }

  const onDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.scale = '1'
  }

  const onDragExit = (e: React.DragEvent<HTMLTableRowElement>) => {}

  const onDrag = (e: React.DragEvent<HTMLTableRowElement>) => {}

  const onDrop = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.scale = '1'

    const drag = dragRef.current
    const dragOver = dragOverRef.current

    let setData = [...output]

    const dragItem = setData[drag]
    setData.splice(drag, 1)
    setData.splice(dragOver, 0, dragItem)

    setOutput(setData)
  }

  useEffect(() => {
    if (data) {
      setOutput(() => JSON.parse(JSON.stringify(data)))
    }
  }, [data])

  return (
    <>
      <Button onClick={addOpenModalHandler}>편집</Button>
      <Modal isOpen={show} size='lg'>
        <Modal.Head>산출물 상세업무 편집</Modal.Head>
        <Modal.Body className="flex justify-center">
          <div className="flex flex-col w-full mt-5 gap-5 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
            <Input.InputLabel label="산출물 이름" value={name} disabled />
            <div className="flex items-end w-full gap-2">
              <Input.InputLabel
                label="상세업무 이름"
                value={append}
                onChange={appendChangeHandler}
              />
              <div className="whitespace-pre">
                <Button onClick={appendClickHandler}>추가하기</Button>
              </div>
            </div>
            <hr />
            <div
              ref={scrollRef}
              className="table-border w-full max-h-[400px] overflow-y-auto overflow-x-hidden"
              id="table-scroll">
              <table className="w-full">
                <thead>
                  <tr className="whitespace-pre">
                    <th className="!border-x-0">상세업무 이름</th>
                    <th className="!border-x-0">수정</th>
                    <th className="!border-x-0">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {output &&
                    output.map((work, index_st) => (
                      <tr
                        className="duration-200"
                        key={index_st}
                        aria-label={index_st.toString()}
                        onDragStart={onDragStart}
                        onDragEnter={onDragEnter}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDragExit={onDragExit}
                        onDrag={onDrag}
                        onDrop={onDrop}
                        draggable>
                        <td className="!text-start !border-x-0">
                          {work.output_content_history_index == edit ? (
                            <Input
                              value={work.output_content_name}
                              name={index_st.toString()}
                              onChange={editChangeHandler}
                            />
                          ) : (
                            <div>{work.output_content_name}</div>
                          )}
                        </td>
                        <td className="!border-x-0 text-2xl !p-0">
                          {edit == work.output_content_history_index ? (
                            <Button
                              variant="unset"
                              name={work.output_content_history_index}
                              className="text-green-800"
                              onClick={editFalseClickHandler}>
                              <Check2Square size={21} />
                            </Button>
                          ) : (
                            <Button
                              variant="unset"
                              name={work.output_content_history_index}
                              onClick={editTrueClickHandler}>
                              <PencilSquare />
                            </Button>
                          )}
                        </td>
                        <td className="!border-x-0 text-2xl !p-0">
                          <Button
                            variant="unset"
                            name={work.output_content_history_index}
                            onClick={deleteClickHandler}>
                            <Trash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addModalHandler}>저장</Button>
          <Button onClick={addCloseModalHandler}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProductCondiitonWorkEditModal

import {
  ITraceabilityData,
  ITraceabilityDataRequirement,
} from 'constant/requirement_manage/traceabilityManagementTableFields'
import React, { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'
import DragZoomContainer from 'components/common/graph/DragZoomContainer'
import Button from 'tailwindElement/Button'
import Modal from 'tailwindElement/Modal'
import Swal from 'sweetalert2'
interface ITraceabilityManagementGraph {
  activeTraceabilityData: ITraceabilityDataRequirement
  activeData: ITraceabilityData
}

interface IMenu {
  [key: string]: boolean
  horizontal: boolean
  vertical: boolean
  isTitle: boolean
}

const NodeSize = {
  width: 200,
  height: 80,
}

const Arrow = ({
  data,
  menu,
}: {
  data: ITraceabilityDataRequirement[]
  menu: IMenu
}) => {
  const refArrow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (refArrow.current) {
      const width = refArrow.current.offsetWidth
      const height = '100%'

      const svg = d3
        .select(refArrow.current)
        .html('')
        .append('svg')
        .attr('width', `${width}px`)
        .attr('height', height)

      data.forEach(node => {
        node.children.forEach(child => {
          const arrowElement = document.getElementById(`arrow_${node.req_id}`)
          const childElement = document.getElementById(`arrow_${child}`)

          if (childElement && arrowElement) {
            const x1 = menu.vertical ? arrowElement.offsetLeft + 100 : 0
            const y1 = menu.vertical
              ? 0
              : arrowElement.offsetTop + (menu.isTitle ? 24 : 5)

            const x2 = menu.vertical ? childElement.offsetLeft + 100 : width
            const y2 = menu.vertical
              ? menu.isTitle
                ? NodeSize.height
                : NodeSize.height + NodeSize.height / 2
              : childElement.offsetTop + (menu.isTitle ? 24 : 5)

            svg
              .append('line')
              .attr('x1', x1)
              .attr('y1', y1)
              .attr('x2', x2)
              .attr('y2', y2)
              .attr('stroke', 'gray')
              .attr('stroke-width', 1)
          }
        })
      })
    }
  }, [data, menu])

  return <div className="w-full h-full" ref={refArrow} />
}

const NodeField = ({
  field,
  id,
  activeGraphNode,
  menu,
}: {
  field: ITraceabilityDataRequirement
  id: string
  activeGraphNode: number
  menu: IMenu
}) => {  
  return (
    <div
      style={{ width: `${NodeSize.width}px`, height: "100%" }}
      className={`flex flex-col border rounded-lg ${
        activeGraphNode === field.req_id ? 'shadow-[0_0_30px_0_#d9f99d]' : ''
      }`}
      id={id}>
      <div
        style={{ height: `${NodeSize.height/2}px` }}
        className={`rounded-t-md p-3 bg-gray-100 ${menu.isTitle ? '' : 'rounded-b-md'}`}>
        {field.req_number}
      </div>
      {menu.isTitle ? (
        <div
          className={`flex items-center overflow-x-auto overflow-y-hidden border-t p-3`}>
          {field.req_content}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

const TitleField = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        width: `${NodeSize.width}px`,
        height: `${NodeSize.height / 2}px`,
      }}
      className={`flex justify-center items-center border rounded-lg text-xl bg-[#e7e7e7]`}>
      {children}
    </div>
  )
}

const TraceabilityManagementGraph = ({
  activeTraceabilityData, // 테이블에서 선택한 노드 데이터
  activeData, // 선택된 데이터의 관계 데이터
}: ITraceabilityManagementGraph) => {
  const [isOpen, setIsOpen] = useState(false)

  // 선택된 데이터의 관계 데이터
  const refGraph = useRef<HTMLDivElement>(null)

  const [menu, setMenu] = useState<IMenu>({
    horizontal: true,
    vertical: false,
    isTitle: true,
  }) // 가로 세로 제목 추가/제거 메뉴

  // 가로 세로 제목 추가/제거
  const menuButtonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name

    if (name === 'horizontal') {
      setMenu(prev => {
        return {
          ...prev,
          horizontal: true,
          vertical: false,
        }
      })
    } else if (name === 'vertical') {
      setMenu(prev => {
        return {
          ...prev,
          horizontal: false,
          vertical: true,
        }
      })
    } else if (name === 'content') {
      setMenu(prev => {
        return {
          ...prev,
          isTitle: !prev.isTitle,
        }
      })
    }
  }

  const traceabilityGraphModalStateHandle = () => {
    
    if(!isOpen && activeTraceabilityData.req_id === 0) {
      Swal.fire({
        icon: 'info',
        title: '선택한 요구사항이 없습니다. 요구사항 선택 후 다시 시도하세요.',
      })

      return
    }

    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if(activeTraceabilityData.req_id === 0) {
      setMenu({
        horizontal: true,
        vertical: false,
        isTitle: true
      })
    }
  }, [activeTraceabilityData])

  return (
    <div>
      <Button onClick={traceabilityGraphModalStateHandle}>추적성 그래프</Button>
      <Modal isOpen={isOpen} size='xl'>
        <Modal.Head>
          추적성 그래프
        </Modal.Head>
        <Modal.Body>
          <div className='flex justify-center relative'>
            {activeTraceabilityData.req_id ?
              (
                <div className='w-full h-full flex'>
                  <div className="absolute flex justify-between items-center border bg-white z-20 m-2">
                  <button
                    className={`py-2 px-4 border-e  ${
                      menu.horizontal ? 'bg-[#dddddd]' : ''
                    } hover:bg-gray-100`}
                    name="horizontal"
                    onClick={menuButtonHandler}>
                    Horizontal
                  </button>
                  <button
                    className={`py-2 px-4 hover:bg-gray-100 ${
                      menu.vertical ? 'bg-[#dddddd]' : ''
                    }`}
                    name="vertical"
                    onClick={menuButtonHandler}>
                    Vertical
                  </button>
                  <button
                    className={`py-2 px-4 border-s hover:bg-gray-100 ${
                      menu.isTitle ? 'bg-[#dddddd]' : ''
                    }`}
                    name="content"
                    onClick={menuButtonHandler}>
                    제목
                  </button>
                </div>
                <DragZoomContainer className='h-[700px] flex justify-center items-center p-14'>
                  <div
                    className={`w-[1700px] h-full flex ${
                      menu.vertical ? '' : 'flex-col'
                    }`}
                    ref={refGraph}>
                    <div
                      style={
                        menu.vertical
                          ? {
                              height: `100%`,
                              gap: `${NodeSize.height + NodeSize.height / 2}px`,
                            }
                          : {}
                      }
                      className={`${
                        menu.vertical ? `flex flex-col` : 'w-full flex justify-between px-5'
                      }`}>
                      <TitleField>체계 요구사항</TitleField>
                      <TitleField>SW 요구사항</TitleField>
                      <TitleField>SW 설계</TitleField>
                      <TitleField>SW 구현</TitleField>
                    </div>

                    <div
                      className={`w-full flex px-5 ${
                        menu.vertical ? 'flex-col' : 'gap-[288px]'
                      }`}>
                      {Object.keys(activeData).map((keys, index_st) => {                                         
                        return (
                          <div
                            key={index_st}
                            style={{
                              width: `${menu.horizontal ? `${NodeSize.width}px` : "100%"}`,
                              paddingLeft: `${activeData[keys].length ? "0" : NodeSize.width}px`  ,
                              paddingBottom:
                              menu.vertical ? menu.isTitle || activeData[keys].length === 0 ? `${NodeSize.height}px`: `${NodeSize.height + NodeSize.height / 2}px`: "" }}
                            className={`relative`}>
                            <div
                              style={
                                menu.vertical ? menu.isTitle || activeData[keys].length === 0 ? {height: `${NodeSize.height}px` } : { height: `${NodeSize.height / 2}px` } : { width: `${NodeSize.width}px` }
                              }
                              className={`flex gap-5  ${
                                menu.vertical ? 'justify-start' : `flex-col items-center py-5`
                              }`}>
                              {activeData[keys].map((data, index_nd) => (
                                  <NodeField
                                    id={`arrow_${data.req_id}`}
                                    key={index_nd}
                                    field={data}
                                    activeGraphNode={activeTraceabilityData.req_id}
                                    menu={menu} 
                                  />
                                ))}
                            </div>
        
                            {index_st !== 3 ? (
                              <div
                                style={
                                  menu.vertical
                                    ? menu.isTitle
                                      ? { height: `${NodeSize.height}px` }
                                      : {
                                          height: `${NodeSize.height + NodeSize.height / 2}px`,
                                        }
                                    : {}
                                }
                                className={`absolute ${
                                  menu.vertical
                                    ? `w-full`
                                    : `w-[288px] h-full left-full top-5`
                                }`}>
                                <Arrow data={activeData[keys]} menu={menu} />
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </DragZoomContainer>
              </div>
              )
                :
              (
                <div className='w-full h-[700px] border p-12'>
                  <div
                    style={
                      menu.vertical
                        ? {
                            height: `${NodeSize.height * 8}px`,
                            gap: `${NodeSize.height + NodeSize.height / 2}px`,
                          }
                        : {}
                    }
                    className={` ${
                      menu.vertical ? `flex flex-col` : 'w-full flex justify-between px-5'
                    }`}>
                    <TitleField>체계 요구사항</TitleField>
                    <TitleField>SW 요구사항</TitleField>
                    <TitleField>SW 설계</TitleField>
                    <TitleField>SW 구현</TitleField>
                  </div>
                  <div className="w-full h-full flex justify-center items-center text-center">
                    선택된 데이터가 없습니다.
                    <br />
                    연결된 추적성을 선택해주세요.
                  </div>
                </div>
              )
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={traceabilityGraphModalStateHandle}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TraceabilityManagementGraph

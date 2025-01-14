import { IChildren } from 'constant/dashboard/systemArchitectureFields'
import React, { useEffect, useRef, useState } from 'react'
import {
  CaretLeftFill,
  CaretRight,
  Diagram2,
  Images,
  ThreeDotsVertical,
} from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'

import * as d3 from 'd3'

import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import Swal from 'sweetalert2'
import DragZoomContainer from 'components/common/graph/DragZoomContainer'
import { GetSystemAarchitectureGraph, SaveSystemAarchitectureGraph } from 'models/DashboardModel';
import { RootState } from 'app/store'


export interface IActiveNodeData {
  id: string
  name: string
  memo: string
}

const nodeStyle = {
  width: 150,
  height: 50,
  padding: {
    bottom: 30,
    left: 50
  }
}

const nullGraphChildrenData: IChildren[] = [
	{
		level: 1,
		name: "",
		memo: "",
		children: [
			{
				level: 2,
				name: "",
				memo: "",
				children: [
					{
						level: 3,
						name: "",
						memo: "",
						children: [
						]
					},
				]
			},
		]
	}
]

interface IGraphNode {
  children: React.ReactNode
  activeNodeData: IActiveNodeData
  id: string
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
  editNodeHandler: {
    create: (e: React.MouseEvent<HTMLButtonElement>) => void
    delete: (e: React.MouseEvent<HTMLButtonElement>) => void
  }
}

const GraphNode = ({ children, activeNodeData, id, onClick, editNodeHandler }: IGraphNode) => {
  const [show, setShow] = useState<boolean>(false)

  const [level, ...index] = id.split('_').map((value) => parseInt(value))

  const refMenu = useRef<HTMLDivElement>(null)

  const handleShow = () => {
    setShow(!show)
  }

  const onClickOutside = (e: Event) => {
    if(refMenu.current?.contains(e.target as Node) === false) {
      setShow(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', onClickOutside, true)
    return () => {
      document.removeEventListener('click', onClickOutside, true)
    }
  })

  return (
    <div 
      ref={refMenu}
      style={{ width: nodeStyle.width, height: nodeStyle.height }}
      className={`${activeNodeData.id === id ? 'bg-neutral-200' : `${show ? "bg-gray-100" : "bg-white hover:bg-gray-100"}` } relative flex items-center border rounded p-2 drop-shadow-lg duration-300 cursor-pointer whitespace-pre`}>
      <div onClick={onClick} id={id} style={{ width: nodeStyle.width, minHeight: nodeStyle.height }} className='flex items-center justify-center whitespace-pre-line peer'>{children}</div>
      <div className={`${show ? "opacity-100 bg-gray-100" : "opacity-0"} peer-hover:opacity-100 hover:opacity-100 hover:bg-gray-100 rounded py-1 duration-200 absolute left-[105%]`} onClick={handleShow}>
        <ThreeDotsVertical size={15} className="cursor-pointer text-neutral-500"/>
      </div>
      <div className={`${show ? "opacity-100" : "opacity-0 pointer-events-none"} flex flex-col border bg-white duration-200 absolute z-50 left-[120%]`}>
        {level !== 4 ? <button className='px-5 py-2 border-b hover:bg-gray-100' onClick={(e) => { handleShow(); editNodeHandler.create(e)}} name={id}>하위 항목 추가</button> : null}
        <button className='px-5 py-2 hover:bg-gray-100' onClick={(e) => { handleShow(); editNodeHandler.delete(e)}} name={id}>해당 항목 삭제</button>
      </div>
    </div>
  )
}

const SystemArchitectureGraph = ({ id, childLength, verticalLine, lastNode, parentVertical, level1Count }: { id: string, childLength: number, verticalLine: number, lastNode: boolean, parentVertical: number, level1Count: number[] }) => {
  const refGraph = useRef<HTMLDivElement>(null)
  const [level, index] = id.split('_').map((value) => parseInt(value))

  useEffect(() => {
    let width: number, height: number, x1, y1, x2, y2

    const strokeWidth = 2

    // verticalLine === 0 : 왼쪽 세로선 ( 상위 => 하위 )
    // children === 0 : 뻗는 선 없음
    // clidren > 1 && verticalLine > 0 : 중간 가로선 + 중간 세로선
    // chldren === 1 && verticalLine > 0 : 중간 세로선

    if(childLength > 1 && verticalLine) { // 중앙 세로 선
      const nodeSize = nodeStyle.width + nodeStyle.padding.left
      
      width = level === 1 ? level1Count.reduce((acc, cur) => acc + cur, 0) * nodeSize : level1Count.length * nodeSize
      height = nodeStyle.height / 2
      x1 = '50%'
      y1 = 0
      x2 = '50%'
      y2 = height / 2
    }
    else if(childLength === 1 && verticalLine) { // 중앙 세로선     
      width = nodeStyle.width
      height = nodeStyle.height / 2
      x1 = nodeStyle.width / 2
      y1 = 0
      x2 = nodeStyle.width / 2
      y2 = height
    }
    else if(childLength === 0 && verticalLine === 0 && parentVertical === 0 && level !== 1){ // 왼쪽 세로선 : 4Level
      width = nodeStyle.padding.left
      height = nodeStyle.height + nodeStyle.height / 2
      x1 = nodeStyle.padding.left / 2 + nodeStyle.padding.left / 4
      y1 = 0
      x2 = nodeStyle.padding.left / 2 + nodeStyle.padding.left / 4
      y2 = lastNode ? (height - nodeStyle.height / 2) : height
    }
    else {
      width = 0
      height = 0
      x1 = 0
      y1 = 0
      x2 = 0
      y2 = 0
    }

    const svg = d3
      .select(refGraph.current)
      .html('')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    svg
      .append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth)

      if(childLength > 1 && verticalLine) { // 중간 가로선        
        const nodeSize = nodeStyle.width + nodeStyle.padding.left
        const x1 = level === 1 ? (level1Count[0] * nodeSize) / 2 : nodeSize / 2
        
        const x2 = level === 1 ? width - ((level1Count[level1Count.length - 1] * nodeSize)/2) : width - (nodeSize / 2)
        svg
          .append('line')
          .attr('x1', x1)
          .attr('y1', height / 2)
          .attr('x2', x2)
          .attr('y2', height / 2)
          .attr('stroke', 'black')
          .attr('stroke-width', strokeWidth)


          // 하위 요소의 상단 세로선
          level1Count.map((count, i) => {
            const countHap = level1Count.slice(0, i).reduce((acc, cur) => acc + cur, 0)
            
            const x = level === 1 ? (countHap * nodeSize) + (count * nodeSize) / 2 : (nodeSize * i) + (nodeSize / 2)
             
            svg
            .append('line')
            .attr('x1', x)
            .attr('y1', height / 2)
            .attr('x2', x)
            .attr('y2', height)
            .attr('stroke', 'black')
            .attr('stroke-width', strokeWidth)
          })
      }
      else if(childLength < 1) { // 하위 노드가 없을 때
        svg
          .append('line')
          .attr('x1', nodeStyle.padding.left / 2 + nodeStyle.padding.left / 4)
          .attr('y1', height - nodeStyle.height / 2)
          .attr('x2', nodeStyle.padding.left)
          .attr('y2', height - nodeStyle.height / 2)
          .attr('stroke', 'black')
          .attr('stroke-width', strokeWidth)
      }
      

  }, [id, childLength, verticalLine, lastNode, parentVertical, level1Count])

  return <div ref={refGraph} />
}

const DashboardSystemArchitecture = () => {
	const project = useSelector((state: RootState) => state.project).project

  // 이미지 이리보기 정보를 저장하는 FakePath State 입니다.
  const [previewImageSrc, setPreviewImageSrc] = useState<{
    src: string
    name: string
    size: number
  }>({ src: '', name: '', size: 0 })

  // 체계구조 그래프 정보 State
  const [graphChildrenData, setGraphChildrenData] = useState<IChildren[]>(nullGraphChildrenData)

  useEffect(() => {
		getGraphData()
  }, [])

  // 선택한 체계 구조 정보 State
  const [activeNodeData, setActiveNodeData] = useState<IActiveNodeData> ({
    id: '',
    name: '',
    memo: ''
  })

	// 1. 백엔드에서 데이터 받아와서 ( nullGraphChildrenData ) 에 넣기
	const getGraphData = async () => {
		const project_id = project.project_id
		const res = await GetSystemAarchitectureGraph(project_id)
		if(res && res.data.length != 0) {
			setGraphChildrenData(res.data)
		}
		else {
			setGraphChildrenData(nullGraphChildrenData)
		}
	}
	// 2. 저장 버튼 클릭 시에 백엔드로 보내주기 
  const submitSaveHandler = async () => {
		const project_id = project.project_id
    
    Swal.fire({
      icon: 'question',
      title: '현재 적용된 체계 구조를 저장하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
    })
    .then( async (res) => {
      if(res.isConfirmed) {
        const res = await SaveSystemAarchitectureGraph(project_id, graphChildrenData)    

        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: '체계 구조 저장 완료',
            showConfirmButton: false,
            timer: 1500,
          })
        }
        else {
          Swal.fire({
            icon: 'error',
            title: '체계 구조 저장 실패',
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }
    })
  }

  // 실제 파일을 이미보기로 만들어주는 함수입니다.
  const onChangeFile = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreviewImageSrc({
        src: reader.result as string,
        name: file.name,
        size: file.size,
      })
    }
  }

  // 선택 된 이미지를 미리보기로 만들어주는 함수입니다.
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const imageEvent = e.target.files ? e.target.files[0] : null
    if (imageEvent === null) return

    onChangeFile(imageEvent)
  }

  ////////////// seotjuu //////////////
  const [tab, setTab] = useState<'images' | 'diagram'>('diagram')
  const [show, setShow] = useState<boolean>(false)

  const handleTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTab(e.currentTarget.name as 'images' | 'diagram')
  }

  // sidebar show/hide
  const handleShow = () => {
    setShow(!show)
  }

  const upadateNode = (data: IChildren[], id: string): IChildren[] => {
    return data.map((node) => {
      if (node === findLevelNode(id)) {
        return {
          ...node,
          name: activeNodeData.name,
          memo: activeNodeData.memo,
        };
      } else if (node.children.length > 0) {
        return {
          ...node,
          children: upadateNode(node.children, id),
        };
      } else {
        return node;
      }
    });
  };

  // 입력받은 id의 노드를 찾는 함수입니다.
  const findLevelNode = (id: string) => {
    const [level, ...index] = id.split('_').map((value) => parseInt(value))

    switch(level) {
      case 1:
        return graphChildrenData[index[0]]
      case 2:
        return graphChildrenData[index[0]].children[index[1]]
      case 3:
        return graphChildrenData[index[0]].children[index[1]].children[index[2]]
      default:
        return graphChildrenData[index[0]].children[index[1]].children[index[2]].children[index[3]]
    }
  }

  // 항목 선택 함수입니다.
  const onClickNodeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.id
    
    const targetNode = findLevelNode(id)
    if(id === activeNodeData.id) {
      setActiveNodeData({
        id: '',
        name: '',
        memo: '',
      })

      setShow(false)
    }
    else {
      setActiveNodeData({
        id: id,
        name: targetNode!.name,
        memo: targetNode!.memo,
      })
  
      setShow(true)
    }
  }

  // 사이드바 이름, 메모 onChange 함수입니다.
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target

    setActiveNodeData({
      ...activeNodeData,
      [name]: value,
    })
  }
  
  // 항목 수정 함수입니다.
  const updateNodeHandler = () => {
    try {     
      setGraphChildrenData(upadateNode(graphChildrenData, activeNodeData.id))
      handleShow()

      Swal.fire({
        icon: 'success',
        title: '구성항목이 수정되었습니다.',
        showConfirmButton: false,
        timer: 1500,
      })
    }
    catch(e) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: '구성항목 수정에 실패하였습니다.',
      })
      console.log(e)
    }
  }

  // 최상위 일때 동일 항목 추가 함수입니다.
  const parentCreateNodeHandler = () => {
    try {      
      const hasEmptyName = (data: IChildren[]) => {
        for (let obj of data) {
          if (checkName(obj)) {
            return true;
          }
        }
        return false;
      }
      
      const checkName = (obj: IChildren) => {
        if (obj.name === "") {
          return true;
        }
      
        if (Array.isArray(obj.children)) {
          for (let child of obj.children) {
            if (checkName(child)) {
              return true; 
            }
          }
        }

        return false;
      }

      if(hasEmptyName(graphChildrenData)) {
        Swal.fire({
          icon: 'info',
          title: '비어있는 구성항목이 존재합니다.',
          text: '구성항목을 모두 채워주세요.',
        })

        return 
      }

      setGraphChildrenData((prev) =>
        {
          const newData = prev
          newData.push(...nullGraphChildrenData)          

          return newData
        } 
      )

      setActiveNodeData({
        id: '',
        name: '',
        memo: '',
      })
    }
    catch(e) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: '구성항목 추가에 실패하였습니다.',
      })
      console.log(e)
    }
  }

  // 현재 항목의 하위 항목 추가 함수입니다.
  const createNodeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const id = e.currentTarget.name

      const createNode = (data: IChildren[], id: string): IChildren[] => {
        return data.map((node) => {
          if (node === findLevelNode(id)) {
            return {
              ...node,
              children: node.children.concat({
                level: node.level + 1,
                name: '',
                memo: '',
                children: [],
              }),
            };
          } else if (node.children.length > 0) {
            return {
              ...node,
              children: createNode(node.children, id),
            };
          } else {
            return node;
          }
        });
      };

      let newData = createNode(graphChildrenData, id);
      
      setGraphChildrenData(newData)
    }
    catch(e) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: '구성항목 추가에 실패하였습니다.',
      })
      console.log(e)
    }
  }

  // 항목 삭제 함수입니다.
  const deleteNodeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.name
    
    const deleteNode = findLevelNode(id)

    const filterNodes = (node: IChildren): IChildren | null => {
      if (node === deleteNode) return null;
      
      return {
        ...node,
        children: node.children
          .map(filterNodes)
          .filter((child): child is IChildren => child !== null)
      };
    };
    
    const returnData: IChildren[] = graphChildrenData
      .map(filterNodes)
      .filter((st): st is IChildren => st !== null);             
    
    if(returnData.length === 0) {
      setGraphChildrenData(nullGraphChildrenData)
    }
    else {
      setGraphChildrenData(returnData)
    }          

    setShow(false)
    setActiveNodeData({
      id: '',
      name: '',
      memo: '',
    })
  }

  const editNodeHandler = { create: createNodeHandler, delete: deleteNodeHandler }

 
  // 체계 구조 그래프 노드 생성 재귀 함수
  const getNodeGraphNode = (children: IChildren[]) => {
    const nodeCSS = (vertical: number) => {
      if(vertical > 0) { // 하위 노드 1개 이상
        return "flex flex-col-reverse items-center relative"
      }
      return "flex justify-center items-end"
    }

    const childrenCSS = (vertical: number): React.CSSProperties => {      
      if(vertical > 0 ) {
        return { display: "flex" }
      }
      return {
      }
    }

    // 현재 노드의 상위 노드 인덱스 찾는 함수
    const findParentIndex = (level: number, node: IChildren, index: number) => {
      let index_st = 0
      let index_nd = 0
      let index_rd = 0

      switch(level) {
        case 1:
          return `${level}_${index}`
        case 2:
          graphChildrenData.map((st, i_st) => {
            st.children.map((nd, i_nd) => {
              if(nd === node) {
                index_st = i_st
              }
            })            
          })
          return `${level}_${index_st}_${index}`
        case 3:
          graphChildrenData.map((st, i_st) => {
            st.children.map((nd, i_nd) => {
              nd.children.map((rd, i_rd) => {
                if(rd === node) {
                  index_st = i_st
                  index_nd = i_nd
                }
              })
            })            
          })
          return `${level}_${index_st}_${index_nd}_${index}`
        case 4:
          graphChildrenData.map((st, i_st) => {
            st.children.map((nd, i_nd) => {
              nd.children.map((rd, i_rd) => {
                rd.children.map((th, i_th) => {
                  if(th === node) {
                    index_st = i_st
                    index_nd = i_nd
                    index_rd = i_rd
                  }
                })
              })
            })            
          })
          return `${level}_${index_st}_${index_nd}_${index_rd}_${index}`
        default:
          return ''
      }
    }

    return children.map((node, index) => {
      const id = findParentIndex(node.level, node, index)
      const childCount = node.children.length
      const zIndex = -index + node.level + 100
      const parentVertical = children.filter((child) => child.children.length > 0).length
      const vertical = node.children.filter((child) => child.children.length > 0).length     
      const lastNode = children.length - 1 === index
      const level1Count = node.children.map((d, i) => {
        const countZero = d.children.map((c) => c.children.length).filter((c) => c === 0).length
        if(node.level === 1 && countZero === d.children.length) {
          return 1
        }
        else {
          return d.children.length
        }
      })

      return (
        <div key={id} className={`flex flex-col relative `} style={{ zIndex: zIndex }}>
          <div style={{ zIndex: zIndex, padding: childCount === 0 && parentVertical ? `0 ${nodeStyle.padding.left/2}px` : "" }} className={`${nodeCSS(vertical)}`}> 
            <div style={{ width: node.level === 4 ? `${nodeStyle.padding.left}px` : "" }}>
              <SystemArchitectureGraph id={id} childLength={childCount} verticalLine={vertical} lastNode={lastNode} parentVertical={parentVertical} level1Count={level1Count}/>
            </div>
            <GraphNode
              activeNodeData={activeNodeData}
              id={id}
              onClick={onClickNodeHandler}
              editNodeHandler={editNodeHandler}
            >
              {node.name}
            </GraphNode>
          </div>
          {childCount > 0 ?
            <div style={childrenCSS(vertical)} id={id} className='relative'>
              {getNodeGraphNode(node.children)}
            </div>
            :
            null
          }
        </div>
      )
    })
  }

  useEffect(() => {
    if(graphChildrenData.length === 0) {
      
    }
  }, [graphChildrenData])

  return (
    <div className="flex flex-col w-full">
      <div className='flex justify-between w-full'>
        <div className="flex">
          <Button variant="unset" name="diagram" onClick={handleTab}>
            <Diagram2
              size={30}
              className={`${tab === 'diagram' ? 'text-blue-400' : ''}`}
            />
          </Button>
					{/*
          <Button variant="unset" name="images" onClick={handleTab}>
            <Images size={25} className={`${tab === 'images' ? 'text-blue-400' : ''}`} />
          </Button>
					*/}
        </div>
        {
          tab === 'diagram' ?
            <div className='flex gap-2'>
              <div><Button onClick={submitSaveHandler}>저장</Button></div>
              <div><Button onClick={parentCreateNodeHandler}>새 구조도 추가</Button></div>
            </div>
          :
            null
        }
      </div>
      

      <div className='w-full h-full'>
        {tab === 'images' ? (
          previewImageSrc.src ? (
            <img src={previewImageSrc.src} alt={previewImageSrc.name} />
          ) : (
            <div className="w-full">
              <label
                htmlFor="upload_image"
                className="flex items-center justify-center w-full h-[14vh] p-2 border-dotted border-2 border-gray-400">
                <p>이미지 업로드</p>
              </label>
              <div className="flex items-center justify-end w-full mt-4 gap-2">
                <Button variant="primary">
                  <input
                    type="file"
                    id="upload_image"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept='image/*'
                  />
                  <label htmlFor="upload_image" className="cursor-pointer">
                    이미지 업로드
                  </label>
                </Button>
                <Button variant="primary">저장</Button>
              </div>
            </div>
          )
        ) : (
          <div className="w-full h-full flex bg-white max-h-[700px] overflow-hidden">
            <DragZoomContainer className='flex p-14'>
              {
                getNodeGraphNode(graphChildrenData)
              }
            </DragZoomContainer>
            {activeNodeData.id === '' ? null : (
              <div className="sticky top-0 z-10 flex items-center">
                {show ? (
                  <div className="absolute right-0 flex items-center h-full">
                    <button
                      className="py-10 bg-gray-100 border rounded-s"
                      onClick={handleShow}>
                      <CaretRight size={30} className="text-neutral-400" />
                    </button>
                    <div className="flex flex-col h-full bg-white border gap-2">
                      <div className="w-full p-3 me-36 whitespace-pre bg-gray-100 border-b flex items-center flex-wrap justify-between">
												<p>구성항목 편집</p>
												<Button onClick={updateNodeHandler}>수정</Button>
                      </div>
                      <div className="flex flex-col w-full p-3 gap-4">
                        <Input.InputLabel className='' label="이름" name='name' onChange={onChangeHandler} value={activeNodeData.name} placeholder="30글자 내로 작성 가능합니다." maxLength={30}/>
                        <Input.Textarea label="메모" name='memo' onChange={onChangeHandler} value={activeNodeData.memo} rows={8} className="resize-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                    <button
                      className="absolute right-0 py-10 bg-gray-100 border rounded-s"
                      onClick={handleShow}>
                      <CaretLeftFill size={30} className="text-neutral-600" />
                    </button>
                )}
              </div>
            )
            }                  
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardSystemArchitecture

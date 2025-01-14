import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import * as d3 from 'd3'
import { InfoSquareFill } from 'react-bootstrap-icons'

import Button from "tailwindElement/Button"
import Modal from "tailwindElement/Modal"

import DragZoomContainer from "components/common/graph/DragZoomContainer"

import { RequirementChildrenGroup, RequirementGroupModel, GetRequirementGroup } from "models/RequirementModel"
import { useSelector } from "react-redux"
import { RootState } from "app/store"

const NodeSize = {
  width: 150,
  height: 50,
  padding: {
    left: 50,
    top: 40,
  }
}

const RequirementTreeGroupGraph = ({id, children}: {id: string, children: number[]}) => {
  const refGraph = useRef<HTMLDivElement>(null)
  const childrenLength = children.length
  const vertical = children.reduce((acc, cur) => acc + (cur || 1), 0)

  useEffect(() => {
    const width = vertical * NodeSize.width + (vertical - 1) * NodeSize.padding.left
    const height = childrenLength > 1 ? NodeSize.padding.top / 2 : NodeSize.padding.top
    
    // TODO :: vertical children 구분하기

    const svg = d3.select(refGraph.current)
      .html("")
      .append('svg')
      .attr('width', childrenLength ? vertical * NodeSize.width + (vertical - 1) * NodeSize.padding.left : 0)
      .attr('height', NodeSize.padding.top)
      
    // 노드 하위 중앙선
    svg
      .append('line')
      .attr('x1', width / 2)
      .attr('y1', 0)
      .attr('x2', width / 2)
      .attr('y2', height)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)

    if(vertical > 1 && childrenLength > 1) {
      const startVertical = children.slice(0, 1)[0] ? children.slice(0, 1)[0] : 1
      const endVertical = children.slice(-1)[0] ? children.slice(-1)[0] : 1
      const x1 = (startVertical * NodeSize.width + (startVertical - 1) * NodeSize.padding.left) / 2
      const x2 = width - ((endVertical * NodeSize.width) + (endVertical - 1) * NodeSize.padding.left) / 2
      
      svg
        .append('line')
        .attr('x1', x1)
        .attr('y1', height)
        .attr('x2', x2)
        .attr('y2', height)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
      
      children.forEach((child, index_child) => {
        const childIndex = children.slice(0, index_child).reduce((acc, cur) => acc + (cur || 1), 0)        
        const cntWidth = (((child || 1) * NodeSize.width) + ((child || 1) - 1) * NodeSize.padding.left) / 2
        
        const x = childIndex ? (childIndex * (NodeSize.padding.left + NodeSize.width)) + cntWidth : cntWidth
        
        svg
          .append('line')
          .attr('x1', x)
          .attr('y1', height)
          .attr('x2', x)
          .attr('y2', height + NodeSize.padding.top / 2)
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
      })
        
    }

    
  }, [refGraph.current, children, id])

  return (
    <div ref={refGraph} className="absolute" style={{ height: `${NodeSize.padding.top}px`, top: `${NodeSize.height}px` }}/>
  )
}

const FieldNodeWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="relative flex flex-col items-center" style={{ gap: `${NodeSize.padding.top}px` }}>
      {children}
    </div>
  )
}

const FieldNode = ({children, id, device} : {children:React.ReactNode, id: string, device?: string }) => {
	let classNameStyle: string = ""

	switch(device) {
		case "hdev":
			classNameStyle = "bg-white"
			break
		case "fdev":
			classNameStyle = "bg-yellow-100"
			break
		case "ldev":
			classNameStyle = "bg-green-200"
			break
		default:
			classNameStyle = "bg-white"
	}


  return (
    <div style={{ width: `${NodeSize.width}px`, height: `${NodeSize.height}px` }} className={`flex items-center justify-center border rounded-lg shadow-md ${classNameStyle}`} id={id}>
      {children}
    </div>
  )
}

const ConfigurationItemStructure = () => {
	const navigate = useNavigate()
  const project = useSelector((state: RootState) => state.project).project

	const [treeRequirementFields, setTreeRequirementFields] = useState<{[key: number]: RequirementChildrenGroup}>([])

	useEffect(() => {
			getRequirementGroupHandler()
	}, [])

	// 요구사항 탐색기 그룹 정보를 가져오는 함수입니다. 
	const getRequirementGroupHandler = async (): Promise<void> => {
		const res = await GetRequirementGroup(project.project_id)
		
		if (!res.success) {
			Swal.fire({
				icon: 'error',
				title: '요구사항 탐색기 정보를 불러오는데 실패했습니다.',
				text: res.message,
			})
			navigate(-1)
			return
		}

		// success가 true이면 무조건 데이터가 존재합니다. 
		setTreeRequirementFields(() => res.data!)

		return
	}

  return (
		<div className="w-full h-[450px] bg-white">

			<Modal.Body className="p-10 h-[500px] relative">
				<div className="absolute text-sm right-5 top-9 z-[150]">
					<div className="flex group gap-2">
						<table className="hidden w-full p-1 text-center group-hover:table">
							<thead className="whitespace-nowrap">
								<tr>
									<th className="p-3">구분</th>
									<th className="p-3">식별자</th>
									<th className="p-3">구분 색상</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="p-3">컴퓨터 탑재형</td>
									<td>HDEV</td>
									<td><div className="w-32 py-4 border-2"></div></td>
								</tr>
								<tr>
									<td className="p-3">마이크로프로세서 탑재형</td>
									<td>FDEV</td>
									<td><div className="w-32 py-4 bg-yellow-100 border-2"></div></td>
								</tr>
								<tr>
									<td className="p-3">논리회로 탑재형</td>
									<td>LDEV</td>
									<td><div className="w-32 py-4 bg-green-200 border-2"></div></td>
								</tr>
							</tbody>
						</table>
						<InfoSquareFill size={16} />
					</div>
				</div>

        <DragZoomContainer className="flex justify-center" style={{ gap: `${NodeSize.padding.left}px` }}>
          <FieldNodeWrapper>
            <FieldNode id="0">{project.project_csci_name}</FieldNode>
            <RequirementTreeGroupGraph children={Object.values(treeRequirementFields).map((d) => d.child_groups.length)} id="0"/>
            <div className="flex" style={{ gap: `${NodeSize.padding.left}px` }}>
            {
              Object.values(treeRequirementFields).map((field, index_st) => {
                const children = field.child_groups.map((d) => 1) 
                const id = `${index_st}`    
                return (
                  <FieldNodeWrapper key={id}>
                    {/* CSC */}
                    <FieldNode id={id} device={field.req_group_device}>{field.group_name}</FieldNode> 
                    <RequirementTreeGroupGraph children={children} id={id}/>
                    <div className="flex" style={{ gap: `${NodeSize.padding.left}px` }}>
                    {                        
                      field.child_groups.map((data, index_nd) => {                        
                        const id = `${index_st}_${index_nd}`
                        return (
                          <FieldNodeWrapper key={id}>
                            {/* CSU */}
                            <FieldNode id={id} device={data.req_group_device_child}>{data.req_group_name_child}</FieldNode>
                          </FieldNodeWrapper>
                        )
                      })
                    }
                    </div>
                  </FieldNodeWrapper>
                )
              })
            }
            </div>
          </FieldNodeWrapper>
        </DragZoomContainer>
			</Modal.Body>
		</div>
  )
}

export default ConfigurationItemStructure

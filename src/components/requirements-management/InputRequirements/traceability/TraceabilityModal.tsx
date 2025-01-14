import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Search } from "react-bootstrap-icons";
import Input from 'tailwindElement/Input'
import Button from 'tailwindElement/Button'
import PanelContainer from 'components/common/panels/PanelContainer'
import PanelHeader from 'components/common/panels/PanelHeader'
import PanelBody from 'components/common/panels/PanelBody'
import { ITraceabilityConnectTableFields, ITraceabilityData, ITraceabilityDataRequirement } from 'constant/requirement_manage/traceabilityManagementTableFields';
import { AccessAxios } from 'models';
import Modal from 'tailwindElement/Modal';
import TraceabilityManagementGraph from './TraceabilityManamentGraph';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';

interface IProps {
  editModeState: boolean
}

interface ITraceabilityRequirementPanelData {
  [index: string] : string | number | boolean
  req_id: number
  req_number: string
  req_content: string
  trace_exist: boolean
  key: string
}

interface ITraceabilityPanelData {
  req_id: number
  req_number: string
  req_title: string
  req_content: string
  trace_parent: {
    req_id: number
    req_number: string
  }[]
  trace_child: {
    req_id: number
    req_number: string
  }[]
}

const RequirementInputElement = ({data}: {data:{ req_id: number; req_number: string }[]}) => {
  return (
    <div className='max-h-[60px] overflow-y-auto bg-gray-50 flex flex-wrap gap-2 outline-none w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:leading-6 '>
      {
        data.length ? data.map((d, idx) => (
          <div key={idx}>
            {d.req_number}
          </div>                            
        )) : "해당 없음"
      }
    </div>
  )
}

const getSearchElement = (requirementName: string) => {
  switch (requirementName) {
    case "system_requirement":
      return (
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            name="search_system_requirement"
            id="search_system_requirement"
            className="hidden peer"
          />
          <label
            htmlFor="search_system_requirement"
            className="cursor-pointer select-none">
            <Search size={13} />
          </label>
          <div
            className="absolute flex-col hidden p-2 text-center text-black border shadow-md bg-gray-50 rounded-md peer-checked:flex min-w-48">
              <Input />
          </div>
        </div>
      );
    case "sw_requirement":
      return (
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            name="search_sw_requirement"
            id="search_sw_requirement"
            className="hidden peer"
          />
          <label
            htmlFor="search_sw_requirement"
            className="cursor-pointer select-none">
            <Search size={13} />
          </label>
          <div
            className="absolute flex-col hidden p-2 text-center text-black border shadow-md bg-gray-50 rounded-md peer-checked:flex min-w-48">
              <Input />
          </div>
        </div>
      );
    case "sw_design":
      return (
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            name="search_sw_design"
            id="search_sw_design"
            className="hidden peer"
          />
          <label
            htmlFor="search_sw_design"
            className="cursor-pointer select-none">
            <Search size={13} />
          </label>
          <div
            className="absolute flex-col hidden p-2 text-center text-black border shadow-md bg-gray-50 rounded-md peer-checked:flex min-w-48">
              <Input />
          </div>
        </div>
      );
    case "sw_test":
      return (
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            name="search_sw_test"
            id="search_sw_test"
            className="hidden peer"
          />
          <label
            htmlFor="search_sw_test"
            className="cursor-pointer"
          >
            <Search size={13} />
          </label>
          <div
            className="absolute right-0 flex-col hidden p-2 text-center text-black border shadow-md bg-gray-50 rounded-md peer-checked:flex min-w-48">
              <Input />
          </div>
        </div>
      );
  }
}

const TraceabilityModal = ({ editModeState }: IProps) => {
	const project = useSelector((state: RootState) => state.project).project
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const level_header: {
    [index:string]: string
  } = {
    system_requirement: '체계 요구사항',
    sw_requirement: 'SW 요구사항',
    swdesign_requirement: 'SW 설계',
    swtest_requirement: 'SW 테스트',
  }

  // 선택한 요구사항
  const [selectedTraceabilityRequirement, setSelectedTraceabilityRequirement] = useState<ITraceabilityRequirementPanelData>({
    req_id: 0,
    req_number: '',
    req_content: '',
    trace_exist: false,
    key: ''
  })

  // 연결할 요구사항
  const [connectedTraceabilityRequirement, setConnectedTraceabilityRequirement] = useState<{
    req_id: number
    req_number: string
  }[]>([])

  const [panelSelectedData, setPanelSelectedData] = useState<ITraceabilityPanelData>({
    req_id: 0,
    req_number: '',
    req_title: '',
    req_content: '',
    trace_parent: [],
    trace_child: []
  })

  // 연결할 요구사항 목록 중에 선택한 데이터
  const [panelConnectedData, setPanelConnectedData] = useState<ITraceabilityPanelData>({
    req_id: 0,
    req_number: '',
    req_title: '',
    req_content: '',
    trace_parent: [],
    trace_child: []
  })
  
  // 삭제할 데이터
  const [selectChildData, setSelectChildData] = useState<{
    req_id: number
    trace_manag_code: number 
  }[]>([])

  const clickTraceabilityConnectionHandler = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const level_list = ["system_requirement", "sw_requirement", "swdesign_requirement", "swtest_requirement"]
    const [key, req_id] = e.currentTarget.id.split('-')
    const data = traceabilityConnectTableFieldData[key].find((d) => d.req_id === parseInt(req_id))
    
    // 현재 선택한 요구사항의 레벨
    const current_level = level_list.indexOf(selectedTraceabilityRequirement.key) + 1
    const selected_level = level_list.indexOf(key) + 1
    
    if(data) {
      // 선택한 요구사항이 없을 때
      if(selectedTraceabilityRequirement.req_number === '') { 
        if(selected_level === 4) {
          Swal.fire({
            icon: 'error',
            title: '요구사항 선택 오류',
            text: '하위 요구사항이 없는 요구사항은 선택할 수 없습니다.'
          })
          return
        }
        else {
          setSelectedTraceabilityRequirement({
            req_id: parseInt(req_id),
            req_number: data.req_number,
            req_content: data.req_content,
            trace_exist: data.trace_exist,
            key: key
          });

          activeTraceabilityClickHandler(e);
        }
      }
      else if(selectedTraceabilityRequirement.req_id === parseInt(req_id)) {
        setSelectedTraceabilityRequirement({
          req_id: 0,
          req_number: '',
          req_content: '',
          trace_exist: false,
          key: ''
        });
        setConnectedTraceabilityRequirement([])
        activeTraceabilityClickHandler("");
      }

      // 선택한 요구사항이 같은 레벨일 때
      else if(selectedTraceabilityRequirement.key === key){
        setSelectedTraceabilityRequirement({
          req_id: parseInt(req_id),
          req_number: data.req_number,
          req_content: data.req_content,
          trace_exist: data.trace_exist,
          key: key
        });

        setConnectedTraceabilityRequirement([])
        activeTraceabilityClickHandler(e);
      }
      // 선택한 요구사항이 있지만 그의 하위 레벨일 때
      else if(selectedTraceabilityRequirement.key !== key && (current_level + 1) === selected_level) {
        if(connectedTraceabilityRequirement.find((d) => d.req_id === parseInt(req_id))) {
          setConnectedTraceabilityRequirement(connectedTraceabilityRequirement.filter((d) => d.req_id !== parseInt(req_id)))
        }
        else {
          setConnectedTraceabilityRequirement([...connectedTraceabilityRequirement, {
            req_id: data.req_id,
            req_number: data.req_number,
          }])
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: '요구사항 선택 오류',
          text: '선택한 요구사항의 하위 요구사항만 선택할 수 있습니다.'
        })
      }
    } 
  }

  const submitTraceabilityConnectionHandler = async () => {
    try {
      const deleteID = selectChildData.map((d) => d.req_id).filter((d) => !connectedTraceabilityRequirement.map((d) => d.req_id).includes(d))
      if(selectedTraceabilityRequirement.req_id === 0) {
        Swal.fire({
          icon: 'error',
          title: '추적성 연결하기 실패',
          text: '선택한 요구사항이 없습니다. 요구사항을 선택해주세요.'
        })
        return
      }

      await AccessAxios.put('/traceability/connect/', {
        req_id_parent: selectedTraceabilityRequirement.req_id,
        req_id_child: connectedTraceabilityRequirement.map((d) => d.req_id),
        trace_code_del: deleteID.map((d) => selectChildData.find((s) => s.req_id === d)?.trace_manag_code) || []
      }).then((res) => {
        Swal.fire({
          icon: 'success',
          title: '추적성 연결에 성공하였습니다.',
        })

        setSelectedTraceabilityRequirement({
          req_id: 0,
          req_number: '',
          req_content: '',
          trace_exist: false,
          key: ''
        })
        setConnectedTraceabilityRequirement([])
        setPanelSelectedData({
          req_id: 0,
          req_number: '',
          req_title: '',
          req_content: '',
          trace_parent: [],
          trace_child: []
        })
        setPanelConnectedData({
          req_id: 0,
          req_number: '',
          req_title: '',
          req_content: '',
          trace_parent: [],
          trace_child: []
        })

        getTraceabilityContentData()
      })
    }
    catch(e: any) {
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '추적성 연결을 실패했습니다.',
      })
    }    
  }

  // panel data handling
  const postTraceabilityConnectionHandler = async (req_id: number) => {
    try {
      await AccessAxios.post('/traceability/connect/', {
        req_id: req_id
      })
      .then((res) => {
        const data = res.data.data

        // parent
        if(selectedTraceabilityRequirement.req_id === req_id) {
          setPanelSelectedData({
            req_id: data.req_id,
            req_number: data.req_number,
            req_title: data.req_title,
            req_content: data.req_content,
            trace_parent: data.trace_parent.map((d:any) => ({
              req_id: d.req_id_parent,
              req_number: d.req_number_parent
            })),
            trace_child: data.trace_child.map((d:any) => ({
              req_id: d.req_id_child,
              req_number: d.req_number_child
            }))
          })
          if(data.trace_child.length) {
            setSelectChildData(data.trace_child.map((d: any) => ({
              req_id: d.req_id_child,
              trace_manag_code: d.trace_manag_code
            })))

            data.trace_child.map((d: any) => {
              postTraceabilityConnectionHandler(d.req_id_child)
            })            
          }
        }
        else { // child
          setPanelConnectedData({
            req_id: data.req_id,
            req_number: data.req_number,
            req_title: data.req_title,
            req_content: data.req_content,
            trace_parent: data.trace_parent.map((d:any) => ({
              req_id: d.req_id_parent,
              req_number: d.req_number_parent
            })),
            trace_child: data.trace_child.map((d:any) => ({
              req_id: d.req_id_child,
              req_number: d.req_number_child
            }))
          })

          if(!connectedTraceabilityRequirement.find((d) => d.req_id === data.req_id)) {
            setConnectedTraceabilityRequirement((prev) => (
              [
                ...prev,
                {
                  req_id: data.req_id,
                  req_number: data.req_number
                }
              ]
            ))
          }
        }
      })
    }
    catch(e:any){
      console.log(e.message);
      
      Swal.fire({
        icon: 'error',
        title: '추적성 연결 데이터 조회 실패',
        text: '추적성 연결 데이터 조회를 실패했습니다.'
      })
    }
  }

  useEffect(() => {
    if(selectedTraceabilityRequirement.req_id) {
      postTraceabilityConnectionHandler(selectedTraceabilityRequirement.req_id);
    }
    setSelectChildData([])

  }, [selectedTraceabilityRequirement])

  useEffect(() => {
    if(connectedTraceabilityRequirement.length){
      postTraceabilityConnectionHandler(connectedTraceabilityRequirement[connectedTraceabilityRequirement.length - 1].req_id);
    }
  }, [connectedTraceabilityRequirement])

    // 추적성 관리 요구사항 데이터
  const [traceabilityData, setTrceabilityData] = useState<ITraceabilityData>({
		system_requirement: [],
		sw_requirement: [],
		swdesign_requirement: [],
		swtest_requirement: []
  })

  const [activeTraceabilityData, setActiveTraceabilityData] =
    useState<ITraceabilityDataRequirement>({
			req_id: 0,
			req_content: "",
			req_number: "",
			children: []
    })

  const activeTraceabilityClickHandler = (e: React.MouseEvent<HTMLTableCellElement> | "") => {
		if(e) {
			const [key, id] = e.currentTarget.id.split('-')
			const data = traceabilityData[key].find(data => data.req_id === Number(id))
	
			if(data) {
				setActiveTraceabilityData(data)
			}
		}
		else {
			setActiveTraceabilityData({
				req_id: 0,
				req_content: "",
				req_number: "",
				children: []
			})
		}

    // 선택시 하단으로 스크롤 이동
    // const scrollHeight = document.getElementsByTagName('html')[0].scrollHeight
    // window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
  }

	const postTraceabilityGraphData = async () => {
		try {
			await AccessAxios.post(`/traceability/export/`, {
				project_id: project.project_id,
			})
			.then(res => {
				setTrceabilityData(res.data.data)

				setActiveTraceabilityData({
					req_id: 0,
					req_content: "",
					req_number: "",
					children: []
				})
			})
		}
		catch(error: any) {
			console.log(error.message);
			
			Swal.fire({
				icon: 'error',
				title: '데이터 에러',
				text: '추적성 그래프 데이터를 가져오는데 실패했습니다.',
			})
		}
	}

  const [traceabilityModalState, setTraceabilityModalState] = useState<boolean>(false)
	const [traceabilityConnectTableFieldData, setTraceabilityConnectTableFieldData] = useState<ITraceabilityConnectTableFields>({
		sw_requirement: [],
		swdesign_requirement: [],
		swtest_requirement: [],
		system_requirement: [],
	})

	const [activeData, setActiveData] = useState<ITraceabilityData>({
    system_requirement: [],
    sw_requirement: [],
    swdesign_requirement: [],
    swtest_requirement: [],
  })

	const getTraceabilityContentData = async () => {
		try {
			// TODO : Proejct Baseline 수정 후 Proejct 동적으로 변경
			const res = await AccessAxios.get(`/traceability/connect/?project_id=${project.project_id}`)
      
			setTraceabilityConnectTableFieldData(res.data.data)
			postTraceabilityGraphData()
		}
		catch(error) {
			Swal.fire({
				icon: 'error',
				title: '데이터 에러',
				text: '추적성 연결하기 테이블 데이터를 가져오는데 실패했습니다.',
			})
		}
	}

	// 선택한 Node와 관련 있는 데이터 추출
	const getActiveNodeDataHandler = (id: number, key: string) => {
		// stage
		const stgArr = Object.keys(activeData)

		// 반환 데이터
		let data: ITraceabilityData = {
			system_requirement: [],
			sw_requirement: [],
			swdesign_requirement: [],
			swtest_requirement: [],
		}

		// 현재 stage index
		const stgIdx = stgArr.indexOf(key)

		let prevIdx = stgIdx - 1 // 이전 stage index
		let nextIdx = stgIdx + 1 // 다음 stage index

		// 선택한 stage의 데이터 추가
		data[key] = traceabilityData[key].filter(data => data.req_id === id)

		// 선택한 stage의 상위 Children 데이터 추출
		Array(stgIdx)
			.fill(true)
			.map(_ => {
				// 상위 stage가 존재할 경우
				if (prevIdx >= 0) {
					// 반복문의 현재 stage key
					const stgKey = stgArr[prevIdx + 1]

					// 상위 stage의 children값
					const prevChildren = traceabilityData[stgArr[prevIdx]].filter(d =>
						d.children.find(child => data[stgKey].map(d => d.req_id).includes(child)),
					)

					// 상위 stage의 children값을 data에 추가
					data[stgArr[prevIdx]] = [...data[stgArr[prevIdx]], ...prevChildren]

					// 이전 stage로 이동
					prevIdx = prevIdx - 1
				}
			})

		// 선택한 stage의 하위 Children 데이터 추출
		Array(stgArr.length - (stgIdx + 1))
			.fill(true)
			.map(_ => {
				// 하위 stage가 존재할 경우
				if (nextIdx <= stgArr.length - 1) {
					// 반복문의 현재 stage key
					const stgKey = stgArr[nextIdx - 1]

					// 하위 stage의 children값
					const nextChildren = data[stgKey]
						.map(d => d.children)
						.map(childrenId =>
							traceabilityData[stgArr[nextIdx]].filter(d => childrenId.includes(d.req_id)),
						)

					// 하위 stage의 children값을 data에 추가
					nextChildren.map(children => {
						data[stgArr[nextIdx]] = [...data[stgArr[nextIdx]], ...children]
					})

					// 다음 stage로 이동
					nextIdx = nextIdx + 1
				}
			})

		// 리턴 데이터 중복 제거 및 정렬
		stgArr.map(key => {
			data[key] = data[key]
				.filter((v, i, a) => a.findIndex(t => t.req_id === v.req_id) === i)
				.sort((a, b) => a.req_id - b.req_id)
		})

		return data
	}

  useEffect(() => {
    if (activeTraceabilityData.req_id) {
      // 선택된 데이터의 단계
      // 현재 데이터의 Key
      const activeKey = Object.keys(traceabilityData).filter(key =>
        traceabilityData[key].some(data => data.req_id === activeTraceabilityData.req_id),
      )[0]

      const data = getActiveNodeDataHandler(activeTraceabilityData.req_id, activeKey)

      setActiveData(data)
    }
		else {
			setActiveData({
				system_requirement: [],
				sw_requirement: [],
				swdesign_requirement: [],
				swtest_requirement: [],
			})
		}
  }, [activeTraceabilityData, traceabilityData])

  const traceabilityModalStateHandle = async () => {   
    if(!editModeState) {
      return
    }

    setIsOpen(!isOpen)

    setTraceabilityModalState(prev => !prev)

		setActiveTraceabilityData({
			req_id: 0,
			req_content: "",
			req_number: "",
			children: []
		})

    setSelectedTraceabilityRequirement({
      req_id: 0,
      req_number: '',
      req_content: '',
      trace_exist: false,
      key: ''
    })

    setConnectedTraceabilityRequirement([])
  }

  useEffect(() => {
    if(isOpen) {
      getTraceabilityContentData()
      postTraceabilityGraphData()
    }
  }, [isOpen])  

  return (
    <div>
      <Button onClick={traceabilityModalStateHandle}>추적성 연결하기</Button>
      <Modal isOpen={isOpen} size="xl">
        <Modal.Head>추적성 연결하기</Modal.Head>
        <Modal.Body>
          <div className="w-full h-full">
            <div className="flex justify-between items-center w-full mb-2 gap-3">
              <div className='flex gap-2'>
                <Button variant="primary" onClick={submitTraceabilityConnectionHandler}>
                  추적성 연결하기
                </Button>
                <TraceabilityManagementGraph
                  activeTraceabilityData={activeTraceabilityData}
                  activeData={activeData}
                />
              </div>
              <Button onClick={traceabilityModalStateHandle}>
                닫기
              </Button>
            </div>
            {/* Table */}
            <div className="overflow-y-auto max-h-96">
              <table className="w-full h-full border">
                <thead className="sticky top-0 bg-gray-200 border-2">
                  <tr>
                    <th className="relative p-2 text-center border">
                    체계 요구사항
                      { getSearchElement("system_requirement") }
                    </th>
                    <th className="relative p-2 text-center border">
                    SW 요구사항
                      { getSearchElement("sw_requirement") }
                    </th>
                    <th className="relative p-2 text-center border">
                    SW 설계
                      { getSearchElement("sw_design") }
                    </th>
                    <th className="relative p-2 text-center border">
                    SW 테스트
                      { getSearchElement("sw_test") }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    new Array(Math.max(...Object.values(traceabilityConnectTableFieldData).map((d) => d.length))).fill(true).map((_, index_st) => (
                      <tr key={index_st} className='text-center border cursor-pointer'>
                        {
                          ["system_requirement", "sw_requirement", "swdesign_requirement", "swtest_requirement"].map((key, index_nd) => {
                            const level_keys = Object.keys(level_header)
                            const selected_find_index = level_keys.findIndex((d) => d === selectedTraceabilityRequirement.key)       
                            return (
                              traceabilityConnectTableFieldData[key][index_st] ? 
                              <td
                              key={index_nd} 
                              onClick={clickTraceabilityConnectionHandler}
                              className={`p-2 border w-[25%]
                                  ${
                                    // 선택한 요구사항
                                    selectedTraceabilityRequirement.req_id === traceabilityConnectTableFieldData[key][index_st].req_id ? "bg-lime-200"
                                    // 현재 Children 이면서 선택했을 경우
                                    :connectedTraceabilityRequirement.find((d) => d.req_id === traceabilityConnectTableFieldData[key][index_st].req_id) && activeData[key].find((d) => d.req_id === traceabilityConnectTableFieldData[key][index_st].req_id) ? "bg-gradient-to-r from-yellow-100 to-sky-200"
                                    // 연결할 요구사항
                                    : connectedTraceabilityRequirement.find((d) => d.req_id === traceabilityConnectTableFieldData[key][index_st].req_id) ? "bg-yellow-100"
                                      // 연결된 요구사항을 해제했을 경우
                                      :  level_keys[selected_find_index + 1] === level_keys[index_nd] && traceabilityConnectTableFieldData[key][index_st].trace_exist ? "bg-white"
                                        // 선택한 요구사항과 연결된 요구사항
                                        : activeData[key].find((d) => d.req_id === traceabilityConnectTableFieldData[key][index_st].req_id) ? "bg-sky-200"
                                          // 추적성 연결이 되지 않은 요구사항
                                          : traceabilityConnectTableFieldData[key][index_st].trace_exist === false  ? "text-red-500" : ""
                                  }
                                `}
                              id={`${key}-${traceabilityConnectTableFieldData[key][index_st].req_id}`}
                            >
                              {traceabilityConnectTableFieldData[key][index_st].req_number}
                            </td>
                            : 
                            <td key={index_nd} className='p-2 border'>
                            </td>
                          )
                          })
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Notifications */}
            <div className="flex flex-wrap items-center w-full py-1 my-2 gap-10">
              <span className="text-gray-500">범례</span>
              <div className="flex items-center gap-4">
                <div className="h-6 w-28 bg-lime-200"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 bg-yellow-100 w-28"></div>
                <span>Children</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-28 bg-sky-200"></div>
                <span>Linked</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-28 bg-gradient-to-r from-yellow-100 to-sky-200"></div>
                <span>Children + Linked</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-28 text-red-500 text-center">빨간색 글씨</div>
                <span>Unlinked</span>
              </div>
            </div>

            {/* selected/connect requiremnts */}
            <div className="flex flex-wrap items-start justify-center w-full gap-2">
              { selectedTraceabilityRequirement && selectedTraceabilityRequirement.req_number && (
                <PanelContainer className="w-full md:flex-1">
                  <PanelHeader title={`선택한 요구사항  ( ${level_header[selectedTraceabilityRequirement.key]} )`} />
                  <PanelBody>
                    <Button variant="primary" className="cursor-default">
                      {selectedTraceabilityRequirement.req_number}
                    </Button>
                    <div className="flex flex-col w-full mt-3 gap-2">
                      <div className="flex items-center w-full">
                        <div className="w-1/4">요구사항 식별자</div>
                        <Input
                          value={selectedTraceabilityRequirement.req_number || ''}
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div className="flex items-center w-full">
                        <div className="w-1/4">요구사항 제목</div>
                        <Input
                          value={panelSelectedData.req_title || ''}
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div className="flex items-center w-full">
                        <div className="w-1/4">요구사항 내용</div>
                        <Input
                          value={panelSelectedData.req_content || ''}
                          disabled
                        />
                      </div>
                      <div className="flex items-start w-full">
                        <div className="w-1/4">연결한 요구사항</div>
                        <div className="w-full">
                          <div className="flex items-center w-full">
                            <div className="w-1/4">Parents</div>
                            <RequirementInputElement data={panelSelectedData.trace_parent}/>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="w-1/4">Children</div>
                            <RequirementInputElement data={panelSelectedData.trace_child}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PanelBody>
                </PanelContainer>
              )}
              
              {
                selectedTraceabilityRequirement && connectedTraceabilityRequirement.length ? (
                <PanelContainer className="w-full md:flex-1">
                  <PanelHeader title={`선택한 요구사항의 Children  ( ${Object.values(level_header)[Object.keys(level_header).indexOf(selectedTraceabilityRequirement.key) + 1]} )`} />
                  <PanelBody>
                    <div className="flex flex-wrap items-center w-full gap-2">
                      {connectedTraceabilityRequirement.map(
                        (connectedSwRequirement, index) => (
                          <Button
                            variant={
                              panelConnectedData.req_id ===
                              connectedSwRequirement.req_id
                                ? 'primary'
                                : 'secondary'
                            }
                            id={connectedSwRequirement.req_id.toString()}
                            onClick={() => {
                              postTraceabilityConnectionHandler(connectedSwRequirement.req_id)
                            }}
                            key={index}>
                            {connectedSwRequirement.req_number}
                          </Button>
                        ),
                      )}
                    </div>
                    <div className="flex flex-col w-full mt-3 gap-2">
                      <div className="flex items-center w-full">
                        <div className="w-1/4">요구사항 식별자</div>
                        <Input
                          value={panelConnectedData.req_number || '' }
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div className="flex items-center w-full">
                        <div className="w-1/4">요구사항 제목</div>
                        <Input
                          value={panelConnectedData.req_title || '' }
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div className="flex items-center w-full">
                        <div className="w-1/4">요구사항 내용</div>
                        <Input
                          value={panelConnectedData.req_content || '' }
                          disabled
                        />
                      </div>
                      <div className="flex items-start w-full">
                        <div className="w-1/4">연결한 요구사항</div>
                        <div className="w-full">
                          <div className="flex items-center w-full">
                            <div className="w-1/4">Parents</div>
                            <RequirementInputElement data={panelConnectedData.trace_parent}/>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="w-1/4">Children</div>
                            <RequirementInputElement data={panelConnectedData.trace_child}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PanelBody>
                </PanelContainer>
                )
                :
                <></>
              }
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default TraceabilityModal

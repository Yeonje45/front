import React, { createContext, useContext, useReducer, Dispatch } from 'react'

export type selectGroupField = {
	selected: string
	absPath: string
	code: string  // 요구사항 ID
}

export type fieldState  = {
	selected: string
	absPath: string
	code: string  // 요구사항 ID

	// select box Group 정보
	group_id: string
	group_name: string
}

type RequirementState = {
	selectedRequirement: fieldState | null
}

export type RequirementContextAction =
	| { type: 'setup_group'; payload: { group_id: string, group_name: string } }
	| { type: 'set_requirement'; payload: selectGroupField }
	| { type: 'clear_requirement' }
// 초기 상태 정의
export const initialState = {
	selectedRequirement: null,
}

// 리듀서 함수 정의
export function reducer(
	state: RequirementState,
	action: RequirementContextAction,
): RequirementState {
	switch (action.type) {
		case 'setup_group':
			return {
				selectedRequirement: {
					selected: state.selectedRequirement?.selected || '',
					absPath: state.selectedRequirement?.absPath || '',
					code: state.selectedRequirement?.code || '',
					group_id: action.payload.group_id,
					group_name: action.payload.group_name,
				},
			}
		case 'set_requirement':
			return {
				selectedRequirement: {
					selected: action.payload.selected,
					absPath: action.payload.absPath,
					code: action.payload.code,
					group_id: state.selectedRequirement?.group_id || 'system_requirement',
					group_name: state.selectedRequirement?.group_name || '체계 요구사항',
				}
			}
		case 'clear_requirement':
			return {
				...state,
				selectedRequirement: null,
			}
		default:
			throw new Error()
	}
}

const RequirementStateContext = createContext<RequirementState | null>(null)
const RequirementDispatchContext =
	createContext<Dispatch<RequirementContextAction> | null>(null)

// Provider 컴포넌트 생성
interface IRequirementProviderProps {
	children: React.ReactNode
}

export function RequirementProvider({ children }: IRequirementProviderProps) {
	const [state, dispatch] = useReducer(reducer, initialState)

	return (
		<RequirementStateContext.Provider value={state}>
			<RequirementDispatchContext.Provider value={dispatch}>
				{children}
			</RequirementDispatchContext.Provider>
		</RequirementStateContext.Provider>
	)
}

// 커스텀 훅 생성
export function useRequirementState() {
	const context = useContext(RequirementStateContext)
	if (context === null) {
		throw new Error('useRequirementState must be used within a RequirementProvider')
	}
	return context
}

export function useRequirementDispatch() {
	const context = useContext(RequirementDispatchContext)
	if (context === null) {
		throw new Error('useRequirementDispatch must be used within a RequirementProvider')
	}
	return context
}

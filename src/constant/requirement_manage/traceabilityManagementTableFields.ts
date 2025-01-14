export interface ITraceabilityConnectTableFields {
  [index: string]: ITraceabilityConnectTableFieldData[]
  system_requirement: ITraceabilityConnectTableFieldData[] 
  sw_requirement: ITraceabilityConnectTableFieldData[]
  swdesign_requirement: ITraceabilityConnectTableFieldData[]
  swtest_requirement: ITraceabilityConnectTableFieldData[]
}

export interface ITraceabilityConnectTableFieldData {
  [index: string]: number | string | boolean
  req_id: number
  req_number: string
  req_content: string
  trace_exist: boolean
}

export const traceabilityManagementTableFieldHeaders: string[] = [
  '체계 요구사항',
  'SW 요구사항',
  'SW 설계',
  'SW 구현',
]
export interface ITraceabilityDataRequirement {
  req_id: number
  req_content: string
  req_number: string
  children: number[]
}

export interface ITraceabilityData {
  [index: string]: ITraceabilityDataRequirement[]
  system_requirement: ITraceabilityDataRequirement[] 
  sw_requirement: ITraceabilityDataRequirement[]
  swdesign_requirement: ITraceabilityDataRequirement[]
  swtest_requirement: ITraceabilityDataRequirement[]
}
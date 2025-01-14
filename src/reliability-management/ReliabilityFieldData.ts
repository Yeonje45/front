export interface IReliabilityTableFields {
  [key: string]: string | boolean;
  select: string;
  name: string;
  result: string;
  disabled: boolean;
}

export interface IReliabilityBoxFormFields {
  [key: string]: string | IReliabilityTableFields[];
  panelHeader: string;
  title: string;
  abbreviation: string;
  resultUnit: string;
  fields: IReliabilityTableFields[];
}

export const ReliabilityBoxFormFields = {
  panelHeader: "신뢰도 예측",
  title: "AIRAMP01 Predictive Defect Density",
  abbreviation: "PDD",
  resultUnit: "Defects/KSLOC",
  fields: [
    { select: "RADCSelected", name: "RADC", result: "RADCResult", disabled: true },
    { select: "ShortcutSelected", name: "Shortcut", result: "ShortcutResult", disabled: true },
    { select: "IndustryApplicationSelected", name: "IndustryApplication", result: "IndustryApplicationResult", disabled: true },
    { select: "CMMISelected", name: "CMMI", result: "CMMIResult", disabled: true },
  ]
}

export interface IRADC_DFactor {
  [key: string]: string | string[] | undefined
  category: string
  feature: string
  D2Data: string[]
}

// SRR : SA, SQ, ST
// PDR : SA, SQ, ST
// CDR : SA, SQ, ST
// IMP : SL, SM, SX, SR

export interface IRADC_FieldData {
  item?: string;
  question: string[];
  result?: string;
  check: {
    [key: string]: string | undefined;
    input?: string;
    calcul?: string;
    yes?: string;
    no?: string;
    notapply?: string;
    unknown?: string;
    name?: string;
    value?: string;
  }[]
}

export interface IFactor {
  key: string;
  tab: string;
  field: {
    title: string;
    fieldheader: string[];
    fielddata: IRADC_FieldData[];
  }[]
}

export interface IGraphModelResult {
  [key: string]: string | number
  label: string
  RADC: number
  Shortcut: number
  IndustryApplication: number
  CMMI: number
  FullScale: number
}
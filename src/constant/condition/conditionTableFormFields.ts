export interface IOutput {
  output_content_history_index: string
  output_content_name: string
  output_content_state: string
  output_content_update_date: string
  output_content_check: boolean
}

export interface IProduct {
  custom_output_history_index: string
  output_name: string
  output_contents: IOutput[]
}

export interface IActiveOutput {
  output_index: string
  output_content: {
    output_work_index: string
    output_work_name: string
  }
}

export interface IUploadData {
  output_index: string
  chapter_items: {
    work_index: string
    work_name: string
    chapter: string
    update: string
  }[]
  file: File
}

export const productConditionTableHeaders: string[] = [
  "상세업무",
  "해당여부",
  "상태",
  "작성일시"
]

export const testConditionTableHeaders: string[] = [
  "작성항목",
  "해당여부",
  "상태",
  "작성일시"
]

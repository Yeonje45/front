import { LockFill } from "react-bootstrap-icons"
import PanelContainer from "../panels/PanelContainer"
import PanelHeader from "../panels/PanelHeader"
import Button from "tailwindElement/Button"

interface IProps {
  children?: React.ReactNode
  editModeState: boolean
  title: string
  editorContentWrapper: {
    CategoryTitle: string // Category Titile
    content: string // Editor Content 
  }[]
  handlePanelCategoryClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  selectedCategory: string
  submitEditorContent: () => void
  hiddenButtons?: string[]
}

const EditorCategorySideBar = ({children, editModeState, title, editorContentWrapper, handlePanelCategoryClick, selectedCategory, submitEditorContent, hiddenButtons}: IProps) => {
  return (
    <div className="flex flex-col items-center w-2/12">
      <PanelContainer className="w-full h-[700px] overflow-y-auto">
        <PanelHeader className="flex flex-wrap items-center justify-between">
          {children}
        </PanelHeader>
        <div className="flex flex-col items-center w-full">
          {editorContentWrapper.length ? editorContentWrapper.map((category_item, index_cg) => {
            const category_title = category_item.CategoryTitle.split(" ").splice(1).join(" ")
            return (
              hiddenButtons && hiddenButtons?.find((d) => category_title === d) ? null :
              <button
                key={index_cg}
                id={category_item.CategoryTitle}
                onClick={handlePanelCategoryClick}
                className={`${selectedCategory === category_item.CategoryTitle ? "bg-gray-200" : "bg-gray-50"} w-full px-2 py-3 border text-start flex items-center gap-2 text-[12px]`}>
                {category_item.CategoryTitle}
              </button>
            )
          })
          : null
        }
        </div>
      </PanelContainer>
      <Button variant="primary" className="w-full" onClick={submitEditorContent}>
        {title} 문서 변환
      </Button>
    </div>
  )
}

export default EditorCategorySideBar
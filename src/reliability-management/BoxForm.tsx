import PanelBody from "components/common/panels/PanelBody"
import PanelContainer from "components/common/panels/PanelContainer"
import PanelHeader from "components/common/panels/PanelHeader"

interface IProps {
  children: React.ReactNode
  title: string
}
const BoxForm = ({ children, title }: IProps) => {
  return (
    <PanelContainer className="w-2/3">
      <PanelHeader className="text-white bg-gray-700 rounded-t-md">
        <p>{title}</p>
      </PanelHeader>
      <PanelBody>
        { children }
      </PanelBody>
    </PanelContainer>
  )
}

export default BoxForm
interface IInfoData {
  system: string
  subSystem: string
  component: string
  csci: string
}

interface IProps {
  infoData: IInfoData
}

const ProjectInfoList = ({ infoData }: IProps) => {
  return (
    <ul className="m-0 text-lg text-center">
      <li>체계 : {infoData.system}</li>
      <li>부체계 : {infoData.subSystem}</li>
      <li>구성품 : {infoData.component}</li>
      <li>CSCI : {infoData.csci}</li>
    </ul>
  )
}

export default ProjectInfoList

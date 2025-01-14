interface IProjectListTableAdminInfo {
  id: string
  name: string
  phone: string
  email: string
}

const ProjectListTableAdminInfo = ({
  id,
  name,
  phone,
  email,
}: IProjectListTableAdminInfo) => {
  return (
    <div className="flex flex-col gap-2 text-xl text-start">
      <span>이름: {name}</span>
      <span>전화번호: {phone}</span>
      <span>이메일: {email}</span>
    </div>
  )
}

export default ProjectListTableAdminInfo

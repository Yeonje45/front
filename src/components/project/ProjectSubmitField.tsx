import Button from 'tailwindElement/Button'

const ProjectSubmitField = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm flex gap-2 items-center justify-center">
      <Button variant="primary" type="submit" className={`w-full mt-2 shadow`}>
        확인
      </Button>
      {/* <Button variant="secondary" className={`w-full mt-2 shadow`}>
        취소
      </Button> */}
    </div>
  )
}

export default ProjectSubmitField

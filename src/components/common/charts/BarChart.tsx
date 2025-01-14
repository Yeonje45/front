import { BarChartLabelField, BarChartValueField } from 'constant/dashboard/chartFields'

interface IProps {
  pieClickData: number
}

const BarChart = ({ pieClickData }: IProps) => {
  return (
    <div className={'border w-1/2 h-full p-4'}>
      {BarChartLabelField.map((label, index_st) => (
        <div key={index_st} className="flex justify-between p-2 mt-4 mb-4 text-2xl">
          <div className="w-5/12 md:w-5/12">{`${label} (${BarChartValueField[pieClickData][index_st]}%)`}</div>
          <div className="w-7/12 md:w-7/12 bg-[#ebebeb]">
            <div
              className={`h-full bg-sky-400`}
              style={{
                width: `${BarChartValueField[pieClickData][index_st]}%`,
              }}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BarChart

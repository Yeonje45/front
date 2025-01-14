import { AIRAMPAxios } from "models";
import { useEffect, useState } from "react";
import Button from "tailwindElement/Button";
import Input from "tailwindElement/Input";

import ShortCutModal from "./ShortCutModal";
import IndustryApplicationModal from "./IndustryApplicationModal";
import CMMIModal from "./CMMIModal";

import { IGraphModelResult, IReliabilityTableFields, ReliabilityBoxFormFields } from "./ReliabilityFieldData";
import RADCModal from "./RADCModal";
import { CDR_RADC_MODAL_FIELD } from "./CdrRadcConstants";
import { PDR_RADC_MODAL_FIELD } from "./PdrRadcConstants";
import { SRR_RADC_MODAL_FIELD } from "./SrrRadcConstants";
import { IMP_RADC_MODAL_FIELD } from "./ImplementationRadcConstants";
import BoxForm from "./BoxForm";
import ReliabilityMeasureGraph from "./ReliabilityMeasureGraph";
import InfoModal from "./InfoModal";

interface IProps {
  step: string
}

type IModelsKey = {
  [key: string]: number
  'RADC': number
  'Shortcut': number
  'IndustryApplication': number
  'CMMI': number
  'FullScale': number
}

const InputTableForm = ({step} :IProps ) => {
  const [selectedResult, setSelectedResult] = useState<number>(0)
  const [modelsResult, setModelsResult] = useState<number[]>([0, 0, 0, 0, 0])
  const [modelsResultRadio, setModelsResultRadio] = useState<boolean[]>([false, false, false, false, false])

  const ModelsKey:IModelsKey = {'RADC': 0, 'Shortcut': 1, 'IndustryApplication': 2, 'CMMI': 3, 'FullScale': 4}

  const [modelResultTableRow, setModelResultTableRow] = useState<IReliabilityTableFields[]>(ReliabilityBoxFormFields.fields)

  // Grpah 넘겨줄 데이터
  const [graphModelResult, setGraphModelResult] = useState<IGraphModelResult[]>([])

  // 체크리스트 입력 완료 후 저장 데이터 PUT API
  const putSelectedResult = async (id: string) => {
    const res = await AIRAMPAxios.put(`predictives/predictive01/2/${step}/`, {
      csciID: 2,
      step: step,
      selectPredictModel: id,
      selectPredictModelResult: modelsResult[ModelsKey[id]],
    })

    res && setSelectedResult(() => res.data.selectPredictModelResult)
    getModelsResult()

    // 체크리스트 완료 후 데이터 조회
    getGraphModelData()
  }

  // 모델 라디오 버튼 핸들러
  const handleRadioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const {id} = e.target
      
      await putSelectedResult(id)

      setModelsResultRadio((prev) => {
        const setData = [false, false, false ,false, false]
        setData[ModelsKey[id]] = true
        return setData
      })

    } catch (error) {
      console.log(error);
    }
  }

  // FullScale 결과 변경 핸들러
  const handleFullScaleResultChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try{
      const value = parseInt(e.target.value)

      await AIRAMPAxios.put(`fullscales/2/${step}/`, {
        resultData: value == 0 ? 0 : value,
        csciID: 2,
        step: step,
      });

      await getModelsResult()
      await putSelectedResult("FullScale")
    }
    catch(error){
      console.log(error);
    }
  }

  // 단계별 모델 결과 가져오기
	const getModelsResult = async (): Promise<void> => {
		const res = await AIRAMPAxios.get(`/predictives/predictive01/2/${step}/default_values/`)
    const fullscaleResponse = await AIRAMPAxios.get(`fullscales/2/${step}/`)       

		if (res.status != 200) {
			alert('get models result error')
			return
		}
    
		setModelsResult(() => (
      [
        res.data.result_radc,
        res.data.result_shortcut,
        res.data.result_industry_app,
        res.data.result_cmmi,
        fullscaleResponse.data.resultData
      ]
    ))

    await getSelectedModel()
	}

  // 선택된 모델 가져오기
  const getSelectedModel = async () => {
    try{
      const res = await AIRAMPAxios.get(`predictives/predictive01/2/${step}/`)
      
      res && setModelsResultRadio((prev) => {
        const setData = [false, false, false ,false, false]
        setData[ModelsKey[res.data.selectPredictModel]] = true
        return setData
      })
      res && setSelectedResult((prev) => {
        return modelsResult[ModelsKey[res.data.selectPredictModel]]
      })
    }
    catch(error){
      console.log(error);
    }
  }

  // Modal List
  const ModalList = [
    step === "SRR" ?
      <RADCModal putSelectedResult={putSelectedResult} RADC_MODAL_FIELD={SRR_RADC_MODAL_FIELD} />
    :
    step === "PDR" ?
      <RADCModal putSelectedResult={putSelectedResult} RADC_MODAL_FIELD={PDR_RADC_MODAL_FIELD} />
    :
    step === "CDR" ?
      <RADCModal putSelectedResult={putSelectedResult} RADC_MODAL_FIELD={CDR_RADC_MODAL_FIELD} />
    :
    step === "Implementation" ?
      <RADCModal putSelectedResult={putSelectedResult} RADC_MODAL_FIELD={IMP_RADC_MODAL_FIELD} />
      : "-"
    ,
    step === "SRR" ?
    <ShortCutModal
      putSelectedResult={putSelectedResult}
    /> : "-",
    step === "SRR" ?
    <IndustryApplicationModal
      putSelectedResult={putSelectedResult}
    /> : "-",
    step === "SRR" ?
    <CMMIModal 
      putSelectedResult={putSelectedResult}
    />
    : "-"
    ,
    "-"
  ]

  const getGraphModelData = async () => {
    const labelList = ["SRR", "PDR", "CDR", "Implementation"]

    const getModelResult = async (label: string) => {
      const res = await AIRAMPAxios.get(`predictives/predictive01/2/${label}/default_values/`)
      
      const fullscaleResponse = await AIRAMPAxios.get(`fullscales/2/${label}/`)       
      
      setGraphModelResult((prev) => {
        return prev.filter((d) => d.label !== label).concat({
          label: label,
          RADC: res.data.result_radc,
          Shortcut: res.data.result_shortcut,
          IndustryApplication: res.data.result_industry_app,
          CMMI: res.data.result_cmmi,
          FullScale: fullscaleResponse.data.resultData
        })
      })
    }

    labelList.forEach((label) => {
      getModelResult(label)
    })
  }
 
  useEffect(() => {
    getGraphModelData()

    getSelectedModel();
  }, [modelsResult, step])

  // 모델별 데이터
  useEffect(() => {
		getModelsResult()

    if(step !== "SRR"){
      setModelResultTableRow([
        ...ReliabilityBoxFormFields.fields,
        {select: 'FullScaleSelected', name: 'FullScale', result: 'FullScaleResult', disabled: false}
      ])
    }
    else {
      setModelResultTableRow([
        ...ReliabilityBoxFormFields.fields
      ])
    }
	}, [step])

  return (
    <div>
      <BoxForm title={ReliabilityBoxFormFields.panelHeader}>
        <div className="flex items-center justify-between">
          <div></div>
          <p className="font-bold">RADC - Predictive Defect Density</p>
					<InfoModal />
        </div>
        
        <div className="flex w-full mt-4">
          <Button variant='primary' className="rounded-none rounded-l-lg cursor-default">{ReliabilityBoxFormFields.abbreviation}</Button>
          <Input type="number" className="rounded-none text-end pe-2" value={Math.round(selectedResult * 10000) / 10000} readOnly/>
          <Button variant='primary' className="rounded-none cursor-default rounded-e-lg whitespace-nowrap">{ReliabilityBoxFormFields.resultUnit}</Button>
        </div>
        
        <div className="w-full mt-2">
          <table className="w-full">
            <thead>
              <tr className="text-center border-b-2">
                <th>Selected</th>
                <th>Name</th>
                <th>Result</th>
                <th>Data Input</th>
              </tr>
            </thead>
            <tbody>
            {
              modelResultTableRow.map((field, index_st) => (
                <tr key={index_st} className="text-center">
                  <td className="p-2">
                    <Input.Radio
                      id={field.name}
                      name={"model_result_radio"}
                      checked={modelsResultRadio[index_st]}
                      onChange={handleRadioChange}
                    />
                  </td>
                  <td>
                    <p>{field.name}</p>
                  </td>
                  <td className="p-1">
                    <div className="w-3/4 mx-auto">
                      <Input
                        type="number"
                        name={field.result}
                        disabled={field.disabled}
                        readOnly={field.disabled}
                        value={Math.round(modelsResult[index_st] * 10000) / 10000}
                        onChange={!field.disabled ? handleFullScaleResultChange : undefined}
                      />
                    </div>
                  </td>
                  <td>
                    {ModalList[index_st]}
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>  
      </BoxForm>
      <BoxForm title="신뢰도 예측 그래프">
        <ReliabilityMeasureGraph data={graphModelResult}/>
      </BoxForm>
    </div>
  )
}

export default InputTableForm;

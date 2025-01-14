import { chapterModalTableFieldsHeader } from 'constant/table/chapterModalTableFields'
import {
  IProduct,
  IActiveOutput,
  IUploadData,
} from 'constant/condition/conditionTableFormFields'
import ActiveModal from 'tailwindElement/ActiveModal'
import Button from 'tailwindElement/Button'
import Input from 'tailwindElement/Input'
import { outputContentConvertHandler } from 'components/common/editor/OutputContent'
import { useEffect, useRef, useState } from 'react'

export interface IProps {
  uploadModalShow: string
  uploadModalHandler: () => void
  uploadOpenModalHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
  uploadCloseModalHandler: () => void
  uploadInputChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadFileChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  col: IProduct
  activeOutput: IActiveOutput[]
  uploadData: IUploadData
  setUploadData: React.Dispatch<React.SetStateAction<IUploadData>>
}

const ProductConditionUploadModal = ({
  uploadModalShow,
  uploadModalHandler,
  uploadOpenModalHandler,
  uploadCloseModalHandler,
  uploadInputChangeHandler,
  uploadFileChangeHandler,
  col,
  activeOutput,
  uploadData,
  setUploadData,
}: IProps) => {
  const input_ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const output_content = localStorage.getItem('output_content')
    if(!output_content) return

    const { output_name, output_number } = JSON.parse(output_content)

    if(col.output_name === output_name) {
      outputContentConvertHandler().then((blob) => {
        if (blob) {
          if(input_ref.current) {            
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([blob], `${output_name}_V${output_number}.hwp`));
            input_ref.current.files = dataTransfer.files;
            setUploadData((prev) => ({
              ...prev,
              file: dataTransfer.files[0],
            }));
          }
        }
      })
    }
    else {
      if(input_ref.current) {
        setUploadData((prev) => ({
          ...prev,
          file: new File([], ''),
        }))

        input_ref.current.value = ''
      }
    }
  }, [uploadModalShow])
  
  return (
    <ActiveModal
      size="lg"
      isOpen={uploadModalShow === col.custom_output_history_index.toString()}
      buttonElement={
        <Button
          className="mx-2"
          name={col.custom_output_history_index}
          onClick={uploadOpenModalHandler}>
          업로드
        </Button>
      }>
      <form>
        <ActiveModal.Head>산출물 업로드</ActiveModal.Head>
        <ActiveModal.Body className="flex justify-center">
          <div className="flex flex-col w-full mt-5 gap-5 sm:max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
            <Input.InputLabel label="산출물 종류" value={col.output_name} disabled />

            <div className="flex flex-col gap-1">
              <label>상세 업무별 장절</label>

              <div className="w-full max-h-[350px] oveflow-y-auto overflow-x-hidden">
                <table className="w-full text-center border">
                  <thead>
                    <tr>
                      {chapterModalTableFieldsHeader.map((header, index_st) => (
                        <th key={index_st} className="p-3 border">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeOutput
                      .filter(
                        d =>
                          d.output_index === col.custom_output_history_index.toString(),
                      )
                      .map((data, index_st) => (
                        <tr key={index_st}>
                          <td className="border">
                            {data.output_content.output_work_name}
                          </td>
                          <td className="border">
                            <Input
                              type="string"
                              name={`chapter_${index_st}`}
                              value={uploadData.chapter_items[index_st]?.chapter || ''}
                              className="rounded-none"
                              onChange={uploadInputChangeHandler}
                            />
                          </td>
                          <td className="border">
                            <Input
                              name={`update_${index_st}`}
                              value={uploadData.chapter_items[index_st]?.update || ''}
                              className="rounded-none"
                              onChange={uploadInputChangeHandler}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <Input.File label="산출물" ref={input_ref} onChange={uploadFileChangeHandler} />
            </div>
          </div>
        </ActiveModal.Body>
        <ActiveModal.Footer>
          <Button
            type="reset"
            onClick={uploadModalHandler}
            name={col.custom_output_history_index}
            variant="primary">
            확인
          </Button>
          <Button type="reset" onClick={uploadCloseModalHandler} variant="secondary">
            닫기
          </Button>
        </ActiveModal.Footer>
      </form>
    </ActiveModal>
  )
}

export default ProductConditionUploadModal

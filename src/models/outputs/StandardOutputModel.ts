import { isAxiosError } from 'axios'
import { AccessAxios } from 'models'
import { IResponse } from '../Response'

export interface IStandardOutput {
  std_output_index: number
  std_output_name: string
}

export class StandardOutputModel {
  constructor() {}

  static GetStandardOutputModel = async (): Promise<{
    success: boolean
    message: string
    data: IResponse<IStandardOutput[]> | null
  }> => {
    try {
      const res = await AccessAxios.get<IResponse<IStandardOutput[]>>(
        '/outputs/standard/',
      )

      return {
        success: true,
        message: res.data.message,
        data: res.data,
      }
    } catch (error) {
      {
        let errorMessage: string = ''
        if (isAxiosError<IResponse<string>>(error)) {
          if (error.response === undefined) {
            return {
              success: false,
              message: '서버와의 연결이 끊겼습니다.',
              data: null,
            }
          }
          const errorData = error.response!.data
          errorMessage = Array.isArray(errorData.error)
            ? errorData.error.join('\n')
            : errorData.error
        }

        return {
          success: false,
          message: errorMessage,
          data: null,
        }
      }
    }
  }
}

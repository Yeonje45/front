export interface IResponse<T> {
	statusCode: number // Response Status Code
	message: string // Response Message
	data: T // Response Data
	error: string // 에러 문구 
}

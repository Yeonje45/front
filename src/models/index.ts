import axios from 'axios'

import { getCookieByName } from 'utils/cookie'

/* 
	export class Axios {
		constructor(config?: AxiosRequestConfig);
		defaults: AxiosDefaults;
		interceptors: {
			request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
			response: AxiosInterceptorManager<AxiosResponse>;
		};
		getUri(config?: AxiosRequestConfig): string;
		request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
		get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
		delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
		head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
		options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
		post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
		put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
		patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
		postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
		putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
		patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
	}
*/

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'
    | 'formdata';

export type responseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';

const AccessAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

AccessAxios.interceptors.request.use(
  config => {
    const token = getCookieByName('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

AccessAxios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  },
)

const LinkPointAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

// 비로그인 시에 사용하는 axios의 instance를 생성
const OutletTokenAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

// AI RAMP 전용 ( Server PC에 존재하는 AI RAMP 서버에 접근하기 위한 axios instance )
const AIRAMPAxios = axios.create({
	baseURL: 'http://192.168.0.84:8002',
})

export { AccessAxios, LinkPointAxios, OutletTokenAxios, AIRAMPAxios }

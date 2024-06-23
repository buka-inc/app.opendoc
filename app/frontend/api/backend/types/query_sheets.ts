import type { KeqOperation } from 'keq'
import type { ResponseOfQuerySheetsDTO } from "../components/schemas/response_of_query_sheets_dto"


export interface ResponseMap {
  "200": ResponseOfQuerySheetsDTO
  "500": unknown
}


export type QueryParameters = {
    "title"?: string
    "type"?: string
    "applicationId"?: string
    "limit"?: number
    "offset"?: number
}

export type RouteParameters = {
}

export type HeaderParameters = {
}

export type BodyParameters ={}
export type RequestParameters = QueryParameters & RouteParameters & HeaderParameters & BodyParameters


export interface Operation<STATUS extends keyof ResponseMap> extends KeqOperation {
  requestParams: RouteParameters
  requestQuery: QueryParameters
  requestHeaders: HeaderParameters
  requestBody: BodyParameters
  responseBody: ResponseMap[STATUS]
}

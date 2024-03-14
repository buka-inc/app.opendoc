import { Keq } from 'keq'
import { request } from 'keq'


interface ResponseMap {
  200: unknown
  500: unknown
}


interface QueryArg {
    name?: string
}

interface ParamArg {
}

interface HeaderArg {
}


/**
 * 查询 Example 列表
 */
export function queryExamples<STATUS extends keyof ResponseMap>(arg?: QueryArg & ParamArg & HeaderArg): Keq<ResponseMap[STATUS]> {
  const req = request.get<ResponseMap[STATUS]>
  ("/api/example")
    .option('module', {
      name: "backend",
      pathname: "/api/example",
    })

  const queryWrap = (value: any) => typeof value === 'boolean' ? String(value) : value

  if (arg && "name" in arg) req.query("name", queryWrap(arg["name"]))

  return req
}

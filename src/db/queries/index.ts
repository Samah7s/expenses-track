import connection from "../connection";
import type { ResultSetHeader } from "mysql2/promise";

async function SelectQueryMany<T>(
  queryString: string,
  params?: any[]
): Promise<Partial<T>[]> {
  const [results] = await connection.execute(queryString, params);
  return results as T[];
}

async function ModifyQuery(
  queryString: string,
  params?: any[]
): Promise<ResultSetHeader> {
  const [result] = await connection.execute(queryString, params);
  return result as ResultSetHeader;
}

async function SelectQueryOne<T>(
  queryString: string,
  params?: any[]
): Promise<T> {
  const [result] = await connection.execute(queryString, params);
  console.log(result);
  return result as T;
}

// async function conditionalQery(
//   queryString,
//   params?: any[]
// ): Promise<ResultSetHeader> {

// }

export { SelectQueryMany, ModifyQuery, SelectQueryOne };

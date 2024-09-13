import connection from "../connection";
import type { ResultSetHeader } from "mysql2/promise";

async function SelectQuery<T>(
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

export { SelectQuery, ModifyQuery };

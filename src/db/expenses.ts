import { SelectQueryMany, ModifyQuery, SelectQueryOne } from "./queries";
import { RowDataPacket } from "mysql2";
import { propToUpdate } from "../lib/helper";
import connection from "./connection";

export interface IExpensesRow extends RowDataPacket {
  id?: number;
  account: string;
  category: string;
  note?: string;
  charge: string;
  amount: number;
  currency: string;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export async function getAllExpences() {
  return SelectQueryMany<IExpensesRow[]>("SELECT * FROM expense");
}

export async function addExpense(data: IExpensesRow) {
  let total: number;
  const previousData = await SelectQueryMany<IExpensesRow>(
    "SELECT * FROM expense ORDER BY id DESC LIMIT 1"
  );

  if (previousData[0].total) {
    total = Number(data.amount) + previousData[0]?.total;
  } else {
    throw new Error();
  }
  return ModifyQuery(
    `INSERT INTO expense(account,category,note,charge,amount,currency,total)
		VALUES(?,?,?,?,?,?,?)`,
    [
      data.account,
      data.category,
      data.note,
      data.charge,
      data.amount,
      data.currency,
      total,
    ]
  );
}

export async function updateExpense(id: string, data: IExpensesRow) {
  const numberRegex = /^\d+$/;

  if (numberRegex.test(id)) {
    const result = await connection.query(
      `UPDATE expense SET ? WHERE id=${id}`,
      [data]
    );
    console.log(result);
  }

  // const result = await connection.query(`UPDATE expense SET ? WHERE id=${id}`, [
  //   data,
  // ]);
  // console.log(result);
}

export async function getExpence(id: number) {
  return SelectQueryOne<IExpensesRow>(`SELECT * FROM expense WHERE id = ?;`, [
    id,
  ]);
}

export async function deleteExpense(id: number) {
  return ModifyQuery(`DELETE FROM expense WHERE id = ?`, [id]);
}

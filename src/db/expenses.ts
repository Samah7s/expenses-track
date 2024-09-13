import { SelectQuery, ModifyQuery } from "./queries";
import { RowDataPacket } from "mysql2";

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
  return SelectQuery<IExpensesRow[]>("SELECT * FROM expense");
}

export async function addExpense(data: IExpensesRow) {
  // const result = SelectQuery<IExpensesRow>('Select 1 from expense;')
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
      data.total,
    ]
  );
}

export async function getExpence(id: number) {
  return SelectQuery<IExpensesRow>(`SELECT * FROM expense WHERE id = ?;`, [id]);
}

import { SelectQuery, ModifyQuery } from "./queries";
import { RowDataPacket } from "mysql2";

export interface IUserRow extends RowDataPacket {
  id?: number;
  email: string;
  hash: string;
  username: string;
  first_name?: string;
  last_name?: string;
  birthdate: string;
  register_date?: string;
  update_at?: string;
}

export async function addUser(user: IUserRow) {
  const { email, username, password, birthdate } = user;
  return ModifyQuery(
    "INSERT INTO user(email, hash, username, birthdate) VALUES (?, ?, ?, ?)",
    [email, password, username, birthdate]
  );
}

export async function updateUserInfo(user: IUserRow) {
  return "user data succesfully updated";
}

export async function updateUser(userId: number) {
  return "user data updating process";
}

export async function getAllUsers() {
  return SelectQuery<Partial<IUserRow>>("SELECT * FROM user");
}

export async function getUser(email: string) {
  return SelectQuery<IUserRow>(`SELECT * FROM user WHERE email = ?;`, [email]);
}

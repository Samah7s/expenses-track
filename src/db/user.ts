import { SelectQueryMany, ModifyQuery } from "./queries";
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
  refresh_token?: string;
}

export async function addUser(user: IUserRow) {
  const { email, username, password, birthdate } = user;
  return ModifyQuery(
    "INSERT INTO user(email, hash, username) VALUES (?, ?, ?)",
    [email, password, username]
  );
}

export async function updateRefreshToken(email: string, token: string) {
  if (!token) {
    return ModifyQuery(`UPDATE user SET refresh_token = ? WHERE email = ?`, [
      null,
      email,
    ]);
  }
  return ModifyQuery(`UPDATE user SET refresh_token = ? WHERE email = ?`, [
    token,
    email,
  ]);
}

export async function getAllUsers() {
  return SelectQueryMany<Partial<IUserRow>>("SELECT * FROM user");
}

export async function getUser(email: string) {
  return SelectQueryMany<IUserRow>(`SELECT * FROM user WHERE email = ?;`, [
    email,
  ]);
}

export async function deleteUser(id: number) {
  return ModifyQuery(`DELETE FROM user WHERER id = ?`, [id]);
}

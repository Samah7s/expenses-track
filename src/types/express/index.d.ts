import "express";
import { JwtPayload } from "jsonwebtoken";
import { IUserRow } from "../../db/user";

declare module "express" {
  interface Request {
    token?: string | JwtPayload;
    user?: Partial<IUserRow>;
  }
}

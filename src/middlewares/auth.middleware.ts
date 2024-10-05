import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUser, IUserRow } from "../db/user";
import url from "url";
export interface CustomRequest extends Request {
  token?: string | JwtPayload;
  user?: IUserRow;
}
export const SECRET_KEY: Secret = "some random access token secret";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("token not exist");
      return res.redirect(
        url.format({
          pathname: "/sign/token",
        })
      );
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decodedToken;
    next();
  } catch (error) {
    return res.redirect(
      url.format({
        pathname: "/sign/token",
      })
    );
  }
};

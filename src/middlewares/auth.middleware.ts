import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUser } from "../db/user";

export interface CustomRequest extends Request {
  token?: string | JwtPayload;
}
export const SECRET_KEY: Secret = "some random access token secret";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Pleases authenticate",
    });
  }
};

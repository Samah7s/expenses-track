import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getUser } from "../db/user";
import url from "url";
import { getDocumentProperty } from "../utils/getProperty";
import config from "../config";

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
    const decodedToken = jwt.verify(token, config.access_token_secret);
    const email = getDocumentProperty(decodedToken, "email");
    const [user] = await getUser(email);
    req.token = decodedToken;
    req.user = user;
    next();
  } catch (error) {
    return res.redirect(
      url.format({
        pathname: "/sign/token",
      })
    );
  }
};

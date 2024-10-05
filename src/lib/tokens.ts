import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { getUser } from "../db/user";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
    email: string;
  }
}

export function generateAccessToken(id: number | undefined, email: string) {
  return jwt.sign(
    {
      id,
      email,
    },
    "some random access token secret",
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(email: string) {
  return jwt.sign({ email }, "some random refresh token secret", {
    expiresIn: "14d",
  });
}

export async function generateAccessAndRefreshTokens(
  email: string,
  id: number
) {
  try {
    const [user] = await getUser(email);
    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {}
}

export async function refreshAccessToken(req: Request, res: Response) {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }
  try {
    const decodedToken = <jwt.JwtPayload>(
      jwt.verify(incomingRefreshToken, "refresh token secret key")
    );
    const [user] = await getUser(decodedToken.email as string);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ message: "Something gone wrong" });
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const accessToken = generateAccessToken(user?.id, user[0]?.email);
    return res.status(200).cookie("accessToken", accessToken, options).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}

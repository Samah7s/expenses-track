import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUser, IUserRow, addUser, updateRefreshToken } from "../db/user";
import checkFields from "../utils/fieldCheck";
import { generateAccessToken, generateRefreshToken } from "../lib/tokens";

const router = Router();

router.post("/register", async (req, res) => {
  const data = req.body as IUserRow;
  if (!checkFields(data, ["email", "username", "password"])) {
    return res.status(400).json({
      message: "Some required fields are missing",
    });
  }
  try {
    const hash = await bcrypt.hash(data.password, 10);
    const result = await addUser({ ...data, password: hash });
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error,
    });
  }
});

router.get("/login", async (req, res) => {
  const data = req.body as { email: string; password: string };
  if (!checkFields(data, ["email", "password"])) {
    return res.status(400).json({
      message: "Some required fields are missing",
    });
  }
  try {
    const [user] = await getUser(data.email);
    console.log(user);
    if (!user) {
      throw "wrong password or email";
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const hash = user.hash as string;
    bcrypt
      .compare(data.password, hash)
      .then(() => {
        const access_token = generateAccessToken(
          user.user_id,
          user.email as string
        );
        const refresh_token = generateRefreshToken(user.email as string);
        updateRefreshToken(user.email as string, refresh_token).then(() => {
          console.log("refresh token added");
        });
        console.log("resfresh token not added");
        return res
          .status(200)
          .cookie("accessToken", access_token, options)
          .cookie("refreshToken", refresh_token, options)
          .json({
            status: "success",
            message: `Logged in Successfullym, Welcome ${user.username}`,
          });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(404).json({
      messsge: error,
    });
  }
});

router.get("/token", async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }
  try {
    const decodedToken = <jwt.JwtPayload>(
      jwt.verify(incomingRefreshToken, "some random refresh token secret")
    );
    console.log("token found", decodedToken);
    const [user] = await getUser(decodedToken.email as string);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user?.refresh_token !== incomingRefreshToken) {
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
});

router.post("/logout", async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  try {
    if (!req.user?.email) {
      throw new Error("User not defined");
    }
    updateRefreshToken(req.user.email, "").then(() => {
      return res
        .status(200)
        .cookie("accessToken", options)
        .cookie("refreshToken", options)
        .json({
          user: {},
          message: "Logged out successfully",
        });
    });
  } catch (error) {}
});

export default router;

import { Router } from "express";
import bcrypt from "bcrypt";
import { getUser, getAllUsers, IUserRow, addUser } from "../db/user";
import checkFields from "../utils/fieldCheck";
import { generateAccessToken, generateRefreshToken } from "../lib/tokens";
const router = Router();

router.post("/registration", async (req, res) => {
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
          user.id as number,
          user.email as string
        );
        const refresh_token = generateRefreshToken(user.id as number);
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

export default router;

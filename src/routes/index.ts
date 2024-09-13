import { Router, Response } from "express";
import userRouter from "./user";
import singRouter from "./sign";
import expenseRouter from "./expenses";
import { auth } from "../middlewares/auth.middleware";
import { CustomRequest } from "../middlewares/auth.middleware";
const router = Router();

router.use("/user", userRouter);
router.use("/sign", singRouter);
router.use("/expense", expenseRouter);

router.get("/", (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Welcome to home page",
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: error,
      message: "Some internal unexpected internal problem",
    });
  }
});

router.get("/topsecret", auth, (req: CustomRequest, res: Response) => {
  res.status(200).json({
    message: "Congratulations, you recieved secret information",
  });
});
export default router;

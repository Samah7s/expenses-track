import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import checkFields from "../utils/fieldCheck";
import { IExpensesRow, getExpence, addExpense } from "../db/expenses";
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
  } catch (error) {}
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    console.log(id);
    // if (!id) {
    //   throw new Error();
    // }
    const data = await getExpence(id);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Eternal serve error",
      error,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const data = req.body as IExpensesRow;
    // if (!checkFields(data, [typeof data])) {
    //   console.log("Something wrong");
    // }
    addExpense(data).then(() => {
      console.log(data);
      res.status(200).json({
        status: "success",
        data: data,
      });
    });
  } catch (error) {
    res.status(505).json({
      message: "Eternal server error",
    });
  }
});

export default router;

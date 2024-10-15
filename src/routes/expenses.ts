import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  IExpensesRow,
  getExpence,
  addExpense,
  getAllExpences,
  updateExpense,
} from "../db/expenses";
const router = Router();

router.get("/", auth, async (req, res) => {
  if (req.query) {
    const queries = req.query;
    return res.status(200).json({
      queries,
    });
  }
  try {
    const data = await getAllExpences();
    console.log(typeof data);
    console.log(data[0]);
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    return res.status(404).json({
      error: error,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params["id"]);
    const data = await getExpence(id);
    console.log(typeof data);
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
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

router.put("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    updateExpense(id, data);
  } catch (error) {}
});

export default router;

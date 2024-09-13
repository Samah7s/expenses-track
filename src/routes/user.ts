import { Router } from "express";
import { getUser, getAllUsers, IUserRow, addUser } from "../db/user";

const router = Router();

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const [user] = await getUser(email);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Internal server error",
    });
  }
});

export default router;

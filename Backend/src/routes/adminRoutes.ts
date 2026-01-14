import { Router } from "express";
import { getAdmins, createAdmin, updateAdmin } from "../controllers/adminControllers";

const router = Router();

router
    .get("/", getAdmins)
    .post("/", createAdmin)
    .put("/:id", updateAdmin);

export default router;
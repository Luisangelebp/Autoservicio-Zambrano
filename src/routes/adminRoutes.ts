import { Router } from "express";
import { createAdmin, updateAdmin } from "../controllers/adminControllers";

const router = Router();

router
    .post("/", createAdmin)
    .put("/:id", updateAdmin);

export default router;
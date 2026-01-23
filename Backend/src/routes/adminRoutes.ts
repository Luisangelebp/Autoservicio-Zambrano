import { Router } from "express";
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from "../controllers/adminControllers";

const router = Router();

router
    .get("/", getAdmins)
    .post("/", createAdmin)
    .put("/:id", updateAdmin)
    .delete("/:id", deleteAdmin);

export default router;
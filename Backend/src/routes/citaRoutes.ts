import { Router } from "express";
import { getCitaById, getCitas, createCita, deleteCita, updateCita } from "../controllers/citasControllers";

const router = Router();

router.get("/", getCitas);
router.get("/:id", getCitaById);
router.post("/", createCita);
router.put("/:id", updateCita);
router.delete("/:id", deleteCita);

export default router;
import { Router } from "express";
import { getCitaById, getCitas, createCita, deleteCita, updateCita, cambiarEstadoCita, cambiarMontoCita} from "../controllers/citasControllers";

const router = Router();

router.get("/", getCitas);
router.get("/:id", getCitaById);
router.post("/", createCita);
router.put("/:id", updateCita);
router.delete("/:id", deleteCita);
router.patch("/estado/:id", cambiarEstadoCita);
router.patch("/monto/:id", cambiarMontoCita);

export default router;
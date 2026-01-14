import { Router } from "express";
import {
  getCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito,
} from "../controllers/carritoControllers";

const router = Router();

router.get("/", getCarritos);
router.get("/:id", getCarritoById);
router.post("", createCarrito);
router.put("/:id", updateCarrito);
router.delete("/:id", deleteCarrito);

// Endpoints extra

export default router;
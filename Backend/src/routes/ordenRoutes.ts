import { Router } from "express";
import { getOrdenes, getOrdenesByCliente, createOrden, updateEntregado } from '../controllers/ordenControllers';

const router = Router();

router.get("/", getOrdenes);
router.get("/:clienteId", getOrdenesByCliente);
router.post("/", createOrden);
router.patch("/:id", updateEntregado);

export default router;
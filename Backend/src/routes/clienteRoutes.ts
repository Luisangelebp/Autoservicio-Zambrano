import { Router } from "express";
import { getClientes, getClienteById, updateCliente, deleteCliente } from "../controllers/clientesControllers";
const router = Router();

// Ruta para obtener todos los clientes
router.get("/", getClientes);

// Ruta para obtener un cliente por ID
router.get("/:id", getClienteById);

// Ruta para actualizar un cliente
router.put("/:id", updateCliente);

// Ruta para eliminar un clientes

router.delete("/:id", deleteCliente)

export default router;
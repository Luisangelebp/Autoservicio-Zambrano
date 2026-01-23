"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientesControllers_1 = require("../controllers/clientesControllers");
const router = (0, express_1.Router)();
// Ruta para obtener todos los clientes
router.get("/", clientesControllers_1.getClientes);
// Ruta para obtener un cliente por ID
router.get("/:id", clientesControllers_1.getClienteById);
// Ruta para actualizar un cliente
router.put("/:id", clientesControllers_1.updateCliente);
// Ruta para eliminar un clientes
router.delete("/:id", clientesControllers_1.deleteCliente);
exports.default = router;

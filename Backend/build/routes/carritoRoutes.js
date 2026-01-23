"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carritoControllers_1 = require("../controllers/carritoControllers");
const router = (0, express_1.Router)();
router.get("/", carritoControllers_1.getCarritos);
router.get("/:id", carritoControllers_1.getCarritoById);
router.post("", carritoControllers_1.createCarrito);
router.put("/:id", carritoControllers_1.updateCarrito);
router.delete("/:id", carritoControllers_1.deleteCarrito);
// Endpoints extra
exports.default = router;

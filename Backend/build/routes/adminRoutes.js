"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminControllers_1 = require("../controllers/adminControllers");
const router = (0, express_1.Router)();
router
    .get("/", adminControllers_1.getAdmins)
    .post("/", adminControllers_1.createAdmin)
    .put("/:id", adminControllers_1.updateAdmin)
    .delete("/:id", adminControllers_1.deleteAdmin);
exports.default = router;

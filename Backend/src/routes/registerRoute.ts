import { Router, Request, Response } from "express";
import { db } from "../database";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { nombre, apellido, correo, pass, cedula, direccion, telefono } = req.body;

  if (!nombre || !apellido || !correo || !pass || !cedula) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {

    const result = await db.run(
      `INSERT INTO clientes (nombre, apellido, correo, pass, cedula, direccion, telefono)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, pass, cedula, direccion || null, telefono || null]
    );

    return res.status(201).json({
      message: "Cliente registrado exitosamente 🚀",
      id: result.lastID
    });
  } catch (error: any) {
    console.error(error);
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ message: "El correo o la cedula ya estan registrados" });
    }
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
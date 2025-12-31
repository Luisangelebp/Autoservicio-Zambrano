import { Router, Request, Response } from "express";
import { db } from "../database";
const router = Router();

// Login básico: compara usuario y contraseña con valores fijos
router.post("/", async (req: Request, res: Response) => {
  const { correo, pass } = req.body;

  if (!correo || !pass) {
    return res.status(400).json({ message: "Correo y contraseña requeridos" });
  }

  try {

    // Buscar en clientes
    const cliente = await db.get(
      "SELECT * FROM clientes WHERE correo = ? AND pass = ?",
      [correo, pass]
    );

    if (cliente) {
      return res.json({
        message: "Login exitoso (cliente)",
        token: "12345",
        user: cliente
      });
    }

    // Buscar en admins
    const admin = await db.get(
      "SELECT * FROM admins WHERE correo = ? AND pass = ?",
      [correo, pass]
    );

    if (admin) {
      return res.json({
        message: "Login exitoso (admin)",
        token: "12345",
        user: admin
      });
    }

    return res.status(401).json({ message: "Credenciales inválidas" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});


export default router;

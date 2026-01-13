import { Router, Request, Response } from "express";
import { db } from "../database";
const router = Router();

// Login básico: compara usuario y contraseña con valores fijos
router.post("/", async (req: Request, res: Response) => {
  const { correo, pass, rol } = req.body;

  if (!correo || !pass || !rol) {
    return res.status(400).json({ message: "Correo, contraseña y rol requeridos" });
  }

  try {
    let user: any = null;

    if (rol === "clientes") {
      user = await db.get(
        "SELECT * FROM clientes WHERE correo = ? AND pass = ?",
        [correo, pass]
      );
    } else if (rol === "admin") {
      user = await db.get(
        "SELECT * FROM admins WHERE correo = ? AND pass = ?",
        [correo, pass]
      );
    }

    if (user) {
      return res.json({
        message: `Login exitoso (${rol})`,
        token: "12345", 
        user,
        rol
      });
    }

    return res.status(401).json({ message: "Credenciales inválidas" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});




export default router;

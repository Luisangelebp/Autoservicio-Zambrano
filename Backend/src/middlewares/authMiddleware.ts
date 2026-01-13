import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];

  // Verificar si existe el header
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token requerido." });
  }

  // Validar contra el token fijo
  if (token !== "12345") {
    return res.status(403).json({ message: "Token inválido." });
  }

  // Si el token es correcto, continuar
  next();
}
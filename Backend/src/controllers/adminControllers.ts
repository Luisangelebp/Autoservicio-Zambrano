import { db } from "../database";
import { Request, Response } from "express";
import { Admin } from "../models/adminModel";

// Crear un nuevo admin
export async function createAdmin(req: Request, res: Response) {
  const { nombre, apellido, correo, pass, cedula }: Admin = req.body;

  if (!nombre || !apellido || !correo || !pass || !cedula) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {

    const result = await db.run(
      `INSERT INTO admins (nombre, apellido, correo, pass, cedula)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, pass, cedula]
    );

    const newAdmin: Admin = {
      id: result.lastID,
      nombre,
      apellido,
      correo,
      pass,
      cedula
    };

    return res.status(201).json({
      message: "Admin creado exitosamente 🚀",
      admin: newAdmin
    });
  } catch (error: any) {
    console.error(error);
    if (error.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar un admin existente
export async function updateAdmin(req: Request, res: Response) {
  const { id } = req.params;
  const { nombre, apellido, correo, pass, cedula }: Admin = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID requerido" });
  }

  try {

    const result = await db.run(
      `UPDATE admins
       SET nombre = ?, apellido = ?, correo = ?, pass = ?, cedula = ?
       WHERE id = ?`,
      [nombre, apellido, correo, pass, cedula, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Admin no encontrado" });
    }

    const updatedAdmin: Admin = {
      id: Number(id),
      nombre,
      apellido,
      correo,
      pass,
      cedula
    };

    return res.json({
      message: "Admin actualizado exitosamente 🚀",
      admin: updatedAdmin
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
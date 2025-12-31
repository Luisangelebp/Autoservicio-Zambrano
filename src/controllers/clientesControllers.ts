import { Request, Response } from "express";
import { db } from "../database";
import { Cliente } from "../models/clienteModel";

// Obtener todos los clientes
export async function getClientes(req: Request, res: Response) {
  try {
    const clientes: Cliente[] = await db.all("SELECT * FROM clientes");
    return res.json(clientes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Obtener cliente por ID
export async function getClienteById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const cliente: Cliente = await db.get("SELECT * FROM clientes WHERE id = ?", [id]);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.json(cliente);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar cliente
export async function updateCliente(req: Request, res: Response) {
  const { id } = req.params;
  const { nombre, apellido, correo, pass, cedula, direccion, telefono }: Cliente = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID requerido" });
  }

  try {
    const result = await db.run(
      `UPDATE clientes
       SET nombre = ?, apellido = ?, correo = ?, pass = ?, cedula = ?, direccion = ?, telefono = ?
       WHERE id = ?`,
      [nombre, apellido, correo, pass, cedula, direccion, telefono, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.json({ message: "Cliente actualizado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Eliminar cliente
export async function deleteCliente(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await db.run("DELETE FROM clientes WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.json({ message: "Cliente eliminado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
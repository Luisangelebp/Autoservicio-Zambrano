"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
async function initializeDatabase() {
    exports.db = await (0, sqlite_1.open)({
        filename: "./src/database/taller.db", // aquí se guarda tu BD
        driver: sqlite3_1.default.Database
    });
    // Inicialización de tabla ejemplo
    await exports.db.exec(`-- Tabla de Clientes
  CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      pass TEXT NOT NULL,
      cedula TEXT NOT NULL UNIQUE,
      direccion TEXT,
      telefono INTEGER
  );
  -- Tabla de Admins
  CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      pass TEXT NOT NULL,
      cedula TEXT NOT NULL
  );
  -- Tabla de Mecánicos
  CREATE TABLE IF NOT EXISTS mecanicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      especialidad TEXT NOT NULL
  );
  -- Tabla de Items (productos)
  CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      cant INTEGER NOT NULL,
      foto TEXT
  );
  -- Tabla de Carrito
  CREATE TABLE IF NOT EXISTS carritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clienteId INTEGER NOT NULL,
      FOREIGN KEY (clienteId) REFERENCES clientes(id)
  );
  -- Tabla intermedia Carrito_Productos (relación N:M entre carrito e items)
  CREATE TABLE IF NOT EXISTS carrito_productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carritoId INTEGER NOT NULL,
      itemId INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      FOREIGN KEY (carritoId) REFERENCES carritos(id),
      FOREIGN KEY (itemId) REFERENCES items(id)
  );
  -- Tabla de Citas
  CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cliente INTEGER NOT NULL,
      id_mecanico INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      descripcion TEXT,
      servicio TEXT,
      estado TEXT CHECK(
          estado IN (
              'pendiente',
              'confirmada',
              'completada',
              'cancelada'
          )
      ) DEFAULT 'pendiente',
      FOREIGN KEY (id_cliente) REFERENCES clientes(id),
      FOREIGN KEY (id_mecanico) REFERENCES mecanicos(id)
  );
  -- Tabla de Pagos
  CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metodoPago TEXT CHECK(metodoPago IN ('efectivo','tarjeta','pago movil')) NOT NULL,
      clienteId INTEGER NOT NULL,
      citaId INTEGER,
      carritoId INTEGER,
      fecha TEXT NOT NULL,
      confirmado INTEGER NOT NULL CHECK(confirmado IN (0,1)),
      banco TEXT,
      referencia TEXT,
      monto REAL NOT NULL,
      FOREIGN KEY (clienteId) REFERENCES clientes(id),
      FOREIGN KEY (citaId) REFERENCES citas(id),
      FOREIGN KEY (carritoId) REFERENCES carritos(id)
    );
 `);
}
initializeDatabase();

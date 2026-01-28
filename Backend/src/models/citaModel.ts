export interface Cita {
    id?: number;
    id_cliente: number;
    id_mecanico: number;
    fecha: string;
    descripcion: string;
    servicio: string;
    monto: number;
    estado: "pendiente" | "confirmada" | "completada" | "cancelada";
}
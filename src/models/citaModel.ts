export interface Cita {
    id?: number;
    id_cliente: number;
    id_mecanico: number;
    fecha: string;
    descripcion: string;
    servicio: string;
    estado: "pendiente" | "confirmada" | "completada" | "cancelada";
}
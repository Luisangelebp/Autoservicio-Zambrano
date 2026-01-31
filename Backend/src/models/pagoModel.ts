export interface Pago {
    id?: number;
    metodoPago: "efectivo" | "tarjeta" | "pago movil";
    clienteId: number;
    citaId?: number;
    ordenId?: number;
    fecha: Date;
    confirmado: boolean;
    banco?: string;
    referencia?: string;
    monto: number;
}
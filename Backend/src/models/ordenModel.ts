export interface Orden{
  id?: number;
  clienteId: number;
  fecha: Date;
  entregado: boolean;
  productos: { itemId: number, cantidad: number , montoU: number}[];
}
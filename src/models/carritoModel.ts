export interface Carrito {
    id?: number;
    clienteId: number;
    productos: { itemId: number; cantidad: number }[];
}
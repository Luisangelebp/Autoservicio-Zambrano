## Lo que vas a hacer

- selectiona los archivos 'OrdenesAdmin.html', 'ordenesAdmin.css' y 'ordenesAdmin.js'
- Vas a obtener las ordenes de compra y las vas a mostrar en pantalla como cards
- Si "entrago" de la orden es false a poner un boton de "Entregado" en cada card, al hacer click el estado de la orden cambia a true
- vas a agregar filtros de fecha, entregado, cliente

## Como lo vas a hacer?

- Te puedes basar en los estilos de '/ordenes/ordenes.html'
- usa axios para todas las peticiones
- el token lo encontraras en el localStorage.getItem('token')
- el headers para las peticiones debe tener este formato:
- ```
   headers: {
     'Content-Type': 'application/json',
     authorization: token,
   },
  ```
- para obtener los items lo haces mediante el endpoint http://localhost:8000/items
- ```
  {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cant: number;
    foto?: string;
  }
  ```
- para obtener la foto de un items, una ves teniendo el item.foto usas http://localhost:8000/uploads/item.foto
- Para obtener las ordenes lo haces mediante el endpoint http://localhost:8000/ordenes
- Para cambiar el estado de "entregado" a true lo haces al axios.patch http://localhost:8000/ordenes/id
- La orden tiene esta estructura
- ```
  {
   id?: number;
   clienteId: number;
   fecha: Date;
   entregado: boolean;
   productos: { itemId: number, cantidad: number , montoU: number}[];
  }
  ```

```
- Puedes usar el endpoint http://localhost:8000/clientes para obtener los clientes, y asi usarlos de filtro y para mostrar al cliente


```

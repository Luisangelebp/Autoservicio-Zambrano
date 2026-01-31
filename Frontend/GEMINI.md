## Lo que vas a hacer

- selectiona los archivos 'ver_citas.html' 'verCita.js' 'citas.css'
- !!! IMPORTANTE !!!
- 'citas.css' es un archivo compartido con otra pagina, no eliminies ni alteres los estilos ahi presentes, solo pueder leerlos y agregar nuevos que no conflictuen con los que ya estan
- conserva los estilos
- Esta archivo se usara para la visualizacion total de las citas
- se mostraran como cards
- agrega filtros por estado y fecha
- agrega una paginacion
- vas a agregar un boton a cada card para completar la cita (solo si el estado actual de la cita es "en proceso") debe hacer patch para cambiar el estado a "completada"
- vas a agregar un boton a cada card para cancelar la cita, su estado debe cambiar a "cancelada", usa el patch
- vas a agregar un boton para asignarle el monto a la cita, que al dar click salga un modal que permita ingresar el monto

## Como lo vas a hacer?

- usa axios para todas las peticiones
- el id lo encontraras en el localStorage.getItem('user')
- el token lo encontraras en el localStorage.getItem('token')
- el headers para las peticiones debe tener este formato:
- ```
   headers: {
     'Content-Type': 'application/json',
     authorization: token,
   },
  ```
- usaras el endpoint de http://localhost:8000/citas para obtener todas las citas
- usaras el endpoint de http://localhost:8000/citas/estado/:id para hacer patch al estado de la cita, solo puedes enviar un body con:
- ```
  {
    "estado": "cancelada" || "confirmada" || "completada"
  }
  ```
- usaras el endpoint de http://localhost:8000/citas/monto/:id para hacer patch al monto de la cita
- ```
  {
   "monto": number
  }
  ```
- cuando se asigne un monto a una cita debes de hacer un patch al estado para que cambie a "confirmada"
- usaras el endpoint de http://localhost:8000/clientes para obtener los nombres de los clientes
- usaras el endpoint de http://localhost:8000/mecanicos para obtener los nombres de los mecanicos

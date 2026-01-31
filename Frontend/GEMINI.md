## Lo que vas a hacer

- selectiona los archivos 'pg de administrador.html' 'script.js'
- conserva los estilos
- En la seccion de Gestion de personal y clientes
- vas a mostrar los clientes, admins y mecanicos registrados
- la tabla en la que los mostraras trata de que no tenga scrolls, usar filtros y paginacion
- vas a habilitar el formulario de registro, solo para mecanicos y admins
- vas a habilitar el formalario de edicion, ten en cuenta que maneja metodos put
- para el manejo de errores, has console.log y tambien crea una pequeña notificacion que dure 3 segundos

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
- usaras los endpoint http://localhost:8000/clientes, http://localhost:8000/admin, http://localhost:8000/mecanicos para hacer el gets de los usuarios
- para el registro de mecanicos usa el mismo endpoint pero con post
- para el registro de admins usa el mismo endpoint pero con post
- para el body del registro de admin usa este formato
- ```
  {
    nombre: string;
    apellido: string;
    correo: string;
    pass: string;
    cedula: string; // valida que el primer caracter sea 'V' o 'E' o 'J' y el resto que sea numeros
  }
  ```
- para el body del registro de mecanicos usa este formato
- ```
  {
    nombre: string;
    apellido: string;
    especialidad: string;
  }
  ```
- para eliminar un usuario usa el endpoint http://localhost:8000/clientes/id o http://localhost:8000/admin/id o http://localhost:8000/mecanicos/id

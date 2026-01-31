## Lo que vas a hacer

- Vas a conservar los estilos actuales, te basaras en ellos para lo que vamos a hacer, los vas a guardar en estilos.css
- Usaras axios para las peticiones para la api
- selecionaras Editar.html, esta pagina es para editar el usuario cliente
- en localStorage.getItem('user') tendras el usuario actual, los cambios que hagas tienes que reflejarlos tambien ahí
- vas a crear un formulario con inputs para "nombre", "apellido", "correo", "pass", "confirmar contraseña", "direccion", "telefono"
  nota: solo se enviara pass, confirmar contraseña es solo para asegurar que el usuario no se equivoque
- todos los datos deben ser llenados para poder enviarse

## Como lo vas a hacer?

- el id lo encontraras en el localStorage.getItem('user')
- el token lo encontraras en el localStorage.getItem('token')
- vas a usar 'http://localhost:8000/clientes/id' para hacer las peticiones put
- Vas a prerellenar el formulario con los datos guardados en localStorage, excepto "pass"
- cuando el cliente de click en editar, haras la peticion a la api con axios.put
- el body debe tener este formato
- ```
  {
    "nombre": "string",
    "apellido": "string",
    "correo": "string",
    "pass": "string",
    "direccion": "string",
    "telefono": entero
    "cedula": localStorage.getItem('user').cedula
  }
  ```

- el headers deben tener este formato:
- ```
   headers: {
     'Content-Type': 'application/json',
     authorization: token,
   },
  ```

```

```

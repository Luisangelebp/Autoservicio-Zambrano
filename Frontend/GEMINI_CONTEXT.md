# Important

- All things in screen have to be in spanish
- Use Axios

## Purpose

This document provides context and guidelines for using the GEMINI (Genomic Exploration of Multidimensional Information) framework. It outlines the key concepts, objectives, and best practices to ensure effective implementation and utilization of GEMINI in genomic data analysis.

Create two sections, one for citas and one fot carritos.
Create a sidebar for the payment

- When someone press and cita card, or one carrito the data will send to payCitaOCarrito
- At the sidebar will have three buttoms, one for cash or "efectivo" one for card or "tarjeta" and one for "Pago Movil"
- if the user press cash or card you will send this option to payCitaOCarrito
- if the user press "Pago Movil" you wil render this data "banco: Venezuela, Telefono: 04140000000, cedula: V00000000"
  -Render a form to send the data to payCitaOCarrito, the form will have inputs for (fecha, referencia, monto) and a select input for (banco), the options are in bancosOptions array

## Key Concepts

-- \*\*select the file HTML file "pago.html" INSERT "<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>"

- \*\*select the file CSS file "pago.css" delete all, only save the body background image
- \*\*select the file JS file "pago.js", Here you dev the logic of the page
-

## Examples

- ```
  let bancosOptions=[ "Banco de Venezuela", "Banco Venezolano de Crédito", "Banco Mercantil", "Banco Provincial", "Bancaribe", "Banco Exterior", "Banco Caroní", "Banesco Banco Universal", "Banco Sofitasa", "Banco Plaza", "Bangente", "Banco Fondo Común", "100% Banco", "DelSur Banco Universal", "Banco del Tesoro", "Banco Agrícola de Venezuela", "Bancrecer", "Mi Banco", "Banco Activo", "Bancamiga", "Banco Internacional de Desarrollo", "Banplus", "Banco Bicentenario del Pueblo", "BANFANB", "Banco Nacional de Crédito", "Instituto Municipal de Crédito Popular" ];
  ```

## Functions

- ```
  async function getCitaData(){
    let token = localStorage.getItem("token");
    try{
      const response = await axios.get("http://localhost:8000/citas",{
        headers:{
          "Authorization": `${token}`
        }
      });
      const citaByClienteId = data.filter(
        (cita) =>
          cita.id_cliente === JSON.parse(localStorage.getItem('user')).id,
      );
      return response.data;
    }catch(error){
      console.log(error);
    }
  }
  ```
- ```
  async function payCitaOCarrito(citaOCarro, id_cliente, cita_id, method, mount, data){
    let token = localStorage.getItem("token");
    const body = new FormData();
    if(citaOCarro === "cita"){
      body.append("citaId", cita_id);
    }else{
      body.append("carroId", cita_id);
    }
    body.append("clienteId", id_cliente);
    body.append("metodoPago", method.toLowerCase());
    if (method === "Pago Movil"){
      body.append("fecha", data.fecha);
      body.append("confirmado", false);
      body.append("banco", data.banco);
      body.append("referencia", data.referencia);
      body.append("monto", data.monto);
    }else{
      body.append("monto", mount);
    }
    try{
      const response axios.post("http://localhost:8000/pagos", body, {
        headers:{
          "Authorization": `${token}`
        }
      });
      return response.data;
    }catch(error){
      console.log(error);
    }

  }
  ```

- ```
  async function getCarroData(carro_id){
    let token = localStorage.getItem("token");
    try{
      const response = await axios.get("http://localhost:8000/carrito/carro_id",{
        headers:{
          "Authorization": `${token}`
        }
      })
      return response.data;
    }catch(error){
      console.log(error);
    }
  } // this return an object with the carro data
    /*
      {
        id:number,
        clienteId:number,
        productos:[{itemId:number, cantidad:number}...]
      }
    */
  ```
- ```
  async function getItems(){
    let token = localStorage.getItem("token");
    try{
      const response = await axios.get("http://localhost:8000/items",{
        headers:{
          "Authorization": `${token}`
        }
      })
      return response.data;
    }catch(error){
      console.log(error);
    }
  } // this return an array with the items data
    /*
      {
        id:number,
        nombre:string,
        precio:number,
        descripcion:string,
        imagen:string
      }
    */
  ```

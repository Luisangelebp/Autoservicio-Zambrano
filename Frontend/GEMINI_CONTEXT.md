## Purpose

This document provides context and guidelines for using the GEMINI (Genomic Exploration of Multidimensional Information) framework. It outlines the key concepts, objectives, and best practices to ensure effective implementation and utilization of GEMINI in genomic data analysis.

## Key Concepts

-- **select the file "tienda.js"
-- **cosume the api http://localhost:8000/items to get all the items
-- **display the items in a list format on a web page
-- **each item should display its name, price, description and stock (cant) with a button to add many times the item to the cart
-- **implement a shopping cart that allows users to add items, view the total price, and remove items from the cart
-- **the cart cannot exceed the stock available for each item
-- **the item stock should be updated in real-time as items are added to or removed from the cart
-- **use the api http://localhost:8000/carrito to manage the shopping cart operations
-- the elements to send to the cart api are: clienteId, productos: [{itemId, cantidad}...]

## Examples

'-- Example 1: rendering products on the webpage

```javascript
const listaProductosDiv = document.getElementById('lista-productos');
const renderProductos = (productos) => {
    listaProductosDiv.innerHTML = '';
    productos.forEach((producto) => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('producto-card');
        productoCard.innerHTML = `
                <img src="http://localhost:8000/uploads/${producto.foto}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="descripcion">${producto.descripcion}</p>
                <p class="precio">${producto.precio} Bs.D</p>
                <button data-id="${producto.id}"><i class="fas fa-cart-plus"></i> Añadir al Carrito</button>
            `;
        listaProductosDiv.appendChild(productoCard);
    });
};
```

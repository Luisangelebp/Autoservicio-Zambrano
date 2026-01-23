document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const listaProductosDiv = document.getElementById('lista-productos');
    const itemsSeleccionadosDiv = document.getElementById(
        'items-seleccionados'
    );
    const totalCompraSpan = document.getElementById('total-compra');
    const btnPagar = document.getElementById('btn-pagar');
    const mensajeTienda = document.getElementById('mensaje-tienda');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const btnAtras = document.getElementById('btnAtras');

    let productos = [];
    let carrito = [];

    // --- Funciones de la tienda ---

    async function fetchProductos() {
        try {
            const response = await axios.get('http://localhost:8000/items', {
                headers: {
                    authorization: 12345,
                    'Content-Type': 'application/json',
                },
            });
            productos = await response.data;
            renderProductos(productos);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            mostrarMensaje(
                'No se pudieron cargar los productos. Intente más tarde.',
                'error'
            );
        }
    }

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
                <p class="stock" id="stock-${producto.id}">Stock: ${
                producto.cant
            }</p>
                <button data-id="${producto.id}" ${
                producto.cant === 0 ? 'disabled' : ''
            }><i class="fas fa-cart-plus"></i> Añadir al Carrito</button>
            `;
            listaProductosDiv.appendChild(productoCard);

            if (producto.cant === 0) {
                const stockDisplay = productoCard.querySelector(
                    `#stock-${producto.id}`
                );
                if (stockDisplay) stockDisplay.style.color = 'red';
            }
        });
    };

    const actualizarStockDisplay = (productoId) => {
        const producto = productos.find((p) => p.id === productoId);
        const itemEnCarrito = carrito.find((item) => item.id === productoId);
        const stockDisplay = document.getElementById(`stock-${productoId}`);
        const addButton = listaProductosDiv.querySelector(
            `button[data-id='${productoId}']`
        );

        if (producto && stockDisplay) {
            const stockRestante =
                producto.cant - (itemEnCarrito ? itemEnCarrito.cantidad : 0);
            stockDisplay.textContent = `Stock: ${stockRestante}`;

            if (stockRestante <= 0) {
                stockDisplay.style.color = 'red';
                if (addButton) {
                    addButton.disabled = true;
                }
            } else {
                stockDisplay.style.color = ''; // Revert to default color
                if (addButton) {
                    addButton.disabled = false;
                }
            }
        }
    };

    const actualizarCarritoUI = () => {
        itemsSeleccionadosDiv.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            emptyCartMessage.style.display = 'block';
            btnPagar.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            btnPagar.disabled = false;
            carrito.forEach((item) => {
                const itemResumen = document.createElement('div');
                itemResumen.classList.add('item-resumen');
                itemResumen.innerHTML = `
                    <span class="nombre-item">${item.nombre}</span>
                    <span class="cantidad">x${item.cantidad}</span>
                    <span class="precio-item">${(
                        item.precio * item.cantidad
                    ).toFixed(2)} Bs.D</span>
                    <button class="remove-item" data-id="${
                        item.id
                    }"><i class="fas fa-trash-alt"></i></button>
                `;
                itemsSeleccionadosDiv.appendChild(itemResumen);
                total += item.precio * item.cantidad;
            });
        }
        totalCompraSpan.textContent = total.toFixed(2);
    };

    const agregarAlCarrito = (productoId) => {
        const productoSeleccionado = productos.find((p) => p.id === productoId);
        if (!productoSeleccionado) return;

        const itemEnCarrito = carrito.find((item) => item.id === productoId);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

        if (cantidadEnCarrito < productoSeleccionado.cant) {
            if (itemEnCarrito) {
                itemEnCarrito.cantidad++;
            } else {
                carrito.push({ ...productoSeleccionado, cantidad: 1 });
            }
            mostrarMensaje(
                `"${productoSeleccionado.nombre}" añadido al carrito.`,
                'success'
            );
            actualizarCarritoUI();
            actualizarStockDisplay(productoId);
        } else {
            mostrarMensaje(
                `No hay más stock disponible para "${productoSeleccionado.nombre}".`,
                'error'
            );
        }
    };

    const removerDelCarrito = (productoId) => {
        const itemIndex = carrito.findIndex((item) => item.id === productoId);
        if (itemIndex > -1) {
            const nombreItem = carrito[itemIndex].nombre;
            if (carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad--;
                mostrarMensaje(
                    `Una unidad de "${nombreItem}" removida.`,
                    'info'
                );
            } else {
                carrito.splice(itemIndex, 1);
                mostrarMensaje(`"${nombreItem}" removido del carrito.`, 'info');
            }
            actualizarCarritoUI();
            actualizarStockDisplay(productoId);
        }
    };

    // --- Manejo de Eventos ---

    listaProductosDiv.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (button && button.dataset.id) {
            const productId = parseInt(button.dataset.id);
            agregarAlCarrito(productId);
        }
    });

    itemsSeleccionadosDiv.addEventListener('click', (event) => {
        const button = event.target.closest('.remove-item');
        if (button && button.dataset.id) {
            const productId = parseInt(button.dataset.id);
            removerDelCarrito(productId);
        }
    });

    btnPagar.addEventListener('click', async () => {
        if (carrito.length > 0) {
            const total = parseFloat(totalCompraSpan.textContent);
            const clienteId = 1; // Placeholder for customer ID

            const payload = {
                clienteId: clienteId,
                productos: carrito.map((item) => ({
                    itemId: item.id,
                    cantidad: item.cantidad,
                })),
            };

            try {
                const response = await axios.post(
                    'http://localhost:8000/carrito',
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 12345,
                        },
                    }
                );

                if (response.status === 200 || response.status === 201) {
                    let nombreRepuestoParaPago =
                        carrito.length === 1
                            ? carrito[0].nombre
                            : `Varios Repuestos (${carrito.length} ítems)`;

                    sessionStorage.setItem('montoAPagar', total.toFixed(2));
                    sessionStorage.setItem(
                        'nombreRepuesto',
                        nombreRepuestoParaPago
                    );
                    window.location.href = 'pago.html';
                } else {
                    mostrarMensaje(
                        'Error al procesar el carrito. Intente de nuevo.',
                        'error'
                    );
                }
            } catch (error) {
                console.error('Error al enviar el carrito:', error);
                mostrarMensaje(
                    'Error de conexión al procesar el pago.',
                    'error'
                );
            }
        } else {
            mostrarMensaje('El carrito está vacío.', 'error');
        }
    });

    btnAtras.addEventListener('click', () => {
        window.history.back();
    });

    // --- Funciones auxiliares ---

    const mostrarMensaje = (mensaje, tipo) => {
        mensajeTienda.textContent = mensaje;
        mensajeTienda.className = `message ${tipo}`;
        mensajeTienda.style.display = 'block';

        if (tipo !== 'error') {
            setTimeout(() => {
                mensajeTienda.style.display = 'none';
            }, 3000);
        }
    };

    // Inicializar la tienda
    fetchProductos();
    actualizarCarritoUI();
});

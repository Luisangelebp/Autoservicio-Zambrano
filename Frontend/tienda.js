document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const listaProductosDiv = document.getElementById('lista-productos');
    const itemsSeleccionadosDiv = document.getElementById(
        'items-seleccionados',
    );
    const totalCompraSpan = document.getElementById('total-compra');
    const btnPagar = document.getElementById('btn-pagar');
    const mensajeTienda = document.getElementById('mensaje-tienda');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const btnAtras = document.getElementById('btnAtras');

    let productos = [];
    let carrito = [];
    let clienteId = null;
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            clienteId = JSON.parse(userData).id;
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
        }
    }
    if (!clienteId) {
        console.warn(
            'Cliente ID not found in localStorage. Using placeholder ID 1.',
        );
        localStorage.clear();
        window.location.href = 'index.html';
    }
    let carritoId = null; // Stores the ID of the current shopping cart

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
            productos = productos.map((p) => ({ ...p, cant: Number(p.cant) })); // Ensure cant is a number
            renderProductos(productos);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            mostrarMensaje(
                'No se pudieron cargar los productos. Intente más tarde.',
                'error',
            );
        }
    }

    // New function to initialize or load the shopping cart
    async function inicializarCarrito() {
        try {
            const response = await axios.get(
                `http://localhost:8000/carrito/${clienteId}`,
                {
                    headers: {
                        authorization: 12345,
                    },
                },
            );

            if (response.data && response.data.id) {
                carritoId = response.data.id;
                const serverCartItems = response.data.productos || []; // Use .productos as clarified
                carrito = serverCartItems
                    .map((serverItem) => {
                        const product = productos.find(
                            (p) => p.id === serverItem.itemId,
                        );
                        if (product) {
                            return {
                                ...product,
                                cantidad: Number(serverItem.cantidad) || 0,
                            }; // Map server 'cant' to local 'cantidad', default to 0 if NaN
                        } else {
                            console.warn(
                                'Product not found for itemId:',
                                serverItem.itemId,
                                'in server cart.',
                            );
                            return null; // Filter out products not found
                        }
                    })
                    .filter((item) => item !== null);
                mostrarMensaje('Carrito existente cargado.', 'info');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Cart not found, create a new one
                try {
                    const createResponse = await axios.post(
                        'http://localhost:8000/carrito',
                        {
                            clienteId: clienteId,
                            productos: [],
                        },
                        {
                            headers: {
                                authorization: 12345,
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                    carritoId = createResponse.data.id;
                    carrito = [];
                    mostrarMensaje('Nuevo carrito creado.', 'info');
                } catch (createError) {
                    console.error('Error al crear el carrito:', createError);
                    mostrarMensaje(
                        'Error al crear el carrito. Intente más tarde.',
                        'error',
                    );
                }
            } else {
                console.error('Error al cargar el carrito:', error);
                mostrarMensaje(
                    'Error al cargar el carrito. Intente más tarde.',
                    'error',
                );
            }
        } finally {
            actualizarCarritoUI();
            carrito.forEach((item) => actualizarStockDisplay(item.id));
        }
    }

    // New function to update the cart on the server
    async function actualizarCarritoEnServidor() {
        if (!carritoId) {
            console.error('No carritoId disponible para actualizar.');
            return;
        }
        let productosToSend = carrito.map((item) => ({
            itemId: item.id,
            cantidad: item.cantidad,
        }));

        try {
            await axios.put(
                `http://localhost:8000/carrito/${carritoId}`,
                {
                    id: carritoId,
                    clienteId: clienteId,
                    productos: productosToSend,
                },
                {
                    headers: {
                        authorization: 12345,
                        'Content-Type': 'application/json',
                    },
                },
            );
            // mostrarMensaje('Carrito actualizado en el servidor.', 'success'); // Optional: too many messages
        } catch (error) {
            console.error(
                'Error al actualizar el carrito en el servidor:',
                error,
            );
            mostrarMensaje(
                'Error al sincronizar el carrito con el servidor.',
                'error',
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
                    `#stock-${producto.id}`,
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
            `button[data-id='${productoId}']`,
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
            console.log('Carrito actualizado:', carrito); // Log the updated cart
            carrito.forEach((item) => {
                const itemResumen = document.createElement('div');
                itemResumen.classList.add('item-resumen');
                itemResumen.innerHTML = `
                    <span class="nombre-item">${item.nombre}</span>
                    <span class="cantidad">x${item.cantidad}</span>
                    <span class="precio-item">${(
                        item.precio * item.cantidad
                    ).toFixed(2)} Bs</span>
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

    const agregarAlCarrito = async (productoId) => {
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
                'success',
            );
            actualizarCarritoUI();
            actualizarStockDisplay(productoId);
            await actualizarCarritoEnServidor(); // Update server after local change
        } else {
            mostrarMensaje(
                `No hay más stock disponible para "${productoSeleccionado.nombre}".`,
                'error',
            );
        }
    };

    const removerDelCarrito = async (productoId) => {
        const itemIndex = carrito.findIndex((item) => item.id === productoId);
        if (itemIndex > -1) {
            const nombreItem = carrito[itemIndex].nombre;
            if (carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad--;
                mostrarMensaje(
                    `Una unidad de "${nombreItem}" removida.`,
                    'info',
                );
            } else {
                carrito.splice(itemIndex, 1);
                mostrarMensaje(`"${nombreItem}" removido del carrito.`, 'info');
            }
            actualizarCarritoUI();
            actualizarStockDisplay(productoId);
            await actualizarCarritoEnServidor(); // Update server after local change
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
            // The cart should already be updated on the server by actualizarCarritoEnServidor
            // No need for an additional POST/PUT here unless there's a final "checkout" step
            // that requires a different endpoint. For now, just redirect.
            window.location.href = 'pago.html';
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
    async function inicializarTienda() {
        await fetchProductos(); // Ensure products are loaded first
        await inicializarCarrito(); // Initialize or load the cart after products are fetched
    }

    inicializarTienda();
});

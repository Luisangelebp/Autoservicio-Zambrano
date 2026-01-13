document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const listaProductosDiv = document.getElementById('lista-productos');
    const itemsSeleccionadosDiv = document.getElementById('items-seleccionados');
    const totalCompraSpan = document.getElementById('total-compra');
    const btnPagar = document.getElementById('btn-pagar');
    const mensajeTienda = document.getElementById('mensaje-tienda');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const btnAtras = document.getElementById('btnAtras');

    // Array de más de 50 repuestos con imágenes de placeholder
    const productos = [
        { id: 1, nombre: "Kit de frenos de disco (delanteros)", precio: 120.00, imagen: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Frenos+Del." },
        { id: 2, nombre: "Amortiguadores (par)", precio: 180.50, imagen: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Amortiguadores" },
        { id: 3, nombre: "Batería de alto rendimiento 12V", precio: 95.75, imagen: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Bateria+12V" },
        { id: 4, nombre: "Filtro de aire deportivo K&N", precio: 35.00, imagen: "https://via.placeholder.com/150/FFC300/FFFFFF?text=Filtro+Aire" },
        { id: 5, nombre: "Juego de bujías (4 unidades)", precio: 25.00, imagen: "https://via.placeholder.com/150/C70039/FFFFFF?text=Bujias+Set" },
        { id: 6, nombre: "Aceite de motor sintético (1 Litro)", precio: 12.00, imagen: "https://via.placeholder.com/150/8E44AD/FFFFFF?text=Aceite+Sint." },
        { id: 7, nombre: "Correa de distribución con tensor", precio: 50.00, imagen: "https://via.placeholder.com/150/1ABC9C/FFFFFF?text=Correa+Dist." },
        { id: 8, nombre: "Bomba de agua completa", precio: 70.00, imagen: "https://via.placeholder.com/150/2ECC71/FFFFFF?text=Bomba+Agua" },
        { id: 9, nombre: "Radiador de aluminio", precio: 150.00, imagen: "https://via.placeholder.com/150/E67E22/FFFFFF?text=Radiador" },
        { id: 10, nombre: "Neumático (unidad) R15", precio: 80.00, imagen: "https://via.placeholder.com/150/F1C40F/FFFFFF?text=Neumatico+R15" },
        { id: 11, nombre: "Discos de freno traseros (par)", precio: 90.00, imagen: "https://via.placeholder.com/150/E74C3C/FFFFFF?text=Frenos+Tras." },
        { id: 12, nombre: "Pastillas de freno cerámicas", precio: 40.00, imagen: "https://via.placeholder.com/150/9B59B6/FFFFFF?text=Pastillas+Cer." },
        { id: 13, nombre: "Cables de bujía (juego)", precio: 18.50, imagen: "https://via.placeholder.com/150/3498DB/FFFFFF?text=Cables+Bujia" },
        { id: 14, nombre: "Bobina de encendido", precio: 55.00, imagen: "https://via.placeholder.com/150/27AE60/FFFFFF?text=Bobina+Enc." },
        { id: 15, nombre: "Alternador", precio: 160.00, imagen: "https://via.placeholder.com/150/D35400/FFFFFF?text=Alternador" },
        { id: 16, nombre: "Motor de arranque", precio: 130.00, imagen: "https://via.placeholder.com/150/2C3E50/FFFFFF?text=Arranque" },
        { id: 17, nombre: "Bomba de gasolina eléctrica", precio: 75.00, imagen: "https://via.placeholder.com/150/7F8C8D/FFFFFF?text=Bomba+Gas." },
        { id: 18, nombre: "Filtro de gasolina", precio: 10.00, imagen: "https://via.placeholder.com/150/95A5A6/FFFFFF?text=Filtro+Gas." },
        { id: 19, nombre: "Termostato del motor", precio: 15.00, imagen: "https://via.placeholder.com/150/BDC3C7/FFFFFF?text=Termostato" },
        { id: 20, nombre: "Manguera de radiador superior", precio: 22.00, imagen: "https://via.placeholder.com/150/ECF0F1/FFFFFF?text=Manguera+Rad." },
        { id: 21, nombre: "Deposito de expansión (refrigerante)", precio: 28.00, imagen: "https://via.placeholder.com/150/9B59B6/FFFFFF?text=Dep.+Expans." },
        { id: 22, nombre: "Cremallera de dirección", precio: 220.00, imagen: "https://via.placeholder.com/150/E74C3C/FFFFFF?text=Cremallera" },
        { id: 23, nombre: "Terminal de dirección", precio: 20.00, imagen: "https://via.placeholder.com/150/3498DB/FFFFFF?text=Terminal+Dir." },
        { id: 24, nombre: "Rotula inferior", precio: 25.00, imagen: "https://via.placeholder.com/150/2ECC71/FFFFFF?text=Rotula+Inf." },
        { id: 25, nombre: "Rodamiento de rueda (delantero)", precio: 45.00, imagen: "https://via.placeholder.com/150/D35400/FFFFFF?text=Rodam.+Del." },
        { id: 26, nombre: "Disco de embrague", precio: 80.00, imagen: "https://via.placeholder.com/150/2C3E50/FFFFFF?text=Disco+Embr." },
        { id: 27, nombre: "Plato de presión (clutch)", precio: 70.00, imagen: "https://via.placeholder.com/150/7F8C8D/FFFFFF?text=Plato+Pres." },
        { id: 28, nombre: "Cilindro maestro de freno", precio: 60.00, imagen: "https://via.placeholder.com/150/95A5A6/FFFFFF?text=Cilindro+Freno" },
        { id: 29, nombre: "Bomba de dirección asistida", precio: 110.00, imagen: "https://via.placeholder.com/150/BDC3C7/FFFFFF?text=Bomba+Dir." },
        { id: 30, nombre: "Soporte de motor (derecho)", precio: 30.00, imagen: "https://via.placeholder.com/150/ECF0F1/FFFFFF?text=Soporte+Motor+D" },
        { id: 31, nombre: "Soporte de motor (izquierdo)", precio: 30.00, imagen: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Soporte+Motor+I" },
        { id: 32, nombre: "Sensor de oxígeno (O2)", precio: 48.00, imagen: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Sensor+O2" },
        { id: 33, nombre: "Sensor de posición de cigüeñal (CKP)", precio: 40.00, imagen: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Sensor+CKP" },
        { id: 34, nombre: "Válvula PCV", precio: 15.00, imagen: "https://via.placeholder.com/150/FFC300/FFFFFF?text=Valvula+PCV" },
        { id: 35, nombre: "Junta de culata", precio: 65.00, imagen: "https://via.placeholder.com/150/C70039/FFFFFF?text=Junta+Culata" },
        { id: 36, nombre: "Kit de empaques de motor", precio: 90.00, imagen: "https://via.placeholder.com/150/8E44AD/FFFFFF?text=Empaques+Motor" },
        { id: 37, nombre: "Bielas (juego)", precio: 140.00, imagen: "https://via.placeholder.com/150/1ABC9C/FFFFFF?text=Bielas" },
        { id: 38, nombre: "Pistones (juego)", precio: 160.00, imagen: "https://via.placeholder.com/150/2ECC71/FFFFFF?text=Pistones" },
        { id: 39, nombre: "Anillos de pistón (juego)", precio: 50.00, imagen: "https://via.placeholder.com/150/E67E22/FFFFFF?text=Anillos+Piston" },
        { id: 40, nombre: "Válvulas de admisión (unidad)", precio: 18.00, imagen: "https://via.placeholder.com/150/F1C40F/FFFFFF?text=Valvula+Adm." },
        { id: 41, nombre: "Válvulas de escape (unidad)", precio: 19.00, imagen: "https://via.placeholder.com/150/E74C3C/FFFFFF?text=Valvula+Esc." },
        { id: 42, nombre: "Bomba de aceite", precio: 85.00, imagen: "https://via.placeholder.com/150/9B59B6/FFFFFF?text=Bomba+Aceite" },
        { id: 43, nombre: "Cárter de aceite", precio: 70.00, imagen: "https://via.placeholder.com/150/3498DB/FFFFFF?text=Carter+Aceite" },
        { id: 44, nombre: "Eje de levas", precio: 100.00, imagen: "https://via.placeholder.com/150/27AE60/FFFFFF?text=Eje+Levas" },
        { id: 45, nombre: "Tensor de cadena de tiempo", precio: 40.00, imagen: "https://via.placeholder.com/150/D35400/FFFFFF?text=Tensor+Cadena" },
        { id: 46, nombre: "Cadena de tiempo", precio: 60.00, imagen: "https://via.placeholder.com/150/2C3E50/FFFFFF?text=Cadena+Tiempo" },
        { id: 47, nombre: "Múltiple de escape", precio: 150.00, imagen: "https://via.placeholder.com/150/7F8C8D/FFFFFF?text=Multiple+Esc." },
        { id: 48, nombre: "Catalizador universal", precio: 200.00, imagen: "https://via.placeholder.com/150/95A5A6/FFFFFF?text=Catalizador" },
        { id: 49, nombre: "Silenciador de escape", precio: 75.00, imagen: "https://via.placeholder.com/150/BDC3C7/FFFFFF?text=Silenciador" },
        { id: 50, nombre: "Sonda Lambda", precio: 55.00, imagen: "https://via.placeholder.com/150/ECF0F1/FFFFFF?text=Sonda+Lambda" },
        { id: 51, nombre: "Caja de cambios (reconstruida)", precio: 450.00, imagen: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Caja+Cambios" },
        { id: 52, nombre: "Aceite de transmisión automática", precio: 25.00, imagen: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Aceite+Trans." },
        { id: 53, nombre: "Filtro de transmisión", precio: 30.00, imagen: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Filtro+Trans." },
        { id: 54, nombre: "Junta homocinética (CV Joint)", precio: 60.00, imagen: "https://via.placeholder.com/150/FFC300/FFFFFF?text=Junta+CV" },
        { id: 55, nombre: "Eje de transmisión (palier)", precio: 180.00, imagen: "https://via.placeholder.com/150/C70039/FFFFFF?text=Eje+Trans." },
        { id: 56, nombre: "Kit de reparación de carburador", precio: 45.00, imagen: "https://via.placeholder.com/150/8E44AD/FFFFFF?text=Kit+Carb." },
        { id: 57, nombre: "Inyector de combustible", precio: 70.00, imagen: "https://via.placeholder.com/150/1ABC9C/FFFFFF?text=Inyector" },
        { id: 58, nombre: "Bomba de inyección", precio: 300.00, imagen: "https://via.placeholder.com/150/2ECC71/FFFFFF?text=Bomba+Iny." },
        { id: 59, nombre: "Regulador de presión de combustible", precio: 35.00, imagen: "https://via.placeholder.com/150/E67E22/FFFFFF?text=Reg.+Presion" },
        { id: 60, nombre: "Módulo de control del motor (ECU)", precio: 250.00, imagen: "https://via.placeholder.com/150/F1C40F/FFFFFF?text=ECU" }
    ];

    // Carrito de compras (almacena { id, nombre, precio, cantidad })
    let carrito = [];

    // --- Funciones de la tienda ---

    // Renderiza los productos en la interfaz
    const renderProductos = () => {
        listaProductosDiv.innerHTML = '';
        productos.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto-card');
            productoCard.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">${producto.precio.toFixed(2)} Bs.D</p>
                <button data-id="${producto.id}"><i class="fas fa-cart-plus"></i> Añadir al Carrito</button>
            `;
            listaProductosDiv.appendChild(productoCard);
        });
    };

    // Actualiza el resumen del carrito en la interfaz
    const actualizarCarritoUI = () => {
        itemsSeleccionadosDiv.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            emptyCartMessage.style.display = 'block';
            btnPagar.disabled = true; // Deshabilita el botón si no hay ítems
        } else {
            emptyCartMessage.style.display = 'none';
            btnPagar.disabled = false; // Habilita el botón si hay ítems
            carrito.forEach(item => {
                const itemResumen = document.createElement('div');
                itemResumen.classList.add('item-resumen');
                itemResumen.innerHTML = `
                    <span class="nombre-item">${item.nombre}</span>
                    <span class="cantidad">x${item.cantidad}</span>
                    <span class="precio-item">${(item.precio * item.cantidad).toFixed(2)} Bs.D</span>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                `;
                itemsSeleccionadosDiv.appendChild(itemResumen);
                total += item.precio * item.cantidad;
            });
        }
        totalCompraSpan.textContent = total.toFixed(2);
    };

    // Añade un producto al carrito
    const agregarAlCarrito = (productoId) => {
        const productoExistente = carrito.find(item => item.id === productoId);
        const productoSeleccionado = productos.find(p => p.id === productoId);

        if (productoSeleccionado) {
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({ ...productoSeleccionado, cantidad: 1 });
            }
            mostrarMensaje(`"${productoSeleccionado.nombre}" añadido al carrito.`, 'success');
        }
        actualizarCarritoUI();
    };

    // Remueve un producto del carrito
    const removerDelCarrito = (productoId) => {
        const itemIndex = carrito.findIndex(item => item.id === productoId);
        if (itemIndex > -1) {
            const nombreItem = carrito[itemIndex].nombre;
            if (carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad--;
                mostrarMensaje(`Una unidad de "${nombreItem}" removida.`, 'info');
            } else {
                carrito.splice(itemIndex, 1);
                mostrarMensaje(`"${nombreItem}" removido del carrito.`, 'info');
            }
        }
        actualizarCarritoUI();
    };

    // --- Manejo de Eventos ---

    // Event listener para los botones "Agregar al Carrito" en la lista de productos
    listaProductosDiv.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
            const button = event.target.closest('button');
            if (button && button.dataset.id) {
                const productId = parseInt(button.dataset.id);
                agregarAlCarrito(productId);
            }
        }
    });

    // Event listener para los botones "Remover" del resumen de compra
    itemsSeleccionadosDiv.addEventListener('click', (event) => {
        if (event.target.closest('.remove-item')) {
            const productId = parseInt(event.target.closest('.remove-item').dataset.id);
            removerDelCarrito(productId);
        }
    });

    // Event listener para el botón "Proceder al Pago"
    btnPagar.addEventListener('click', () => {
        if (carrito.length > 0) {
            const total = parseFloat(totalCompraSpan.textContent);
            
            // Determinar el nombre del repuesto a pasar al pago
            let nombreRepuestoParaPago = "";
            if (carrito.length === 1) {
                nombreRepuestoParaPago = carrito[0].nombre;
            } else {
                nombreRepuestoParaPago = "Varios Repuestos (" + carrito.length + " ítems)";
            }

            // Almacenar el monto y el nombre del repuesto en sessionStorage para que pago.html los lea
            sessionStorage.setItem('montoAPagar', total.toFixed(2));
            sessionStorage.setItem('nombreRepuesto', nombreRepuestoParaPago);
            
            // Redirige a la página de pago
            window.location.href = 'pago.html'; // Asegúrate de que 'pago.html' esté en el mismo directorio
        } else {
            mostrarMensaje('El carrito está vacío. Por favor, agrega un repuesto para proceder al pago.', 'error');
        }
    });

    // Event listener para el botón "Atrás"
    btnAtras.addEventListener('click', () => {
        window.history.back(); // Regresa a la página anterior en el historial del navegador
    });

    // --- Funciones auxiliares ---

    // Muestra mensajes al usuario
    const mostrarMensaje = (mensaje, tipo) => {
        mensajeTienda.textContent = mensaje;
        mensajeTienda.className = `message ${tipo}`;
        mensajeTienda.style.display = 'block';

        // Oculta el mensaje después de 3 segundos si no es de error persistente
        if (tipo !== 'error') {
            setTimeout(() => {
                mensajeTienda.style.display = 'none';
            }, 3000);
        }
    };

    // Inicializar la tienda al cargar la página
    renderProductos();
    actualizarCarritoUI();
});
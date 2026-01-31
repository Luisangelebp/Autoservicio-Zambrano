document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const citaContainer = document.querySelector('.citaContainer');
    const carroContainer = document.querySelector('.carroContainer');
    const pagoInfo = document.getElementById('pago-info');
    const pagoButtons = document.getElementById('pago-buttons');
    const efectivoBtn = document.getElementById('efectivo-btn');
    const tarjetaBtn = document.getElementById('tarjeta-btn');
    const pagoMovilBtn = document.getElementById('pago-movil-btn');
    const pagoMovilInfo = document.getElementById('pago-movil-info');
    const pagoMovilForm = document.getElementById('pago-movil-form');
    const bancoSelect = document.getElementById('banco');
    const btnAtras = document.getElementById('regresar-btn');

    let selectedItem = null; // { type: 'cita' | 'carro', id: number, element: HTMLElement, mount: number }

    const bancosOptions = [
        'Banco de Venezuela',
        'Banco Venezolano de Crédito',
        'Banco Mercantil',
        'Banco Provincial',
        'Bancaribe',
        'Banco Exterior',
        'Banco Caroní',
        'Banesco Banco Universal',
        'Banco Sofitasa',
        'Banco Plaza',
        'Bangente',
        'Banco Fondo Común',
        '100% Banco',
        'DelSur Banco Universal',
        'Banco del Tesoro',
        'Banco Agrícola de Venezuela',
        'Bancrecer',
        'Mi Banco',
        'Banco Activo',
        'Bancamiga',
        'Banco Internacional de Desarrollo',
        'Banplus',
        'Banco Bicentenario del Pueblo',
        'BANFANB',
        'Banco Nacional de Crédito',
        'Instituto Municipal de Crédito Popular',
    ];

    bancosOptions.forEach((banco) => {
        const option = document.createElement('option');
        option.value = banco;
        option.textContent = banco;
        bancoSelect.appendChild(option);
    });

    btnAtras.addEventListener('click', () => {
        window.history.back();
    });

    async function getCitaData() {
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:8000/citas', {
                headers: { authorization: `${token}` },
            });

            const citasDelUsuario = response.data.filter(
                (cita) =>
                    cita.id_cliente === user.id && cita.estado === 'confirmada',
            );
            renderCitas(citasDelUsuario);
        } catch (error) {
            console.error('Error fetching citas:', error);
            citaContainer.innerHTML = '<p>Error al cargar las citas.</p>';
        }
    }

    async function getCarroData() {
        if (!token || !user) return;
        try {
            // The context mentions /carrito/carro_id but it should probably be a general one for the user
            const response = await axios.get(
                `http://localhost:8000/carrito/${user.id}`,
                {
                    headers: { authorization: `${token}` },
                },
            );
            if (response.data) {
                const allItems = await getItems();
                renderCarro(response.data, allItems);
            }
        } catch (error) {
            console.error('Error fetching carrito:', error);
            if (error.response.status === 404) {
                carroContainer.innerHTML =
                    '<p>No tienes productos en tu carrito.</p>';
            }
        }
    }

    async function getItems() {
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:8000/items', {
                headers: { Authorization: `${token}` },
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function createOrder(clienteId) {
        const carroResponse = await axios.get(
            `http://localhost:8000/carrito/${clienteId}`,
            {
                headers: { authorization: `${token}` },
            },
        );

        const allItems = await getItems();

        const productos = carroResponse.data.productos.map((producto) => {
            const itemDetails = allItems.find(
                (item) => item.id === producto.itemId,
            );
            if (!itemDetails) {
                throw new Error(`Item with id ${producto.itemId} not found`);
            }
            return {
                itemId: producto.itemId,
                cantidad: producto.cantidad,
                montoU: itemDetails.precio,
            };
        });

        const ordenBody = {
            clienteId: clienteId,
            entregado: false,
            productos: productos,
        };

        const response = await axios.post(
            'http://localhost:8000/ordenes',
            ordenBody,
            { headers: { authorization: `${token}` } },
        );

        return response.data;
    }

    async function payCitaOCarrito(
        confirm,
        citaOCarro,
        id_cliente,
        cita_id,
        method,
        mount,
        data,
    ) {
        if (!token) return;
        let body = {};

        if (citaOCarro === 'carro') {
            try {
                const orden = await createOrder(id_cliente);
                console.log('Orden creada:', orden);
                if (orden) {
                    body['ordenId'] = orden.ordenId;
                } else {
                    alert('Hubo un error al crear la orden de compra.');
                    return;
                }
            } catch (error) {
                console.error('Error al crear la orden:', error);
                alert('Hubo un error al crear la orden de compra.');
                return;
            }
        } else {
            body['citaId'] = cita_id;
        }

        body['clienteId'] = id_cliente;
        console.log(method);
        body['metodoPago'] = `${method}`;

        if (method.toLowerCase() === 'pago movil') {
            body['fecha'] = data.fecha;
            body['confirmado'] = confirm;
            body['banco'] = data.banco;
            body['referencia'] = data.referencia;
            body['monto'] = data.monto;
        } else {
            body['monto'] = mount;
            body['fecha'] = new Date().toISOString();
        }
        try {
            const response = await axios.post(
                'http://localhost:8000/pagos',
                body,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            let s = document.createElement('strong');
            s.textContent = 'Pago exitoso, redirigiendo...';
            document.getElementById('pago-info').appendChild(s);
            setTimeout(() => {
                window.location.href = 'pg_principal suario.html';
            }, 3000);
        } catch (error) {
            console.error('Error en el pago:', error);
            alert('Hubo un error al procesar el pago.');
        }
    }

    function renderCitas(citas) {
        citaContainer.innerHTML = '';
        if (citas.length === 0) {
            citaContainer.innerHTML =
                '<p>No tienes citas confirmadas para pagar.</p>';
            return;
        }
        citas.forEach((cita) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>Cita #${cita.id}</h4>
                <p>Fecha: ${cita.fecha}</p>
                <p>Descripcion: ${cita.descripcion}</p>
                <p>Monto a pagar: <strong>$${cita.monto}</strong></p>
            `;
            card.addEventListener('click', () =>
                handleSelect('cita', cita.id, card, cita.monto),
            );
            citaContainer.appendChild(card);
        });
    }

    function renderCarro(carro, allItems) {
        carroContainer.innerHTML = '';
        if (!carro || carro.productos.length === 0) {
            carroContainer.innerHTML =
                '<p>Tu carrito de compras está vacío.</p>';
            return;
        }

        let totalCarro = 0;
        const card = document.createElement('div');
        card.className = 'card';
        let innerHTML = `<h4>Carrito de Compras</h4>`;

        carro.productos.forEach((producto) => {
            const itemDetails = allItems.find(
                (item) => item.id === producto.itemId,
            );
            if (itemDetails) {
                totalCarro += itemDetails.precio * producto.cantidad;
                innerHTML += `<p>${itemDetails.nombre} x ${producto.cantidad} - $${(itemDetails.precio * producto.cantidad).toFixed(2)}</p>`;
            }
        });

        innerHTML += `<p>Monto a pagar: <strong>$${totalCarro.toFixed(2)}</strong></p>`;
        card.innerHTML = innerHTML;
        card.addEventListener('click', () =>
            handleSelect('carro', carro.id, card, totalCarro),
        );
        carroContainer.appendChild(card);
    }

    function handleSelect(type, id, element, mount) {
        if (selectedItem && selectedItem.element) {
            selectedItem.element.classList.remove('selected');
        }

        selectedItem = { type, id, element, mount };
        element.classList.add('selected');

        pagoInfo.innerHTML = `
            <p>Has seleccionado: <strong>${type.charAt(0).toUpperCase() + type.slice(1)} #${id}</strong></p>
            <p>Monto: <strong>$${mount.toFixed(2)}</strong></p>
        `;
        pagoButtons.style.display = 'block';
    }

    function resetPaymentView() {
        pagoMovilInfo.style.display = 'none';
        pagoMovilForm.style.display = 'none';
        pagoMovilForm.reset();
    }

    efectivoBtn.addEventListener('click', () => {
        if (!selectedItem) {
            alert('Por favor, selecciona una cita o un carrito para pagar.');
            return;
        }
        payCitaOCarrito(
            true,
            selectedItem.type,
            user.id,
            selectedItem.id,
            'efectivo',
            selectedItem.mount,
        );
    });

    tarjetaBtn.addEventListener('click', () => {
        if (!selectedItem) {
            alert('Por favor, selecciona una cita o un carrito para pagar.');
            return;
        }
        payCitaOCarrito(
            true,
            selectedItem.type,
            user.id,
            selectedItem.id,
            'tarjeta',
            selectedItem.mount,
        );
    });

    pagoMovilBtn.addEventListener('click', () => {
        if (!selectedItem) {
            alert('Por favor, selecciona una cita o un carrito para pagar.');
            return;
        }
        pagoMovilInfo.style.display = 'block';
        pagoMovilForm.style.display = 'flex';
        pagoMovilForm.querySelector('#monto').value =
            selectedItem.mount.toFixed(2);
    });

    pagoMovilForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!selectedItem) return;

        const formData = new FormData(pagoMovilForm);
        const data = {
            fecha: formData.get('fecha'),
            referencia: formData.get('referencia'),
            monto: parseFloat(formData.get('monto')),
            banco: formData.get('banco'),
        };

        payCitaOCarrito(
            false,
            selectedItem.type,
            user.id,
            selectedItem.id,
            'pago movil',
            selectedItem.mount,
            data,
        );
    });

    // Initial data fetch
    getCitaData();
    getCarroData();
});

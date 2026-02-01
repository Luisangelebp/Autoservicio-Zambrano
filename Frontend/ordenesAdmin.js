const BASE_URL = 'http://localhost:8000';

function getToken() {
    return localStorage.getItem('token');
}

async function fetchData(endpoint) {
    const token = getToken();
    if (!token) {
        console.error('No se encontró el token de autenticación.');
        // Optionally redirect to login page
        window.location.href = 'login.html';
        return null;
    }

    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, redirect to login
            window.location.href = 'login.html';
        }
        return null;
    }
}

async function patchData(endpoint, data) {
    const token = getToken();
    if (!token) {
        console.error('No se encontró el token de autenticación.');
        window.location.href = 'login.html';
        return null;
    }

    try {
        const response = await axios.patch(`${BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error patching data to ${endpoint}:`, error);
        if (error.response && error.response.status === 401) {
            window.location.href = 'login.html';
        }
        return null;
    }
}

let allOrders = [];
let allClients = [];
let allItems = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    setupFilters();
    renderOrders(allOrders);
});

async function loadInitialData() {
    const [orders, clients, items] = await Promise.all([
        fetchData('/ordenes'),
        fetchData('/clientes'),
        fetchData('/items')
    ]);
    allOrders = orders || [];
    allClients = clients || [];
    allItems = items || [];

    populateClientFilter(allClients);
}

function populateClientFilter(clients) {
    const clientFilter = document.getElementById('cliente-filter');
    clientFilter.innerHTML = '<option value="todos">Todos</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.nombre;
        clientFilter.appendChild(option);
    });
}

function setupFilters() {
    const fechaFilter = document.getElementById('fecha-filter');
    const entregadoFilter = document.getElementById('entregado-filter');
    const clientFilter = document.getElementById('cliente-filter');

    fechaFilter.addEventListener('change', applyFilters);
    entregadoFilter.addEventListener('change', applyFilters);
    clientFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const fechaFilter = document.getElementById('fecha-filter').value;
    const entregadoFilter = document.getElementById('entregado-filter').value;
    const clientFilter = document.getElementById('cliente-filter').value;

    let filteredOrders = [...allOrders];

    if (fechaFilter) {
        filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.fecha).toISOString().split('T')[0];
            return orderDate === fechaFilter;
        });
    }

    if (entregadoFilter !== 'todas') {
        const isEntregado = entregadoFilter === 'true';
        filteredOrders = filteredOrders.filter(order => order.entregado === isEntregado);
    }

    if (clientFilter !== 'todos') {
        filteredOrders = filteredOrders.filter(order => order.clienteId === parseInt(clientFilter));
    }

    renderOrders(filteredOrders);
}

function renderOrders(ordersToRender) {
    const ordenesContainer = document.getElementById('ordenes-container');
    ordenesContainer.innerHTML = '';

    if (ordersToRender.length === 0) {
        ordenesContainer.innerHTML = '<p>No hay órdenes para mostrar.</p>';
        return;
    }

    ordersToRender.forEach(order => {
        const orderCard = createOrderCard(order);
        ordenesContainer.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const client = allClients.find(c => c.id === order.clienteId);
    const clientName = client ? client.nombre : 'Cliente Desconocido';
    const orderDate = new Date(order.fecha).toLocaleDateString();
    const totalAmount = order.productos.reduce((sum, prod) => sum + (prod.cantidad * prod.montoU), 0);

    const card = document.createElement('div');
    card.classList.add('orden-card');
    if (order.entregado) {
        card.classList.add('entregado');
    }

    let productsHtml = '<ul>';
    order.productos.forEach(prod => {
        const item = allItems.find(i => i.id === prod.itemId);
        const itemName = item ? item.nombre : 'Producto Desconocido';
        productsHtml += `<li>${itemName} (x${prod.cantidad}) - $${prod.montoU.toFixed(2)}</li>`;
    });
    productsHtml += '</ul>';

    card.innerHTML = `
        <h3>Orden #${order.id}</h3>
        <p><strong>Cliente:</strong> ${clientName}</p>
        <p><strong>Fecha:</strong> ${orderDate}</p>
        <p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
        <p><strong>Estado:</strong> ${order.entregado ? 'Entregado' : 'Pendiente'}</p>
        <h4>Productos:</h4>
        ${productsHtml}
    `;

    if (!order.entregado) {
        const deliverButton = document.createElement('button');
        deliverButton.textContent = 'Marcar como Entregado';
        deliverButton.classList.add('deliver-button');
        deliverButton.addEventListener('click', () => toggleEntregado(order.id, order.entregado));
        card.appendChild(deliverButton);
    }

    return card;
}

async function toggleEntregado(orderId, currentStatus) {
    const updatedOrder = await patchData(`/ordenes/${orderId}`, { entregado: !currentStatus });
    if (updatedOrder) {
        // Update the order in our local allOrders array
        const index = allOrders.findIndex(order => order.id === orderId);
        if (index !== -1) {
            allOrders[index].entregado = updatedOrder.entregado;
        }
        applyFilters(); // Re-render orders to reflect the change and re-apply current filters
    }
}
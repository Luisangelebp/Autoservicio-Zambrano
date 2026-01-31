document.addEventListener('DOMContentLoaded', () => {
    const ordenesContainer = document.getElementById('ordenes-container');
    const entregadoFilter = document.getElementById('entregado-filter');
    const sortBy = document.getElementById('sort-by');

    const cliente = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!cliente || !token) {
        window.location.href = '../login.html';
        return;
    }
    const clienteId = JSON.parse(cliente).id;

    let ordenes = [];

    const fetchOrdenes = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/ordenes/${clienteId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            ordenes = response.data;
            renderOrdenes();
        } catch (error) {
            console.error('Error fetching ordenes:', error);
            ordenesContainer.innerHTML =
                '<p>Error al cargar las órdenes. Por favor, intente más tarde.</p>';
        }
    };

    const renderOrdenes = () => {
        ordenesContainer.innerHTML = '';

        let ordenesFiltradas = [...ordenes];

        // Filtrar por estado de entrega
        if (entregadoFilter.value === 'entregado') {
            ordenesFiltradas = ordenesFiltradas.filter(
                (orden) => orden.entregado,
            );
        } else if (entregadoFilter.value === 'pendiente') {
            ordenesFiltradas = ordenesFiltradas.filter(
                (orden) => !orden.entregado,
            );
        }

        // Ordenar
        switch (sortBy.value) {
            case 'fecha-desc':
                ordenesFiltradas.sort(
                    (a, b) => new Date(b.fecha) - new Date(a.fecha),
                );
                break;
            case 'fecha-asc':
                ordenesFiltradas.sort(
                    (a, b) => new Date(a.fecha) - new Date(b.fecha),
                );
                break;
            case 'monto-desc':
                ordenesFiltradas.sort((a, b) => b.montoTotal - a.montoTotal);
                break;
            case 'monto-asc':
                ordenesFiltradas.sort((a, b) => a.montoTotal - b.montoTotal);
                break;
        }

        if (ordenesFiltradas.length === 0) {
            ordenesContainer.innerHTML = '<p>No hay órdenes para mostrar.</p>';
            return;
        }

        ordenesFiltradas.forEach((orden) => {
            const card = document.createElement('div');
            card.className = 'orden-card';
            if (orden.entregado) {
                card.classList.add('entregado');
            }

            const productosHtml = orden.productos
                .map(
                    (p) =>
                        `<li>${p.cantidad} x Item ${p.itemId} - $${p.montoU.toFixed(2)} c/u</li>`,
                )
                .join('');
            let montoTotal = 0;
            orden.productos.forEach((producto) => {
                montoTotal += producto.montoU * producto.cantidad;
            });
            card.innerHTML = `
                <h3>Orden #${orden.id}</h3>
                <p><strong>Fecha:</strong> ${new Date(orden.fecha).toLocaleDateString()}</p>
                <p><strong>Monto Total:</strong> $${montoTotal.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${orden.entregado ? 'Entregado' : 'Pendiente'}</p>
                <h4>Productos:</h4>
                <ul>${productosHtml}</ul>
            `;
            ordenesContainer.appendChild(card);
        });
    };

    entregadoFilter.addEventListener('change', renderOrdenes);
    sortBy.addEventListener('change', renderOrdenes);

    fetchOrdenes();
});

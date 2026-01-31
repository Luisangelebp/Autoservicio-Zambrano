document.addEventListener('DOMContentLoaded', () => {
    const listaCitasDiv = document.getElementById('listaCitas');
    const btnAtras = document.getElementById('btnAtras');
    const filterStatus = document.getElementById('filterStatus');
    const filterDate = document.getElementById('filterDate');
    const paginationDiv = document.getElementById('pagination');

    const API_URL_CITAS = 'http://localhost:8000/citas';
    const API_URL_CLIENTES = 'http://localhost:8000/clientes';
    const API_URL_MECANICOS = 'http://localhost:8000/mecanicos'; // New API URL for mechanics
    const ITEMS_PER_PAGE = 6; // Number of appointments per page
    let currentPage = 1;
    let allCitas = []; // To store all fetched appointments
    let clientesMap = new Map(); // To store clients for easy lookup
    let mecanicosMap = new Map(); // To store mechanics for easy lookup
    let currentCitaIdForMonto = null; // To keep track of which cita is being assigned a monto

    // Modal elements
    const montoModal = document.getElementById('montoModal');
    const closeButton = montoModal.querySelector('.close-button');
    const montoInput = document.getElementById('montoInput');
    const saveMontoBtn = document.getElementById('saveMontoBtn');

    // Function to get token from localStorage
    const getToken = () => localStorage.getItem('token');

    // Function to fetch clients from the API
    const fetchClientes = async () => {
        const token = getToken();
        if (!token) {
            console.error('No token found. Cannot fetch clients.');
            return;
        }
        try {
            const response = await axios.get(API_URL_CLIENTES, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            });
            response.data.forEach((cliente) => {
                clientesMap.set(cliente.id, cliente);
            });
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    // Function to fetch mechanics from the API
    const fetchMecanicos = async () => {
        const token = getToken();
        if (!token) {
            console.error('No token found. Cannot fetch mechanics.');
            return;
        }
        try {
            const response = await axios.get(API_URL_MECANICOS, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            });
            response.data.forEach((mecanico) => {
                mecanicosMap.set(mecanico.id, mecanico);
            });
        } catch (error) {
            console.error('Error fetching mechanics:', error);
        }
    };

    // Function to fetch appointments from the API
    const fetchCitas = async () => {
        const token = getToken();

        if (!token) {
            listaCitasDiv.innerHTML =
                '<p class="empty-list-message">Por favor, inicia sesión para ver tus citas.</p>';
            return;
        }

        try {
            // Fetch clients and mechanics first
            await Promise.all([fetchClientes(), fetchMecanicos()]);

            const response = await axios.get(API_URL_CITAS, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            });
            // Admin view: show all appointments
            allCitas = response.data;
            applyFiltersAndRender();
        } catch (error) {
            console.error('Error fetching citas:', error);
            listaCitasDiv.innerHTML =
                '<p class="empty-list-message">Error al cargar las citas. Inténtalo de nuevo más tarde.</p>';
        }
    };

    // Function to apply filters and render appointments
    const applyFiltersAndRender = () => {
        let filteredCitas = [...allCitas];

        // Filter by status
        const status = filterStatus.value;
        if (status) {
            filteredCitas = filteredCitas.filter(
                (cita) => cita.estado === status,
            );
        }

        // Filter by date
        const date = filterDate.value;
        if (date) {
            filteredCitas = filteredCitas.filter((cita) => cita.fecha === date);
        }

        // Sort appointments by date and time (most recent first)
        filteredCitas.sort((a, b) => {
            const dateTimeA = new Date(`${a.fecha}T${a.hora}`);
            const dateTimeB = new Date(`${b.fecha}T${b.hora}`);
            return dateTimeB - dateTimeA; // Descending order
        });

        renderCitas(filteredCitas);
        renderPagination(filteredCitas.length);
    };

    // Function to render appointments in the interface
    const renderCitas = (citasToRender) => {
        listaCitasDiv.innerHTML = ''; // Clear current content

        if (citasToRender.length === 0) {
            listaCitasDiv.innerHTML =
                '<p class="empty-list-message">No tienes citas agendadas que coincidan con los filtros.</p>';
            return;
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedCitas = citasToRender.slice(startIndex, endIndex);

        paginatedCitas.forEach((cita) => {
            const citaCard = document.createElement('div');
            citaCard.classList.add('cita-card');

            // Get client information
            const cliente = clientesMap.get(cita.id_cliente);
            const clientName = cliente
                ? `${cliente.nombre} ${cliente.apellido}`
                : 'Desconocido';
            const clientPhone = cliente ? cliente.telefono : 'N/A';

            // Get mechanic information
            const mecanico = mecanicosMap.get(cita.id_mecanico);
            const mecanicoName = mecanico
                ? `${mecanico.nombre} ${mecanico.apellido}`
                : 'No Asignado';

            // Format service text
            const servicioMostrado =
                cita.servicio === 'otro'
                    ? cita.otroServicio
                    : cita.servicio
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase());

            citaCard.innerHTML = `
                <div class="status ${cita.estado}">${cita.estado.toUpperCase()}</div>
                <p><strong>Cliente:</strong> ${clientName}</p>
                <p><strong>Teléfono:</strong> ${clientPhone}</p>
                <p><strong>Mecánico:</strong> ${mecanicoName}</p>
                <p><strong>Servicio:</strong> ${servicioMostrado}</p>
                <p><strong>Fecha:</strong> ${cita.fecha}</p>
                ${cita.monto ? `<p><strong>Monto:</strong> ${cita.monto}</p>` : ''}
                <div class="acciones">
                    ${cita.estado === 'en proceso' ? `<button class="complete-cita" data-id="${cita.id}"><i class="fas fa-check-circle"></i> Completar</button>` : ''}
                    ${cita.estado === 'pendiente' ? `<button class="assign-monto" data-id="${cita.id}"><i class="fas fa-dollar-sign"></i> Asignar Monto</button>` : ''}
                    <button class="cancel-cita" data-id="${cita.id}" ${cita.estado === 'cancelada' || cita.estado === 'completada' ? 'disabled' : ''}><i class="fas fa-times-circle"></i> Cancelar</button>
                </div>
            `;
            listaCitasDiv.appendChild(citaCard);
        });
    };

    // Function to render pagination controls
    const renderPagination = (totalItems) => {
        paginationDiv.innerHTML = '';
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('page-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                applyFiltersAndRender();
            });
            paginationDiv.appendChild(button);
        }
    };

    // Event listener for filter changes
    filterStatus.addEventListener('change', () => {
        currentPage = 1; // Reset to first page on filter change
        applyFiltersAndRender();
    });
    filterDate.addEventListener('change', () => {
        currentPage = 1; // Reset to first page on filter change
        applyFiltersAndRender();
    });

    // Event listener for "Edit" and "Cancel" buttons
    listaCitasDiv.addEventListener('click', async (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const citaId = targetButton.dataset.id;
        const token = getToken();

        if (targetButton.classList.contains('edit-cita')) {
            // Placeholder for edit functionality
            alert(
                `Editar cita con ID: ${citaId}. (Funcionalidad no implementada aún)`,
            );
            // In a real application, you might redirect or open a modal:
            // window.location.href = `edit-cita.html?id=${citaId}`;
        } else if (targetButton.classList.contains('cancel-cita')) {
            if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
                return;
            }

            try {
                await axios.patch(
                    `${API_URL_CITAS}/estado/${citaId}`,
                    { estado: 'cancelada' },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: token,
                        },
                    },
                );
                alert('Cita cancelada exitosamente.');
                fetchCitas(); // Re-fetch and render appointments
            } catch (error) {
                console.error('Error cancelling cita:', error);
                alert('Error al cancelar la cita. Inténtalo de nuevo.');
            }
        } else if (targetButton.classList.contains('complete-cita')) {
            if (!confirm('¿Estás seguro de que deseas completar esta cita?')) {
                return;
            }

            try {
                await axios.patch(
                    `${API_URL_CITAS}/estado/${citaId}`,
                    { estado: 'completada' },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: token,
                        },
                    },
                );
                alert('Cita completada exitosamente.');
                fetchCitas(); // Re-fetch and render appointments
            } catch (error) {
                console.error('Error completing cita:', error);
                alert('Error al completar la cita. Inténtalo de nuevo.');
            }
        } else if (targetButton.classList.contains('assign-monto')) {
            currentCitaIdForMonto = citaId;
            montoInput.value = ''; // Clear previous input
            montoModal.style.display = 'block';
        }
    });

    // Modal close functionality
    closeButton.addEventListener('click', () => {
        montoModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === montoModal) {
            montoModal.style.display = 'none';
        }
    });

    // Save monto button functionality
    saveMontoBtn.addEventListener('click', async () => {
        const monto = parseFloat(montoInput.value);
        const token = getToken();

        if (isNaN(monto) || monto <= 0) {
            alert('Por favor, ingresa un monto válido.');
            return;
        }
        if (!currentCitaIdForMonto) {
            alert('No se ha seleccionado ninguna cita para asignar el monto.');
            return;
        }

        try {
            // 1. Assign monto
            await axios.patch(
                `${API_URL_CITAS}/monto/${currentCitaIdForMonto}`,
                { monto: monto },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token,
                    },
                },
            );

            // 2. Change status to 'confirmada'
            await axios.patch(
                `${API_URL_CITAS}/estado/${currentCitaIdForMonto}`,
                { estado: 'confirmada' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token,
                    },
                },
            );

            alert('Monto asignado y cita confirmada exitosamente.');
            montoModal.style.display = 'none';
            fetchCitas(); // Re-fetch and render appointments
        } catch (error) {
            console.error('Error assigning monto or confirming cita:', error);
            alert(
                'Error al asignar el monto o confirmar la cita. Inténtalo de nuevo.',
            );
        }
    });

    // Function for the "Atrás" button
    btnAtras.addEventListener('click', () => {
        window.history.back(); // Go back to the previous page in browser history
    });

    // Initial fetch and render of appointments
    fetchCitas();
});

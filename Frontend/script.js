// Referencias elementos DOM
const userRoleSelect = document.getElementById('userRole');
const adminFields = document.getElementById('adminFields');
const mechFields = document.getElementById('mechFields');
const clientFields = document.getElementById('clientFields');
const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');
const userIdInput = document.getElementById('userId');
const formTitle = document.getElementById('formTitle');
const saveBtnText = document.getElementById('saveBtnText');
const cancelEditBtn = document.getElementById('cancelEdit');
const notificationContainer = document.getElementById('notification-container');

// Filter and Pagination elements
const filterNameInput = document.getElementById('filterName');
const filterRoleSelect = document.getElementById('filterRole');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfoSpan = document.getElementById('pageInfo');

const BASE_URL = 'http://localhost:8000';
let allUsers = []; // To store all fetched users
let filteredUsers = []; // Users after applying filters
let currentPage = 1;
const rowsPerPage = 5; // Number of rows per page

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
    };
}

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para cambiar campos visibles según el rol
function updateFieldsVisibility() {
    const role = userRoleSelect.value;

    // Ocultar todos primero
    adminFields.style.display = 'none';
    mechFields.style.display = 'none';
    clientFields.style.display = 'none';

    // Quitar obligatoriedad genérica
    document.getElementById('userEmail').required = false;
    document.getElementById('userCedula').required = false;
    document.getElementById('userPass').required = false;
    document.getElementById('userEspecialidad').required = false;
    document.getElementById('userPhone').required = false;
    document.getElementById('userAddress').required = false;

    if (role === 'Administrador') {
        adminFields.style.display = 'block';
        document.getElementById('userEmail').required = true;
        document.getElementById('userCedula').required = true;
        document.getElementById('userPass').required = true;
    } else if (role === 'Mecánico') {
        mechFields.style.display = 'block';
        document.getElementById('userEspecialidad').required = true;
    } else if (role === 'Cliente') {
        clientFields.style.display = 'block';
        document.getElementById('userPhone').required = true;
        document.getElementById('userAddress').required = true;
    }
}

userRoleSelect.addEventListener('change', updateFieldsVisibility);

// Fetch users from API
async function fetchUsers() {
    try {
        const headers = getAuthHeaders();
        const [clientsRes, adminsRes, mechanicsRes] = await Promise.all([
            axios.get(`${BASE_URL}/clientes`, headers),
            axios.get(`${BASE_URL}/admin`, headers),
            axios.get(`${BASE_URL}/mecanicos`, headers),
        ]);

        const clients = clientsRes.data.map((user) => ({
            ...user,
            rol: 'Cliente',
            id: user.id,
        }));
        const admins = adminsRes.data.map((user) => ({
            ...user,
            rol: 'Administrador',
            id: user.id,
        }));
        const mechanics = mechanicsRes.data.map((user) => ({
            ...user,
            rol: 'Mecánico',
            id: user.id,
        }));

        allUsers = [...clients, ...admins, ...mechanics];
        applyFiltersAndPagination();
    } catch (error) {
        console.error('Error fetching users:', error);
        showNotification('Error al cargar usuarios.', 'error');
    }
}

// Apply filters and pagination
function applyFiltersAndPagination() {
    const nameFilter = filterNameInput.value.toLowerCase();
    const roleFilter = filterRoleSelect.value;

    filteredUsers = allUsers.filter((user) => {
        const matchesName =
            user.nombre.toLowerCase().includes(nameFilter) ||
            user.apellido.toLowerCase().includes(nameFilter);
        const matchesRole = roleFilter === '' || user.rol === roleFilter;
        return matchesName && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);
    renderTable(paginatedUsers);
    updatePaginationControls(totalPages);
}

// Renderizar la tabla de datos
function renderTable(usersToDisplay) {
    userTableBody.innerHTML = '';
    if (usersToDisplay.length === 0) {
        userTableBody.innerHTML =
            '<tr><td colspan="4">No hay usuarios registrados que coincidan con los filtros.</td></tr>';
        return;
    }

    usersToDisplay.forEach((user) => {
        let badgeClass = '';
        let infoAdicional = '';

        if (user.rol === 'Mecánico') {
            badgeClass = 'badge-mech';
            infoAdicional = `Especialidad: ${user.especialidad || 'N/A'}`;
        } else if (user.rol === 'Cliente') {
            badgeClass = 'badge-client';
            infoAdicional = `Tlf: ${user.telefono || 'N/A'}`;
        } else if (user.rol === 'Administrador') {
            badgeClass = 'badge-admin';
            infoAdicional = `Email: ${user.correo || 'N/A'}`;
        }

        userTableBody.innerHTML += `
            <tr>
                <td>${user.nombre} ${user.apellido}</td>
                <td><span class="badge ${badgeClass}">${user.rol}</span></td>
                <td><small>${infoAdicional}</small></td>
                <td>
                    <div class="actions">
                        <button class="btn" onclick="prepararEdicion('${user.id}', '${user.rol}')" title="Editar" style="padding: 5px 10px; background: #eee;">
                            <i class="fas fa-edit" style="color: var(--warning-color);"></i>
                        </button>
                        <button class="btn" onclick="eliminar('${user.id}', '${user.rol}')" title="Eliminar" style="padding: 5px 10px; background: #eee;">
                            <i class="fas fa-trash-alt" style="color: var(--error-color);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Update pagination controls
function updatePaginationControls(totalPages) {
    pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Validate Cedula
function validateCedula(cedula) {
    const regex = /^[VEJ]-\d{7,9}$/i; // V, E, J followed by 7-9 digits
    return regex.test(cedula);
}

// Procesar Formulario (Crear/Editar)
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const role = userRoleSelect.value;
    const nombre = document.getElementById('userName').value;
    const apellido = document.getElementById('userLastName').value;

    let userData = { nombre, apellido };
    let endpoint = '';
    let method = '';

    if (id) {
        // Editing existing user
        method = 'put';
        const userToEdit = allUsers.find((u) => u.id === Number(id));
        if (!userToEdit) {
            showNotification('Usuario no encontrado para edición.', 'error');
            return;
        }

        if (role === 'Administrador') {
            endpoint = `${BASE_URL}/admin/${id}`;
            userData.correo = document.getElementById('userEmail').value;
            userData.pass = document.getElementById('userPass').value;
            userData.cedula = document.getElementById('userCedula').value;
            if (!validateCedula(userData.cedula)) {
                showNotification(
                    'Formato de cédula inválido. Debe ser V-XXXXXXXX, E-XXXXXXXX o J-XXXXXXXX',
                    'error',
                );
                return;
            }
        } else if (role === 'Mecánico') {
            endpoint = `${BASE_URL}/mecanicos/${id}`;
            userData.especialidad =
                document.getElementById('userEspecialidad').value;
        } else if (role === 'Cliente') {
            endpoint = `${BASE_URL}/clientes/${id}`;
            userData.telefono = document.getElementById('userPhone').value;
            userData.direccion = document.getElementById('userAddress').value;
            // For client, we need to ensure cedula is passed if it exists in the original user object
            if (userToEdit.cedula) {
                userData.cedula = userToEdit.cedula;
            }
            userData.correo = userToEdit.correo; // Keep existing email for client
            userData.pass = userToEdit.pass; // Keep existing password for client
        }
    } else {
        // Creating new user
        method = 'post';
        if (role === 'Administrador') {
            endpoint = `${BASE_URL}/admin`;
            userData.correo = document.getElementById('userEmail').value;
            userData.pass = document.getElementById('userPass').value;
            userData.cedula = document.getElementById('userCedula').value;
            if (!validateCedula(userData.cedula)) {
                showNotification(
                    'Formato de cédula inválido. Debe ser V-XXXXXXXX, E-XXXXXXXX o J-XXXXXXXX',
                    'error',
                );
                return;
            }
        } else if (role === 'Mecánico') {
            endpoint = `${BASE_URL}/mecanicos`;
            userData.especialidad =
                document.getElementById('userEspecialidad').value;
        } else {
            showNotification(
                'Solo se permite el registro de Administradores y Mecánicos desde esta interfaz.',
                'error',
            );
            return;
        }
    }

    try {
        const headers = getAuthHeaders();
        let response;
        if (method === 'post') {
            response = await axios.post(endpoint, userData, headers);
        } else {
            response = await axios.put(endpoint, userData, headers);
        }
        showNotification(
            `Usuario ${id ? 'actualizado' : 'registrado'} correctamente.`,
            'success',
        );
        resetForm();
        fetchUsers();
    } catch (error) {
        if (error.response.status === 409) {
            showNotification(
                'El correo o la cedula ya esta registrado',
                'error',
            );
        }
        console.error(
            `Error ${id ? 'actualizando' : 'registrando'} usuario:`,
            error,
        );
        showNotification(
            `Error al ${id ? 'actualizar' : 'registrar'} usuario.`,
            'error',
        );
    }
});

// Preparar datos para edición
window.prepararEdicion = function (id, role) {
    const user = allUsers.find((u) => u.id === Number(id) && u.rol === role);
    if (!user) {
        showNotification('Usuario no encontrado para edición.', 'error');
        return;
    }

    userIdInput.value = user.id;
    document.getElementById('userName').value = user.nombre;
    document.getElementById('userLastName').value = user.apellido;
    userRoleSelect.value = user.rol;

    // Populate fields based on role
    if (user.rol === 'Administrador') {
        document.getElementById('userEmail').value = user.correo || '';
        document.getElementById('userCedula').value = user.cedula || '';
        document.getElementById('userPass').value = ''; // Never pre-fill password
    } else if (user.rol === 'Mecánico') {
        document.getElementById('userEspecialidad').value =
            user.especialidad || 'General';
    } else if (user.rol === 'Cliente') {
        document.getElementById('userPhone').value = user.telefono || '';
        document.getElementById('userAddress').value = user.direccion || '';
    }

    updateFieldsVisibility();

    formTitle.innerText = 'Modificar Registro';
    saveBtnText.innerText = 'Actualizar Datos';
    cancelEditBtn.style.display = 'block';
};

// Resetear formulario
function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    formTitle.innerText = 'Registrar Nuevo';
    saveBtnText.innerText = 'Guardar Registro';
    cancelEditBtn.style.display = 'none';
    userRoleSelect.value = 'Administrador'; // Default to Admin
    updateFieldsVisibility();
}

cancelEditBtn.addEventListener('click', resetForm);

// Eliminar usuario
window.eliminar = async function (id, role) {
    const user = allUsers.find((u) => u.id === Number(id) && u.rol === role);
    if (!user) {
        showNotification('Usuario no encontrado para eliminar.', 'error');
        return;
    }

    const mensaje = `¿Desea eliminar a ${user.nombre} ${user.apellido} (${user.rol}) del sistema?`;

    if (confirm(mensaje)) {
        let endpoint = '';
        if (role === 'Administrador') {
            endpoint = `${BASE_URL}/admin/${id}`;
        } else if (role === 'Mecánico') {
            endpoint = `${BASE_URL}/mecanicos/${id}`;
        } else if (role === 'Cliente') {
            endpoint = `${BASE_URL}/clientes/${id}`;
        }

        try {
            const headers = getAuthHeaders();
            await axios.delete(endpoint, headers);
            showNotification('Usuario eliminado correctamente.', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            showNotification('Error al eliminar usuario.', 'error');
        }
    }
};

// Event Listeners for filters and pagination
filterNameInput.addEventListener('input', () => {
    currentPage = 1;
    applyFiltersAndPagination();
});
filterRoleSelect.addEventListener('change', () => {
    currentPage = 1;
    applyFiltersAndPagination();
});
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        applyFiltersAndPagination();
    }
});
nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        applyFiltersAndPagination();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html'; // Redirigir a la página de login
        });
    }
    fetchUsers(); // Initial fetch
    updateFieldsVisibility(); // Initial form setup
});

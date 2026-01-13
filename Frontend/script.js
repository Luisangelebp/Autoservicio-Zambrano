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

// Datos iniciales
let usuarios = [
    {
        id: 1,
        nombre: 'Fernando',
        apellido: 'Zambrano',
        rol: 'Administrador',
        correo: 'fernando@zambrano.com',
        cedula: 'V-11.111.111',
        especialidad: '-',
        telefono: '-',
        direccion: '-',
    },
    {
        id: 2,
        nombre: 'Antonio',
        apellido: 'Pacheco',
        rol: 'Administrador',
        correo: 'antonio@zambrano.com',
        cedula: 'V-22.222.222',
        especialidad: '-',
        telefono: '-',
        direccion: '-',
    },
    {
        id: 3,
        nombre: 'Luis Ángel',
        apellido: 'Betancourt',
        rol: 'Administrador',
        correo: 'luis@zambrano.com',
        cedula: 'V-33.333.333',
        especialidad: '-',
        telefono: '-',
        direccion: '-',
    },
    {
        id: 4,
        nombre: 'Carlos',
        apellido: 'Méndez',
        rol: 'Cliente',
        correo: '-',
        cedula: '-',
        especialidad: '-',
        telefono: '0424-5551234',
        direccion: 'Calle 5 con Av. Principal',
    },
];

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
    document.getElementById('userPhone').required = false;

    if (role === 'Administrador') {
        adminFields.style.display = 'block';
        document.getElementById('userEmail').required = true;
        document.getElementById('userCedula').required = true;
    } else if (role === 'Mecánico') {
        mechFields.style.display = 'block';
    } else if (role === 'Cliente') {
        clientFields.style.display = 'block';
        document.getElementById('userPhone').required = true;
    }
}

userRoleSelect.addEventListener('change', updateFieldsVisibility);

// Renderizar la tabla de datos
function renderTable() {
    userTableBody.innerHTML = '';
    usuarios.forEach((user) => {
        let badgeClass = 'badge-admin';
        let infoAdicional = '';

        if (user.rol === 'Mecánico') {
            badgeClass = 'badge-mech';
            infoAdicional = `Especialidad: ${user.especialidad}`;
        } else if (user.rol === 'Cliente') {
            badgeClass = 'badge-client';
            infoAdicional = `Tlf: ${user.telefono}`;
        } else {
            infoAdicional = `Email: ${user.correo}`;
        }

        userTableBody.innerHTML += `
            <tr>
                <td>${user.nombre} ${user.apellido}</td>
                <td><span class="badge ${badgeClass}">${user.rol}</span></td>
                <td><small>${infoAdicional}</small></td>
                <td>
                    <div class="actions">
                        <button class="btn" onclick="prepararEdicion(${user.id})" title="Editar" style="padding: 5px 10px; background: #eee;">
                            <i class="fas fa-edit" style="color: var(--warning-color);"></i>
                        </button>
                        <button class="btn" onclick="eliminar(${user.id})" title="Eliminar" style="padding: 5px 10px; background: #eee;">
                            <i class="fas fa-trash-alt" style="color: var(--error-color);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Procesar Formulario (Crear/Editar)
userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const userData = {
        nombre: document.getElementById('userName').value,
        apellido: document.getElementById('userLastName').value,
        rol: userRoleSelect.value,
        correo: document.getElementById('userEmail').value || '-',
        cedula: document.getElementById('userCedula').value || '-',
        especialidad: document.getElementById('userEspecialidad').value || '-',
        telefono: document.getElementById('userPhone').value || '-',
        direccion: document.getElementById('userAddress').value || '-',
    };

    if (id) {
        // Editar existente
        const index = usuarios.findIndex((u) => u.id == id);
        usuarios[index] = { ...usuarios[index], ...userData };
        alert('Registro actualizado correctamente.');
    } else {
        // Crear nuevo
        usuarios.push({ id: Date.now(), ...userData });
        alert('¡Registro exitoso!');
    }

    resetForm();
    renderTable();
});

// Preparar datos para edición
window.prepararEdicion = function (id) {
    const user = usuarios.find((u) => u.id == id);
    userIdInput.value = user.id;
    document.getElementById('userName').value = user.nombre;
    document.getElementById('userLastName').value = user.apellido;
    userRoleSelect.value = user.rol;

    document.getElementById('userEmail').value =
        user.correo !== '-' ? user.correo : '';
    document.getElementById('userCedula').value =
        user.cedula !== '-' ? user.cedula : '';
    document.getElementById('userEspecialidad').value =
        user.especialidad !== '-' ? user.especialidad : 'General';
    document.getElementById('userPhone').value =
        user.telefono !== '-' ? user.telefono : '';
    document.getElementById('userAddress').value =
        user.direccion !== '-' ? user.direccion : '';

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
    userRoleSelect.value = 'Administrador';
    updateFieldsVisibility();
}

cancelEditBtn.addEventListener('click', resetForm);

// Eliminar usuario
window.eliminar = function (id) {
    const user = usuarios.find((u) => u.id == id);
    const mensaje =
        id <= 3
            ? `Atención: Estás intentando eliminar a un Administrador Principal (${user.nombre}). ¿Realmente deseas continuar?`
            : `¿Desea eliminar a ${user.nombre} ${user.apellido} del sistema?`;

    if (confirm(mensaje)) {
        usuarios = usuarios.filter((u) => u.id !== id);
        renderTable();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            window.location.href = 'index.html'; // Redirigir a la página de login
        });
    }
});

// Inicialización
renderTable();
updateFieldsVisibility();

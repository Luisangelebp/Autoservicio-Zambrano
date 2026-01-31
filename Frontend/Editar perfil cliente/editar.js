document.addEventListener('DOMContentLoaded', () => {
    const editProfileForm = document.getElementById('edit-profile-form');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const correoInput = document.getElementById('correo');
    const passInput = document.getElementById('pass');
    const confirmarContraseñaInput = document.getElementById('confirmar_contraseña');
    const direccionInput = document.getElementById('direccion');
    const telefonoInput = document.getElementById('telefono');
    const editMessage = document.getElementById('editMessage');
    const btnAtras = document.getElementById('btnAtras');

    // Cargar datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user) {
        nombreInput.value = user.nombre || '';
        apellidoInput.value = user.apellido || '';
        correoInput.value = user.correo || '';
        direccionInput.value = user.direccion || '';
        telefonoInput.value = user.telefono || '';
    }

    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar que todos los campos esten llenos
        if (!nombreInput.value || !apellidoInput.value || !correoInput.value || !direccionInput.value || !telefonoInput.value) {
            editMessage.textContent = 'Todos los campos son obligatorios.';
            editMessage.className = 'message error';
            editMessage.style.display = 'block';
            return;
        }

        // Validar contraseñas
        if (passInput.value !== confirmarContraseñaInput.value) {
            editMessage.textContent = 'Las contraseñas no coinciden.';
            editMessage.className = 'message error';
            editMessage.style.display = 'block';
            return;
        }

        const updatedData = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            correo: correoInput.value,
            direccion: direccionInput.value,
            telefono: parseInt(telefonoInput.value),
            cedula: user.cedula,
        };

        if (passInput.value) {
            updatedData.pass = passInput.value;
        }

        try {
            const response = await axios.put(`http://localhost:8000/clientes/${user.id}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                // Actualizar datos en localStorage
                const updatedUser = { ...user, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                editMessage.textContent = 'Perfil actualizado correctamente.';
                editMessage.className = 'message success';
                editMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            editMessage.textContent = 'Error al actualizar el perfil. Inténtalo de nuevo.';
            editMessage.className = 'message error';
            editMessage.style.display = 'block';
        }
    });

    btnAtras.addEventListener('click', () => {
        window.history.back();
    });
});

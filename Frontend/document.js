document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginCorreoInput = document.getElementById('login_correo');
    const loginContrasenaInput = document.getElementById('login_contrasena');
    const loginMessage = document.getElementById('loginMessage');

    // --- SIMULACIÓN DE USUARIOS REGISTRADOS (EN PRODUCCIÓN VENDRÍA DE UNA BD EN EL SERVIDOR) ---
    // Usamos localStorage para simular un registro persistente de usuarios para pruebas.
    // En una aplicación real, esto NUNCA se haría así por seguridad.
    function getRegisteredUsers() {
        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        
        // Asegurarse de que los usuarios predefinidos existen
        const adminExists = users.some(u => u.email === 'admin@servifran.com');
        const userExists = users.some(u => u.email === 'usuario@servifran.com');

        if (!adminExists) {
            users.push({ email: 'admin@servifran.com', password: 'adminpassword', role: 'admin' });
        }
        if (!userExists) {
            users.push({ email: 'usuario@servifran.com', password: 'userpassword', role: 'user' });
        }
        
        // Solo guardar si se añadió algo o si el array estaba vacío
        if (!adminExists || !userExists || users.length === 0) {
            localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
        return users;
    }

    // Inicializar usuarios predefinidos al cargar el script
    getRegisteredUsers();

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        const correo = loginCorreoInput.value.trim();
        const contrasena = loginContrasenaInput.value.trim();

        const registeredUsers = getRegisteredUsers(); // Obtener usuarios actualizados
        const userFound = registeredUsers.find(u => u.email === correo && u.password === contrasena);

        if (userFound) {
            // Autenticación exitosa
            localStorage.setItem('is_logged_in', 'true');
            localStorage.setItem('current_user_email', userFound.email); // Guarda el correo
            localStorage.setItem('current_user_role', userFound.role); // Guarda el rol del usuario

            loginMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
            loginMessage.className = 'message success';
            loginMessage.style.display = 'block';

            // Redirige al usuario a la página principal (index.html)
            // Asegúrate de que 'index.html' es la ruta correcta
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000); // Pequeño retraso para que el mensaje sea visible
        } else {
            // Credenciales inválidas
            // Limpiar cualquier estado de sesión anterior
            localStorage.removeItem('is_logged_in');
            localStorage.removeItem('current_user_email');
            localStorage.removeItem('current_user_role');
            
            loginMessage.textContent = 'Correo o contraseña incorrectos. Inténtalo de nuevo.';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
        }
    });
});
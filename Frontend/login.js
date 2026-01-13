async function getAxios() {
    try {
        const res = await axios.get('http://localhost:8000/clientes', {
            headers: {
                Authorization: '12345',
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

getAxios().then((res) => console.log(res));
document.addEventListener('DOMContentLoaded', () => {
    console.log(axios);
    const roleButtons = document.querySelectorAll('.role-button');
    const loginButton = document.getElementById('loginButton');
    const roleSelector = document.querySelector('.role-selector');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    let currentRole = 'clientes';

    // Rutas originales
    const URL_REGISTRO = 'register.html';
    const URL_DASHBOARD_USUARIO = 'pg_principal suario.html';
    const URL_DASHBOARD_ADMIN = 'pg de administrador.html';
    const URL_RECUPERAR_CONTRASENA = 'Recuperacion de contraseña.html';

    // Lógica para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function () {
        const type =
            passwordInput.getAttribute('type') === 'password'
                ? 'text'
                : 'password';
        passwordInput.setAttribute('type', type);
        // Cambiar el icono del ojo
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Cambio de Roles
    const updateRoleSelection = (selectedRole) => {
        roleButtons.forEach((button) => {
            button.classList.toggle(
                'active',
                button.dataset.role === selectedRole
            );
        });
        loginButton.textContent = `Acceder como ${
            selectedRole === 'clientes' ? 'Usuario' : 'Administrador'
        }`;
        currentRole = selectedRole;
        roleSelector.dataset.activeRole = selectedRole;
        console.log(`Rol seleccionado: ${currentRole}`);
    };

    roleButtons.forEach((button) => {
        button.addEventListener('click', () =>
            updateRoleSelection(button.dataset.role)
        );
    });

    // Formulario
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const rol = currentRole;

        const dataToSend = {
            correo: email,
            pass: password,
            rol: rol,
        };

        if (!email) {
            emailError.textContent = 'El correo electrónico es obligatorio.';
            return;
        } else {
            emailError.textContent = '';
        }
        if (!password || password.length < 6) {
            passwordError.textContent = 'La contraseña es obligatoria.';
            return;
        } else {
            passwordError.textContent = '';
        }

        async function loginUser() {
            try {
                const response = await axios.post(
                    'http://localhost:8000/login',
                    dataToSend,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = response.data;
                console.log(data);
                if (response.status === 200) {
                    if (rol === 'clientes') {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('rol', rol);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        window.location.href = URL_DASHBOARD_USUARIO;
                    } else if (rol === 'admin') {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('rol', rol);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        window.location.href = URL_DASHBOARD_ADMIN;
                    }
                } else {
                    if (data.errorField === 'email') {
                        emailError.textContent = data.message;
                        passwordError.textContent = '';
                    } else if (data.errorField === 'password') {
                        passwordError.textContent = data.message;
                        emailError.textContent = '';
                    } else {
                        emailError.textContent = '';
                        passwordError.textContent = '';
                    }
                }
            } catch (error) {
                console.error(error);
                if (error.status === 401) {
                    passwordError.textContent = 'Credenciales inválidas.';
                    emailError.textContent = '';
                    return;
                }
            }
        }
        loginUser();
    });

    // Enlaces
    document
        .querySelector('.forgot-password')
        .addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = URL_RECUPERAR_CONTRASENA;
        });

    document.getElementById('signupLink').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = URL_REGISTRO;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    const regNombre = document.getElementById('reg_nombre');
    const regApellido = document.getElementById('reg_apellido');
    const regCedula = document.getElementById('reg_cedula');
    const regTelefono = document.getElementById('reg_telefono');
    const regCorreo = document.getElementById('reg_correo');
    const regContrasena = document.getElementById('reg_contrasena');

    // Función para validar solo letras en campos de texto (nombre, apellido)
    const validateLettersOnly = (event) => {
        const charCode = event.which ? event.which : event.keyCode;
        // Permitir solo letras (mayúsculas y minúsculas), espacios y teclas de control
        if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || charCode === 8 || charCode === 46 || charCode === 9)) {
            event.preventDefault();
        }
    };

    // Función para validar solo números en campos numéricos (cédula, teléfono)
    const validateNumbersOnly = (event) => {
        const charCode = event.which ? event.which : event.keyCode;
        // Permitir solo números (0-9) y teclas de control
        if (!(charCode >= 48 && charCode <= 57 || charCode === 8 || charCode === 46 || charCode === 9)) {
            event.preventDefault();
        }
    };

    // Asignar los eventos de validación a los campos
    regNombre.addEventListener('keypress', validateLettersOnly);
    regApellido.addEventListener('keypress', validateLettersOnly);
    regCedula.addEventListener('keypress', validateNumbersOnly);
    regTelefono.addEventListener('keypress', validateNumbersOnly);

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío por defecto del formulario

        // Obtener los valores de los campos
        const nombre = regNombre.value.trim();
        const apellido = regApellido.value.trim();
        const cedula = regCedula.value.trim();
        const telefono = regTelefono.value.trim();
        const correo = regCorreo.value.trim();
        const contrasena = regContrasena.value.trim();

        // Validaciones adicionales (además de las del HTML)
        if (nombre === '' || apellido === '' || cedula === '' || telefono === '' || correo === '' || contrasena === '') {
            registerMessage.textContent = 'Por favor, completa todos los campos.';
            registerMessage.style.backgroundColor = '#f44336'; // Rojo para error
            registerMessage.style.display = 'block';
            return;
        }

        if (cedula.length < 7 || cedula.length > 8) {
            registerMessage.textContent = 'La cédula debe tener entre 7 y 8 dígitos.';
            registerMessage.style.backgroundColor = '#f44336';
            registerMessage.style.display = 'block';
            return;
        }

        if (telefono.length !== 11) {
            registerMessage.textContent = 'El número de teléfono debe tener 11 dígitos.';
            registerMessage.style.backgroundColor = '#f44336';
            registerMessage.style.display = 'block';
            return;
        }

        if (contrasena.length < 6 || contrasena.length > 15) {
            registerMessage.textContent = 'La contraseña debe tener entre 6 y 15 caracteres.';
            registerMessage.style.backgroundColor = '#f44336';
            registerMessage.style.display = 'block';
            return;
        }

        // Simulación de registro exitoso (en un proyecto real, aquí enviarías los datos a un servidor)
        console.log('Datos de Registro:', { nombre, apellido, cedula, telefono, correo, contrasena });

        registerMessage.textContent = '¡Registro exitoso! Ya puedes iniciar sesión.';
        registerMessage.style.backgroundColor = '#4CAF50'; // Verde para éxito
        registerMessage.style.display = 'block';

        // Opcional: Limpiar el formulario después de un registro exitoso
        registerForm.reset();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const formRegistroServicio = document.getElementById('formRegistroServicio');
    const clienteNombreInput = document.getElementById('clienteNombre');
    const clienteCedulaInput = document.getElementById('clienteCedula');
    const mecanicoServicioSelect = document.getElementById('mecanicoServicio');
    const tipoServicioInput = document.getElementById('tipoServicio');
    const costoServicioInput = document.getElementById('costoServicio');
    const fechaServicioInput = document.getElementById('fechaServicio');
    const mensajeDiv = document.getElementById('mensaje-registro-servicio');
    const submitButton = formRegistroServicio.querySelector('button[type="submit"]');

    // Establecer la fecha actual por defecto en el input de fecha
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    fechaServicioInput.value = `${year}-${month}-${day}`;
    // Restringir la fecha máxima a hoy (no se pueden registrar servicios futuros)
    fechaServicioInput.max = `${year}-${month}-${day}`;


    // Función para obtener servicios del localStorage
    function getServicios() {
        const servicios = localStorage.getItem('serviciosRealizados');
        return servicios ? JSON.parse(servicios) : [];
    }

    // Función para guardar servicios en localStorage
    function saveServicios(servicios) {
        localStorage.setItem('serviciosRealizados', JSON.stringify(servicios));
    }

    // Función para mostrar mensajes de confirmación/error
    // La duración del mensaje se puede ajustar aquí
    function mostrarMensaje(mensaje, tipo, duracion = 5000) { // Duración por defecto de 5 segundos
        mensajeDiv.textContent = mensaje;
        mensajeDiv.classList.remove('success', 'error'); // Limpiar clases previas
        mensajeDiv.classList.add(tipo);
        mensajeDiv.style.display = 'block';

        // Ocultar el mensaje después de 'duracion' milisegundos
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
            // También podrías limpiar el texto si prefieres
            // mensajeDiv.textContent = '';
        }, duracion);
    }

    // Evento submit del formulario
    formRegistroServicio.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío por defecto

        // Reiniciar el estado del botón y ocultar cualquier mensaje previo
        resetSubmitButton();
        mensajeDiv.style.display = 'none';

        // Deshabilitar botón y mostrar carga
        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';
        submitButton.classList.add('loading');
        
        // **Validaciones JavaScript adicionales**
        const clienteNombre = clienteNombreInput.value.trim();
        const clienteCedula = clienteCedulaInput.value.trim();
        const mecanicoServicio = mecanicoServicioSelect.value;
        const tipoServicio = tipoServicioInput.value.trim();
        const costoServicio = parseFloat(costoServicioInput.value);
        const fechaServicio = fechaServicioInput.value;

        // Validación de Nombre
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,12}$/.test(clienteNombre)) {
            mostrarMensaje('El nombre del cliente solo debe contener letras (máximo 12 caracteres).', 'error');
            resetSubmitButton(); // Habilitar el botón de nuevo en caso de error
            return;
        }

        // Validación de Cédula
        if (!/^\d{8}$/.test(clienteCedula)) {
            mostrarMensaje('La cédula del cliente debe ser de 8 dígitos numéricos.', 'error');
            resetSubmitButton(); // Habilitar el botón de nuevo en caso de error
            return;
        }

        // Validación de Mecánico/Servicio
        if (mecanicoServicio === "") {
            mostrarMensaje('Por favor, selecciona un mecánico/servicio.', 'error');
            resetSubmitButton(); // Habilitar el botón de nuevo en caso de error
            return;
        }

        // Validación de Costo (asegurar que es un número positivo)
        if (isNaN(costoServicio) || costoServicio <= 0) {
            mostrarMensaje('El costo del servicio debe ser un número positivo.', 'error');
            resetSubmitButton(); // Habilitar el botón de nuevo en caso de error
            return;
        }

        // Si todas las validaciones son exitosas, proceder a guardar
        const nuevoServicio = {
            id: Date.now(), // ID único para el servicio
            cliente: clienteNombre,
            cedulaCliente: clienteCedula,
            mecanico: mecanicoServicio,
            tipoServicio: tipoServicio,
            costo: costoServicio.toFixed(2), // Asegurar 2 decimales
            fecha: fechaServicio,
            hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }) // Hora actual del registro
        };

        const servicios = getServicios();
        servicios.push(nuevoServicio);
        saveServicios(servicios);

        // Simular una pequeña latencia para el registro (opcional, para UX)
        setTimeout(() => {
            mostrarMensaje('¡Servicio registrado exitosamente!', 'success', 4000); // Mensaje de éxito visible por 4 segundos
            formRegistroServicio.reset(); // Limpiar el formulario

            // Restablecer la fecha actual después del reset
            const resetToday = new Date();
            const resetYear = resetToday.getFullYear();
            const resetMonth = String(resetToday.getMonth() + 1).padStart(2, '0');
            const resetDay = String(resetToday.getDate()).padStart(2, '0');
            fechaServicioInput.value = `${resetYear}-${resetMonth}-${resetDay}`;

            resetSubmitButton(); // Restablecer el botón a su estado normal
        }, 800); // Latencia de 0.8 segundos
    });

    function resetSubmitButton() {
        submitButton.disabled = false;
        submitButton.textContent = 'Registrar Servicio';
        submitButton.classList.remove('loading');
    }
});
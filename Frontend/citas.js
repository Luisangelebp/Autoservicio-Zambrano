document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const citaForm = document.getElementById('citaForm');
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const servicioSelect = document.getElementById('servicio');
    const otroServicioGroup = document.getElementById('otroServicioGroup');
    const otroServicioInput = document.getElementById('otroServicio');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const mensajeCita = document.getElementById('mensajeCita');
    const citasAgendadasDiv = document.getElementById('citasAgendadas'); // DIV para mostrar las citas
    const btnAtras = document.getElementById('btnAtras'); // Botón Atrás

    // Array para almacenar las citas (se carga y guarda en localStorage)
    // Usamos 'citasServiFran' como clave para el localStorage
    let citas = JSON.parse(localStorage.getItem('citasServiFran')) || [];

    // --- Funciones de Utilidad ---

    // Función para mostrar mensajes al usuario (éxito, error, info)
    const mostrarMensaje = (mensaje, tipo) => {
        mensajeCita.textContent = mensaje;
        mensajeCita.className = `message ${tipo}`;
        mensajeCita.style.display = 'block';

        setTimeout(() => {
            mensajeCita.style.display = 'none';
            mensajeCita.textContent = '';
        }, 3000);
    };

    // Función para renderizar las citas en la interfaz
    const renderCitas = () => {
        citasAgendadasDiv.innerHTML = ''; // Limpiar el contenido actual
        
        if (citas.length === 0) {
            citasAgendadasDiv.innerHTML = '<p class="empty-list-message">No tienes citas agendadas aún.</p>';
            return;
        }

        // Ordenar citas por fecha y hora (más próximas primero)
        const citasOrdenadas = [...citas].sort((a, b) => {
            const dateTimeA = new Date(`${a.fecha}T${a.hora}`);
            const dateTimeB = new Date(`${b.fecha}T${b.hora}`);
            return dateTimeA - dateTimeB;
        });

        citasOrdenadas.forEach((cita) => {
            const citaItem = document.createElement('div');
            citaItem.classList.add('cita-item');
            if (cita.completada) {
                citaItem.classList.add('cita-completada');
                citaItem.style.opacity = '0.7'; // Ligeramente más tenue si está completada
                citaItem.style.borderLeftColor = '#6c757d'; // Color gris para completadas
            }

            // Formatea el texto del servicio: "revision_general" a "Revisión General"
            const servicioMostrado = cita.servicio === 'otro' ? cita.otroServicio : 
                                     cita.servicio.replace(/_/g, ' ')
                                                  .replace(/\b\w/g, l => l.toUpperCase()); 

            citaItem.innerHTML = `
                <p><strong>Nombre:</strong> ${cita.nombre}</p>
                <p><strong>Teléfono:</strong> ${cita.telefono}</p>
                <p><strong>Servicio:</strong> ${servicioMostrado}</p>
                <p><strong>Fecha:</strong> ${cita.fecha}</p>
                <p><strong>Hora:</strong> ${cita.hora}</p>
                <div class="acciones">
                    ${!cita.completada ? `<button class="completar-cita" data-id="${cita.id}"><i class="fas fa-check-circle"></i> Completar</button>` : ''}
                    <button class="eliminar-cita" data-id="${cita.id}"><i class="fas fa-trash-alt"></i> Eliminar</button>
                </div>
            `;
            citasAgendadasDiv.appendChild(citaItem);
        });
    };

    // --- Lógica del Formulario de Agendar Citas ---

    // Mostrar/ocultar el campo "Otro servicio"
    servicioSelect.addEventListener('change', () => {
        if (servicioSelect.value === 'otro') {
            otroServicioGroup.style.display = 'block';
            otroServicioInput.setAttribute('required', 'required'); // Hacer el campo requerido
        } else {
            otroServicioGroup.style.display = 'none';
            otroServicioInput.removeAttribute('required');
            otroServicioInput.value = ''; // Limpiar el valor
        }
    });

    // Manejar el envío del formulario
    citaForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita el envío por defecto del formulario

        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const servicio = servicioSelect.value;
        const otroServicio = servicio === 'otro' ? otroServicioInput.value.trim() : '';
        const fecha = fechaInput.value;
        const hora = horaInput.value;

        // --- VALIDACIONES ---
        if (!nombre || !telefono || !servicio || !fecha || !hora || (servicio === 'otro' && !otroServicio)) {
            mostrarMensaje('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }

        const nombreRegex = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/;
        if (!nombreRegex.test(nombre)) {
            mostrarMensaje('El nombre solo debe contener letras y espacios.', 'error');
            return;
        }

        const telefonoRegex = /^[0-9]{11}$/;
        if (!telefonoRegex.test(telefono)) {
            mostrarMensaje('El teléfono debe contener exactamente 11 dígitos numéricos.', 'error');
            return;
        }

        const fechaHoraCita = new Date(`${fecha}T${hora}`);
        const ahora = new Date();
        // Ajustar 'ahora' para que compare solo hasta los minutos del día actual
        ahora.setSeconds(0);
        ahora.setMilliseconds(0);
        
        if (fechaHoraCita < ahora) {
             mostrarMensaje('No puedes agendar citas en el pasado. Por favor, selecciona una fecha y hora futuras.', 'error');
             return;
        }

        // Crear objeto de la nueva cita
        const nuevaCita = {
            id: Date.now(), // ID único basado en la marca de tiempo
            nombre,
            telefono,
            servicio,
            otroServicio,
            fecha,
            hora,
            completada: false // Nueva cita no está completada por defecto
        };

        citas.push(nuevaCita); // Añadir la cita al array
        localStorage.setItem('citasServiFran', JSON.stringify(citas)); // Guardar en localStorage

        mostrarMensaje('¡Cita agendada exitosamente!', 'success');
        citaForm.reset(); // Limpiar el formulario
        otroServicioGroup.style.display = 'none'; // Ocultar el campo "Otro servicio"
        otroServicioInput.removeAttribute('required'); // Quitar el atributo required
        renderCitas(); // Volver a renderizar la lista de citas para que la nueva aparezca
    });

    // --- Lógica para eliminar o completar citas (en la sección "Mis Citas Agendadas") ---
    citasAgendadasDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('eliminar-cita') || event.target.closest('.eliminar-cita')) {
            const btn = event.target.closest('.eliminar-cita');
            const idEliminar = parseInt(btn.dataset.id);

            if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
                citas = citas.filter(cita => cita.id !== idEliminar);
                localStorage.setItem('citasServiFran', JSON.stringify(citas));
                mostrarMensaje('Cita eliminada.', 'info');
                renderCitas();
            }
        } else if (event.target.classList.contains('completar-cita') || event.target.closest('.completar-cita')) {
            const btn = event.target.closest('.completar-cita');
            const idCompletar = parseInt(btn.dataset.id);
            const citaIndex = citas.findIndex(cita => cita.id === idCompletar);
            if (citaIndex > -1) {
                citas[citaIndex].completada = true;
                localStorage.setItem('citasServiFran', JSON.stringify(citas));
                mostrarMensaje('Cita marcada como completada.', 'success');
                renderCitas();
            }
        }
    });

    // --- Lógica del Botón "Atrás" ---
    btnAtras.addEventListener('click', () => {
        // Opción 1: Simplemente retrocede en el historial del navegador
        window.history.back(); 

        // Opción 2: Redirige a una página específica (ej. index.html o home.html)
        // window.location.href = 'index.html'; 
    });

    // --- Funciones para prevenir pegar caracteres no deseados ---
    // (Mantengo las funciones aquí, ya que el HTML de citas.html las usa)

    const preventNumberInput = (event) => {
        const input = event.target;
        const isNumberKey = /^[0-9]$/.test(event.key) || 
                            event.key === 'Backspace' || event.key === 'Delete' || 
                            event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Tab';

        if (!isNumberKey && !event.ctrlKey && !event.metaKey) { // Permite Ctrl/Cmd + V
            event.preventDefault();
            return;
        }
        if (input.value.length >= 11 && /^[0-9]$/.test(event.key)) {
            event.preventDefault();
        }
    };

    const filterPhonePaste = (event) => {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const filteredPaste = paste.replace(/[^0-9]/g, '').substring(0, 11);
        const currentInput = event.target;
        const currentSelectionStart = currentInput.selectionStart;
        const currentSelectionEnd = currentInput.selectionEnd;

        const newValue = currentInput.value.substring(0, currentSelectionStart) + 
                         filteredPaste + 
                         currentInput.value.substring(currentSelectionEnd);
        
        currentInput.value = newValue.substring(0, 11);
        currentInput.setSelectionRange(currentSelectionStart + filteredPaste.length, currentSelectionStart + filteredPaste.length);
    };

    const preventTextInput = (event) => {
        const input = event.target;
        const isLetterOrSpaceKey = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]$/.test(event.key) ||
                                   event.key === 'Backspace' || event.key === 'Delete' ||
                                   event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
                                   event.key === 'Tab';

        if (!isLetterOrSpaceKey && !event.ctrlKey && !event.metaKey) { // Permite Ctrl/Cmd + V
            event.preventDefault();
        }
    };

    const filterNamePaste = (event) => {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const filteredPaste = paste.replace(/[^A-Za-zñÑáéíóúÁÉÍÓÚ\s]/g, '');
        const currentInput = event.target;
        const currentSelectionStart = currentInput.selectionStart;
        const currentSelectionEnd = currentInput.selectionEnd;

        const newValue = currentInput.value.substring(0, currentSelectionStart) + 
                         filteredPaste + 
                         currentInput.value.substring(currentSelectionEnd);
        
        currentInput.value = newValue; 
        currentInput.setSelectionRange(currentSelectionStart + filteredPaste.length, currentSelectionStart + filteredPaste.length);
    };

    // --- Asignar Event Listeners a los campos (mantener como antes) ---
    nombreInput.addEventListener('keydown', preventTextInput);
    nombreInput.addEventListener('paste', filterNamePaste);
    telefonoInput.addEventListener('keydown', preventNumberInput);
    telefonoInput.addEventListener('paste', filterPhonePaste);
    
    // --- Inicialización al cargar la página ---
    
    // Establecer la fecha mínima en el input de fecha (hoy)
    const today = new Date();
    // Use ISO format to set the min attribute for date input
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    fechaInput.min = `${year}-${month}-${day}`;

    // Renderizar las citas existentes al cargar la página
    renderCitas(); 
});
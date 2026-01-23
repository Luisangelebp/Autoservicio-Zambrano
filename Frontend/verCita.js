document.addEventListener('DOMContentLoaded', () => {
    const listaCitasDiv = document.getElementById('listaCitas');
    const btnAtras = document.getElementById('btnAtras');

    // Array para almacenar las citas (se carga y guarda en localStorage)
    let citas = JSON.parse(localStorage.getItem('citasServiFran')) || [];

    // Función para renderizar las citas en la interfaz
    const renderCitas = () => {
        listaCitasDiv.innerHTML = ''; // Limpiar el contenido actual
        
        if (citas.length === 0) {
            listaCitasDiv.innerHTML = '<p class="empty-list-message">No tienes citas agendadas aún.</p>';
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

            // Formatea el texto del servicio
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
            listaCitasDiv.appendChild(citaItem);
        });
    };

    // Event listener para eliminar o completar citas
    listaCitasDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('eliminar-cita') || event.target.closest('.eliminar-cita')) {
            const btn = event.target.closest('.eliminar-cita');
            const idEliminar = parseInt(btn.dataset.id);
            
            // Confirmación antes de eliminar
            if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
                return; // Si el usuario cancela, no hacemos nada
            }

            citas = citas.filter(cita => cita.id !== idEliminar);
            localStorage.setItem('citasServiFran', JSON.stringify(citas));
            // No hay mensaje aquí, pero se podría añadir un div para mensajes si es necesario
            renderCitas(); // Volver a renderizar la lista
        } else if (event.target.classList.contains('completar-cita') || event.target.closest('.completar-cita')) {
            const btn = event.target.closest('.completar-cita');
            const idCompletar = parseInt(btn.dataset.id);
            const citaIndex = citas.findIndex(cita => cita.id === idCompletar);
            if (citaIndex > -1) {
                citas[citaIndex].completada = true;
                localStorage.setItem('citasServiFran', JSON.stringify(citas));
                // No hay mensaje aquí
                renderCitas(); // Volver a renderizar para que muestre el estado "completada"
            }
        }
    });

    // Función para el botón "Atrás"
    btnAtras.addEventListener('click', () => {
        window.history.back(); // Regresa a la página anterior en el historial del navegador
    });

    // Inicializar la renderización de citas al cargar la página "verCitas.html"
    renderCitas();
});
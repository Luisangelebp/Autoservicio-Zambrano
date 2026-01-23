document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const mensajeRegistro = document.getElementById('mensaje-registro');

    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mostrar mensaje de carga
            mensajeRegistro.textContent = "Procesando registro...";
            mensajeRegistro.className = "message success";
            mensajeRegistro.style.display = "block";
            
            // Simulación de envío de datos
            setTimeout(() => {
                mensajeRegistro.textContent = "¡Registro exitoso! Redirigiendo...";
                
                // Aquí podrías redirigir al login después de 2 segundos
                /* setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000); 
                */
            }, 1500);
        });
    }
});
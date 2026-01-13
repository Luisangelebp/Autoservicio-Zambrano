document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const formPago = document.getElementById('formPago');
    const metodoPagoButtons = document.getElementById('metodoPagoButtons');
    const metodoPagoInput = document.getElementById('metodoPago');
    const camposDinamicosDiv = document.getElementById('camposDinamicos');
    const mensajePago = document.getElementById('mensajePago');
    const btnAtras = document.getElementById('btnAtras');

    // Campos de entrada estáticos para validación en tiempo real
    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo'); // Añadido para validación en tiempo real
    const telefonoInput = document.getElementById('telefono');
    const montoInput = document.getElementById('monto');

    // Define el monto máximo permitido
    const MONTO_MAXIMO_PERMITIDO = 100000000000.00; // 100 mil millones

    // Asegurarse de que el campo de monto no sea de solo lectura al cargar
    montoInput.removeAttribute('readonly');
    montoInput.placeholder = "Ingresa la cantidad a pagar (Bs.D)";

    // Lista de bancos venezolanos (puedes ampliarla o ajustarla)
    const bancosVenezuela = [
        "Seleccione un banco...", // Opción por defecto
        "Banco de Venezuela",
        "Banesco",
        "Mercantil",
        "BBVA Provincial",
        "Banco Nacional de Crédito (BNC)",
        "Banco Exterior",
        "Banco Activo",
        "Banco Occidental de Descuento (BOD)",
        "Banco Plaza",
        "Bancaribe",
        "Banco Venezolano de Crédito",
        "Banplus",
        "Banco Fondo Común (BFC)",
        "100% Banco",
        "Banco Caroní",
        "Banco Sofitasa",
        "DelSur",
        "Banco Bicentenario del Pueblo",
        "Mi Banco"
    ].sort((a, b) => {
        if (a === "Seleccione un banco...") return -1;
        if (b === "Seleccione un banco...") return 1;
        return a.localeCompare(b);
    });

    // --- Validaciones en tiempo real para los campos de entrada estáticos ---

    // Nombre Completo: Solo letras y espacios, máximo 25 caracteres
    nombreInput.addEventListener('input', (event) => {
        let value = event.target.value;
        value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Permite letras con acentos y ñ
        event.target.value = value.substring(0, 25);
    });
    nombreInput.addEventListener('paste', (event) => {
        event.preventDefault();
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        const currentValue = nombreInput.value;
        nombreInput.value = (currentValue + paste).substring(0, 25);
    });

    // Correo Electrónico: Validación básica
    correoInput.addEventListener('input', () => {
        // La validación real se hará al enviar el formulario con el 'type="email"' y 'required'
        // Puedes añadir aquí una validación más compleja si lo deseas, pero no es estrictamente necesario en tiempo real para email.
    });

    // Teléfono principal: Solo números, exactamente 11 dígitos
    telefonoInput.addEventListener('input', (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        event.target.value = value.substring(0, 11);
    });
    telefonoInput.addEventListener('paste', (event) => {
        event.preventDefault();
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\D/g, '');
        const currentValue = telefonoInput.value;
        telefonoInput.value = (currentValue + paste).substring(0, 11);
    });

    // Monto a Pagar: Solo números (con hasta 2 decimales) y límite máximo
    montoInput.addEventListener('input', (event) => {
        let value = event.target.value;
        // Permite solo dígitos y un punto decimal
        value = value.replace(/[^0-9.]/g, '');

        // Asegura que solo haya un punto decimal
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limita los decimales a 2
        if (parts.length === 2 && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }

        let numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue > MONTO_MAXIMO_PERMITIDO) {
            value = MONTO_MAXIMO_PERMITIDO.toFixed(2);
            mostrarMensaje(`El monto máximo permitido es Bs.D ${MONTO_MAXIMO_PERMITIDO.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`, 'error');
        } else {
            // Oculta el mensaje de error si el monto se corrige
            if (mensajePago.classList.contains('error')) {
                mensajePago.style.display = 'none';
            }
        }
        event.target.value = value;
    });
    // Similar para el evento 'paste' para monto
    montoInput.addEventListener('paste', (event) => {
        event.preventDefault();
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/[^0-9.]/g, '');
        const currentValue = montoInput.value;
        let finalValue = currentValue + paste;

        // Limpieza y formato igual que en 'input'
        const parts = finalValue.split('.');
        if (parts.length > 2) {
            finalValue = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts.length === 2 && parts[1].length > 2) {
            finalValue = parts[0] + '.' + parts[1].substring(0, 2);
        }

        let numericValue = parseFloat(finalValue);
        if (!isNaN(numericValue) && numericValue > MONTO_MAXIMO_PERMITIDO) {
            finalValue = MONTO_MAXIMO_PERMITIDO.toFixed(2);
            mostrarMensaje(`El monto máximo permitido es Bs.D ${MONTO_MAXIMO_PERMITIDO.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`, 'error');
        } else {
            if (mensajePago.classList.contains('error')) {
                mensajePago.style.display = 'none';
            }
        }
        montoInput.value = finalValue;
    });


    // --- Manejo de la selección del método de pago ---
    metodoPagoButtons.addEventListener('click', (event) => {
        // Asegurarse de que el clic fue en un botón y no en el div padre
        if (event.target.closest('button.option-btn')) {
            const clickedButton = event.target.closest('button.option-btn');
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            clickedButton.classList.add('selected');
            const selectedMetodo = clickedButton.dataset.metodo;
            metodoPagoInput.value = selectedMetodo;
            renderCamposDinamicos(selectedMetodo);
        }
    });

    // --- Función para renderizar campos dinámicos según el método de pago ---
    const renderCamposDinamicos = (metodo) => {
        camposDinamicosDiv.innerHTML = ''; // Limpia campos anteriores
        let htmlCampos = '';

        if (metodo === 'pago_movil') {
            htmlCampos = `
                <div class="input-group">
                    <label for="bancoOrigenPm">Banco de Origen (Pago Móvil):</label>
                    <select id="bancoOrigenPm" required>
                        ${bancosVenezuela.map(banco => `<option value="${banco}">${banco}</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label for="cedulaRifPm">Cédula o RIF:</label>
                    <input type="text" id="cedulaRifPm" placeholder="V-12345678, J-12345678-9" required>
                </div>
                <div class="input-group">
                    <label for="telefonoPm">Teléfono Registrado (Pago Móvil):</label>
                    <input type="tel" id="telefonoPm" placeholder="Ej: 04121234567 (11 dígitos, solo números)" pattern="\\d{11}" maxlength="11" required>
                </div>
            `;
        } else if (metodo === 'qr') {
            htmlCampos = `
                <p class="qr-info">Escanea el código QR a continuación para completar tu pago.</p>
                <div class="qr-code-placeholder">
                    <img src="https://via.placeholder.com/200?text=QR+Code+Here" alt="Código QR de Pago">
                    <p>O usa la app de tu banco.</p>
                </div>
                <div class="input-group">
                    <label for="cedulaRifQr">Cédula o RIF (opcional):</label>
                    <input type="text" id="cedulaRifQr" placeholder="V-12345678 o J-12345678-9 (opcional)">
                </div>
            `;
        }
        camposDinamicosDiv.innerHTML = htmlCampos;

        // Añadir listeners para validación en tiempo real a los nuevos campos dinámicos
        const cedulaRifPmInput = document.getElementById('cedulaRifPm');
        const cedulaRifQrInput = document.getElementById('cedulaRifQr');
        const telefonoPmInput = document.getElementById('telefonoPm');

        // Validaciones para teléfono de Pago Móvil (solo números y 11 dígitos)
        if (telefonoPmInput) {
            telefonoPmInput.addEventListener('input', (event) => {
                let value = event.target.value;
                value = value.replace(/\D/g, '');
                event.target.value = value.substring(0, 11);
            });
            telefonoPmInput.addEventListener('paste', (event) => {
                event.preventDefault();
                let paste = (event.clipboardData || window.clipboardData).getData('text');
                paste = paste.replace(/\D/g, '');
                const currentValue = telefonoPmInput.value;
                telefonoPmInput.value = (currentValue + paste).substring(0, 11);
            });
        }

        // Validaciones para Cédula/RIF (V/E/J/G/P, números, y guiones)
        // Función auxiliar para aplicar la validación de Cédula/RIF
        const applyCedulaRifValidation = (inputElement) => {
            if (inputElement) {
                inputElement.addEventListener('input', (event) => {
                    let value = event.target.value;
                    // Permite V, E, J, G, P (mayúsculas/minúsculas), números y guiones
                    value = value.replace(/[^VEJGPvejgp0-9-]/g, '').toUpperCase();
                    // Limita la longitud máxima si lo deseas, por ejemplo, 13 caracteres para J-XXXXXXXX-X
                    event.target.value = value.substring(0, 13);
                });
                inputElement.addEventListener('paste', (event) => {
                    event.preventDefault();
                    let paste = (event.clipboardData || window.clipboardData).getData('text');
                    paste = paste.replace(/[^VEJGPvejgp0-9-]/g, '').toUpperCase();
                    const currentValue = inputElement.value;
                    inputElement.value = (currentValue + paste).substring(0, 13);
                });
            }
        };

        applyCedulaRifValidation(cedulaRifPmInput);
        applyCedulaRifValidation(cedulaRifQrInput);
    };

    // --- Manejo del envío del formulario ---
    formPago.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita el envío tradicional del formulario

        // Re-validaciones finales
        const nombre = nombreInput.value;
        const correo = correoInput.value;
        const telefono = telefonoInput.value;
        const monto = montoInput.value;
        const metodoPago = metodoPagoInput.value;

        const nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,25}$/;
        if (!nombrePattern.test(nombre)) {
            mostrarMensaje('El nombre solo debe contener letras y espacios, con un máximo de 25 caracteres.', 'error');
            return;
        }

        // Validación de correo electrónico
        if (!correoInput.checkValidity()) { // Usa la validación nativa del navegador para email
            mostrarMensaje('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }

        const telefonoPrincipalPattern = /^\d{11}$/;
        if (!telefonoPrincipalPattern.test(telefono)) {
            mostrarMensaje('El teléfono principal debe contener exactamente 11 dígitos numéricos.', 'error');
            return;
        }

        const montoPattern = /^\d+(\.\d{1,2})?$/;
        if (!montoPattern.test(monto)) {
            mostrarMensaje('Por favor, ingresa un monto válido (ej. 150.75).', 'error');
            return;
        }
        const numericMonto = parseFloat(monto);
        if (numericMonto <= 0) {
            mostrarMensaje('El monto a pagar debe ser mayor a cero.', 'error');
            return;
        }
        if (numericMonto > MONTO_MAXIMO_PERMITIDO) {
            mostrarMensaje(`El monto máximo permitido es Bs.D ${MONTO_MAXIMO_PERMITIDO.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`, 'error');
            return;
        }

        if (!metodoPago) {
            mostrarMensaje('Por favor, selecciona un método de pago.', 'error');
            return;
        }

        // Recolectar todos los datos del formulario
        const datosPago = {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            metodoPago: metodoPago,
            monto: numericMonto
        };

        // Añadir campos dinámicos y sus validaciones finales
        if (metodoPago === 'pago_movil') {
            const bancoOrigenPmSelect = document.getElementById('bancoOrigenPm');
            const bancoOrigenPm = bancoOrigenPmSelect ? bancoOrigenPmSelect.value : '';
            const cedulaRifPmInput = document.getElementById('cedulaRifPm');
            const cedulaRifPm = cedulaRifPmInput ? cedulaRifPmInput.value : '';
            const telefonoPmInput = document.getElementById('telefonoPm');
            const telefonoPm = telefonoPmInput ? telefonoPmInput.value : '';


            if (bancoOrigenPm === "Seleccione un banco...") { mostrarMensaje('Selecciona un banco de origen para Pago Móvil.', 'error'); return; }
            if (!telefonoPm || !/^\d{11}$/.test(telefonoPm)) {
                mostrarMensaje('El Teléfono Registrado para Pago Móvil debe contener exactamente 11 dígitos numéricos.', 'error');
                return;
            }
            if (!validarCedulaRif(cedulaRifPm)) {
                mostrarMensaje('Formato de Cédula/RIF para Pago Móvil incorrecto. Ej: V-12345678 o J-12345678-9.', 'error');
                return;
            }

            datosPago.bancoOrigenPm = bancoOrigenPm;
            datosPago.cedulaRifPm = cedulaRifPm;
            datosPago.telefonoPm = telefonoPm;

        } else if (metodoPago === 'qr') {
            const cedulaRifQrInput = document.getElementById('cedulaRifQr');
            const cedulaRifQr = cedulaRifQrInput ? cedulaRifQrInput.value : '';
            if (cedulaRifQr && !validarCedulaRif(cedulaRifQr)) {
                mostrarMensaje('Formato de Cédula/RIF para Pago QR incorrecto. Ej: V-12345678 o J-12345678-9.', 'error');
                return;
            }
            datosPago.cedulaRifQr = cedulaRifQr;
        }

        // --- Función de validación de Cédula/RIF ---
        function validarCedulaRif(valor) {
            valor = valor.toUpperCase();
            // Patrón para V-XXXXXXXX o E-XXXXXXXX (8 dígitos)
            const cedulaPattern = /^[VE]-\d{8}$/;
            // Patrón para J/G/P-XXXXXXXX-X o J/G/P-XXXXXXX-X (7 a 9 dígitos antes del último guion)
            const rifPattern = /^[JGP]-\d{7,9}-\d{1}$/;
            return cedulaPattern.test(valor) || rifPattern.test(valor);
        }

        // --- Simulación de envío de datos ---
        mostrarMensaje('Procesando su pago...', 'info');

        setTimeout(() => {
            const pagoExitoso = Math.random() > 0.3; // 70% de éxito simulado

            if (pagoExitoso) {
                mostrarMensaje('¡Pago realizado con éxito! Gracias por tu compra.', 'success');
                formPago.reset(); // Limpia el formulario
                camposDinamicosDiv.innerHTML = ''; // Limpia campos dinámicos
                metodoPagoInput.value = ''; // Limpia el método de pago seleccionado
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.classList.remove('selected'); // Remueve la selección visual
                });
                // El botón Atrás ya es visible por HTML, no necesita cambiar display aquí
            } else {
                mostrarMensaje('Hubo un error al procesar tu pago. Por favor, inténtalo de nuevo.', 'error');
                // El botón Atrás ya es visible por HTML, no necesita cambiar display aquí
            }
        }, 2000); // Simula un retardo de 2 segundos para el procesamiento
    });

    // --- Función para mostrar mensajes al usuario ---
    const mostrarMensaje = (mensaje, tipo) => {
        mensajePago.textContent = mensaje;
        mensajePago.className = `message ${tipo}`;
        mensajePago.style.display = 'block';

        // Oculta el mensaje después de 5 segundos si no es de error persistente
        if (tipo !== 'error') {
            setTimeout(() => {
                mensajePago.style.display = 'none';
            }, 5000);
        }
    };

    // --- Botón Atrás ---
    btnAtras.addEventListener('click', () => {
        window.history.back(); // Regresa a la página anterior en el historial del navegador
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const btnChat = document.getElementById('btnChat');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChatBtn');

    // Función para abrir el chat
    if(btnChat) {
        btnChat.onclick = (e) => {
            e.preventDefault();
            chatContainer.style.display = 'flex';
        };
    }

    // Función para cerrar el chat
    if(closeChat) {
        closeChat.onclick = () => {
            chatContainer.style.display = 'none';
        };
    }

    // Mensaje de consola para verificar carga
    console.log("Portal de Auto Servicios Zambrano optimizado y listo.");
});
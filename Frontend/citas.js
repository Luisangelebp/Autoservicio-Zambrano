const token = localStorage.getItem('token');
async function fetchMecanicos() {
    try {
        const response = await axios.get('http://localhost:8000/mecanicos', {
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
        });
        const data = await response.data;
        return data;
    } catch (error) {
        console.error('Error fetching mechanics:', error);
        return [];
    }
}
fetchMecanicos().then((data) => {
    const mecanicosSelect = document.getElementById('mecanico');
    data.forEach((mecanico) => {
        const option = document.createElement('option');
        option.value = mecanico.id;
        option.textContent = `${mecanico.nombre} ${mecanico.apellido} --- ${mecanico.especialidad}`;
        mecanicosSelect.appendChild(option);
    });
});

async function getCitas() {
    try {
        const response = await axios.get('http://localhost:8000/citas', {
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
        });
        const data = await response.data;
        const citaByClienteId = data.filter(
            (cita) =>
                cita.id_cliente === JSON.parse(localStorage.getItem('user')).id,
        );

        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}
async function eliminarCita(citaId) {
    try {
        await axios.delete(`http://localhost:8000/citas/${citaId}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
        });
        alert('Cita eliminada con éxito');
        document.location.reload();
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error al eliminar la cita');
    }
}
function pagarCita() {
    window.location.href = 'pago.html';
}
getCitas().then(async (data) => {
    const citasList = document.getElementById('citasAgendadas');
    let Cmecanicos = [];
    await fetchMecanicos().then((mecanicos) => {
        Cmecanicos = mecanicos;
    });
    if (data.length > 0) {
        citasList.innerHTML = '';
        let citaidsByClienteId = data.filter(
            (cita) =>
                cita.id_cliente === JSON.parse(localStorage.getItem('user')).id,
        );
        citaidsByClienteId.forEach((cita) => {
            const CitaItemMecanico = Cmecanicos.find(
                (mecanico) => mecanico.id === cita.id_mecanico,
            );
            const citaItem = document.createElement('div');
            citaItem.classList.add('cita-item');
            citaItem.innerHTML = `
                <p><strong>Mecánico:</strong> ${CitaItemMecanico.nombre} ${CitaItemMecanico.apellido} </p>
                <p><strong>Servicio:</strong> ${cita.servicio}</p>
                <p><strong>Descripción:</strong> ${cita.descripcion}</p>
                <p><strong>Fecha:</strong> ${cita.fecha}</p>
                <p><strong>Estado:</strong> ${cita.estado}</p>
                <div class="acciones">
                    <button class="eliminar-cita" onclick="eliminarCita('${cita.id}')"><i class="fas fa-trash-alt"></i> Eliminar</button>
                    <button class="pagar-cita ${cita.estado !== 'confirmada' ? 'disabled' : ''}" onclick="pagarCita()"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                </div>
            `;
            citasList.appendChild(citaItem);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const citaForm = document.getElementById('citaForm');
    citaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const mecanicoId = document.getElementById('mecanico').value;
        const descripcion = document.getElementById('descripcion').value;
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;
        const dataToSend = {
            id_cliente: userId,
            id_mecanico: mecanicoId,
            fecha: fecha,
            descripcion: descripcion,
            servicio: servicio,
        };

        try {
            const response = await axios.post(
                'http://localhost:8000/citas',
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token,
                    },
                },
            );
            alert('Cita agendada con éxito');
            citaForm.reset();
            document.location.reload();
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            alert('Error al agendar la cita');
        }
    });
    document.getElementById('btnAtras').addEventListener('click', () => {
        window.location.href = 'pg_principal suario.html';
    });
});

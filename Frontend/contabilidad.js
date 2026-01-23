document.addEventListener('DOMContentLoaded', () => {
    // Selectores
    const periodoSelect = document.getElementById('periodo');
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');
    const filtrarBtn = document.getElementById('filtrarBtn');
    const resumenBody = document.getElementById('resumenBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const exportarBtn = document.getElementById('exportarBtn');

    // Inicializar datos si no existen
    if (!localStorage.getItem('serviciosRealizados')) {
        const demoData = [
            { mecanico: 'Carlos Méndez', costo: 1500, fecha: new Date().toISOString() },
            { mecanico: 'Juan Pérez', costo: 2800, fecha: new Date().toISOString() },
            { mecanico: 'Carlos Méndez', costo: 950, fecha: new Date(Date.now() - 172800000).toISOString() }
        ];
        localStorage.setItem('serviciosRealizados', JSON.stringify(demoData));
    }

    const getServicios = () => JSON.parse(localStorage.getItem('serviciosRealizados')) || [];

    const formatCurrency = (val) => val.toLocaleString('es-VE', { minimumFractionDigits: 2 }) + ' Bs.';

    function updateStats(count, total, top) {
        document.getElementById('statServicios').innerText = count;
        document.getElementById('statIngresos').innerText = formatCurrency(total);
        document.getElementById('statTopMecanico').innerText = top;
    }

    function getRange(period) {
        const now = new Date();
        let start = new Date(now);
        let end = new Date(now);
        end.setHours(23, 59, 59, 999);

        if (period === 'semanal') {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
        } else if (period === 'mensual') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (period === 'anual') {
            start = new Date(now.getFullYear(), 0, 1);
        } else {
            return { start: null, end: null };
        }
        start.setHours(0,0,0,0);
        return { start, end };
    }

    function render(start = null, end = null) {
        const servicios = getServicios();
        const filtered = servicios.filter(s => {
            const d = new Date(s.fecha);
            return (!start || d >= start) && (!end || d <= end);
        });

        resumenBody.innerHTML = '';
        if (filtered.length === 0) {
            noDataMessage.style.display = 'block';
            updateStats(0, 0, '-');
            return;
        }
        noDataMessage.style.display = 'none';

        const resumen = {};
        let granTotal = 0;

        filtered.forEach(s => {
            if (!resumen[s.mecanico]) resumen[s.mecanico] = { count: 0, total: 0 };
            const costo = parseFloat(s.costo) || 0;
            resumen[s.mecanico].count++;
            resumen[s.mecanico].total += costo;
            granTotal += costo;
        });

        const sorted = Object.keys(resumen).sort((a,b) => resumen[b].total - resumen[a].total);
        
        sorted.forEach(name => {
            const data = resumen[name];
            const percent = ((data.total / granTotal) * 100).toFixed(1);
            resumenBody.innerHTML += `
                <tr>
                    <td><strong>${name}</strong></td>
                    <td>${data.count}</td>
                    <td>${formatCurrency(data.total)}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
                            <span>${percent}%</span>
                        </div>
                    </td>
                </tr>`;
        });

        // Fila Total
        resumenBody.innerHTML += `
            <tr class="total-row">
                <td>TOTAL</td>
                <td>${filtered.length}</td>
                <td>${formatCurrency(granTotal)}</td>
                <td>100%</td>
            </tr>`;

        updateStats(filtered.length, granTotal, sorted[0] || '-');
    }

    // Eventos
    periodoSelect.addEventListener('change', (e) => {
        const { start, end } = getRange(e.target.value);
        fechaInicioInput.value = start ? start.toISOString().split('T')[0] : '';
        fechaFinInput.value = end ? end.toISOString().split('T')[0] : '';
        render(start, end);
    });

    filtrarBtn.addEventListener('click', () => {
        const s = fechaInicioInput.value ? new Date(fechaInicioInput.value) : null;
        const e = fechaFinInput.value ? new Date(fechaFinInput.value) : null;
        if(e) e.setHours(23,59,59);
        render(s, e);
    });

    exportarBtn.addEventListener('click', () => {
        let csv = "Mecanico,Servicios,Total (Bs),%\n";
        resumenBody.querySelectorAll('tr').forEach(row => {
            const cols = Array.from(row.querySelectorAll('td')).map(td => td.innerText.replace(' Bs.', '').replace('%', '').trim());
            if(cols.length) csv += cols.join(',') + "\n";
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Contabilidad_${new Date().toLocaleDateString()}.csv`;
        a.click();
    });

    // Carga inicial
    const initial = getRange('semanal');
    fechaInicioInput.value = initial.start.toISOString().split('T')[0];
    fechaFinInput.value = initial.end.toISOString().split('T')[0];
    render(initial.start, initial.end);
});
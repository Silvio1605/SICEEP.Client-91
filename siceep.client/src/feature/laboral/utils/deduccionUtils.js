export const formatoMoneda = (valor) => {
    if (valor === null || valor === undefined) return '—';
    return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 2 }).format(valor);
};

export const formatoFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(`${fecha}T00:00:00`).toLocaleString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const getIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

export const hoyIso = () => new Date().toISOString().slice(0, 10);
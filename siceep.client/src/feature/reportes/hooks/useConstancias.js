import { useCallback, useEffect, useRef, useState } from 'react';
import { getExpedientes, getExpedienteCompleto } from './../../expedientes/services/expedienteService';
import { getHistorial } from './../../laboral/services/laboralServices';
import { getConstanciaBaja } from './../services/reporteService';
import {
    generarConstanciaGeneralPDF,
    generarConstanciaSalarialPDF,
    generarConstanciaBajaPDF,
    generarConstanciaFamiliarPDF,
    generarConstanciaRecorridoPDF,
} from './../pdf/constanciasPdfService';

const DESCRIPCION_ESTADO = {
    1: 'Baja',
    2: 'Activo',
    3: 'Comisión/Servicio',
};

export const useConstancias = () => {
    const [busqueda, setBusqueda] = useState('');
    const [empleados, setEmpleados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [empleado, setEmpleado] = useState(null);
    const [datosExpediente, setDatosExpediente] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [datosBaja, setDatosBaja] = useState(null);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [generando, setGenerando] = useState(false);
    const [error, setError] = useState(null);
    const timer = useRef(null);

    const buscar = useCallback((texto) => {
        const q = (texto || '').trim();
        setBusqueda(texto);
        clearTimeout(timer.current);
        if (q.length < 2) {
            setEmpleados([]);
            setBuscando(false);
            return;
        }
        setBuscando(true);
        timer.current = setTimeout(async () => {
            try {
                const res = await getExpedientes({ Busqueda: q, Pagina: 1 });
                setEmpleados(res?.data?.data || []);
            } catch {
                setEmpleados([]);
            } finally {
                setBuscando(false);
            }
        }, 350);
    }, []);

    useEffect(() => () => clearTimeout(timer.current), []);

    const seleccionarEmpleado = useCallback(async (emp) => {
        if (!emp) {
            setEmpleado(null);
            setDatosExpediente(null);
            setHistorial([]);
            setDatosBaja(null);
            return;
        }
        setEmpleado(emp);
        setCargandoDatos(true);
        setError(null);
        try {
            const [expRes, histRes, bajaRes] = await Promise.all([
                getExpedienteCompleto(emp.id),
                getHistorial(emp.id),
                getConstanciaBaja(emp.id).catch(() => null),
            ]);
            setDatosExpediente(expRes?.data || null);
            setHistorial(histRes?.data || []);
            setDatosBaja(bajaRes?.data || null);
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || 'No se pudieron cargar los datos del empleado.');
        } finally {
            setCargandoDatos(false);
        }
    }, []);

    const generar = useCallback(async (tipo) => {
        if (!datosExpediente) return;
        const config = {
            numeroDocumento: `C-${empleado?.codigo || '0000'}`,
            firmanteNombre: 'NOMBRE DEL JEFE',
            firmanteCargo: 'Jefe de la Oficina de Registro y Control',
            firmanteTitulo: 'Ingeniero',
            ciudad: 'Managua',
        };
        const familiaresActivos = datosExpediente?.familiares?.filter((f) => f.activo !== false) || [];
        setGenerando(true);
        setError(null);
        try {
            if (tipo === 'general') {
                await generarConstanciaGeneralPDF(datosExpediente, config);
            } else if (tipo === 'salarial') {
                await generarConstanciaSalarialPDF(datosExpediente, config);
            } else if (tipo === 'familiar') {
                if (!familiaresActivos.length) throw new Error('El empleado no cuenta con familiares registrados en su expediente.');
                await generarConstanciaFamiliarPDF(datosExpediente, config);
            } else if (tipo === 'baja') {
                if (!datosBaja) throw new Error('El empleado no cuenta con un registro de baja.');
                await generarConstanciaBajaPDF(datosBaja, config);
            } else if (tipo === 'recorrido') {
                if (!historial?.length) throw new Error('El empleado no presenta recorrido laboral registrado.');
                await generarConstanciaRecorridoPDF(datosExpediente, historial, config);
            }
        } catch (e) {
            setError(e?.message || 'No se pudo generar el PDF.');
        } finally {
            setGenerando(false);
        }
    }, [empleado, datosExpediente, datosBaja, historial]);

    return {
        busqueda, buscar, empleados, buscando,
        empleado, seleccionarEmpleado,
        datosExpediente, datosBaja, historial,
        cargandoDatos, generando, error,
        descripcionEstado: emp => DESCRIPCION_ESTADO[emp?.estado] || 'S/D',
        tieneFamiliares: Boolean(datosExpediente?.familiares?.some((f) => f.activo !== false)),
        generar,
    };
};
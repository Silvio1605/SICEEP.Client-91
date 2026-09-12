import { useState, useCallback } from 'react';
import {
    getDeducciones, getTiposDeduccion, getInstitucionesDeduccion,
    registrarDeduccion, actualizarDeduccion, eliminarDeduccion as eliminarDeduccionService,
    registrarInstitucionDeduccion, actualizarInstitucionDeduccion, eliminarInstitucionDeduccion
} from './../services/laboralServices';
import { registrarBitacora } from './../../bitacora/service/bitacoraService';
import { formatoMoneda } from './../utils/deduccionUtils';

export const useDeducciones = () => {
    const [empleado, setEmpleado] = useState(null);
    const [deducciones, setDeducciones] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCatalogos, setLoadingCatalogos] = useState(false);
    const [error, setError] = useState(null);
    const [editando, setEditando] = useState(null);
    const [editandoInst, setEditandoInst] = useState(null);

    const cargarDeducciones = useCallback(async (idEmpleado) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDeducciones(idEmpleado);
            setDeducciones(res?.data || []);
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "No se pudieron cargar las deducciones.");
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarCatalogos = useCallback(async () => {
        setLoadingCatalogos(true);
        try {
            const [tiposRes, instRes] = await Promise.all([getTiposDeduccion(), getInstitucionesDeduccion()]);
            setTipos(tiposRes?.data || []);
            setInstituciones(instRes?.data || []);
        } catch {
            setTipos([]);
            setInstituciones([]);
        } finally {
            setLoadingCatalogos(false);
        }
    }, []);

    const seleccionarEmpleado = async (propietario) => {
        setEmpleado({ id: propietario.id, nombreCompleto: propietario.nombreCompleto });
        setEditando(null);
        if (tipos.length === 0 || instituciones.length === 0) cargarCatalogos();
        await cargarDeducciones(propietario.id);
    };

    const quitarEmpleado = () => {
        setEmpleado(null);
        setEditando(null);
    };

    const editarDeduccion = (fila) => {
        setEditando({
            id: fila.idDeduccion,
            tipo: String(fila.idTipoDeduccion),
            inst: fila.idInstitucionExterna ? String(fila.idInstitucionExterna) : '',
            monto: String(fila.monto),
            totalDeuda: fila.totalDeuda ? String(fila.totalDeuda) : '',
            fecha: fila.fechaDeduccion
        });
    };

    const cancelarEdicion = () => setEditando(null);

    const guardarDeduccion = async (campos, nombreTipo) => {
        const payload = {
            idDeduccion: editando?.id || 0,
            idEmpleado: empleado.id,
            idTipoDeduccion: campos.tipo,
            idInstitucionExterna: campos.inst,
            monto: campos.monto,
            totalDeuda: campos.totalDeuda,
            fechaDeduccion: campos.fecha
        };
        const res = payload.idDeduccion
            ? await actualizarDeduccion(payload)
            : await registrarDeduccion(payload);
        try {
            await registrarBitacora(2, `Deducción ${payload.idDeduccion ? 'actualizada' : 'registrada'}: ${nombreTipo} (${formatoMoneda(payload.monto)}) - ${empleado.nombreCompleto}`);
        } catch { }
        setEditando(null);
        await cargarDeducciones(empleado.id);
        return res?.data || {};
    };

    const eliminarDeduccion = async (fila) => {
        await eliminarDeduccionService(fila.idDeduccion);
        try {
            await registrarBitacora(2, `Deducción eliminada: ${fila.nombreTipoDeduccion} (${fila.periodo}) - ${empleado.nombreCompleto}`);
        } catch { }
        await cargarDeducciones(empleado.id);
    };

    const editarInstitucion = (i) => setEditandoInst(i);

    const limpiarInstitucion = () => setEditandoInst(null);

    const guardarInstitucion = async ({ id, nombre, descripcion }) => {
        const payload = {
            idInstitucionExterna: id || 0,
            nombre,
            descripcion: descripcion?.trim() || null
        };
        const res = payload.idInstitucionExterna
            ? await actualizarInstitucionDeduccion(payload)
            : await registrarInstitucionDeduccion(payload);
        try {
            await registrarBitacora(2, `Institución ${payload.idInstitucionExterna ? 'actualizada' : 'registrada'}: ${nombre}`);
        } catch { }
        setEditandoInst(null);
        await cargarCatalogos();
        return res?.data || {};
    };

    const eliminarInstitucion = async (i) => {
        await eliminarInstitucionDeduccion(i.idInstitucionExterna);
        try {
            await registrarBitacora(2, `Institución eliminada: ${i.nombre}`);
        } catch { }
        await cargarCatalogos();
    };

    return {
        empleado, deducciones, tipos, instituciones,
        loading, loadingCatalogos, error,
        seleccionarEmpleado, quitarEmpleado,
        editando, editarDeduccion, cancelarEdicion,
        guardarDeduccion, eliminarDeduccion,
        editandoInst, editarInstitucion, limpiarInstitucion,
        guardarInstitucion, eliminarInstitucion
    };
};
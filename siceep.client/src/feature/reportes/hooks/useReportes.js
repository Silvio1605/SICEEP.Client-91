import { useState, useCallback, useEffect } from 'react';
import { getFuerzaLaboral, getAltasBajas } from './../services/reporteService';
import { generarFuerzaLaboralPDF, generarAltasBajasPDF } from './../pdf/reportePdfService';

export const useReportes = () => {
    const [fuerza, setFuerza] = useState(null);
    const [altasBajas, setAltasBajas] = useState(null);
    const [consultado, setConsultado] = useState(null);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [loadingFuerza, setLoadingFuerza] = useState(true);
    const [loadingAltas, setLoadingAltas] = useState(false);
    const [generando, setGenerando] = useState(false);
    const [errorFuerza, setErrorFuerza] = useState(null);
    const [errorAltas, setErrorAltas] = useState(null);

    const cargarFuerza = useCallback(async () => {
        setLoadingFuerza(true);
        setErrorFuerza(null);
        try {
            const res = await getFuerzaLaboral();
            setFuerza(res?.data || null);
        } catch (e) {
            setErrorFuerza(e?.response?.data?.message || e?.message || "No se pudo cargar el informe de fuerza laboral.");
        } finally {
            setLoadingFuerza(false);
        }
    }, []);

    const consultarAltasBajas = useCallback(async (m = mes, a = anio) => {
        setLoadingAltas(true);
        setErrorAltas(null);
        try {
            const res = await getAltasBajas(m, a);
            setAltasBajas(res?.data || null);
            setConsultado({ mes: m, anio: a });
        } catch (e) {
            setErrorAltas(e?.response?.data?.message || e?.message || "No se pudo cargar el informe de altas y bajas.");
        } finally {
            setLoadingAltas(false);
        }
    }, [mes, anio]);

    useEffect(() => {
        let activo = true;
        const inicializar = async () => {
            try {
                const res = await getFuerzaLaboral();
                if (activo) {
                    setFuerza(res?.data || null);
                    setErrorFuerza(null);
                }
            } catch (e) {
                if (activo) setErrorFuerza(e?.response?.data?.message || e?.message || "No se pudo cargar el informe de fuerza laboral.");
            } finally {
                if (activo) setLoadingFuerza(false);
            }
        };
        inicializar();
        return () => { activo = false; };
    }, []);

    const descargarFuerza = useCallback(async () => {
        setGenerando(true);
        try {
            const dato = fuerza ?? await (async () => {
                const res = await getFuerzaLaboral();
                return res?.data || null;
            })();
            if (dato) await generarFuerzaLaboralPDF(dato);
        } catch (e) {
            alert(e?.message || "No se pudo generar el PDF.");
        } finally {
            setGenerando(false);
        }
    }, [fuerza]);

    const descargarAltasBajas = useCallback(async () => {
        setGenerando(true);
        try {
            const vigente = consultado?.mes === mes && consultado?.anio === anio;
            const dato = vigente
                ? altasBajas
                : (await getAltasBajas(mes, anio))?.data || null;
            if (dato) await generarAltasBajasPDF(dato);
        } catch (e) {
            alert(e?.message || "No se pudo generar el PDF.");
        } finally {
            setGenerando(false);
        }
    }, [altasBajas, consultado, mes, anio]);

    return {
        fuerza, altasBajas, consultado,
        mes, setMes, anio, setAnio,
        loadingFuerza, loadingAltas, generando,
        errorFuerza, errorAltas,
        recargarFuerza: cargarFuerza,
        consultarAltasBajas, descargarFuerza, descargarAltasBajas
    };
};
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Box, Typography, Alert, Skeleton, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { getExpedienteCompleto, getEstudios } from '../../expedientes/services/expedienteService';
import { mapearCompletoADetalle, nombreCompletoPersona } from '../../expedientes/utils/expedienteMappers';
import { generarFichaExpedienteURL, obtenerFotoPerfilURL } from '../../expedientes/services/pdfService.jsx';
import { registrarBitacora } from '../../bitacora/service/bitacoraService';
import { ACCION_BITACORA } from '../../../shared/constants/accionesBitacora';
import { getHistorial } from '../../laboral/services/laboralServices';
import { getConstanciaBaja } from '../../reportes/services/reporteService';
import {
    generarConstanciaBajaURL,
    generarConstanciaFamiliarURL,
    generarConstanciaLaboralURL,
    generarConstanciaRecorridoURL,
    generarConstanciaSalarialURL,
} from '../../reportes/pdf/constanciasPdfService';
import ModalVistaPreviaPDF from '../../expedientes/components/modal/ModalVistaPreviaPDF';
import ModalOpcionesImpresion from '../components/ModalOpcionesImpresion';
import ModalDocumentosDigitales from '../components/ModalDocumentosDigitales';
import FiltroBusqueda from '../components/FiltroBusqueda';
import { columnsBusquedaRapida } from '../services/expedientesData';
import useExpedientes from '../hooks/useExpedientes';
import { useScreenType } from '../../../shared/hooks/useScreenType';


// Traduce las opciones del modal (fichaCompleta, etc.) a las que espera el PDF
const mapearOpcionesImpresion = (opciones) => {
    if (opciones.fichaCompleta) return { todo: true };
    const secciones = {
        personal: opciones.infoPersonal,
        familiar: opciones.infoFamiliar,
        laboral: opciones.trayectoria,
        academica: opciones.perfilAcademico,
    };
    // Si ninguna se marcó, se imprime todo
    const algunaMarcada = Object.values(secciones).some(Boolean);
    return algunaMarcada ? secciones : { todo: true };
};

// Etiquetas legibles por tipo de constancia, para la descripción de la bitácora
const ETIQUETA_CONSTANCIA = {
    laboral: 'constancia laboral',
    salarial: 'constancia salarial',
    familiar: 'constancia familiar',
    baja: 'constancia de baja',
    recorrido: 'constancia de recorrido',
};

export default function BusquedaRapida() {
    const { isMobile } = useScreenType();

    // Empleado sobre el que se ejecutan las acciones (constancias, ficha, documentos)
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

    // Modal de opciones de impresión (claveImpresion re-monta el modal en cada apertura)
    const [modalImpresionAbierto, setModalImpresionAbierto] = useState(false);
    const [claveImpresion, setClaveImpresion] = useState(0);

    // Vista previa del PDF
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
    const [nombreDescarga, setNombreDescarga] = useState('Documento.pdf');
    const fotoUrlRef = useRef(null);

    // Modal de Documentos Digitales (claveDocs re-monta el modal en cada apertura)
    const [modalDocsAbierto, setModalDocsAbierto] = useState(false);
    const [claveDocs, setClaveDocs] = useState(0);

    // Búsqueda y paginación de expedientes (en el hook useExpedientes)
    const { expedientes, total, cargando, error, busqueda, page, manejarBusqueda, cambiarPagina, PAGINA_TAMANO } = useExpedientes();

    const cargarExpedienteCompleto = useCallback(async (empleado) => {
        const dto = (await getExpedienteCompleto(empleado?.id)).data;
        const detalle = mapearCompletoADetalle(dto);
        const estudios = dto?.persona?.idPersona
            ? (await getEstudios(dto.persona.idPersona).catch(() => ({ data: [] }))).data
            : [];
        return { dto, detalle, estudios };
    }, []);

    const generarConstancia = useCallback(async (tipo, empleado) => {
        try {
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);

            const { dto } = await cargarExpedienteCompleto(empleado);
            const codigo = dto?.codigo || empleado?.codigo || 'sincodigo';
            const config = { numeroDocumento: `C-${codigo}` };

            if (tipo === 'baja') {
                // En BAJA muestra período laborado, salario y motivo de la baja
                const bajaDto = (await getConstanciaBaja(empleado.id)).data;
                setNombreDescarga(`Constancia-Baja-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaBajaURL(bajaDto, config));
            } else if (tipo === 'recorrido') {
                const historial = (await getHistorial(empleado.id).catch(() => ({ data: [] }))).data;
                if (!historial?.length) throw new Error('El empleado no presenta recorrido laboral registrado.');
                setNombreDescarga(`Constancia-Recorrido-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaRecorridoURL({ ...dto }, historial, config));
            } else if (tipo === 'familiar') {
                if (!dto?.familiares?.length) throw new Error('El expediente no contiene miembros de familia registrados.');
                setNombreDescarga(`Constancia-Familiar-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaFamiliarURL({ ...dto }, config));
            } else if (tipo === 'salarial') {
                setNombreDescarga(`Constancia-Salarial-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaSalarialURL({ ...dto }, config));
            } else {
                setNombreDescarga(`Constancia-${codigo}.pdf`);
                setPdfUrl(await generarConstanciaLaboralURL({ ...dto }, config));
            }

            // Registra la generación en la bitácora (fire-and-forget: no rompe el PDF)
            registrarBitacora(
                ACCION_BITACORA.GENERAR_CONSTANCIA,
                `Generación de ${ETIQUETA_CONSTANCIA[tipo] || `constancia (${tipo})`} - Expediente ${codigo} - ${nombreCompletoPersona(dto?.persona) || 'funcionario'}`
            );
        } catch (err) {
            console.error('Error al generar la constancia: ', err);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
            if (typeof alert === 'function') alert(`Error al generar la constancia: ${err?.message || 'desconocido'}`);
        } finally {
            setGenerandoPDF(false);
        }
    }, [cargarExpedienteCompleto]);

    const manejarImpresion = async (opcionesSeleccionadas) => {
        try {
            setModalImpresionAbierto(false);
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);

            const { dto, detalle, estudios } = await cargarExpedienteCompleto(empleadoSeleccionado);
            setNombreDescarga(`Ficha-Expediente-${dto?.codigo || 'sin-codigo'}.pdf`);

            const fotoUrl = await obtenerFotoPerfilURL(dto);
            fotoUrlRef.current = fotoUrl;

            const opcionesPDF = mapearOpcionesImpresion(opcionesSeleccionadas);
            const url = await generarFichaExpedienteURL({ ...dto, ...detalle }, estudios, opcionesPDF, fotoUrl);
            setPdfUrl(url);
        } catch (err) {
            console.error("Error al generar el PDF: ", err);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
            if (typeof alert === 'function') alert(`Error al generar el documento: ${err?.message || 'desconocido'}`);
        } finally {
            setGenerandoPDF(false);
        }
    };

    const cerrarVistaPrevia = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        if (fotoUrlRef.current) {
            URL.revokeObjectURL(fotoUrlRef.current);
            fotoUrlRef.current = null;
        }
        setPdfUrl(null);
        setVistaPreviaAbierta(false);
    };

    // Abre el modal de opciones de impresión (Ficha) para el empleado seleccionado
    const abrirFicha = useCallback((row) => {
        setEmpleadoSeleccionado(row);
        setClaveImpresion((c) => c + 1); // re-monta el modal para que reinicie las opciones
        setModalImpresionAbierto(true);
    }, []);

    // Genera la constancia del tipo indicado para el empleado seleccionado
    const manejarConstancia = useCallback((row, tipo) => {
        setEmpleadoSeleccionado(row);
        generarConstancia(tipo, row);
    }, [generarConstancia]);

    // Abre el modal con los documentos digitales del funcionario seleccionado
    const abrirDocumentos = useCallback((row) => {
        setEmpleadoSeleccionado(row);
        setClaveDocs((c) => c + 1); // re-monta el modal para que recargue los documentos
        setModalDocsAbierto(true);
    }, []);

    // Columnas memorizadas: mismo patrón que la tabla de Usuarios
    const registros = useMemo(() => columnsBusquedaRapida({
        isMobile,
        onFicha: abrirFicha,
        onConstancia: manejarConstancia,
        onDocumentos: abrirDocumentos,
    }), [isMobile, abrirFicha, manejarConstancia, abrirDocumentos]);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Typography variant="h5" color="text.primary" fontWeight="bold" sx={{ mb: 1 }}>
                Búsqueda Rápida
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Consulta ágil de expedientes y generación de reportes.
            </Typography>

            <Box sx={{ width: '100%', minWidth: 0, minHeight: 0 }}>
                <FiltroBusqueda busqueda={busqueda} onBuscar={manejarBusqueda} />

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Registros de expedientes
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                {cargando && expedientes.length === 0 ? (
                    <Stack spacing={1}>
                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                        <Skeleton variant="rounded" width={'100%'} height={60} />
                    </Stack>
                ) : (
                    <DataGrid
                        rows={expedientes}
                        columns={registros}
                        getRowId={(row) => row.id}
                        autoHeight
                        loading={cargando}
                        disableColumnMenu
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        pagination
                        paginationMode="server"
                        rowCount={total ?? 0}
                        paginationModel={{ page, pageSize: PAGINA_TAMANO }}
                        onPaginationModelChange={(model) => cambiarPagina(model.page)}
                        pageSizeOptions={[PAGINA_TAMANO]}
                        slots={{ toolbar: null }}
                        initialState={{ pagination: { paginationModel: { pageSize: PAGINA_TAMANO } } }}
                        localeText={{ noRowsLabel: "No hay expedientes", noResultsOverlayLabel: "No se encontraron resultados", MuiTablePagination: { labelRowsPerPage: "Filas:" } }}
                        sx={{
                            border: 'none',
                            backgroundColor: '#ffffff',
                            '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                            '& .header-negrita': { fontWeight: 'bold' },
                        }}
                    />
                )}
            </Box>

            {/* Modal de opciones de impresión */}
            <ModalOpcionesImpresion
                key={`impresion-${claveImpresion}`}
                abierto={modalImpresionAbierto}
                alCerrar={() => setModalImpresionAbierto(false)}
                onImprimir={manejarImpresion}
            />

            {/* Vista previa del PDF */}
            <ModalVistaPreviaPDF
                abierto={vistaPreviaAbierta}
                pdfUrl={pdfUrl}
                nombreDescarga={nombreDescarga}
                cargando={generandoPDF}
                alCerrar={cerrarVistaPrevia}
            />

            {/* Modal de Documentos Digitales */}
            <ModalDocumentosDigitales
                key={`docs-${claveDocs}`}
                abierto={modalDocsAbierto}
                empleado={empleadoSeleccionado}
                alCerrar={() => setModalDocsAbierto(false)}
            />
        </Box>
    );
}

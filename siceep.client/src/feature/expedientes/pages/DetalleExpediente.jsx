import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Importación de Componentes Hijos
import InfoPersonal from '../components/ver/InfoPersonal';
import InfoFamiliar from '../components/ver/InfoFamiliar';
import InfoLaboral from '../components/ver/InfoLaboral';
import InfoAcademica from '../components/ver/InfoAcademica';
import TabDocumentos from '../components/crear/TabDocumentos';
import ModalImpresion from '../components/ModalImpresion';
import ModalVistaPreviaPDF from '../components/ModalVistaPreviaPDF';

import { getExpedienteCompleto, getSelectEstCivil, getEstudios } from '../services/expedienteService';
import { mapearCompletoADetalle } from '../utils/expedienteMappers';
import { generarFichaExpedienteURL, obtenerFotoPerfilURL } from '../services/pdfService.jsx';

// Mapa local por si el catálogo no responde
const ESTADOS_CIVIL_FALLBACK = { 1: 'SOLTERO', 2: 'CASADO', 1002: 'UNION DE HECHO' };

export default function DetalleExpediente() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // Estados principales
    const [tabValue, setTabValue] = useState(0);
    const [datosExpediente, setDatosExpediente] = useState(null);
    const [datosEmpleado, setDatosEmpleado] = useState(null);
    const [estudios, setEstudios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    // OBTENCIÓN DE DATOS REALES: GET /api/Expediente/{idEmpleado}
    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            try {
                setCargando(true);
                setError(null);
                const [expResponse, civilResponse] = await Promise.all([
                    getExpedienteCompleto(id),
                    getSelectEstCivil().catch(() => ({
                        data: [
                            { id: 1, nombre: ESTADOS_CIVIL_FALLBACK[1] },
                            { id: 2, nombre: ESTADOS_CIVIL_FALLBACK[2] },
                            { id: 1002, nombre: ESTADOS_CIVIL_FALLBACK[1002] },
                        ],
                    })),
                ]);

                if (!activo) return;

                const dto = expResponse.data;
                const civilMap = { ...ESTADOS_CIVIL_FALLBACK };
                (civilResponse.data || []).forEach((e) => {
                    civilMap[e.id] = e.nombre;
                });

                const detalle = mapearCompletoADetalle(dto);
                detalle.estadoCivil = dto?.persona?.idEstadoCivil ? (civilMap[dto.persona.idEstadoCivil] || 'NO DISPONIBLE') : 'NO DISPONIBLE';

                const estudiosResponse = dto?.persona?.idPersona
                    ? await getEstudios(dto.persona.idPersona).catch(() => ({ data: [] }))
                    : null;

                if (!activo) return;
                setEstudios(estudiosResponse?.data || []);
                setDatosExpediente(dto);
                setDatosEmpleado(detalle);
            } catch (err) {
                if (activo) setError(err);
            } finally {
                if (activo) setCargando(false);
            }
        };

        cargar();
        return () => { activo = false; };
    }, [id]);

    // MANEJO DE NAVEGACIÓN Y PESTAÑAS
    useEffect(() => {
        queueMicrotask(() => {
            const path = location.pathname;
            if (path.includes('info-personal')) setTabValue(0);
            else if (path.includes('info-familiar')) setTabValue(1);
            else if (path.includes('info-laboral')) setTabValue(2);
            else if (path.includes('info-academica')) setTabValue(3);
            else if (path.includes('documentos')) setTabValue(4);
        });
    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const expedienteId = id || "1";
        const rutas = ['info-personal', 'info-familiar', 'info-laboral', 'info-academica', 'documentos'];
        navigate(`/index/${rutas[newValue]}/${expedienteId}`);
    };
    // ACCIONES
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
    const fotoUrlRef = useRef(null);

    const ejecutarImpresionFinal = async (opcionesSeleccionadas) => {
        try {
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);
            const fotoUrl = await obtenerFotoPerfilURL(datosExpediente);
            fotoUrlRef.current = fotoUrl;
            const url = await generarFichaExpedienteURL(datosExpediente, estudios, opcionesSeleccionadas, fotoUrl);
            setPdfUrl(url);
        } catch (err) {
            const mensaje = err?.message || 'No se pudo generar el documento PDF.';
            if (typeof alert === 'function') alert(`Error al generar el documento: ${mensaje}`);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
        } finally {
            setGenerandoPDF(false);
        }
    };

    const cerrarVistaPrevia = () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        if (fotoUrlRef.current) {
            URL.revokeObjectURL(fotoUrlRef.current);
            fotoUrlRef.current = null;
        }
        setPdfUrl(null);
        setVistaPreviaAbierta(false);
    };

    const irAEditar = () => {
        navigate(`/index/editar-expediente/${id}`);
    };

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !datosExpediente) {
        return (
            <Box sx={{ p: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/index/expedientes')} color="inherit" sx={{ mb: 3 }}>
                    Volver al listado
                </Button>
                <Alert severity="error" variant="filled">
                    No se pudo cargar el expediente ({id}): {error?.response?.data?.message || error?.message || 'Error desconocido'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>

            {/* Header de Acciones */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/index/expedientes')} color="inherit">
                    Volver al listado
                </Button>
                <Box display="flex" gap={2}>
                    <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => setModalAbierto(true)} disabled={generandoPDF}>
                        Imprimir
                    </Button>
                    <Button variant="contained" startIcon={<EditIcon />} onClick={irAEditar}>
                        Editar
                    </Button>
                </Box>
            </Box>

            {/* Cabecera del Expediente */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{datosEmpleado.nombreCompleto}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Número de Expediente: {datosExpediente.numeroExpediente || datosExpediente.codigo || `EXP-${String(id).padStart(6, '0')}`}
                </Typography>
            </Paper>

            {/* Pestañas */}
            <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="Info. Personal" />
                    <Tab label="Info. Familiar" />
                    <Tab label="Info. Laboral" />
                    <Tab label="Info. Académica" />
                    <Tab label="Documentos" />
                </Tabs>
            </Paper>

            {/* Contenido Dinámico */}
            <Box>
                {tabValue === 0 && <InfoPersonal data={datosExpediente} />}
                {tabValue === 1 && <InfoFamiliar data={datosExpediente} />}
                {tabValue === 2 && <InfoLaboral data={datosExpediente} />}
                {tabValue === 3 && <InfoAcademica data={datosEmpleado} estudios={estudios} />}
                {tabValue === 4 && <TabDocumentos expediente={datosExpediente} />}
            </Box>

            {/* Componente Modular del Modal */}
            <ModalImpresion
                abierto={modalAbierto}
                alCerrar={() => setModalAbierto(false)}
                alImprimir={ejecutarImpresionFinal}
            />

            {/* Vista Previa del PDF antes de descargar */}
            <ModalVistaPreviaPDF
                abierto={vistaPreviaAbierta}
                pdfUrl={pdfUrl}
                nombreDescarga={`Ficha-Expediente-${datosExpediente?.numeroExpediente || 'sin-numero'}.pdf`}
                cargando={generandoPDF}
                alCerrar={cerrarVistaPrevia}
            />

        </Box>
    );
}
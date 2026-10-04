import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, Paper, Button, Tabs, Tab, CircularProgress, Alert, Chip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../../providers/Authenticacion/useAuth';
import { RECURSO } from '../../../shared/constants/recursos';

// Importación de Componentes Hijos
import InfoPersonal from '../components/ver/InfoPersonal';
import InfoFamiliar from '../components/ver/InfoFamiliar';
import InfoLaboral from '../components/ver/InfoLaboral';
import InfoNomina from '../components/ver/InfoNomina';
import InfoAcademica from '../components/ver/InfoAcademica';
import TabDocumentos from '../components/crear/TabDocumentos';
import ModalImpresion from '../components/ModalImpresion';
import ModalVistaPreviaPDF from '../components/ModalVistaPreviaPDF';

import { getExpedienteCompleto, getSelectEstCivil, getEstudios } from '../services/expedienteService';
import { mapearCompletoADetalle } from '../utils/expedienteMappers';
import { generarFichaExpedienteURL, obtenerFotoPerfilURL } from '../services/pdfService.jsx';

// Mapa local por si el catálogo no responde
const ESTADOS_CIVIL_FALLBACK = { 1: 'SOLTERO', 2: 'CASADO', 1002: 'UNION DE HECHO' };

// Estado funcional del empleado (1 Baja, 2 Activo, 3 Com/Servicio)
const ESTADO_FUNCIONARIO = {
    1: { label: 'De baja', color: 'error' },
    2: { label: 'Activo', color: 'success' },
    3: { label: 'Com/Servicio', color: 'warning' },
};
const FONDO_ESTADO = {
    1: '#ffebe9',
    3: '#fff7e6',
};

// Cada pestaña declara el recurso que la API exige para su contenido. El menu,
// la ruta y el componente salen de la misma entrada, de modo que ocultar una
// pestaña nunca puede desalinear el indice con la URL o con el contenido.
const TABS = [
    {
        label: 'Info. Personal',
        ruta: 'info-personal',
        idPermiso: RECURSO.CONSULTAR_EXPEDIENTES,
        render: ({ datosExpediente }) => <InfoPersonal data={datosExpediente} />,
    },
    {
        label: 'Info. Familiar',
        ruta: 'info-familiar',
        idPermiso: RECURSO.CONSULTAR_EXPEDIENTES,
        render: ({ datosExpediente }) => <InfoFamiliar data={datosExpediente} />,
    },
    {
        label: 'Info. Laboral',
        ruta: 'info-laboral',
        idPermiso: RECURSO.CONSULTAR_EXPEDIENTES,
        render: ({ datosExpediente }) => <InfoLaboral data={datosExpediente} />,
    },
    {
        label: 'Info. Nomina',
        ruta: 'info-nomina',
        idPermiso: RECURSO.DEDUCCIONES,
        render: ({ datosExpediente }) => <InfoNomina idEmpleado={datosExpediente?.idEmpleado} />,
    },
    {
        label: 'Info. Académica',
        ruta: 'info-academica',
        idPermiso: RECURSO.FORMACION_ACADEMICA,
        render: ({ datosEmpleado, estudios }) => <InfoAcademica data={datosEmpleado} estudios={estudios} />,
    },
    {
        label: 'Documentos',
        ruta: 'documentos',
        idPermiso: RECURSO.DOCUMENTOS_EXPEDIENTE,
        render: ({ datosExpediente }) => <TabDocumentos expediente={datosExpediente} />,
    },
];

export default function DetalleExpediente() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { tienePermiso } = useAuth();

    // Estados principales
    const [tabValue, setTabValue] = useState(0);
    const [datosExpediente, setDatosExpediente] = useState(null);
    const [datosEmpleado, setDatosEmpleado] = useState(null);
    const [estudios, setEstudios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    // Solo se ofrecen las pestañas cuyo recurso el usuario tiene asignado.
    const tabsVisibles = useMemo(
        () => TABS.filter((t) => tienePermiso(t.idPermiso)),
        [tienePermiso]
    );
    const activa = tabsVisibles[tabValue] ?? tabsVisibles[0] ?? null;
    const puedeEditar = tienePermiso(RECURSO.ACTUALIZAR_EXPEDIENTE);

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

                // getEstudios vive bajo el recurso Formacion Academica: pedirlo sin
                // ese permiso solo produce un 403 garantizado.
                const estudiosResponse = (dto?.persona?.idPersona && tienePermiso(RECURSO.FORMACION_ACADEMICA))
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
    }, [id, tienePermiso]);

    // MANEJO DE NAVEGACIÓN Y PESTAÑAS
    useEffect(() => {
        queueMicrotask(() => {
            if (tabsVisibles.length === 0) return;

            const indice = tabsVisibles.findIndex((t) => location.pathname.includes(t.ruta));
            if (indice >= 0) {
                setTabValue(indice);
                return;
            }

            // La URL apunta a una pestaña que el usuario no tiene asignada:
            // se redirige a la primera disponible en vez de dejarla vacia.
            setTabValue(0);
            navigate(`/index/${tabsVisibles[0].ruta}/${id || "1"}`, { replace: true });
        });
    }, [location.pathname, tabsVisibles, navigate, id]);

    const handleTabChange = (event, newValue) => {
        const destino = tabsVisibles[newValue];
        if (!destino) return;
        setTabValue(newValue);
        navigate(`/index/${destino.ruta}/${id || "1"}`);
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
                        {puedeEditar && (
                            <Button variant="contained" startIcon={<EditIcon />} onClick={irAEditar}>
                                Editar
                            </Button>
                        )}

                </Box>
            </Box>

            {/* Cabecera del Expediente */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    ...(FONDO_ESTADO[datosExpediente.idEstado] ? { backgroundColor: FONDO_ESTADO[datosExpediente.idEstado] } : {}),
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{datosEmpleado.nombreCompleto}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Número de Expediente: {datosExpediente.numeroExpediente || datosExpediente.codigo || `EXP-${String(id).padStart(6, '0')}`}
                        </Typography>
                    </Box>
                    <Chip
                        label={ESTADO_FUNCIONARIO[datosExpediente.idEstado]?.label || datosExpediente.desEstado || 'Sin estado'}
                        color={ESTADO_FUNCIONARIO[datosExpediente.idEstado]?.color || 'default'}
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>
            </Paper>

            {/* Pestañas */}
            <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    {tabsVisibles.map((tab) => (
                        <Tab key={tab.ruta} label={tab.label} />
                    ))}
                </Tabs>
            </Paper>

            {/* Contenido Dinámico */}
            <Box>
                {activa && activa.render({ datosExpediente, datosEmpleado, estudios })}
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
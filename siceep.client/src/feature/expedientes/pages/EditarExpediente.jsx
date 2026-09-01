import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Tabs, Tab, Button, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText, Divider,
    Snackbar, Alert, CircularProgress, LinearProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import TabDatosGenerales from '../components/crear/TabDatosGenerales';
import TabInfoLaboral from '../components/crear/TabInfoLaboral';
import TabCaracteristicas from '../components/crear/TabCaracteristicas';
import TabNucleofamiliar from '../components/crear/TabNucleofamiliar';
import TabInfoAcademica from '../components/crear/TabInfoAcademica';

import { ExpedienteContext } from './../context/ExpedienteContext';
import { useProgresoExpediente } from './../hooks/useProgresoExpediente';
import { getExpedienteCompleto, actualizarExpediente } from '../services/expedienteService';
import { mapearCompletoAFormulario, construirPayloadActualizar } from '../utils/expedienteMappers';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
        </div>
    );
}

export default function EditarExpediente() {

    const navigate = useNavigate();
    const { id } = useParams();

    const {
        expediente,
        setExpedienteCompleto,
        iniciarEdicionExpediente,
        finalizarEdicionExpediente,
    } = useContext(ExpedienteContext);

    const progreso = useProgresoExpediente(expediente);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [tabActiva, setTabActiva] = useState(0);
    const [modalValidacion, setModalValidacion] = useState(false);
    const [aviso, setAviso] = useState({ open: false, mensaje: '', severidad: 'success' });

    // La Info. Académica se guarda por separado (Estudios) y no usa "Guardar Cambios"
    const esTabAcademica = tabActiva === 4;

    // Carga el expediente real (GET) y lo deja listo en el contexto para las pestañas
    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            try {
                iniciarEdicionExpediente(id);
                const response = await getExpedienteCompleto(id);
                if (!activo) return;
                setExpedienteCompleto(mapearCompletoAFormulario(response.data));
            } catch (err) {
                if (!activo) return;
                setAviso({
                    open: true,
                    mensaje: `No se pudo cargar el expediente: ${err?.response?.data?.message || err?.message || 'Error desconocido'}`,
                    severidad: 'error',
                });
            } finally {
                if (activo) setCargando(false);
            }
        };

        cargar();
        return () => { activo = false; };
    }, [id, iniciarEdicionExpediente, setExpedienteCompleto]);

    // Campos obligatorios para el PUT (la plaza NO se edita aquí)
    const validarExpediente = (exp) => {
        const faltantes = [];
        const p = exp.persona || {};
        const c = exp.contrato || {};
        if (!p.pnombre?.trim()) faltantes.push('Primer nombre');
        if (!p.papellido?.trim()) faltantes.push('Primer apellido');
        if (!p.fechaNacimiento) faltantes.push('Fecha de nacimiento');
        if (!p.sexo) faltantes.push('Sexo');
        if (!c.numInss?.toString().trim()) faltantes.push('Número INSS');
        if (!c.fechaInicio) faltantes.push('Fecha de ingreso');
        if (!(Number(c.salarioMensual) > 0)) faltantes.push('Salario mensual');
        return faltantes;
    };

    const guardarCambios = async () => {
        const faltantes = validarExpediente(expediente);
        if (faltantes.length > 0) {
            setAviso({ open: true, mensaje: `Faltan datos requeridos: ${faltantes.join(', ')}`, severidad: 'warning' });
            return;
        }

        setGuardando(true);
        try {
            const payload = construirPayloadActualizar(expediente);
            console.log('Payload para actualizar expediente:', payload);
            await actualizarExpediente(id, payload);
            setAviso({ open: true, mensaje: 'Expediente actualizado exitosamente.', severidad: 'success' });
            setTimeout(() => {
                finalizarEdicionExpediente();
                navigate(`/index/info-personal/${id}`);
            }, 800);
        } catch (err) {
            setAviso({
                open: true,
                mensaje: err?.response?.data?.message || err?.message || 'Error al guardar los cambios.',
                severidad: 'error',
            });
        } finally {
            setGuardando(false);
        }
    };

    const cancelarEdicion = () => {
        finalizarEdicionExpediente();
        navigate(`/index/info-personal/${id}`);
    };

    const cerrarAviso = () => setAviso((prev) => ({ ...prev, open: false }));
    const handleChangeTab = (event, newValue) => setTabActiva(newValue);

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
                mb: 3
            }}>
                <Box>
                    <Typography variant="h5" color="text.primary" fontWeight="bold">
                        Editar Expediente
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {esTabAcademica
                            ? 'La formación académica se guarda con su propio botón dentro de esta pestaña (no con "Guardar Cambios").'
                            : 'Actualiza los datos del funcionario (la plaza se administra por separado)'}
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', md: 'auto' }
                }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackIcon />}
                        onClick={cancelarEdicion}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Cancelar
                    </Button>
                    {!esTabAcademica && (
                        <>
                            <Button
                                variant="outlined"
                                color="info"
                                startIcon={<FactCheckIcon />}
                                onClick={() => setModalValidacion(true)}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                Chequear Datos
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                                onClick={guardarCambios}
                                disabled={guardando}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                {guardando ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            {esTabAcademica && (
                <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                    Esta pestaña se guarda de forma independiente con el botón{' '}
                    <strong>“Guardar Información Académica”</strong>. Los registros académicos se
                    guardan en la sección de estudios del expediente y se visualizan en el detalle
                    del expediente (Info. Académica). No se incluyen en “Guardar Cambios” ni en el
                    “Chequear Datos”, que corresponden a los datos generales y laborales.
                </Alert>
            )}

            <Paper elevation={2} sx={{ width: '100%', borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f8f9fa', borderRadius: '8px 8px 0 0' }}>
                    <Tabs value={tabActiva} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                        <Tab label="1 - Datos Generales *" />
                        <Tab label="2 - Info. Laboral *" />
                        <Tab label="3 - Características" />
                        <Tab label="4 - Núcleo Familiar" />
                        <Tab label="5 - Info. Académica (guardado propio)" />
                    </Tabs>
                </Box>

                <CustomTabPanel value={tabActiva} index={0}><TabDatosGenerales /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={1}><TabInfoLaboral /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={2}><TabCaracteristicas /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={3}><TabNucleofamiliar /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={4}><TabInfoAcademica idPersona={expediente?.persona?.idPersona} /></CustomTabPanel>
            </Paper>

            {/* MODAL DE CHEQUEO */}
            <Dialog open={modalValidacion} onClose={() => setModalValidacion(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>Chequeo de Datos Ingresados</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progreso general: {progreso.resumen.porcentaje}%
                        </Typography>
                        <LinearProgress variant="determinate" value={progreso.resumen.porcentaje} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Secciones obligatorias ({progreso.resumen.obligatoriasCompletas}/{progreso.resumen.totalObligatorias} completas):
                    </Typography>
                    <List dense>
                        {['persona', 'contrato'].map((seccion) => {
                            const estado = progreso[seccion];
                            const nombreSeccion = { persona: 'Datos Generales', contrato: 'Contrato' }[seccion];
                            return (
                                <ListItem key={seccion}>
                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                        {estado.estado === 'completa' ? (
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        ) : (
                                            <WarningAmberIcon color="warning" fontSize="small" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={nombreSeccion}
                                        secondary={estado.estado === 'completa' ? 'Completo' : `Faltan: ${estado.faltantes.join(', ')}`}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="outlined" onClick={() => setModalValidacion(false)}>Cerrar y Continuar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={aviso.open}
                autoHideDuration={6000}
                onClose={cerrarAviso}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={cerrarAviso} severity={aviso.severidad} variant="filled" sx={{ width: '100%' }}>
                    {aviso.mensaje}
                </Alert>
            </Snackbar>
        </Box>
    );
}
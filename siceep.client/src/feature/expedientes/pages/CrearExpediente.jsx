import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Tabs, Tab, Button, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText, Divider,
    Snackbar, Alert, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TabDatosGenerales from '../components/crear/TabDatosGenerales';
import TabInfoLaboral from '../components/crear/TabInfoLaboral';
import TabCaracteristicas from '../components/crear/TabCaracteristicas';
import TabNucleofamiliar from '../components/crear/TabNucleofamiliar';
import LinearProgress from '@mui/material/LinearProgress';

import { useProgresoExpediente } from './../hooks/useProgresoExpediente';
import { useRegistroExpediente } from './../hooks/useRegistrarExpediente';
import { ExpedienteContext } from './../context/ExpedienteContext';
import { validarCalidadExpediente } from './../utils/validacionExpediente';

// Nombres de pestaña a la que pertenece cada problema de calidad de datos
const TAB_PROBLEMA = {
    persona: 'Datos Generales',
    cedula: 'Datos Generales',
    caracteristicasFisicas: 'Características',
    nucleoFamiliar: 'Núcleo Familiar',
    contrato: 'Info. Laboral'
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
        </div>
    );
}

export default function CrearExpediente() {

    const navigate = useNavigate();
    const { expediente, resetExpediente, ultimoGuardado } = useContext(ExpedienteContext);
    const progreso = useProgresoExpediente(expediente);
    const { registrar, loading } = useRegistroExpediente();

    const [tabActiva, setTabActiva] = useState(0);
    const [modalValidacion, setModalValidacion] = useState(false);
    const [aviso, setAviso] = useState({ open: false, mensaje: '', severidad: 'success' });

    // Problemas de calidad (cédula, fechas, estatura, peso) calculados al vuelo
    const problemasCalidad = validarCalidadExpediente(expediente);

    // Campos que el backend exige (contrato): nunca pueden ir vacíos/nulos
    const normalizarContrato = (contrato) => ({
        ...contrato,
        numInss: (contrato?.numInss || '').toString().trim(),
        ordinal: contrato?.ordinal !== null && contrato?.ordinal !== undefined ? String(contrato.ordinal).trim() : '',
        salarioMensual: Number(contrato?.salarioMensual) || 0,
    });

    // Valida los obligatorios del DTO antes de enviar
    const validarExpediente = (exp) => {
        const faltantes = [];
        const p = exp.persona || {};
        const c = exp.contrato || {};
        if (!p.pnombre?.trim()) faltantes.push('Primer nombre');
        if (!p.papellido?.trim()) faltantes.push('Primer apellido');
        if (!p.fechaNacimiento) faltantes.push('Fecha de nacimiento');
        if (!p.sexo) faltantes.push('Sexo');
        if (!c.numInss?.toString().trim()) faltantes.push('Número INSS');
        if (c.ordinal === null || c.ordinal === undefined || c.ordinal === '') faltantes.push('Código de plaza (ordinal)');
        if (!(Number(c.salarioMensual) > 0)) faltantes.push('Salario mensual');
        if (!c.fechaInicio) faltantes.push('Fecha de ingreso');
        return faltantes;
    };

    const guardarRegistro = async () => {
        const faltantes = validarExpediente(expediente);
        if (faltantes.length > 0) {
            setAviso({ open: true, mensaje: `Faltan datos requeridos: ${faltantes.join(', ')}`, severidad: 'warning' });
            return;
        }

        // Validación de calidad antes de enviar al backend
        if (problemasCalidad.length > 0) {
            setModalValidacion(true);
            setAviso({
                open: true,
                mensaje: `Se encontraron ${problemasCalidad.length} dato(s) con información incorrecta. Corríjalos antes de guardar.`,
                severidad: 'warning'
            });
            return;
        }

        try {
            const payload = { ...expediente, contrato: normalizarContrato(expediente.contrato) };
            await registrar(payload);
            resetExpediente();
            setAviso({ open: true, mensaje: 'Expediente creado exitosamente.', severidad: 'success' });
            navigate('/index/expedientes');
        } catch (e) {
            setAviso({ open: true, mensaje: e?.message || 'Error al guardar el expediente.', severidad: 'error' });
        }
    };

    const cerrarAviso = () => setAviso((prev) => ({ ...prev, open: false }));

    const handleChangeTab = (event, newValue) => {
        setTabActiva(newValue);
    };

    const abrirValidacion = () => setModalValidacion(true);
    const cerrarValidacion = () => setModalValidacion(false);

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
                        Nuevo Expediente
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Registro de un nuevo funcionario en el sistema
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                    >
                        <CloudDoneIcon fontSize="small" color="success" />
                        {ultimoGuardado
                            ? `Borrador guardado automáticamente a las ${ultimoGuardado.toLocaleTimeString()}`
                            : 'Tu borrador se guardará automáticamente en este navegador'}
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
                        color="info"
                        startIcon={<FactCheckIcon />}
                        onClick={abrirValidacion}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Chequear Datos
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        onClick={guardarRegistro}
                        disabled={loading}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        {loading ? 'Guardando...' : 'Guardar Registro'}
                    </Button>
                </Box>
            </Box>

            <Paper elevation={2} sx={{ width: '100%', borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f8f9fa', borderRadius: '8px 8px 0 0' }}>
                    <Tabs value={tabActiva} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                        <Tab label="1 - Datos Generales *" />
                        <Tab label="2 - Info. Laboral *" />
                        <Tab label="3 - Características" />
                        <Tab label="4 - Núcleo Familiar" />
                    </Tabs>
                </Box>

                <CustomTabPanel value={tabActiva} index={0}><TabDatosGenerales /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={1}><TabInfoLaboral /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={2}><TabCaracteristicas /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={3}><TabNucleofamiliar /></CustomTabPanel>
            </Paper>

            {/* MODAL DE CHEQUEO ACTUALIZADO */}
            <Dialog open={modalValidacion} onClose={cerrarValidacion} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>Chequeo de Datos Ingresados</DialogTitle>
                <DialogContent>
                    {/* Barra de progreso */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progreso general: {progreso.resumen.porcentaje}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progreso.resumen.porcentaje}
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                    </Box>

                    {/* Detalle por sección */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Secciones obligatorias ({progreso.resumen.obligatoriasCompletas}/{progreso.resumen.totalObligatorias} completas):
                    </Typography>
                    <List dense>
                        {['persona', 'contrato'].map(seccion => {
                            const estado = progreso[seccion];
                            const nombreSeccion = {
                                persona: 'Datos Generales',
                                empleado: 'Info. Laboral',
                                contrato: 'Contrato'
                            }[seccion];
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

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Secciones opcionales ({progreso.resumen.opcionalesCompletas}/{progreso.resumen.totalOpcionales} completas):
                    </Typography>
                    <List dense>
                        {['contactoEmergencia', 'caracteristicasFisicas', 'familiares'].map(seccion => {
                            const estado = progreso[seccion];
                            const nombreSeccion = {
                                contactoEmergencia: 'Contacto Emergencia',
                                caracteristicasFisicas: 'Características Físicas',
                                familiares: 'Núcleo Familiar'
                            }[seccion];
                            return (
                                <ListItem key={seccion}>
                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                        {estado.estado === 'no_aplica' ? (
                                            <CheckCircleIcon color="action" fontSize="small" />
                                        ) : estado.estado === 'completa' ? (
                                            <CheckCircleIcon color="success" fontSize="small" />
                                        ) : (
                                            <WarningAmberIcon color="warning" fontSize="small" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={nombreSeccion}
                                        secondary={estado.estado === 'no_aplica' ? 'No aplica' : estado.estado === 'completa' ?
                                            (
                                                <CheckCircleIcon color="success" fontSize="small" />
                                                
                                            ) : <WarningAmberIcon color="warning" fontSize="small" />}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>

                    {/* Calidad de los datos */}
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, color: 'warning.main' }}>
                        Calidad de los datos ({problemasCalidad.length} {problemasCalidad.length === 1 ? 'problema' : 'problemas'}):
                    </Typography>
                    {problemasCalidad.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Cédulas, fechas de nacimiento, estatura y peso con información correcta.
                        </Typography>
                    ) : (
                        <List dense>
                            {problemasCalidad.map((problema, indice) => (
                                <ListItem key={`${problema.campo}-${indice}`}>
                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                        <WarningAmberIcon color="warning" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${TAB_PROBLEMA[problema.seccion] || 'General'}`}
                                        secondary={problema.mensaje}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {problemasCalidad.length > 0 && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            Debe corregir los problemas de calidad antes de poder guardar el expediente.
                        </Typography>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="outlined" onClick={cerrarValidacion}>Cerrar y Continuar</Button>
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

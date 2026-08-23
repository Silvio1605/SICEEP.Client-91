import { useState, useContext } from 'react';
import {
    Box, Typography, Tabs, Tab, Button, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TabDatosGenerales from '../components/crear/TabDatosGenerales';
import TabInfoLaboral from '../components/crear/TabInfoLaboral';
import TabInfoAcademica from '../components/crear/TabInfoAcademica';
import TabCaracteristicas from '../components/crear/TabCaracteristicas';
import TabNucleofamiliar from '../components/crear/TabNucleofamiliar';
import TabDocumentos from '../components/crear/TabDocumentos';
import LinearProgress from '@mui/material/LinearProgress';

import { useProgresoExpediente } from './../hooks/useProgresoExpediente';
import { ExpedienteContext } from './../context/ExpedienteContext';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
        </div>
    );
}

export default function CrearExpediente() {

    const { expediente } = useContext(ExpedienteContext);
    const progreso = useProgresoExpediente(expediente);

    const [tabActiva, setTabActiva] = useState(0);
    const [modalValidacion, setModalValidacion] = useState(false);

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
                        startIcon={<SaveIcon />}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Guardar Registro
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
                        <Tab label="5 - Prep. Académica" />
                        <Tab label="6 - Documentos" />
                    </Tabs>
                </Box>

                <CustomTabPanel value={tabActiva} index={0}><TabDatosGenerales /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={1}><TabInfoLaboral /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={2}><TabCaracteristicas /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={3}><TabNucleofamiliar /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={4}><TabInfoAcademica /></CustomTabPanel>
                <CustomTabPanel value={tabActiva} index={5}><TabDocumentos /></CustomTabPanel>
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
                </DialogContent>
                
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="outlined" onClick={cerrarValidacion}>Cerrar y Continuar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

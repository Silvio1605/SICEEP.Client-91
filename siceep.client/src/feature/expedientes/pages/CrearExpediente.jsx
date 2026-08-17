import React, { useState } from 'react';
import {
    Box, Typography, Tabs, Tab, Button, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TabDatosGenerales from '../components/TabDatosGenerales';
import TabInfoLaboral from '../components/TabInfoLaboral';
import TabInfoAcademica from '../components/TabInfoAcademica';
import TabCaracteristicas from '../components/TabCaracteristicas';
import TabNucleofamiliar from '../components/TabNucleofamiliar';
import TabDocumentos from '../components/TabDocumentos';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
        </div>
    );
}

export default function CrearExpediente() {
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
                        <Tab label="1 - Datos Generales" />
                        <Tab label="2 - Info. Laboral" />
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
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Aquí puedes revisar qué información ya has registrado en el expediente y qué te hace falta:</Typography>

                    <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'bold', mt: 2 }}>✓ Datos ya registrados:</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 35 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Datos Generales (Nombres, Cédula)" />
                        </ListItem>
                        {/* Se actualizó este texto para reflejar la fusión */}
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 35 }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Ubicación y Plaza (Info. Laboral)" />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" sx={{ color: 'warning.main', fontWeight: 'bold', mt: 2 }}>⚠ Faltan por ingresar:</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 35 }}>
                                <WarningAmberIcon color="warning" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Pestaña 2: Salario Devengado." /></ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 35 }}>
                                <WarningAmberIcon color="warning" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Pestaña 6: Fotografía y Cédula." />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button variant="outlined" onClick={cerrarValidacion}>Cerrar y Continuar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
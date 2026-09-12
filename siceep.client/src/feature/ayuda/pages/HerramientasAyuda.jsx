import React from 'react';
import { Box, Typography, Grid, Stack, Paper, Divider, Button, Chip, Avatar, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import BadgeIcon from '@mui/icons-material/Badge';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockResetIcon from '@mui/icons-material/LockReset';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';

const modulos = [
    {
        titulo: 'Usuarios',
        icono: <PersonIcon fontSize="small" />,
        color: 'primary.main',
        ruta: '/index/usuarios',
        desc: 'Crea y administra los accesos al sistema.',
    },
    {
        titulo: 'Permisos',
        icono: <KeyIcon fontSize="small" />,
        color: 'info.main',
        ruta: '/index/permisos',
        desc: 'Asigna roles y permisos a los usuarios.',
    },
    {
        titulo: 'Historial',
        icono: <HistoryEduIcon fontSize="small" />,
        color: 'secondary.main',
        ruta: '/index/historial',
        desc: 'Consulta la bitácora de actividades.',
    },
    {
        titulo: 'Buscar Expediente',
        icono: <BadgeIcon fontSize="small" />,
        color: 'success.main',
        ruta: '/index/expedientes',
        desc: 'Busca y abre el expediente de un empleado.',
    },
    {
        titulo: 'Nuevo Expediente',
        icono: <AddBoxIcon fontSize="small" />,
        color: 'success.main',
        ruta: '/index/crear-expediente',
        desc: 'Registra un nuevo expediente personal.',
    },
    {
        titulo: 'Búsqueda Rápida',
        icono: <ManageSearchIcon fontSize="small" />,
        color: 'warning.main',
        ruta: '/index/busqueda-rapida',
        desc: 'Localiza información puntual de un empleado.',
    },
    {
        titulo: 'Gestion Documentos',
        icono: <DescriptionIcon fontSize="small" />,
        color: 'grey.700',
        ruta: '/index/gestion-documentos',
        desc: 'Sube y administra documentos del expediente.',
    },
    {
        titulo: 'Plazas',
        icono: <WorkIcon fontSize="small" />,
        color: 'primary.main',
        ruta: '/index/plazas',
        desc: 'Gestiona el catálogo de plazas.',
    },
    {
        titulo: 'Movimientos',
        icono: <SwapHorizIcon fontSize="small" />,
        color: 'info.main',
        ruta: '/index/movimientos',
        desc: 'Registra el recorrido laboral del empleado.',
    },
    {
        titulo: 'Deducciones',
        icono: <ReceiptLongIcon fontSize="small" />,
        color: 'secondary.main',
        ruta: '/index/deducciones',
        desc: 'Controla las deducciones de instituciones externas.',
    },
    {
        titulo: 'Estadísticas',
        icono: <BarChartIcon fontSize="small" />,
        color: 'success.main',
        ruta: '/index/estadisticas',
        desc: 'Visualiza el panel de control de la fuerza laboral.',
    },
    {
        titulo: 'Instituciones Académicas',
        icono: <SchoolIcon fontSize="small" />,
        color: 'warning.main',
        ruta: '/index/instituciones',
        desc: 'Catálogo de instituciones académicas.',
    },
    {
        titulo: 'Ubicaciones',
        icono: <LocationOnIcon fontSize="small" />,
        color: 'grey.700',
        ruta: '/index/catalogos-ubicaciones',
        desc: 'Catálogo de estructuras, unidades y ubicaciones.',
    },
];

const guias = [
    {
        titulo: '¿Cómo dar de alta a un empleado?',
        icono: <AddBoxIcon fontSize="small" />,
        pasos: [
            'Entra a "Expediente > Nuevo Expediente".',
            'Completa los datos obligatorios (nombre, apellido, fecha de nacimiento y sexo).',
            'Registra la información familiar, laboral y académica que corresponda.',
            'Guarda el expediente; con eso queda disponible para buscar en el listado.',
        ],
    },
    {
        titulo: '¿Cómo registrar una plaza?',
        icono: <WorkIcon fontSize="small" />,
        pasos: [
            'Entra a "Gestión Laboral > Plazas".',
            'Indica el cargo, la ubicación (estructura/unidad) y el salario base.',
            'Al guardarla, el sistema genera el ordinal de la plaza automáticamente.',
        ],
    },
    {
        titulo: '¿Cómo registrar un movimiento laboral?',
        icono: <SwapHorizIcon fontSize="small" />,
        pasos: [
            'En "Gestión Laboral > Movimientos" busca al empleado por nombre o cédula.',
            'Selecciona el cargo y la nueva ubicación.',
            'Registra el movimiento con su fecha de inicio; el sistema cierra el recorrido anterior.',
        ],
    },
    {
        titulo: '¿Cómo registrar una deducción?',
        icono: <ReceiptLongIcon fontSize="small" />,
        pasos: [
            'En "Gestión Laboral > Deducciones" selecciona al empleado.',
            'Elige el tipo de deducción y la institución emisora.',
            'Ingresa el monto, la total deuda y el período; guarda el registro.',
            'Si la institución no existe, agrégala desde el catálogo lateral.',
        ],
    },
    {
        titulo: '¿Cómo generar un trámite o documento?',
        icono: <DescriptionIcon fontSize="small" />,
        pasos: [
            'Abre el expediente del empleado desde "Buscar Expediente".',
            'Ve a la sección "Documentos" y sube el archivo (PDF o imagen).',
            'El documento queda adjunto al expediente para su consulta posterior.',
        ],
    },
    {
        titulo: '¿Qué pasa si olvido mi contraseña?',
        icono: <LockResetIcon fontSize="small" />,
        pasos: [
            'Solicita el reestablecimiento a un usuario administrador.',
            'El administrador usa la opción correspondiente en "Usuarios".',
            'Ingresa con la contraseña asignada y cámbiala la primera vez.',
        ],
    },
];

const consejos = [
    'Usa la Búsqueda Rápida cuando solo necesites un dato puntual de un empleado.',
    'Las deducciones se reportan por mes y por institución; revisa el listado antes de cerrar el período.',
    'El Panel de Control (Estadísticas) se actualiza con los datos guardados; refresca la página para verlos.',
    'Registra los documentos del empleado apenas los recibas para mantener el expediente al día.',
    'La información sensible solo debe consultarse con fines laborales autorizados.',
];

export default function HerramientasAyuda() {
    const navigate = useNavigate();

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Herramientas de Ayuda
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Guías rápidas y accesos directos para aprovechar el sistema
                </Typography>
            </Box>

            {/* Accesos directos */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {modulos.map((m) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={m.titulo}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1.5,
                                borderRadius: 3,
                                borderColor: 'divider',
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                            }}
                            onClick={() => navigate(m.ruta)}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 34, height: 34, bgcolor: m.color, flexShrink: 0 }}>
                                    {m.icono}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                        {m.titulo}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                                        {m.desc}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Soporte */}
            <Alert
                severity="info"
                sx={{ borderRadius: 3, mb: 3 }}
                icon={<HelpCenterIcon />}
            >
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={1.5}>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>¿Necesitas más apoyo?</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Contacta al área de soporte del sistema para resolver dudas técnicas o de uso.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Chip icon={<EmailIcon fontSize="small" />} label="soporte@siceep.gob.ni" color="primary" variant="outlined" />
                        <Chip icon={<CallIcon fontSize="small" />} label="2255-0000" color="primary" variant="outlined" />
                    </Stack>
                </Stack>
            </Alert>

            <Grid container spacing={3}>
                {/* Guías por pasos */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LightbulbIcon fontSize="small" color="warning" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Guías rápidas
                            </Typography>
                        </Box>
                        <Divider sx={{ mx: 2.5, mb: 2 }} />
                        <Box sx={{ px: 2.5, pb: 2 }}>
                            {guias.map((g) => (
                                <Accordion key={g.titulo} disableGutters sx={{ '&:before': { display: 'none' }, boxShadow: 'none' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{ borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', flexShrink: 0 }}>
                                                {g.icono}
                                            </Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{g.titulo}</Typography>
                                        </Stack>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                                            {g.pasos.map((paso, i) => (
                                                <Typography component="li" key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {paso}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Paper>

                    {/* Ficha PDF */}
                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', mt: 3, p: 2 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                            <Avatar sx={{ bgcolor: 'error.light', width: 44, height: 44, flexShrink: 0 }}>
                                <PictureAsPdfIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>Constancias y reportes en PDF</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Desde el expediente puedes generar la ficha personal y otras constancias en formato PDF. Usa tu navegador para imprimir o guardar el archivo.
                                </Typography>
                            </Box>
                            <Button variant="outlined" startIcon={<BadgeIcon />} onClick={() => navigate('/index/expedientes')}>
                                Ir a Expedientes
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Consejos */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RefreshIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Buenas prácticas
                            </Typography>
                        </Box>
                        <Divider sx={{ mx: 2.5, mb: 2 }} />
                        <Box sx={{ px: 2.5, pb: 2.5 }}>
                            <Stack spacing={1.5}>
                                {consejos.map((c, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                                        <Typography sx={{ color: 'primary.main', fontWeight: 800, lineHeight: 1.4 }} fontSize={15}>
                                            {idx + 1}.
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                            {c}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Paper>

                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', mt: 3, p: 2.5, textAlign: 'center' }}>
                        <HelpCenterIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            ¿Encontraste lo que buscabas?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Esta sección se irá actualizando con nuevas guías según el uso del sistema.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
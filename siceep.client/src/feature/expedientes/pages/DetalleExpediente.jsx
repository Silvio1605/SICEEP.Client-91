import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Tabs, Tab, CircularProgress } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Importación de Componentes Hijos
import InfoPersonal from '../components/InfoPersonal';
import InfoFamiliar from '../components/InfoFamiliar';
import InfoLaboral from '../components/InfoLaboral';
import InfoAcademica from '../components/InfoAcademica';
import ModalImpresion from '../components/ModalImpresion';

export default function DetalleExpediente() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // Estados principales
    const [tabValue, setTabValue] = useState(0);
    const [datosEmpleado, setDatosEmpleado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);

    // =================================================================
    // OBTENCIÓN DE DATOS (MOCK) - Pendiente de reemplazar por API real
    // =================================================================
    useEffect(() => {
        setCargando(true);
        setTimeout(() => {
            const mockDatabase = {
                "1": { nombreCompleto: "JUAN PEREZ", cedula: "001-123456-0000A", edad: 30, estadoCivil: "CASADO", lugarNacimiento: "MANAGUA", religion: "CATOLICA", direccion: "MANAGUA, ZONA CENTRAL", familiares: [], recorrido: [], historialBajas: [], preparacionProfesional: [], educacionBasica: [], cursosVarios: [] },
                "2": { nombreCompleto: "ANA LOPEZ", cedula: "002-654321-0000B", edad: 28, estadoCivil: "SOLTERA", lugarNacimiento: "LEON", religion: "NINGUNA", direccion: "LEON, CENTRO", familiares: [], recorrido: [], historialBajas: [], preparacionProfesional: [], educacionBasica: [], cursosVarios: [] }
            };

            const empleadoEncontrado = mockDatabase[id] || {
                nombreCompleto: "SILVIO JUNIOR MORALES DOMINGUEZ", cedula: "203-160500-1000K", edad: 26, estadoCivil: "SOLTERO", lugarNacimiento: "DIRIOMO, GRANADA", religion: "CRISTIANA", direccion: "RPTO. RICARDO RIVERA", familiares: [], recorrido: [], historialBajas: [], preparacionProfesional: [], educacionBasica: [], cursosVarios: []
            };

            setDatosEmpleado(empleadoEncontrado);
            setCargando(false);
        }, 300);
    }, [id]);

    // =================================================================
    // MANEJO DE NAVEGACIÓN Y PESTAÑAS
    // =================================================================
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('info-personal')) setTabValue(0);
        else if (path.includes('info-familiar')) setTabValue(1);
        else if (path.includes('info-laboral')) setTabValue(2);
        else if (path.includes('info-academica')) setTabValue(3);

    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const expedienteId = id || "1";
        const rutas = ['info-personal', 'info-familiar', 'info-laboral', 'info-academica'];
        navigate(`/index/${rutas[newValue]}/${expedienteId}`);
    };

    // =================================================================
    // ACCIONES
    // =================================================================
    const ejecutarImpresionFinal = (opcionesSeleccionadas) => {
        // Silvio: Aquí puedes enviar las opciones seleccionadas a tu backend
        // para que genere el PDF solo con las secciones marcadas.
        console.log("El usuario solicitó imprimir:", opcionesSeleccionadas);
        alert("Petición de impresión enviada. Revisa la consola.");
    };

    if (cargando || !datosEmpleado) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
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
                    <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => setModalAbierto(true)}>
                        Imprimir
                    </Button>
                    <Button variant="contained" startIcon={<EditIcon />}>Editar</Button>
                </Box>
            </Box>

            {/* Cabecera del Expediente */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{datosEmpleado.nombreCompleto}</Typography>
                <Typography variant="subtitle1" color="text.secondary">Número de Expediente: {id ? `EXP-00${id}` : '42996259'}</Typography>
            </Paper>

            {/* Pestañas */}
            <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="Info. Personal" />
                    <Tab label="Info. Familiar" />
                    <Tab label="Info. Laboral" />
                    <Tab label="Info. Académica" />
                </Tabs>
            </Paper>

            {/* Contenido Dinámico */}
            <Box>
                {tabValue === 0 && <InfoPersonal data={datosEmpleado} />}
                {tabValue === 1 && <InfoFamiliar data={datosEmpleado} />}
                {tabValue === 2 && <InfoLaboral data={datosEmpleado} />}
                {tabValue === 3 && <InfoAcademica data={datosEmpleado} />}
            </Box>

            {/* Componente Modular del Modal */}
            <ModalImpresion
                abierto={modalAbierto}
                alCerrar={() => setModalAbierto(false)}
                alImprimir={ejecutarImpresionFinal}
            />

        </Box>
    );
}
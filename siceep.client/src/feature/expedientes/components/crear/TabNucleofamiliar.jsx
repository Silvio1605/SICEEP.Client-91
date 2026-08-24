import { Box, Grid, Typography, Paper, TextField, Button, Divider, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useEffect, useContext } from 'react';
import { ExpedienteContext } from './../../context/ExpedienteContext';

// Componente reutilizable para campos de persona (madre/padre)
const PersonaFields = ({ titulo, valores, onChange, mostrarFechaNac = false }) => {
    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>{titulo}</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth size="small"
                        label="P. Nombre"
                        value={valores?.pnombre || ''}
                        onChange={(e) => onChange('pnombre', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth size="small"
                        label="S. Nombre"
                        value={valores?.snombre || ''}
                        onChange={(e) => onChange('snombre', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth size="small"
                        label="P. Apellido"
                        value={valores?.papellido || ''}
                        onChange={(e) => onChange('papellido', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth size="small"
                        label="S. Apellido"
                        value={valores?.sapellido || ''}
                        onChange={(e) => onChange('sapellido', e.target.value)}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth size="small"
                        label="N° Cédula"
                        value={valores?.cedula || ''}
                        onChange={(e) => onChange('cedula', e.target.value)}
                    />
                </Grid>
                {mostrarFechaNac && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth size="small"
                            type="date"
                            label="Fecha de Nacimiento"
                            InputLabelProps={{ shrink: true }}
                            value={valores?.fechaNacimiento || ''}
                            onChange={(e) => onChange('fechaNacimiento', e.target.value)}
                        />
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

// Componente para cada hijo
const HijoFields = ({ index, hijo, onChange, onRemove }) => {
    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">Hijo #{index + 1}</Typography>
                <Button color="error" size="small" onClick={onRemove}>Eliminar</Button>
            </Box>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="P. Nombre"
                        value={hijo.pnombre || ''}
                        onChange={(e) => onChange('pnombre', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="S. Nombre"
                        value={hijo.snombre || ''}
                        onChange={(e) => onChange('snombre', e.target.value)}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        select
                        fullWidth size="small"
                        label="Sexo"
                        value={hijo.sexo || ''}
                        onChange={(e) => onChange('sexo', e.target.value)}
                    >
                        <MenuItem value="M">Masculino</MenuItem>
                        <MenuItem value="F">Femenino</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="P. Apellido"
                        value={hijo.papellido || ''}
                        onChange={(e) => onChange('papellido', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="S. Apellido"
                        value={hijo.sapellido || ''}
                        onChange={(e) => onChange('sapellido', e.target.value)}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        type="date"
                        label="Fecha de Nacimiento"
                        InputLabelProps={{ shrink: true }}
                        value={hijo.fechaNacimiento || ''}
                        onChange={(e) => onChange('fechaNacimiento', e.target.value)}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default function TabNucleofamiliar() {
    const { expediente, actualizarSeccion } = useContext(ExpedienteContext);
    const nucleo = expediente.nucleoFamiliar || {};

    // Inicializar sección si no existe
    useEffect(() => {
        if (!expediente.nucleoFamiliar) {
            actualizarSeccion('nucleoFamiliar', {
                madre: { pnombre: '', snombre: '', papellido: '', sapellido: '', cedula: '', fechaNacimiento: '' },
                padre: { pnombre: '', snombre: '', papellido: '', sapellido: '', cedula: '', fechaNacimiento: '' },
                conyuge: { pnombre: '', snombre: '', papellido: '', sapellido: '', cedula: '', fechaNacimiento: '' },
                hijos: []
            });
        }
    }, [expediente, actualizarSeccion]);

    // Handler para actualizar cualquier campo de madre, padre o cónyuge
    const handlePersonaChange = (personaKey, campo, valor) => {
        const personaActual = nucleo[personaKey] || {};
        actualizarSeccion('nucleoFamiliar', {
            ...nucleo,
            [personaKey]: {
                ...personaActual,
                [campo]: valor
            }
        });
    };

    // Handler para cambiar un hijo
    const handleHijoChange = (index, campo, valor) => {
        const hijosActuales = nucleo.hijos || [];
        const nuevosHijos = hijosActuales.map((hijo, i) =>
            i === index ? { ...hijo, [campo]: valor } : hijo
        );
        actualizarSeccion('nucleoFamiliar', {
            ...nucleo,
            hijos: nuevosHijos
        });
    };

    // Agregar hijo
    const agregarHijo = () => {
        const hijosActuales = nucleo.hijos || [];
        const nuevoHijo = { sexo: '', pnombre: '', snombre: '', papellido: '', sapellido: '', cedula: '', fechaNacimiento: '' };
        actualizarSeccion('nucleoFamiliar', {
            ...nucleo,
            hijos: [...hijosActuales, nuevoHijo]
        });
    };

    // Eliminar hijo
    const eliminarHijo = (index) => {
        const hijosActuales = nucleo.hijos || [];
        const nuevosHijos = hijosActuales.filter((_, i) => i !== index);
        actualizarSeccion('nucleoFamiliar', {
            ...nucleo,
            hijos: nuevosHijos
        });
    };

    return (
        <Box>
            {/* Datos de los Padres */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Datos de los Padres
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PersonaFields
                        titulo="Madre"
                        valores={nucleo.madre}
                        onChange={(campo, valor) => handlePersonaChange('madre', campo, valor)}
                        mostrarFechaNac
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PersonaFields
                        titulo="Padre"
                        valores={nucleo.padre}
                        onChange={(campo, valor) => handlePersonaChange('padre', campo, valor)}
                        mostrarFechaNac
                    />
                </Grid>
            </Grid>

            {/* Datos del Cónyuge */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Datos del Cónyuge
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <PersonaFields
                            titulo="Cónyuge"
                            valores={nucleo.conyuge}
                            onChange={(campo, valor) => handlePersonaChange('conyuge', campo, valor)}
                            mostrarFechaNac
                        />
                    </Grid> 
                </Grid>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* Registro de Hijos */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                        Registro de Hijos / Dependientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Agregue los nombres y fechas de nacimiento de los hijos del funcionario.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarHijo}>
                    AGREGAR HIJO
                </Button>
            </Box>

            {/* Lista de hijos */}
            {(nucleo.hijos || []).length === 0 ? (
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        No hay hijos registrados. Haga clic en "AGREGAR HIJO" para añadir uno.
                    </Typography>
                </Paper>
            ) : (
                (nucleo.hijos || []).map((hijo, index) => (
                    <HijoFields
                        key={index}
                        index={index}
                        hijo={hijo}
                        onChange={(campo, valor) => handleHijoChange(index, campo, valor)}
                        onRemove={() => eliminarHijo(index)}
                    />
                ))
            )}
        </Box>
    );
}
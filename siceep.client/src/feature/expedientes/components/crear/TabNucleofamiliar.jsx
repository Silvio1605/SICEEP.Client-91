import { Box, Grid, Typography, Paper, TextField, Button, Divider, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useContext } from 'react';
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
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth size="small"
                        label="Sexo"
                        value={valores?.sexo || ''}
                        onChange={(e) => onChange('sexo', e.target.value)}
                    >
                        <MenuItem value="M">Masculino</MenuItem>
                        <MenuItem value="F">Femenino</MenuItem>
                    </TextField>
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

// Componente para cada hijo (identificado por id, no por índice)
const HijoFields = ({ numero, hijo, onChange, onRemove }) => {
    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">Hijo #{numero}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
                <Button color="error" size="small" onClick={onRemove}>Eliminar</Button>
            </Box>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="P. Nombre"
                        value={hijo.pnombre || ''}
                        onChange={(e) => onChange(hijo.id, 'pnombre', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="S. Nombre"
                        value={hijo.snombre || ''}
                        onChange={(e) => onChange(hijo.id, 'snombre', e.target.value)}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        select
                        fullWidth size="small"
                        label="Sexo"
                        value={hijo.sexo || ''}
                        onChange={(e) => onChange(hijo.id, 'sexo', e.target.value)}
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
                        onChange={(e) => onChange(hijo.id, 'papellido', e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        label="S. Apellido"
                        value={hijo.sapellido || ''}
                        onChange={(e) => onChange(hijo.id, 'sapellido', e.target.value)}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth size="small"
                        type="date"
                        label="Fecha de Nacimiento"
                        InputLabelProps={{ shrink: true }}
                        value={hijo.fechaNacimiento || ''}
                        onChange={(e) => onChange(hijo.id, 'fechaNacimiento', e.target.value)}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default function TabNucleofamiliar() {
    const { expediente, actualizarSeccion } = useContext(ExpedienteContext);
    const nucleo = expediente.nucleoFamiliar || {};

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

    // Handler para cambiar un hijo (por id, no por índice)
    const handleHijoChange = (idHijo, campo, valor) => {
        const hijosActuales = nucleo.hijos || [];
        const nuevosHijos = hijosActuales.map((hijo) =>
            hijo.id === idHijo ? { ...hijo, [campo]: valor } : hijo
        );
        actualizarSeccion('nucleoFamiliar', {
            ...nucleo,
            hijos: nuevosHijos
        });
    };

    // Identificador estable para cada hijo (evita usar el índice como key)
    const generarIdHijo = () =>
        (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : `hijo-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Agregar hijo
    const agregarHijo = () => {
        const hijosActuales = nucleo.hijos || [];
        const nuevoHijo = { id: generarIdHijo(), sexo: '', pnombre: '', snombre: '', papellido: '', sapellido: '', cedula: '', fechaNacimiento: '' };
        const nuevosHijos = [...hijosActuales, nuevoHijo];
        actualizarSeccion('nucleoFamiliar', {
            ...nucleo,
            hijos: nuevosHijos
        });
        console.log('Hijos agregados:', nuevosHijos);
    };

    // Eliminar hijo
    const eliminarHijo = (idHijo) => {
        const hijosActuales = nucleo.hijos || [];
        const nuevosHijos = hijosActuales.filter((hijo) => hijo.id !== idHijo);
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
            
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        select
                        fullWidth size="small"
                        label="Tipo de Unión"
                        value={nucleo.conyuge?.tipoUnion || ''}
                        onChange={(e) => handlePersonaChange('conyuge', 'tipoUnion', e.target.value)}
                    >
                        <MenuItem value="unionHecho">Union de Hecho Estable</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                        fullWidth size="small"
                        label="Observaciones"
                        value={nucleo.conyuge?.observaciones || ''}
                        onChange={(e) => handlePersonaChange('conyuge', 'observaciones', e.target.value)}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
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
                        key={hijo.id}
                        numero={index + 1}
                        hijo={hijo}
                        onChange={handleHijoChange}
                        onRemove={() => eliminarHijo(hijo.id)}
                    />
                ))
            )}
        </Box>
    );
}
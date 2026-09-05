import { useMemo, useState } from 'react';
import {
    Box, Grid, Typography, Paper, TextField, InputAdornment,
    Button, Chip, Stack, Skeleton, Alert
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import UndoIcon from '@mui/icons-material/Undo';
import FolderIcon from '@mui/icons-material/Folder';
import { alpha } from '@mui/material/styles';
// componentes
import CardPermiso from "../components/CardPermiso";
import GuardarPermisosDialog from '../components/GuardarPermisos';
// servicios
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import { usePermisosContext } from "./../../../providers/Permisos/usePermisoContext";

const COLORES_MODULO = ['#1565C0', '#2E7D32', '#C62828', '#6A1B9A', '#EF6C00', '#00695C', '#455A64', '#AD1457'];

export default function Permisos({ idUsuario }) {

    //funcion para extraer el valor enviado desde usuario
    const busquedaContext = useBusquedaContext?.() ?? {};

    const idSeleccionado =
        idUsuario ??
        busquedaContext.idSeleccionado;

    //hook personalizado para manejar permisos
    const { permisosHook } = usePermisosContext() ?? {};
    const { permisos, loading, error, cambiarPermiso, permisosOriginal, descartarCambios, PermisosModificados } = permisosHook ?? {};

    // Estado para controlar el diálogo de guardar permisos
    const [openDialog, setOpenDialog] = useState(false);
    const handleCloseDialog = () => setOpenDialog(false);

    const [busqueda, setBusqueda] = useState('');

    // Mapa de estado original (para destacar permisos con cambios sin guardar)
    const originalMap = useMemo(() => {
        const mapa = new Map();
        (permisosOriginal || []).forEach((mod) =>
            (mod.permisos || []).forEach((p) => mapa.set(p.idRecurso, !!p.check))
        );
        return mapa;
    }, [permisosOriginal]);

    const esModificado = (p) => (originalMap.get(p.idRecurso) ?? false) !== !!p.check;

    const termino = busqueda.trim().toLowerCase();
    const hayBusqueda = termino.length > 0;

    const modulosVisibles = useMemo(() => {
        if (!permisos) return [];
        if (!hayBusqueda) return permisos;

        return permisos
            .map((mod) => ({
                ...mod,
                permisos: (mod.permisos || []).filter((p) =>
                    (p.recurso || '').toLowerCase().includes(termino) ||
                    (p.descripcion || '').toLowerCase().includes(termino))
            }))
            .filter((mod) => mod.permisos.length > 0);
    }, [permisos, hayBusqueda, termino]);

    const cambiosCount = PermisosModificados?.cambios?.length ?? 0;

    const totalPermisos = useMemo(() =>
        (permisos || []).reduce((acc, m) => acc + (m.permisos || []).length, 0),
        [permisos]
    );

    const totalHabilitados = useMemo(() =>
        (permisos || []).reduce((acc, m) => acc + (m.permisos || []).filter((p) => p.check).length, 0),
        [permisos]
    );

    const marcarTodos = (modulo, activar) => {
        (modulo?.permisos || []).forEach((p) => {
            if (!!p.check !== activar) cambiarPermiso(p.idRecurso);
        });
    };

    const renderModulo = (modulo, indice) => {
        const activos = (modulo.permisos || []).filter((p) => p.check).length;
        const total = (modulo.permisos || []).length;
        const todosActivados = total > 0 && activos === total;
        const colorModulo = COLORES_MODULO[indice % COLORES_MODULO.length];

        return (
            <Box key={modulo.idModulo} sx={{ position: 'relative' }}>
                {/* Cabecera sticky de módulo */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 5,
                        bgcolor: 'background.paper',
                        px: { xs: 1.5, md: 2.5 },
                        py: 1,
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        flexWrap: 'wrap',
                        borderRadius: 2,
                        borderBottom: '2px solid',
                        borderColor: colorModulo,
                        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.grey[500], 0.15)}`
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <FolderIcon fontSize="small" sx={{ color: colorModulo }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }} noWrap>
                            {modulo.modulo}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            size="small"
                            label={`${activos} de ${total}`}
                            color={activos === total && total > 0 ? 'success' : 'default'}
                            variant="outlined"
                        />
                        <Button size="small" onClick={() => marcarTodos(modulo, !todosActivados)}>
                            {todosActivados ? 'Deshabilitar todos' : 'Habilitar todos'}
                        </Button>
                    </Stack>
                </Box>

                <Grid container spacing={2}>
                    {(modulo.permisos || []).map((permiso) => (
                        <Grid key={permiso.idRecurso} size={{ xs: 12, sm: 6, lg: 4 }}>
                            <CardPermiso
                                id={permiso.idRecurso}
                                nombrePermiso={permiso.recurso}
                                descripcion={permiso.descripcion}
                                checked={permiso.check}
                                modificado={esModificado(permiso)}
                                cambiarPermiso={cambiarPermiso}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Box sx={{ pb: 10 }}>
            {/* Header */}
            <Box
                sx={{
                    bgcolor: "background.paper",
                    borderBottom: 1,
                    borderColor: "divider",
                    boxShadow: 2,
                    px: { xs: 2, md: 4 },
                    py: 1.5,
                    mb: 2,
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: '#1565C0',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&::before': {
                                content: '""',
                                width: '4px',
                                height: '20px',
                                backgroundColor: '#1565C0',
                                borderRadius: '2px',
                                display: 'inline-block',
                            }
                        }}
                    >
                        Permisos del Usuario
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {totalHabilitados} habilitados de {totalPermisos} permisos
                    </Typography>
                </Box>

                {/* Buscador */}
                <TextField
                    size="small"
                    placeholder="Buscar permiso..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 280 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: busqueda ? (
                            <InputAdornment position="end">
                                <Button
                                    size="small"
                                    onClick={() => setBusqueda('')}
                                    sx={{ minWidth: 0, p: '4px' }}
                                    aria-label="Limpiar búsqueda"
                                >
                                    <ClearIcon fontSize="small" />
                                </Button>
                            </InputAdornment>
                        ) : null,
                    }}
                />
            </Box>

            {/* Contenido */}
            {loading ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {[1, 2, 3].map((i) => (
                        <Box key={i}>
                            <Skeleton variant="rounded" height={48} sx={{ mb: 1.5 }} />
                            <Grid container spacing={2}>
                                {[1, 2, 3].map((j) => (
                                    <Grid key={j} size={{ xs: 12, sm: 6, lg: 4 }}>
                                        <Skeleton variant="rounded" height={90} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Stack>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            ) : (permisos || []).length === 0 ? (
                <Paper variant="outlined" sx={{ mt: 2, p: 4, textAlign: 'center', borderRadius: 3, borderColor: 'divider' }}>
                    <Typography variant="body1" color="text.secondary">
                        El usuario no tiene permisos asignados.
                    </Typography>
                </Paper>
            ) : modulosVisibles.length === 0 ? (
                <Paper variant="outlined" sx={{ mt: 2, p: 4, textAlign: 'center', borderRadius: 3, borderColor: 'divider' }}>
                    <Typography variant="body1" color="text.secondary">
                        No se encontraron permisos para “{busqueda}”.
                    </Typography>
                </Paper>
            ) : (
                modulosVisibles.map(renderModulo)
            )}

            {/* Barra inferior fija de acciones */}
            <Paper
                elevation={4}
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                    mt: 3,
                    px: { xs: 1.5, md: 2.5 },
                    py: 1.25,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    flexWrap: 'wrap',
                    bgcolor: cambiosCount > 0 ? alpha('#ed6c02', 0.08) : 'background.paper',
                    border: '1px solid',
                    borderColor: cambiosCount > 0 ? '#ed6c02' : 'divider'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cambiosCount > 0 && (
                        <Chip label={`${cambiosCount}`} color="warning" size="small" />
                    )}
                    <Typography variant="body2" fontWeight={600} color={cambiosCount > 0 ? 'warning.dark' : 'text.secondary'}>
                        {cambiosCount > 0
                            ? `${cambiosCount} cambio${cambiosCount === 1 ? '' : 's'} sin guardar`
                            : 'Sin cambios sin guardar'}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<UndoIcon />}
                        onClick={descartarCambios}
                        disabled={cambiosCount === 0}
                    >
                        Descartar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => setOpenDialog(true)}
                        disabled={cambiosCount === 0}
                    >
                        Guardar cambios
                    </Button>
                </Stack>
            </Paper>

            <GuardarPermisosDialog open={openDialog} onClose={handleCloseDialog} idUsuario={idSeleccionado} />
        </Box>
    );
}
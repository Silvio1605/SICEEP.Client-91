import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
//servicios
import { guardarPermisos } from '../services/PermisoService';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext'
import { usePermisosContext } from "./../../../providers/Permisos/usePermisoContext";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function GuardarPermisosDialog({ open, onClose, idUsuario }) {

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    //hook personalizado para manejar permisos
    const { permisosHook } = usePermisosContext() ?? {};
    const { refetch, PermisosModificados } = permisosHook ?? {};

    const agregados = PermisosModificados?.agregados ?? [];
    const quitados = PermisosModificados?.quitados ?? [];
    const totalCambios = PermisosModificados?.cambios?.length ?? 0;

    const [guardando, setGuardando] = React.useState(false);

    const handleGuardar = async () => {
        if (totalCambios === 0 || guardando) return;
        setGuardando(true);

        const permisosCambiados = PermisosModificados.cambios.map(x => ({
            idRecurso: x.idRecurso,
            permitido: x.estado === 1
        }));

        const dataEnvio = {
            idUsuario: idUsuario,
            permisos: permisosCambiados
        };

        try {
            const result = await guardarPermisos(dataEnvio);

            mostrarNotificacion({
                message: result,
                severity: "success",
            });
            await refetch?.();
            onClose();
        } catch (error) {
            mostrarNotificacion({
                message: error.message || error || "Error",
                severity: "warning",
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                slots={{
                    transition: Transition,
                }}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Resumen de cambios
                        </Typography>
                        <Button
                            color="inherit"
                            startIcon={<SaveIcon />}
                            onClick={handleGuardar}
                            disabled={guardando || totalCambios === 0}
                        >
                            {guardando ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip color="success" variant="outlined" label={`${agregados.length} habilitados`} />
                        <Chip color="error" variant="outlined" label={`${quitados.length} deshabilitados`} />
                    </Stack>

                    {totalCambios === 0 && (
                        <Typography variant="body1" color="text.secondary">
                            No hay cambios para guardar.
                        </Typography>
                    )}

                    {agregados.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleOutlineIcon color="success" /> Permisos habilitados
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List dense>
                                {agregados.map(p => (
                                    <ListItemButton key={p.idRecurso} sx={{ borderRadius: 2 }}>
                                        <ListItemIcon>
                                            <CheckCircleOutlineIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText primary={p.recurso} secondary={p.descripcion} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </>
                    )}

                    {quitados.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <HighlightOffIcon color="error" /> Permisos deshabilitados
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List dense>
                                {quitados.map(p => (
                                    <ListItemButton key={p.idRecurso} sx={{ borderRadius: 2 }}>
                                        <ListItemIcon>
                                            <HighlightOffIcon color="error" />
                                        </ListItemIcon>
                                        <ListItemText primary={p.recurso} secondary={p.descripcion} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </>
                    )}
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
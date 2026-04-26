import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
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
//servicios
import { guardarPermisos } from '../services/PermisoService';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function GuardarPermisosDialog({ open, onClose, idUsuario, cambios }) {

    const resultado = React.useMemo(() => {
        if (!open) return { cambios: [], agregados: [], quitados: [] };

        const lista = cambios(); // tu función

        const agregados = lista.filter(x => x.estado === 1);
        const quitados = lista.filter(x => x.estado === 0);
        return {
            cambios: lista,
            agregados,
            quitados
        };

    }, [open, cambios]);

    const handleGuardar = async () => {
        onClose();

        const permisosCambiados = resultado.cambios.map(x => ({
            idRecurso: x.idRecurso,
            permitido: x.estado === 1 // mejor booleano
        }));

        const dataEnvio = {
            idUsuario: idUsuario,
            permisos: permisosCambiados
        };

        const result = await guardarPermisos(dataEnvio);
        console.log(result);

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
                            Permisos a Guardar
                        </Typography>
                        <Button autoFocus color="inherit"
                            onClick={
                                handleGuardar
                            }
                        >
                            Guardar
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{ pl: 3, pt: 2 }}>
                    <Typography variant="h6">Permisos Agregados</Typography>
                    <Divider />
                    {resultado.agregados.length === 0 && (
                        <Typography variant="body2" color="text.secondary">No hay permisos agregados</Typography>
                    )}
                    <List>
                        {resultado.agregados.map(p => (
                            <ListItemButton key={p.idRecurso}>
                                <ListItemText primary={p.recurso} secondary={p.descripcion} />
                            </ListItemButton>
                        ))}
                    </List>
                    <Typography variant="h6">Permisos Eliminados</Typography>
                    <Divider />
                    {resultado.quitados.length === 0 && (
                        <Typography variant="body2" color="text.secondary">No hay permisos eliminados</Typography>
                    )}
                    <List>
                        {resultado.quitados.map(p => (
                            <ListItemButton key={p.idRecurso}>
                                <ListItemText primary={p.recurso} secondary={p.descripcion} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
               
            </Dialog>
        </React.Fragment>
    );
}

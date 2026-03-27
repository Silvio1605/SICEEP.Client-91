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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function GuardarPermisosDialog({ open, onClose, cambios }) {

    const resultado = React.useMemo(() => {
        if (!open) return { cambios: [], agregados: [], quitados: [] };

        const lista = cambios(); // tu función
        console.log(lista);
        const agregados = lista.filter(x => x.estado === 1);
        const quitados = lista.filter(x => x.estado === 0);

        return {
            cambios: lista,
            agregados,
            quitados
        };
    }, [open, cambios]);

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
                            SilvioJM
                        </Typography>
                        <Button autoFocus color="inherit" onClick={onClose}>
                            Guardar Cambios
                        </Button>
                    </Toolbar>
                </AppBar>
                <Typography variant="h6">Permisos Agregados</Typography>
                
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
            </Dialog>
        </React.Fragment>
    );
}

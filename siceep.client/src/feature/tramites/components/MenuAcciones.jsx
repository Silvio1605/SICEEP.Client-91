import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

export default function MenuAcciones({ row, onFicha, onConstancia, onDocumentos }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // 1 = Baja (solo constancia de baja), 2 = Activo y 3 = Com/Servicio (todo menos baja)
    const esBaja = row?.estado === 1;

    const handleOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const ejecutar = (fn) => () => {
        handleClose();
        if (fn) fn(row);
    };

    const ejecutarConstancia = (tipo) => () => {
        handleClose();
        if (onConstancia) onConstancia(row, tipo);
    };

    return (
        <>
            <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ elevation: 3, sx: { minWidth: 200, mt: 0.5 } }}
            >
                <MenuItem onClick={ejecutar(onFicha)}>
                    <ListItemIcon><DescriptionIcon fontSize="small" color="primary" /></ListItemIcon>
                    Ficha
                </MenuItem>
                <Divider />
                <MenuItem onClick={ejecutarConstancia('laboral')} disabled={esBaja}>
                    <ListItemIcon><AssignmentIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia Laboral
                </MenuItem>
                <MenuItem onClick={ejecutarConstancia('salarial')} disabled={esBaja}>
                    <ListItemIcon><PaymentsOutlinedIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia Salarial
                </MenuItem>
                <MenuItem onClick={ejecutarConstancia('familiar')} disabled={esBaja}>
                    <ListItemIcon><GroupOutlinedIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia Familiar
                </MenuItem>
                <MenuItem onClick={ejecutarConstancia('baja')} disabled={!esBaja}>
                    <ListItemIcon><PersonOffOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
                    Constancia de Baja
                </MenuItem>
                <MenuItem onClick={ejecutarConstancia('recorrido')} disabled={esBaja}>
                    <ListItemIcon><TimelineOutlinedIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia de Recorrido
                </MenuItem>
                <Divider />
                <MenuItem onClick={ejecutar(onDocumentos)}>
                    <ListItemIcon><FolderSharedIcon fontSize="small" color="primary" /></ListItemIcon>
                    Documentos Digitales
                </MenuItem>
            </Menu>
        </>
    );
}

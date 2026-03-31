import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyIcon from '@mui/icons-material/Key';
import PasswordIcon from '@mui/icons-material/Password';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Link } from "react-router-dom";


export default function MenuAcciones({ row, abrirPerfil }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action) => {
        console.log(action, row);
        handleClose();
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={abrirPerfil}>
                    Perfil
                </MenuItem>
                <MenuItem
                    component={Link}
                    to={'/permisos'}
                    onClick={handleClose}
                    state={{ user: row }}
                >
                    <KeyIcon sx={{ mr: 1 }} /> Permisos
                </MenuItem>

                <MenuItem onClick={() => handleAction('editar')}>
                    <PasswordIcon sx={{ mr: 1 }} /> Reestablecer contraseña
                </MenuItem>
                <MenuItem onClick={() => handleAction('editar')}>
                    <DateRangeIcon sx={{ mr: 1 }} /> Actualizar Fecha
                </MenuItem>
                <MenuItem
                    onClick={() => handleAction('eliminar')}
                    sx={{ color: 'error.main' }}
                >
                    <PersonOffIcon sx={{ mr: 1 }} /> deshabilitar usuario
                </MenuItem>
            </Menu>
        </>
    );
}

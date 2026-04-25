import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
// Importar iconos
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyIcon from '@mui/icons-material/Key';
import FaceIcon from '@mui/icons-material/Face';
import PasswordIcon from '@mui/icons-material/Password';
import PersonOffIcon from '@mui/icons-material/PersonOff';
// Importar Link y useNavigate para navegación
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function MenuAcciones({ row, abrirPerfil }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const location = useLocation();

    const handleOpen = (event) => {
        event.stopPropagation();
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
                    <FaceIcon sx={{ mr: 1 }} /> Perfil
                </MenuItem>
                <MenuItem
                    
                    onClick={() => {
                        handleClose();

                        navigate("/permisos", {
                            state: {
                                user: row,
                                from: location // guardar filtro actual para volver después
                            }
                        });
                    }}
                >
                    <KeyIcon sx={{ mr: 1 }} /> Permisos
                </MenuItem>

                <MenuItem
                    onClick={() => handleAction('editar')}
                >
                    <PasswordIcon sx={{ mr: 1 }} /> Reestablecer contraseña
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

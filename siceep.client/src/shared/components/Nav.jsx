import * as React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from "../../providers/Authenticacion/useAuth";
import { tienePermiso } from "./../../helper/JwtValidarPermiso";

export default function Nav({ open, toggleNav }) {

    const { logout } = useAuth();

    // Definir los elementos del menú con sus respectivos permisos
    const menuItems = [
        { text: "Usuarios", icon: <PersonIcon />, path: "/index/usuarios", idPermiso: 1 },
        { text: "Permisos", icon: <KeyIcon />, path: "/index/permisos", idPermiso: 10 },
        { text: "Cerrar Sesión", icon: <ExitToAppIcon />, path: "/", isLogout: true, idPermiso: 3 },
    ];

    const NavList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleNav(false)}>
            <List>
                {menuItems.map((item) => (
                    tienePermiso(item.idPermiso) && (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={() => {
                                    if (item.isLogout) {
                                        logout();
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}

            </List>
        </Box>
    );

    return (
        <Drawer open={open} onClose={toggleNav(false)}>
            <Toolbar disableGutters>
                <MobileFriendlyIcon sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, mr: 1 }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        ml: 2,
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    SICEEP
                </Typography>
            </Toolbar>
            {NavList}
        </Drawer>
    );
}


import * as React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
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
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import TopicIcon from '@mui/icons-material/Topic';
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DomainIcon from '@mui/icons-material/Domain';
// 
import { useAuth } from "../../providers/Authenticacion/useAuth";
import { Rutas } from "./../../routes/routes";

export default function Nav({ open, toggleNav }) {

    const [openSections, setOpenSections] = React.useState({});

    const handleToggleSection = (titulo) => {
        setOpenSections((prev) => ({
            ...prev,
            [titulo]: !prev[titulo],
        }));
    };

    const { tienePermiso, logout } = useAuth();

    const menuSections = [
        {
            titulo: "Seguridad",
            items: [
                { text: "Usuarios", icon: <PersonIcon />, path: Rutas.USUARIOS, idPermiso: 1 },
                { text: "Permisos", icon: <KeyIcon />, path: Rutas.PERMISOS, idPermiso: 1 },
                { text: "Historial", icon: <HistoryEduIcon />, path: Rutas.HISTORIAL, idPermiso: 1 },
            ]
        },
        {
            titulo: "Localizacion",
            items: [
                { text: "Ubicacion", icon: <DomainIcon />, path: Rutas.UBICACION, idPermiso: 3 },
            ]
        },
        {
            titulo: "Expediente",
            items: [ 
                { text: "Info. Personal", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                { text: "Info. Familiar", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                { text: "Info. Laboral", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                { text: "Info. Académica", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 }
            ]
        },
        {
            titulo: "Tramites y Atención",
            items: [
                { text: "Busqueda Rapida", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                { text: "Gestion Documentos", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 }
            ]
        },
        {
            titulo: "Reportes y estadisticas",
            items: [
                { text: "Reportes", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                { text: "Estadisticas", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                { text: "Herramientas de Ayuda", icon: <TopicIcon />, path: "/index", isLogout: true, idPermiso: 3 },
                
            ]
        },
        {
            titulo: "Sesión",
            items: [
                { text: "Cerrar Sesión", icon: <ExitToAppIcon />, path: "/", isLogout: true, idPermiso: 4 },
            ]
        }
    ];

    const NavList = (
        <Box sx={{ width: 280 }} role="presentation">
            {menuSections.map((section) => (
                <List key={section.titulo}>
                    <ListItemButton
                        onClick={() => handleToggleSection(section.titulo)}
                        sx={{
                            borderLeft: 4,
                            borderColor: "primary.main",
                            bgcolor: "background.paper",
                            mx: 1,
                            borderRadius: 1,
                            boxShadow: 1,
                        }}
                    >
                        <ListItemText
                            primary={section.titulo}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        />
                        {openSections[section.titulo] ? (
                            <ExpandLess />
                        ) : (
                            <ExpandMore />
                        )}
                    </ListItemButton>

                    <Collapse
                        in={openSections[section.titulo]}
                        timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            {section.items.map(
                                (item) =>
                                    tienePermiso(item.idPermiso) && (
                                        <ListItem
                                            key={item.text}
                                            disablePadding
                                            sx={{ pl: 2 }}
                                        >
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
                            )}
                        </List>
                    </Collapse>
                </List>
            ))}
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


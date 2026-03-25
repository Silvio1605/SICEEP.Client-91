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
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Nav({ open, toggleNav }) {

    const menuItems = [
        { text: "Usuarios", icon: <PersonIcon />, path: "/usuarios" },
        { text: "Permisos", icon: <FolderSharedIcon />, path: "/permisos" },
        { text: "Reportes", icon: <ContentPasteIcon />, path: "" },
        { text: "Estadisticas", icon: <BarChartIcon />, path: "" },
    ];

    const NavList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleNav(false)}>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
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


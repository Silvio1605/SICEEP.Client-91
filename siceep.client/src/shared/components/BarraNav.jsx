import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function BarraNav({ toggleNav, sidebarOpen }) {
    return (
        <Box sx={{ flexGrow: 1, width: "100%" }}>

            <AppBar position="static" sx={{ backgroundColor: '#004080', boxShadow: 'none' }}>
                <Toolbar>

                    {/* Botón para ocultar o mostrar el menú lateral */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label={sidebarOpen ? "Ocultar menú lateral" : "Mostrar menú lateral"}
                        onClick={toggleNav}
                        sx={{ mr: 1 }}
                    >
                        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>

                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            ml: 1
                        }}
                    >
                        SICEEP
                    </Typography>

                </Toolbar>
            </AppBar>
        </Box>
    );
}
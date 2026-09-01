import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// Ya no importamos IconButton ni MenuIcon porque tu Sidebar ya tiene su propio botón

export default function BarraNav({ toggleNav }) {
    return (
        // 1. Quitamos el width 96% para que abarque todo el espacio disponible que le da el Index
        <Box sx={{ flexGrow: 1, width: "100%" }}>

            {/* 2. position="static" para que no flote, y el color azul oscuro premium */}
            <AppBar position="static" sx={{ backgroundColor: '#004080', boxShadow: 'none' }}>
                <Toolbar>

                    {/* 3. El botón de menú fue eliminado. Solo dejamos el texto. */}

                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold', // Le damos un toque más grueso a la letra
                            letterSpacing: '1px',
                            ml: 2 // Un pequeño margen izquierdo para que no quede pegado a la orilla
                        }}
                    >
                        SICEEP
                    </Typography>

                </Toolbar>
            </AppBar>
        </Box>
    );
}
import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function BarraNav({ toggleNav }) {

    return (
        <Box sx={{ width: "100%", display: "flex"}}>
            <AppBar position="fixed" sx={{ width: "100%" }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                        onClick={toggleNav(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        SICEEP
                    </Typography>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

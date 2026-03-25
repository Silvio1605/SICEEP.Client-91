/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
import { useTheme, useMediaQuery } from "@mui/material";
import { rowsUsuarios, columnsUsuarios } from '../services/usuariosData';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import PerfilUsuarioDialog from '../components/Dialog/PerfilUsuarioDialog';

export default function usuarios() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    //logica para abrir perfil de usuario
    const [openPerfil, setOpenPerfil] = React.useState(false);
    
    const abrirPerfil = React.useCallback(() => {
        setOpenPerfil(true);
    }, []);

    const cerrarPerfil = React.useCallback(() => {
        setOpenPerfil(false);
    }, []);

    const registros = React.useMemo(() => {
        return columnsUsuarios({ isMobile, abrirPerfil });
    }, [isMobile, abrirPerfil]);

    const slots = React.useMemo(() => ({ toolbar: GridToolbar }), []);

   
    return (
        
        // Box con padding general y fondo suave
        <Box>
            <Box sx={{ m: '0px 10px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Nuevo Usuario
                </Button>
            </Box>
            <Typography variant="h5" component="h1" color="text.primary">
                Usuarios/Actuales
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    width: '98%',
                    // Estilos para la tabla
                    '& .MuiDataGrid-root': {
                        borderRadius: 2,
                        boxShadow: 3,
                        borderColor: 'grey.300',
                    },
                    '& .header-negrita': {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Paper
                    component="form"
                    sx={{m: '10px 0px', p: '2px 2px', display: 'flex', alignItems: 'flex-end', width: '50%' }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Búscar Usuarios"
                        inputProps={{ 'aria-label': 'Busqueda Usuarios' }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* DataGrid */}
                <DataGrid
                    rows={rowsUsuarios}
                    columns={registros} // Columnas con flex: 1 aplicado
                    // Configuramos el GridToolbar
                    slots={slots}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>

            <PerfilUsuarioDialog
                open={openPerfil}
                onClose={cerrarPerfil}
            />
        </Box>
    )
}


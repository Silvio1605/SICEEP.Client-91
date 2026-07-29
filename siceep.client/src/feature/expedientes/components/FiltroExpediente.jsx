import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

export default function FiltroExpediente({ filtro, actualizarFiltro, buscar }) {
    
    const [inputFiltro, setInputFiltro] = useState(
        filtro.busqueda || ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoFiltro = {
            ...filtro,
            busqueda: inputFiltro
        };
        actualizarFiltro({ busqueda: inputFiltro });
        buscar(nuevoFiltro);
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            variant="outlined"
            sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                backgroundColor: '#f8f9fa', // Fondo grisáceo de la barra entera
                borderColor: '#e0e0e0',
                borderRadius: 2,
                // flexWrap permite que en pantallas pequeñas (celulares) los filtros se acomoden abajo
                flexWrap: { xs: 'wrap', md: 'nowrap' }
            }}
        >
            {/* 1. BUSCADOR PRINCIPAL (El flex: 1 empuja los selectores a la derecha) */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1, 
                    border: '1px solid #ced4da',
                    borderRadius: 1,
                    backgroundColor: '#ffffff',
                    px: 1,
                    py: 0.5
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    type="text"
                    placeholder="Buscar por nombre"
                    value={inputFiltro}
                    onChange={(e) => setInputFiltro(e.target.value)}
                />
                <IconButton aria-label="search" color="primary" type="submit">
                    <SearchIcon />
                </IconButton>
            </Box>

            <Box sx={{ width: { xs: '100%', md: 200 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        border: '1px solid #ced4da',
                        borderRadius: 1,
                        backgroundColor: '#ffffff',
                        px: 1,
                        py: 0.5
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        type="text"
                        placeholder="Buscar por Estructura"
                    />
                </Box>
                
            </Box>

            <Box sx={{ width: { xs: '100%', md: 200 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        border: '1px solid #ced4da',
                        borderRadius: 1,
                        backgroundColor: '#ffffff',
                        px: 1,
                        py: 0.5
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        type="text"
                        placeholder="Buscar por Cargo"
                    />
                </Box>
            </Box>
        </Paper>
    );
}


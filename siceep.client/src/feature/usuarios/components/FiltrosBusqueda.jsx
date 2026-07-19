import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SelectItem from './../../../shared/components/SelectItem';
import { useSelectUsuarios } from './../hooks/useSelectUsuarios';
import IconButton from '@mui/material/IconButton';

export default function FiltrosBusqueda({ filtro, actualizarFiltro, buscar }) {
    const { selEstado, selAño, loading } = useSelectUsuarios();

    const [inputPropietario, setInputPropietario] = useState(
        filtro.propietario || ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoFiltro = {
            ...filtro,
            propietario: inputPropietario
        };
        actualizarFiltro({ propietario: inputPropietario });
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
                    flex: 1, // ¡Este es el secreto de la anchura!
                    border: '1px solid #ced4da',
                    borderRadius: 1,
                    backgroundColor: '#ffffff',
                    px: 1,
                    py: 0.5
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Buscar por nombre del propietario"
                    value={inputPropietario}
                    onChange={(e) => setInputPropietario(e.target.value)}
                />
                <IconButton aria-label="search" color="primary" type="submit">
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* 2. FILTRO DE ESTADOS */}
            <Box sx={{ width: { xs: '100%', md: 200 } }}>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <SelectItem
                        value={filtro.estado || ""}
                        onChange={(estado) => {
                            actualizarFiltro({ estado: estado });
                        }}
                        incluirTodo={true}
                        datos={selEstado}
                        titulo="Estados"
                    />
                )}
            </Box>

            {/* 3. FILTRO DE AÑO VENCIMIENTO */}
            <Box sx={{ width: { xs: '100%', md: 200 } }}>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <SelectItem
                        value={
                            filtro.fechaExpiracionDesde
                                ? filtro.fechaExpiracionDesde.split("-")[0]
                                : ""
                        }
                        onChange={(año) => {
                            if (!año) {
                                actualizarFiltro({
                                    fechaExpiracionDesde: null,
                                    fechaExpiracionHasta: null
                                });
                                return;
                            }
                            actualizarFiltro({
                                fechaExpiracionDesde: `${año}-01-01`,
                                fechaExpiracionHasta: `${año}-12-31`
                            });
                        }}
                        incluirTodo={true}
                        datos={selAño}
                        titulo="Año Vencimiento"
                    />
                )}
            </Box>
        </Paper>
    );
}
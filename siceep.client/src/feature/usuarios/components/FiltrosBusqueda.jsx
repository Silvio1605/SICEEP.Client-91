import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import SelectItem from './../../../shared/components/SelectItem';
import { useSelectUsuarios } from './../hooks/useSelectUsuarios';
import IconButton from '@mui/material/IconButton';

export default function FiltrosBusqueda({ filtro, actualizarFiltro, buscar }) {

    //datos para las cajas de selecciones
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
        <Box
            sx={{
                border: '1px solid #ccc',
                boxShadow: 3,
                p: 2,
                mb: 2,
                mt: 2,
                borderRadius: 2
            }}
        >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>

                        {/* INPUT */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Paper
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    mt: 1,
                                    px: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '98%'
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Buscar por nombre del propietario"
                                    value={inputPropietario}
                                    onChange={(e) => {
                                        setInputPropietario(e.target.value);
                                    }}
                                />
                                <IconButton
                                    aria-label="search"
                                    color="primary"
                                    type="submit"
                                >
                                    <SearchIcon />
                                </IconButton>

                            </Paper>
                        </Grid>
                        
                        <Grid size={{ xs: 6, md: 2 }}>
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
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
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
                        </Grid>

                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import SelectItem from './../../../shared/components/SelectItem';
import IconButton from '@mui/material/IconButton';
import AppInput from './../../../shared/components/AppInput';
import { useBitacora } from './../hooks/useBitacora';

export default function BitacoraFiltro({ filtro, actualizarFiltro, buscar }) {

    const { selAccion, loading } = useBitacora(); 

    const [inputUsuario, setInputUsuario] = useState(
        filtro.usuario || ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoFiltro = {
            ...filtro,
            usuario: inputUsuario
        };
        actualizarFiltro({ usuario: inputUsuario });
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
                                    placeholder="Buscar por nombre de usuario"
                                    value={inputUsuario}
                                    onChange={(e) => {
                                        setInputUsuario(e.target.value);
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
                                    value={filtro.accion || ""}
                                    onChange={(accion) => { 
                                        actualizarFiltro({ accion: accion });
                                    }}
                                    incluirTodo={true}
                                    datos={selAccion}
                                    titulo="Acciones"
                                />
                            )}
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <AppInput
                                id="fecha"
                                label="Fecha de Modificación"
                                value={filtro.fecha ?? ''}
                                isReadOnly={false}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    actualizarFiltro({ fecha: e.target.value });
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
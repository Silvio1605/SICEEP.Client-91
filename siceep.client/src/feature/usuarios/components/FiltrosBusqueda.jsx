import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import SelectItem from './../../../shared/components/SelectItem';
import { useSelectUsuarios } from './../hooks/useSelectUsuarios';

export default function FiltrosBusqueda({ filtro, setFiltro, handleBuscar }) {

    //datos para las cajas de selecciones
    const { selEstado, selAño, loading } = useSelectUsuarios();

    const [inputPropietario, setInputPropietario] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setFiltro(prev => ({
            ...prev,
            propietario: inputPropietario
        }));

        handleBuscar();
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
            <Typography variant="subtitle1" component="h1">
                Búsqueda de cuentas
            </Typography>

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
                                    width: '100%'
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Buscar por nombre del propietario"
                                    value={inputPropietario}
                                    onChange={(e) => setInputPropietario(e.target.value)}
                                />
                                <IconButton type="submit">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>

                        {/* SELECT ESTADO */}
                        <Grid size={{ xs: 6, md: 2 }}>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : (
                                <SelectItem
                                   value={filtro.estado || ""}
                                   onChange={(estado) =>
                                        setFiltro(prev => ({
                                            ...prev,
                                            estado
                                        }))
                                   }
                                   datos={selEstado}
                                   titulo="Estados"
                                />  
                            )}
                            
                        </Grid>

                        {/* SELECT AÑO */}
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
                                          setFiltro(prev => ({
                                              ...prev,
                                              fechaExpiracionDesde: null,
                                              fechaExpiracionHasta: null
                                          }));
                                          return;
                                     }

                                     setFiltro(prev => ({
                                          ...prev,
                                          fechaExpiracionDesde: `${año}-01-01`,
                                          fechaExpiracionHasta: `${año}-12-31`
                                     }));
                                 }}
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
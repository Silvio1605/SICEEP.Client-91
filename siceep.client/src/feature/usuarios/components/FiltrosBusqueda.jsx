import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import SelectItem from './../../../shared/components/SelectItem';
import { useSelectUsuarios } from './../hooks/useSelectUsuarios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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
    //
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleDialogClose = (_event, reason) => {
        if (!['backdropClick', 'escapeKeyDown'].includes(reason)) {
            setOpen(false);
        }
    };
    const handleActionButtonClick = () => {
        setOpen(false);
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
                                    onChange={(e) => {
                                        setInputPropietario(e.target.value);
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    endIcon={<SearchIcon />}
                                    sx={{ ml: 1 }} // separación mínima
                                >
                                    Buscar
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            {loading ? (
                                <p>Cargando...</p>
                            ) : (
                                <Stack direction="row" spacing={2} sx={{ mt: 1, ml: 1 }}>
                                    <Button onClick={handleClickOpen} variant="contained" endIcon={<FilterAltIcon />}>
                                        Filtro
                                    </Button>
                                </Stack>
                            )}
                        </Grid>

                        <Dialog open={open} onClose={handleDialogClose} disableRestoreFocus>
                            <DialogTitle>Parametros de Búsqueda</DialogTitle>
                            <DialogContent>
                                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleActionButtonClick}>Aceptar</Button>
                            </DialogActions>
                        </Dialog>

                       
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}
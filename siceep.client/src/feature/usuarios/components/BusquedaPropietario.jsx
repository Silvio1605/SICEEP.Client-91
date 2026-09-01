import React, { useState, useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Stack, Skeleton } from '@mui/material';
// datgrid
import {
    DataGrid
} from '@mui/x-data-grid';
// iconos
import SearchIcon from '@mui/icons-material/Search';
// hooks
import { useRegistrar } from './../hooks/useRegistrar'; 
import { columnsPropietarios } from './../services/propietarioData';

// Funciones para evitar que el botón de mostrar/ocultar contraseña tome el foco al hacer clic
const handleMouseDownContra = (event) => {
    event.preventDefault();
};
const handleMouseUpContra = (event) => {
    event.preventDefault();
};

export default function BusquedaPropietario({ open, onClose, onSeleccionar, OriginRegistro }) {
    
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Hook para buscar propietarios
    const { propietarios, buscar } = useRegistrar();

    const [buscarPropietario, setBuscarPropietario] = useState(''); 
    
    const manejarCambioInput = (e) => {
        setBuscarPropietario(e.target.value);
    };

    // Manejador para la búsqueda (estable)
    const manejarBusqueda = () => {
        buscar(buscarPropietario, OriginRegistro);
    };

    const manejarSeleccion = useCallback((params) => {
        onSeleccionar(params);
        onClose();
    }, [onSeleccionar, onClose]);

    // Ahora las columnas se generan con la función estable
    const columnas = useMemo(() => {
        return columnsPropietarios({ Seleccion: manejarSeleccion });
    }, [manejarSeleccion]); // Solo se recalcula si cambia la función

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={onClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Seleccione la cuenta"}
                </DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                        <InputLabel htmlFor={`buscar-propietario-input`}>Buscar</InputLabel>
                        <OutlinedInput
                            id={`buscar-propietario-input`}
                            type={'text'}
                            value={buscarPropietario}
                            onChange={manejarCambioInput}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={manejarBusqueda}
                                        onMouseDown={handleMouseDownContra}
                                        onMouseUp={handleMouseUpContra}
                                        edge="end"
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>

                    {propietarios ? (
                        <DataGrid
                            rows={propietarios}
                            columns={columnas} // Columnas con flex: 1 aplicado
                            getRowId={(row) => row.id}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            localeText={{
                                noRowsLabel: "No hay datos",
                                noResultsOverlayLabel: "No se encontraron resultados",
                                MuiTablePagination: {
                                    labelRowsPerPage: "Filas:"
                                }
                            }}
                        />
                    ) : (
                        <Stack spacing={1}>
                            {/* For variant="text", adjust the height via font-size */}
                            <Skeleton variant="rectangular" width={'100%'} height={20} />
                            <Skeleton variant="rounded" width={'100%'} height={60} />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

import React, { useCallback, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Stack, Skeleton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// datgrid
import {
    DataGrid
} from '@mui/x-data-grid';
// iconos
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
// hooks
import { useRegistrar } from './../hooks/useRegistrar';
import { columnsPropietarios } from './../services/propietarioData';

// Contenido del diálogo: se monta solo cuando el diálogo está abierto,
// de modo que su estado local siempre inicia limpio y el autofocus funciona.
function ContenidoBusqueda({ onClose, onSeleccionar, OriginRegistro }) {

    const theme = useTheme();

    // Hook para buscar propietarios
    const { propietarios, cargando, buscar } = useRegistrar();

    const [buscarPropietario, setBuscarPropietario] = useState('');
    const [terminoBuscado, setTerminoBuscado] = useState('');

    const manejarCambioInput = (e) => {
        setBuscarPropietario(e.target.value);
    };

    const manejarBusqueda = (e) => {
        e?.preventDefault?.();
        const termino = buscarPropietario.trim();
        if (!termino) return;
        setTerminoBuscado(termino);
        buscar(termino, OriginRegistro);
    };

    const limpiarBusqueda = () => {
        setBuscarPropietario('');
        setTerminoBuscado('');
    };

    const manejarSeleccion = useCallback((fila) => {
        onSeleccionar(fila);
        onClose();
    }, [onSeleccionar, onClose]);

    // Ahora las columnas se generan con la función estable
    const columnas = useMemo(() => {
        return columnsPropietarios({ Seleccion: manejarSeleccion });
    }, [manejarSeleccion]);

    const sinResultados = terminoBuscado.length > 0 && !cargando && propietarios.length === 0;

    return (
        <React.Fragment>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>
                    Seleccione la cuenta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Busque al propietario o al usuario por su nombre
                </Typography>
            </DialogTitle>

            <DialogContent>
                {/* Buscador */}
                <Box component="form" onSubmit={manejarBusqueda} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Buscar"
                        placeholder="Escriba el nombre y presione Enter"
                        value={buscarPropietario}
                        onChange={manejarCambioInput}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {buscarPropietario && (
                                        <IconButton
                                            onClick={limpiarBusqueda}
                                            edge="end"
                                            size="small"
                                            aria-label="Limpiar búsqueda"
                                            sx={{ mr: 0.5 }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        onClick={manejarBusqueda}
                                        edge="end"
                                        color="primary"
                                        aria-label="Buscar"
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Contenido según estado */}
                {cargando ? (
                    <Stack spacing={1}>
                        <Skeleton variant="rounded" height={48} />
                        <Skeleton variant="rounded" height={48} />
                        <Skeleton variant="rounded" height={48} />
                    </Stack>
                ) : !terminoBuscado ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            borderColor: 'divider',
                            bgcolor: alpha(theme.palette.grey[100], 0.5)
                        }}
                    >
                        <PersonSearchIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Escriba el nombre y presione Enter para buscar
                        </Typography>
                    </Paper>
                ) : sinResultados ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            borderColor: 'divider'
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            No se encontraron resultados para “{terminoBuscado}”.
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
                            <Chip
                                size="small"
                                color="primary"
                                variant="outlined"
                                label={`${propietarios.length} resultado${propietarios.length === 1 ? '' : 's'} para “${terminoBuscado}”`}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Haga clic en el icono o doble clic sobre una fila para seleccionarla.
                            </Typography>
                        </Stack>
                        <DataGrid
                            rows={propietarios}
                            columns={columnas}
                            getRowId={(row) => row.id}
                            autoHeight
                            disableColumnMenu
                            disableRowSelectionOnClick
                            hideFooterSelectedRowCount
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            onRowDoubleClick={(params) => manejarSeleccion(params.row)}
                            localeText={{
                                noRowsLabel: "No hay datos",
                                noResultsOverlayLabel: "No se encontraron resultados",
                                MuiTablePagination: {
                                    labelRowsPerPage: "Filas:"
                                }
                            }}
                            sx={{
                                border: 'none',
                                backgroundColor: '#ffffff',
                                '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
                                '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                            }}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default function BusquedaPropietario({ open, onClose, onSeleccionar, OriginRegistro }) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="busqueda-propietario-title"
        >
            {open ? (
                <ContenidoBusqueda
                    onClose={onClose}
                    onSeleccionar={onSeleccionar}
                    OriginRegistro={OriginRegistro}
                />
            ) : null}
        </Dialog>
    );
}
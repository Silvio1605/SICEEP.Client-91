import React, { useState } from 'react';
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
import Paper from '@mui/material/Paper';
import { Stack, Skeleton } from '@mui/material';
// datgrid
import {
    DataGrid
} from '@mui/x-data-grid';
// iconos
import SearchIcon from '@mui/icons-material/Search';
// hooks
import { useUnidades } from './../hooks/useUnidades';
import { useEstructuras } from './../hooks/useEstructuras';
import { getColumnsSelect } from './../components/getColumnsSelect';


// Funciones para evitar que el botón de mostrar/ocultar contraseña tome el foco al hacer clic
const handleMouseDownContra = (event) => {
    event.preventDefault();
};
const handleMouseUpContra = (event) => {
    event.preventDefault();
};

export default function CardSeleccionar({ open, onClose, onSelect, tipo }) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Hook para buscar propietarios
    const { data: unidades, search: searchUnidades } = useUnidades();
    const { data: estructuras, search: searchEstructuras } = useEstructuras();

    const [buscar, setBuscar] = useState('');

    const getCurrentData = () => {
        switch (tipo) {
            case 0: return unidades;
            case 1: return estructuras;
            default: return [];
        }
    };

    const buscarRegistros = () => {
        switch (tipo) {
            case 0: return searchUnidades(buscar, 1) ;
            case 1: return searchEstructuras(buscar, 1);
            default: return [];
        }

    };

    const registros = getCurrentData();
    const columns = getColumnsSelect({ Seleccion : onSelect });

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={onClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Seleccionar"}
                </DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                        <InputLabel htmlFor={`buscar-propietario-input`}>Buscar</InputLabel>
                        <OutlinedInput
                            id={`buscar-propietario-input`}
                            type={'text'}
                            value={buscar}
                            onChange={(e) => setBuscar(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={buscarRegistros}
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

                    {registros ? (
                        <>
                            {/* Tabla de datos */}
                            <Paper sx={{ height: 'calc(100% - 180px)', width: '100%', p: 1 }}>
                                <DataGrid
                                    rows={registros}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    pagination
                                    disableSelectionOnClick
                                    autoHeight={false}
                                    sx={{
                                        border: 'none',
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#f8fafc',
                                            fontWeight: 600,
                                            color: '#1a3b5d',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: '1px solid #f0f0f0',
                                        },
                                        '& .MuiDataGrid-footerContainer': {
                                            borderTop: '1px solid #f0f0f0',
                                        },
                                    }}
                                />
                            </Paper>
                        </>
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
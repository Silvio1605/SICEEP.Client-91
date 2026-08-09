import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, FormGroup, FormControlLabel,
    Checkbox, Divider, ListItemIcon, TablePagination
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';

const opcionesImpresionPorDefecto = {
    fichaCompleta: false,
    infoPersonal: false,
    infoFamiliar: false,
    trayectoria: false,
    perfilAcademico: false
};

const MOCK_EXPEDIENTES_DATA = [
    { id: 1, noExp: 'EXP-001', nombre: 'Juan Perez', ubicacion: 'Managua', estado: 'Activo' },
    { id: 2, noExp: 'EXP-002', nombre: 'Ana Lopez', ubicacion: 'Leon', estado: 'Inactivo' },
    { id: 3, noExp: 'EXP-003', nombre: 'Carlos Gomez', ubicacion: 'Estelí', estado: 'Activo' },
];

export default function BusquedaRapida() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [modalImpresionAbierto, setModalImpresionAbierto] = useState(false);
    const [opcionesImpresion, setOpcionesImpresion] = useState(opcionesImpresionPorDefecto);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const isMenuOpen = Boolean(anchorEl);

    const abrirMenuOpciones = useCallback((event, empleado) => {
        setAnchorEl(event.currentTarget);
        setEmpleadoSeleccionado(empleado);
    }, []);

    const cerrarMenuOpciones = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const abrirModal = useCallback(() => {
        cerrarMenuOpciones();
        setModalImpresionAbierto(true);
    }, [cerrarMenuOpciones]);

    const cerrarModal = useCallback(() => {
        setModalImpresionAbierto(false);
        setOpcionesImpresion(opcionesImpresionPorDefecto);
        setEmpleadoSeleccionado(null);
    }, []);

    const manejarCambioCheckbox = useCallback((event) => {
        const { name, checked } = event.target;
        setOpcionesImpresion(prev => ({
            ...prev,
            [name]: checked
        }));
    }, []);

    const mandarAImprimir = async () => {
        try {
            console.log("Generando documento para: ", empleadoSeleccionado?.nombre);
            cerrarModal();
        } catch (error) {
            console.error("Error al generar el PDF: ", error);
        }
    };

    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Typography variant="h5" color="text.primary" fontWeight="bold" sx={{ mb: 1 }}>
                Búsqueda Rápida
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Consulta ágil de expedientes y generación de reportes.
            </Typography>

            
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por nombre del propietario"
                    sx={{ backgroundColor: '#fff' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                    }}
                />
            </Box>

           
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Registros de expedientes
            </Typography>

            
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Table size="medium">
                    <TableHead sx={{ backgroundColor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary' }}>No.</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Número de Expediente</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Nombre Completo</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Ubicación</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Estado</TableCell>
                            <TableCell align="center" sx={{ color: 'text.secondary' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {MOCK_EXPEDIENTES_DATA
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.noExp}</TableCell>
                                    <TableCell>{row.nombre}</TableCell>
                                    <TableCell>{row.ubicacion}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            color={row.estado === 'Activo' ? '#2e7d32' : '#d32f2f'}
                                        >
                                            {row.estado}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => abrirMenuOpciones(e, row)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={MOCK_EXPEDIENTES_DATA.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
                />
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={cerrarMenuOpciones}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ elevation: 3, sx: { minWidth: 200, mt: 0.5 } }}
            >
                <MenuItem onClick={abrirModal}>
                    <ListItemIcon><DescriptionIcon fontSize="small" color="primary" /></ListItemIcon>
                    Ficha
                </MenuItem>
                <MenuItem onClick={cerrarMenuOpciones}>
                    <ListItemIcon><AssignmentIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia
                </MenuItem>
                <Divider />
                <MenuItem onClick={cerrarMenuOpciones}>
                    <ListItemIcon><FolderSharedIcon fontSize="small" color="info" /></ListItemIcon>
                    Documentos Digitales
                </MenuItem>
            </Menu>

            <Dialog open={modalImpresionAbierto} onClose={cerrarModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    <PrintIcon /> Opciones de Impresión
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Seleccione las secciones del expediente que desea incluir en el documento:
                    </Typography>

                    <FormGroup sx={{ gap: 1 }}>
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.fichaCompleta} onChange={manejarCambioCheckbox} name="fichaCompleta" color="primary" />}
                            label={<Typography fontWeight="bold">Imprimir toda la información (Ficha Completa)</Typography>}
                        />
                        <Divider sx={{ my: 1 }} />

                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.infoPersonal} onChange={manejarCambioCheckbox} name="infoPersonal" disabled={opcionesImpresion.fichaCompleta} />}
                            label="Información Personal"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.infoFamiliar} onChange={manejarCambioCheckbox} name="infoFamiliar" disabled={opcionesImpresion.fichaCompleta} />}
                            label="Información Familiar"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.trayectoria} onChange={manejarCambioCheckbox} name="trayectoria" disabled={opcionesImpresion.fichaCompleta} />}
                            label="Trayectoria Laboral e Historial de Bajas"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.perfilAcademico} onChange={manejarCambioCheckbox} name="perfilAcademico" disabled={opcionesImpresion.fichaCompleta} />}
                            label="Perfil Académico y Cursos"
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={cerrarModal} color="inherit" startIcon={<CancelIcon />}>
                        CANCELAR
                    </Button>
                    <Button onClick={mandarAImprimir} variant="contained" color="primary" startIcon={<PrintIcon />}>
                        GENERAR DOCUMENTO
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
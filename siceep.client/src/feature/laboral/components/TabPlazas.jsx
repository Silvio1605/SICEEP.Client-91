import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Paper, Stack, Button, Chip, Skeleton, Alert, FormControlLabel, Checkbox,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    InputAdornment, TextField, IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddBoxIcon from '@mui/icons-material/AddBox';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
//
import { usePlazas } from './../hooks/usePlazas';
import ModalPlaza from './ModalPlaza';

const formatoSalario = (salario) =>
    new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 2 }).format(salario || 0);

const formatoFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function TabPlazas() {

    const { plazas, totalRegistros, loading, error, cargar, guardarPlaza } = usePlazas();

    const [texto, setTexto] = useState('');
    const [soloDisponibles, setSoloDisponibles] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);

    const refrescar = useCallback((pagina = 0, tamaño = pageSize) => {
        cargar({
            texto: texto.trim() || undefined,
            soloDisponibles: soloDisponibles || undefined,
            page: pagina + 1,
            pageSize: tamaño
        });
    }, [cargar, texto, soloDisponibles, pageSize]);

    const hacerBusqueda = () => {
        setPage(0);
        refrescar(0, pageSize);
    };

    const cambiarPagina = (_evento, nuevaPagina) => {
        setPage(nuevaPagina);
        refrescar(nuevaPagina, pageSize);
    };

    const cambiarTamaño = (evento) => {
        const nuevoTamaño = parseInt(evento.target.value, 10) || 10;
        setPageSize(nuevoTamaño);
        setPage(0);
        refrescar(0, nuevoTamaño);
    };

    return (
        <Box>
            {/* Barra de herramientas */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 3, borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <TextField
                        size="small"
                        label="Buscar plaza"
                        placeholder="Ordinal, cargo, estructura o unidad..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') hacerBusqueda();
                        }}
                        sx={{ flex: 1, minWidth: 260 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: texto ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => { setTexto(''); }} aria-label="Limpiar búsqueda">
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={soloDisponibles}
                                onChange={(e) => {
                                    setSoloDisponibles(e.target.checked);
                                    setPage(0);
                                    cargar({
                                        texto: texto.trim() || undefined,
                                        soloDisponibles: e.target.checked || undefined,
                                        page: 1,
                                        pageSize
                                    });
                                }}
                            />
                        }
                        label="Solo disponibles"
                    />

                    <Button variant="contained" onClick={hacerBusqueda} startIcon={<SearchIcon />}>
                        Buscar
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddBoxIcon />}
                        onClick={() => setOpenModal(true)}
                    >
                        Nueva Plaza
                    </Button>
                </Stack>
            </Paper>

            {/* Contenido */}
            {loading ? (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'divider' }}>
                    <Stack spacing={1}>
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                    </Stack>
                </Paper>
            ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            ) : plazas.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 3, borderColor: 'divider' }}>
                    <WorkOutlineIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                        {soloDisponibles || texto
                            ? "No se encontraron plazas con los filtros aplicados."
                            : "Todavía no hay plazas registradas."}
                    </Typography>
                </Paper>
            ) : (
                <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                    <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkOutlineIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle1" fontWeight={700}>Plazas</Typography>
                        <Chip
                            size="small"
                            color="primary"
                            variant="outlined"
                            label={`${totalRegistros} plaza${totalRegistros === 1 ? '' : 's'}`}
                        />
                    </Box>

                    <TableContainer sx={{ mt: 1 }}>
                        <Table size="small">
                            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Ordinal</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Sede (Estructura - Unidad)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Salario</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Registrada</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plazas.map((plaza) => (
                                    <TableRow key={plaza.idPlaza} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{plaza.ordinal}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{plaza.cargo}</Typography>
                                            {plaza.categoria && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {plaza.categoria}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{plaza.estructura} - {plaza.unidad}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2">{formatoSalario(plaza.salario)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {plaza.ocupada ? (
                                                <Tooltip title={`Ocupada por ${plaza.ocupante || 'S/D'}`}>
                                                    <Chip size="small" color="default" variant="outlined" label={`Ocupada · ${plaza.ocupante || 'S/D'}`} />
                                                </Tooltip>
                                            ) : (
                                                <Chip size="small" color="success" label="Disponible" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatoFecha(plaza.fechaCreacion)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={totalRegistros}
                        page={page}
                        onPageChange={cambiarPagina}
                        rowsPerPage={pageSize}
                        onRowsPerPageChange={cambiarTamaño}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Filas:"
                    />
                </Paper>
            )}

            {/* Modal crear plaza */}
            <ModalPlaza
                open={openModal}
                onClose={() => setOpenModal(false)}
                onGuardado={guardarPlaza}
            />
        </Box>
    );
}
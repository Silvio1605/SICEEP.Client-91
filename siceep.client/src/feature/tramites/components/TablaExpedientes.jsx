import {
    Box, Typography, Paper, TextField, InputAdornment, Stack, Skeleton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, TablePagination, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ROWS_PER_PAGE = 10;

const ESTADO_MAP = {
    1: { label: 'Baja', color: '#d32f2f' },
    2: { label: 'Activo', color: '#2e7d32' },
    3: { label: 'Com/Servicio', color: '#ed6c02' },
};

export default function TablaExpedientes({
    expedientes,
    total,
    cargando,
    error,
    busqueda,
    page,
    onBuscar,
    onCambiaPagina,
    onAbrirAcciones
}) {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por nombre del propietario"
                    value={busqueda}
                    onChange={onBuscar}
                    sx={{ backgroundColor: '#fff' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                    }}
                />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Registros de expedientes
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Table size="medium">
                    <TableHead sx={{ backgroundColor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary' }}>No.</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Número de Expediente</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Nombre Completo</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Estructura</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Estado</TableCell>
                            <TableCell align="center" sx={{ color: 'text.secondary' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cargando ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Stack spacing={1} sx={{ py: 2 }}>
                                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                                        <Skeleton variant="rounded" width={'100%'} height={45} />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ) : expedientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    No se encontraron expedientes
                                </TableCell>
                            </TableRow>
                        ) : (
                            expedientes.map((row, index) => {
                                const estado = ESTADO_MAP[row.estado] || { label: 'Desconocido', color: '#757575' };
                                return (
                                    <TableRow key={row.id ?? index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{page * ROWS_PER_PAGE + index + 1}</TableCell>
                                        <TableCell>{row.codigo || row.noExp || 'S/D'}</TableCell>
                                        <TableCell>{row.nombreCompleto || row.nombre || 'S/D'}</TableCell>
                                        <TableCell>{row.estructura || row.ubicacion || 'S/D'}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color={estado.color}>
                                                {estado.label}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => onAbrirAcciones(e, row)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={total}
                    rowsPerPage={ROWS_PER_PAGE}
                    page={page}
                    onPageChange={onCambiaPagina}
                    labelRowsPerPage="Filas:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                />
            </TableContainer>
        </Box>
    );
}

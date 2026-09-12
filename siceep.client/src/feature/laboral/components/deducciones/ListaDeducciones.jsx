import React from 'react';
import { Box, Typography, Paper, Stack, Chip, Skeleton, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
//
import { formatoMoneda, formatoFecha } from './../../utils/deduccionUtils';

export default function ListaDeducciones({ deducciones, loading, error, onEditar, onEliminar }) {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
            <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>Deducciones registradas</Typography>
                <Chip size="small" color="primary" variant="outlined" label={`${deducciones.length}`} />
            </Box>

            {loading ? (
                <Box sx={{ p: 3 }}>
                    <Stack spacing={1}>
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                    </Stack>
                </Box>
            ) : error ? (
                <Box sx={{ p: 3 }}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                </Box>
            ) : deducciones.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Este empleado no tiene deducciones registradas.
                    </Typography>
                </Box>
            ) : (
                <TableContainer sx={{ mt: 1 }}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Mes</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Institución</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total deuda</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Saldo</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deducciones.map((d) => (
                                <TableRow key={d.idDeduccion} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{d.periodo}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatoFecha(d.fechaDeduccion)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{d.nombreTipoDeduccion}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color={d.nombreInstitucion ? 'text.primary' : 'text.secondary'}>
                                            {d.nombreInstitucion || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2">{formatoMoneda(d.monto)}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2">
                                            {d.totalDeuda ? formatoMoneda(d.totalDeuda) : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {d.saldoRestante !== null && d.saldoRestante !== undefined ? (
                                            <Chip
                                                size="small"
                                                label={formatoMoneda(d.saldoRestante)}
                                                color={d.saldoRestante > 0 ? 'default' : 'success'}
                                                variant="outlined"
                                            />
                                        ) : (
                                            '—'
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                            <Tooltip title="Editar">
                                                <IconButton size="small" onClick={() => onEditar(d)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" color="error" onClick={() => onEliminar(d)}>
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}
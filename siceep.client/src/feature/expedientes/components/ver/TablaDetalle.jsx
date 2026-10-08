import {
    Box, Typography, Table, TableHead, TableBody, TableRow,
    TableCell, TableContainer, Paper
} from '@mui/material';
import { formatoMoneda } from '../../../laboral/utils/deduccionUtils';

const TablaDetalle = ({ titulo, colorBorde, filas, columnaMonto, total, subtotalTexto, vacio }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1.5 }}>
            {titulo}
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{columnaMonto}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filas.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                {vacio}
                            </TableCell>
                        </TableRow>
                    ) : filas.map((f) => (
                        <TableRow key={f.id} hover>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                    {f.concepto}
                                </Typography>
                                {f.detalle && (
                                    <Typography variant="caption" color="text.secondary">
                                        {f.detalle}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {f.fecha}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" fontWeight={600}>
                                    {formatoMoneda(f.monto)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filas.length > 0 && (
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                            <TableCell colSpan={2} sx={{ fontWeight: 700, borderLeft: `3px solid ${colorBorde}` }}>
                                {subtotalTexto}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, borderLeft: `3px solid ${colorBorde}` }}>
                                {formatoMoneda(total)}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);

export default TablaDetalle;
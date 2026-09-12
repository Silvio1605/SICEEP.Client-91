import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const BarrasSimples = ({ items = [], color = 'primary.main' }) => {
    const max = Math.max(...items.map((i) => i.cantidad ?? i.valor ?? 0), 1);

    return (
        <Stack spacing={1.25}>
            {items.map((item, idx) => {
                const valor = item.cantidad ?? item.valor ?? 0;
                const ancho = (valor / max) * 100;
                const porcentaje = item.porcentaje ?? 0;

                return (
                    <Box key={idx}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    width: '42%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textTransform: 'capitalize'
                                }}
                                title={item.label ?? item.nivel ?? item.estructura ?? item.sexo}
                            >
                                {item.label ?? item.nivel ?? item.estructura ?? item.sexo}
                            </Typography>
                            <Box sx={{ flex: 1, height: 18, borderRadius: 1.5, overflow: 'hidden', bgcolor: '#f0f2f5' }}>
                                <Box sx={{ width: `${ancho}%`, height: '100%', bgcolor: color }} />
                            </Box>
                            <Typography variant="body2" sx={{ width: 32, textAlign: 'right', fontWeight: 700 }}>
                                {valor}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ width: 52, textAlign: 'right' }}>
                                {Number(porcentaje).toFixed(1)}%
                            </Typography>
                        </Stack>
                    </Box>
                );
            })}
        </Stack>
    );
};

export default BarrasSimples;
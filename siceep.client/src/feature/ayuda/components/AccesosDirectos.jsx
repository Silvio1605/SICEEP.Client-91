import React from 'react';
import { Grid, Paper, Stack, Avatar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { modulos } from '../data/ayudaData';

export default function AccesosDirectos() {
    const navigate = useNavigate();

    return (
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {modulos.map((m) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={m.titulo}>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 1.5,
                            borderRadius: 3,
                            borderColor: 'divider',
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate(m.ruta)}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 34, height: 34, bgcolor: m.color, flexShrink: 0 }}>
                                {m.icono}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    {m.titulo}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                                    {m.desc}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}
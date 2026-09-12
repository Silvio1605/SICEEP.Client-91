import React from 'react';
import { Paper, Stack, Avatar, Typography } from '@mui/material';

export default function TarjetaKpi({ titulo, valor, icono, color = 'primary.main', subvalor }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3,
                borderColor: 'divider',
                p: 2.5,
                flex: '1 1 180px',
                minWidth: 170,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {titulo}
                </Typography>
                <Avatar sx={{ width: 34, height: 34, bgcolor: color }}>
                    {icono}
                </Avatar>
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {valor}
            </Typography>
            {subvalor && (
                <Typography variant="body2" color="text.secondary">
                    {subvalor}
                </Typography>
            )}
        </Paper>
    );
}
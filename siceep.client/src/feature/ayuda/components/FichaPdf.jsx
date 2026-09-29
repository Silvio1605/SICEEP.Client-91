import React from 'react';
import { Paper, Stack, Avatar, Box, Typography, Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigate } from 'react-router-dom';

export default function FichaPdf() {
    const navigate = useNavigate();

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', mt: 3, p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.light', width: 44, height: 44, flexShrink: 0 }}>
                    <PictureAsPdfIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Constancias y reportes en PDF</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Desde el expediente puedes generar la ficha personal y otras constancias en formato PDF. Usa tu navegador para imprimir o guardar el archivo.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<BadgeIcon />} onClick={() => navigate('/index/expedientes')}>
                    Ir a Expedientes
                </Button>
            </Stack>
        </Paper>
    );
}
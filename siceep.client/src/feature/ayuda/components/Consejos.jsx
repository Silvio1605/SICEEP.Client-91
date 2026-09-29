import React from 'react';
import { Paper, Box, Divider, Typography, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { consejos } from '../data/ayudaData';

export default function Consejos() {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
            <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <RefreshIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Buenas prácticas
                </Typography>
            </Box>
            <Divider sx={{ mx: 2.5, mb: 2 }} />
            <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Stack spacing={1.5}>
                    {consejos.map((c, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                            <Typography sx={{ color: 'primary.main', fontWeight: 800, lineHeight: 1.4 }} fontSize={15}>
                                {idx + 1}.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                {c}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
}
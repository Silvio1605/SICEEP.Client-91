import React from 'react';
import { Alert, Stack, Box, Typography, Chip } from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';

export default function Soporte() {
    return (
        <Alert
            severity="info"
            sx={{ borderRadius: 3, mb: 3 }}
            icon={<HelpCenterIcon />}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={1.5}>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>¿Necesitas más apoyo?</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Contacta al área de soporte del sistema para resolver dudas técnicas o de uso.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Chip icon={<EmailIcon fontSize="small" />} label="soporte@siceep.gob.ni" color="primary" variant="outlined" />
                    <Chip icon={<CallIcon fontSize="small" />} label="2255-0000" color="primary" variant="outlined" />
                </Stack>
            </Stack>
        </Alert>
    );
}
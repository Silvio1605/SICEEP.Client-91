import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
//
import TabPlazas from './../components/TabPlazas';
import TabMovimientos from './../components/TabMovimientos';

export default function GestionLaboral() {

    const [tab, setTab] = useState(0);

    const cambiarTab = (_evento, valor) => setTab(valor);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Gestión Laboral
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Cree plazas y registre los traslados (movimientos) de los empleados entre sedes
                </Typography>
            </Box>

            <Tabs value={tab} onChange={cambiarTab} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Tab icon={<WorkIcon />} iconPosition="start" label="Plazas" />
                <Tab icon={<SwapHorizIcon />} iconPosition="start" label="Movimientos" />
            </Tabs>

            {tab === 0 && <TabPlazas />}
            {tab === 1 && <TabMovimientos />}
        </Box>
    );
}
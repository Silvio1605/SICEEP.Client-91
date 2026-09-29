import React from 'react';
import { Paper, Box, Divider, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { guias } from '../data/ayudaData';

export default function GuiasRapidas() {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
            <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LightbulbIcon fontSize="small" color="warning" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Guías rápidas
                </Typography>
            </Box>
            <Divider sx={{ mx: 2.5, mb: 2 }} />
            <Box sx={{ px: 2.5, pb: 2 }}>
                {guias.map((g) => (
                    <Accordion key={g.titulo} disableGutters sx={{ '&:before': { display: 'none' }, boxShadow: 'none' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', flexShrink: 0 }}>
                                    {g.icono}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{g.titulo}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                                {g.pasos.map((paso, i) => (
                                    <Typography component="li" key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {paso}
                                    </Typography>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Paper>
    );
}
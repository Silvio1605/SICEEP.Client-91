import React from 'react';
import { Box, Paper, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ListaInstituciones({ instituciones, onEditar, onEliminar }) {
    if (instituciones.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Aún no hay instituciones registradas.
            </Typography>
        );
    }

    return (
        <Stack spacing={1}>
            {instituciones.map((i) => (
                <Paper
                    key={i.idInstitucionExterna}
                    variant="outlined"
                    sx={{ px: 1.5, py: 1, borderRadius: 2, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600}>{i.nombre}</Typography>
                        {i.descripcion && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {i.descripcion}
                            </Typography>
                        )}
                    </Box>
                    <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEditar(i)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => onEliminar(i)}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Paper>
            ))}
        </Stack>
    );
}
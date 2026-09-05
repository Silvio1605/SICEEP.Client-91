import React from 'react';
import { Card, CardContent, Typography, Checkbox, Box, Chip } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { alpha } from '@mui/material/styles';

const CardPermiso = ({ id, nombrePermiso, descripcion, checked, modificado, cambiarPermiso }) => {

    return (
        <Card
            onClick={() => cambiarPermiso(id)}
            sx={{
                height: '100%',
                borderRadius: 3,
                bgcolor: checked ? alpha('#0288d1', 0.08) : 'background.paper',
                border: checked ? '2px solid #0288d1' : '1px solid',
                borderColor: checked ? '#0288d1' : 'divider',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    borderColor: '#0288d1'
                }
            }}
        >
            <CardContent
                sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.5
                }}
            >
                <Checkbox
                    checked={checked}
                    onChange={() => cambiarPermiso(id)}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    sx={{ mt: -0.75, '& .MuiSvgIcon-root': { fontSize: 26 } }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                            {nombrePermiso}
                        </Typography>
                        {modificado && (
                            <Chip
                                icon={<EditNoteIcon />}
                                label="Sin guardar"
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.65rem' } }}
                            />
                        )}
                    </Box>

                    {descripcion && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                            {descripcion}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CardPermiso;
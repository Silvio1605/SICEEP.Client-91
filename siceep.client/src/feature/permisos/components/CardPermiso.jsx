import React from 'react';
import { Card, CardContent, Typography, Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alpha } from '@mui/material/styles';
import { Grid } from "@mui/material";

const CardPermiso = ({ id, nombrePermiso, descripcion, checked, cambiarPermiso }) => {
    

    return (
        <Card
            onClick={() => cambiarPermiso(id)}
            sx={{
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
            <CardContent sx={{ px: 2, py: 1.5 }}>
                <Grid container alignItems="center">

                    {/* Texto */}
                    <Grid size={{ xs: 10 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            color="text.primary"
                        >
                            {nombrePermiso}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.3 }}
                        >
                            {descripcion}
                        </Typography>
                    </Grid>

                    {/* Checkbox */}
                    <Grid
                        size={{ xs: 2 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Checkbox
                            checked={checked}
                            onChange={() => cambiarPermiso(id)}
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            sx={{
                                transform: 'scale(1.3)',
                            }}
                        />
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    );
};

export default CardPermiso;

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
                p: 0,
                m: 1,
                bgcolor: checked
                    ? alpha('#0288d1', 0.12)
                    : 'background.paper',
                border: checked ? '2px solid  #0288d1' : '1px solid',
                borderColor: checked ? '#0288d1' : 'divider',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
            }}
        >
            <CardContent sx={{ p: 1 }}>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 10, md: 10 }}>
                        <Typography variant="subtitle2" color="text.primary">
                            {nombrePermiso}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {descripcion}
                        </Typography>
                    </Grid>
                    <Grid
                        size={{ xs: 2, md: 2 }}
                        container
                        justifyContent="center"
                        alignItems="center">

                        <Checkbox
                            sx={{ transform: 'scale(1.5)' }}
                            checked={checked}
                            onChange={() => cambiarPermiso(id)}
                            onClick={(e) => e.stopPropagation()} // evita que el clic doble dispare dos veces
                            color="primary"
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                        />
                    </Grid>
                </Grid>
                
            </CardContent>
        </Card>
    );
};

export default CardPermiso;

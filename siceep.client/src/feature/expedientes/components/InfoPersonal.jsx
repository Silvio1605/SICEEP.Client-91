import React from 'react';
import { Box, Typography, Paper, Avatar, Divider, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';


// Componente auxiliar para que los campos se vean limpios y uniformes
const CampoInfo = ({ etiqueta, valor }) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            {etiqueta.toUpperCase()}
        </Typography>
        <Typography variant="body1" color="text.primary">
            {valor || 'NO DISPONIBLE'}
        </Typography>
    </Box>
);


export default function InfoPersonal({ data }) {

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>

                {/* Encabezado de Identificación para Impresión */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {data?.nombreCompleto || 'NOMBRE NO DISPONIBLE'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ficha General del Funcionario Civil - Información Personal
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {/* Primera Columna */}
                    <Grid item xs={12} sm={6}>
                        <CampoInfo etiqueta="Cédula" valor={data?.cedula} />
                        <CampoInfo etiqueta="Lugar de Nacimiento" valor={data?.lugarNacimiento} />
                        <CampoInfo etiqueta="Edad" valor={data?.edad ? `${data.edad} AÑOS` : null} />
                    </Grid>

                    {/* Segunda Columna */}
                    <Grid item xs={12} sm={6}>
                        <CampoInfo etiqueta="Estado Civil" valor={data?.estadoCivil} />
                        <CampoInfo etiqueta="Sexo" valor={"MASCULINO"} />
                    </Grid>

                    {/* Fila Completa para la Dirección */}
                    <Grid item xs={12}>
                        <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                            <CampoInfo etiqueta="Dirección Domiciliar" valor={data?.direccion} />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
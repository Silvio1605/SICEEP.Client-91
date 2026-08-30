import React from 'react';
import { Box, Typography, Paper, Avatar, Divider, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {
    nombreCompletoPersona,
    formatearFechaLegible,
    calcularEdad,
    nombreSexo,
    nombreEstadoCivil,
} from '../../utils/expedienteMappers';

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

const Seccion = ({ titulo, icono, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {icono}
            {titulo}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
    </Box>
);

export default function InfoPersonal({ data }) {
    const persona = data?.persona || {};
    const caracteristicas = data?.caracteristicasFisicas || {};
    const contacto = data?.contactoEmergencia || {};

    const edad = calcularEdad(persona.fechaNacimiento);

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>

                {/* Encabezado de Identificación para Impresión */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ficha General del Funcionario Civil - Información Personal
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Información Personal */}
                <Seccion titulo="Identificación del Funcionario">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Cédula" valor={persona.cedula} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Primer Nombre" valor={persona.pnombre} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Segundo Nombre" valor={persona.snombre} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Primer Apellido" valor={persona.papellido} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Segundo Apellido" valor={persona.sapellido} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Sexo" valor={nombreSexo(persona.sexo)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Fecha de Nacimiento" valor={formatearFechaLegible(persona.fechaNacimiento)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Edad" valor={edad !== null ? `${edad} AÑOS` : null} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CampoInfo etiqueta="Estado Civil" valor={nombreEstadoCivil(persona.idEstadoCivil)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <CampoInfo etiqueta="Lugar de Nacimiento" valor={persona.lugarNacimiento} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <CampoInfo etiqueta="Celular" valor={persona.celular} />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                                <CampoInfo etiqueta="Dirección Domiciliar" valor={persona.direccion} />
                            </Box>
                        </Grid>
                    </Grid>
                </Seccion>

                {/* Características Físicas */}
                {data?.caracteristicasFisicas ? (
                    <Seccion titulo="Características Físicas">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <CampoInfo etiqueta="Estatura" valor={caracteristicas.estatura ? `${caracteristicas.estatura} m` : null} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <CampoInfo etiqueta="Peso" valor={caracteristicas.peso ? `${caracteristicas.peso} lbs` : null} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <CampoInfo etiqueta="Tono de Piel" valor={caracteristicas.tonoPiel} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <CampoInfo etiqueta="Color de Ojos" valor={caracteristicas.colorOjos} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <CampoInfo etiqueta="Color de Cabello" valor={caracteristicas.colorCabello} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <CampoInfo etiqueta="Tipo de Cabello" valor={caracteristicas.tipoCabello} />
                            </Grid>
                        </Grid>
                    </Seccion>
                ) : (
                    <Seccion titulo="Características Físicas">
                        <Typography variant="body2" color="text.secondary">No registrado.</Typography>
                    </Seccion>
                )}

                {/* Contacto de Emergencia */}
                <Seccion titulo="Contacto de Emergencia">
                    {data?.contactoEmergencia ? (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <CampoInfo etiqueta="Nombre" valor={contacto.nombreContacto} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <CampoInfo etiqueta="Parentesco" valor={contacto.parentesco} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <CampoInfo etiqueta="Teléfono / Celular" valor={contacto.telefono} />
                            </Grid>
                            {contacto.referencia && (
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Referencia" valor={contacto.referencia} />
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">No registrado.</Typography>
                        </Grid>
                    )}
                </Seccion>

            </Paper>
        </Box>
    );
}
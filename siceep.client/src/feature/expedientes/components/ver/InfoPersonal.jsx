import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Divider, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {
    nombreCompletoPersona,
    formatearFechaLegible,
    calcularEdad,
    nombreSexo,
    nombreEstadoCivil,
} from '../../utils/expedienteMappers';
import { descargarDocumento } from '../../services/expedienteService';

// Tipo de documento FOTO_PERFIL = 1
const TIPO_FOTO_PERFIL = 1;

// Colores del estado funcional para las píldoras de la tarjeta de presentación
const ESTADO_PILL = {
    1: { label: 'De baja', bg: 'rgba(211,47,47,0.92)' },
    2: { label: 'Activo', bg: 'rgba(46,125,50,0.92)' },
    3: { label: 'Com/Servicio', bg: 'rgba(237,108,2,0.92)' },
};

// Píldora (badge) translúcida sobre el fondo degradado de la cabecera
const Pill = ({ children, bg }) => (
    <Box component="span" sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.2,
        py: 0.45,
        borderRadius: 999,
        bgcolor: bg || 'rgba(255,255,255,0.18)',
        color: '#fff',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: 0.2,
    }}>
        {children}
    </Box>
);

// Componente auxiliar para que los campos se vean limpios y uniformes
const CampoInfo = ({ etiqueta, valor, destacado = false }) => (
    <Box sx={{
        height: '100%',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: destacado ? 'primary.main' : 'divider',
        bgcolor: destacado ? 'rgba(46,116,181,0.08)' : '#fafafa',
        p: 1.5,
    }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, letterSpacing: 0.3 }}>
            {etiqueta.toUpperCase()}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: destacado ? 'bold' : 600 }}>
            {valor || 'NO DISPONIBLE'}
        </Typography>
    </Box>
);

// Subtítulo de agrupación dentro de una sección
const SubSeccion = ({ titulo, children }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.78rem',
            letterSpacing: 0.5,
            mb: 1.5,
        }}>
            {titulo}
        </Typography>
        {children}
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

    // Fotografía del funcionario (FOTO_PERFIL más reciente)
    const [fotoSrc, setFotoSrc] = useState(null);

    const fotoId = (data?.documentos || [])
        .filter((d) => d.idTipoDocumento === TIPO_FOTO_PERFIL)
        .sort((a, b) => (b.idDocumento ?? 0) - (a.idDocumento ?? 0))[0]?.idDocumento ?? null;

    useEffect(() => {
        let activo = true;
        let urlObjeto = null;

        if (!fotoId) return undefined;

        descargarDocumento(fotoId)
            .then((res) => {
                if (!activo) return;
                urlObjeto = URL.createObjectURL(res.data);
                setFotoSrc(urlObjeto);
            })
            .catch(() => {
                if (activo) setFotoSrc(null);
            });

        return () => {
            activo = false;
            if (urlObjeto) URL.revokeObjectURL(urlObjeto);
        };
    }, [fotoId]);

    const edad = calcularEdad(persona.fechaNacimiento);

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>

                {/* Cabecera destacada: fotografía e información resumida del funcionario */}
                <Box sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1f3864 0%, #2e74b5 100%)',
                    p: 3,
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 3,
                }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            width: 108,
                            height: 128,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            border: '3px solid #fff',
                            boxShadow: 3,
                        }}
                    >
                        {fotoId && fotoSrc ? (
                            <img src={fotoSrc} alt="Fotografía del funcionario" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <PersonIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.9)' }} />
                        )}
                    </Avatar>

                    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' }, minWidth: 0 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>
                            {nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
                            Ficha General del Funcionario Civil - Información Personal
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Pill>Cédula: {persona.cedula || 'S/D'}</Pill>
                            <Pill>Sexo: {nombreSexo(persona.sexo)}</Pill>
                            <Pill>Edad: {edad !== null ? `${edad} años` : 'S/D'}</Pill>
                            <Pill>Estado Civil: {nombreEstadoCivil(persona.idEstadoCivil)}</Pill>
                            {data?.idEstado && (
                                <Pill bg={ESTADO_PILL[data.idEstado]?.bg}>
                                    Estado: {ESTADO_PILL[data.idEstado]?.label || data.desEstado || 'S/D'}
                                </Pill>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Información Personal */}
                <Seccion titulo="Identificación del Funcionario">
                    <SubSeccion titulo="Datos de Identidad">
                        <Grid container spacing={2}>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Cédula" valor={persona.cedula} destacado />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Nombre Completo" valor={nombreCompletoPersona(persona)} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Sexo" valor={nombreSexo(persona.sexo)} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Fecha de Nacimiento" valor={formatearFechaLegible(persona.fechaNacimiento)} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Edad" valor={edad !== null ? `${edad} AÑOS` : null} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Estado Civil" valor={nombreEstadoCivil(persona.idEstadoCivil)} />
                            </Grid>
                        </Grid>
                    </SubSeccion>

                    <SubSeccion titulo="Origen y Contacto">
                        <Grid container spacing={2}>
                            <Grid size={{  xs: 12, sm: 6  }}>
                                <CampoInfo etiqueta="Lugar de Nacimiento" valor={persona.lugarNacimiento} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6  }}>
                                <CampoInfo etiqueta="Celular" valor={persona.celular} />
                            </Grid>
                            <Grid size={{  xs: 12  }}>
                                <CampoInfo etiqueta="Dirección Domiciliar" valor={persona.direccion} />
                            </Grid>
                        </Grid>
                    </SubSeccion>
                </Seccion>

                {/* Características Físicas */}
                {data?.caracteristicasFisicas ? (
                    <Seccion titulo="Características Físicas">
                        <SubSeccion titulo="Medidas y Complexión">
                            <Grid container spacing={2}>
                                <Grid size={{  xs: 12, sm: 6, md: 6  }}>
                                    <CampoInfo etiqueta="Estatura" valor={caracteristicas.estatura ? `${caracteristicas.estatura} m` : null} />
                                </Grid>
                                <Grid size={{  xs: 12, sm: 6, md: 6  }}>
                                    <CampoInfo etiqueta="Peso" valor={caracteristicas.peso ? `${caracteristicas.peso} lbs` : null} />
                                </Grid>
                            </Grid>
                        </SubSeccion>
                        <SubSeccion titulo="Rasgos">
                            <Grid container spacing={2}>
                                <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                    <CampoInfo etiqueta="Tono de Piel" valor={caracteristicas.tonoPiel} />
                                </Grid>
                                <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                    <CampoInfo etiqueta="Color de Ojos" valor={caracteristicas.colorOjos} />
                                </Grid>
                                <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                    <CampoInfo etiqueta="Color de Cabello" valor={caracteristicas.colorCabello} />
                                </Grid>
                                <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                    <CampoInfo etiqueta="Tipo de Cabello" valor={caracteristicas.tipoCabello} />
                                </Grid>
                            </Grid>
                        </SubSeccion>
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
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Nombre" valor={contacto.nombreContacto} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Parentesco" valor={contacto.parentesco} />
                            </Grid>
                            <Grid size={{  xs: 12, sm: 6, md: 4  }}>
                                <CampoInfo etiqueta="Teléfono / Celular" valor={contacto.telefono} />
                            </Grid>
                            {contacto.referencia && (
                                <Grid size={{  xs: 12  }}>
                                    <CampoInfo etiqueta="Referencia" valor={contacto.referencia} />
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Grid size={{  xs: 12  }}>
                            <Typography variant="body2" color="text.secondary">No registrado.</Typography>
                        </Grid>
                    )}
                </Seccion>

            </Paper>
        </Box>
    );
}
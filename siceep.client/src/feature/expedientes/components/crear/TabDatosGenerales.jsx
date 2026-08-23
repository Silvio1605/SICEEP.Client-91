import React, { useEffect, useContext } from 'react';
import { Box, Grid, TextField, Typography, Paper, MenuItem, Divider } from '@mui/material';
import { useSelectSexo } from './../../hooks/Select/useSelectSexo'
import SelectItemB from './../../../../shared/components/select/SelectItemB'
import { useSelectEstadoCivil } from './../../hooks/Select/useSelectEstadoCivil'

import { ExpedienteContext } from './../../context/ExpedienteContext';

export default function TabDatosGenerales() {

    const { selECivil, loadingEC } = useSelectEstadoCivil();
    const { selSexo, loadingS } = useSelectSexo();

    // Obtener el contexto del expediente
    const { expediente, actualizarCampo, actualizarSeccion } = useContext(ExpedienteContext);


    useEffect(() => {
        if (!expediente.persona) {
            // Si la sección está vacía, la creamos con valores predeterminados
            actualizarSeccion('persona', {
                pnombre: '',
                snombre: '',
                papellido: '',
                sapellido: '',
                fechaNacimiento: null,
                sexo: selSexo?.id || 'M',
                estadoCivil: selECivil?.id || 1
            });
        }

    }, [selSexo, selECivil, expediente.persona, actualizarSeccion]);

    // Manejador para cambios en campos simples (estatura, peso)
    const handleChangeSimple = (campo, valor) => {
        actualizarCampo('persona', campo, valor);
    };

    // Manejador para cambios en selects (usando SelectItemB)
    const handleSelectChange = (campo, valor) => {
        actualizarCampo('persona', campo, valor);
    };

    const persona = expediente.persona || {};

    return (

        <Box>
            {/* Se eliminó por completo la sección de Identificación Corporativa */}
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información Personal
            </Typography>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    {/* Área de Fotografía (Columna Izquierda) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: '220px',
                                border: '1px dashed #c4c4c4',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Área de Fotografía
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Campos de Datos (Columna Derecha) */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Primer Nombre"
                                    value={persona.pnombre || ''}
                                    onChange={(e) => handleChangeSimple('pnombre', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Segundo Nombre"
                                    value={persona.snombre || ''}
                                    onChange={(e) => handleChangeSimple('snombre', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Primer Apellido"
                                    value={persona.papellido || ''}
                                    onChange={(e) => handleChangeSimple('papellido', e.target.value)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Segundo Apellido"
                                    value={persona.sapellido || ''}
                                    onChange={(e) => handleChangeSimple('sapellido', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="N° Cédula"
                                    value={persona.cedula || ''}
                                    onChange={(e) => handleChangeSimple('cedula', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {loadingS ? (
                                    <p>Cargando...</p>
                                ) : (
                                    <Box>
                                        <SelectItemB
                                            value={persona.sexo || 'M'}
                                            onChange={(value) => handleSelectChange('sexo', value)}
                                            datos={selSexo}
                                            titulo=""
                                        />
                                    </Box>
                                )}
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                {loadingEC ? (
                                    <p>Cargando...</p>
                                ) : (
                                    <Box>
                                        <SelectItemB
                                            value={persona.estadoCivil || 1}
                                            onChange={(value) => handleSelectChange('estadoCivil', value)}
                                            datos={selECivil}
                                            titulo=""
                                        />
                                    </Box>
                                )}
                            </Grid>
                            
                            <Grid size={{ xs: 12, md: 6 }}>
                                {/* Nuevo campo agregado según tu indicación */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Lugar de Nacimiento"
                                    value={persona.lugarNacimiento || ''}
                                    onChange={(e) => handleChangeSimple('lugarNacimiento', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha Nacimiento"
                                    InputLabelProps={{ shrink: true }}
                                    value={persona.fechaNacimiento || ''}
                                    onChange={(e) => handleChangeSimple('fechaNacimiento', e.target.value)}
                                />  
                            </Grid>
                            
                        </Grid>
                        {/* Contacto y Domicilio */}
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                            Domicilio 
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Dirección Domiciliar"
                                    multiline rows={3}
                                    value={persona.direccion || ''}
                                    onChange={(e) => handleChangeSimple('direccion', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} >
                               
                                <Grid size={{ xs: 12, md: 12 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Celular"
                                        value={persona.celular || ''}
                                        onChange={(e) => handleChangeSimple('fechaNacimiento', e.target.value)}
                                    />
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>

                    
                </Grid>
            </Paper>
        </Box>
    );
}
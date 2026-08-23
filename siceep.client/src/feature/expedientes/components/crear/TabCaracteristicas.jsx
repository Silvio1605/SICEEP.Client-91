import { useEffect, useContext } from 'react';
import { Box, Grid, TextField, Typography, Paper, MenuItem } from '@mui/material';
import SelectItemB from './../../../../shared/components/Select/SelectItemB';

import { ExpedienteContext } from './../../context/ExpedienteContext';
import { useSelectCaracteristicas } from '../../hooks/Select/useSelectCaracteristicas';

export default function TabCaracteristicas() {
    const { selCaracteristicas, loadingCaracteristicas } = useSelectCaracteristicas();

    // Obtener el contexto del expediente
    const { expediente, actualizarCampo, actualizarSeccion } = useContext(ExpedienteContext);

    // Si no hay datos en el contexto, inicializar la sección con valores por defecto
    useEffect(() => {
        if (!expediente.caracteristicasFisicas) {
            // Si la sección está vacía, la creamos con valores predeterminados
            actualizarSeccion('caracteristicasFisicas', {
                estatura: 0,
                peso: 0,
                tonoPiel: selCaracteristicas?.TonoPiel?.[0]?.id || 'BLANCO',
                colorOjos: selCaracteristicas?.ColorOjos?.[0]?.id || 'NEGRO',
                colorCabello: selCaracteristicas?.ColorCabello?.[0]?.id || 'NEGRO',
                tipoCabello: selCaracteristicas?.TiposCabello?.[0]?.id || 'LACIO',
                tipoSangre: selCaracteristicas?.TipoSangre?.[0]?.id || 'NR'
            });
        }
    }, [selCaracteristicas, expediente.caracteristicasFisicas, actualizarSeccion]);

    // Si el expediente ya tiene caracteristicasFisicas, pero no tiene algunos campos,
    // podrías actualizarlos con valores por defecto (opcional)

    // Manejador para cambios en campos simples (estatura, peso)
    const handleChangeSimple = (campo, valor) => {
        actualizarCampo('caracteristicasFisicas', campo, valor);
    };

    // Manejador para cambios en selects (usando SelectItemB)
    const handleSelectChange = (campo, valor) => {
        actualizarCampo('caracteristicasFisicas', campo, valor);
    };

    // Manejador para cambios en contacto de emergencia
    const handleContactoChange = (campo, valor) => {
        actualizarCampo('contactoEmergencia', campo, valor);
    };

    // Obtener el objeto actual de características físicas (con valores por defecto si es null)
    const caracteristicas = expediente.caracteristicasFisicas || {};
    const contacto = expediente.contactoEmergencia || {};

    return (
        <Box>
            {/* Características Físicas */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Características Físicas
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Estatura */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Estatura (metros)"
                            type="number"
                            value={caracteristicas.estatura || ''}
                            onChange={(e) => handleChangeSimple('estatura', parseFloat(e.target.value) || 0)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Peso */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Peso (Libras)"
                            type="number"
                            value={caracteristicas.peso || ''}
                            onChange={(e) => handleChangeSimple('peso', parseFloat(e.target.value) || 0)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Tipo de Sangre */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        {loadingCaracteristicas ? (
                            <p>Cargando...</p>
                        ) : (
                            <SelectItemB
                                value={caracteristicas.tipoSangre || 'NR'}
                                onChange={(value) => handleSelectChange('tipoSangre', value)}
                                datos={selCaracteristicas?.TipoSangre || []}
                                titulo="TIPO DE SANGRE"
                            />
                        )}
                    </Grid>

                    {/* Tono de Piel */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        {loadingCaracteristicas ? (
                            <p>Cargando...</p>
                        ) : (
                            <SelectItemB
                                value={caracteristicas.tonoPiel || 'BLANCO'}
                                onChange={(value) => handleSelectChange('tonoPiel', value)}
                                datos={selCaracteristicas?.TonoPiel || []}
                                titulo="TONO DE PIEL"
                            />
                        )}
                    </Grid>

                    {/* Color de Ojos */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        {loadingCaracteristicas ? (
                            <p>Cargando...</p>
                        ) : (
                            <SelectItemB
                                value={caracteristicas.colorOjos || 'NEGRO'}
                                onChange={(value) => handleSelectChange('colorOjos', value)}
                                datos={selCaracteristicas?.ColorOjos || []}
                                titulo="COLOR DE OJOS"
                            />
                        )}
                    </Grid>

                    {/* Color de Cabello */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        {loadingCaracteristicas ? (
                            <p>Cargando...</p>
                        ) : (
                            <SelectItemB
                                value={caracteristicas.colorCabello || 'NEGRO'}
                                onChange={(value) => handleSelectChange('colorCabello', value)}
                                datos={selCaracteristicas?.ColorCabello || []}
                                titulo="COLOR DE CABELLO"
                            />
                        )}
                    </Grid>

                    {/* Tipo de Cabello */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        {loadingCaracteristicas ? (
                            <p>Cargando...</p>
                        ) : (
                            <SelectItemB
                                value={caracteristicas.tipoCabello || 'LACIO'}
                                onChange={(value) => handleSelectChange('tipoCabello', value)}
                                datos={selCaracteristicas?.TiposCabello || []}
                                titulo="TIPO DE CABELLO"
                            />
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Contacto de Emergencia */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Contacto de Emergencia
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #ffcdd2', backgroundColor: '#fff5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="error" fontWeight="bold" sx={{ mb: 2 }}>
                    En caso de emergencia contactar a:
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nombre Completo"
                            value={contacto.nombreContacto || ''}
                            onChange={(e) => handleContactoChange('nombreContacto', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Parentesco"
                            value={contacto.parentesco || ''}
                            onChange={(e) => handleContactoChange('parentesco', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Teléfono / Celular"
                            value={contacto.telefono || ''}
                            onChange={(e) => handleContactoChange('telefono', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Dirección"
                            value={contacto.direccion || ''}
                            onChange={(e) => handleContactoChange('direccion', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
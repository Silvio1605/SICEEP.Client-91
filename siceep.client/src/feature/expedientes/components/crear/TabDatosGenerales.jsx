import React, { useEffect, useContext, useState } from 'react';
import { Box, Grid, TextField, Typography, Paper, MenuItem, Divider, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useSelectSexo } from './../../hooks/Select/useSelectSexo'
import SelectItemB from './../../../../shared/components/select/SelectItemB'
import { useSelectEstadoCivil } from './../../hooks/Select/useSelectEstadoCivil'

import { ExpedienteContext } from './../../context/ExpedienteContext';
import { esCedulaValida, validarFechaNacimiento } from './../../utils/validacionExpediente';
import { subirDocumento, descargarDocumento } from '../../services/expedienteService';

// Tipo de documento FOTO_PERFIL = 1
const TIPO_FOTO_PERFIL = 1;

export default function TabDatosGenerales() {

    const { selECivil, loadingEC } = useSelectEstadoCivil();
    const { selSexo, loadingS } = useSelectSexo();

    // Obtener el contexto del expediente
    const { expediente, actualizarCampo, actualizarSeccion } = useContext(ExpedienteContext);

    // Fotografía del funcionario
    const [fotoSubida, setFotoSubida] = useState(null);
    const [fotoSrc, setFotoSrc] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [aviso, setAviso] = useState({ open: false, mensaje: '', severidad: 'success' });

    const idExpediente = expediente?.idExpediente;

    // Foto FOTO_PERFIL más reciente ya guardada en el expediente
    const fotoGuardada = (expediente?.documentos || [])
        .filter((d) => d.idTipoDocumento === TIPO_FOTO_PERFIL)
        .sort((a, b) => (b.idDocumento ?? 0) - (a.idDocumento ?? 0))[0]?.idDocumento ?? null;

    const fotoId = fotoSubida ?? fotoGuardada;

    // Carga la imagen real (blob autenticado) para poder mostrarla
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

    const manejarFoto = async (event) => {
        const archivo = event.target.files?.[0];
        event.target.value = '';
        if (!archivo || !idExpediente) return;

        setSubiendo(true);
        try {
            const { data } = await subirDocumento(idExpediente, { idTipoDocumento: TIPO_FOTO_PERFIL }, archivo);
            setFotoSubida(data.idDocumento);
            setAviso({ open: true, mensaje: 'Fotografía guardada en el expediente.', severidad: 'success' });
        } catch (err) {
            setAviso({
                open: true,
                mensaje: err?.response?.data?.message || err?.message || 'No se pudo subir la fotografía.',
                severidad: 'error',
            });
        } finally {
            setSubiendo(false);
        }
    };

    const cerrarAviso = () => setAviso((prev) => ({ ...prev, open: false }));

    useEffect(() => {
        if (!expediente.persona) {
            // Si la sección está vacía, la creamos con valores predeterminados
            actualizarSeccion('persona', {
                pnombre: '',
                snombre: '',
                papellido: '',
                sapellido: '',
                fechaNacimiento: null,
                direccion: null,
                celular: null,
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

    // Indicadores de calidad de datos (se muestran al salir del campo o si ya hay un valor)
    const [cedulaTocada, setCedulaTocada] = useState(false);
    const errorCedula = persona.cedula && String(persona.cedula).trim() && !esCedulaValida(persona.cedula);
    const errorFechaNacimiento = persona.fechaNacimiento && !validarFechaNacimiento(persona.fechaNacimiento).valida;

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
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '260px' }}>
                            <Box
                                sx={{
                                    flex: 1,
                                    width: '100%',
                                    minHeight: '220px',
                                    border: '1px dashed #c4c4c4',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    backgroundColor: '#fafafa'
                                }}
                            >
                                {fotoId && fotoSrc ? (
                                    <img
                                        src={fotoSrc}
                                        alt="Fotografía del funcionario"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        {subiendo ? 'Subiendo...' : 'Área de Fotografía'}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    size="small"
                                    startIcon={subiendo ? <CircularProgress size={16} color="inherit" /> : <PhotoCameraIcon />}
                                    disabled={!idExpediente || subiendo}
                                >
                                    {subiendo ? 'Subiendo...' : 'Subir Fotografía'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/jpeg,image/png"
                                        onChange={manejarFoto}
                                    />
                                </Button>
                                <Typography variant="caption" color="text.secondary" align="center">
                                    {idExpediente
                                        ? 'Formato JPG o PNG. Se guarda al instante en el expediente.'
                                        : 'Guarde primero el expediente para poder subir la fotografía.'}
                                </Typography>
                            </Box>
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
                                    onBlur={() => setCedulaTocada(true)}
                                    error={(cedulaTocada || errorCedula) && errorCedula}
                                    helperText={(cedulaTocada || errorCedula) && errorCedula
                                        ? 'Cédula inválida. Formato: 000-000000-0000 con letra correcta.'
                                        : ''}
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
                                    error={Boolean(errorFechaNacimiento)}
                                    helperText={errorFechaNacimiento
                                        ? validarFechaNacimiento(persona.fechaNacimiento).mensaje
                                        : ''}
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
                                        onChange={(e) => handleChangeSimple('celular', e.target.value)}
                                    />
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>

                    
                </Grid>
            </Paper>

            <Snackbar
                open={aviso.open}
                autoHideDuration={5000}
                onClose={cerrarAviso}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={cerrarAviso} severity={aviso.severidad} variant="filled" sx={{ width: '100%' }}>
                    {aviso.mensaje}
                </Alert>
            </Snackbar>
        </Box>
    );
}
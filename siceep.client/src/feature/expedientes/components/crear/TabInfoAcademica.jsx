import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Paper, Divider, MenuItem,
    Button, CircularProgress, Alert, Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
    getEstudios,
    guardarEstudios,
    getNivelesEstudios,
    getInstitucionesEstudios,
    getModalidadesEstudios,
    subirDocumentoEstudio
} from '../../services/expedienteService';

// Tipo de documento DIPLOMA (documento de soporte del estudio)
const TIPO_DOCUMENTO_DIPLOMA = 4;

const SUBSISTEMA_BASICA = 'Educacion Basica y Media';

const seccionVacia = () => ({
    idNivelEducativo: '',
    idInstitucion: '',
    idModalidad: '',
    fechaInicio: '',
    fechaFin: '',
});

export default function TabInfoAcademica({ idPersona, alGuardar }) {
    const [niveles, setNiveles] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    const [modalidades, setModalidades] = useState([]);

    const [profesional, setProfesional] = useState({ ...seccionVacia(), titulo: '' });
    const [basica, setBasica] = useState({ ...seccionVacia() });

    const [archivoProfesional, setArchivoProfesional] = useState(null);
    const [archivoBasica, setArchivoBasica] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [aviso, setAviso] = useState({ open: false, mensaje: '', severidad: 'success' });

    const cambiarCampo = (seccion) => (campo) => (event) => {
        const valor = event.target.value;

        if (seccion === 'profesional') {
            setProfesional((prev) => ({ ...prev, [campo]: valor }));
        } else {
            setBasica((prev) => ({ ...prev, [campo]: valor }));
        }
    };

    // Niveles que corresponden a cada sección:
    // - Básica: subsistema "Educación Básica y Media"
    // - Profesional: los demás (técnico, superior, posgrado)
    const nivelesBasica = niveles.filter((n) => n.subsistema === SUBSISTEMA_BASICA);
    const nivelesProfesional = niveles.filter((n) => n.subsistema !== SUBSISTEMA_BASICA);

    // Carga los catalogos y, si hay persona, los estudios ya guardados
    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            try {
                const [nivelesResponse, institucionesResponse, modalidadesResponse, estudiosResponse] = await Promise.all([
                    getNivelesEstudios(),
                    getInstitucionesEstudios(),
                    getModalidadesEstudios(),
                    idPersona ? getEstudios(idPersona).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
                ]);
                if (!activo) return;

                setNiveles(nivelesResponse.data || []);
                setInstituciones(institucionesResponse.data || []);
                setModalidades(modalidadesResponse.data || []);

                const estudios = estudiosResponse.data || [];
                const estProf = estudios.find((e) => e.seccion === 'PROFESIONAL');
                const estBas = estudios.find((e) => e.seccion === 'BASICA');

                setProfesional({
                    idNivelEducativo: estProf?.idNivelEducativo ?? '',
                    idInstitucion: estProf?.idInstitucion ?? '',
                    idModalidad: estProf?.idModalidad ?? '',
                    fechaInicio: estProf?.fechaInicio ?? '',
                    fechaFin: estProf?.fechaFin ?? '',
                    titulo: estProf?.tituloObtenido || '',
                });
                setBasica({
                    idNivelEducativo: estBas?.idNivelEducativo ?? '',
                    idInstitucion: estBas?.idInstitucion ?? '',
                    idModalidad: estBas?.idModalidad ?? '',
                    fechaInicio: estBas?.fechaInicio ?? '',
                    fechaFin: estBas?.fechaFin ?? '',
                });
            } catch {
                if (activo) setAviso({ open: true, mensaje: 'No se pudieron cargar los catálogos académicos.', severidad: 'error' });
            } finally {
                if (activo) setCargando(false);
            }
        };

        cargar();
        return () => { activo = false; };
    }, [idPersona]);

const guardar = useCallback(async () => {
        if (!idPersona) return;

        const construirEstudio = (seccion, extra = {}) => {
            if (!seccion.idNivelEducativo || !seccion.idInstitucion) return null;

            const nivel = niveles.find((n) => String(n.idNivelEducativo) === String(seccion.idNivelEducativo));
            return {
                idPersona: Number(idPersona),
                idNivelEducativo: Number(seccion.idNivelEducativo),
                idInstitucion: Number(seccion.idInstitucion),
                idModalidad: seccion.idModalidad ? Number(seccion.idModalidad) : null,
                tituloObtenido: extra.titulo?.trim() || (extra.basica ? 'EDUCACIÓN BÁSICA' : nivel?.nombreNivel || ''),
                especialidad: null,
                fechaInicio: seccion.fechaInicio || null,
                fechaFin: seccion.fechaFin || null,
                esGraduado: false,
                ...extra,
            };
        };

        const estudios = [];
        const estProf = construirEstudio(profesional, { titulo: profesional.titulo, seccion: 'PROFESIONAL' });
        const estBas = construirEstudio(basica, { basica: true, seccion: 'BASICA' });
        if (estProf) estudios.push(estProf);
        if (estBas) estudios.push(estBas);

        if (estudios.length === 0) {
            setAviso({
                open: true,
                mensaje: 'Debe registrar al menos el nivel educativo y la institución de una sección.',
                severidad: 'warning',
            });
            return;
        }

        setGuardando(true);
        try {
            // 1) Guardar/actualizar los estudios
            const { data: guardados } = await guardarEstudios(idPersona, estudios);

            // 2) Anexar los documentos de soporte por secciÃ³n
            const guardadoProf = guardados.find((e) => e.seccion === 'PROFESIONAL');
            const guardadoBas = guardados.find((e) => e.seccion === 'BASICA');

            if (guardadoProf?.idEstudio && archivoProfesional) {
                await subirDocumentoEstudio(guardadoProf.idEstudio, TIPO_DOCUMENTO_DIPLOMA, archivoProfesional);
            }
            if (guardadoBas?.idEstudio && archivoBasica) {
                await subirDocumentoEstudio(guardadoBas.idEstudio, TIPO_DOCUMENTO_DIPLOMA, archivoBasica);
            }

            setAviso({ open: true, mensaje: 'Información académica guardada exitosamente.', severidad: 'success' });
            if (typeof alGuardar === 'function') alGuardar();
        } catch (err) {
            const mensaje = err?.response?.data?.message || err?.response?.data ||
                (typeof err?.response?.data === 'string' ? err.response.data : err?.message) ||
                'No se pudo guardar la información académica.';
            setAviso({ open: true, mensaje, severidad: 'error' });
        } finally {
            setGuardando(false);
        }
    }, [idPersona, profesional, basica, niveles, archivoProfesional, archivoBasica, alGuardar]);

    const cerrarAviso = () => setAviso((prev) => ({ ...prev, open: false }));

    if (!idPersona) {
        return (
            <Box>
                <Alert severity="info" variant="outlined">
                    Debe guardar primero el expediente para poder registrar la informaciÃ³n acadÃ©mica.
                </Alert>
            </Box>
        );
    }

    const renderSelectNivel = (seccion, opciones, etiqueta) => (
        <TextField
            select
            fullWidth
            size="small"
            label={`${etiqueta} *`}
            value={seccion.idNivelEducativo}
            onChange={cambiarCampo(seccion === profesional ? 'profesional' : 'basica')('idNivelEducativo')}
        >
            <MenuItem value="">Seleccione...</MenuItem>
            {opciones.map((n) => (
                <MenuItem key={n.idNivelEducativo} value={n.idNivelEducativo}>
                    {n.nombreNivel}
                </MenuItem>
            ))}
        </TextField>
    );

    const renderSelect = (seccion, campo, opciones, etiqueta, extra = {}) => (
        <TextField
            select
            fullWidth
            size="small"
            label={etiqueta}
            value={seccion[campo]}
            onChange={cambiarCampo(seccion === profesional ? 'profesional' : 'basica')(campo)}
            {...extra}
        >
            <MenuItem value="">{(extra.required ? 'Seleccione...' : 'Ninguna')}</MenuItem>
            {opciones.map((op) => (
                <MenuItem key={op.id} value={op.id}>
                    {op.nombre}
                </MenuItem>
            ))}
        </TextField>
    );

    const renderCampoDocumento = (archivo, setArchivo) => (
        <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Documento de soporte (opcional)
            </Typography>
            <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<AttachFileIcon />}
                sx={{ textTransform: 'none' }}
            >
                {archivo ? archivo.name : 'Adjuntar archivo'}
                <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                />
            </Button>
            {archivo && (
                <Typography variant="caption" color="success.main" display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                    <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> Archivo listo para cargarse.
                </Typography>
            )}
        </Box>
    );

    return (
        <Box>
            {cargando && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={30} />
                </Box>
            )}

            {!cargando && (
                <>
                    <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                        La información académica se guarda aquí con el botón “Guardar Información Académica”.
                        No usa el botón “Guardar Cambios” de la página; al terminar puede salir sin guardar
                        los datos generales y los estudios quedarán guardados en el expediente.
                    </Alert>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                            onClick={guardar}
                            disabled={guardando}
                        >
                            {guardando ? 'Guardando...' : 'GUARDAR INFORMACIÓN ACADÉMICA'}
                        </Button>
                    </Box>

                    {/* --- SECCIÓN 1: Preparación Profesional --- */}
                    <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                        Preparación Profesional
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderSelectNivel(profesional, nivelesProfesional, 'Nivel Educativo')}
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="InstituciÃ³n *"
                                    value={profesional.idInstitucion}
                                    onChange={cambiarCampo('profesional')('idInstitucion')}
                                >
                                    <MenuItem value="">Seleccione...</MenuItem>
                                    {instituciones.map((i) => (
                                        <MenuItem key={i.idInstitucion} value={i.idInstitucion}>
                                            {i.nombre}{i.siglas ? ` (${i.siglas})` : ''}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderSelect(profesional, 'idModalidad', modalidades, 'Modalidad')}
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Carrera o Título"
                                    placeholder="Ej: Ingeniería en Computación"
                                    value={profesional.titulo}
                                    onChange={cambiarCampo('profesional')('titulo')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha de inicio"
                                    InputLabelProps={{ shrink: true }}
                                    value={profesional.fechaInicio}
                                    onChange={cambiarCampo('profesional')('fechaInicio')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha de fin"
                                    InputLabelProps={{ shrink: true }}
                                    value={profesional.fechaFin}
                                    onChange={cambiarCampo('profesional')('fechaFin')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderCampoDocumento(archivoProfesional, setArchivoProfesional)}
                            </Grid>
                        </Grid>
                    </Paper>

                    <Divider sx={{ mb: 4 }} />

                    {/* --- SECCIÓN 2: Educación Básica --- */}
                    <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                        Educación Básica
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderSelectNivel(basica, nivelesBasica, 'Nivel Educativo')}
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Centro de Estudio *"
                                    value={basica.idInstitucion}
                                    onChange={cambiarCampo('basica')('idInstitucion')}
                                >
                                    <MenuItem value="">Seleccione...</MenuItem>
                                    {instituciones.map((i) => (
                                        <MenuItem key={i.idInstitucion} value={i.idInstitucion}>
                                            {i.nombre}{i.siglas ? ` (${i.siglas})` : ''}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderSelect(basica, 'idModalidad', modalidades, 'Modalidad')}
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha de inicio"
                                    InputLabelProps={{ shrink: true }}
                                    value={basica.fechaInicio}
                                    onChange={cambiarCampo('basica')('fechaInicio')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha de fin"
                                    InputLabelProps={{ shrink: true }}
                                    value={basica.fechaFin}
                                    onChange={cambiarCampo('basica')('fechaFin')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                {renderCampoDocumento(archivoBasica, setArchivoBasica)}
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            )}

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

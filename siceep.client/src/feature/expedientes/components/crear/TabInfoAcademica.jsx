import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Grid, TextField, Typography, Paper, Divider, MenuItem,
    Button, CircularProgress, Alert, Snackbar, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

// Categorías grandes que se muestran en el primer paso del selector.
// El backend deriva la categoría del Subsistema de cada nivel (BASICA/MEDIA/TECNICA/SUPERIOR/POSGRADO/CURSOS)
// y añade `requiereDocumento` (false solo para CURSOS).
const CATEGORIAS = [
    { valor: 'BASICA', etiqueta: 'Educación Básica' },
    { valor: 'MEDIA', etiqueta: 'Educación Media' },
    { valor: 'TECNICA', etiqueta: 'Educación Técnica' },
    { valor: 'SUPERIOR', etiqueta: 'Educación Superior' },
    { valor: 'POSGRADO', etiqueta: 'Posgrado' },
    { valor: 'CURSOS', etiqueta: 'Cursos y Capacitación' },
];

const formVacio = () => ({
    idEstudio: null,
    categoria: '',
    idNivelEducativo: '',
    idInstitucion: '',
    idModalidad: '',
    tituloObtenido: '',
    fechaInicio: '',
    fechaFin: '',
    documentoUrl: '',
    archivo: null,
});

export default function TabInfoAcademica({ idPersona, alGuardar }) {
    const [niveles, setNiveles] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    const [modalidades, setModalidades] = useState([]);

    const [registros, setRegistros] = useState([]);
    const contadorRef = useRef(1);

    const [formulario, setFormulario] = useState(formVacio);
    const [editandoKey, setEditandoKey] = useState(null);
    const [formAbierto, setFormAbierto] = useState(false);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [aviso, setAviso] = useState({ open: false, mensaje: '', severidad: 'success' });

    const cambiarForm = (cambios) => setFormulario((prev) => ({ ...prev, ...cambios }));

    const abrirFormNuevo = () => {
        setFormulario(formVacio());
        setEditandoKey(null);
        setFormAbierto(true);
    };

    const abrirFormEditar = (key) => {
        const registro = registros.find((r) => r.key === key);
        if (!registro) return;
        setFormulario({
            idEstudio: registro.idEstudio,
            categoria: registro.categoria,
            idNivelEducativo: registro.idNivelEducativo,
            idInstitucion: registro.idInstitucion,
            idModalidad: registro.idModalidad,
            tituloObtenido: registro.tituloObtenido,
            fechaInicio: registro.fechaInicio,
            fechaFin: registro.fechaFin,
            documentoUrl: registro.documentoUrl || '',
            archivo: null,
        });
        setEditandoKey(key);
        setFormAbierto(true);
    };

    const cancelarForm = () => {
        setFormAbierto(false);
        setEditandoKey(null);
        setFormulario(formVacio());
    };

    const aceptarForm = () => {
        if (!formulario.categoria) {
            setAviso({ open: true, mensaje: 'Debe seleccionar la categoría.', severidad: 'warning' });
            return;
        }
        if (!formulario.idNivelEducativo) {
            setAviso({ open: true, mensaje: 'Debe seleccionar el nivel.', severidad: 'warning' });
            return;
        }
        if (!formulario.idInstitucion) {
            setAviso({ open: true, mensaje: 'Debe seleccionar la institución / centro de estudio.', severidad: 'warning' });
            return;
        }

        if (editandoKey === null) {
            const nuevo = { key: contadorRef.current++, ...formulario };
            setRegistros((prev) => [...prev, nuevo]);
        } else {
            setRegistros((prev) => prev.map((r) => (r.key === editandoKey ? { ...r, ...formulario } : r)));
        }

        cancelarForm();
    };

    const eliminarRegistro = (key) => {
        setRegistros((prev) => prev.filter((r) => r.key !== key));
    };

    // Carga los catálogos y, si hay persona, los estudios ya guardados
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
                if (estudios.length > 0) {
                    setRegistros(estudios.map((e) => ({
                        key: contadorRef.current++,
                        idEstudio: e.idEstudio ?? null,
                        categoria: e.categoria || '',
                        idNivelEducativo: e.idNivelEducativo ?? '',
                        idInstitucion: e.idInstitucion ?? '',
                        idModalidad: e.idModalidad ?? '',
                        tituloObtenido: e.tituloObtenido || e.nivelNombre || '',
                        fechaInicio: e.fechaInicio ?? '',
                        fechaFin: e.fechaFin ?? '',
                        documentoUrl: e.documentoUrl || '',
                        archivo: null,
                    })));
                }
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

        const construirEstudio = (r) => {
            if (!r.idNivelEducativo || !r.idInstitucion) return null;

            const nivel = niveles.find((n) => String(n.idNivelEducativo) === String(r.idNivelEducativo));
            return {
                idEstudio: r.idEstudio || null,
                idPersona: Number(idPersona),
                idNivelEducativo: Number(r.idNivelEducativo),
                idInstitucion: Number(r.idInstitucion),
                idModalidad: r.idModalidad ? Number(r.idModalidad) : null,
                tituloObtenido: r.tituloObtenido?.trim() || nivel?.nombreNivel || '',
                especialidad: null,
                fechaInicio: r.fechaInicio || null,
                fechaFin: r.fechaFin || null,
                esGraduado: false,
                archivo: r.archivo || null,
            };
        };

        const payload = registros
            .map(construirEstudio)
            .filter(Boolean);

        if (payload.length === 0) {
            setAviso({
                open: true,
                mensaje: 'Debe registrar al menos el nivel educativo y la institución de un estudio.',
                severidad: 'warning',
            });
            return;
        }

        setGuardando(true);
        try {
            // 1) Guardar/actualizar los estudios (payload sin la propiedad archivo)
            const paraEnviar = payload.map((reg) => {
                const copia = { ...reg };
                delete copia.archivo;
                return copia;
            });

            const guardados = (await guardarEstudios(idPersona, paraEnviar)).data || [];

            // 2) Asociar los documentos de soporte a los estudios recién guardados.
            for (const reg of payload) {
                if (reg.archivo && reg.idEstudio) {
                    await subirDocumentoEstudio(reg.idEstudio, TIPO_DOCUMENTO_DIPLOMA, reg.archivo);
                }
            }

            setRegistros(guardados.map((e) => ({
                key: contadorRef.current++,
                idEstudio: e.idEstudio ?? null,
                categoria: e.categoria || '',
                idNivelEducativo: e.idNivelEducativo ?? '',
                idInstitucion: e.idInstitucion ?? '',
                idModalidad: e.idModalidad ?? '',
                tituloObtenido: e.tituloObtenido || e.nivelNombre || '',
                fechaInicio: e.fechaInicio ?? '',
                fechaFin: e.fechaFin ?? '',
                documentoUrl: e.documentoUrl || '',
                archivo: null,
            })));

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
    }, [idPersona, registros, niveles, alGuardar]);

    const cerrarAviso = () => setAviso((prev) => ({ ...prev, open: false }));

    if (!idPersona) {
        return (
            <Box>
                <Alert severity="info" variant="outlined">
                    Debe guardar primero el expediente para poder registrar la información académica.
                </Alert>
            </Box>
        );
    }

    const nivelesDeCategoria = (categoria) =>
        niveles.filter((n) => n.categoria === categoria);

    const nivelDeForm = () => { return nivelesDeCategoria(formulario.categoria); };
    const requiereDocumentoForm = () => formulario.categoria !== 'CURSOS';

    const renderCampoDocumentoForm = () => (
        <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Documento de soporte (opcional)
            </Typography>
            {formulario.documentoUrl && (
                <Typography variant="caption" color="info.main" display="flex" alignItems="center" sx={{ mb: 0.5 }}>
                    {formulario.documentoUrl.includes('/') ? 'Documento cargado anteriormente.' : formulario.documentoUrl}
                </Typography>
            )}
            <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<AttachFileIcon />}
                sx={{ textTransform: 'none' }}
            >
                {formulario.archivo ? formulario.archivo.name : 'Adjuntar archivo'}
                <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => cambiarForm({ archivo: e.target.files?.[0] || null })}
                />
            </Button>
            {formulario.archivo && (
                <Typography variant="caption" color="success.main" display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                    <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} /> Archivo listo para cargarse.
                </Typography>
            )}
        </Box>
    );

    const etiquetaCategoria = (valor) =>
        CATEGORIAS.find((c) => c.valor === valor)?.etiqueta || valor || '—';

    const nombreNivel = (id) => {
        const n = niveles.find((n) => String(n.idNivelEducativo) === String(id));
        return n ? (n.nombreNivel + (n.descripcion ? ` — ${n.descripcion}` : '')) : '—';
    };

    const nombreInstitucion = (id) => {
        const i = instituciones.find((i) => String(i.idInstitucion) === String(id));
        return i ? (i.nombre + (i.siglas ? ` (${i.siglas})` : '')) : '—';
    };

    const nombreModalidad = (id) => {
        if (!id) return '—';
        const m = modalidades.find((m) => String(m.idModalidad) === String(id));
        return m?.nombre || '—';
    };

    const celdaDocumento = (r) => {
        if (r.archivo) return <Typography variant="caption" color="success.main">Pendiente</Typography>;
        if (r.documentoUrl) {
            return (
                <a href={r.documentoUrl} target="_blank" rel="noreferrer" style={{ color: '#1976d2' }}>
                    Ver
                </a>
            );
        }
        return <span style={{ color: '#9e9e9e' }}>—</span>;
    };

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
                        Agregue los estudios con el botón “Agregar estudio / curso”. La lista se guarda con el botón
                        “Guardar Información Académica”; no usa el botón “Guardar Cambios” de la página.
                    </Alert>

                    {/* Un solo botón para agregar */}
                    <Box sx={{ mb: 2 }}>
                        <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={abrirFormNuevo} color="primary">
                            Agregar estudio / curso
                        </Button>
                    </Box>

                    {formAbierto && (
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                                {editandoKey === null ? 'Nuevo estudio / curso' : 'Editar estudio / curso'}
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Paso 1: categoría */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Categoría *"
                                        value={formulario.categoria}
                                        onChange={(e) => cambiarForm({ categoria: e.target.value, idNivelEducativo: '' })}
                                    >
                                        <MenuItem value="">Seleccione...</MenuItem>
                                        {CATEGORIAS.map((c) => (
                                            <MenuItem key={c.valor} value={c.valor}>
                                                {c.etiqueta}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Paso 2: nivel dentro de la categoría */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Nivel *"
                                        value={formulario.idNivelEducativo}
                                        onChange={(e) => cambiarForm({ idNivelEducativo: e.target.value })}
                                        disabled={!formulario.categoria}
                                    >
                                        <MenuItem value="">Seleccione...</MenuItem>
                                        {nivelDeForm().map((n) => (
                                            <MenuItem key={n.idNivelEducativo} value={n.idNivelEducativo}>
                                                {n.nombreNivel}
                                                {n.descripcion ? ` — ${n.descripcion}` : ''}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Institución */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Institución / Centro de Estudio *"
                                        value={formulario.idInstitucion}
                                        onChange={(e) => cambiarForm({ idInstitucion: e.target.value })}
                                    >
                                        <MenuItem value="">Seleccione...</MenuItem>
                                        {instituciones.map((i) => (
                                            <MenuItem key={i.idInstitucion} value={i.idInstitucion}>
                                                {i.nombre}{i.siglas ? ` (${i.siglas})` : ''}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Título / nombre del estudio o curso */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label={formulario.categoria === 'CURSOS' ? 'Nombre del curso' : 'Carrera / Título'}
                                        placeholder={formulario.categoria === 'CURSOS' ? 'Ej: Curso de Excel Avanzado' : 'Ej: Ingeniería en Computación'}
                                        value={formulario.tituloObtenido}
                                        onChange={(e) => cambiarForm({ tituloObtenido: e.target.value })}
                                    />
                                </Grid>

                                {/* Modalidad */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Modalidad"
                                        value={formulario.idModalidad}
                                        onChange={(e) => cambiarForm({ idModalidad: e.target.value })}
                                    >
                                        <MenuItem value="">Ninguna</MenuItem>
                                        {modalidades.map((m) => (
                                            <MenuItem key={m.idModalidad} value={m.idModalidad}>
                                                {m.nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Fechas */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        label="Fecha de inicio"
                                        InputLabelProps={{ shrink: true }}
                                        value={formulario.fechaInicio}
                                        onChange={(e) => cambiarForm({ fechaInicio: e.target.value })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        label="Fecha de fin"
                                        InputLabelProps={{ shrink: true }}
                                        value={formulario.fechaFin}
                                        onChange={(e) => cambiarForm({ fechaFin: e.target.value })}
                                    />
                                </Grid>

                                {/* Documento de soporte: solo categorías que lo requieren (no Cursos) */}
                                {requiereDocumentoForm() && (
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        {renderCampoDocumentoForm()}
                                    </Grid>
                                )}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                                <Button variant="outlined" color="inherit" onClick={cancelarForm}>
                                    Cancelar
                                </Button>
                                <Button variant="contained" color="primary" onClick={aceptarForm}>
                                    {editandoKey === null ? 'Agregar a la lista' : 'Guardar cambios'}
                                </Button>
                            </Box>
                        </Paper>
                    )}

                    {/* Tabla de registros añadidos */}
                    {registros.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            No se han registrado estudios académicos.
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                        <TableCell>#</TableCell>
                                        <TableCell>Categoría</TableCell>
                                        <TableCell>Nivel</TableCell>
                                        <TableCell>Institución</TableCell>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Modalidad</TableCell>
                                        <TableCell>Inicio</TableCell>
                                        <TableCell>Fin</TableCell>
                                        <TableCell>Documento</TableCell>
                                        <TableCell align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registros.map((r, indice) => (
                                        <TableRow key={r.key} hover>
                                            <TableCell>{indice + 1}</TableCell>
                                            <TableCell>{etiquetaCategoria(r.categoria)}</TableCell>
                                            <TableCell>{nombreNivel(r.idNivelEducativo)}</TableCell>
                                            <TableCell>{nombreInstitucion(r.idInstitucion)}</TableCell>
                                            <TableCell>{r.tituloObtenido || '—'}</TableCell>
                                            <TableCell>{nombreModalidad(r.idModalidad)}</TableCell>
                                            <TableCell>{r.fechaInicio || '—'}</TableCell>
                                            <TableCell>{r.fechaFin || '—'}</TableCell>
                                            <TableCell>{celdaDocumento(r)}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Editar">
                                                    <IconButton size="small" color="primary" onClick={() => abrirFormEditar(r.key)}>
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton size="small" color="error" onClick={() => eliminarRegistro(r.key)}>
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                            <OpenInNewIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Los documentos quedan asociados a cada estudio.
                        </Typography>
                    </Box>
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
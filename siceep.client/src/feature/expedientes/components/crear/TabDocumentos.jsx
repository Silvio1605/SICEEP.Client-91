import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Typography, Paper, Button, Divider, Alert, CircularProgress,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton,
    TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, Skeleton
} from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

import {
    listarDocumentos,
    subirDocumento,
    subirCedula,
    descargarDocumento,
    eliminarDocumento
} from '../../services/expedienteService';
import { formatearFechaLegible } from '../../utils/expedienteMappers';
import TabInfoAcademica from './TabInfoAcademica';

// Tipos de documento que soporta el expediente digital (catálogo Tipo_Documento).
// La cédula (id 2) requiere dos caras (frente/reverso) en JPG/PNG y fecha de vencimiento.
// El soporte académico (id 4) registra la información académica y anexa el título o certificado.
const TIPOS_DOCUMENTO = [
    {
        id: 2,
        titulo: 'Cédula de Identidad',
        detalle: 'Frente y Reverso en JPG o PNG + Fecha de Vencimiento (se suben juntas)',
        accept: 'image/jpeg, image/png',
        conCara: true,
    },
    { id: 1, titulo: 'Fotografía del Funcionario', detalle: 'Formato JPG o PNG', accept: 'image/jpeg, image/png', conCara: false },
    { id: 3, titulo: 'Contrato de Trabajo', detalle: 'Documento oficial firmado en PDF', accept: 'application/pdf', conCara: false },
    {
        id: 4,
        titulo: 'Soporte Académico (Títulos / Certificados)',
        detalle: 'Registre el estudio (nivel, institución, modalidad y fechas) y adjunte su diploma o certificado en PDF o Imagen.',
        accept: 'application/pdf, image/jpeg, image/png',
        conCara: false,
        esAcademico: true,
    },
];

const MAX_TAMANO_BYTES = 5 * 1024 * 1024; // 5 MB (igual que el backend)

const formatearTamanio = (bytes) => {
    if (bytes == null) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const nombreCara = (cara) => (cara === 'F' ? 'Frente' : cara === 'R' ? 'Reverso' : '');

export default function TabDocumentos({ expediente }) {
    const idExpediente = expediente?.idExpediente ?? null;

    const [documentos, setDocumentos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(null); // { tipoId, cara? } en proceso
    const [mensaje, setMensaje] = useState(null);   // { tipo: 'success'|'error'|'info', texto }
    const [vencimiento, setVencimiento] = useState(''); // fecha vencimiento de la cédula
    const [frenteFile, setFrenteFile] = useState(null);
    const [reversoFile, setReversoFile] = useState(null);
    const [dialogoAcademico, setDialogoAcademico] = useState(false);
    const inputRef = useRef(null);

    // Recarga usada tras subir/eliminar (desde manejadores de eventos, no efectos)
    const recargarDocumentos = useCallback(async () => {
        if (!idExpediente) return;
        try {
            const respuesta = await listarDocumentos(idExpediente);
            setDocumentos(respuesta.data || []);
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudieron cargar los documentos.' });
        } finally {
            setCargando(false);
        }
    }, [idExpediente]);

    useEffect(() => {
        if (!idExpediente) return;
        let activo = true;

        const cargar = async () => {
            try {
                const respuesta = await listarDocumentos(idExpediente);
                if (activo) setDocumentos(respuesta.data || []);
            } catch (err) {
                if (activo) setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudieron cargar los documentos.' });
            } finally {
                if (activo) setCargando(false);
            }
        };

        cargar();
        return () => { activo = false; };
    }, [idExpediente]);

    const handleSubir = async (tipo, cara, event) => {
        const archivo = event.target.files?.[0];
        if (!archivo) return;

        if (archivo.size > MAX_TAMANO_BYTES) {
            setMensaje({ tipo: 'error', texto: `El archivo "${archivo.name}" excede el tamaño máximo permitido de 5 MB.` });
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        setSubiendo({ tipoId: tipo.id, cara });
        setMensaje(null);
        try {
            await subirDocumento(
                idExpediente,
                {
                    idTipoDocumento: tipo.id,
                    cara,
                    fechaVencimiento: tipo.conCara && cara === 'F' ? vencimiento : null,
                },
                archivo
            );
            setMensaje({ tipo: 'success', texto: `"${archivo.name}" (${nombreCara(cara)}) se subió correctamente.` });
            await recargarDocumentos();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudo subir el documento.' });
        } finally {
            setSubiendo(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const seleccionarCara = (setter, event) => {
        const archivo = event.target.files?.[0] || null;
        if (archivo && archivo.size > MAX_TAMANO_BYTES) {
            setMensaje({ tipo: 'error', texto: `El archivo "${archivo.name}" excede el tamaño máximo permitido de 5 MB.` });
            event.target.value = '';
            return;
        }
        setter(archivo);
    };

    const handleSubirCedula = async () => {
        if (!frenteFile || !reversoFile || !vencimiento) return;

        setSubiendo({ tipoId: 2 });
        setMensaje(null);
        try {
            await subirCedula(idExpediente, vencimiento, frenteFile, reversoFile);
            setMensaje({ tipo: 'success', texto: 'Cédula subida completa: frente, reverso y fecha de vencimiento.' });
            await recargarDocumentos();
            setFrenteFile(null);
            setReversoFile(null);
            setVencimiento('');
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudo subir la cédula.' });
        } finally {
            setSubiendo(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleDownload = async (documento) => {
        try {
            const respuesta = await descargarDocumento(documento.idDocumento);
            const url = window.URL.createObjectURL(new Blob([respuesta.data]));
            const enlace = document.createElement('a');
            enlace.href = url;
            enlace.download = documento.nombreArchivo || `documento_${documento.idDocumento}`;
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudo descargar el documento.' });
        }
    };

    const handleEliminar = async (documento) => {
        const etiqueta = documento.cara ? `${documento.nombreArchivo} (${nombreCara(documento.cara)})` : documento.nombreArchivo;
        if (!window.confirm(`¿Desea eliminar el documento "${etiqueta}"?`)) return;
        try {
            await eliminarDocumento(documento.idDocumento);
            setMensaje({ tipo: 'success', texto: `"${etiqueta}" fue eliminado.` });
            await recargarDocumentos();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudo eliminar el documento.' });
        }
    };

    const documentosDe = (idTipo) => (documentos || []).filter((d) => d.idTipoDocumento === idTipo);

    if (!idExpediente) {
        return (
            <Alert severity="info" variant="outlined">
                El expediente todavía no existe. Cuando se cree, podrá adjuntar aquí los documentos.
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                Gestión de Expediente Digital - Documentos Requeridos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Adjunte los documentos institucionales obligatorios y soportes según los lineamientos del sistema.
                Solo PDF, JPG, JPEG y PNG, con un máximo de 5 MB por archivo. La cédula requiere frente y reverso en JPG/PNG.
            </Typography>

            {mensaje && (
                <Alert severity={mensaje.tipo} sx={{ mb: 3 }} onClose={() => setMensaje(null)}>
                    {mensaje.texto}
                </Alert>
            )}

            {cargando && (
                <Stack spacing={1} sx={{ py: 2 }}>
                    <Skeleton variant="text" width={'35%'} />
                    <Skeleton variant="rectangular" width={'100%'} height={20} />
                    <Skeleton variant="rounded" width={'100%'} height={45} />
                    <Skeleton variant="rounded" width={'100%'} height={45} />
                </Stack>
            )}

            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                {TIPOS_DOCUMENTO.map((tipo, indice) => {
                    const yaSubidos = documentosDe(tipo.id);
                    const esUltimo = indice === TIPOS_DOCUMENTO.length - 1;

                    return (
                        <Box key={tipo.id}>
                            {indice > 0 && <Divider />}

                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">{tipo.titulo}</Typography>
                                        <Typography variant="body2" color="text.secondary">{tipo.detalle}</Typography>
                                    </Box>
                                </Box>

                                {tipo.conCara ? (
                                    // --- Cédula: selectores de ambas caras + fecha, un solo botón de subida ---
                                    <Box sx={{ mt: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="date"
                                                    label="Fecha de Vencimiento"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={vencimiento}
                                                    onChange={(e) => setVencimiento(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled={subiendo !== null}
                                                    startIcon={<FileUploadOutlinedIcon />}
                                                >
                                                    {frenteFile ? `Frente: ${frenteFile.name}` : 'SELECCIONAR FRENTE'}
                                                    <input
                                                        ref={inputRef}
                                                        type="file"
                                                        hidden
                                                        accept={tipo.accept}
                                                        onChange={(e) => seleccionarCara(setFrenteFile, e)}
                                                    />
                                                </Button>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled={subiendo !== null}
                                                    startIcon={<FileUploadOutlinedIcon />}
                                                >
                                                    {reversoFile ? `Reverso: ${reversoFile.name}` : 'SELECCIONAR REVERSO'}
                                                    <input
                                                        ref={inputRef}
                                                        type="file"
                                                        hidden
                                                        accept={tipo.accept}
                                                        onChange={(e) => seleccionarCara(setReversoFile, e)}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            sx={{ mt: 2 }}
                                            startIcon={subiendo?.tipoId === 2 ? (<CircularProgress size={18} />) : (<FileUploadOutlinedIcon />)}
                                            disabled={!frenteFile || !reversoFile || !vencimiento || subiendo !== null}
                                            onClick={handleSubirCedula}
                                        >
                                            {subiendo?.tipoId === 2 ? 'SUBINDO...' : 'SUBIR CÉDULA COMPLETA (2 CARAS)'}
                                        </Button>

                                        {(() => {
                                            const tieneFrente = yaSubidos.some((d) => d.cara === 'F');
                                            const tieneReverso = yaSubidos.some((d) => d.cara === 'R');
                                            return (
                                                <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
                                                    Estado: {tieneFrente ? 'Frente ✓ ' : 'Frente (falta) '}
                                                    · {tieneReverso ? 'Reverso ✓' : 'Reverso (falta)'}
                                                </Typography>
                                            );
                                        })()}
                                    </Box>
                                ) : tipo.esAcademico ? (
                                    // --- Soporte Académico: botón que abre el diálogo de info académica (estudio + diploma) ---
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SchoolOutlinedIcon />}
                                            onClick={() => setDialogoAcademico(true)}
                                        >
                                            REGISTRAR O EDITAR SOPORTE ACADÉMICO
                                        </Button>
                                        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                                            Abre el formulario de información académica para guardar el nivel, institución, modalidad y fechas del estudio, junto al diploma o certificado (PDF o imagen).
                                        </Typography>
                                    </Box>
                                ) : (
                                    // --- Resto de documentos: un solo archivo ---
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={subiendo?.tipoId === tipo.id ? (<CircularProgress size={18} />) : (<FileUploadOutlinedIcon />)}
                                            disabled={subiendo !== null}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            {subiendo?.tipoId === tipo.id ? 'SUBINDO...' : 'ADJUNTAR'}
                                            <input
                                                ref={inputRef}
                                                type="file"
                                                hidden
                                                accept={tipo.accept}
                                                onChange={(e) => handleSubir(tipo, null, e)}
                                            />
                                        </Button>
                                    </Box>
                                )}

                                {yaSubidos.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Archivo</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Cara</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Vencimiento</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Tamaño</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de carga</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {yaSubidos.map((doc) => (
                                                    <TableRow key={doc.idDocumento} hover>
                                                        <TableCell>{doc.nombreArchivo}</TableCell>
                                                        <TableCell>{doc.cara ? nombreCara(doc.cara) : '—'}</TableCell>
                                                        <TableCell>{formatearFechaLegible(doc.fechaVencimiento) || '—'}</TableCell>
                                                        <TableCell>{formatearTamanio(doc.tamanoBytes)}</TableCell>
                                                        <TableCell>{formatearFechaLegible(doc.fechaCarga) || '—'}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton size="small" title="Descargar" onClick={() => handleDownload(doc)}>
                                                                <DownloadOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton size="small" color="error" title="Eliminar" onClick={() => handleEliminar(doc)}>
                                                                <DeleteOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}
                            </Box>

                            {esUltimo && <Divider sx={{ opacity: 0 }} />}
                        </Box>
                    );
                })}
            </Paper>

            <Dialog open={dialogoAcademico} onClose={() => setDialogoAcademico(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolOutlinedIcon /> Soporte Académico (Títulos / Certificados)
                </DialogTitle>
                <DialogContent dividers>
                    <TabInfoAcademica idPersona={expediente?.persona?.idPersona} alGuardar={recargarDocumentos} />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button onClick={() => setDialogoAcademico(false)} color="inherit">CERRAR</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
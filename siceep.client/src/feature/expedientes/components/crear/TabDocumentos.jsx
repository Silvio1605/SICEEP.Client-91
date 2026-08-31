import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Typography, Paper, Button, Divider, Alert, CircularProgress,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {
    listarDocumentos,
    subirDocumento,
    descargarDocumento,
    eliminarDocumento
} from '../../services/expedienteService';
import { formatearFechaLegible } from '../../utils/expedienteMappers';

// Tipos de documento que soporta el expediente digital (catálogo Tipo_Documento)
const TIPOS_DOCUMENTO = [
    { id: 2, titulo: 'Cédula de Identidad', detalle: 'Formato PDF o Imagen (Ambos lados)', accept: 'application/pdf, image/jpeg, image/png' },
    { id: 1, titulo: 'Fotografía del Funcionario', detalle: 'Formato JPG o PNG', accept: 'image/jpeg, image/png' },
    { id: 3, titulo: 'Contrato de Trabajo', detalle: 'Documento oficial firmado en PDF', accept: 'application/pdf' },
    { id: 4, titulo: 'Soporte Académico (Títulos / Certificados)', detalle: 'Diploma, título o certificado de cursos en PDF o Imagen', accept: 'application/pdf, image/jpeg, image/png' },
];

const MAX_TAMANO_BYTES = 5 * 1024 * 1024; // 5 MB (igual que el backend)

const formatearTamanio = (bytes) => {
    if (bytes == null) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function TabDocumentos({ expediente }) {
    const idExpediente = expediente?.idExpediente ?? null;

    const [documentos, setDocumentos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(null); // idTipoDocumento en proceso
    const [mensaje, setMensaje] = useState(null);   // { tipo: 'success'|'error'|'info', texto }
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

    const handleSubir = async (tipo, event) => {
        const archivo = event.target.files?.[0];
        if (!archivo) return;

        if (archivo.size > MAX_TAMANO_BYTES) {
            setMensaje({ tipo: 'error', texto: `El archivo "${archivo.name}" excede el tamaño máximo permitido de 5 MB.` });
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        setSubiendo(tipo.id);
        setMensaje(null);
        try {
            await subirDocumento(idExpediente, { idTipoDocumento: tipo.id }, archivo);
            setMensaje({ tipo: 'success', texto: `"${archivo.name}" se subió correctamente.` });
            await recargarDocumentos();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err?.response?.data?.message || err?.message || 'No se pudo subir el documento.' });
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
        if (!window.confirm(`¿Desea eliminar el documento "${documento.nombreArchivo}"?`)) return;
        try {
            await eliminarDocumento(documento.idDocumento);
            setMensaje({ tipo: 'success', texto: `"${documento.nombreArchivo}" fue eliminado.` });
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
                Solo PDF, JPG, JPEG y PNG, con un máximo de 5 MB por archivo.
            </Typography>

            {mensaje && (
                <Alert severity={mensaje.tipo} sx={{ mb: 3 }} onClose={() => setMensaje(null)}>
                    {mensaje.texto}
                </Alert>
            )}

            {cargando && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={28} />
                </Box>
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
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={subiendo === tipo.id ? (<CircularProgress size={18} />) : (<FileUploadOutlinedIcon />)}
                                        disabled={subiendo !== null}
                                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                                    >
                                        {subiendo === tipo.id ? 'SUBINDO...' : 'ADJUNTAR'}
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            hidden
                                            accept={tipo.accept}
                                            onChange={(e) => handleSubir(tipo, e)}
                                        />
                                    </Button>
                                </Box>

                                {yaSubidos.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Archivo</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Tamaño</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de carga</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {yaSubidos.map((doc) => (
                                                    <TableRow key={doc.idDocumento} hover>
                                                        <TableCell>{doc.nombreArchivo}</TableCell>
                                                        <TableCell>{formatearTamanio(doc.tamanoBytes)}</TableCell>
                                                        <TableCell>{formatearFechaLegible(doc.fechaCarga) || '—'}</TableCell>
                                                        <TableCell>{doc.usuarioCarga || '—'}</TableCell>
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
        </Box>
    );
}
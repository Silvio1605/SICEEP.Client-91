import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Paper, Stack, Avatar, Button, IconButton, Tooltip, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Alert, Chip
} from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
//
import BusquedaPropietario from './../../usuarios/components/BusquedaPropietario';
import { getExpedienteCompleto, descargarDocumento } from './../../expedientes/services/expedienteService';

// Obtiene el icono según el nombre del archivo / tipo de documento
const iconoArchivo = (nombre) => {
    const ext = (nombre || '').toLowerCase();
    if (ext.endsWith('.pdf')) return <PictureAsPdfIcon sx={{ color: '#d32f2f' }} />;
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png')) return <ImageIcon sx={{ color: '#1976d2' }} />;
    return <InsertDriveFileIcon sx={{ color: '#757575' }} />;
};

const formatearBytes = (bytes) => {
    if (!bytes && bytes !== 0) return 'S/D';
    const unidades = ['B', 'KB', 'MB', 'GB'];
    let valor = Number(bytes);
    let i = 0;
    while (valor >= 1024 && i < unidades.length - 1) {
        valor /= 1024;
        i += 1;
    }
    return `${valor.toFixed(valor >= 10 || i === 0 ? 0 : 1)} ${unidades[i]}`;
};

const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

export default function GestionDocumentos() {

    const [openBusqueda, setOpenBusqueda] = useState(false);
    const [persona, setPersona] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [descargandoId, setDescargandoId] = useState(null);

    // Carga los documentos digitales del expediente de la persona
    const cargarDocumentos = useCallback(async (idPersona) => {
        setCargando(true);
        setError(null);
        setDocumentos([]);
        try {
            const res = await getExpedienteCompleto(idPersona);
            setDocumentos(res?.data?.documentos || []);
        } catch (err) {
            const status = err?.response?.status;
            setError(
                status === 404
                    ? 'La persona seleccionada no tiene expediente digital.'
                    : err?.response?.data?.message || err?.message || 'No se pudieron cargar los documentos.'
            );
        } finally {
            setCargando(false);
        }
    }, []);

    const seleccionarPersona = useCallback((propietario) => {
        setPersona({ id: propietario.id, nombreCompleto: propietario.nombreCompleto });
        cargarDocumentos(propietario.id);
    }, [cargarDocumentos]);

    const quitarSeleccion = () => {
        setPersona(null);
        setDocumentos([]);
        setError(null);
    };

    // Descarga un documento por su Id (blob)
    const descargarDocs = async (doc) => {
        if (!doc?.idDocumento) return;
        setDescargandoId(doc.idDocumento);
        try {
            const res = await descargarDocumento(doc.idDocumento);
            const urlObj = URL.createObjectURL(res.data);
            const enlace = document.createElement('a');
            enlace.href = urlObj;
            enlace.download = doc.nombreArchivo || `documento-${doc.idDocumento}`;
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
            URL.revokeObjectURL(urlObj);
        } catch (err) {
            console.error("Error al descargar documento: ", err);
            if (typeof alert === 'function') alert('No se pudo descargar el documento.');
        } finally {
            setDescargandoId(null);
        }
    };

    // Abre el documento en una pestaña nueva para visualizarlo
    const verDocs = async (doc) => {
        if (!doc?.idDocumento) return;
        setDescargandoId(doc.idDocumento);
        try {
            const res = await descargarDocumento(doc.idDocumento);
            const urlObj = URL.createObjectURL(res.data);
            window.open(urlObj, '_blank');
            setTimeout(() => URL.revokeObjectURL(urlObj), 30000);
        } catch (err) {
            console.error("Error al visualizar documento: ", err);
            if (typeof alert === 'function') alert('No se pudo visualizar el documento.');
        } finally {
            setDescargandoId(null);
        }
    };

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            {/* Título de la página */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Gestión de Documentos
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Consulte los documentos digitales de cualquier persona
                </Typography>
            </Box>

            {
                !persona ? (
                    // Estado vacío: aún no hay persona seleccionada
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 5,
                            mb: 2,
                            borderRadius: 3,
                            borderColor: 'divider',
                            textAlign: 'center',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Stack spacing={2} alignItems="center">
                            <Avatar sx={{ width: 72, height: 72, bgcolor: (theme) => theme.palette.primary.main }}>
                                <FolderSharedIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Selecciona una persona
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
                                    Busque a la persona para consultar los documentos digitales de su expediente.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PersonSearchIcon />}
                                onClick={() => setOpenBusqueda(true)}
                            >
                                Buscar Persona
                            </Button>
                        </Stack>
                    </Paper>

                ) : (
                    <>
                        {/* Resumen de la persona seleccionada */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: 3,
                                borderColor: 'divider',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Avatar sx={{ width: 48, height: 48, bgcolor: '#1565C0', fontWeight: 700 }}>
                                {getIniciales(persona.nombreCompleto)}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Persona seleccionada
                                </Typography>
                                <Typography variant="body1" fontWeight={700} color="text.primary">
                                    {persona.nombreCompleto}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button size="small" startIcon={<RefreshIcon />} onClick={() => setOpenBusqueda(true)}>
                                    Cambiar
                                </Button>
                                <Button size="small" color="error" startIcon={<ClearIcon />} onClick={quitarSeleccion}>
                                    Quitar
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Documentos digitales */}
                        {cargando ? (
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'divider' }}>
                                <Stack spacing={1}>
                                    <Skeleton variant="rectangular" width={'100%'} height={24} />
                                    <Skeleton variant="rounded" width={'100%'} height={40} />
                                    <Skeleton variant="rounded" width={'100%'} height={40} />
                                    <Skeleton variant="rounded" width={'100%'} height={40} />
                                </Stack>
                            </Paper>
                        ) : error ? (
                            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                {error}
                            </Alert>
                        ) : documentos.length === 0 ? (
                            <Paper
                                variant="outlined"
                                sx={{ p: 5, textAlign: 'center', borderRadius: 3, borderColor: 'divider' }}
                            >
                                <FolderSharedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                                    No se encontraron documentos digitales para esta persona.
                                </Typography>
                            </Paper>
                        ) : (
                            <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                                <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FolderSharedIcon fontSize="small" color="primary" />
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        Documentos Digitales
                                    </Typography>
                                    <Chip
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        label={`${documentos.length} documento${documentos.length === 1 ? '' : 's'}`}
                                    />
                                </Box>
                                <TableContainer sx={{ mt: 1 }}>
                                    <Table size="small">
                                        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Documento</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Cara</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Fecha de carga</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Tamaño</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {documentos.map((doc) => (
                                                <TableRow key={doc.idDocumento} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {iconoArchivo(doc.nombreArchivo)}
                                                            <Typography variant="body2" noWrap>
                                                                {doc.nombreArchivo || 'S/D'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{doc.tipoDocumento || 'S/D'}</TableCell>
                                                    <TableCell>
                                                        {doc.cara ? (doc.cara === 'F' ? 'Frente' : doc.cara === 'R' ? 'Reverso' : doc.cara) : '—'}
                                                    </TableCell>
                                                    <TableCell>{formatearFecha(doc.fechaCarga)}</TableCell>
                                                    <TableCell>{formatearBytes(doc.tamanoBytes)}</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Ver documento">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => verDocs(doc)}
                                                                disabled={descargandoId === doc.idDocumento}
                                                            >
                                                                {descargandoId === doc.idDocumento ? <CircularProgress size={18} /> : <VisibilityIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Descargar">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => descargarDocs(doc)}
                                                                disabled={descargandoId === doc.idDocumento}
                                                            >
                                                                <DownloadIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}
                    </>
                )
            }

            {/* Diálogo para buscar persona */}
            <BusquedaPropietario
                open={openBusqueda}
                onClose={() => setOpenBusqueda(false)}
                onSeleccionar={seleccionarPersona}
                OriginRegistro
            />
        </Box>
    );
}
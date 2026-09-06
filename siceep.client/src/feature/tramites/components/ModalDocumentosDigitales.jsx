import { useState, useEffect } from 'react';
import {
    Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, Skeleton, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { getExpedienteCompleto, descargarDocumento } from '../../expedientes/services/expedienteService';


// Obtiene el icono según el nombre del archivo / tipo de documento
const iconoArchivo = (nombre) => {
    const ext = (nombre || '').toLowerCase();
    if (ext.endsWith('.pdf')) return <PictureAsPdfIcon sx={{ color: '#d32f2f' }} />;
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png')) return <ImageIcon sx={{ color: '#1976d2' }} />;
    return <InsertDriveFileIcon sx={{ color: '#757575' }} />;
};

// Formatea bytes a KB, MB, GB según corresponda
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

export default function ModalDocumentosDigitales({ abierto, empleado, alCerrar }) {

    // El padre re-monta este modal (key) cada vez que se abre, así siempre inicia cargando
    const [documentos, setDocumentos] = useState([]);
    const [cargandoDocs, setCargandoDocs] = useState(true);
    const [descargandoId, setDescargandoId] = useState(null);

    useEffect(() => {
        if (!abierto || !empleado?.id) return;
        let activo = true;

        const cargar = async () => {
            try {
                const res = await getExpedienteCompleto(empleado.id);
                if (!activo) return;
                setDocumentos(res?.data?.documentos || []);
            } catch (err) {
                console.error("Error al cargar documentos: ", err);
                if (!activo) return;
                setDocumentos([]);
            } finally {
                if (activo) setCargandoDocs(false);
            }
        };

        cargar();

        return () => {
            activo = false;
        };
    }, [abierto, empleado]);

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
            // Se revoca tras un pequeño retraso para permitir que abra
            setTimeout(() => URL.revokeObjectURL(urlObj), 30000);
        } catch (err) {
            console.error("Error al visualizar documento: ", err);
            if (typeof alert === 'function') alert('No se pudo visualizar el documento.');
        } finally {
            setDescargandoId(null);
        }
    };

    return (
        <Dialog open={abierto} onClose={alCerrar} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold' }}>
                <FolderSharedIcon /> Documentos Digitales
                {empleado?.nombreCompleto && (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 'normal' }}>
                        — {empleado.nombreCompleto}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent dividers>
                {cargandoDocs ? (
                    <Stack spacing={1} sx={{ py: 2 }}>
                        <Skeleton variant="rectangular" width={'100%'} height={24} />
                        <Skeleton variant="rounded" width={'100%'} height={40} />
                        <Skeleton variant="rounded" width={'100%'} height={40} />
                        <Skeleton variant="rounded" width={'100%'} height={40} />
                    </Stack>
                ) : documentos.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            No se encontraron documentos digitales para este funcionario.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
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
                                        <TableCell>{doc.cara ? (doc.cara === 'F' ? 'Frente' : doc.cara === 'R' ? 'Reverso' : doc.cara) : '—'}</TableCell>
                                        <TableCell>
                                            {doc.fechaCarga ? new Date(doc.fechaCarga).toLocaleString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                                        </TableCell>
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
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={alCerrar} color="inherit" startIcon={<CancelIcon />}>
                    CERRAR
                </Button>
            </DialogActions>
        </Dialog>
    );
}
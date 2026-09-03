import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Typography, Paper, TextField, InputAdornment, Stack, Skeleton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, FormGroup, FormControlLabel,
    Checkbox, Divider, ListItemIcon, TablePagination, Alert, CircularProgress,
    Tooltip
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Obtiene el icono según el nombre del archivo / tipo de documento
const iconoArchivo = (nombre) => {
    const ext = (nombre || '').toLowerCase();
    if (ext.endsWith('.pdf')) return <PictureAsPdfIcon sx={{ color: '#d32f2f' }} />;
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png')) return <ImageIcon sx={{ color: '#1976d2' }} />;
    return <InsertDriveFileIcon sx={{ color: '#757575' }} />;
};

import { getExpedientes, getExpedienteCompleto, getEstudios, descargarDocumento } from '../../expedientes/services/expedienteService';
import { mapearCompletoADetalle } from '../../expedientes/utils/expedienteMappers';
import { generarFichaExpedienteURL, obtenerFotoPerfilURL, generarConstanciaURL } from '../../expedientes/services/pdfService.jsx';
import ModalVistaPreviaPDF from '../../expedientes/components/ModalVistaPreviaPDF';

const opcionesImpresionPorDefecto = {
    fichaCompleta: false,
    infoPersonal: false,
    infoFamiliar: false,
    trayectoria: false,
    perfilAcademico: false
};

// Mapa de estados (numérico) -> etiqueta/color (igual que columnsExpediente)
const ESTADO_MAP = {
    1: { label: 'Baja', color: '#d32f2f' },
    2: { label: 'Activo', color: '#2e7d32' },
    3: { label: 'Com/Servicio', color: '#ed6c02' },
};

// Traduce las opciones del modal (fichaCompleta, etc.) a las que espera el PDF
const mapearOpcionesImpresion = (opciones) => {
    if (opciones.fichaCompleta) return { todo: true };
    const secciones = {
        personal: opciones.infoPersonal,
        familiar: opciones.infoFamiliar,
        laboral: opciones.trayectoria,
        academica: opciones.perfilAcademico,
    };
    // Si ninguna se marcó, se imprime todo
    const algunaMarcada = Object.values(secciones).some(Boolean);
    return algunaMarcada ? secciones : { todo: true };
};

export default function BusquedaRapida() {
    // Menu flotante / acciones
    const [anchorEl, setAnchorEl] = useState(null);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

    // Modal de opciones de impresión
    const [modalImpresionAbierto, setModalImpresionAbierto] = useState(false);
    const [opcionesImpresion, setOpcionesImpresion] = useState(opcionesImpresionPorDefecto);

    // Vista previa del PDF
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
    const [nombreDescarga, setNombreDescarga] = useState('Documento.pdf');
    const fotoUrlRef = useRef(null);

    // Modal de Documentos Digitales
    const [modalDocsAbierto, setModalDocsAbierto] = useState(false);
    const [documentos, setDocumentos] = useState([]);
    const [cargandoDocs, setCargandoDocs] = useState(false);
    const [descargandoId, setDescargandoId] = useState(null);

    // Datos reales
    const [expedientes, setExpedientes] = useState([]);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [page, setPage] = useState(0);
    // El backend pagina de a 10 fijos (PaginacionDto.TamaÃ±oPagina = 10)
    const ROWS_PER_PAGE = 10;

    const isMenuOpen = Boolean(anchorEl);

    // Carga de expedientes reales
    const cargarExpedientes = useCallback(async (termino, pagina) => {
        setCargando(true);
        setError(null);
        try {
            const filtro = {
                busqueda: termino && termino.trim() !== '' ? termino.trim() : null,
                estado: null,
                estructura: null,
                cargo: null,
                pagina: pagina + 1,
            };
            const res = await getExpedientes(filtro);
            setExpedientes(res?.data?.data || []);
            setTotal(res?.data?.totalRegistros || 0);
        } catch (err) {
            setError(err?.message || 'Error al cargar los expedientes.');
            setExpedientes([]);
            setTotal(0);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const termino = busqueda && busqueda.trim() !== '' ? busqueda.trim() : null;
            cargarExpedientes(termino, page);
        }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busqueda, page]);

    const manejarBusqueda = (event) => {
        setBusqueda(event.target.value);
        setPage(0);
    };

    const abrirMenuOpciones = useCallback((event, empleado) => {
        setAnchorEl(event.currentTarget);
        setEmpleadoSeleccionado(empleado);
    }, []);

    const cerrarMenuOpciones = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const abrirModal = useCallback(() => {
        cerrarMenuOpciones();
        setModalImpresionAbierto(true);
    }, [cerrarMenuOpciones]);

    const cerrarModal = useCallback(() => {
        setModalImpresionAbierto(false);
        setOpcionesImpresion(opcionesImpresionPorDefecto);
    }, []);

    const manejarCambioCheckbox = useCallback((event) => {
        const { name, checked } = event.target;
        setOpcionesImpresion((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }, []);

    const cargarExpedienteCompleto = async (empleado) => {
        const dto = (await getExpedienteCompleto(empleado?.id)).data;
        const detalle = mapearCompletoADetalle(dto);
        const estudios = dto?.persona?.idPersona
            ? (await getEstudios(dto.persona.idPersona).catch(() => ({ data: [] }))).data
            : [];
        return { dto, detalle, estudios };
    };

    const generarConstancia = async () => {
        try {
            cerrarMenuOpciones();
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);

            const { dto } = await cargarExpedienteCompleto(empleadoSeleccionado);
            const codigo = dto?.codigo || empleadoSeleccionado?.codigo || 'sincodigo';
            setNombreDescarga(`Constancia-${codigo}.pdf`);

            const url = await generarConstanciaURL({ ...dto }, {});
            setPdfUrl(url);
        } catch (err) {
            console.error("Error al generar la constancia: ", err);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
            if (typeof alert === 'function') alert(`Error al generar la constancia: ${err?.message || 'desconocido'}`);
        } finally {
            setGenerandoPDF(false);
        }
    };

    const mandarAImprimir = async () => {
        try {
            cerrarModal();
            setGenerandoPDF(true);
            setVistaPreviaAbierta(true);

            const { dto, detalle, estudios } = await cargarExpedienteCompleto(empleadoSeleccionado);
            setNombreDescarga(`Ficha-Expediente-${dto?.codigo || 'sin-codigo'}.pdf`);

            const fotoUrl = await obtenerFotoPerfilURL(dto);
            fotoUrlRef.current = fotoUrl;

            const opcionesPDF = mapearOpcionesImpresion(opcionesImpresion);
            const url = await generarFichaExpedienteURL({ ...dto, ...detalle }, estudios, opcionesPDF, fotoUrl);
            setPdfUrl(url);
        } catch (err) {
            console.error("Error al generar el PDF: ", err);
            setVistaPreviaAbierta(false);
            setPdfUrl(null);
            if (typeof alert === 'function') alert(`Error al generar el documento: ${err?.message || 'desconocido'}`);
        } finally {
            setGenerandoPDF(false);
        }
    };

    const cerrarVistaPrevia = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        if (fotoUrlRef.current) {
            URL.revokeObjectURL(fotoUrlRef.current);
            fotoUrlRef.current = null;
        }
        setPdfUrl(null);
        setVistaPreviaAbierta(false);
    };

    // Abre el modal con los documentos digitales del funcionario seleccionado
    const abrirDocumentos = async () => {
        cerrarMenuOpciones();
        setModalDocsAbierto(true);
        setCargandoDocs(true);
        setDocumentos([]);
        try {
            const res = await getExpedienteCompleto(empleadoSeleccionado?.id);
            const docs = res?.data?.documentos || [];
            setDocumentos(docs);
        } catch (err) {
            console.error("Error al cargar documentos: ", err);
            setDocumentos([]);
        } finally {
            setCargandoDocs(false);
        }
    };

    const cerrarDocumentos = () => {
        setModalDocsAbierto(false);
        setDocumentos([]);
    };

    // Descarga un documento por su Id (blob)
    const descargarDocs = async (doc) => {
        if (!doc?.idDocumento) return;
        setDescargandoId(doc.idDocumento);
        try {
            const res = await descargarDocumento(doc.idDocumento);
            const blob = res.data;
            const urlObj = URL.createObjectURL(blob);
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

    const handleChangePage = (event, newPage) => setPage(newPage);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Typography variant="h5" color="text.primary" fontWeight="bold" sx={{ mb: 1 }}>
                Búsqueda Rápida
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Consulta ágil de expedientes y generación de reportes.
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por nombre del propietario"
                    value={busqueda}
                    onChange={manejarBusqueda}
                    sx={{ backgroundColor: '#fff' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                    }}
                />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Registros de expedientes
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Table size="medium">
                    <TableHead sx={{ backgroundColor: '#fafafa' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary' }}>No.</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Número de Expediente</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Nombre Completo</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Estructura</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>Estado</TableCell>
                            <TableCell align="center" sx={{ color: 'text.secondary' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cargando ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Stack spacing={1} sx={{ py: 2 }}>
                                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                                        <Skeleton variant="rounded" width={'100%'} height={45} />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ) : expedientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    No se encontraron expedientes
                                </TableCell>
                            </TableRow>
                        ) : (
                            expedientes.map((row, index) => {
                                const estado = ESTADO_MAP[row.estado] || { label: 'Desconocido', color: '#757575' };
                                return (
                                    <TableRow key={row.id ?? index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{page * ROWS_PER_PAGE + index + 1}</TableCell>
                                        <TableCell>{row.codigo || row.noExp || 'S/D'}</TableCell>
                                        <TableCell>{row.nombreCompleto || row.nombre || 'S/D'}</TableCell>
                                        <TableCell>{row.estructura || row.ubicacion || 'S/D'}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color={estado.color}>
                                                {estado.label}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => abrirMenuOpciones(e, row)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={total}
                    rowsPerPage={ROWS_PER_PAGE}
                    page={page}
                    onPageChange={handleChangePage}
                    labelRowsPerPage="Filas:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                />
            </TableContainer>

            {/* Menú flotante de acciones */}
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={cerrarMenuOpciones}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ elevation: 3, sx: { minWidth: 200, mt: 0.5 } }}
            >
                <MenuItem onClick={abrirModal}>
                    <ListItemIcon><DescriptionIcon fontSize="small" color="primary" /></ListItemIcon>
                    Ficha
                </MenuItem>
                <MenuItem onClick={generarConstancia}>
                    <ListItemIcon><AssignmentIcon fontSize="small" color="secondary" /></ListItemIcon>
                    Constancia
                </MenuItem>
                <Divider />
                <MenuItem onClick={abrirDocumentos}>
                    <ListItemIcon><FolderSharedIcon fontSize="small" color="info" /></ListItemIcon>
                    Documentos Digitales
                </MenuItem>
            </Menu>

            {/* Modal de opciones de impresiÃ³n */}
            <Dialog open={modalImpresionAbierto} onClose={cerrarModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    <PrintIcon /> Opciones de Impresión
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Seleccione las secciones del expediente que desea incluir en el documento:
                    </Typography>

                    <FormGroup sx={{ gap: 1 }}>
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.fichaCompleta} onChange={manejarCambioCheckbox} name="fichaCompleta" color="primary" />}
                            label={<Typography fontWeight="bold">Imprimir toda la información (Ficha Completa)</Typography>}
                        />
                        <Divider sx={{ my: 1 }} />

                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.infoPersonal} onChange={manejarCambioCheckbox} name="infoPersonal" disabled={opcionesImpresion.fichaCompleta} />}
                            label="InformaciÃ³n Personal"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.infoFamiliar} onChange={manejarCambioCheckbox} name="infoFamiliar" disabled={opcionesImpresion.fichaCompleta} />}
                            label="InformaciÃ³n Familiar"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.trayectoria} onChange={manejarCambioCheckbox} name="trayectoria" disabled={opcionesImpresion.fichaCompleta} />}
                            label="Trayectoria Laboral e Historial de Bajas"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={opcionesImpresion.perfilAcademico} onChange={manejarCambioCheckbox} name="perfilAcademico" disabled={opcionesImpresion.fichaCompleta} />}
                            label="Perfil AcadÃ©mico y Cursos"
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={cerrarModal} color="inherit" startIcon={<CancelIcon />}>
                        CANCELAR
                    </Button>
                    <Button onClick={mandarAImprimir} variant="contained" color="primary" startIcon={<PrintIcon />}>
                        GENERAR DOCUMENTO
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Vista previa del PDF */}
            <ModalVistaPreviaPDF
                abierto={vistaPreviaAbierta}
                pdfUrl={pdfUrl}
                nombreDescarga={nombreDescarga}
                cargando={generandoPDF}
                alCerrar={cerrarVistaPrevia}
            />

            {/* Modal de Documentos Digitales */}
            <Dialog open={modalDocsAbierto} onClose={cerrarDocumentos} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    <FolderSharedIcon /> Documentos Digitales
                    {empleadoSeleccionado?.nombreCompleto && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 'normal' }}>
                            — {empleadoSeleccionado.nombreCompleto}
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
                    <Button onClick={cerrarDocumentos} color="inherit" startIcon={<CancelIcon />}>
                        CERRAR
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

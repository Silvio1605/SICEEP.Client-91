import React, { useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button, CircularProgress, Box,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Modal que muestra la vista previa del PDF de la ficha del expediente.
 * Recibe la objectURL generada y permite descargar o cerrar.
 * @param {boolean} abierto - Controla la visibilidad.
 * @param {string} pdfUrl - ObjectURL del PDF a previsualizar.
 * @param {string} nombreDescarga - Nombre del archivo al descargar.
 * @param {boolean} cargando - Muestra el spinner mientras genera el PDF.
 * @param {function} alCerrar - Al cerrar el modal.
 */
export default function ModalVistaPreviaPDF({ abierto, pdfUrl, nombreDescarga, cargando, alCerrar }) {
    const iframeRef = useRef(null);

    // Mantiene enfocado el iframe cuando se abre
    useEffect(() => {
        if (abierto && iframeRef.current && pdfUrl) {
            iframeRef.current.focus();
        }
    }, [abierto, pdfUrl]);

    const descargar = () => {
        if (!pdfUrl) return;
        const enlace = document.createElement('a');
        enlace.href = pdfUrl;
        enlace.download = nombreDescarga || 'Ficha-Expediente.pdf';
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    };

    return (
        <Dialog open={abierto} onClose={alCerrar} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { height: '90vh' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PrintIcon /> Vista Previa del Documento
            </DialogTitle>

            <DialogContent dividers sx={{ position: 'relative' }}>
                {cargando ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Generando documento...
                        </Typography>
                    </Box>
                ) : pdfUrl ? (
                    <iframe
                        ref={iframeRef}
                        src={pdfUrl}
                        title="Vista previa del documento"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
                        <Typography color="text.secondary">No se pudo generar la vista previa.</Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button onClick={alCerrar} color="inherit" startIcon={<CloseIcon />}>
                    CERRAR
                </Button>
                <Button
                    onClick={descargar}
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    disabled={!pdfUrl || cargando}
                >
                    DESCARGAR
                </Button>
            </DialogActions>
        </Dialog>
    );
}

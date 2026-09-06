import { useState } from 'react';
import {
    Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    FormGroup, FormControlLabel, Checkbox, Divider
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';

const opcionesImpresionPorDefecto = {
    fichaCompleta: false,
    infoPersonal: false,
    infoFamiliar: false,
    trayectoria: false,
    perfilAcademico: false
};

export default function ModalOpcionesImpresion({ abierto, alCerrar, onImprimir }) {

    // El padre re-monta este modal (key) en cada apertura, así siempre inicia con los valores por defecto
    const [opcionesImpresion, setOpcionesImpresion] = useState(opcionesImpresionPorDefecto);

    const manejarCambioCheckbox = (event) => {
        const { name, checked } = event.target;
        setOpcionesImpresion((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    return (
        <Dialog open={abierto} onClose={alCerrar} maxWidth="sm" fullWidth>
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
                        label="Información Personal"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={opcionesImpresion.infoFamiliar} onChange={manejarCambioCheckbox} name="infoFamiliar" disabled={opcionesImpresion.fichaCompleta} />}
                        label="Información Familiar"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={opcionesImpresion.trayectoria} onChange={manejarCambioCheckbox} name="trayectoria" disabled={opcionesImpresion.fichaCompleta} />}
                        label="Trayectoria Laboral e Historial de Bajas"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={opcionesImpresion.perfilAcademico} onChange={manejarCambioCheckbox} name="perfilAcademico" disabled={opcionesImpresion.fichaCompleta} />}
                        label="Perfil Académico y Cursos"
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={alCerrar} color="inherit" startIcon={<CancelIcon />}>
                    CANCELAR
                </Button>
                <Button onClick={() => onImprimir(opcionesImpresion)} variant="contained" color="primary" startIcon={<PrintIcon />}>
                    GENERAR DOCUMENTO
                </Button>
            </DialogActions>
        </Dialog>
    );
}
import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    FormGroup, FormControlLabel, Checkbox, Divider, Typography, Button 
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

/**
 * Componente modal para seleccionar las secciones del expediente a imprimir.
 * @param {boolean} abierto - Controla la visibilidad del modal.
 * @param {function} alCerrar - Función que se ejecuta al cerrar el modal.
 * @param {function} alImprimir - Función que se ejecuta al confirmar la impresión, retorna las opciones seleccionadas.
 */
export default function ModalImpresion({ abierto, alCerrar, alImprimir }) {
    // Estado local para manejar las casillas de verificación
    const [opciones, setOpciones] = useState({
        personal: false,
        familiar: false,
        laboral: false,
        academica: false,
        todo: false
    });

    // Reinicia las opciones cada vez que el modal se abre
    useEffect(() => {
        if (abierto) {
            setOpciones({ personal: false, familiar: false, laboral: false, academica: false, todo: false });
        }
    }, [abierto]);

    /**
     * Maneja la lógica de selección de las casillas.
     */
    const manejarCambioCheckbox = (event) => {
        const { name, checked } = event.target;
        
        if (name === 'todo') {
            setOpciones({ personal: checked, familiar: checked, laboral: checked, academica: checked, todo: checked });
        } else {
            const nuevasOpciones = { ...opciones, [name]: checked };
            const todasMarcadas = nuevasOpciones.personal && nuevasOpciones.familiar && nuevasOpciones.laboral && nuevasOpciones.academica;
            setOpciones({ ...nuevasOpciones, todo: todasMarcadas });
        }
    };

    const manejarConfirmacion = () => {
        alImprimir(opciones);
        alCerrar();
    };

    const haySeleccion = opciones.personal || opciones.familiar || opciones.laboral || opciones.academica || opciones.todo;

    return (
        <Dialog open={abierto} onClose={alCerrar} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PrintIcon /> Opciones de Impresión
            </DialogTitle>
            
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Seleccione las secciones del expediente que desea incluir en el documento:
                </Typography>
                
                <FormGroup>
                    <FormControlLabel 
                        control={<Checkbox name="todo" checked={opciones.todo} onChange={manejarCambioCheckbox} color="primary" />} 
                        label={<Typography fontWeight="bold">Imprimir toda la información (Ficha Completa)</Typography>} 
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel control={<Checkbox name="personal" checked={opciones.personal} onChange={manejarCambioCheckbox} />} label="Información Personal" />
                    <FormControlLabel control={<Checkbox name="familiar" checked={opciones.familiar} onChange={manejarCambioCheckbox} />} label="Información Familiar" />
                    <FormControlLabel control={<Checkbox name="laboral" checked={opciones.laboral} onChange={manejarCambioCheckbox} />} label="Trayectoria Laboral e Historial de Bajas" />
                    <FormControlLabel control={<Checkbox name="academica" checked={opciones.academica} onChange={manejarCambioCheckbox} />} label="Perfil Académico y Cursos" />
                </FormGroup>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button onClick={alCerrar} color="inherit">CANCELAR</Button>
                <Button 
                    onClick={manejarConfirmacion} 
                    variant="contained" 
                    startIcon={<PrintIcon />}
                    disabled={!haySeleccion}
                >
                    GENERAR DOCUMENTO
                </Button>
            </DialogActions>
        </Dialog>
    );
}
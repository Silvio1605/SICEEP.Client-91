import React, { useState, useCallback, useMemo } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Funciones para evitar que el botón de mostrar/ocultar contraseña tome el foco al hacer clic
const handleMouseDownContra = (event) => {
    event.preventDefault();
};
const handleMouseUpContra = (event) => {
    event.preventDefault();
};

function ModalSeleccion({
    open,
    onClose,
    titulo,
    rows,
    columns,
    getRowId,
    onBuscar,
    onSeleccionar,
    placeholder
}) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [buscarP, setBuscar] = useState(''); 

    const manejarCambioInput = (e) => {
        setBuscar(e.target.value);
    };

  return (
    <p>Hello world!</p>
  );
}

export default ModalSeleccion;
export const columnsBitacora = ({ isMobile }) => [
    {
        field: 'id', headerName: 'No.', flex: 1, minWidth: 5,
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'usuario', headerName: 'Usuario', flex: 1, minWidth: 30,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    {
        field: 'accion', headerName: 'Acción Ejecutada', flex: 2, minWidth: 50,
        align: 'center', headerAlign: 'center'
    },
    !isMobile && {
        field: 'fechaModificacion', headerName: 'Fecha Modificación', flex: 2, minWidth: 20,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
        valueFormatter: (value) => {
            if (!value) return '';

            return new Date(value).toLocaleString('es-NI', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

].filter(Boolean);

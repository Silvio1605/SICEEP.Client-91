import IconButton from '@mui/material/IconButton';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export const columnsPropietarios = ({ Seleccion }) => [
    {
        field: 'codigo', headerName: 'Codigo', flex: 1, minWidth: 80,
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 4, minWidth: 250,
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'acciones', headerName: 'Acciones', flex: 1, minWidth: 80,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
            return (
                <IconButton color="primary" aria-label="select" onClick={() => Seleccion(params.row)}>
                    <HowToRegIcon />
                </IconButton>
            );
        }
    },

];
import { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Confirm from '../../../shared/components/Confirm';
import { useNotificacionContext } from '../../../providers/Notificacion/useNotificacionContext';
import FormularioInstitucion from '../components/FormularioInstitucion';
import { listarInstituciones, eliminarInstitucion } from '../services/institucionesService';

export default function InstitucionesAcademicas() {
    const { mostrarNotificacion } = useNotificacionContext();
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [openFormulario, setOpenFormulario] = useState(false);
    const [seleccionada, setSeleccionada] = useState(null);
    const [aEliminar, setAEliminar] = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            const data = await listarInstituciones();
            setRegistros(data ?? []);
        } catch {
            setRegistros([]);
            mostrarNotificacion({
                message: "No se pudieron cargar las instituciones",
                severity: "error",
            });
        } finally {
            setCargando(false);
        }
    }, [mostrarNotificacion]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    const abrirNueva = () => {
        setSeleccionada(null);
        setOpenFormulario(true);
    };

    const abrirEdicion = (fila) => {
        setSeleccionada(fila);
        setOpenFormulario(true);
    };

    const cerrarFormulario = () => {
        setOpenFormulario(false);
        setSeleccionada(null);
    };

    const confirmarEliminar = async () => {
        try {
            await eliminarInstitucion(aEliminar.idInstitucion);
            mostrarNotificacion({ message: "Institución eliminada correctamente", severity: "success" });
            setAEliminar(null);
            await cargar();
        } catch (error) {
            mostrarNotificacion({
                message: typeof error === "string" ? error : "Error al eliminar la institución",
                severity: "error",
            });
        }
    };

    const columnas = useMemo(() => [
        {
            field: 'idInstitucion',
            headerName: 'ID',
            width: 70,
            headerClassName: 'header-negrita',
        },
        {
            field: 'nombre',
            headerName: 'NOMBRE',
            flex: 2,
            minWidth: 200,
            headerClassName: 'header-negrita',
        },
        {
            field: 'siglas',
            headerName: 'SIGLAS',
            width: 120,
            headerClassName: 'header-negrita',
        },
        {
            field: 'nombreTipoInstitucion',
            headerName: 'TIPO',
            width: 180,
            headerClassName: 'header-negrita',
            renderCell: ({ value }) => <Chip label={value} size="small" variant="outlined" />,
        },
        {
            field: 'nombrePais',
            headerName: 'PAÍS',
            width: 140,
            headerClassName: 'header-negrita',
        },
        {
            field: 'departamento',
            headerName: 'DEPARTAMENTO',
            flex: 1.2,
            minWidth: 140,
            headerClassName: 'header-negrita',
        },
        {
            field: 'municipio',
            headerName: 'MUNICIPIO',
            flex: 1.2,
            minWidth: 140,
            headerClassName: 'header-negrita',
        },
        {
            field: 'acciones',
            headerName: 'ACCIONES',
            width: 130,
            sortable: false,
            filterable: false,
            headerClassName: 'header-negrita',
            renderCell: ({ row }) => (
                <Box>
                    <IconButton size="small" color="primary" title="Editar" onClick={() => abrirEdicion(row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" title="Eliminar" onClick={() => setAEliminar(row)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ], []);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <AccountBalanceIcon color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                            <Typography variant="h5" component="h1" color="text.primary">
                                Instituciones Académicas
                            </Typography>
                            <Typography variant="subtitle1" component="h1" color="text.secondary">
                                Catálogo de instituciones y centros de estudio
                            </Typography>
                        </Box>
                    </Stack>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={abrirNueva}>
                        Agregar Institución
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ width: '100%', minWidth: 0 }}>
                <Typography variant="subtitle1" component="h1" color="text.secondary" sx={{ mb: 1 }}>
                    Registros del catálogo
                </Typography>

                {cargando && registros.length === 0 ? (
                    <Stack spacing={1}>
                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                        <Skeleton variant="rounded" width={'100%'} height={60} />
                    </Stack>
                ) : (
                    <DataGrid
                        rows={registros}
                        columns={columnas}
                        getRowId={(row) => row.idInstitucion}
                        autoHeight
                        disableColumnMenu
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slots={{ toolbar: null }}
                        loading={cargando}
                        localeText={{
                            noRowsLabel: "No hay instituciones registradas",
                            noResultsOverlayLabel: "No se encontraron resultados",
                            MuiTablePagination: { labelRowsPerPage: "Filas:" }
                        }}
                        sx={{
                            border: 'none',
                            backgroundColor: '#ffffff',
                            '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                            '& .header-negrita': { fontWeight: 'bold' },
                        }}
                    />
                )}
            </Box>

            <FormularioInstitucion
                open={openFormulario}
                onClose={cerrarFormulario}
                institucion={seleccionada}
                onCambios={cargar}
            />

            <Confirm
                open={aEliminar !== null}
                handleClose={() => setAEliminar(null)}
                onConfirm={confirmarEliminar}
                title="Eliminar Institución"
                content={`¿Estás seguro de que deseas eliminar "${aEliminar?.nombre ?? ''}"? Esta acción no se puede deshacer.`}
            />
        </Box>
    );
}
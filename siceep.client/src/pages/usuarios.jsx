/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
import { useTheme, useMediaQuery } from "@mui/material";
import { columnsUsuarios } from '../services/usuariosData';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import PerfilUsuarioDialog from '../components/Dialog/PerfilUsuarioDialog';
import SelectItem from '../components/SelectItem';
//extraer datos de la api
import { getUsuarios } from './../services/usuarioService';
import { getSelectUsuario } from './../services/selectService';


export default function usuarios() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    //datos de la busqueda con filtro
    const [año, setAño] = useState("");
    const [filtro, setFiltro] = useState({
        propietario: "",
        fechaExpiracionDesde: null,
        fechaExpiracionHasta: null,
        estado: null,
        pagina: 1,
        tamañoPagina: 10
    });

    //datos de seleccion (filtro)
    const [selEstado, setSelEstado] = useState([]);
    const [selAño, setSelAño] = useState([]);

    //datos de los usuarios
    const [usuarios, setUsuariosData] = useState([]);

    useEffect(() => {
        let isMountedSel = true;

        const cargarSelect = async () => {
            try {
                //cargar datos de seleccion
                const res = await getSelectUsuario();

                if (isMountedSel) {
                    setSelEstado(res.data.Estados);
                    setSelAño(res.data.Años);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        cargarSelect();
        return () => {
            isMountedSel = false;
        };
    }, []);


    const handleBuscar = async () => {
        try {
            
            if (filtro.estado === "") {
                filtro.estado = null;
            }
            const res = await getUsuarios(filtro);
            setUsuariosData(res.data.data);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    //logica para abrir perfil de usuario
    const [openPerfil, setOpenPerfil] = useState(false);
    
    const abrirPerfil = useCallback(() => {
        setOpenPerfil(true);
    }, []);

    const cerrarPerfil = useCallback(() => {
        setOpenPerfil(false);
    }, []);

    const registros = useMemo(() => {
        return columnsUsuarios({ isMobile, abrirPerfil });
    }, [isMobile, abrirPerfil]);

    const slots = useMemo(() => ({ toolbar: GridToolbar }), []);

    return (
        
        // Box con padding general y fondo suave
        <Box>
            <Typography variant="h5" component="h1" color="text.primary">
                Gestion de Usuarios
            </Typography>
            <Typography variant="subtitle1" component="h1" color="text.secundary">
                Control de cuentas de usuario
            </Typography>
            <Box sx={{ m: '0px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Nuevo Usuario
                </Button>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    width: '98%',
                    // Estilos para la tabla
                    '& .MuiDataGrid-root': {
                        borderRadius: 2,
                        boxShadow: 3,
                        borderColor: 'grey.300',
                    },
                    '& .header-negrita': {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        boxShadow: 3,
                        padding: 2,
                        mb: 2,
                        mt: 2,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="subtitle1" component="h1" color="text.secundary">
                        Búsqueda de cuentas de usuario
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,              // espacio entre elementos
                            alignItems: "center" // alineación vertical
                        }}
                    >
                        <Paper
                            component="form"
                            sx={{ m: '10px 0px', p: '2px 2px', display: 'flex', alignItems: 'flex-end', width: '50%' }}
                        >
                            <InputBase
                                name="propietario"
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Búscar por nombre del propietario"
                                inputProps={{ 'aria-label': 'Busqueda Usuarios' }}
                                value={filtro.propietario}
                                onChange={(e) =>
                                    setFiltro(prev => ({
                                        ...prev,
                                        [e.target.name]: e.target.value
                                    }))
                                }
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleBuscar}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                        <SelectItem
                            value={filtro.estado}
                            onChange={(estado) =>
                                setFiltro(prev => ({
                                    ...prev,
                                    estado: estado
                                }))
                            }
                            datos={selEstado}
                            titulo={"Estados"}
                        />
                        <SelectItem
                            value={año}
                            onChange={(año) => {

                                setAño(año);
                                if (!año) {
                                    setFiltro(prev => ({
                                        ...prev,
                                        fechaExpiracionDesde: null,
                                        fechaExpiracionHasta: null
                                    }));
                                    return;
                                }

                                setFiltro(prev => ({
                                    ...prev,
                                    fechaExpiracionDesde: `${año}-01-01`,
                                    fechaExpiracionHasta: `${año}-12-31`
                                }));
                            }}
                            datos={selAño}
                            titulo={"Año Vencimiento"}
                        />
                    </Box>
                    
                </Box>
                
                <Typography variant="subtitle1" component="h1" color="text.secundary">
                    Registros de cuentas
                </Typography>
                {/* DataGrid */}
                <DataGrid
                    rows={usuarios}
                    columns={registros} // Columnas con flex: 1 aplicado
                    // Configuramos el GridToolbar
                    slots={slots}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    localeText={{
                        noRowsLabel: "No hay datos",
                        noResultsOverlayLabel: "No se encontraron resultados",
                        MuiTablePagination: {
                            labelRowsPerPage: "Filas:"
                        }
                    }}
                />
            </Box>

            <PerfilUsuarioDialog
                open={openPerfil}
                onClose={cerrarPerfil}
            />
        </Box>
    )
}


import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useSelectEmpleado } from './../hooks/useSelectEmpleado';
import SelectItem from './../../../shared/components/SelectItem';

export default function FiltroExpediente({ filtro, actualizarFiltro, buscar }) {

    const { selEstado, loading } = useSelectEmpleado();

    const [inputFiltro, setInputFiltro] = useState(filtro.busqueda || "");
    const [inputEstructura, setInputEstructura] = useState(filtro.estructura || "");
    const [inputCargo, setInputCargo] = useState(filtro.cargo || "");
    
    const [activeFilter, setActiveFilter] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        actualizarFiltro({
            ...filtro,
            busqueda: inputFiltro,
            estructura: activeFilter ? inputEstructura : "",
            cargo: activeFilter ? inputCargo : "",
            estado: activeFilter ? filtro.estado : null
        });
        buscar(filtro);
    };

    const toggle = () => {
        setActiveFilter(prev => !prev);
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            variant="outlined"
            sx={{
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 2,
                backgroundColor: '#f8f9fa',
                borderColor: '#e0e0e0',
                borderRadius: 2,
                width: '100%',
            }}
        >
            {/* 1. BUSCADOR PRINCIPAL (El flex: 1 empuja los selectores a la derecha) */}
            <Box
                sx={{
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    backgroundColor: '#f8f9fa',
                    borderColor: '#e0e0e0',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,              // ← Ocupa el ancho restante
                            minWidth: 0,          // ← Permite que se ajuste
                            border: '1px solid #ced4da',
                            borderRadius: 1,
                            backgroundColor: '#fff',
                            px: 1,
                            py: 0.5,
                        }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, minWidth: 0 }}
                            type="text"
                            placeholder="Buscar por nombre"
                            value={inputFiltro}
                            onChange={(e) => setInputFiltro(e.target.value)}
                        />
                        <IconButton aria-label="search" color="primary" type="submit">
                            <SearchIcon />
                        </IconButton>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                color="primary"
                                aria-label="add to shopping cart"
                                onClick={toggle}
                            >
                                {activeFilter === true ? <FilterAltOffIcon /> : <FilterAltIcon /> }
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>
               
            </Box>

            {activeFilter && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%' }}>
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ced4da',
                            borderRadius: 1,
                            backgroundColor: '#ffffff',
                            px: 1, py: 0.5
                        }}>
                            <InputBase sx={{ ml: 1, flex: 1 }}
                                placeholder="Buscar por Estructura"
                                value={inputEstructura}
                                onChange={(e) => setInputEstructura(e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ced4da',
                            borderRadius: 1,
                            backgroundColor: '#ffffff',
                            px: 1, py: 0.5
                        }}>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Buscar por Cargo"
                                value={inputCargo}
                                onChange={(e) => setInputCargo(e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <SelectItem
                                value={filtro.estado || ""}
                                onChange={(estado) => {
                                    actualizarFiltro({ estado: estado});
                                }}
                                incluirTodo={true}
                                datos={selEstado}
                                titulo="Estados"
                            />
                        )}
                    </Box>
                    
                </Box>
            )}
            
        </Paper>
    );
}


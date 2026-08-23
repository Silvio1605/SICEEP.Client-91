import { useState, useEffect, useContext } from 'react';
import {
    Box, Grid, TextField, Typography, Paper, MenuItem,
    Divider, Autocomplete, CircularProgress, Alert, InputAdornment, Chip
} from '@mui/material';
//iconos
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalculateIcon from '@mui/icons-material/Calculate';

import SelectItemB from './../../../../shared/components/Select/SelectItemB';
import { useSelectPlaza } from './../../hooks/useSelectPlaza'; 
import { ExpedienteContext } from './../../context/ExpedienteContext';


const selTipoContrato = [
    { id: 'P', nombre: 'PLANTA' },
    { id: 'A', nombre: 'AUXILIAR' },
];

// Definir el tipo de Plaza según tu modelo
export default function TabInfoLaboral() {

    const { plazas, loading, error, buscarPlazas } = useSelectPlaza();
    const { expediente, actualizarSeccion, actualizarCampo } = useContext(ExpedienteContext);

    // Estados para los campos (ejemplo)
    const [salarioMensual, setSalarioMensual] = useState(expediente.contrato?.salarioMensual || '');
    const [devengado, setDevengado] = useState('');
    const [deducciones, setDeducciones] = useState('');

    // Calcular salario bruto y neto (ejemplo)
    const salarioBruto = parseFloat(salarioMensual) || 0;
    const totalDeducciones = parseFloat(deducciones) || 0;
    const salarioNeto = salarioBruto - totalDeducciones;

    const [plazaSeleccionada, setPlazaSeleccionada] = useState(expediente.contrato?.plaza || null);

    useEffect(() => {
        if (!expediente.contrato) {
            // Si la sección está vacía, la creamos con valores predeterminados
            actualizarSeccion('contrato', {
                ordinal: null,
                numInss: '',
                tipoContrato: 'P',
                fechaInicio: null,
                fechaCese: null,
                salarioMensual: '',
            });
        }

    }, [expediente, actualizarSeccion]); 

    const contrato = expediente.contrato || {};

    // Manejador para cambios en campos simples
    const handleChangeSimple = (campo, valor) => {
        actualizarCampo('contrato', campo, valor);
    };

    // Manejador para cambios en selects (usando SelectItemB)
    const handleSelectChange = (campo, valor) => {
        actualizarCampo('contrato', campo, valor);
    };

    const handlePlazaSelected = (plazaSelect) => {
        setPlazaSeleccionada(plazaSelect);
        actualizarCampo('contrato', 'ordinal', plazaSelect.ordinal);
        actualizarCampo('contrato', 'salarioMensual', plazaSelect.salario);
    }

    return (
        <Box>
            
            {/* 1. INFORMACIÓN DEL CONTRATO (Arriba, como en tu boceto) */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información del Contrato
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Numero de seguro Inss"
                            value={contrato.numInss || ''}
                            onChange={(e) => handleChangeSimple('numInss', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box>
                            <SelectItemB
                                value={contrato.tipoContrato || 'P'}
                                onChange={(value) => handleSelectChange('tipoContrato', value)}
                                datos={selTipoContrato}
                                titulo=""
                            />
                        </Box>
                        
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Fecha de Ingreso"
                            InputLabelProps={{ shrink: true }}
                            value={contrato.fechaInicio || ''}
                            onChange={(e) => handleChangeSimple('fechaInicio', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Fecha de Cese"
                            InputLabelProps={{ shrink: true }}
                            value={contrato.fechaCese || ''}
                            onChange={(e) => handleChangeSimple('fechaCese', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* 2. INFORMACIÓN DE LA PLAZA (Aquí están los campos fusionados de Ubicación) */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información de la Plaza
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Búsqueda de plaza */}
                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            freeSolo
                            options={plazas}
                            getOptionLabel={(option) => option?.ordinal || ''}
                            loading={loading}
                            onInputChange={(_, newValue) => buscarPlazas(newValue)}
                            onChange={(_, newValue) => handlePlazaSelected(newValue)}
                            value={plazaSeleccionada}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Código de Plaza"
                                    placeholder="Buscar por código"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                        endAdornment: (
                                            <>
                                                {loading && <CircularProgress color="inherit" size={20} />}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                            renderOption={(props, plazas) => {
                                const { key, ...restProps } = props;
                                return (
                                    <li key={key} {...restProps}>
                                        <div>
                                            <div><strong>{plazas.ordinal}</strong> - {plazas.cargo}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'gray' }}>
                                                {plazas.estructura} - {plazas.unidad}
                                            </div>
                                        </div>
                                    </li>
                                );
                            }}
                        />
                        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                    </Grid>

                    {/* Datos de la plaza seleccionada */}
                    {plazaSeleccionada && (
                        <>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    id="codigo-plaza"
                                    fullWidth size="small"
                                    label="Codigo de la Plaza"
                                    value={plazaSeleccionada.ordinal || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    id="orden-plaza"
                                    fullWidth size="small"
                                    label="Orden"
                                    value={plazaSeleccionada.orden || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    id="estructura-plaza"
                                    fullWidth size="small"
                                    label="Estructura"
                                    value={plazaSeleccionada.estructura || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    id="unidad-administrativa-plaza"
                                    fullWidth size="small"
                                    label="Unidad Administrativa"
                                    value={plazaSeleccionada.unidad || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    id="cargo-plaza"
                                    fullWidth size="small"
                                    label="Cargo Asignado"
                                    value={plazaSeleccionada.cargo || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    id="categoria-plaza"
                                    fullWidth size="small"
                                    label="Nivel / Categoría"
                                    value={plazaSeleccionada.categoria || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    id="salario-Presupuestado-plaza"
                                    fullWidth size="small"
                                    label="Salario Presupuestado"
                                    value={plazaSeleccionada.salario || ''}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                                
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    id="salario-plaza"
                                    fullWidth
                                    size="small"
                                    label="Salario Ordinario"
                                    variant="outlined"
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                    value={contrato.salarioMensual || ''}
                                    onChange={(e) => {
                                        handleChangeSimple('salarioMensual', e.target.value);
                                    }}
                                />
                            </Grid>
                        </>
                    )}
                    {!plazaSeleccionada && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="textSecondary" align="center">
                                No se ha seleccionado ninguna plaza.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* 3. DESGLOSE SALARIAL (Abajo, con su borde verde) */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Desglose Salarial
            </Typography>

            <Paper elevation={1} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>

                    {/* Primera fila: Ingresos */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                            INGRESOS
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Salario Mensual"
                                    value={salarioMensual}
                                    onChange={(e) => setSalarioMensual(e.target.value)}
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Devengado"
                                    value={devengado}
                                    onChange={(e) => setDevengado(e.target.value)}
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Segunda fila: Deducciones */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                            DEDUCCIONES
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Deducciones Totales"
                                    value={deducciones}
                                    onChange={(e) => setDeducciones(e.target.value)}
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Tercera fila: Totales con estilo */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                            TOTALES
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Salario Bruto"
                                    value={salarioBruto.toFixed(2)}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                        sx: { backgroundColor: '#f5f5f5' }
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Salario Neto"
                                    value={salarioNeto.toFixed(2)}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                        sx: {
                                            backgroundColor: '#e8f5e9',
                                            fontWeight: 'bold',
                                            '& .MuiInputBase-input': { fontWeight: 'bold', color: '#2e7d32' }
                                        }
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#2e7d32', borderWidth: 2 }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    );
}
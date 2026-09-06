import {
    Autocomplete, Alert, Box, CircularProgress, Grid, InputAdornment, Paper, TextField, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SelectItemB from './../../../shared/components/Select/SelectItemB';

const selTipoContrato = [
    { id: 'P', nombre: 'PLANTA' },
    { id: 'A', nombre: 'AUXILIAR' },
];

export default function FormContratoPlaza({
    value,
    onChange,
    plazas,
    loading,
    error,
    buscarPlazas,
    freeSolo = true,
    requerirInss = false
}) {

    const contrato = value || {};
    const plazaSeleccionada = contrato.plaza || null;

    const handlePlazaSelected = (plazaSelect) => {
        const esObjeto = plazaSelect && typeof plazaSelect === 'object';
        const esPlazaValida = esObjeto && !!plazaSelect.ordinal;

        // 1) Selección real de la lista -> guarda la plaza completa
        if (esPlazaValida) {
            onChange('plaza', plazaSelect);
            onChange('ordinal', plazaSelect.ordinal);
            onChange('salarioMensual', Number(plazaSelect.salario) || 0);
            return;
        }

        // 2) Código tecleado manualmente (solo cuando freeSolo) -> conserva el texto en ordinal
        if (typeof plazaSelect === 'string' && plazaSelect.trim()) {
            onChange('plaza', null);
            onChange('ordinal', plazaSelect.trim());
            return;
        }

        // 3) Limpieza / nada
        onChange('plaza', null);
        onChange('ordinal', null);
        onChange('salarioMensual', 0);
    };

    return (
        <Box>
            {/* 1. INFORMACIÓN DEL CONTRATO */}
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
                            required={requerirInss}
                            error={requerirInss && (contrato.numInss === '' || contrato.numInss === null)}
                            onChange={(e) => onChange('numInss', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box>
                            <SelectItemB
                                value={contrato.tipoContrato || 'P'}
                                onChange={(v) => onChange('tipoContrato', v)}
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
                            onChange={(e) => onChange('fechaInicio', e.target.value)}
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
                            onChange={(e) => onChange('fechaCese', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* 2. INFORMACIÓN DE LA PLAZA */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información de la Plaza
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Búsqueda de plaza */}
                    <Grid size={{ xs: 12 }}>
                        <Autocomplete
                            freeSolo={freeSolo}
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
                            renderOption={(props, opcion) => {
                                const { key, ...restProps } = props;
                                return (
                                    <li key={key} {...restProps}>
                                        <div>
                                            <div><strong>{opcion.ordinal}</strong> - {opcion.cargo}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'gray' }}>
                                                {opcion.estructura} - {opcion.unidad}
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
                                    required
                                    label="Salario Ordinario"
                                    variant="outlined"
                                    placeholder="0.00"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                    value={contrato.salarioMensual || ''}
                                    error={!(Number(contrato.salarioMensual) > 0)}
                                    helperText={!(Number(contrato.salarioMensual) > 0) ? 'El salario mensual es requerido y debe ser mayor a 0' : ''}
                                    onChange={(e) => {
                                        onChange('salarioMensual', parseFloat(e.target.value) || 0);
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
        </Box>
    );
}
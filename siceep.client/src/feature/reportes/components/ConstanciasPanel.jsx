import { Box, Autocomplete, Button, Chip, Divider, Paper, Skeleton, Stack, TextField, Tooltip, Typography, Alert } from '@mui/material';
import AssignmentIndOutlined from '@mui/icons-material/AssignmentIndOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import PersonOffOutlined from '@mui/icons-material/PersonOffOutlined';
import TimelineOutlined from '@mui/icons-material/TimelineOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useConstancias } from './../hooks/useConstancias';

export default function ConstanciasPanel() {
    const {
        busqueda, buscar, empleados, buscando,
        empleado, seleccionarEmpleado,
        datosBaja, historial,
        cargandoDatos, generando, error,
        descripcionEstado, generar,
    } = useConstancias();

    const opciones = {
        general: { icon: <DescriptionOutlined fontSize="small" />, label: 'Constancia Laboral', title: 'Constancia general del empleado' },
        salarial: { icon: <PaymentsOutlined fontSize="small" />, label: 'Constancia Salarial', title: 'Constancia general con el salario mensual' },
        baja: { icon: <PersonOffOutlined fontSize="small" />, label: 'Constancia de Baja', title: 'Constancia por retiro del personal' },
        recorrido: { icon: <TimelineOutlined fontSize="small" />, label: 'Constancia de Recorrido', title: 'Recorrido laboral del empleado' },
    };

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
            <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIndOutlined fontSize="small" color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Constancias del Personal
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2.5, mt: 0.5 }}>
                Emitir constancias laborales, salariales, de baja y de recorrido laboral por empleado.
            </Typography>
            <Divider sx={{ mx: 2.5, my: 2 }} />
            <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Autocomplete
                    options={empleados}
                    loading={buscando}
                    noOptionsText={busqueda.trim().length >= 2 ? 'Sin resultados' : 'Escriba al menos 2 letras'}
                    getOptionLabel={(op) => `${op.codigo || ''} - ${op.nombreCompleto || ''}`}
                    isOptionEqualToValue={(op, val) => op?.id === val?.id}
                    onChange={(_, valor) => seleccionarEmpleado(valor)}
                    onInputChange={(_, valor) => buscar(valor)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar empleado"
                            placeholder="Nombre, carnet o cédula"
                            size="small"
                        />
                    )}
                    renderOption={(props, op) => (
                        <Box component="li" {...props}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {op.codigo || ''} - {op.nombreCompleto || ''}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {op.cargo || 'S/D'} · {op.estructura || 'S/D'}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    sx={{ maxWidth: 520 }}
                />

                {empleado && (
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                Empleado seleccionado:
                            </Typography>
                            <Chip
                                size="small"
                                color="primary"
                                label={`${empleado.codigo || ''} - ${empleado.nombreCompleto || ''}`}
                            />
                            <Chip
                                size="small"
                                variant="outlined"
                                color={empleado.estado === 1 ? 'error' : 'success'}
                                label={descripcionEstado(empleado)}
                            />
                        </Stack>

                        {cargandoDatos ? (
                            <Stack spacing={1}>
                                {[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={28} />)}
                            </Stack>
                        ) : (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
                                <Tooltip title={opciones.general.title}>
                                    <Button variant="outlined" startIcon={opciones.general.icon}
                                        disabled={generando} onClick={() => generar('general')}>
                                        {opciones.general.label}
                                    </Button>
                                </Tooltip>
                                <Tooltip title={opciones.salarial.title}>
                                    <Button variant="outlined" color="secondary" startIcon={opciones.salarial.icon}
                                        disabled={generando} onClick={() => generar('salarial')}>
                                        {opciones.salarial.label}
                                    </Button>
                                </Tooltip>
                                <Tooltip title={datosBaja ? opciones.baja.title : 'Solo disponible si el empleado cuenta con un registro de baja'}>
                                    <Button variant="outlined" color="error" startIcon={opciones.baja.icon}
                                        disabled={generando || !datosBaja} onClick={() => generar('baja')}>
                                        {opciones.baja.label}
                                    </Button>
                                </Tooltip>
                                <Tooltip title={historial?.length ? opciones.recorrido.title : 'Solo disponible si el empleado presenta recorrido laboral'}>
                                    <Button variant="outlined" startIcon={opciones.recorrido.icon}
                                        disabled={generando || !historial?.length} onClick={() => generar('recorrido')}>
                                        {opciones.recorrido.label}
                                    </Button>
                                </Tooltip>
                            </Stack>
                        )}

                        {error && <Alert severity="error">{error}</Alert>}
                        {generando && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <PictureAsPdfIcon fontSize="small" color="secondary" />
                                <Typography variant="body2" color="text.secondary">
                                    Generando PDF...
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                )}
            </Box>
        </Paper>
    );
}
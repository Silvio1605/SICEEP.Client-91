import { useContext, useMemo } from 'react';
import {
    Box, Grid, Typography, Paper, TextField, Button, Divider, MenuItem,
    Accordion, AccordionSummary, AccordionDetails, Chip, IconButton, Tooltip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import { ExpedienteContext } from './../../context/ExpedienteContext';
import { familiarVacio } from './../../utils/expedienteMappers';
import { useSelectParentesco, sexoSegunParentesco, ajustarDescendiente } from './../../hooks/Select/useSelectParentesco';

// Resumen de una linea para la cabecera del acordeon, para no repetir los
// nombres dentro del cuerpo desplegado.
const resumir = (f) => {
    const nombre = [f.pnombre, f.snombre, f.papellido, f.sapellido]
        .filter(Boolean)
        .join(' ')
        .trim();
    return nombre || 'Familiar sin nombre';
};

const Campo = ({ label, value, onChange, type = 'text', required = false, ...rest }) => (
    <Grid size={{  xs: 12, sm: 6, md: 3  }}>
        <TextField
            fullWidth size="small" type={type} label={label} required={required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
            {...rest}
        />
    </Grid>
);

export default function TabNucleofamiliar() {
    const { expediente, actualizarSeccion } = useContext(ExpedienteContext);
    const { parentescos, tiposUnion, loading } = useSelectParentesco();

    const nucleo = expediente.nucleoFamiliar || {};
    const familiares = nucleo.familiares || [];
    const sexoEmpleado = expediente.persona?.sexo;

    // El catalogo viene con id en camelCase desde la API; se normaliza una vez
    // para que el resto del componente use la misma forma.
    const catalogo = useMemo(
        () => parentescos.map((p) => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            generoAplicable: p.generoAplicable,
            esConyuge: !!p.esConyuge,
            esDescendiente: !!p.esDescendiente
        })),
        [parentescos]
    );

    const guardarLista = (lista) => actualizarSeccion('nucleoFamiliar', { familiares: lista });

    const agregar = () => {
        guardarLista([...familiares, familiarVacio()]);
    };

    const eliminar = (id) => {
        guardarLista(familiares.filter((f) => f.id !== id));
    };

    // Cambiar el parentesco puede obligar a mover el sexo (Madre siempre F,
    // Padre siempre M) y puede obligar a cambiar HIJO<->HIJA.
    const cambiarParentesco = (id, idParentesco) => {
        const elegido = catalogo.find((p) => p.id === Number(idParentesco));
        guardarLista(
            familiares.map((f) => {
                if (f.id !== id) return f;
                const sexoImpuesto = sexoSegunParentesco(elegido, sexoEmpleado);
                let actualizado = {
                    ...f,
                    idParentesco: idParentesco || '',
                    sexo: sexoImpuesto || f.sexo
                };
                // Al dejar de ser conyuge se limpian los campos que solo aplican a ese caso.
                if (!elegido?.esConyuge) {
                    actualizado = { ...actualizado, tipoUnion: '', observaciones: '', fechaInicio: '', fechaFin: '' };
                }
                return ajustadoDescendiente(actualizado, catalogo);
            })
        );
    };

    const cambiarCampo = (id, campo, valor) => {
        guardarLista(
            familiares.map((f) => {
                if (f.id !== id) return f;
                let actualizado = { ...f, [campo]: valor };
                // El sexo determina HIJO o HIJA dentro del catalogo.
                if (campo === 'sexo') {
                    actualizado = ajustadoDescendiente(actualizado, catalogo);
                }
                return actualizado;
            })
        );
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 2 }}>
                <Box>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                        NÚCLEO FAMILIAR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Elija el tipo de parentesco y complete los datos. Al elegir cónyuge se
                        habilitan las opciones de la unión.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={agregar}>
                    AGREGAR FAMILIAR
                </Button>
            </Box>

            {familiares.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: 'center', mt: 2 }}>
                    <PersonIcon sx={{ color: 'text.disabled', fontSize: 40, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        No hay familiares registrados.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Use “AGREGAR FAMILIAR” para incluir madre, padre, cónyuge o hijos.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {familiares.map((f, indice) => {
                        const parentesco = catalogo.find((p) => p.id === Number(f.idParentesco));
                        const esConyuge = !!parentesco?.esConyuge;

                        return (
                            <Accordion
                                key={f.id}
                                defaultExpanded={familiares.length === 1}
                                disableGutters
                                sx={{ mb: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '8px !important', '&:before': { display: 'none' } }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', flexWrap: 'wrap' }}>
                                        <Chip
                                            size="small"
                                            color={parentesco ? 'primary' : 'default'}
                                            label={parentesco?.nombre || 'SIN PARENTESCO'}
                                        />
                                        <Typography variant="body2" fontWeight={600}>
                                            {resumir(f)}
                                        </Typography>
                                        {esConyuge && f.tipoUnion && (
                                            <Chip size="small" variant="outlined" label={f.tipoUnion} />
                                        )}
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            #{indice + 1}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails sx={{ pt: 0 }}>
                                    <Grid container spacing={2}>
                                        <Campo
                                            label="Tipo de parentesco"
                                            required
                                            select
                                            value={f.idParentesco || ''}
                                            onChange={(e) => cambiarParentesco(f.id, e.target.value)}
                                            disabled={loading}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione…</em>
                                            </MenuItem>
                                            {catalogo.map((p) => (
                                                <MenuItem key={p.id} value={p.id}>
                                                    {p.nombre}
                                                </MenuItem>
                                            ))}
                                        </Campo>

                                        <Campo label="P. Nombre" value={f.pnombre} onChange={(v) => cambiarCampo(f.id, 'pnombre', v)} />
                                        <Campo label="S. Nombre" value={f.snombre} onChange={(v) => cambiarCampo(f.id, 'snombre', v)} />
                                        <Campo label="P. Apellido" value={f.papellido} onChange={(v) => cambiarCampo(f.id, 'papellido', v)} />
                                        <Campo label="S. Apellido" value={f.sapellido} onChange={(v) => cambiarCampo(f.id, 'sapellido', v)} />
                                        <Campo label="N° Cédula" value={f.cedula} onChange={(v) => cambiarCampo(f.id, 'cedula', v)} />
                                        <Campo
                                            label="Sexo"
                                            select
                                            value={f.sexo || ''}
                                            onChange={(v) => cambiarCampo(f.id, 'sexo', v)}
                                        >
                                            <MenuItem value=""><em>Seleccione…</em></MenuItem>
                                            <MenuItem value="M">Masculino</MenuItem>
                                            <MenuItem value="F">Femenino</MenuItem>
                                        </Campo>
                                        <Campo
                                            label="Fecha de Nacimiento"
                                            type="date"
                                            value={f.fechaNacimiento}
                                            onChange={(v) => cambiarCampo(f.id, 'fechaNacimiento', v)}
                                        />
                                    </Grid>

                                    {esConyuge && (
                                        <>
                                            <Divider sx={{ my: 2 }}>
                                                <Chip size="small" label="OPCIONES DEL CÓNYUGE" />
                                            </Divider>
                                            <Grid container spacing={2}>
                                                <Campo
                                                    label="Tipo de Unión"
                                                    select
                                                    value={f.tipoUnion || ''}
                                                    onChange={(v) => cambiarCampo(f.id, 'tipoUnion', v)}
                                                >
                                                    <MenuItem value=""><em>Seleccione…</em></MenuItem>
                                                    {tiposUnion.map((t) => (
                                                        <MenuItem key={t.id} value={t.nombre}>
                                                            {t.nombre}
                                                        </MenuItem>
                                                    ))}
                                                </Campo>
                                                <Campo
                                                    label="Fecha de Inicio"
                                                    type="date"
                                                    value={f.fechaInicio}
                                                    onChange={(v) => cambiarCampo(f.id, 'fechaInicio', v)}
                                                />
                                                <Campo
                                                    label="Observaciones"
                                                    value={f.observaciones}
                                                    onChange={(v) => cambiarCampo(f.id, 'observaciones', v)}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Tooltip title="Quitar este familiar del expediente">
                                            <IconButton color="error" onClick={() => eliminar(f.id)}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}

import { useContext, useMemo, useState } from 'react';
import {
    Box, Grid, Typography, Paper, Button, Chip, IconButton, Tooltip,
    Divider, Accordion, AccordionSummary, AccordionDetails, Card, CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import { ExpedienteContext } from './../../context/ExpedienteContext';
import { useSelectParentesco } from './../../hooks/Select/useSelectParentesco';
import ModalFamiliar from './ModalFamiliar';

// Resumen de una linea para la cabecera del acordeon
const resumir = (f) => {
    const nombre = [f.pnombre, f.snombre, f.papellido, f.sapellido]
        .filter(Boolean)
        .join(' ')
        .trim();
    return nombre || 'Familiar sin nombre';
};

export default function TabNucleofamiliar() {
    const { expediente, actualizarSeccion } = useContext(ExpedienteContext);
    const { parentescos, tiposUnion, loading } = useSelectParentesco();

    const nucleo = expediente.nucleoFamiliar || {};
    const familiares = nucleo.familiares || [];
    const sexoEmpleado = expediente.persona?.sexo;

    // Modal state
    const [modalAbierto, setModalAbierto] = useState(false);
    const [familiarEditando, setFamiliarEditando] = useState(null);

    // Catalogo normalizado
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

    const abrirModalNuevo = () => {
        setFamiliarEditando(null);
        setModalAbierto(true);
    };

    const abrirModalEditar = (f) => {
        setFamiliarEditando(f);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setFamiliarEditando(null);
    };

    const confirmarModal = (datos) => {
        if (familiarEditando) {
            // Edición: reemplaza el familiar
            guardarLista(familiares.map(f => f.id === familiarEditando.id ? { ...f, ...datos, id: f.id } : f));
        } else {
            // Alta: añade con id temporal
            guardarLista([...familiares, { ...datos, id: Date.now() }]);
        }
        cerrarModal();
    };

    const eliminar = (id) => {
        guardarLista(familiares.filter((f) => f.id !== id));
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
                <Button variant="outlined" startIcon={<AddIcon />} onClick={abrirModalNuevo} disabled={loading}>
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
                        Use "AGREGAR FAMILIAR" para incluir madre, padre, cónyuge o hijos.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {familiares.map((f, indice) => {
                        const parentesco = catalogo.find((p) => p.id === Number(f.idParentesco));
                        const esConyuge = !!parentesco?.esConyuge;

                        return (
                            <Card key={f.id} sx={{ mb: 1.5, border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ pb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
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

                                    <Grid container spacing={1} sx={{ mb: 1 }}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Cédula</Typography>
                                            <Typography variant="body2">{f.cedula || '—'}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Sexo</Typography>
                                            <Typography variant="body2">{f.sexo === 'M' ? 'Masculino' : f.sexo === 'F' ? 'Femenino' : '—'}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Nacimiento</Typography>
                                            <Typography variant="body2">{f.fechaNacimiento || '—'}</Typography>
                                        </Grid>
                                        {esConyuge && f.tipoUnion && (
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="caption" color="text.secondary">Unión</Typography>
                                                <Typography variant="body2">{f.tipoUnion}</Typography>
                                            </Grid>
                                        )}
                                    </Grid>

                                    {esConyuge && f.observaciones && (
                                        <Typography variant="caption" color="text.secondary">
                                            Obs.: {f.observaciones}
                                        </Typography>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" onClick={() => abrirModalEditar(f)} disabled={loading}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" color="error" onClick={() => eliminar(f.id)}>
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
            )}

            <ModalFamiliar
                open={modalAbierto}
                onClose={cerrarModal}
                catalogo={catalogo}
                tiposUnion={tiposUnion}
                sexoEmpleado={sexoEmpleado}
                familiar={familiarEditando}
                onConfirmar={confirmarModal}
            />
        </Box>
    );
}
import { useState, useEffect } from 'react';
import { Box, Typography, Divider, Avatar, Chip } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import WorkIcon from '@mui/icons-material/Work';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockResetIcon from '@mui/icons-material/LockReset';
// servicios
import { useNotificacionContext } from '../../../../providers/Notificacion/useNotificacionContext';
import { useBusquedaContext } from '../../../../providers/BusquedaUsers/useBusquedaContext';
import { usePerfil } from '../../hooks/usePerfil';
import { usePermisosContext } from '../../../../providers/Permisos/usePermisoContext';
import { useRol } from '../../hooks/useRol';
import { useUsuarios } from '../../hooks/useUsuarios';
import Confirm from '../../../../shared/components/Confirm';
import CardRol from './CardRol';
import CardCuenta from './CardCuenta';
import CardReestablecer from './CardReestablecer';

const obtenerEstado = (estado) => {
    switch (estado) {
        case 1:
            return <Chip label="Activo" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
        case 2:
            return <Chip label="Inactivo" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
        case 3:
            return <Chip label="Expirado" color="warning" size="small" sx={{ fontWeight: 'bold' }} />;
        default:
            return <Chip label="Desconocido" size="small" />;
    }
};

const getIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const estilosAcordeon = {
    mb: 2,
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider',
    '&:before': { display: 'none' },
};

const tituloSeccion = (estilos) => ({
    fontWeight: 700,
    color: 'text.primary',
    ...(estilos || {})
});

function CardUsuario({ actualizar }) {
    // Funciones para manejo de fechas
    const { permisosHook } = usePermisosContext();
    const { actualizarRol } = useRol();
    const { idSeleccionado } = useBusquedaContext();
    const { perfil, reload } = usePerfil(idSeleccionado);
    const { ActualizarEstado } = useUsuarios();
    const { mostrarNotificacion } = useNotificacionContext();

    // datos para las cajas de selecciones
    const [rol, setRol] = useState("");
    const [EstadoComp, setEstadoComp] = useState();
    const [dialogo, setDialogo] = useState(null);

    // Acordeón: solo una sección abierta a la vez
    const [expanded, setExpanded] = useState('info');
    const handleToggle = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Funciones para abrir los diálogos de confirmación
    const abrirConfirmRol = () => setDialogo("confirmRol");
    const abrirConfirmDes = () => setDialogo("confirmDesactivar");
    const abrirReestrablecerContra = () => setDialogo("reestrablecerContra");
    const cerrar = () => setDialogo(null);

    useEffect(() => {
        const cargarEstado = () => {
            setEstadoComp(perfil.usuario?.estado);
        };
        cargarEstado();

    }, [perfil.usuario?.estado]);

    const handleConfirmarRol = async () => {
        try {
            await actualizarRol(perfil.usuario?.id, rol);
            mostrarNotificacion({ message: "Rol actualizado correctamente", severity: "success" });
            await permisosHook.refetch();
        } catch {
            mostrarNotificacion({
                message: "Error al actualizar el rol",
                severity: "error",
            });
        }
        cerrar();
    };

    const handleActEstado = async () => {
        try {
            await ActualizarEstado(perfil.usuario?.id, perfil.usuario?.estado);
            const esActivacion = perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3;
            mostrarNotificacion({
                message: esActivacion ? "Usuario activado correctamente" : "Usuario deshabilitado correctamente",
                severity: "success"
            });

            await permisosHook.refetch();
            setEstadoComp(esActivacion ? 1 : 3);
            await reload();
            await actualizar();
        } catch (error) {
            mostrarNotificacion({ message: error.message ?? "Error al actualizar el estado", severity: "error" });
        }
        cerrar();
    };

    return (

        // Información del Usuario
        <Box sx={{ flexGrow: 1, mb: 1 }}>
            {/* Información del Usuario */}
            <Accordion
                expanded={expanded === 'info'}
                onChange={handleToggle('info')}
                disableGutters
                sx={estilosAcordeon}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    sx={{
                        background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
                        color: '#fff',
                        p: 2.5,
                        '& .MuiAccordionSummary-content': { alignItems: 'center', m: 0 }
                    }}
                >
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            mr: 2.5,
                            bgcolor: '#fff',
                            color: '#1565C0',
                            fontWeight: 700,
                            fontSize: '1.6rem',
                            boxShadow: 3
                        }}
                    >
                        {getIniciales(perfil.usuario?.usuario || perfil.usuario?.propietario)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }} noWrap>
                                {perfil.usuario?.usuario || 'Usuario'}
                            </Typography>
                            {obtenerEstado(EstadoComp)}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }} noWrap>
                            {perfil.usuario?.propietario}
                        </Typography>
                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <strong>Propietario:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {perfil.usuario?.propietario || '—'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FmdGoodIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <strong>Ubicado en:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {perfil.estructura || 'No asignado'}
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Rol */}
            <Accordion
                expanded={expanded === 'rol'}
                onChange={handleToggle('rol')}
                disableGutters
                sx={estilosAcordeon}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 } }}
                >
                    <Box sx={{ width: '4px', height: '20px', backgroundColor: '#1565C0', borderRadius: '2px' }} />
                    <WorkIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" sx={tituloSeccion()}>
                        Rol
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
                    <CardRol abrirConfirmRol={abrirConfirmRol} rol={rol} setRol={setRol} />
                </AccordionDetails>
            </Accordion>

            {/* Cuenta */}
            <Accordion
                expanded={expanded === 'cuenta'}
                onChange={handleToggle('cuenta')}
                disableGutters
                sx={estilosAcordeon}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 } }}
                >
                    <Box sx={{ width: '4px', height: '20px', backgroundColor: '#1565C0', borderRadius: '2px' }} />
                    <AccountBoxIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" sx={tituloSeccion()}>
                        Cuenta
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
                    <CardCuenta perfil={perfil} reload={reload} abrirConfirmDes={abrirConfirmDes} EstadoComp={EstadoComp} />
                </AccordionDetails>
            </Accordion>

            {/* Reestablecer Contraseña */}
            <Accordion
                expanded={expanded === 'reestablecer'}
                onChange={handleToggle('reestablecer')}
                disableGutters
                sx={estilosAcordeon}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 } }}
                >
                    <Box sx={{ width: '4px', height: '20px', backgroundColor: '#1565C0', borderRadius: '2px' }} />
                    <LockResetIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" sx={tituloSeccion()}>
                        Reestablecer Contraseña
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
                    <CardReestablecer perfil={perfil} abrirReestrablecerContra={abrirReestrablecerContra} dialogo={dialogo} cerrar={cerrar} />
                </AccordionDetails>
            </Accordion>

            <Confirm
                open={dialogo === "confirmRol"}
                handleClose={cerrar}
                onConfirm={handleConfirmarRol}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar el rol del usuario? Esta acción no se puede deshacer."
            />
            <Confirm
                open={dialogo === "confirmDesactivar"}
                handleClose={cerrar}
                onConfirm={handleActEstado}
                title="Desactivar Cambios"
                content="¿Esta seguro que desea deshabilitar el usuario?"
            >
                {/* contenido */}
            </Confirm>
        </Box>
    );
}

export default CardUsuario;
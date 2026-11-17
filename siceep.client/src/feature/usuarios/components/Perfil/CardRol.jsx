import { useEffect } from 'react';

import { Box, Stack, Skeleton, Typography } from "@mui/material";
import AppButton from './../../../../shared/components/AppButton';
import WorkIcon from '@mui/icons-material/Work';

import SelectItem from './../../../../shared/components/SelectItem';
import { useSelectRoles } from "./../../hooks/useSelectRoles";
import { usePerfil } from './../../hooks/usePerfil';
import { useBusquedaContext } from './../../../../providers/BusquedaUsers/useBusquedaContext';
import { useAuth } from './../../../../providers/Authenticacion/useAuth';

function CardRol({ abrirConfirmRol, setRol, rol }) {

    const { idSeleccionado } = useBusquedaContext();
    const { perfil } = usePerfil(idSeleccionado);
    // datos para las cajas de selecciones
    const { selRol, loading } = useSelectRoles();

    // El backend no permite cambiar el rol propio: se refleja en la interfaz.
    const { usuario } = useAuth();
    const esUsuarioActual = String(idSeleccionado ?? '') === String(usuario?.idUsuario ?? '');

    useEffect(() => {
        const cargarRol = () => {
            setRol(perfil.usuario?.idRol || "");
        };
        cargarRol();
    }, [perfil.usuario?.idRol, setRol]);

    return (
        <Box>
            {loading ? (
                <Skeleton variant="rounded" height={40} />
            ) : (
                <Stack spacing={2}>
                    <SelectItem
                        value={rol}
                        onChange={(selRol) => {
                            setRol(selRol);
                        }}
                        incluirTodo={false}
                        datos={selRol}
                        titulo=""
                    />
                    <AppButton
                        colorBtn={'primary'}
                        iconBtn={<WorkIcon />}
                        isfullWidth={true}
                        content={"Actualizar Rol"}
                        disabled={esUsuarioActual}
                        onClick={(e) => {
                            // Evitar que el botón mantenga el foco después de hacer clic
                            e.currentTarget.blur();
                            abrirConfirmRol();
                        }}
                    />
                    {esUsuarioActual && (
                        <Typography variant="caption" color="text.secondary">
                            No puedes cambiar tu propio rol. Debe hacerlo otro administrador.
                        </Typography>
                    )}
                </Stack>
            )}
        </Box>
    );
}

export default CardRol;
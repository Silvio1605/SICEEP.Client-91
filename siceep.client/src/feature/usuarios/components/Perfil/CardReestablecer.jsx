import AppButton from './../../../../shared/components/AppButton';
import CardReestrablecerContra from './../CardReestrablecerContra';
import Box from "@mui/material/Box";

function CardReestablecer({ perfil, abrirReestrablecerContra, dialogo, cerrar }) {
    return (
        <Box>
            <AppButton
                colorBtn={"secondary"}
                isfullWidth={true}
                content={"Reestablecer Contraseña"}
                onClick={(e) => {
                    // Evitar que el botón mantenga el foco después de hacer clic
                    e.currentTarget.blur();
                    abrirReestrablecerContra();
                }}
            >
            </AppButton>

            <CardReestrablecerContra
                open={dialogo === "reestrablecerContra"}
                onClose={cerrar}
                id={perfil.usuario?.id}
            />
        </Box>
    );
}

export default CardReestablecer;

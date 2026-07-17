import CardSeleccionar from "../../feature/ubicacion/components/cardSeleccionarUbicacion";
import CardCrear from "../../feature/ubicacion/components/cardCrear";
import CardEstructuraUnidad from "../../feature/ubicacion/components/cardEstructuraUnidad"

export default function ModalManager({
    modal,
    onClose
}) {

    const MODALES = {
        seleccionarUbicacion: CardSeleccionar,
        registrarUbicacion: CardCrear,
        registrarEstUnidad: CardEstructuraUnidad
    };

    const Modal = MODALES[modal.nombre];
    if (!Modal) return null;

    return (
        <Modal
            open
            onClose={onClose}
            {...modal.props}
        />
    );
}
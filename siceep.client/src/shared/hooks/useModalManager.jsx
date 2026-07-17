import { useState } from "react";

export default function useModalManager() {

    const [modalActivo, setModalActivo] = useState(null);
    const [modalData, setModalData] = useState(null);

    const abrirModal = (nombre, data = null) => {
        setModalActivo(nombre);
        setModalData(data);
    };

    const cerrarModal = () => {
        setModalActivo(null);
        setModalData(null);
    };

    const estaAbierto = (nombre) => modalActivo === nombre;

    return {
        modalActivo,
        modalData,
        abrirModal,
        cerrarModal,
        estaAbierto
    };

}

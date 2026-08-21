import { useContext } from 'react';
import ExpedienteContext from '../context/ExpedienteContext';

export const useExpedienteForm = () => {
    const context = useContext(ExpedienteContext);

    if (!context) {
        throw new Error(
            'useExpedienteReg debe usarse dentro de un ExpedienteProvider'
        );
    }

    return context;
};
import { useContext } from 'react';
import ExpedienteContext from './ExpedienteContext';

export const useExpedienteContext = () => {
    const context = useContext(ExpedienteContext);

    if (!context) {
        throw new Error(
            'useExpedienteReg debe usarse dentro de un ExpedienteProvider'
        );
    }

    return context;
};
import { pdf } from '@react-pdf/renderer';
import ConstanciaPDF from '../../expedientes/pdf/ConstanciaPDF';
import ConstanciaBajaPDF from './ConstanciaBajaPDF';
import ConstanciaFamiliarPDF from './ConstanciaFamiliarPDF';
import ConstanciaRecorridoPDF from './ConstanciaRecorridoPDF';

const descargarBlob = (blob, nombreArchivo) => {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
};

const formatearFechaNombre = (valor) => {
    if (!valor) return 'S-F';
    const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return valor;
    return `${match[3]}-${match[2]}-${match[1]}`;
};

const nombreArchivo = (tipo, codigo) =>
    `Constancia_${tipo}_${codigo || '0000'}_${formatearFechaNombre(new Date().toISOString().slice(0, 10))}.pdf`;

export const generarConstanciaGeneralPDF = async (datosExpediente, config) => {
    const blob = await pdf(<ConstanciaPDF datosExpediente={datosExpediente} config={config} />).toBlob();
    descargarBlob(blob, nombreArchivo('Laboral', datosExpediente?.codigo));
};

export const generarConstanciaLaboralURL = async (datosExpediente, config) => {
    const blob = await pdf(<ConstanciaPDF datosExpediente={datosExpediente} config={config} />).toBlob();
    return URL.createObjectURL(blob);
};

export const generarConstanciaSalarialPDF = async (datosExpediente, config) => {
    const blob = await pdf(
        <ConstanciaPDF datosExpediente={datosExpediente} config={{ ...config, mostrarSalario: true }} />
    ).toBlob();
    descargarBlob(blob, nombreArchivo('Salarial', datosExpediente?.codigo));
};

export const generarConstanciaSalarialURL = async (datosExpediente, config) => {
    const blob = await pdf(
        <ConstanciaPDF datosExpediente={datosExpediente} config={{ ...config, mostrarSalario: true }} />
    ).toBlob();
    return URL.createObjectURL(blob);
};

export const generarConstanciaBajaPDF = async (datos, config) => {
    const blob = await pdf(<ConstanciaBajaPDF datos={datos} config={config} />).toBlob();
    descargarBlob(blob, nombreArchivo('Baja', datos?.codigo));
};

export const generarConstanciaBajaURL = async (datos, config) => {
    const blob = await pdf(<ConstanciaBajaPDF datos={datos} config={config} />).toBlob();
    return URL.createObjectURL(blob);
};

export const generarConstanciaFamiliarPDF = async (datosExpediente, config) => {
    const blob = await pdf(<ConstanciaFamiliarPDF datosExpediente={datosExpediente} config={config} />).toBlob();
    descargarBlob(blob, nombreArchivo('Familiar', datosExpediente?.codigo));
};

export const generarConstanciaFamiliarURL = async (datosExpediente, config) => {
    const blob = await pdf(<ConstanciaFamiliarPDF datosExpediente={datosExpediente} config={config} />).toBlob();
    return URL.createObjectURL(blob);
};

export const generarConstanciaRecorridoPDF = async (datosExpediente, historial, config) => {
    const blob = await pdf(
        <ConstanciaRecorridoPDF datosExpediente={datosExpediente} historial={historial} config={config} />
    ).toBlob();
    descargarBlob(blob, nombreArchivo('Recorrido', datosExpediente?.codigo));
};

export const generarConstanciaRecorridoURL = async (datosExpediente, historial, config) => {
    const blob = await pdf(
        <ConstanciaRecorridoPDF datosExpediente={datosExpediente} historial={historial} config={config} />
    ).toBlob();
    return URL.createObjectURL(blob);
};
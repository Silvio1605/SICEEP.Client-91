import { pdf } from '@react-pdf/renderer';
import FuerzaLaboralPDF from './FuerzaLaboralPDF';
import AltasBajasPDF from './AltasBajasPDF';

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

const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const mesesTexto = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const generarFuerzaLaboralPDF = async (datos) => {
    const blob = await pdf(<FuerzaLaboralPDF datos={datos} />).toBlob();
    descargarBlob(blob, `Fuerza_Laboral_${formatearFechaNombre(datos?.fechaGeneracion)}.pdf`);
};

export const generarAltasBajasPDF = async (datos) => {
    const blob = await pdf(<AltasBajasPDF datos={datos} />).toBlob();
    descargarBlob(blob, `Altas_Bajas_${meses[datos?.mes - 1] || 'MM'}_${datos?.anio || 'AAAA'}.pdf`);
};

export const nombreMes = (mes) => mesesTexto[(mes ?? 1) - 1];
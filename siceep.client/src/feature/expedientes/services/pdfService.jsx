import { pdf } from '@react-pdf/renderer';
import FichaExpedientePDF from '../pdf/FichaExpedientePDF';
import ConstanciaPDF from '../pdf/ConstanciaPDF';
import { descargarDocumento } from './expedienteService';

// Tipo de documento FOTO_PERFIL = 1
const TIPO_FOTO_PERFIL = 1;

/**
 * Obtiene la objectURL(nueva) de la foto de perfil del funcionario si existe.
 * El llamador debe revocar la URL con URL.revokeObjectURL cuando ya no se use.
 * @returns {Promise<string|null>}
 */
const obtenerFotoPerfilURL = async (datosExpediente) => {
    const fotoId = (datosExpediente?.documentos || [])
        .filter((d) => d.idTipoDocumento === TIPO_FOTO_PERFIL)
        .sort((a, b) => (b.idDocumento ?? 0) - (a.idDocumento ?? 0))[0]?.idDocumento ?? null;

    if (!fotoId) return null;

    try {
        const res = await descargarDocumento(fotoId);
        if (res?.data) {
            return URL.createObjectURL(res.data);
        }
    } catch {
        // Sin foto no es bloqueante
    }
    return null;
};

/**
 * Genera el blob del PDF de la ficha del expediente electrónico.
 * @param {object} datosExpediente - ExpedienteCompletoDto
 * @param {Array} estudios - Estudios por persona (opcional)
 * @param {object} opciones - { personal, familiar, laboral, academica, todo }
 * @param {string|null} fotoSrc - objectURL de la foto (opcional)
 * @returns {Promise<Blob>}
 */
export const generarFichaExpedienteBlob = async (datosExpediente, estudios, opciones, fotoSrc) => {
    return pdf(
        <FichaExpedientePDF datosExpediente={datosExpediente} estudios={estudios} opciones={opciones} fotoSrc={fotoSrc} />
    ).toBlob();
};

/**
 * Genera el PDF de la ficha y devuelve la objectURL para vista previa.
 * Obtiene la foto de perfil de forma automática si está disponible.
 * El llamador es responsable de revocar la URL del objeto (y la de la foto) cuando ya no se use.
 * @returns {Promise<string>} ObjectURL del PDF
 */
export const generarFichaExpedienteURL = async (datosExpediente, estudios, opciones, fotoSrc) => {
    const blob = await generarFichaExpedienteBlob(datosExpediente, estudios, opciones, fotoSrc);
    return URL.createObjectURL(blob);
};

/**
 * Genera y descarga el PDF de la ficha del expediente electrónico directamente.
 */
export const generarFichaExpedientePDF = async (datosExpediente, estudios, opciones, fotoSrc) => {
    const url = await generarFichaExpedienteURL(datosExpediente, estudios, opciones, fotoSrc);
    const numero = datosExpediente?.numeroExpediente || 'sin-numero';

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Ficha-Expediente-${numero}.pdf`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
};

// ============================ CONSTANCIA ============================

/**
 * Genera el blob del PDF de la constancia laboral del funcionario.
 * @param {object} datosExpediente - ExpedienteCompletoDto
 * @param {object} config - { firmanteNombre, firmanteCargo, firmanteTitulo, ciudad, numeroDocumento }
 * @returns {Promise<Blob>}
 */
export const generarConstanciaBlob = async (datosExpediente, config) => {
    return pdf(
        <ConstanciaPDF datosExpediente={datosExpediente} config={config} />
    ).toBlob();
};

/**
 * Genera el PDF de la constancia y devuelve su objectURL para vista previa.
 * El llamador es responsable de revocar la URL con URL.revokeObjectURL.
 * @returns {Promise<string>} ObjectURL del PDF
 */
export const generarConstanciaURL = async (datosExpediente, config) => {
    const blob = await generarConstanciaBlob(datosExpediente, config);
    return URL.createObjectURL(blob);
};

/**
 * Genera y descarga el PDF de la constancia directamente.
 */
export const generarConstanciaPDF = async (datosExpediente, config) => {
    const url = await generarConstanciaURL(datosExpediente, config);
    const nombre = datosExpediente?.persona?.papellido || 'funcionario';

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Constancia-${nombre}.pdf`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
};

export { obtenerFotoPerfilURL };

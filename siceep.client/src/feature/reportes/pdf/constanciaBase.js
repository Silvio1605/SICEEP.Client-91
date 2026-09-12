import {
    Font,
    StyleSheet,
} from '@react-pdf/renderer';

// Fuente con cursiva (Tinos) para el lema, igual que la constancia general
Font.register({
    family: 'Times Italic',
    src: '/fonts/Tinos-Italic.ttf',
});

export const estilos = StyleSheet.create({
    page: {
        fontFamily: 'Times-Roman',
        paddingHorizontal: 45,
        paddingTop: 35,
        paddingBottom: 60,
        fontSize: 11,
        lineHeight: 1.35,
        color: '#000',
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 10,
        marginBottom: 24,
        textAlign: 'center',
    },
    headerPais: {
        fontFamily: 'Times-Roman',
        fontSize: 12,
    },
    headerInstitucion: {
        fontFamily: 'Times-Bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    headerDivision: {
        fontFamily: 'Times-Bold',
        fontSize: 13,
    },
    headerTitulo: {
        fontFamily: 'Times-Bold',
        fontSize: 22,
        textDecoration: 'underline',
        marginTop: 12,
        letterSpacing: 5,
    },
    lema: {
        fontFamily: 'Times Italic',
        fontSize: 10,
        marginTop: 6,
    },
    cuerpo: {
        marginBottom: 8,
        fontSize: 11.5,
        textAlign: 'justify',
    },
    cuerpoCentro: {
        textAlign: 'center',
    },
    nombreNegrita: {
        fontFamily: 'Times-Bold',
        fontSize: 12,
        textTransform: 'uppercase',
        marginVertical: 8,
        textAlign: 'center',
    },
    tabla: {
        marginTop: 12,
        marginBottom: 8,
        width: '100%',
    },
    fila: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#999',
        paddingVertical: 6,
    },
    celdaLabel: {
        width: '40%',
        fontFamily: 'Times-Bold',
        fontSize: 11,
        paddingRight: 8,
    },
    celdaValor: {
        width: '60%',
        fontSize: 11,
    },
    filaCabecera: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderTopWidth: 1,
        paddingVertical: 5,
        fontFamily: 'Times-Bold',
        fontSize: 10,
    },
    celdaDesde: { width: '16%' },
    celdaHasta: { width: '16%' },
    celdaCargo: { width: '24%' },
    celdaEstructura: { width: '24%' },
    celdaUnidad: { width: '20%' },
    filaRecorrido: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 4,
        fontSize: 9.5,
    },
    firma: {
        marginTop: 50,
        textAlign: 'center',
    },
    firmaLugar: {
        fontSize: 11,
        marginBottom: 70,
    },
    firmaTitulo: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
    },
    firmaNombre: {
        fontFamily: 'Times-Bold',
        fontSize: 12,
        textTransform: 'uppercase',
        textDecoration: 'underline',
    },
    firmaCargo: {
        fontSize: 11,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 45,
        right: 45,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 8,
        textAlign: 'center',
    },
    footerLema: {
        fontFamily: 'Times-Bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    footerContacto: {
        fontSize: 10,
        marginTop: 2,
    },
});

// Formatea fecha del backend a 'DD-MES-YYYY' (p.ej. 01-JUN-2023)
export const formatearFecha = (valor) => {
    if (!valor) return 'NO DISPONIBLE';
    const texto = String(valor);
    const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return texto;
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const [anio, mes, dia] = [match[1], parseInt(match[2], 10) - 1, match[3]];
    return `${dia}-${meses[mes]}-${anio}`;
};

// Para la columna "Hasta": un recorrido sin fecha de fin es el activo
export const formatearFechaFin = (valor) => (valor ? formatearFecha(valor) : 'ACTUAL');

// Formatea fecha de hoy en español largo: "Managua, lunes uno de enero del dos mil veintiséis"
export const formatearFechaFirma = (ciudad) => {
    const hoy = new Date();
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
        'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete',
        'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'];
    const miles = ['', '', 'dos mil', 'tres mil', 'cuatro mil', 'cinco mil', 'seis mil', 'siete mil', 'ocho mil', 'nueve mil'];
    const anioTexto = (anio) => {
        const mil = Math.floor(anio / 1000);
        const cientos = Math.floor((anio % 1000) / 100);
        const resto = anio % 100;
        let txt = miles[mil] || '';
        if (cientos > 0) {
            const cMap = { 1: 'ciento', 2: 'doscientos', 3: 'trescientos', 4: 'cuatrocientos', 5: 'quinientos', 6: 'seiscientos', 7: 'setecientos', 8: 'ochocientos', 9: 'novecientos' };
            txt += (txt ? ' ' : '') + cMap[cientos];
        }
        if (resto > 0) txt += (txt ? ' ' : '') + unidades[resto];
        return txt || 'cero';
    };

    const dia = hoy.getDate();
    return `${ciudad}, ${dias[hoy.getDay()]} ${unidades[dia]} de ${meses[hoy.getMonth()]} del ${anioTexto(hoy.getFullYear())}.`;
};
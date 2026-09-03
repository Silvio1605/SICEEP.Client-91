import {
    Document,
    Page,
    Text,
    View,
    Font,
    StyleSheet,
} from '@react-pdf/renderer';
import {
    nombreCompletoPersona,
} from '../utils/expedienteMappers';

// Fuentes con cursiva (Tinos) para el lema
Font.register({
    family: 'Times Italic',
    src: '/fonts/Tinos-Italic.ttf',
});

const styles = StyleSheet.create({
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
const formatearFechaIngreso = (valor) => {
    if (!valor) return 'NO DISPONIBLE';
    const texto = String(valor);
    const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return texto;
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const [anio, mes, dia] = [match[1], parseInt(match[2], 10) - 1, match[3]];
    return `${dia}-${meses[mes]}-${anio}`;
};

// Formatea fecha de hoy en español largo: "Managua, lunes uno de enero del dos mil veintiséis"
const formatearFechaFirma = (ciudad) => {
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
    const texto = `${ciudad}, ${dias[hoy.getDay()]} ${unidades[dia]} de ${meses[hoy.getMonth()]} del ${anioTexto(hoy.getFullYear())}.`;
    return texto;
};

export default function ConstanciaPDF({ datosExpediente, config }) {
    const persona = datosExpediente?.persona || {};
    const contrato = datosExpediente?.contrato || {};
    const plaza = datosExpediente?.plaza || {};

    const nombre = nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE';
    const cedula = persona.cedula || 'NO DISPONIBLE';
    const numeroEmpleado = datosExpediente?.codigo || 'NO DISPONIBLE';
    const numInss = datosExpediente?.numInss || contrato?.numInss || 'NO DISPONIBLE';
    const cargo = plaza?.cargo || 'NO DISPONIBLE';
    const ubicacion = plaza?.estructura || 'NO DISPONIBLE';
    const unidad = plaza?.unidad || 'NO DISPONIBLE';
    const fechaIngreso = formatearFechaIngreso(datosExpediente?.fechaIngreso || contrato?.fechaInicio);

    const {
        firmanteNombre = 'NOMBRE DEL JEFE',
        firmanteCargo = 'Jefe de la Oficina de Registro y Control',
        firmanteTitulo = 'Ingeniero',
        ciudad = 'Managua',
        numeroDocumento = 'C-0001',
    } = config || {};

    const fechaFirma = formatearFechaFirma(ciudad);

    return (
        <Document title={`Constancia ${nombre}`}>
            <Page size="LETTER" style={styles.page}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <Text style={styles.headerPais}>República de Nicaragua</Text>
                    <Text style={styles.headerInstitucion}>SEGURANICA S.A.</Text>
                    <Text style={styles.headerDivision}>DIVISIÓN DE PERSONAL</Text>
                    <Text style={styles.headerTitulo}>CONSTANCIA</Text>
                    <Text style={styles.lema}>"Juntos con la Comunidad, Comprometidos con tu Seguridad."</Text>
                </View>

                {/* Cuerpo */}
                <Text style={styles.cuerpo}>
                    El suscrito Responsable de la Oficina de Registro y Control, hace constar que:
                </Text>
                <Text style={styles.nombreNegrita}>{nombre}</Text>
                <Text style={styles.cuerpo}>
                    Es funcionario de esta institución y aparece en nuestro registro con los siguientes datos:
                </Text>

                {/* Tabla de datos */}
                <View style={styles.tabla}>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>No. Cédula:</Text></View>
                        <View style={styles.celdaValor}><Text>{cedula}</Text></View>
                    </View>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>No. Empleado:</Text></View>
                        <View style={styles.celdaValor}><Text>{numeroEmpleado}</Text></View>
                    </View>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>No. INSS:</Text></View>
                        <View style={styles.celdaValor}><Text>{numInss}</Text></View>
                    </View>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>Cargo:</Text></View>
                        <View style={styles.celdaValor}><Text>{cargo}</Text></View>
                    </View>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>Ubicación:</Text></View>
                        <View style={styles.celdaValor}><Text>{ubicacion}</Text></View>
                    </View>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>Unidad Administrativa:</Text></View>
                        <View style={styles.celdaValor}><Text>{unidad}</Text></View>
                    </View>
                    <View style={styles.fila}>
                        <View style={styles.celdaLabel}><Text>Fecha de Ingreso:</Text></View>
                        <View style={styles.celdaValor}><Text>{fechaIngreso}</Text></View>
                    </View>
                </View>

                {/* Firma */}
                <View style={styles.firma}>
                    <Text style={styles.firmaLugar}>{fechaFirma}</Text>
                    <Text style={styles.firmaTitulo}>{firmanteTitulo}</Text>
                    <Text style={styles.firmaNombre}>{firmanteNombre}</Text>
                    <Text style={styles.firmaCargo}>{firmanteCargo}</Text>
                </View>

                {/* Pie */}
                <View style={styles.footer}>
                    <Text style={styles.footerLema}>HONESTIDAD, SEGURIDAD, SERVICIO</Text>
                    <Text style={styles.footerContacto}>
                        SeguraNica S.A. - División de Personal · {numeroDocumento}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}

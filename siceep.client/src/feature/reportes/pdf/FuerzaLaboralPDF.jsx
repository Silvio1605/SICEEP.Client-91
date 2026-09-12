import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const estilos = StyleSheet.create({
    page: {
        fontFamily: 'Times-Roman',
        paddingHorizontal: 40,
        paddingTop: 35,
        paddingBottom: 60,
        fontSize: 10,
        lineHeight: 1.3,
        color: '#000',
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 8,
        marginBottom: 16,
        textAlign: 'center',
    },
    headerPais: { fontSize: 11 },
    headerInstitucion: { fontFamily: 'Times-Bold', fontSize: 16, letterSpacing: 1 },
    headerDivision: { fontFamily: 'Times-Bold', fontSize: 12 },
    headerTitulo: {
        fontFamily: 'Times-Bold',
        fontSize: 15,
        textTransform: 'uppercase',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 4,
    },
    seccion: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
        textTransform: 'uppercase',
        marginTop: 14,
        marginBottom: 6,
    },
    fecha: { textAlign: 'center', fontSize: 10, marginTop: 4 },
    filaEncabezado: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 4, fontFamily: 'Times-Bold' },
    fila: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 3 },
    filaTotal: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 4, fontFamily: 'Times-Bold', marginTop: 2 },
    colNombre: { width: '55%', paddingRight: 6 },
    colNumero: { width: '15%', textAlign: 'center' },
    colSexo: { width: '15%', textAlign: 'center' },
    colTotal: { width: '15%', textAlign: 'center' },
    nota: { fontStyle: 'italic', fontSize: 10, marginTop: 6 },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 6,
        textAlign: 'center',
    },
    footerLema: { fontFamily: 'Times-Bold', fontSize: 11 },
    footerContacto: { fontSize: 9, marginTop: 2 },
});

const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const formatearFecha = (valor) => {
    if (!valor) return 'S/D';
    const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return valor;
    const [anio, mes, dia] = [match[1], parseInt(match[2], 10) - 1, match[3]];
    return `${dia}-${meses[mes]}-${anio}`;
};

export default function FuerzaLaboralPDF({ datos }) {
    const fechaText = `Fuerza Laboral del día: ${formatearFecha(datos?.fechaGeneracion)}`;
    const bajas = datos?.bajasDelDia || [];
    const estructuras = datos?.estructuras || [];

    return (
        <Document title="Informe Diario de Fuerza Laboral por Estructura">
            <Page size="LETTER" style={estilos.page}>
                <View style={estilos.header}>
                    <Text style={estilos.headerPais}>República de Nicaragua</Text>
                    <Text style={estilos.headerInstitucion}>SEGURANICA S.A.</Text>
                    <Text style={estilos.headerDivision}>DIVISIÓN DE PERSONAL</Text>
                </View>
                <Text style={estilos.headerTitulo}>Informe Diario de Fuerza Laboral por Estructura</Text>
                <Text style={estilos.fecha}>{fechaText}</Text>

                <Text style={estilos.seccion}>Personal activo por estructura</Text>
                <View style={estilos.filaEncabezado}>
                    <Text style={estilos.colNombre}>Estructura</Text>
                    <Text style={estilos.colSexo}>Hombres</Text>
                    <Text style={estilos.colSexo}>Mujeres</Text>
                    <Text style={estilos.colTotal}>Total</Text>
                </View>
                {estructuras.map((e, i) => (
                    <View key={i} style={estilos.fila}>
                        <Text style={estilos.colNombre}>{e.estructura}</Text>
                        <Text style={estilos.colSexo}>{e.masculinos}</Text>
                        <Text style={estilos.colSexo}>{e.femeninos}</Text>
                        <Text style={estilos.colTotal}>{e.total}</Text>
                    </View>
                ))}
                <View style={estilos.filaTotal}>
                    <Text style={estilos.colNombre}>TOTAL GENERAL</Text>
                    <Text style={estilos.colSexo}></Text>
                    <Text style={estilos.colSexo}></Text>
                    <Text style={estilos.colTotal}>{datos?.totalGeneral ?? 0}</Text>
                </View>

                <Text style={estilos.seccion}>Bajas registradas durante el día</Text>
                {bajas.length === 0 ? (
                    <Text style={estilos.nota}>Sin novedades de bajas registradas en el día.</Text>
                ) : (
                    <>
                        <View style={estilos.filaEncabezado}>
                            <Text style={estilos.colNombre}>Nombre completo</Text>
                            <Text style={{ width: '45%', textAlign: 'left' }}>Estructura asignada</Text>
                        </View>
                        {bajas.map((b, i) => (
                            <View key={i} style={estilos.fila}>
                                <Text style={estilos.colNombre}>{b.nombreCompleto}</Text>
                                <Text style={{ width: '45%', textAlign: 'left' }}>{b.estructura}</Text>
                            </View>
                        ))}
                    </>
                )}

                <View style={estilos.footer}>
                    <Text style={estilos.footerLema}>HONESTIDAD, SEGURIDAD, SERVICIO</Text>
                    <Text style={estilos.footerContacto}>
                        SeguraNica S.A. - División de Personal · Documento de uso oficial
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
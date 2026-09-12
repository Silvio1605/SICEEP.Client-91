import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const estilos = StyleSheet.create({
    page: {
        fontFamily: 'Times-Roman',
        paddingHorizontal: 36,
        paddingTop: 35,
        paddingBottom: 60,
        fontSize: 9.5,
        lineHeight: 1.3,
        color: '#000',
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 8,
        marginBottom: 14,
        textAlign: 'center',
    },
    headerPais: { fontSize: 11 },
    headerInstitucion: { fontFamily: 'Times-Bold', fontSize: 16, letterSpacing: 1 },
    headerDivision: { fontFamily: 'Times-Bold', fontSize: 12 },
    headerTitulo: {
        fontFamily: 'Times-Bold',
        fontSize: 14,
        textTransform: 'uppercase',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 4,
    },
    periodo: { textAlign: 'center', fontSize: 10, marginTop: 4 },
    seccion: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
        textTransform: 'uppercase',
        marginTop: 12,
        marginBottom: 5,
        backgroundColor: '#e8e8e8',
        padding: 4,
    },
    contador: { fontFamily: 'Times-Roman', fontSize: 9, fontStyle: 'italic' },
    filaEncabezado: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 3.5, fontFamily: 'Times-Bold', fontSize: 9 },
    fila: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 3, fontSize: 9 },
    colCodigo: { width: '10%', textAlign: 'center' },
    colNombre: { width: '25%' },
    colCargo: { width: '20%' },
    colEstructura: { width: '20%' },
    colFecha: { width: '12%', textAlign: 'center' },
    colMotivo: { width: '13%', textAlign: 'center' },
    nota: { fontStyle: 'italic', fontSize: 9 },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 36,
        right: 36,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 6,
        textAlign: 'center',
    },
    footerLema: { fontFamily: 'Times-Bold', fontSize: 11 },
    footerContacto: { fontSize: 9, marginTop: 2 },
});

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const formatearFecha = (valor) => {
    if (!valor) return 'S/D';
    const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return valor;
    return `${match[3]}-${match[2]}-${match[1]}`;
};

export default function AltasBajasPDF({ datos }) {
    const mesesLargo = meses[datos?.mes - 1] || '';
    const periodo = `Período: ${mesesLargo} de ${datos?.anio}`;
    const altas = datos?.altas || [];
    const bajas = datos?.bajas || [];

    return (
        <Document title="Informe Mensual de Altas y Bajas">
            <Page size="LETTER" style={estilos.page}>
                <View style={estilos.header}>
                    <Text style={estilos.headerPais}>República de Nicaragua</Text>
                    <Text style={estilos.headerInstitucion}>SEGURANICA S.A.</Text>
                    <Text style={estilos.headerDivision}>DIVISIÓN DE PERSONAL</Text>
                </View>
                <Text style={estilos.headerTitulo}>Informe Mensual de Altas y Bajas</Text>
                <Text style={estilos.periodo}>{periodo}</Text>

                <View style={estilos.seccion}>
                    <Text>Altas del Mes ({altas.length})</Text>
                </View>
                {altas.length === 0 ? (
                    <Text style={estilos.nota}>No se registraron ingresos en el período seleccionado.</Text>
                ) : (
                    <>
                        <View style={estilos.filaEncabezado}>
                            <Text style={estilos.colCodigo}>Código</Text>
                            <Text style={estilos.colNombre}>Nombre completo</Text>
                            <Text style={estilos.colCargo}>Cargo</Text>
                            <Text style={estilos.colEstructura}>Estructura</Text>
                            <Text style={estilos.colFecha}>Fecha</Text>
                        </View>
                        {altas.map((a, i) => (
                            <View key={i} style={estilos.fila}>
                                <Text style={estilos.colCodigo}>{a.codigo}</Text>
                                <Text style={estilos.colNombre}>{a.nombreCompleto}</Text>
                                <Text style={estilos.colCargo}>{a.cargo}</Text>
                                <Text style={estilos.colEstructura}>{a.estructura}</Text>
                                <Text style={estilos.colFecha}>{formatearFecha(a.fecha)}</Text>
                            </View>
                        ))}
                    </>
                )}

                <View style={estilos.seccion}>
                    <Text>Bajas del Mes ({bajas.length})</Text>
                </View>
                {bajas.length === 0 ? (
                    <Text style={estilos.nota}>No se registraron bajas en el período seleccionado.</Text>
                ) : (
                    <>
                        <View style={estilos.filaEncabezado}>
                            <Text style={estilos.colCodigo}>Código</Text>
                            <Text style={estilos.colNombre}>Nombre completo</Text>
                            <Text style={estilos.colCargo}>Cargo</Text>
                            <Text style={estilos.colEstructura}>Estructura</Text>
                            <Text style={estilos.colFecha}>Fecha</Text>
                            <Text style={estilos.colMotivo}>Motivo</Text>
                        </View>
                        {bajas.map((b, i) => (
                            <View key={i} style={estilos.fila}>
                                <Text style={estilos.colCodigo}>{b.codigo}</Text>
                                <Text style={estilos.colNombre}>{b.nombreCompleto}</Text>
                                <Text style={estilos.colCargo}>{b.cargo}</Text>
                                <Text style={estilos.colEstructura}>{b.estructura}</Text>
                                <Text style={estilos.colFecha}>{formatearFecha(b.fecha)}</Text>
                                <Text style={estilos.colMotivo}>{b.motivo || 'S/D'}</Text>
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
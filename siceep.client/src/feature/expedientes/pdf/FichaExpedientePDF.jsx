import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';
import {
    nombreCompletoPersona,
    formatearFechaLegible,
    calcularEdad,
    nombreSexo,
    nombreEstadoCivil,
    nombreTipoContrato,
} from '../utils/expedienteMappers';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 192,
        paddingBottom: 70,
        fontFamily: 'Helvetica',
    },
    header: {
        position: 'absolute',
        top: 18,
        left: 20,
        right: 20,
        bottom: 30,
        fontSize: 14,
        fontWeight: 'bold',
    },
    content: {
        flexGrow: 1,
    },
    subColumnContainer: {
        flexDirection: 'row',
    },
    subColumn: {
        width: '50%',
    },
    columnIzq: {
        width: '34%',
    },
    columnDer: {
        width: '65%',
    },
    headerLogo: {
        width: '24%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    logoImg: {
        width: 58,
        height: 58,
    },
    headerCentro: {
        width: '100%',
        textAlign: 'center',
    },
    headerDer: {
        width: '26%',
        textAlign: 'right',
    },
    reparacionTxt: {
        textAlign: 'center',
    },
    headerTxt1: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        marginVertical: 1,
    },
    headerTxt2: {
        fontFamily: 'Times-Bold',
        fontSize: 14,
        marginVertical: 1,
    },
    headerTxt3: {
        fontFamily: 'Times-Roman',
        fontSize: 12,
        marginVertical: 1,
    },
    headerDerTxt: {
        fontFamily: 'Times-Roman',
        fontSize: 10,
        marginVertical: 1,
    },
    headerDerTxtBold: {
        fontFamily: 'Times-Bold',
        fontSize: 10,
        marginVertical: 1,
    },
    frase: {
        marginVertical: 4,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#000',
        borderBottomColor: '#000',
        textAlign: 'center',
    },
    fraseTxt: {
        fontFamily: 'Times-Italic',
        fontSize: 12,
        marginVertical: 3,
    },
    filaFicha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
        marginBottom: 2,
    },
    fichaCodigo: {
        width: '20%',
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#800000',
    },
    fichaNum: {
        width: '80%',
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#800000',
        textAlign: 'right',
    },
    tituloFuncionario: {
        textAlign: 'center',
        marginVertical: 4,
        width: '100%',
    },
    tituloFicha: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
    },
    nombreFuncionario: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        marginVertical: 2,
    },
    twoColumns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionDatos: {
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 4,
    },
    filaDato: {
        flexDirection: 'row',
        paddingVertical: 3,
    },
    filaGris: {
        backgroundColor: '#D3D3D3',
    },
    celdaGris: {
        backgroundColor: '#D3D3D3',
        width: '50%',
        padding: 3,
    },
    celdaValor: {
        width: '50%',
        padding: 3,
    },
    labelDato: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
    },
    valorDato: {
        fontSize: 9,
    },
    fotoWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 6,
    },
    foto: {
        width: 110,
        height: 130,
    },
    titleSection: {
        fontSize: 13,
        marginBottom: 2,
        fontFamily: 'Helvetica-Bold',
    },
    section: {
        marginTop: 2,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 2,
        paddingBottom: 6,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 1,
        alignItems: 'center',
        minHeight: 14,
    },
    cellV: {
        fontSize: 9,
        paddingVertical: 1,
    },
    cellLabel: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        paddingVertical: 1,
    },
    w20: { width: '20%' },
    w40: { width: '40%' },
    w30: { width: '30%' },
    w60: { width: '60%' },
    w70: { width: '70%' },
    w15: { width: '15%' },
    w10: { width: '10%' },
    w25: { width: '25%' },
    w35: { width: '35%' },
    w50: { width: '50%' },
    w65: { width: '65%' },
    w45: { width: '45%' },
    w80: { width: '80%' },
    Center: { textAlign: 'center' },
    Right: { textAlign: 'right' },
    table: { display: 'table', width: 'auto', marginVertical: 4 },
    tableRow: { flexDirection: 'row' },
    tableHead: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
    },
    cell: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderStyle: 'solid',
        borderColor: '#b2b1b1',
        borderWidth: 1,
        paddingHorizontal: 3,
        paddingVertical: 2,
        fontSize: 8,
    },
    cellHead: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        borderStyle: 'solid',
        borderColor: '#b2b1b1',
        borderWidth: 1,
        paddingHorizontal: 3,
        paddingVertical: 2,
    },
    separadorHoja: {
        marginTop: 10,
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    tituloDetalle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        marginBottom: 2,
        marginTop: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 12,
        paddingTop: 5,
    },
    footerSection: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 2,
    },
    footerLema: {
        fontFamily: 'Times-Bold',
        fontSize: 14,
        textAlign: 'center',
    },
    footerFila: {
        flexDirection: 'row',
    },
    pagNum: {
        fontSize: 8,
        textAlign: 'right',
        width: '2%',
    },
});

// Utilitario auxiliar: fila de dato con fondo alternado
const FilaDato = ({ etiqueta, valor, gris }) => (
    <View style={[styles.filaDato, gris && styles.filaGris]}>
        <View style={styles.celdaGris}>
            <Text style={styles.labelDato}>{etiqueta}</Text>
        </View>
        <View style={styles.celdaValor}>
            <Text style={styles.valorDato}>{valor || 'NO DISPONIBLE'}</Text>
        </View>
    </View>
);

export default function FichaExpedientePDF({ datosExpediente, estudios, opciones, fotoSrc }) {
    const persona = datosExpediente?.persona || {};
    const contrato = datosExpediente?.contrato || {};
    const plaza = datosExpediente?.plaza || {};
    const contactoEmergencia = datosExpediente?.contactoEmergencia || {};
    const familiares = (datosExpediente?.familiares || []).filter((f) => f && f.activo !== false);

    const incluyeTodo = opciones?.todo;
    const personal = incluyeTodo || opciones?.personal;
    const familiar = incluyeTodo || opciones?.familiar;
    const laboral = incluyeTodo || opciones?.laboral;
    const academica = incluyeTodo || opciones?.academica;

    const nombre = nombreCompletoPersona(persona) || 'NO DISPONIBLE';

    return (
        <Document title={`Ficha Expediente ${datosExpediente?.numeroExpediente || ''}`}>
            <Page size="LETTER" style={styles.page}>
                {/* Header fijo */}
                <View style={styles.header} fixed>
                    <View style={styles.subColumnContainer}>
                        <View style={styles.headerCentro}>
                            <Text style={[styles.headerTxt2]}>SEGURANICA S.A.</Text>
                            <Text style={[styles.headerTxt3]}>DIVISIÓN DE PERSONAL</Text>
                            <Text style={[styles.headerTxt1]}>Ficha General del Funcionario Civil - Expediente Electrónico</Text>
                        </View>
                    </View>
                    <View style={styles.frase}>
                        <Text style={styles.fraseTxt}>{'"Comprometidos con tu Seguridad."'}</Text>
                    </View>
                    {/* Nombre completo en el título */}
                    <View style={styles.tituloFuncionario}>
                        <Text style={styles.tituloFicha}>FICHA GENERAL DEL FUNCIONARIO</Text>
                        <Text style={styles.nombreFuncionario}>{nombre}</Text>
                    </View>
                </View>

                {/* Contenido */}
                <View style={styles.content}>
                    {/* SECCIÓN DE DOS COLUMNAS */}
                    <View style={styles.twoColumns} wrap={false}>
                        {/* Columna Izquierda */}
                        <View style={styles.columnIzq}>
                            {/* Fotografía */}
                            <View style={styles.sectionDatos}>
                                <View style={styles.fotoWrap}>
                                    {fotoSrc ? (
                                        <Image style={styles.foto} src={fotoSrc} />
                                    ) : (
                                        <Text style={[styles.labelDato, styles.Center]}>SIN FOTO</Text>
                                    )}
                                </View>
                            </View>
                            {/* Identificación */}
                            {personal && (
                                <View style={styles.sectionDatos}>
                                    <FilaDato etiqueta="Expediente:" valor={datosExpediente?.numeroExpediente || datosExpediente?.codigo} gris />
                                    <FilaDato etiqueta="Cédula:" valor={persona.cedula} />
                                    <FilaDato etiqueta="N° INSS:" valor={datosExpediente?.numInss || contrato?.numInss} gris />
                                    <FilaDato etiqueta="Estado Civil:" valor={nombreEstadoCivil(persona.idEstadoCivil)} />
                                    <FilaDato etiqueta="Sexo:" valor={nombreSexo(persona.sexo)} gris />
                                    <FilaDato etiqueta="Edad:" valor={calcularEdad(persona.fechaNacimiento) ? `${calcularEdad(persona.fechaNacimiento)} AÑOS` : null} />
                                    <FilaDato etiqueta="Nacimiento:" valor={formatearFechaLegible(persona.fechaNacimiento)} gris />
                                    <FilaDato etiqueta="Lugar Nacimiento:" valor={persona.lugarNacimiento} />
                                    <FilaDato etiqueta="Celular:" valor={persona.celular} gris />
                                    <View style={[styles.filaDato]}>
                                        <View style={styles.celdaGris}><Text style={styles.labelDato}>Dirección:</Text></View>
                                        <View style={[styles.celdaValor, { width: '50%' }]}><Text style={styles.valorDato}>{persona.direccion || 'NO DISPONIBLE'}</Text></View>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Columna Derecha */}
                        <View style={styles.columnDer}>
                            {laboral && (
                                <>
                                    <Text style={[styles.titleSection, styles.Center]}>Datos Laborales</Text>
                                    <View style={styles.section}>
                                        <View style={styles.row}>
                                            <View style={styles.w20}><Text style={styles.cellLabel}>Cargo:</Text></View>
                                            <View style={styles.w80}><Text style={styles.cellV}>{plaza?.cargo || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w20}><Text style={styles.cellLabel}>Categoría:</Text></View>
                                            <View style={styles.w80}><Text style={styles.cellV}>{plaza?.categoria || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w20}><Text style={styles.cellLabel}>Tipo Contrato:</Text></View>
                                            <View style={styles.w80}><Text style={styles.cellV}>{nombreTipoContrato(contrato?.tipoContrato)}</Text></View>
                                        </View>
                                    </View>

                                    <Text style={[styles.titleSection, styles.Center]}>Ubicación</Text>
                                    <View style={styles.section}>
                                        <View style={styles.row}>
                                            <View style={styles.w20}><Text style={styles.cellLabel}>Unidad:</Text></View>
                                            <View style={styles.w80}><Text style={styles.cellV}>{plaza?.unidad || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w20}><Text style={styles.cellLabel}>Estructura:</Text></View>
                                            <View style={styles.w80}><Text style={styles.cellV}>{plaza?.estructura || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w50}>
                                                <View style={styles.row}>
                                                    <View style={styles.w40}><Text style={styles.cellLabel}>Desde:</Text></View>
                                                    <View style={styles.w60}><Text style={styles.cellV}>{formatearFechaLegible(datosExpediente?.fechaIngreso || contrato?.fechaInicio)}</Text></View>
                                                </View>
                                            </View>
                                            <View style={styles.w50}>
                                                <View style={styles.row}>
                                                    <View style={styles.w30}><Text style={styles.cellLabel}>Hasta:</Text></View>
                                                    <View style={styles.w70}><Text style={styles.cellV}>{formatearFechaLegible(contrato?.fechaCese)}</Text></View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={[styles.titleSection, styles.Center]}>Salario</Text>
                                    <View style={styles.section}>
                                        <View style={styles.row}>
                                            <View style={styles.w35}><Text style={styles.cellLabel}>Salario (Plaza):</Text></View>
                                            <View style={styles.w65}><Text style={styles.cellV}>{plaza?.salario ? `C$ ${Number(plaza.salario).toLocaleString()}` : 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w35}><Text style={styles.cellLabel}>Salario (Contrato):</Text></View>
                                            <View style={styles.w65}><Text style={styles.cellV}>{contrato?.salarioMensual ? `C$ ${Number(contrato.salarioMensual).toLocaleString()}` : 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                    </View>
                                </>
                            )}

                            {personal && (
                                <>
                                    <Text style={[styles.titleSection, styles.Center]}>Otros Datos de Interés</Text>
                                    <View style={styles.section}>
                                        <View style={styles.row}>
                                            <View style={styles.w25}><Text style={styles.cellLabel}>Lugar Nacimiento:</Text></View>
                                            <View style={styles.w75}><Text style={styles.cellV}>{persona.lugarNacimiento || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w25}><Text style={styles.cellLabel}>Teléfono:</Text></View>
                                            <View style={styles.w75}><Text style={styles.cellV}>{persona.celular || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w25}><Text style={styles.cellLabel}>Dirección:</Text></View>
                                            <View style={styles.w75}><Text style={styles.cellV}>{persona.direccion || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                    </View>
                                </>
                            )}

                            {contactoEmergencia && (
                                <>
                                    <Text style={[styles.titleSection, styles.Center]}>Contacto de Emergencia</Text>
                                    <View style={styles.section}>
                                        <View style={styles.row}>
                                            <View style={styles.w30}><Text style={styles.cellLabel}>Nombre:</Text></View>
                                            <View style={styles.w70}><Text style={styles.cellV}>{contactoEmergencia?.nombreContacto || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w30}><Text style={styles.cellLabel}>Parentesco:</Text></View>
                                            <View style={styles.w70}><Text style={styles.cellV}>{contactoEmergencia?.parentesco || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.w30}><Text style={styles.cellLabel}>Teléfono:</Text></View>
                                            <View style={styles.w70}><Text style={styles.cellV}>{contactoEmergencia?.telefono || 'NO DISPONIBLE'}</Text></View>
                                        </View>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>

                    {/* SECCIÓNES DE DETALLE (hoja 2+) */}
                    <View style={styles.separadorHoja} />

                    {familiar && familiares.length > 0 && (
                        <View wrap={false}>
                            <Text style={styles.tituloDetalle}>DETALLE NÚCLEO FAMILIAR:</Text>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={styles.w10}><Text style={[styles.cellHead, styles.Center]}>NUM</Text></View>
                                    <View style={styles.w20}><Text style={[styles.cellHead, styles.Center]}>PARENTESCO</Text></View>
                                    <View style={styles.w20}><Text style={[styles.cellHead, styles.Center]}>CEDULA</Text></View>
                                    <View style={styles.w35}><Text style={[styles.cellHead, styles.Center]}>NOMBRE</Text></View>
                                    <View style={styles.w15}><Text style={[styles.cellHead, styles.Center]}>UNIÓN</Text></View>
                                </View>
                                {familiares.map((f, i) => (
                                    <View key={String(f.idRelacion)} style={styles.tableRow}>
                                        <View style={styles.w10}><Text style={[styles.cell, styles.Center]}>{i + 1}</Text></View>
                                        <View style={styles.w20}><Text style={[styles.cell]}>{f.nombreParentesco || 'FAMILIAR'}</Text></View>
                                        <View style={styles.w20}><Text style={[styles.cell]}>{f.persona?.cedula || 'NO DISPONIBLE'}</Text></View>
                                        <View style={styles.w35}><Text style={[styles.cell]}>{nombreCompletoPersona(f.persona)}</Text></View>
                                        <View style={styles.w15}><Text style={[styles.cell, styles.Center]}>{f.tipoUnion || '—'}</Text></View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {academica && (estudios || []).length > 0 && (
                        <View wrap={false}>
                            <Text style={styles.tituloDetalle}>PREPARACIÓN ACADÉMICA:</Text>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={styles.w10}><Text style={[styles.cellHead, styles.Center]}>NUM</Text></View>
                                    <View style={styles.w15}><Text style={[styles.cellHead, styles.Center]}>NIVEL</Text></View>
                                    <View style={styles.w30}><Text style={[styles.cellHead, styles.Center]}>INSTITUCIÓN</Text></View>
                                    <View style={styles.w30}><Text style={[styles.cellHead, styles.Center]}>TÍTULO / MODALIDAD</Text></View>
                                    <View style={styles.w15}><Text style={[styles.cellHead, styles.Center]}>AÑO</Text></View>
                                </View>
                                {estudios.map((e, i) => (
                                    <View key={String(e.idEstudio)} style={styles.tableRow}>
                                        <View style={styles.w10}><Text style={[styles.cell, styles.Center]}>{i + 1}</Text></View>
                                        <View style={styles.w15}><Text style={[styles.cell]}>{e.nivelNombre || e.nombreNivel || '—'}</Text></View>
                                        <View style={styles.w30}><Text style={[styles.cell]}>{e.institucionNombre || '—'}</Text></View>
                                        <View style={styles.w30}><Text style={[styles.cell]}>
                                            {e.tituloObtenido || '—'}{e.modalidadNombre ? ` (${e.modalidadNombre})` : ''}
                                        </Text></View>
                                        <View style={styles.w15}><Text style={[styles.cell, styles.Center]}>{e.anio || (e.fechaFin ? formatearFechaLegible(e.fechaFin) : '—')}</Text></View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Footer fijo */}
                    <View style={styles.footer} fixed>
                        <View style={styles.footerSection}>
                            <Text style={styles.footerLema}>HONESTIDAD, SEGURIDAD, SERVICIO</Text>
                            <Text style={{ fontFamily: 'Times-Roman', fontSize: 10 }}>SeguraNica S.A. - División de Personal</Text>
                            <Text style={{ fontFamily: 'Times-Roman', fontSize: 10 }}>Documento informativo del expediente electrónico.</Text>
                        </View>
                    </View>
                </View>
                <Text fixed style={{ position: 'absolute', bottom: 30, right: 25, fontSize: 8, textAlign: 'right' }} render={({ pageNumber }) => `${pageNumber}`} />
            </Page>
        </Document>
    );
}

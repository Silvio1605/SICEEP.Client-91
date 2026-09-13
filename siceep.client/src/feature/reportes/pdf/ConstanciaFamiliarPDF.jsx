import {
    Document,
    Page,
    Text,
    View,
} from '@react-pdf/renderer';
import {
    nombreCompletoPersona,
} from '../../expedientes/utils/expedienteMappers';
import {
    estilos,
    formatearFecha,
} from './constanciaBase';
import {
    EncabezadoConstancia,
    FirmaConstancia,
    PieConstancia,
} from './ConstanciaComun';

export default function ConstanciaFamiliarPDF({ datosExpediente, config }) {
    const e = datosExpediente || {};
    const persona = e.persona || {};
    const contrato = e.contrato || {};
    const plaza = e.plaza || {};
    const nombre = nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE';
    const familiares = (e.familiares || []).filter((f) => f.activo !== false);

    return (
        <Document title={`Constancia Familiar ${nombre}`}>
            <Page size="LETTER" style={estilos.page}>
                <EncabezadoConstancia titulo="CONSTANCIA FAMILIAR" />

                <Text style={estilos.cuerpo}>
                    El suscrito Responsable de la Oficina de Registro y Control, hace constar que:
                </Text>
                <Text style={estilos.nombreNegrita}>{nombre}</Text>
                <Text style={estilos.cuerpo}>
                    consta en nuestro registro con los siguientes datos y el núcleo familiar que se detalla a
                    continuación:
                </Text>

                {/* Sección 1: Datos del trabajador */}
                <Text style={estilos.cuerpo}><Text style={{ fontFamily: 'Times-Bold' }}>Datos del Trabajador:</Text></Text>
                <View style={estilos.tabla}>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. Cédula:</Text></View>
                        <View style={estilos.celdaValor}><Text>{persona.cedula || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. Empleado:</Text></View>
                        <View style={estilos.celdaValor}><Text>{e.codigo || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. INSS:</Text></View>
                        <View style={estilos.celdaValor}><Text>{e.numInss || contrato?.numInss || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Cargo:</Text></View>
                        <View style={estilos.celdaValor}><Text>{plaza?.cargo || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Estructura:</Text></View>
                        <View style={estilos.celdaValor}><Text>{plaza?.estructura || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Unidad Administrativa:</Text></View>
                        <View style={estilos.celdaValor}><Text>{plaza?.unidad || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Fecha de Ingreso:</Text></View>
                        <View style={estilos.celdaValor}><Text>{formatearFecha(e.fechaIngreso)}</Text></View>
                    </View>
                </View>

                {/* Sección 2: Datos de la familia */}
                <Text style={[estilos.cuerpo, { marginTop: 10 }]}>
                    <Text style={{ fontFamily: 'Times-Bold' }}>Datos de la Familia:</Text>
                </Text>
                {familiares.length === 0 ? (
                    <Text style={estilos.cuerpoCentro}>Sin miembros de familia registrados en el expediente.</Text>
                ) : (
                    <View style={estilos.tabla}>
                        <View style={estilos.filaCabecera}>
                            <Text style={estilos.celdaParentesco}>Parentesco</Text>
                            <Text style={estilos.celdaNombre}>Nombre completo</Text>
                            <Text style={estilos.celdaCedula}>Cédula</Text>
                            <Text style={estilos.celdaNacimiento}>F. Nacimiento</Text>
                            <Text style={estilos.celdaTelefono}>Teléfono</Text>
                        </View>
                        {familiares.map((f, i) => {
                            const pariente = f.persona || {};
                            return (
                                <View key={f.idRelacion ?? i} style={estilos.filaRecorrido}>
                                    <Text style={estilos.celdaParentesco}>{f.nombreParentesco || 'S/D'}</Text>
                                    <Text style={estilos.celdaNombre}>{nombreCompletoPersona(pariente) || 'S/D'}</Text>
                                    <Text style={estilos.celdaCedula}>{pariente.cedula || 'S/D'}</Text>
                                    <Text style={estilos.celdaNacimiento}>{formatearFecha(pariente.fechaNacimiento)}</Text>
                                    <Text style={estilos.celdaTelefono}>{pariente.celular || 'S/D'}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                <FirmaConstancia config={config} />
                <PieConstancia config={config} />
            </Page>
        </Document>
    );
}
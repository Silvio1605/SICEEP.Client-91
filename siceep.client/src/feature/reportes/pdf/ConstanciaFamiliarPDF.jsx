import {
    Document,
    Page,
    Text,
    View,
} from '@react-pdf/renderer';
import {
    nombreCompletoPersona,
    calcularEdad,
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
                <EncabezadoConstancia />

                <Text style={estilos.cuerpo}>
                    El suscrito Responsable de la Oficina de Registro y Control, hace constar que:
                </Text>
                <Text style={estilos.nombreNegrita}>{nombre}</Text>
                <Text style={estilos.cuerpo}>
                    Es funcionario de esta institucion aparece en nuestros registro con los siguientes datos:
                </Text>

                {/* Sección 1: Datos del trabajador */}
                <View style={estilos.tabla}>
                    <View style={estilos.fila}>
                        <View style={estilos.mitadFila}>
                            <View style={estilos.celdaLabelMitad}><Text>Cédula:</Text></View>
                            <View style={estilos.celdaValorMitad}><Text>{persona.cedula || 'NO DISPONIBLE'}</Text></View>
                        </View>
                        <View style={estilos.mitadFila}>
                            <View style={estilos.celdaLabelMitad}><Text>Inss:</Text></View>
                            <View style={estilos.celdaValorMitad}><Text>{e.numInss || contrato?.numInss || 'NO DISPONIBLE'}</Text></View>
                        </View>
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
                        <View style={estilos.celdaLabel}><Text>Fecha de Ingreso:</Text></View>
                        <View style={estilos.celdaValor}><Text>{formatearFecha(e.fechaIngreso)}</Text></View>
                    </View>
                </View>

                {/* Sección 2: Datos de la familia */}
                <Text style={estilos.cuerpo}>
                    Con el objetivo de brindar atención hospitalaria a su nucleo familiar, detallo:
                </Text>
                <Text style={[estilos.cuerpo, { marginTop: 10, fontSize: 10 }]}>
                    <Text style={{ fontFamily: 'Times-Bold' }}>Núcleo Familiar </Text>
                </Text>
                {familiares.length === 0 ? (
                    <Text style={estilos.cuerpoCentro}>Sin miembros de familia registrados en el expediente.</Text>
                ) : (
                    <View style={estilos.tabla}>
                        <View style={[estilos.filaCabecera, { fontSize: 9 }]}>
                            <Text style={estilos.celdaParentesco}>PARENTESCO</Text>
                            <Text style={estilos.celdaIdentificador}>IDENTIFICACION</Text>
                            <Text style={estilos.celdaNombre}>NOMBRE</Text>
                            <Text style={estilos.celdaObservacion}>OBSERVACION</Text>
                        </View>
                        {familiares.map((f, i) => {
                            const pariente = f.persona || {};
                            const esHijo = /hij/i.test(f.nombreParentesco || '');
                            // Hijos se identifican con su fecha de nacimiento; el resto con su cédula
                            const identificador = esHijo
                                ? formatearFecha(pariente.fechaNacimiento)
                                : (pariente.cedula || 'S/D');
                            const edad = calcularEdad(pariente.fechaNacimiento);
                            // En observación: los años de los hijos; el resto queda vacío
                            const observacion = esHijo
                                ? (edad === null ? 'S/D' : `${edad} años`)
                                : '';
                            return (
                                <View key={f.idRelacion ?? i} style={estilos.filaRecorrido}>
                                    <Text style={estilos.celdaParentesco}>{f.nombreParentesco || 'S/D'}</Text>
                                    <Text style={estilos.celdaIdentificador}>{identificador}</Text>
                                    <Text style={estilos.celdaNombre}>{nombreCompletoPersona(pariente) || 'S/D'}</Text>
                                    <Text style={estilos.celdaObservacion}>{observacion}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
                <Text style={estilos.cuerpo}>
                    * Este documento únicamente detalla el núcleo familiar reportado por el funcionario. Las políticas de atención y
                    cobertura son definidas y controladas por el centro médico
                </Text>
                <FirmaConstancia config={config} />
                <PieConstancia config={config} />
            </Page>
        </Document>
    );
}
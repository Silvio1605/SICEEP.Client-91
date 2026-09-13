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
    formatearFechaFin,
} from './constanciaBase';
import {
    EncabezadoConstancia,
    FirmaConstancia,
    PieConstancia,
} from './ConstanciaComun';

export default function ConstanciaRecorridoPDF({ datosExpediente, historial, config }) {
    const e = datosExpediente || {};
    const persona = e.persona || {};
    const contrato = e.contrato || {};
    const plaza = e.plaza || {};
    const nombre = nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE';
    const recorridos = historial || [];

    return (
        <Document title={`Constancia de Recorrido Laboral ${nombre}`}>
            <Page size="LETTER" style={estilos.page}>
                <EncabezadoConstancia titulo="CONSTANCIA DE RECORRIDO LABORAL" />

                <Text style={estilos.cuerpo}>
                    El suscrito Responsable de la Oficina de Registro y Control, hace constar que:
                </Text>
                <Text style={estilos.nombreNegrita}>{nombre}</Text>
                <Text style={estilos.cuerpo}>
                    Es funcionario de esta institución y presenta el siguiente recorrido laboral:
                </Text>

                {/* Datos del funcionario */}
                <Text style={estilos.cuerpo}>
                    <Text style={{ fontFamily: 'Times-Bold' }}>Datos del Funcionario:</Text>
                </Text>
                <View style={estilos.tabla}>
                    <View style={estilos.fila}>
                        <View style={estilos.mitadFila}>
                            <View style={estilos.celdaLabelMitad}><Text>Cédula:</Text></View>
                            <View style={estilos.celdaValorMitad}><Text>{persona.cedula || 'NO DISPONIBLE'}</Text></View>
                        </View>
                        <View style={estilos.mitadFila}>
                            <View style={estilos.celdaLabelMitad}><Text>INSS:</Text></View>
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

                {recorridos.length === 0 ? (
                    <Text style={estilos.cuerpoCentro}>Sin recorrido laboral registrado.</Text>
                ) : (
                    <View style={estilos.tabla}>
                        <View style={estilos.filaCabecera}>
                            <Text style={estilos.celdaDesde}>Desde</Text>
                            <Text style={estilos.celdaHasta}>Hasta</Text>
                            <Text style={estilos.celdaCargo}>Cargo</Text>
                            <Text style={estilos.celdaEstructura}>Estructura</Text>
                            <Text style={estilos.celdaUnidad}>Unidad</Text>
                        </View>
                        {recorridos.map((r, i) => (
                            <View key={r.idRecorrido ?? i} style={estilos.filaRecorrido}>
                                <Text style={estilos.celdaDesde}>{formatearFecha(r.fechaInicio)}</Text>
                                <Text style={estilos.celdaHasta}>{formatearFechaFin(r.fechaFin)}</Text>
                                <Text style={estilos.celdaCargo}>{r.cargo || 'S/D'}</Text>
                                <Text style={estilos.celdaEstructura}>{r.estructura || 'S/D'}</Text>
                                <Text style={estilos.celdaUnidad}>{r.unidad || 'S/D'}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <FirmaConstancia config={config} />
                <PieConstancia config={config} />
            </Page>
        </Document>
    );
}
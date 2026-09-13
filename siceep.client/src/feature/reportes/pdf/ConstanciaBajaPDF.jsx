import {
    Document,
    Page,
    Text,
    View,
} from '@react-pdf/renderer';
import {
    estilos,
    formatearFecha,
    calculoTiempoLaborado,
} from './constanciaBase';
import {
    EncabezadoConstancia,
    FirmaConstancia,
    PieConstancia,
} from './ConstanciaComun';

export default function ConstanciaBajaPDF({ datos, config }) {
    const d = datos || {};
    const nombre = d.nombreCompleto || 'NOMBRE NO DISPONIBLE';
    const salario = Number(d.salarioMensual || 0);

    return (
        <Document title={`Constancia de Baja ${nombre}`}>
            <Page size="LETTER" style={estilos.page}>
                <EncabezadoConstancia titulo="CONSTANCIA DE BAJA" />

                <Text style={estilos.cuerpo}>
                    El suscrito Responsable de la Oficina de Registro y Control, hace constar que:
                </Text>
                <Text style={estilos.nombreNegrita}>{nombre}</Text>
                <Text style={estilos.cuerpo}>
                    consta en nuestro registro con los datos siguientes y causó baja de esta institución
                    según el detalle que se muestra a continuación:
                </Text>

                {/* Sección 1: Datos del funcionario */}
                <Text style={estilos.cuerpo}>
                    <Text style={{ fontFamily: 'Times-Bold' }}>Datos del Funcionario:</Text>
                </Text>
                <View style={estilos.tabla}>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. Cédula:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.cedula || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. Empleado:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.codigo || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>No. INSS:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.numInss || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Cargo:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.cargo || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Ubicación:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.estructura || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Unidad Administrativa:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.unidad || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Salario Mensual:</Text></View>
                        <View style={estilos.celdaValor}>
                            <Text>C$ {salario.toLocaleString('es-NI', { maximumFractionDigits: 2 })}</Text>
                        </View>
                    </View>
                </View>

                {/* Sección 2: Datos de la baja */}
                <Text style={[estilos.cuerpo, { marginTop: 10 }]}>
                    <Text style={{ fontFamily: 'Times-Bold' }}>Datos de la Baja:</Text>
                </Text>
                <View style={estilos.tabla}>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Fecha de Ingreso:</Text></View>
                        <View style={estilos.celdaValor}><Text>{formatearFecha(d.fechaIngreso)}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Fecha de Baja:</Text></View>
                        <View style={estilos.celdaValor}><Text>{formatearFecha(d.fechaBaja)}</Text></View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Tiempo Laborado:</Text></View>
                        <View style={estilos.celdaValor}>
                            <Text>{calculoTiempoLaborado(d.fechaIngreso, d.fechaBaja)}</Text>
                        </View>
                    </View>
                    <View style={estilos.fila}>
                        <View style={estilos.celdaLabel}><Text>Tipo de Baja:</Text></View>
                        <View style={estilos.celdaValor}><Text>{d.motivo || 'NO DISPONIBLE'}</Text></View>
                    </View>
                    {d.observacion && (
                        <View style={estilos.fila}>
                            <View style={estilos.celdaLabel}><Text>Observaciones:</Text></View>
                            <View style={estilos.celdaValor}><Text>{d.observacion}</Text></View>
                        </View>
                    )}
                </View>

                <FirmaConstancia config={config} />
                <PieConstancia config={config} />
            </Page>
        </Document>
    );
}